import React from 'react';
import { CONTENT } from '@/lib/dictionary';

import { z } from 'zod';
import { ProblemSolutionPropsSchema } from '@/lib/schemas';

type ProblemSolutionProps = z.infer<typeof ProblemSolutionPropsSchema>;

export const ProblemSolution: React.FC<ProblemSolutionProps> = ({
    problemTitle = "The Problem",
    problem,
    solutionTitle = "The Solution",
    solution
}) => {
    return (
        <section className="w-full px-4 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

                {/* The Problem (Left) */}
                <div className="relative p-8 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <div className="absolute -top-3 left-8 bg-white px-2 py-0.5 rounded border border-rose-100 uppercase tracking-widest text-[10px] font-bold text-rose-500">
                        {CONTENT.arsenal.problemSolution.problemLabel}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 leading-tight">
                        "{problemTitle}"
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        {problem}
                    </p>
                    <div className="mt-6 flex justify-end">
                        <span className="text-4xl">📉</span>
                    </div>
                </div>

                {/* The Solution (Right) */}
                <div className="relative p-8 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-sm md:mt-12">
                    <div className="absolute -top-3 left-8 bg-white px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest text-[10px] font-bold text-emerald-600">
                        {CONTENT.arsenal.problemSolution.solutionLabel}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 leading-tight">
                        "{solutionTitle}"
                    </h3>
                    <p className="text-slate-700 font-medium leading-relaxed">
                        {solution}
                    </p>
                    <div className="mt-6 flex justify-end">
                        <span className="text-4xl">🚀</span>
                    </div>
                </div>

            </div>
        </section>
    );
};
