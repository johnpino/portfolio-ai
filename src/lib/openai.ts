import OpenAI from 'openai';
import { LayoutConfig } from '@/types/layout';

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
// We hardcode the block definitions to ensure the AI follows the exact spec.
const BLOCK_DEFINITIONS = `
- hero: { title, subtitle, ctaText, ctaLink }
- headline: { text, size: 'xl' | '2xl', align: 'left' | 'center' }
- quick-resume: { summary, experience: [{ role, company, years, location? }], education? }
- skills-grid: { title, skills: [{ name, role: 'Core Skill' | 'Supporting Skill' | 'Complementary Skill', level: 'Expert' | 'Advanced' | 'Comfortable', evidence?, tags?, since?, lastUsed? }] }
- problem-solution: { problemTitle, problem, solutionTitle, solution }
- testimonial: { quote, author, role, company?, avatar? }
- career-timeline: { items: [{ year, title, company, description }] }
- case-studies-list: { title, projects: [{ title, description, tags, link }] }
- gallery: { images: [{ src, alt, caption? }] }
`;

// 3. Generate Layout
export async function generateLayoutWithContext(userPrompt: string, context: string[]): Promise<LayoutConfig> {
  const systemPrompt = `
    You are an expert Portfolio Designer responsible for creating a personalized portfolio layout JSON.
    
    YOUR GOAL:
    Select the best combination of UI blocks to tell the user's story based on their request and their profile context.
    
    AVAILABLE BLOCKS:
    ${BLOCK_DEFINITIONS}

    PROFILE CONTEXT (RAG DATA):
    ${context.length > 0 ? context.join('\n\n') : "NO CONTEXT FOUND."}

    RULES:
    1. Return ONLY valid JSON matching the exact structure:
       {
         "layout": [
           {
             "id": "unique_id",
             "type": "block_type_name",
             "props": {
               "prop1": "value"
             }
           }
         ]
       }
    2. Do NOT use the block type as a key (e.g. DO NOT return { "hero": {...} }). ALWAYS use { "type": "hero", "props": {...} }.
    3. Do not explain your reasoning. Just return the JSON.
    4. Use "id" fields like "block_1", "block_2", etc.
    5. CRITICAL: If "NO CONTEXT FOUND" or the provided context does NOT support the user's specific request (e.g. they ask for "Cobol" and you have no Cobol context), DO NOT INVENT SKILLS OR PROJECTS.
    6. Instead, return a layout that explicitly states you have no experience in that area. Use a 'headline' block saying something like "I don't have specific commercial experience with [Topic]." and then show your actual 'quick-resume' or General Skills to be helpful.
    7. Be strictly factual based on the provided context.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('No content generated');

  return JSON.parse(content) as LayoutConfig;
}
