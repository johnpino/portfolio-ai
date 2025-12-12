'use client';

import { useEffect, useState } from 'react';
import { DynamicLayout } from '@/components/DynamicLayout';
import { GenerativeInput } from '@/components/GenerativeInput';
import { LayoutConfig } from '@/types/layout';
import { SkeletonLoader } from '@/components/SkeletonLoader';

export default function Home() {
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initial Load
  useEffect(() => {
    generateLayout('initial demo');
  }, []);

  const generateLayout = async (prompt: string) => {
    setIsGenerating(true);
    // Only show full screen loader on initial load
    if (!layout) setLoading(true);

    try {
      const res = await fetch('/api/generate-layout', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setLayout(data);
    } catch (error) {
      console.error('Failed to load layout:', error);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!layout) {
    return <div className="text-center p-10">Failed to load content.</div>;
  }

  return (
    <main className="relative min-h-screen pb-32">
      <DynamicLayout layout={layout} />
      <GenerativeInput onGenerate={generateLayout} isGenerating={isGenerating} />
    </main>
  );
}
