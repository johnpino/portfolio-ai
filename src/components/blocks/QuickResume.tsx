import React from 'react';

interface ExperienceItem {
    role: string;
    company: string;
    years: string;
    location?: string;
}

interface QuickResumeProps {
    summary: string;
    experience: ExperienceItem[];
    education?: string; // Simple one-liner for now
}

export const QuickResume: React.FC<QuickResumeProps> = ({ summary, experience, education }) => {
    return (
        <section className="w-full py-16 px-4 max-w-3xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
                {/* Header */}
                <div className="border-b border-slate-100 pb-6 mb-8">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Professional Summary</h3>
                    <p className="text-slate-700 leading-relaxed font-medium">
                        {summary}
                    </p>
                </div>

                {/* Experience List */}
                <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-6">Work History</h3>
                    <div className="space-y-6">
                        {experience.map((job, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                                <div className="flex-grow">
                                    <h4 className="font-bold text-slate-900">{job.role}</h4>
                                    <span className="text-slate-600 font-medium">{job.company}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500 font-mono whitespace-nowrap">
                                    {job.location && <span className="hidden sm:inline">{job.location}</span>}
                                    <span>{job.years}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education Footer */}
                {education && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Education</h3>
                        <p className="text-slate-900 font-medium">{education}</p>
                    </div>
                )}
            </div>
        </section>
    );
};
