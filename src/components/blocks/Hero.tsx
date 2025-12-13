'use client';

import React from 'react';
import { CONTENT } from '@/lib/dictionary';
import { GenerativeInput } from '@/components/GenerativeInput';
import { useLayoutContext } from '@/context/LayoutContext';

interface HeroProps {
    title?: string;
    role?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
}

export const Hero: React.FC<Partial<HeroProps>> = ({
    title = CONTENT.hero.title,
    role = CONTENT.hero.role,
    subtitle = CONTENT.hero.subtitle,
    ctaText = CONTENT.hero.cta,
    ctaLink = CONTENT.hero.ctaLink
}) => {
    const { generateLayout, isGenerating } = useLayoutContext();

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
            <div className="flex-1 flex flex-col items-center justify-center pt-20">
                <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
                    {title}
                </h1>

                <p className="text-xl md:text-2xl font-medium text-slate-700 mb-8 tracking-wide">
                    {role}
                </p>

                <div className="w-24 h-1.5 bg-accent-pink mb-10 rounded-full" />

                <p className="text-xl md:text-xl text-slate-500 max-w-3xl mb-8 font-light leading-relaxed">
                    {subtitle}
                </p>

                {/* Generative Input integrated here */}
                <div className="w-full mb-12">
                    <GenerativeInput
                        onGenerate={generateLayout}
                        isGenerating={isGenerating}
                    />
                </div>

                {ctaText && (
                    <a
                        href={ctaLink}
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-accent-pink hover:bg-rose-600 text-white shadow-lg shadow-rose-200 transition-all hover:scale-105 active:scale-95 group"
                        aria-label={ctaText}
                    >
                        {ctaText}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                )}
            </div>

            {/* Scroll Hint - Moved down */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-xs md:text-sm text-slate-400 whitespace-nowrap font-light tracking-wide opacity-80">
                    {CONTENT.hero.scrollHint}
                </span>
                <div className="animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
        </section>
    );
};
