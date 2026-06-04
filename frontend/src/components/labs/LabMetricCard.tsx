type LabMetricCardTone = 'violet' | 'cyan' | 'emerald' | 'amber' | 'slate' | 'preload' | 'prefetch' | 'preconnect' | 'format' | 'responsive' | 'lazy' | 'neutral';

const toneClassMap: Record<LabMetricCardTone, string> = {
    violet: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    slate: 'border-white/10 bg-white/5 text-gray-200',
    preload: 'border-violet-500/35 bg-violet-500/10 text-violet-200',
    prefetch: 'border-sky-500/35 bg-sky-500/10 text-sky-200',
    preconnect: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
    format: 'border-violet-500/35 bg-violet-500/10 text-violet-200',
    responsive: 'border-sky-500/35 bg-sky-500/10 text-sky-200',
    lazy: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
    neutral: 'border-white/10 bg-white/5 text-gray-200',
};

export function LabMetricCard({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: LabMetricCardTone;
}) {
    return (
        <div className={`min-w-0 rounded-2xl border p-4 ${toneClassMap[tone]}`}>
            <div className="break-words text-[10px] font-black uppercase tracking-[0.22em] text-current/80">{label}</div>
            <div className="mt-3 break-words text-sm font-bold text-white">{value}</div>
        </div>
    );
}
