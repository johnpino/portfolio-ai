import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@contentful/node-apps-toolkit';
import { chunkEntry } from '@/lib/rag';
import { getEntryById } from '@/lib/contentful';
import { deleteChunksForEntry, upsertVectors } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/openai';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const headers = Object.fromEntries(req.headers.entries());
        const secret = process.env.CONTENTFUL_WEBHOOK_SECRET!;

        try {
            const canonicalRequest = {
                path: '/api/webhooks/contentful',
                headers: headers,
                method: req.method as 'POST',
                body: rawBody,
            };
            if (!verifyRequest(secret, canonicalRequest)) {
                console.error('Invalid Contentful Webhook Secret');
                return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
            }
        } catch (e) {
            console.warn('Webhook verification failed:', e);
            return NextResponse.json({ message: 'Validation failed' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const entryId = body.id || body.sys?.id;

        if (!entryId) {
            return NextResponse.json({ message: 'Missing entry ID' }, { status: 400 });
        }

        const action = headers['x-contentful-topic'] || 'ContentManagement.Entry.publish';
        console.log(`Webhook Event: ${action} for ${entryId}`);

        // Handle DELETE
        if (action === 'ContentManagement.Entry.delete' || action === 'ContentManagement.Entry.unpublish') {
            await deleteChunksForEntry(entryId);
            return NextResponse.json({ success: true, action: 'deleted' });
        }

        // Handle PUBLISH / AUTO_SAVE
        // 1. Fetch full entry
        let entry;
        try {
            entry = await getEntryById(entryId);
        } catch (err) {
            console.error(`Failed to fetch entry ${entryId}:`, err);
            return NextResponse.json({ message: 'Entry not found in Contentful' }, { status: 404 });
        }

        // 2. Chunking
        const chunks = chunkEntry(entry as any);
        if (chunks.length === 0) {
            console.warn(`No content chunks generated for ${entryId}`);
            return NextResponse.json({ message: 'No content to index' });
        }

        console.log(`Generated ${chunks.length} chunks for ${entryId}`);

        // 3. Generate Embeddings & Vectors
        const vectors = await Promise.all(chunks.map(async (chunk) => {
            const embedding = await generateEmbedding(chunk.content);

            return {
                id: `${chunk.internalId}#${chunk.chunkIndex}`,
                values: embedding,
                metadata: {
                    ...chunk.metadata,
                    text: chunk.content.substring(0, 200),
                } as any
            };
        }));

        // 4. Update Pinecone (Atomic-ish replace)
        await deleteChunksForEntry(entryId);
        await upsertVectors(vectors);

        console.log(`Successfully indexed ${vectors.length} vectors for ${entryId}`);

        return NextResponse.json({ success: true, chunkCount: vectors.length });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
