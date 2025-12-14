import { Pinecone } from '@pinecone-database/pinecone';
import { generateEmbedding } from './openai';

// Initialize Pinecone
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "dummy-key-for-build",
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || "missing-index-name";

export async function queryProfileData(query: string, topK: number = 15, filter?: Record<string, any>): Promise<any[]> {
    try {
        const index = pinecone.index(INDEX_NAME);
        const vector = await generateEmbedding(query);

        const queryResponse = await index.query({
            vector,
            topK,
            filter,
            includeMetadata: true,
        });

        // Return the matches directly (id, score, metadata)
        return queryResponse.matches || [];
    } catch (error) {
        console.warn('Pinecone query failed:', error);
        return [];
    }
}

export async function deleteChunksForEntry(entryId: string) {
    try {
        const index = pinecone.index(INDEX_NAME);
        await index.deleteMany({
            filter: {
                source: { $eq: `contentful:${entryId}` }
            }
        });
        console.log(`Deleted existing chunks for source: contentful:${entryId}`);
    } catch (e) {
        console.error('Error deleting old chunks:', e);
        throw e;
    }
}

export async function upsertVectors(vectors: any[]) {
    try {
        const index = pinecone.index(INDEX_NAME);
        await index.upsert(vectors);
        console.log(`Upserted ${vectors.length} vectors.`);
    } catch (e) {
        console.error('Error upserting vectors:', e);
        throw e;
    }
}
