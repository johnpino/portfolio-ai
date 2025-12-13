import React from 'react';
import { CONTENT } from '@/lib/dictionary';

interface HeroProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
}



export const Hero: React.FC<Partial<HeroProps>> = ({
    title = CONTENT.hero.title,
    subtitle = CONTENT.hero.subtitle,
    ctaText = CONTENT.hero.cta,
    ctaLink = CONTENT.hero.ctaLink
}) => {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                    {title}
                </h1>

                <div className="w-24 h-1.5 bg-accent-pink mb-10 rounded-full" />

                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mb-12 font-medium leading-relaxed">
                    {subtitle}
                </p>

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

            {/* Scroll Hint */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-slate-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </section>
    );
};
