import React, { useState } from 'react';
import { CONTENT } from '@/lib/dictionary';

interface GenerativeInputProps {
    onGenerate: (prompt: string) => Promise<void> | void;
    isGenerating: boolean;
}

export const GenerativeInput: React.FC<GenerativeInputProps> = ({ onGenerate, isGenerating }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        await onGenerate(prompt);
        setPrompt('');
    };

    return (
        <div className="w-full max-w-xl mx-auto mt-10 px-4">
            <form
                onSubmit={handleSubmit}
                className="relative group"
            >
                {/* Glassmorphic Container */}
                <div className="relative flex items-center gap-2 p-2 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full ring-1 ring-black/5 transition-all group-focus-within:ring-accent-pink/50 group-focus-within:scale-[1.02]">

                    {/* Icon / Status */}
                    <div className="pl-3 text-slate-400">
                        {isGenerating ? (
                            <div className="w-5 h-5 border-2 border-accent-pink/30 border-t-accent-pink rounded-full animate-spin" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isGenerating}
                        placeholder={isGenerating ? CONTENT.generative.placeholderGenerating : CONTENT.generative.placeholderDefault}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 text-sm md:text-base py-2"
                    />

                    {/* Action Button */}
                    <button
                        disabled={!prompt.trim() || isGenerating}
                        type="submit"
                        className="p-2 ml-1 rounded-full bg-accent-pink text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-pink transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                    </button>

                </div>
            </form>
        </div>
    );
};
