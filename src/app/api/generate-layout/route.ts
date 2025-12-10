import { NextResponse } from 'next/server';
import { LayoutConfig } from '@/types/layout';
import { Skill } from '@/types/skills';

export async function POST(_request: Request) {
    // Simulated AI response
    const skillsData: Skill[] = [
        {
            id: 'ts-1',
            name: 'TypeScript',
            role: 'Core Skill',
            level: 'Expert',
            since: '2019',
            lastUsed: 'Currently using',
            tags: ['Safety', 'Generics', 'Tooling'],
            evidence: 'Migrated a 50k+ LOC vanilla JS codebase to TypeScript strict mode, reducing runtime errors by 40%.'
        },
        {
            id: 'react-1',
            name: 'React',
            role: 'Core Skill',
            level: 'Expert',
            since: '2018',
            lastUsed: 'Currently using',
            tags: ['Hooks', 'Context', 'Performance'],
            evidence: 'Architected a complex dashboard with virtualized lists and real-time WebSocket updates.'
        },
        {
            id: 'next-1',
            name: 'Next.js',
            role: 'Core Skill',
            level: 'Advanced',
            since: '2020',
            lastUsed: 'Currently using',
            tags: ['SSR', 'App Router', 'RSC'],
            evidence: 'Implemented a multi-tenant platform using Middleware and ISR for sub-second page loads.'
        },
        {
            id: 'tailwind-1',
            name: 'TailwindCSS',
            role: 'Supporting Skill',
            level: 'Expert',
            since: '2020',
            lastUsed: 'Currently using',
            tags: ['Design Systems', 'Responsive'],
            evidence: 'Built a custom design system plugin to standardize spacing and colors across 5 internal apps.'
        },
        {
            id: 'node-1',
            name: 'Node.js',
            role: 'Supporting Skill',
            level: 'Advanced',
            since: '2019',
            lastUsed: 'Used last month',
            tags: ['API', 'Microservices'],
            evidence: 'Developed a scalable image processing worker service handling 10k daily uploads.'
        },
        {
            id: 'ai-1',
            name: 'Generative AI',
            role: 'Complementary Skill',
            level: 'Comfortable',
            since: '2023',
            lastUsed: 'Currently using',
            tags: ['RAG', 'Prompt Engineering'],
            evidence: 'Integrated OpenAI function calling to create an intelligent customer support chatbot.'
        }
    ];

    const mockLayout: LayoutConfig = {
        layout: [
            {
                id: 'block_1',
                type: 'hero',
                props: {
                    title: 'Building the Future with AI',
                    subtitle: 'I am a Full Stack Engineer passionate about generative AI, React, and building scalable systems.',
                    ctaText: 'View My Work',
                    ctaLink: '#work'
                }
            },
            {
                id: 'block_2',
                type: 'skills-grid',
                props: {
                    title: 'Capabilities & Evidence',
                    skills: skillsData,
                }
            },
            {
                id: 'block_3',
                type: 'case-studies-list',
                props: {
                    title: 'Selected Projects',
                    projects: [
                        {
                            title: 'Dynamic Portfolio Generator',
                            description: 'An AI-driven portfolio site that reconstructs its own layout based on JSON configuration. Built with Next.js and TypeScript.',
                            tags: ['Next.js', 'React', 'Generative UI'],
                            link: '/projects/dynamic-portfolio-generator'
                        },
                        {
                            title: 'E-commerce Microservices',
                            description: 'A scalable e-commerce backend built with NestJS and RabbitMQ, handling 10k+ concurrent users.',
                            tags: ['NestJS', 'Microservices', 'Docker'],
                            link: '/projects/ecommerce-microservices'
                        },
                    ]
                }
            },
            // WAVE 1 VERIFICATION BLOCKS
            {
                id: 'w1_headline',
                type: 'headline',
                props: {
                    text: "Engineering High-Scale Systems for Fintech Leaders.",
                    size: '2xl',
                    align: 'center'
                }
            },
            {
                id: 'w1_metrics',
                type: 'system-metrics',
                props: {
                    metrics: [
                        { label: 'Uptime', value: '99.99%', trend: '+0.09%', trendDirection: 'up' },
                        { label: 'Latency', value: '45ms', trend: '-20%', trendDirection: 'up' },
                        { label: 'Users', value: '50k+', trend: 'Steady', trendDirection: 'neutral' },
                        { label: 'Revenue', value: '$2M', trend: 'ARR', trendDirection: 'neutral' }
                    ]
                }
            },
            {
                id: 'w1_headline_2',
                type: 'headline',
                props: {
                    text: "Experience at a Glance",
                    size: 'xl',
                    align: 'left'
                }
            },
            {
                id: 'w1_resume',
                type: 'quick-resume',
                props: {
                    summary: "Senior Full Stack Engineer with 6+ years of specialized experience in React, Node.js, and Cloud Infrastructure. Proven track record of leading teams and shipping production-critical software.",
                    education: "BS Computer Science, Tech University (2018)",
                    experience: [
                        { role: "Senior Engineer", company: "Fintech Corp", years: "2022 - Present", location: "New York" },
                        { role: "Software Engineer", company: "Startup Inc", years: "2019 - 2022", location: "Remote" },
                        { role: "Junior Developer", company: "Agency LLC", years: "2018 - 2019", location: "London" }
                    ]
                }
            },
            // WAVE 2 VERIFICATION BLOCKS
            {
                id: 'w2_code',
                type: 'code-insight',
                props: {
                    title: 'lib/cache-strategy.ts',
                    code: `export async function getCachedData(key: string) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await db.query(...);
  await redis.set(key, JSON.stringify(data), 'EX', 3600);
  return data;
}`,
                    caption: 'Implements the "Stale-While-Revalidate" pattern for optimal performance.'
                }
            },
            {
                id: 'w2_probsol',
                type: 'problem-solution',
                props: {
                    problem: "The legacy API was taking 2000ms to respond, causing a 40% drop-off rate at checkout.",
                    solution: "I implemented a tiered caching strategy with Redis and optimized the SQL queries, reducing P99 latency to 45ms."
                }
            },
            {
                id: 'w2_testimonial',
                type: 'testimonial',
                props: {
                    quote: "John is the rare engineer who cares as much about the business impact as he does about the code quality. A true asset.",
                    author: "Sarah Jenkins",
                    role: "CTO",
                    company: "Fintech Corp"
                }
            },
            // WAVE 3 VERIFICATION BLOCKS
            {
                id: 'w3_timeline',
                type: 'career-timeline',
                props: {
                    items: [
                        { year: '2025', title: 'Lead Engineer', company: 'Fintech Corp', description: 'Architecting next-gen payments infrastructure.' },
                        { year: '2023', title: 'Senior Developer', company: 'Startup.io', description: 'Scaled userbase from 10k to 1M.' }
                    ]
                }
            },
            {
                id: 'w3_eco',
                type: 'tech-ecosystem',
                props: {
                    centralNode: 'React Architecture',
                    connectedNodes: ['Next.js', 'TypeScript', 'Tailwind', 'GraphQL']
                }
            },
            {
                id: 'w3_gallery',
                type: 'gallery',
                props: {
                    images: [
                        { src: '', alt: 'Dashboard UI', caption: 'Real-time Analytics' },
                        { src: '', alt: 'Mobile App', caption: 'iOS Interface' },
                        { src: '', alt: 'Design System', caption: 'Component Library' }
                    ]
                }
            }
        ]
    };

    return NextResponse.json(mockLayout);
}
