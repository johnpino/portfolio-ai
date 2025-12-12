import { Pinecone } from '@pinecone-database/pinecone';
import { generateEmbedding } from './openai';

// Initialize Pinecone
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "dummy-key-for-build",
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || "missing-index-name";

export async function queryProfileData(query: string, topK: number = 3): Promise<any[]> {
    try {
        const index = pinecone.index(INDEX_NAME);
        const vector = await generateEmbedding(query);

        const queryResponse = await index.query({
            vector,
            topK,
            includeMetadata: true,
        });

        // Return the matches directly (id, score, metadata)
        return queryResponse.matches || [];
    } catch (error) {
        console.warn('Pinecone query failed:', error);
        return [];
    }
}
