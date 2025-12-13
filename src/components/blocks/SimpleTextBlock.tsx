import React from 'react';

interface SimpleTextBlockProps {
    title: string;
    content: string;
    style?: 'simple' | 'bordered' | 'accent';
}

export const SimpleTextBlock: React.FC<SimpleTextBlockProps> = ({ title, content, style = 'accent' }) => {
    return (
        <section className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="flex flex-col gap-6">
                <div className="relative inline-block w-fit">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        {title}
                    </h2>
                    {style === 'accent' && (
                        <div className="absolute -bottom-2 left-0 w-12 h-1 bg-indigo-500 rounded-full opacity-80" />
                    )}
                    {style === 'bordered' && (
                        <div className="absolute -left-4 top-1 bottom-1 w-1 bg-indigo-500 rounded-full opacity-60" />
                    )}
                </div>

                <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                    {content}
                </div>
            </div>
        </section>
    );
};
