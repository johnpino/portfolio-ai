import React from 'react';

interface Metric {
    label: string;
    value: string;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
}

interface SystemMetricsProps {
    metrics: Metric[];
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ metrics }) => {
    return (
        <section className="w-full py-12 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {metrics.map((metric, idx) => (
                    <div
                        key={idx}
                        className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:border-accent-pink/30 transition-colors"
                    >
                        <span className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                            {metric.value}
                        </span>
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                            {metric.label}
                        </span>
                        {metric.trend && (
                            <div className={`px-2 py-1 rounded text-xs font-bold ${metric.trendDirection === 'up' ? 'bg-emerald-100 text-emerald-700' :
                                    metric.trendDirection === 'down' ? 'bg-rose-100 text-rose-700' :
                                        'bg-slate-200 text-slate-600'
                                }`}>
                                {metric.trend}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
