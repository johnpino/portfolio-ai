export type BlockType = 'hero' | 'skills-grid' | 'case-studies-list';

export interface LayoutBlock {
    id: string;
    type: BlockType;
    props: Record<string, unknown>;
}

export interface LayoutConfig {
    layout: LayoutBlock[];
}
