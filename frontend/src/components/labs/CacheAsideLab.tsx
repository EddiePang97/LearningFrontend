import { useMemo, useState } from 'react';
import { Database, Flame, RefreshCw, Server, Snowflake } from 'lucide-react';
import { LabFrame } from './LabFrame';

type Scenario = 'miss' | 'hit' | 'stale' | 'stampede';

const SCENARIOS: Array<{ id: Scenario; label: string; hint: string }> = [
    { id: 'miss', label: 'Cold Cache Miss', hint: 'Redis is empty, so the service must query the database and warm the cache.' },
    { id: 'hit', label: 'Warm Cache Hit', hint: 'The cache already contains fresh data for this resource.' },
    { id: 'stale', label: 'Stale After Write', hint: 'Database updated, but cache invalidation has not happened yet.' },
    { id: 'stampede', label: 'Hot Key Expired', hint: 'Many concurrent requests arrive right after the key expires.' },
];

export const CacheAsideLab = () => {
    const [scenario, setScenario] = useState<Scenario>('miss');

    const result = useMemo(() => {
        if (scenario === 'hit') {
            return {
                cacheState: 'fresh value found',
                dbLoad: '0 direct reads',
                latency: '8 ms',
                guidance: 'Ideal read path: app serves from Redis and the database stays quiet.',
            };
        }

        if (scenario === 'stale') {
            return {
                cacheState: 'serving outdated value',
                dbLoad: '1 write already committed',
                latency: '12 ms but incorrect result',
                guidance: 'Fast but wrong. Cache invalidation or version-aware refresh is required after writes.',
            };
        }

        if (scenario === 'stampede') {
            return {
                cacheState: 'expired hot key',
                dbLoad: 'many concurrent reads',
                latency: 'spikes across the cluster',
                guidance: 'This is cache stampede territory. Add locking, jittered TTL, or request coalescing.',
            };
        }

        return {
            cacheState: 'missing value',
            dbLoad: '1 fallback read',
            latency: '45 ms',
            guidance: 'Classic cache-aside miss: read the DB, then populate Redis for the next request.',
        };
    }, [scenario]);

    return (
        <LabFrame className="relative min-h-[480px] md:min-h-[600px] w-full" icon={Server} title="Cache Aside Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Server className="text-cyan-400" />
                        Cache Aside Flow Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between hit, miss, stale, and stampede scenarios to see how cache-aside changes backend behavior.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-white/4 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Scenario</p>
                    <div className="mt-4 space-y-3">
                        {SCENARIOS.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setScenario(item.id)}
                                className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                    scenario === item.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                }`}
                            >
                                <p className="text-xs font-bold text-white">{item.label}</p>
                                <p className="mt-1 text-[11px] text-gray-400">{item.hint}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <MetricCard icon={RefreshCw} label="Redis" value={result.cacheState} accent="text-cyan-300" />
                        <MetricCard icon={Database} label="DB Load" value={result.dbLoad} accent="text-amber-300" />
                        <MetricCard icon={scenario === 'stampede' ? Flame : Snowflake} label="Observed Latency" value={result.latency} accent="text-green-300" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">What This Teaches</p>
                        <p className="mt-3 text-sm font-semibold leading-7 text-gray-200">{result.guidance}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Cache Aside Checklist</p>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Read path: try cache first, then fallback to the database on miss.</li>
                            <li>Write path: update the source of truth first, then invalidate or refresh cache intentionally.</li>
                            <li>Hot keys need extra protection when TTL expires under real traffic.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

const MetricCard = ({
    icon: Icon,
    label,
    value,
    accent,
}: {
    icon: typeof Server;
    label: string;
    value: string;
    accent: string;
}) => (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <Icon size={14} />
            <span>{label}</span>
        </div>
        <p className={`mt-3 text-sm font-black ${accent}`}>{value}</p>
    </div>
);
