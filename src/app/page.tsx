'use client';

import { useEffect, useState } from 'react';
import { DynamicLayout } from '@/components/DynamicLayout';
import { LayoutConfig } from '@/types/layout';

export default function Home() {
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching "AI generated" layout
    const fetchLayout = async () => {
      try {
        const res = await fetch('/api/generate-layout', {
          method: 'POST',
          body: JSON.stringify({ intent: 'showcase' }), // mocked intent
        });
        const data = await res.json();
        setLayout(data);
      } catch (error) {
        console.error('Failed to load layout:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-slate-500">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-accent-pink" />
          <p>Generating layout...</p>
        </div>
      </div>
    );
  }

  if (!layout) {
    return <div className="text-center p-10">Failed to load content.</div>;
  }

  return <DynamicLayout layout={layout} />;
}
