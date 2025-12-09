import React from 'react';
import { CONTENT } from '@/lib/dictionary';

interface HeroProps {
    title: string;
    subtitle: string;
    ctaText?: string;
    ctaLink?: string;
}



export const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText = CONTENT.hero.ctaDefault, ctaLink = "#" }) => {
    return (
        <section className="w-full py-32 md:py-48 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                {title}
            </h1>

            <div className="w-16 h-1 bg-accent-pink mb-8 rounded-full" />

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 font-medium">
                {subtitle}
            </p>

            {ctaText && (
                <a
                    href={ctaLink}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-pink hover:bg-rose-600 text-white shadow-lg shadow-rose-200 transition-all hover:scale-105 active:scale-95"
                    aria-label={ctaText}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </a>
            )}
        </section>
    );
};
