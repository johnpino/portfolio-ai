import React from 'react';

interface TestimonialProps {
    quote: string;
    author: string;
    role: string;
    company?: string;
    avatar?: string; // URL to image
}

export const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, company }) => {
    return (
        <section className="w-full px-4 max-w-4xl mx-auto text-center">
            <div className="relative">
                <span className="absolute top-0 left-0 text-8xl text-purple-100 font-serif -translate-x-4 -translate-y-8 select-none">
                    “
                </span>

                <blockquote className="relative z-10 text-2xl md:text-4xl font-medium text-slate-800 leading-tight mb-12">
                    {quote}
                </blockquote>

                <div className="flex flex-col items-center gap-2">
                    {/* Avatar Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-slate-200 mb-2 flex items-center justify-center text-slate-400 font-bold text-sm">
                        {author.charAt(0)}
                    </div>

                    <cite className="not-italic">
                        <div className="font-bold text-slate-900">{author}</div>
                        <div className="text-sm text-slate-500 font-medium">
                            {role} {company && <span className="text-slate-300">|</span>} {company}
                        </div>
                    </cite>
                </div>
            </div>
        </section>
    );
};
