import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { SearchIntentSchema } from './schemas';
import { SEARCH_INTENT_PROMPT } from './prompts';

const apiKey = process.env.OPENAI_API_KEY || "dummy-key-for-build";
const openai = new OpenAI({
  apiKey: apiKey,
});

// 1. Generate Embedding for RAG
export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: text.replace(/\n/g, ' '),
  });
  return response.data[0].embedding;
}

// 2. System Prompt Context (Defined in prompts.ts)

// 3. Search Intent Detection
export async function detectSearchIntent(userPrompt: string) {
  const response = await openai.responses.parse({
    model: 'gpt-4o-mini',
    input: [
      {
        role: 'system',
        content: SEARCH_INTENT_PROMPT
      },
      { role: 'user', content: userPrompt },
    ],
    text: { format: zodTextFormat(SearchIntentSchema, "search_intent") }
  });

  return response.output_parsed;
}
