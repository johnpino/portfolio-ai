import React from 'react';

interface HeadlineProps {
    text: string;
    size?: 'xl' | '2xl'; // xl = 4xl/5xl (section header), 2xl = 6xl/7xl (main statement)
    align?: 'left' | 'center';
}

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
