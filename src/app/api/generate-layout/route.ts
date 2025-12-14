import { NextResponse } from 'next/server';
import { queryProfileData } from '@/lib/pinecone'; // This returns IDs or matches now? We need to update this lib too.
import { generateLayoutWithContext } from '@/lib/openai';
import { getEntriesByIds } from '@/lib/contentful';

export async function POST(request: Request) {
    let prompt = "";

    try {
        const body = await request.json();
        prompt = body.prompt;
    } catch (e) {
        console.warn("Failed to parse request body", e);
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OpenAI API Key missing" }, { status: 500 });
    }

    try {
        const userQuery = prompt || "Create a comprehensive portfolio layout showcasing my entire professional background, including all my key skills, detailed experience, and major projects. Use a rich variety of blocks.";

        // 1. Retrieve IDs from Pinecone (Vector Search)
        // We need to check if queryProfileData returns IDs or text.
        // Currently it returns text (matches.metadata.text).
        // I need to update lib/pinecone.ts to return IDs!
        // But for now let's assume I fix that next.
        // Let's assume queryVectorIDs(query) returns string[].

        // STOP: I need to update pinecone.ts FIRST to return IDs/Matches, not Strings.
        // But I can write this file assuming the new signature.

        const pineconeMatches = await queryProfileData(userQuery);
        // Note: I will modify 'queryProfileData' to return { id: string, score: number }[] instead of string[]

        // 2. Fetch Content from Contentful (Source of Truth)
        // Extract IDs from matches
        // We must use 'internalId' (clean Contentful ID) not the vector ID (which contains #chunk hash)
        // Also deduplicate, as multiple chunks from same entry might match.

        const rawIds = pineconeMatches.map((m: any) => {
            return m.metadata?.internalId || m.id.split('#')[0];
        });

        const ids = Array.from(new Set(rawIds));

        console.log("Pinecone IDs found (Clean & Unique):", ids);

        // 3. Hydrate with Contentful Data
        const contentfulEntries = await getEntriesByIds(ids);

        // 4. Format Context for AI
        const context = contentfulEntries.map((entry: any) => {
            // Flatten entry fields to a string
            return JSON.stringify(entry.fields);
        });

        console.log(`Hydrated ${context.length} entries from Contentful`);

        // 5. Generate Layout
        const layout = await generateLayoutWithContext(userQuery, context);

        return NextResponse.json(layout);
    } catch (error) {
        console.error("AI Generation Failed:", error);
        return NextResponse.json({ error: "Failed to generate layout" }, { status: 500 });
    }
}
