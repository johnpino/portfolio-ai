import React from 'react';

interface GalleryImage {
    src: string;
    alt: string;
    caption?: string;
}

interface GalleryProps {
    images: GalleryImage[];
}

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
    return (
        <section className="w-full px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-xl bg-slate-100 aspect-video md:aspect-4/3">
                        {/* 
                   In a real app, use Next.js <Image /> 
                   For now, we use a placeholder div that mimics an image
                */}
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                            <span className="font-bold text-xs uppercase tracking-widest">{img.alt}</span>
                        </div>

                        {img.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                {img.caption}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
