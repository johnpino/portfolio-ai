import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@contentful/node-apps-toolkit';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// Helper to init clients lazily to avoid build-time errors
const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const getPinecone = () => new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'portfolio-context';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const headers = Object.fromEntries(req.headers.entries());
        const secret = process.env.CONTENTFUL_WEBHOOK_SECRET!;

        // 1. Verify Request
        // Note: VerifyRequest expects a specific request shape. 
        // We construct a canonical request object manually to satisfy the library.
        const canonicalRequest = {
            path: '/api/webhooks/contentful', // This might need to match the webhook config exactly
            headers: headers,
            method: req.method as 'POST', // Webhooks are always POST matching the library type
            body: rawBody,
        };

        try {
            if (!verifyRequest(secret, canonicalRequest)) {
                console.error('Invalid Contentful Webhook Secret');
                return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
            }
        } catch (e) {
            // node-apps-toolkit might throw if headers are unusual
            console.error('Validation error:', e);
            // Often validation fails if the path doesn't match exactly what Contentful sent.
            // Proceeding with caution or returning 401. 
            // For now, let's assume if verify fails we stop.
            return NextResponse.json({ message: 'Validation failed' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const eventType = headers['x-contentful-topic'];
        const pineconeIndex = getPinecone().index(INDEX_NAME);

        // 2. Handle Events (or direct simplified calls)
        // Check for simplified payload structure first or flexible extraction
        const entryId = body.sys?.id || body.id;

        if (!entryId) {
            return NextResponse.json({ message: 'Missing entry ID' }, { status: 400 });
        }

        // Determine event type equivalent if not provided in headers (fallback for manual tests)
        // If we received a body with ID and content, treat it as a publish/update.
        const effectiveEventType = eventType || 'ContentManagement.Entry.publish';

        if (effectiveEventType === 'ContentManagement.Entry.publish' || !eventType) {
            console.log(`Processing Publish: ${entryId}`);

            // Content Extraction Strategy
            let contentToEmbed = '';

            if (body.content && typeof body.content === 'string') {
                // Simplified, direct content field
                contentToEmbed = body.content;
            } else if (body.fields) {
                // Standard Contentful payload
                const fields = body.fields;
                contentToEmbed = fields.content?.['en-US'] || fields.description?.['en-US'] || fields.body?.['en-US'] || JSON.stringify(fields);
            }

            if (!contentToEmbed) {
                console.warn("No content to embed for", entryId);
                return NextResponse.json({ message: "No content found" });
            }

            console.log("Generating embedding for:", entryId);
            const openAI = getOpenAI();
            const embedding = await openAI.embeddings.create({
                model: 'text-embedding-3-large',
                input: contentToEmbed,
            });

            const contentTypeId = body.sys?.contentType?.sys?.id || 'manual-entry';

            await pineconeIndex.upsert([
                {
                    id: entryId,
                    values: embedding.data[0].embedding,
                    metadata: {
                        contentType: contentTypeId,
                    }
                },
            ]);
            console.log("Upserted to Pinecone");
        }

        if (effectiveEventType === 'ContentManagement.Entry.delete') {
            console.log(`Processing Delete: ${entryId}`);
            await pineconeIndex.deleteOne(entryId);
            console.log("Deleted from Pinecone");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
