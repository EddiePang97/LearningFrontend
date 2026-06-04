import type { LucideIcon } from 'lucide-react';

type LabStoryTone = 'violet' | 'cyan' | 'emerald' | 'amber' | 'slate' | 'preload' | 'prefetch' | 'preconnect' | 'format' | 'responsive' | 'lazy' | 'neutral';

const toneClassMap: Record<LabStoryTone, string> = {
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

export function LabStoryCard({
    icon: Icon,
    title,
    tone,
    body,
    items,
}: {
    icon: LucideIcon;
    title: string;
    tone: LabStoryTone;
    body?: string;
    items?: string[];
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${toneClassMap[tone]}`}>
                <Icon size={12} />
                {title}
            </div>
            {body ? (
                <p className="mt-4 text-sm leading-7 text-white">{body}</p>
            ) : null}
            {items?.length ? (
                <div className="mt-3 space-y-3">
                    {items.map(item => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-[#0b0b0c] px-4 py-3 text-sm leading-7 text-gray-300">
                            {item}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
