import React from 'react';
import { Skill } from '@/types/skills';
import { SkillCard } from './SkillCard';
import { CONTENT } from '@/lib/dictionary';

interface SkillsGridProps {
    title?: string;
    skills: Skill[] | any[]; // relaxed type to avoid breaking existing simple strings initially
}



export const SkillsGrid: React.FC<SkillsGridProps> = ({ title = CONTENT.skills.sectionTitle, skills }) => {
    // Guard against mismatching data types during transition or generic errors
    const richSkills = skills.filter(s => typeof s !== 'string') as Skill[];

    if (richSkills.length === 0) {
        return null;
    }

    return (
        <section className="w-full py-24 bg-slate-50 border-y border-slate-100">
            <div className="w-full px-4 max-w-7xl mx-auto">
                {title && (
                    <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center tracking-tight">{title}</h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {richSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                    ))}
                </div>
            </div>
        </section>
    );
};
