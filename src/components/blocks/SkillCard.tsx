import React from 'react';
import { Skill } from '@/types/skills';

// Helper to determine role badge color
const getRoleBadgeStyle = (role: Skill['role']) => {
    switch (role) {
        case 'Core Skill':
            return 'bg-slate-900 text-white border-slate-900';
        case 'Supporting Skill':
            return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'Complementary Skill':
            return 'bg-white text-slate-500 border-slate-200 dashed-border';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};

interface SkillCardProps {
    skill: Skill;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
    return (
        <div className="flex flex-col p-6 bg-white rounded-xl border border-slate-200 hover:border-accent-pink/50 transition-all duration-200 shadow-sm hover:shadow-md h-full">
            {/* Header: Name & Role */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{skill.name}</h3>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${getRoleBadgeStyle(skill.role)}`}>
                    {skill.role.replace(' Skill', '')}
                </span>
            </div>

            {/* Metadata Row: Level | Since | Last Used */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium mb-5 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-1.5" title="Depth of expertise">
                    <div className={`w-1.5 h-1.5 rounded-full ${skill.level === 'Expert' ? 'bg-emerald-500' : 'bg-blue-400'}`} />
                    {skill.level}
                </div>
                <div className="w-px h-3 bg-slate-300" />
                <div>Since {skill.since}</div>
                <div className="w-px h-3 bg-slate-300" />
                <div className={skill.lastUsed.includes('Curr') ? 'text-emerald-600' : ''}>{skill.lastUsed}</div>
            </div>

            {/* Evidence */}
            <div className="mb-6 flex-grow">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    “{skill.evidence}”
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-auto pt-4 md:pt-0">
                {skill.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-1 text-[10px] font-semibold text-slate-500 bg-slate-50 rounded border border-slate-100"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};
