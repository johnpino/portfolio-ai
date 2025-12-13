import { z } from 'zod';
import { SkillItemSchema } from '@/lib/schemas';

export type Skill = z.infer<typeof SkillItemSchema>;
// Helper types for specific enum usage if needed, though they are now strings in the inferred type unless we extract the enum schema.
// Since z.infer gives valid union types for enums, we can just use indexed access or rely on the main Skill type.
export type SkillRole = Skill['role'];
export type SkillLevel = Skill['level'];
