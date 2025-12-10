import React from 'react';
import { CONTENT } from '@/lib/dictionary';

interface CodeInsightProps {
    title: string;
    code: string;
    language?: string; // 'typescript' | 'json' etc. (For future highlighting integration)
    caption?: string;
}

export const CodeInsight: React.FC<CodeInsightProps> = ({ title, code, caption }) => {
    return (
        <section className="w-full py-16 px-4 max-w-4xl mx-auto">
            {/* Window Container */}
            <div className="rounded-xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 ring-1 ring-white/10">

                {/* Title Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-white/5">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-xs font-mono text-slate-400 font-medium">
                        {title}
                    </div>
                    <div className="w-14" /> {/* Spacer for centering */}
                </div>

                {/* Code Area */}
                <div className="p-6 md:p-8 overflow-x-auto">
                    <pre className="font-mono text-sm md:text-base leading-relaxed text-slate-300">
                        <code>{code}</code>
                    </pre>
                </div>
            </div>

            {/* Caption */}
            {caption && (
                <p className="mt-6 text-center text-slate-500 text-sm font-medium italic">
                    {CONTENT.arsenal.codeInsight.configLabel} {caption}
                </p>
            )}
        </section>
    );
};
