import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@contentful/node-apps-toolkit';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { chunkEntry } from '@/lib/rag';
import { getEntryById } from '@/lib/contentful';

// Clients
const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const getPinecone = () => new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'portfolio-context';

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
            // Decide if strict mode is required. For now, we return 401.
            return NextResponse.json({ message: 'Validation failed' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const entryId = body.id || body.sys?.id;

        if (!entryId) {
            return NextResponse.json({ message: 'Missing entry ID' }, { status: 400 });
        }

        const action = headers['x-contentful-topic'] || 'ContentManagement.Entry.publish';
        // We assume 'publish' if not specified for easy testing via curl

        const pineconeIndex = getPinecone().index(INDEX_NAME);

        console.log(`Webhook Event: ${action} for ${entryId}`);

        // Handle DELETE
        if (action === 'ContentManagement.Entry.delete' || action === 'ContentManagement.Entry.unpublish') {
            // We need to delete ALL chunks associated with this source
            await deleteChunksForEntry(pineconeIndex, entryId);
            return NextResponse.json({ success: true, action: 'deleted' });
        }

        // Handle PUBLISH / AUTO_SAVE
        // 1. Fetch full entry with resolved links (include: 2)
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

        // 3. Generate Embeddings
        const openAI = getOpenAI();
        const vectors = await Promise.all(chunks.map(async (chunk) => {
            const embeddingResponse = await openAI.embeddings.create({
                model: 'text-embedding-3-large',
                input: chunk.content,
            });

            // Construct Pinecone Vector
            return {
                id: `${chunk.internalId}#${chunk.chunkIndex}`, // Unique Vector ID
                values: embeddingResponse.data[0].embedding,
                metadata: {
                    ...chunk.metadata,
                } as any
            };
        }));

        // 4. Update Pinecone
        // First, delete OLD chunks for this entry to avoid ghosts
        await deleteChunksForEntry(pineconeIndex, entryId);

        // Then Upsert NEW chunks
        // Batch if necessary (Pinecone max is usually 100-200 vectors per call, we likely have few)
        await pineconeIndex.upsert(vectors);

        console.log(`Successfully indexed ${vectors.length} vectors for ${entryId}`);

        return NextResponse.json({ success: true, chunkCount: vectors.length });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// Helper to delete by metadata filter
async function deleteChunksForEntry(index: any, entryId: string) {
    // Pinecone delete by metadata
    try {
        await index.deleteMany({
            source: `contentful:${entryId}`
        });
        console.log(`Deleted existing chunks for source: contentful:${entryId}`);
    } catch (e) {
        console.error('Error deleting old chunks:', e);
        // Don't throw, proceed to upsert? Or strict? 
        // If delete fails, we might have duplicates. 
    }
}
