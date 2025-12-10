import React from 'react';

interface TechStackEcosystemProps {
    centralNode: string;
    connectedNodes: string[];
}

export const TechStackEcosystem: React.FC<TechStackEcosystemProps> = ({ centralNode, connectedNodes }) => {
    // Simple radial layout calculation could be done here, 
    // but for a robust responsive component, we'll use a flex/grid hybrid 
    // that looks like a connected graph.

    return (
        <section className="w-full py-24 px-4 overflow-hidden">
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative min-h-[400px]">

                {/* Connecting Lines (Visual decoration) */}
                <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
                    <svg width="100%" height="100%" viewBox="0 0 800 600" className="stroke-slate-900" style={{ overflow: 'visible' }}>
                        {/* We create a starburst pattern essentially */}
                        <line x1="400" y1="300" x2="100" y2="100" strokeWidth="2" />
                        <line x1="400" y1="300" x2="700" y2="100" strokeWidth="2" />
                        <line x1="400" y1="300" x2="100" y2="500" strokeWidth="2" />
                        <line x1="400" y1="300" x2="700" y2="500" strokeWidth="2" />
                        <line x1="400" y1="300" x2="400" y2="550" strokeWidth="2" />
                        <line x1="400" y1="300" x2="400" y2="50" strokeWidth="2" />
                        <circle cx="400" cy="300" r="150" fill="none" className="stroke-accent-pink" strokeDasharray="10 10" />
                    </svg>
                </div>

                {/* Central Node */}
                <div className="z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-900 text-white flex items-center justify-center text-center p-4 shadow-2xl shadow-slate-400/50 mb-12 md:mb-0">
                    <span className="font-bold text-lg md:text-xl tracking-tight">{centralNode}</span>
                </div>

                {/* Satellites (Responsive Grid that overlaps/surrounds in desktop) */}
                <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-32 text-center md:absolute md:inset-0 md:pointer-events-none">
                    {/* Top Left */}
                    <div className="md:col-start-1 md:row-start-1 md:flex md:items-start md:justify-center md:pt-12">
                        <Satellite node={connectedNodes[0]} />
                    </div>
                    {/* Top Right */}
                    <div className="md:col-start-3 md:row-start-1 md:flex md:items-start md:justify-center md:pt-12">
                        <Satellite node={connectedNodes[1]} />
                    </div>
                    {/* Bottom Left */}
                    <div className="md:col-start-1 md:row-start-3 md:flex md:items-end md:justify-center md:pb-12">
                        <Satellite node={connectedNodes[2]} />
                    </div>
                    {/* Bottom Right */}
                    <div className="md:col-start-3 md:row-start-3 md:flex md:items-end md:justify-center md:pb-12">
                        <Satellite node={connectedNodes[3]} />
                    </div>

                    {/* Remaining nodes can essentially flow or be hidden if > 4 for this strict viz */}
                </div>
            </div>
        </section>
    );
};

const Satellite = ({ node }: { node?: string }) => {
    if (!node) return null;
    return (
        <div className="pointer-events-auto inline-flex px-6 py-3 bg-white rounded-full border border-slate-200 text-slate-700 font-bold shadow-sm hover:scale-105 hover:border-accent-pink transition-all">
            {node}
        </div>
    );
};
