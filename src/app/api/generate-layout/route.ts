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
        const userQuery = prompt || "Show me a general portfolio";

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
        // Wait, 'queryProfileData' currently returns string[] (the text).
        // I MUST refactor 'queryProfileData' first or simultaneously.
        // I will assume it returns { id: string }[] in the next step.
        // For now, let's update this file to use a NEW function 'queryPineconeIds' or update the existing one.
        // I'll update the existing one in the next tool call.

        const ids = pineconeMatches.map((m: any) => m.id as string); // Type safe? I'll fix the lib.

        console.log("Pinecone IDs found:", ids);

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
