import React from 'react';

interface Skill {
    name: string;
    category?: string;
}

interface SkillsGridProps {
    title?: string;
    skills: Skill[] | string[];
}

export const SkillsGrid: React.FC<SkillsGridProps> = ({ title = "Skills & Technologies", skills }) => {
    const normalizeSkill = (s: Skill | string): Skill =>
        typeof s === 'string' ? { name: s } : s;

    return (
        <section className="w-full py-24 px-4 max-w-6xl mx-auto bg-slate-50 border-y border-slate-100">
            {title && (
                <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center tracking-tight">{title}</h2>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {skills.map((rawSkill, idx) => {
                    const skill = normalizeSkill(rawSkill);
                    return (
                        <div
                            key={idx}
                            className="group p-6 rounded-lg bg-white border border-slate-200 hover:border-accent-pink/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center"
                        >
                            <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-accent-pink transition-colors" />
                            <span className="font-semibold text-slate-700 group-hover:text-slate-900">
                                {skill.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
