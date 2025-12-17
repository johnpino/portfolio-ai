'use client';
import React from 'react';
import { useLayoutContext } from '@/context/LayoutContext';

export const StatusBar = () => {
    const { loading, isGenerating } = useLayoutContext();

    if (!loading && !isGenerating) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-60 flex items-center justify-center bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 animate-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-pink opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-pink"></span>
                </div>
                <span className="font-medium text-slate-600 text-xs uppercase tracking-wider">Crafting your portfolio layout...</span>
            </div>
        </div>
    );
};
