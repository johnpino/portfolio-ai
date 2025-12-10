export interface ProjectDetail {
    slug: string;
    title: string;
    role: string;
    timeline: string;
    company?: string;
    challenge: string;
    solution: string;
    impact: string;
    techStack: string[];
    image?: string;
}

export const PROJECTS: ProjectDetail[] = [
    {
        slug: 'dynamic-portfolio-generator',
        title: 'Dynamic Portfolio Generator',
        role: 'Lead Engineer',
        timeline: '2025',
        challenge: 'Traditional portfolios are static and fail to adapt to different visitor personas (e.g., HR vs. CTO). Updating layout requires code changes.',
        solution: 'Built a Next.js application driven by a dynamic JSON configuration. Architected a recursive block renderer that maps API responses to React components, allowing an AI agent (or CMS) to completely restructure the page on the fly without deployments.',
        impact: 'Reduced time-to-customize by 100%. Enabled real-time layout personalization based on visitor intent.',
        techStack: ['Next.js 15', 'TypeScript', 'TailwindCSS', 'OpenAI API'],
        image: '/placeholder-project.png'
    },
    {
        slug: 'ecommerce-microservices',
        title: 'E-commerce Microservices',
        role: 'Backend Architect',
        timeline: '2024',
        challenge: 'Legacy monolith was suffering from database locks during flash sales, causing 500 errors and lost revenue.',
        solution: 'Designed and implemented an event-driven architecture using NestJS and RabbitMQ. Decoupled input processing from order fulfillment, allowing traffic bursts to be queued and processed asynchronously.',
        impact: 'Handled 10k+ concurrent users with 99.99% uptime during Black Friday. Reduced api latency by 60%.',
        techStack: ['NestJS', 'RabbitMQ', 'PostgreSQL', 'Docker'],
        image: '/placeholder-project.png'
    }
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
    return PROJECTS.find(p => p.slug === slug);
}
