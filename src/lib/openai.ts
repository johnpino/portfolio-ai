import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { LayoutConfig } from '@/types/layout';
import { PortfolioLayoutSchema, SearchIntentSchema } from './schemas';
import { SYSTEM_PROMPT, SEARCH_INTENT_PROMPT } from './prompts';

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

// 4. Generate Layout
export async function generateLayoutWithContext(userPrompt: string, context: string[]): Promise<LayoutConfig> {
  const contextString = context.length > 0 ? context.join('\n\n') : "NO CONTEXT FOUND.";
  const finalPrompt = `
    PROFILE CONTEXT (RAG DATA):
    ${contextString}

    USER REQUEST:
    ${userPrompt}
  `;

  // Use Structured Outputs via Zod
  const response = await openai.responses.parse({
    model: 'gpt-5-nano',
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: finalPrompt },
    ],
    text: {
      format: zodTextFormat(PortfolioLayoutSchema, "portfolio_layout"),
    },
    reasoning: {
      effort: "low"
    },
  });

  const layoutConfig = response.output_parsed;

  if ((response as any).refusal) {
    console.error("OpenAI Refusal:", (response as any).refusal);
    throw new Error(`AI Refusal: ${(response as any).refusal}`);
  }

  if (!layoutConfig) {
    throw new Error('No structured layout generated');
  }

  return layoutConfig as LayoutConfig;
}
