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
            generateLayout('Create a comprehensive professional portfolio highlighting my frontend development skills, key projects, career timeline, etc. Be as specific as possible.');
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
