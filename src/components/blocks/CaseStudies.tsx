import React from 'react';
import { CONTENT } from '@/lib/dictionary';

import { z } from 'zod';
import { CaseStudiesListPropsSchema } from '@/lib/schemas';

type CaseStudiesProps = z.infer<typeof CaseStudiesListPropsSchema>;



export const CaseStudies: React.FC<CaseStudiesProps> = ({ title = CONTENT.caseStudies.sectionTitle, projects }) => {
    return (
        <section className="w-full px-4 max-w-4xl mx-auto">
            {title && (
                <h2 className="text-3xl font-bold text-slate-800 mb-16 text-center">{title}</h2>
            )}

            <div className="space-y-16">
                {projects.map((project, idx) => (
                    <div
                        key={idx}
                        className="group flex flex-col gap-4 border-l-2 border-slate-100 pl-8 hover:border-accent-pink transition-colors duration-300"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 flex flex-wrap items-baseline gap-4">
                            {project.title}
                            {project.link && (
                                <a
                                    href={project.link}
                                    className="text-sm font-semibold text-accent-pink hover:text-rose-700 underline underline-offset-4"
                                >
                                    {CONTENT.caseStudies.viewSolution}
                                </a>
                            )}
                        </h3>

                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                            {project.description}
                        </p>

                        {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {project.tags.map((tag, tIdx) => (
                                    <span
                                        key={tIdx}
                                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
