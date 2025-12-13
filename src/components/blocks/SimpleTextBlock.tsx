import React from 'react';

import { z } from 'zod';
import { SimpleTextBlockPropsSchema } from '@/lib/schemas';

type SimpleTextBlockProps = z.infer<typeof SimpleTextBlockPropsSchema>;

export const SimpleTextBlock: React.FC<SimpleTextBlockProps> = ({ title, content }) => {
    return (
        <section className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="flex flex-col gap-6">
                <div className="relative inline-block w-fit">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        {title}
                    </h2>
                    <div className="absolute -bottom-2 left-0 w-12 h-1 bg-accent-pink rounded-full" />
                </div>

                <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                    {content}
                </div>
            </div>
        </section>
    );
};
