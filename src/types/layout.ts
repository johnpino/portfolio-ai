export type BlockType =
    | 'skills-grid'
    | 'case-studies-list'
    | 'headline'
    | 'system-metrics'
    | 'quick-resume'
    | 'code-insight'
    | 'problem-solution'
    | 'testimonial'
    | 'career-timeline'
    | 'tech-ecosystem'
    | 'gallery'
    | 'simple-text-block';

export interface LayoutBlock {
    id: string;
    type: BlockType;
    props: Record<string, unknown>;
}

export interface LayoutConfig {
    layout: LayoutBlock[];
}
