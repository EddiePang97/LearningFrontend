import { useMemo, useState } from 'react';
import { Clock3, Globe2, Waypoints } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type RecordType = 'a' | 'cname';
type ResolverState = 'fresh' | 'stale';

const RECORD_OPTIONS: Array<{ id: RecordType; label: string; target: string; note: string }> = [
    { id: 'a', label: 'A Record', target: '203.0.113.10', note: 'Points directly to an IPv4 address.' },
    { id: 'cname', label: 'CNAME', target: 'edge.learningatlas.app', note: 'Points to another hostname first.' },
];

const RESOLVER_OPTIONS: Array<{ id: ResolverState; label: string; note: string }> = [
    { id: 'fresh', label: 'Fresh Resolver', note: 'Resolver cache expired, so it asks the authority again.' },
    { id: 'stale', label: 'Stale Resolver', note: 'Resolver still holds the old answer until TTL runs out.' },
];

export const DnsLab = () => {
    const [recordType, setRecordType] = useState<RecordType>('a');
    const [resolverState, setResolverState] = useState<ResolverState>('fresh');
    const [ttl, setTtl] = useState(300);

    const simulation = useMemo(() => {
        const record = RECORD_OPTIONS.find(item => item.id === recordType)!;
        const hops = recordType === 'cname' ? 2 : 1;
        const cacheStatus = resolverState === 'fresh' ? 'MISS -> REFRESHED' : 'HIT -> OLD ANSWER';
        const visibleTarget = resolverState === 'fresh' ? record.target : recordType === 'a' ? '203.0.113.4' : 'old-edge.learningatlas.app';
        const propagationNote =
            resolverState === 'fresh'
                ? 'The resolver re-queries the authority, so the new DNS answer becomes visible immediately to this client.'
                : 'The resolver still trusts its cached answer. Until TTL expires, this client may continue seeing the old destination.';

        return {
            record,
            hops,
            cacheStatus,
            visibleTarget,
            propagationNote,
            ttlRisk: ttl >= 1800 ? 'Slow global rollout but fewer DNS lookups.' : ttl <= 120 ? 'Fast recovery, but more frequent resolver traffic.' : 'Balanced cache duration for ordinary changes.',
        };
    }, [recordType, resolverState, ttl]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[600px]" icon={Globe2} title="DNS Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Globe2 className="text-sky-400" />
                        DNS Propagation Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch record type, resolver freshness, and TTL to see why DNS changes can look correct for one user and stale for another.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Record Type</p>
                        <div className="mt-4 space-y-3">
                            {RECORD_OPTIONS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setRecordType(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        recordType === option.id ? 'border-sky-400/40 bg-sky-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Resolver Cache</p>
                        <div className="mt-4 space-y-3">
                            {RESOLVER_OPTIONS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setResolverState(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        resolverState === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">TTL (seconds)</p>
                            <span className="text-xs font-bold text-white">{ttl}s</span>
                        </div>
                        <input
                            type="range"
                            min="60"
                            max="3600"
                            step="60"
                            value={ttl}
                            onChange={event => setTtl(Number(event.target.value))}
                            className="mt-4 w-full accent-sky-500"
                        />
                        <p className="mt-3 text-[11px] leading-6 text-gray-400">{simulation.ttlRisk}</p>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Visible Target" value={simulation.visibleTarget} tone="cyan" />
                        <LabMetricCard label="Resolver Status" value={simulation.cacheStatus} tone="amber" />
                        <LabMetricCard label="Lookup Hops" value={`${simulation.hops}`} tone="emerald" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
                            <Waypoints size={14} />
                            <span>Resolution Path</span>
                        </div>
                        <div className="mt-4 rounded-2xl border border-white/8 bg-white/4 p-4 text-xs leading-7 text-gray-200">
                            <p>
                                <span className="font-bold text-white">Client</span> asks its recursive resolver for
                                <span className="mx-1 font-bold text-sky-300">api.learningatlas.app</span>.
                            </p>
                            <p className="mt-2">
                                Resolver behavior:
                                <span className="ml-2 font-bold text-white">{simulation.cacheStatus}</span>
                            </p>
                            <p className="mt-2">
                                Final visible answer for this user:
                                <span className="ml-2 font-bold text-emerald-300">{simulation.visibleTarget}</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="TTL Takeaway"
                            tone="sky"
                            body={simulation.propagationNote}
                        />
                        <LabMiniCard
                            title="Record Shape"
                            tone="violet"
                            body={
                                recordType === 'a'
                                    ? 'A records resolve directly to an IP, so the chain is shorter, but stale caches can still keep showing the old address.'
                                    : 'CNAME records add another hostname hop. That extra indirection is useful, but it also means you should think about where the chain ultimately terminates.'
                            }
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Clock3 size={14} />
                            <span>Debug Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>First ask whether the authority record is correct, then ask which cache layer might still be serving the old answer.</li>
                            <li>Low TTL helps DNS changes propagate faster, but it increases how often resolvers must re-query the authority.</li>
                            <li>CNAME chains are useful for indirection, but the final observed answer still depends on cache freshness and the last resolved target.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
