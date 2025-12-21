'use client';
import React from 'react';
import { useLayoutContext } from '@/context/LayoutContext';
import { CONTENT } from '@/lib/dictionary';

export const StatusBar = () => {
    const { loading, isGenerating } = useLayoutContext();
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        if (loading || isGenerating) {
            // Reset to 0 first to ensure animation restarts
            setProgress(0);
            const timer = setTimeout(() => setProgress(100), 100);
            return () => clearTimeout(timer);
        } else {
            setProgress(0);
        }
    }, [loading, isGenerating]);

    if (!loading && !isGenerating) return null;

    return (
        <div
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="group fixed top-0 left-0 right-0 z-60 flex items-center justify-center bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 animate-in slide-in-from-top-2 duration-500 cursor-pointer hover:bg-white/95 transition-colors hover:shadow-sm"
        >
            <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-pink opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-pink"></span>
                </div>
                <span className="font-medium text-slate-600 text-xs uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                    {CONTENT.generative.statusMessage}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-400 group-hover:text-accent-pink transition-all duration-300 group-hover:translate-y-0.5 ml-1"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
            {/* Simulated Progress Bar (17s duration) */}
            <div
                className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 transition-all ease-linear"
                style={{
                    width: `${progress}%`,
                    transitionDuration: '17000ms'
                }}
            />
        </div>
    );
};
