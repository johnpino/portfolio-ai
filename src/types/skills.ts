export type SkillRole = 'Core Skill' | 'Supporting Skill' | 'Complementary Skill';
export type SkillLevel = 'Expert' | 'Advanced' | 'Comfortable';

export interface Skill {
    id: string;
    name: string;
    role: SkillRole;
    level: SkillLevel;
    since?: string;    // e.g. "2019"
    lastUsed?: string; // e.g. "Currently using"
    tags?: string[];   // e.g. ["Architecture", "SSR"]
    evidence?: string; // Short credible proof point
}
