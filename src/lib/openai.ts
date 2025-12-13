import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { LayoutConfig } from '@/types/layout';
import { PortfolioLayoutSchema } from './schemas';

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

// 2. System Prompt Context
// Schema is now handled by Zod, simplified prompt.
const SYSTEM_PROMPT = `
    You are an expert Portfolio Designer responsible for creating a personalized portfolio layout JSON.
    
    YOUR GOAL:
    Select the best combination of UI blocks to tell the user's story based on their request and their profile context.

    RULES:
    1. Use the provided "id" fields like "block_1", "block_2" for unique IDs.
    2. CRITICAL: If "NO CONTEXT FOUND" or the provided context does NOT support the user's specific request (e.g. they ask for "Cobol" and you have no Cobol context), DO NOT INVENT SKILLS OR PROJECTS.
    3. Instead, return a layout that explicitly states you have no experience in that area. Use a 'headline' block saying something like "I don't have specific commercial experience with [Topic]." and then show your actual 'quick-resume' or General Skills to be helpful.
    4. Be strictly factual based on the provided context.
    5. User has a static HERO section. DO NOT generate a 'hero' block. Focus on the content below the fold.
    6. IF THE USER SPECIFIES AN ORDER OF BLOCKS, YOU MUST FOLLOW IT EXACTLY. Map their requests to the available schema types (quick-resume, skills-grid, career-timeline, case-studies-list, simple-text-block, etc.).
`;

// 3. Generate Layout
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
    model: 'gpt-5-nano', // Ensuring model supports Structured Outputs
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
    console.error("No layout config and no refusal. Full Response:", JSON.stringify(response, null, 2));
    throw new Error('No structured layout generated');
  }

  return layoutConfig as LayoutConfig;
}
