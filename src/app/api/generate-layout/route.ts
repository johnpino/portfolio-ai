import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { queryProfileData } from '@/lib/pinecone';
import { detectSearchIntent, generateEmbedding } from '@/lib/openai';
import { getEntriesByIds } from '@/lib/contentful';
import { LayoutBlockTypeSchema } from '@/lib/schemas';
import { DEFAULT_LAYOUT_PROMPT, SYSTEM_PROMPT } from '@/lib/prompts';



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
function cleanContext(obj: any): any {
    if (!obj) return obj;
    if (Array.isArray(obj)) return obj.map(cleanContext);
    if (typeof obj === 'object') {
        const { sys, metadata, file, ...rest } = obj;
        const cleaned: any = {};
        for (const key in rest) {
            cleaned[key] = cleanContext(rest[key]);
        }
        return cleaned;
    }
    return obj;
}

export async function POST(request: Request) {
    let prompt = "";

    try {
        const body = await request.json();
        prompt = body.prompt;
    } catch (e) {
        console.warn("Failed to parse request body", e);
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
    let filters: Record<string, any> | undefined = undefined;
    if (intent?.filters) {
        const cleanFilters = Object.entries(intent.filters).reduce((acc, [k, v]) => {
            if (v !== null && v !== undefined) {
                if (typeof v === 'string') {
                    acc[k] = (v as string).toLowerCase();
                } else if (typeof v === 'object' && v.$in && Array.isArray(v.$in)) {
                    if (v.$in.length > 0) {
                        acc[k] = { ...v, $in: v.$in.map((item: any) => String(item).toLowerCase()) };
                    }
                } else {
                    acc[k] = v;
                }
            }
            return acc;
        }, {} as Record<string, any>);

        if (Object.keys(cleanFilters).length > 0) {
            filters = cleanFilters;
        }
    }

    const topK = intent?.topK ?? 15;

    // 2. Retrieve IDs from Pinecone (using pre-calculated vector)
    console.time("Pinecone");
    const pineconeMatches = await queryProfileData(optimizedQuery, topK || 15, filters, vector);
    console.timeEnd("Pinecone");
    console.log("Pinecone Matches:", pineconeMatches.length);

    // 3. Fetch Context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawIds = pineconeMatches.map((m: any) => {
        return m.metadata?.internalId || m.id.split('#')[0];
    });
    const ids = Array.from(new Set(rawIds));
    console.log("Unique Pinecone IDs:", ids);

    // 4. Hydrate & Optimize Context
    const contentfulEntries = await getEntriesByIds(ids);
    console.log("Hydrated Contentful IDs:", contentfulEntries.map((e: any) => e.sys?.id));

    // Cleanup context to minimize tokens
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = contentfulEntries.map((entry: any) => {
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
    console.log("Starting streamObject (array mode) with model: gemini-2.0-flash-exp");

    try {
        const result = await streamObject({
            model: google('gemini-2.0-flash-exp'), // Upgrading to faster model if available, or sticking to existing
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
        console.error("API Stream Creation Failed:", err);
        throw err;
    }
}
