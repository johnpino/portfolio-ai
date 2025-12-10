import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/projects';
import { CONTENT } from '@/lib/dictionary';
import { SkillCard } from '@/components/blocks/SkillCard';
import { Skill } from '@/types/skills';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    // Map techStack strings to Skill objects for the card component
    const techSkills: Skill[] = project.techStack.map((tech, idx) => ({
        id: `tech-${project.slug}-${idx}`,
        name: tech,
        role: 'Supporting Skill', // Visual style: Grey/Neutral
        level: 'Advanced',        // Visual style: Blue dot
        since: project.timeline,
        lastUsed: 'In Project',
        tags: [],
        evidence: `Key technology used to build ${project.title}.`
    }));

    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans">
            <article className="max-w-3xl mx-auto px-4 py-24 md:py-32">
                {/* Header */}
                <header className="mb-16 border-b border-slate-100 pb-12">
                    <a href="/" className="inline-block mb-8 text-sm font-semibold text-slate-400 hover:text-accent-pink transition-colors">
                        {CONTENT.projectDetail.backToPortfolio}
                    </a>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight tight-leading">
                        {project.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium font-mono">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-pink"></span>
                            {project.role}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>{project.timeline}</span>
                    </div>
                </header>

                {/* Narrative Body */}
                <div className="space-y-16">
                    <section>
                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">
                            {CONTENT.projectDetail.challengeTitle}
                        </h3>
                        <p className="text-lg md:text-xl leading-relaxed text-slate-700">
                            {project.challenge}
                        </p>
                    </section>

                    <section className="relative pl-6 md:pl-8 border-l-4 border-accent-pink/20">
                        <h3 className="text-xs uppercase tracking-widest font-bold text-accent-pink mb-4">
                            {CONTENT.projectDetail.solutionTitle}
                        </h3>
                        <p className="text-lg md:text-xl leading-relaxed text-slate-800 font-medium">
                            {project.solution}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">
                            {CONTENT.projectDetail.impactTitle}
                        </h3>
                        <p className="text-lg md:text-xl leading-relaxed text-slate-700">
                            {project.impact}
                        </p>
                    </section>
                </div>

                {/* Technologies - Using SkillCard */}
                <section className="mt-24 pt-12 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-8">{CONTENT.projectDetail.techStackTitle}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {techSkills.map(skill => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>
                </section>

                {/* Bottom Image Section */}
                {project.image && (
                    <section className="mt-24">
                        <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                            {/* Placeholder for now since we don't have real images uploaded yet */}
                            <div className="w-full h-64 md:h-96 bg-slate-50 flex items-center justify-center text-slate-300">
                                <span className="text-sm uppercase tracking-widest font-bold">Project Screenshot</span>
                            </div>
                            {/* 
                      In a real scenario:
                      <img src={project.image} alt={project.title} className="w-full h-auto object-cover" /> 
                    */}
                        </div>
                    </section>
                )}
            </article>
        </main>
    );
}
