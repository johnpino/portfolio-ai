import React from 'react';
import { LayoutConfig, BlockType } from '@/types/layout';
import { Hero } from './blocks/Hero';
import { SkillsGrid } from './blocks/SkillsGrid';
import { CaseStudies } from './blocks/CaseStudies';
import { Headline } from './blocks/Headline';
import { SystemMetrics } from './blocks/SystemMetrics';
import { QuickResume } from './blocks/QuickResume';
import { CodeInsight } from './blocks/CodeInsight';
import { ProblemSolution } from './blocks/ProblemSolution';
import { Testimonial } from './blocks/Testimonial';
import { CareerTimeline } from './blocks/CareerTimeline';
import { TechStackEcosystem } from './blocks/TechStackEcosystem';
import { Gallery } from './blocks/Gallery';

// Map string types to actual React components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BLOCK_COMPONENTS: Record<BlockType, React.FC<any>> = {
    'skills-grid': SkillsGrid,
    'case-studies-list': CaseStudies,
    'headline': Headline,
    'system-metrics': SystemMetrics,
    'quick-resume': QuickResume,
    'code-insight': CodeInsight,
    'problem-solution': ProblemSolution,
    'testimonial': Testimonial,
    'career-timeline': CareerTimeline,
    'tech-ecosystem': TechStackEcosystem,
    'gallery': Gallery,
};

interface DynamicLayoutProps {
    layout: LayoutConfig;
}

export const DynamicLayout: React.FC<DynamicLayoutProps> = ({ layout }) => {
    if (!layout?.layout || layout.layout.length === 0) {
        return <div className="p-10 text-center text-slate-500">No layout configuration provided.</div>;
    }

    return (
        <main className="min-h-screen">
            {layout.layout.map((block) => {
                const Component = BLOCK_COMPONENTS[block.type];

                if (!Component) {
                    console.warn(`Unknown block type: ${block.type}`);
                    return null;
                }

                return (
                    <div key={block.id}>
                        <Component {...block.props} />
                    </div>
                );
            })}
        </main>
    );
};
