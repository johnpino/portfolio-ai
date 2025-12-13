import React from 'react';

import { z } from 'zod';
import { HeadlinePropsSchema } from '@/lib/schemas';

type HeadlineProps = z.infer<typeof HeadlinePropsSchema>;

export const Headline: React.FC<HeadlineProps> = ({ text, size = 'xl', align = 'center' }) => {
    const sizeClasses = size === '2xl'
        ? 'text-5xl md:text-7xl tracking-tighter'
        : 'text-3xl md:text-5xl tracking-tight';

    const alignClasses = align === 'left' ? 'text-left' : 'text-center';

    return (
        <section className={`w-full px-4 max-w-5xl mx-auto ${alignClasses}`}>
            <h2 className={`${sizeClasses} font-bold text-slate-900 leading-tight`}>
                {text}
            </h2>
        </section>
    );
};
