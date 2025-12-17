import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Shared theme colors for consistent skeleton appearance
const SKELETON_THEME = {
    baseColor: '#f8fafc',
    highlightColor: '#e2e8f0',
};

/**
 * Full-page skeleton loader for initial page load.
 * Shows a comprehensive layout placeholder.
 */
export const SkeletonLoader = () => {
    return (
        <SkeletonTheme {...SKELETON_THEME}>
            <div className="relative w-full mx-auto max-w-6xl px-4 py-24 space-y-24 min-h-screen">

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

/**
 * Compact streaming skeleton shown at the bottom of content
 * while new blocks are being generated.
 */
export const StreamingSkeleton = () => {
    return (
        <SkeletonTheme {...SKELETON_THEME}>
            <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
                {/* Section Header Skeleton */}
                <div className="mb-6">
                    <Skeleton height={36} width="35%" />
                </div>

                {/* Content Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <Skeleton height={24} width="70%" className="mb-3" />
                        <Skeleton count={3} />
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <Skeleton height={24} width="60%" className="mb-3" />
                        <Skeleton count={3} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};
