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
            }
        ]
    };

    return NextResponse.json(mockLayout);
}
