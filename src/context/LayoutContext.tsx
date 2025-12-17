'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { z } from 'zod';
import { LayoutConfig } from '@/types/layout';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { LayoutBlockTypeSchema } from '@/lib/schemas';

/**
 * Context state definition.
 */
interface LayoutContextType {
    layout: LayoutConfig | null;
    loading: boolean;
    isGenerating: boolean;
    generateLayout: (prompt: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

/**
 * Provides the layout configuration to the application.
 * Manages the streaming state from Vercel AI SDK and persists the final layout.
 */
export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // We keep a local "final" layout state to persist data after stream or if we load it differently
    const [finalLayout, setFinalLayout] = useState<LayoutConfig | null>(null);
    const hasStartedRef = useRef(false);

    const { object, submit, isLoading, error } = useObject({
        api: '/api/generate-layout',
        schema: z.array(LayoutBlockTypeSchema),
        onFinish: ({ object }) => {
            if (object) {
                // Wrap array in layout config object as the final state
                setFinalLayout({ layout: object });
            }
        },
        onError: (e: any) => {
            console.error("Streaming Result Error:", e);
        }
    });

    // The active layout is either the streaming partial object (wrapped) or the final saved one.
    // While streaming, 'object' is the partial array accumulating blocks.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layout = finalLayout || (object ? { layout: object as any[] } : null);

    // Trigger initial generation on mount if not already done
    useEffect(() => {
        if (!finalLayout && !hasStartedRef.current) {
            hasStartedRef.current = true;
            submit({ prompt: 'Create a comprehensive professional portfolio showcasing my profile as a Lead. The layout MUST follow this specific order of blocks: 1. A very detailed "quick-resume" block. 2. A "skills-grid" block. 3. A "career-timeline" block. 4. "case-studies-list" blocks. 5. Any complementary blocks that enhance my profile as a Lead (e.g., testimonials, philosophy, etc.). Ensure the QuickResume is prominent and detailed.' });
        }
    }, [finalLayout, submit]);

    const generateLayout = (prompt: string) => {
        setFinalLayout(null); // Clear previous layout to show the new stream forming
        submit({ prompt });
    };

    const isGenerating = isLoading;

    // Check if we have at least one renderable block (with type and props)
    // This prevents the skeleton from disappearing before there's actual content
    const hasRenderableContent = layout?.layout?.some(
        (block) => block?.type && block?.props
    ) ?? false;

    // Loading is true if we are expecting data (isLoading) but have no renderable content yet.
    // This allows showing a skeleton state until there's actual content to display.
    const loading = isLoading && !hasRenderableContent;

    return (
        <LayoutContext.Provider value={{ layout, loading, isGenerating, generateLayout }}>
            {children}
        </LayoutContext.Provider>
    );
};

/**
 * Hook to access the layout context.
 * Throws an error if used outside of LayoutProvider.
 */
export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayoutContext must be used within a LayoutProvider');
    }
    return context;
};
