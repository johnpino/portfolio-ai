'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DynamicLayout } from '@/components/DynamicLayout';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { useLayoutContext } from '@/context/LayoutContext';

export default function Home() {
  const { layout, loading, isGenerating } = useLayoutContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when layout is populated and not initial loading
  useEffect(() => {
    if (layout && !loading && !isGenerating && contentRef.current) {
      // Small timeout to ensure DOM render
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [layout, loading, isGenerating]);

  // If loading and NO layout, show full screen skeleton. 
  // If we have a layout but are regenerating, we might want to just show the spinner in the input (handled by GlobalInput)
  if (loading && !layout) {
    return <SkeletonLoader />;
  }

  if (!layout) {
    return <div className="text-center p-10">Failed to load content.</div>;
  }

  return (
    <main className="relative min-h-screen pb-32">
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-20"
      >
        <DynamicLayout layout={layout} />
      </motion.div>
    </main>
  );
}
