'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LayoutConfig } from '@/types/layout';

interface LayoutContextType {
    layout: LayoutConfig | null;
    loading: boolean;
    isGenerating: boolean;
    generateLayout: (prompt: string) => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [layout, setLayout] = useState<LayoutConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    // Initial Load
    useEffect(() => {
        // We only trigger the initial generation if no layout exists yet
        if (!layout) {
            generateLayout('Create a comprehensive professional portfolio showcasing my profile as a Lead. The layout MUST follow this specific order of blocks: 1. A very detailed "quick-resume" block. 2. A "skills-grid" block. 3. A "career-timeline" block. 4. "case-studies-list" blocks. 5. Any complementary blocks that enhance my profile as a Lead (e.g., testimonials, philosophy, etc.). Ensure the QuickResume is prominent and detailed.');
        }
    }, []);

    const generateLayout = async (prompt: string) => {
        setIsGenerating(true);
        // Only show full loading state if we don't have a layout (initial load)
        if (!layout) setLoading(true);

        try {
            const res = await fetch('/api/generate-layout', {
                method: 'POST',
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setLayout(data);
        } catch (error) {
            console.error('Failed to load layout:', error);
        } finally {
            setLoading(false);
            setIsGenerating(false);
        }
    };

    return (
        <LayoutContext.Provider value={{ layout, loading, isGenerating, generateLayout }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayoutContext must be used within a LayoutProvider');
    }
    return context;
};
