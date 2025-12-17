import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SkeletonLoader = () => {
    return (
        <SkeletonTheme baseColor="#f8fafc" highlightColor="#e2e8f0">
            <div className="relative w-full mx-auto max-w-6xl px-4 py-24 space-y-24 min-h-screen">

                {/* Status Overlay */}
                <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-slate-100 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-5 h-5 border-2 border-slate-200 border-t-accent-pink rounded-full animate-spin" />
                        <span className="font-medium text-slate-600 text-sm">Analyzing profile & drafting layout...</span>
                    </div>
                </div>

                {/* Hero Skeleton */}
                <div>
                    <Skeleton height={64} className="w-full" />
                    <Skeleton height={28} className="w-full" />
                    <div className="pt-6">
                        <Skeleton height={52} width={180} borderRadius={999} />
                    </div>
                </div>

                {/* Metrics Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <Skeleton height={20} width="60%" className="mb-2" />
                        <Skeleton height={40} width="80%" />
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <Skeleton height={20} width="60%" className="mb-2" />
                        <Skeleton height={40} width="80%" />
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <Skeleton height={20} width="60%" className="mb-2" />
                        <Skeleton height={40} width="80%" />
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <Skeleton height={20} width="60%" className="mb-2" />
                        <Skeleton height={40} width="80%" />
                    </div>
                </div>

                {/* Text Content Skeleton */}
                <div className="space-y-6 max-w-4xl mx-auto">
                    <Skeleton height={40} width="40%" />
                    <Skeleton count={4} />
                </div>

                {/* Split Feature Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                    <Skeleton height={320} borderRadius={24} />
                    <div className="space-y-6">
                        <Skeleton height={36} width="60%" />
                        <Skeleton count={5} />
                        <Skeleton height={48} width={140} borderRadius={8} className="mt-4" />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};
