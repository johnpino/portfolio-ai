import { NextResponse } from 'next/server';
import { queryProfileData } from '@/lib/pinecone'; // This returns IDs or matches now? We need to update this lib too.
import { generateLayoutWithContext, detectSearchIntent } from '@/lib/openai';
import { getEntriesByIds } from '@/lib/contentful';

import { DEFAULT_LAYOUT_PROMPT } from '@/lib/prompts';

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
        const userQuery = prompt || DEFAULT_LAYOUT_PROMPT;

        // 1. Analyze Intent (LLM)
        const intent = await detectSearchIntent(userQuery);

        if (!intent) {
            console.warn("Intent detection failed, falling back to raw query.");
        }

        const optimizedQuery = intent?.optimizedQuery || userQuery;
        const filters = intent?.filters;
        const topK = intent?.topK;

        console.log("Search Intent:", { optimizedQuery, filters, topK });

        // 2. Retrieve IDs from Pinecone (Vector Search + Filters)
        const pineconeMatches = await queryProfileData(optimizedQuery, topK || 15, filters);

        // 3. Fetch Content from Contentful (Source of Truth)
        // Extract IDs from matches
        // We must use 'internalId' (clean Contentful ID) not the vector ID (which contains #chunk hash)
        // Also deduplicate, as multiple chunks from same entry might match.

        const rawIds = pineconeMatches.map((m: any) => {
            return m.metadata?.internalId || m.id.split('#')[0];
        });

        const ids = Array.from(new Set(rawIds));

        console.log("Pinecone IDs found (Clean & Unique):", ids);

        // 4. Hydrate with Contentful Data
        const contentfulEntries = await getEntriesByIds(ids);

        // 5. Format Context for AI
        const context = contentfulEntries.map((entry: any) => {
            // Flatten entry fields to a string
            return JSON.stringify(entry.fields);
        });

        console.log(`Hydrated ${context.length} entries from Contentful`);

        // 6. Generate Layout
        const layout = await generateLayoutWithContext(userQuery, context);

        return NextResponse.json(layout);
    } catch (error) {
        console.error("AI Generation Failed:", error);
        return NextResponse.json({ error: "Failed to generate layout" }, { status: 500 });
    }
}
