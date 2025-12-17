import React from 'react';
import { motion } from 'framer-motion';
import { useLayoutContext } from '@/context/LayoutContext';
import { LayoutConfig, BlockType } from '@/types/layout';
import { StreamingSkeleton } from './SkeletonLoader';
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
import { SimpleTextBlock } from './blocks/SimpleTextBlock';

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
    'simple-text-block': SimpleTextBlock,
};

interface DynamicLayoutProps {
    layout: LayoutConfig;
}

export const DynamicLayout: React.FC<DynamicLayoutProps> = ({ layout }) => {
    const { isGenerating } = useLayoutContext();

    if (!layout?.layout || layout.layout.length === 0) {
        return null; // Don't show error, just wait for content (SkeletonLoader context typically handles loading state)
    }

    return (
        <main className="flex flex-col gap-24 md:gap-32 pb-24">
            {layout.layout?.map((block, index) => {
                // Determine component
                if (!block?.type) return null;
                const Component = BLOCK_COMPONENTS[block.type];

                if (!Component) {
                    // console.warn(`Unknown block type: ${block.type}`);
                    return null;
                }

                // Safety for streaming: If props aren't ready, don't render yet
                if (!block.props) return null;

                // Use block.id if available, otherwise fallback to index.
                // Using index is safe enough for streaming append-only lists.
                const key = block.id || index;

                return (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full"
                    >
                        <Component {...block.props} />
                    </motion.div>
                );
            })}

            {/* Streaming Skeleton - shown while more content is being generated */}
            {isGenerating && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full"
                >
                    <StreamingSkeleton />
                </motion.div>
            )}
        </main>
    );
};

