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

        // 2. Handle Events
        if (eventType === 'ContentManagement.Entry.publish') {
            console.log(`Processing Publish: ${body.sys.id}`);

            // Extract content to embed. 
            // User's webhook example used `body.content`, but Contentful payloads usually have `fields`.
            // We will safeguard this. If fields exist, map them to a string.
            // Or assume the user has a specific 'content' field?
            // "body.content" in the user example implies a flattened payload or specific field.
            // Let's inspect fields.

            // Robust extraction:
            const fields = body.fields || {};
            // Join all localizable text fields (assuming 'en-US' or picking the first locale key)
            // For simplicity, let's JSON stringify the fields or look for 'description'/'body'.
            const contentToEmbed = fields.content?.['en-US'] || fields.description?.['en-US'] || fields.body?.['en-US'] || JSON.stringify(fields);

            if (!contentToEmbed) {
                console.warn("No content to embed for", body.sys.id);
                return NextResponse.json({ message: "No content found" });
            }

            console.log("Generating embedding for:", body.sys.id);
            const openAI = getOpenAI();
            const embedding = await openAI.embeddings.create({
                model: 'text-embedding-3-large',
                input: contentToEmbed,
            });

            await pineconeIndex.upsert([
                {
                    id: body.sys.id, // Contentful Entry ID
                    values: embedding.data[0].embedding,
                    metadata: {
                        // We DON'T store the full text here anymore, per the new plan? 
                        // Actually, the plan said "Refactor route.ts for Pinecone -> Contentful lookup".
                        // So we only need the ID in Pinecone.
                        // But adding some debug metadata is helpful.
                        contentType: body.sys.contentType.sys.id,
                    }
                },
            ]);
            console.log("Upserted to Pinecone");
        }

        if (eventType === 'ContentManagement.Entry.delete') {
            console.log(`Processing Delete: ${body.sys.id}`);
            await pineconeIndex.deleteOne(body.sys.id);
            console.log("Deleted from Pinecone");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
