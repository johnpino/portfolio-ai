'use client';

import React from 'react';
import { GenerativeInput } from './GenerativeInput';
import { useLayoutContext } from '@/context/LayoutContext';

export const GlobalGenerativeInput = () => {
    const { generateLayout, isGenerating } = useLayoutContext();

    return (
        <GenerativeInput
            onGenerate={generateLayout}
            isGenerating={isGenerating}
        />
    );
};
