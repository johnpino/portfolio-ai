import { z } from 'zod';

// Base Props
const BaseBlockSchema = z.object({
    id: z.string().describe("Unique identifier for the block, e.g., 'block_1'"),
});

// 1. Hero
export const HeroPropsSchema = z.object({
    title: z.string(),
    role: z.string().nullable().describe("e.g. 'Software Engineer'"),
    subtitle: z.string(),
    ctaText: z.string().nullable(),
    ctaLink: z.string().nullable(),
});
export const HeroBlockSchema = BaseBlockSchema.extend({
    type: z.literal('hero'),
    props: HeroPropsSchema,
});

// 2. Headline
export const HeadlinePropsSchema = z.object({
    text: z.string(),
    size: z.enum(['xl', '2xl']).default('xl'),
    align: z.enum(['left', 'center']).default('left'),
});
export const HeadlineBlockSchema = BaseBlockSchema.extend({
    type: z.literal('headline'),
    props: HeadlinePropsSchema,
});

// 3. Quick Resume
export const ExperienceItemSchema = z.object({
    role: z.string(),
    company: z.string(),
    years: z.string(),
    location: z.string().nullable(),
});
export const QuickResumePropsSchema = z.object({
    summary: z.string(),
    experience: z.array(ExperienceItemSchema),
    education: z.string().nullable(),
});
export const QuickResumeBlockSchema = BaseBlockSchema.extend({
    type: z.literal('quick-resume'),
    props: QuickResumePropsSchema,
});

// 4. Skills Grid
export const SkillItemSchema = z.object({
    id: z.string().describe("Unique identifier").nullable(),
    name: z.string(),
    role: z.enum(['Core Skill', 'Supporting Skill', 'Complementary Skill']),
    level: z.enum(['Expert', 'Advanced', 'Comfortable']),
    evidence: z.string().nullable().describe("Brief proof/context, e.g. 'Used in Project X'"),
    tags: z.array(z.string()).nullable(),
    since: z.string().nullable(),
    lastUsed: z.string().nullable(),
});
export const SkillsGridPropsSchema = z.object({
    title: z.string(),
    skills: z.array(SkillItemSchema),
});
export const SkillsGridBlockSchema = BaseBlockSchema.extend({
    type: z.literal('skills-grid'),
    props: SkillsGridPropsSchema,
});

// 5. Problem Solution
export const ProblemSolutionPropsSchema = z.object({
    problemTitle: z.string(),
    problem: z.string(),
    solutionTitle: z.string(),
    solution: z.string(),
});
export const ProblemSolutionBlockSchema = BaseBlockSchema.extend({
    type: z.literal('problem-solution'),
    props: ProblemSolutionPropsSchema,
});

// 6. Testimonial
export const TestimonialPropsSchema = z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
    company: z.string().nullable(),
    avatar: z.string().nullable(),
});
export const TestimonialBlockSchema = BaseBlockSchema.extend({
    type: z.literal('testimonial'),
    props: TestimonialPropsSchema,
});

// 7. Career Timeline
export const TimelineItemSchema = z.object({
    year: z.string(),
    title: z.string(),
    company: z.string(),
    description: z.string(),
});
export const CareerTimelinePropsSchema = z.object({
    items: z.array(TimelineItemSchema),
});
export const CareerTimelineBlockSchema = BaseBlockSchema.extend({
    type: z.literal('career-timeline'),
    props: CareerTimelinePropsSchema,
});

// 8. Case Studies List
export const ProjectItemSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    link: z.string().nullable(),
});
export const CaseStudiesListPropsSchema = z.object({
    title: z.string(),
    projects: z.array(ProjectItemSchema),
});
export const CaseStudiesListBlockSchema = BaseBlockSchema.extend({
    type: z.literal('case-studies-list'),
    props: CaseStudiesListPropsSchema,
});

// 9. Gallery
export const ImageItemSchema = z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().nullable(),
});
export const GalleryPropsSchema = z.object({
    images: z.array(ImageItemSchema),
});
export const GalleryBlockSchema = BaseBlockSchema.extend({
    type: z.literal('gallery'),
    props: GalleryPropsSchema,
});

// 10. System Metrics
export const SystemMetricsBlockSchema = BaseBlockSchema.extend({
    type: z.literal('system-metrics'),
    props: z.object({
        title: z.string().nullable(),
        metrics: z.array(z.object({
            label: z.string(),
            value: z.string(),
            trend: z.string().nullable(),
            trendDirection: z.enum(['up', 'down', 'neutral']).nullable()
        })).nullable(),
    }),
});

// 11. Code Insight
export const CodeInsightBlockSchema = BaseBlockSchema.extend({
    type: z.literal('code-insight'),
    props: z.object({
        title: z.string().nullable(),
        code: z.string().nullable(),
        language: z.string().nullable(),
        caption: z.string().nullable(),
    }),
});

// 12. Tech Ecosystem
export const TechEcosystemBlockSchema = BaseBlockSchema.extend({
    type: z.literal('tech-ecosystem'),
    props: z.object({
        title: z.string().nullable(),
        centralNode: z.string().nullable(),
        connectedNodes: z.array(z.string()).nullable(),
    }),
});


// 13. Simple Text Block
export const SimpleTextBlockPropsSchema = z.object({
    title: z.string(),
    content: z.string(),
});
export const SimpleTextBlockSchema = BaseBlockSchema.extend({
    type: z.literal('simple-text-block'),
    props: SimpleTextBlockPropsSchema,
});


// Discriminated Union of All Blocks (using z.union for OpenAI compatibility)
export const LayoutBlockTypeSchema = z.union([
    HeadlineBlockSchema,
    QuickResumeBlockSchema,
    SkillsGridBlockSchema,
    ProblemSolutionBlockSchema,
    TestimonialBlockSchema,
    CareerTimelineBlockSchema,
    CaseStudiesListBlockSchema,
    GalleryBlockSchema,
    SimpleTextBlockSchema,
    //SystemMetricsBlockSchema,
    //CodeInsightBlockSchema,
    //TechEcosystemBlockSchema,
]);

// Main Layout Schema
export const PortfolioLayoutSchema = z.object({
    layout: z.array(LayoutBlockTypeSchema),
});
