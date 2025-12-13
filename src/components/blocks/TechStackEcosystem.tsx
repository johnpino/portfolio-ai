import React from 'react';

import { z } from 'zod';
import { TechEcosystemBlockSchema } from '@/lib/schemas';

type TechStackEcosystemProps = z.infer<typeof TechEcosystemBlockSchema>['props'];

export const TechStackEcosystem: React.FC<TechStackEcosystemProps> = ({ centralNode, connectedNodes }) => {
    return (
        <section className="w-full px-4 overflow-hidden">
            <div className="relative max-w-4xl mx-auto min-h-[500px] flex items-center justify-center">

                {/* Orbit Rings (Background Decoration) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    {/* Outer Ring */}
                    <div className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full border border-slate-200 border-dashed animate-[spin_60s_linear_infinite]" />
                    {/* Inner Ring */}
                    <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-slate-200" />
                    {/* Core Glow */}
                    <div className="absolute w-32 h-32 bg-accent-pink/5 rounded-full blur-3xl" />
                </div>

                {/* Central Core Node */}
                <div className="z-10 relative flex flex-col items-center justify-center group cursor-default">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-2 border-slate-900 shadow-xl flex items-center justify-center text-center p-2 z-20 transition-transform group-hover:scale-105">
                        <span className="font-bold text-slate-900 text-sm md:text-base leading-tight tracking-tight">
                            {centralNode}
                        </span>
                    </div>
                    {/* Visual connector to nothing, just style */}
                    <div className="absolute -inset-2 bg-slate-100 rounded-full -z-10 scale-90 group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Satellite Nodes - Desktop: Absolute | Mobile: Hidden/Stacked? 
            For true responsiveness without complex math, we'll use a hidden grid or hardcoded positions for specific indices 
        */}
                <div className="absolute inset-0 pointer-events-none">
                    {connectedNodes && connectedNodes.map((node, idx) => {
                        // Hardcoded positions for up to 6 nodes to create an "Orbit" look
                        // This is a simplified way to achieve the look without heavy JS math
                        const positions = [
                            'top-10 left-1/2 -translate-x-1/2',        // Top Center
                            'bottom-10 left-1/2 -translate-x-1/2',     // Bottom Center
                            'top-1/4 left-10 md:left-20',              // Top Left
                            'top-1/4 right-10 md:right-20',            // Top Right
                            'bottom-1/4 left-10 md:left-20',           // Bottom Left
                            'bottom-1/4 right-10 md:right-20',         // Bottom Right
                        ];

                        const pos = positions[idx] || 'hidden'; // Hide excess nodes for now

                        return (
                            <div key={idx} className={`absolute ${pos} flex flex-col items-center`}>
                                <div className="pointer-events-auto bg-white px-5 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:text-accent-pink hover:border-accent-pink transition-colors cursor-default whitespace-nowrap">
                                    {node}
                                </div>
                                {/* Little line pointing to center? subtle */}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};
