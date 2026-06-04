import { useMemo, useState } from 'react';
import { Activity, Database, Layers3, TimerReset } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Bottleneck = 'api' | 'cache' | 'db' | 'queue';

const BOTTLENECKS: Array<{ id: Bottleneck; label: string; note: string }> = [
    { id: 'api', label: 'API handler slow', note: 'Heavy sync work blocks the request before any downstream call starts.' },
    { id: 'cache', label: 'Cache miss cascade', note: 'Redis fallback turns a fast read into a more expensive multi-hop request.' },
    { id: 'db', label: 'Database latency', note: 'The query is now the dominant span in the whole request trace.' },
    { id: 'queue', label: 'Async publish delay', note: 'The request is fine until the event handoff or downstream worker path stalls.' },
];

const spanMap: Record<Bottleneck, Array<{ name: string; ms: number; tone: 'slate' | 'amber' | 'violet' | 'emerald' }>> = {
    api: [
        { name: 'API gateway', ms: 18, tone: 'slate' },
        { name: 'order-service handler', ms: 185, tone: 'amber' },
        { name: 'cache lookup', ms: 12, tone: 'slate' },
        { name: 'database query', ms: 24, tone: 'slate' },
        { name: 'event publish', ms: 16, tone: 'slate' },
    ],
    cache: [
        { name: 'API gateway', ms: 20, tone: 'slate' },
        { name: 'order-service handler', ms: 34, tone: 'slate' },
        { name: 'cache lookup', ms: 120, tone: 'amber' },
        { name: 'database query', ms: 82, tone: 'violet' },
        { name: 'event publish', ms: 18, tone: 'slate' },
    ],
    db: [
        { name: 'API gateway', ms: 19, tone: 'slate' },
        { name: 'order-service handler', ms: 31, tone: 'slate' },
        { name: 'cache lookup', ms: 14, tone: 'slate' },
        { name: 'database query', ms: 260, tone: 'amber' },
        { name: 'event publish', ms: 15, tone: 'slate' },
    ],
    queue: [
        { name: 'API gateway', ms: 17, tone: 'slate' },
        { name: 'order-service handler', ms: 42, tone: 'slate' },
        { name: 'cache lookup', ms: 16, tone: 'slate' },
        { name: 'database query', ms: 39, tone: 'slate' },
        { name: 'event publish', ms: 170, tone: 'amber' },
    ],
};

export const TraceLab = () => {
    const [bottleneck, setBottleneck] = useState<Bottleneck>('db');

    const result = useMemo(() => {
        const spans = spanMap[bottleneck];
        const slowest = spans.reduce((winner, span) => (span.ms > winner.ms ? span : winner), spans[0]);
        const total = spans.reduce((sum, span) => sum + span.ms, 0);

        const takeawayMap: Record<Bottleneck, string> = {
            api: 'If the handler span dominates before downstream calls begin, the trace says the slowdown lives in application code, not infrastructure.',
            cache: 'Trace shows that “cache” problems often become data path problems: a miss or degraded cache makes downstream spans expand too.',
            db: 'When the query span dwarfs everything else, the request is not “generally slow”; it is specifically database-bound.',
            queue: 'Async handoff can still hurt end-user latency if the request waits on publish confirmation or downstream enqueue health.',
        };

        return {
            spans,
            slowest,
            total,
            takeaway: takeawayMap[bottleneck],
        };
    }, [bottleneck]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Activity} title="Trace Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Activity className="text-cyan-400" />
                        Trace Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Pick where the bottleneck moves and watch how a single request trace exposes the slowest span instead of forcing you to guess from logs alone.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Trace Scenario</p>
                        <div className="mt-4 space-y-3">
                            {BOTTLENECKS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setBottleneck(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        bottleneck === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Trace Total" value={`${result.total} ms`} tone="cyan" />
                        <LabMetricCard label="Slowest Span" value={result.slowest.name} tone="amber" />
                        <LabMetricCard label="Slowest Cost" value={`${result.slowest.ms} ms`} tone="violet" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            <Layers3 size={14} />
                            <span>Request Trace</span>
                        </div>

                        <div className="mt-4 space-y-3">
                            {result.spans.map(span => (
                                <div key={span.name} className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs font-bold text-white">{span.name}</span>
                                        <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                                            span.tone === 'amber'
                                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                                                : span.tone === 'violet'
                                                    ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
                                                    : span.tone === 'emerald'
                                                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                                        : 'border-white/10 bg-white/5 text-gray-200'
                                        }`}>
                                            {span.ms} ms
                                        </span>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                                        <div className="h-full rounded-full bg-cyan-400/80" style={{ width: `${Math.max((span.ms / result.total) * 100, 6)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="Why Trace Wins"
                            tone="sky"
                            body="Logs can prove an event happened, and metrics can prove the system is trending worse. Trace answers the missing question: which exact hop is eating the time?"
                        />
                        <LabMiniCard
                            title="Boundary Signal"
                            tone="violet"
                            body="A slow request is not one problem. Trace separates gateway, handler, cache, database, and queue spans so the team can hand the issue to the right boundary owner."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <TimerReset size={14} />
                            <span>Trace Takeaway</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Database size={14} />
                            <span>Observability Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Use logs for event detail, metrics for population trends, and trace when one request crosses too many boundaries to reason about locally.</li>
                            <li>Look for the dominant span first before tuning everything else equally.</li>
                            <li>Trace becomes most valuable when a request touches services owned by different teams or infrastructures.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
