import { NextResponse } from 'next/server';
import { LayoutConfig } from '@/types/layout';

export async function POST(_request: Request) {
    // In a real scenario, we would parse the body for persona/intent
    // const body = await request.json(); 

    // Simulated AI response
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
                    title: 'Technical Arsenal',
                    skills: [
                        { name: 'TypeScript', category: 'Language' },
                        { name: 'React', category: 'Frontend' },
                        { name: 'Next.js', category: 'Framework' },
                        { name: 'TailwindCSS', category: 'Style' },
                        { name: 'Node.js', category: 'Backend' },
                        { name: 'Python', category: 'Language' },
                        { name: 'OpenAI API', category: 'AI' }
                    ]
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
                            link: '#'
                        },
                        {
                            title: 'E-commerce Microservices',
                            description: 'A scalable e-commerce backend built with NestJS and RabbitMQ, handling 10k+ concurrent users.',
                            tags: ['NestJS', 'Microservices', 'Docker'],
                            link: '#'
                        }
                    ]
                }
            }
        ]
    };

    return NextResponse.json(mockLayout);
}
