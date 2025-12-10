import React from 'react';

interface TimelineItem {
    year: string;
    title: string;
    company: string;
    description: string;
}

interface CareerTimelineProps {
    items: TimelineItem[];
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({ items }) => {
    return (
        <section className="w-full py-24 px-4 max-w-3xl mx-auto">
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-12">
                {items.map((item, idx) => (
                    <div key={idx} className="relative pl-8 md:pl-12">
                        {/* Timeline Dot */}
                        <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-white border-4 border-accent-pink shadow-sm" />

                        {/* Time Label */}
                        <span className="inline-block px-2 py-1 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded">
                            {item.year}
                        </span>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-slate-900">
                            {item.title}
                            <span className="font-normal text-slate-500"> at {item.company}</span>
                        </h3>

                        <p className="mt-2 text-slate-600 leading-relaxed max-w-xl">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
