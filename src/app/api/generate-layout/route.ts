import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { queryProfileData } from '@/lib/pinecone';
import { detectSearchIntent, generateEmbedding } from '@/lib/openai';
import { getEntriesByIds } from '@/lib/contentful';
import { LayoutBlockTypeSchema } from '@/lib/schemas';
import { DEFAULT_LAYOUT_PROMPT, SYSTEM_PROMPT } from '@/lib/prompts';

const MAX_PROMPT_LENGTH = 800;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitBucket = {
    count: number;
    resetAt: number;
};

type JsonRecord = Record<string, unknown>;

type PineconeFilter = Record<string, unknown>;

type PineconeMatch = {
    id: string;
    metadata?: {
        internalId?: unknown;
    };
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

function jsonError(message: string, status: number) {
    return Response.json({ error: message }, { status });
}

function getClientIp(request: Request) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    return request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(key: string) {
    const now = Date.now();

    for (const [bucketKey, bucket] of rateLimitBuckets) {
        if (bucket.resetAt <= now) {
            rateLimitBuckets.delete(bucketKey);
        }
    }

    const bucket = rateLimitBuckets.get(key);

    if (!bucket) {
        rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    bucket.count += 1;
    return true;
}

function isRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}



/**
 * Generates a portfolio layout based on the user's prompt.
 * 
 * Uses RAG (Pinecone + Contentful) to retrieve context and Vercel AI SDK
 * to stream the layout generation as an array of blocks.
 * 
 * @param request - The incoming HTTP request containing the prompt.
 * @returns A streaming text response containing the generated layout blocks.
 */
// Helper to strip sys/metadata/files to reduce token count
function cleanContext(obj: unknown): unknown {
    if (!obj) return obj;
    if (Array.isArray(obj)) return obj.map(cleanContext);
    if (isRecord(obj)) {
        const rest = { ...obj };
        const cleaned: JsonRecord = {};
        delete rest.sys;
        delete rest.metadata;
        delete rest.file;

        for (const key in rest) {
            cleaned[key] = cleanContext(rest[key]);
        }
        return cleaned;
    }
    return obj;
}

export async function POST(request: Request) {
    const clientIp = getClientIp(request);

    if (!checkRateLimit(clientIp)) {
        return jsonError('Too many requests. Please try again later.', 429);
    }

    let prompt = '';

    try {
        const body: unknown = await request.json();

        if (isRecord(body) && body.prompt !== undefined) {
            if (typeof body.prompt !== 'string') {
                return jsonError('Prompt must be a string.', 400);
            }

            prompt = body.prompt.trim();
        }
    } catch (e) {
        console.warn("Failed to parse request body", e);
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
        return jsonError(`Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.`, 400);
    }

    const userQuery = prompt || DEFAULT_LAYOUT_PROMPT;

    // 1. Parallelize Intent Detection & Embedding Generation
    console.time("AI_Tasks");
    const [intent, vector] = await Promise.all([
        detectSearchIntent(userQuery),
        generateEmbedding(userQuery)
    ]);
    console.timeEnd("AI_Tasks");

    console.log("Detected Intent:", JSON.stringify(intent, null, 2));

    const optimizedQuery = intent?.optimizedQuery || userQuery;

    // Sanitize filters
    let filters: PineconeFilter | undefined = undefined;
    if (intent?.filters) {
        const cleanFilters = Object.entries(intent.filters).reduce<PineconeFilter>((acc, [k, v]) => {
            if (v !== null && v !== undefined) {
                if (isRecord(v) && Array.isArray(v.$in)) {
                    if (v.$in.length > 0) {
                        acc[k] = { ...v, $in: v.$in.map((item) => String(item).toLowerCase()) };
                    }
                } else {
                    acc[k] = v;
                }
            }
            return acc;
        }, {});

        if (Object.keys(cleanFilters).length > 0) {
            filters = cleanFilters;
        }
    }

    const topK = intent?.topK ?? 15;

    // 2. Retrieve IDs from Pinecone (using pre-calculated vector)
    console.time("Pinecone");
    const pineconeMatches = await queryProfileData(optimizedQuery, topK || 15, filters, vector) as PineconeMatch[];
    console.timeEnd("Pinecone");
    console.log("Pinecone Matches:", pineconeMatches.length);

    // 3. Fetch Context
    const rawIds = pineconeMatches.map((m) => {
        return typeof m.metadata?.internalId === 'string' ? m.metadata.internalId : m.id.split('#')[0];
    });
    const ids = Array.from(new Set(rawIds));
    console.log("Unique Pinecone IDs:", ids);

    // 4. Hydrate & Optimize Context
    const contentfulEntries = await getEntriesByIds(ids);
    console.log("Hydrated Contentful IDs:", contentfulEntries.map((e) => e.sys?.id));

    // Cleanup context to minimize tokens
    const context = contentfulEntries.map((entry) => {
        return JSON.stringify(cleanContext(entry.fields));
    });
    console.log("Retrieved Context Items:", context.length);

    const contextString = context.length > 0 ? context.join('\n\n') : "NO CONTEXT FOUND.";
    const finalPrompt = `
    PROFILE CONTEXT (RAG DATA):
    ${contextString}

    USER REQUEST:
    ${userQuery}
  `;

    // 5. Generate Layout (Streaming)
    const modelName = process.env.GOOGLE_GENERATIVE_MODEL || "gemini-2.5-flash";
    console.log(`Starting streamObject (array mode) with model: ${modelName}`);

    try {
        const result = await streamObject({
            model: google(modelName),
            system: SYSTEM_PROMPT + "\n\nCRITICAL SPEED OPTIMIZATION: Keep descriptions concise (max 100 words). Emphasize speed.",
            prompt: finalPrompt + "\n\nReturn the layout as a list of blocks.",
            schema: LayoutBlockTypeSchema,
            output: 'array',
            onFinish: (ev) => {
                console.log("API Stream Finished. Usage:", ev.usage);
            }
        });

        return result.toTextStreamResponse();
    } catch (err) {
        console.error(`API Stream Creation Failed (${modelName}):`, err);
        throw err;
    }
}
