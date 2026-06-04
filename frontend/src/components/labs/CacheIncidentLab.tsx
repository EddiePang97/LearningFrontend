import { useMemo, useState } from 'react';
import { Flame, Layers3, ShieldAlert, ShieldCheck, Snowflake, Waves } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';
import { LabStoryCard } from './LabStoryCard';

type IncidentType = 'penetration' | 'breakdown' | 'avalanche';
type Defense = 'none' | 'null-cache' | 'singleflight' | 'ttl-jitter';

const INCIDENTS: Array<{ id: IncidentType; label: string; note: string }> = [
    { id: 'penetration', label: 'Cache Penetration', note: 'Clients keep asking for data that does not exist, so both cache and DB stay busy saying “nothing there.”' },
    { id: 'breakdown', label: 'Cache Breakdown', note: 'One hot key expires and many requests stampede straight into the source of truth.' },
    { id: 'avalanche', label: 'Cache Avalanche', note: 'Large groups of keys expire or disappear together, creating a broad fallback surge.' },
];

const DEFENSES: Array<{ id: Defense; label: string; note: string }> = [
    { id: 'none', label: 'No mitigation', note: 'Let every miss fall through to the database.' },
    { id: 'null-cache', label: 'Null cache / negative cache', note: 'Remember known-empty lookups briefly so nonexistent IDs do not keep punching through.' },
    { id: 'singleflight', label: 'Request coalescing / lock', note: 'Let one request rebuild the hot value while others wait or reuse the result.' },
    { id: 'ttl-jitter', label: 'TTL jitter / staggered expiry', note: 'Spread expirations so the whole fleet does not go stale at once.' },
];

const RESULT_MAP: Record<IncidentType, Record<Defense, {
    verdict: string;
    dbPressure: string;
    bestUse: string;
    takeaway: string;
    tone: 'emerald' | 'amber' | 'violet';
}>> = {
    penetration: {
        none: {
            verdict: 'DB WASTE',
            dbPressure: 'every bad lookup reaches source',
            bestUse: 'No good use case. This burns capacity on data that is not real.',
            takeaway: 'Penetration is not a “hot cache” problem. It is a miss-path problem where nonexistent IDs become a denial-of-wallet against your database.',
            tone: 'amber',
        },
        'null-cache': {
            verdict: 'BEST DEFENSE',
            dbPressure: 'sharp drop after first miss',
            bestUse: 'Short-lived negative caching for not-found resources or invalid identifiers.',
            takeaway: 'When the answer is reliably “nothing exists,” caching that emptiness for a short window stops repeated waste without pretending the data is real.',
            tone: 'emerald',
        },
        singleflight: {
            verdict: 'LIMITED HELP',
            dbPressure: 'slightly lower under concurrent misses',
            bestUse: 'Secondary help only if many identical invalid requests arrive at once.',
            takeaway: 'Coalescing can reduce duplicate work, but it does not solve the root issue that the miss itself keeps recurring.',
            tone: 'violet',
        },
        'ttl-jitter': {
            verdict: 'MISALIGNED',
            dbPressure: 'little change',
            bestUse: 'Not the right tool for not-found traffic.',
            takeaway: 'Jitter helps expiry waves, not bogus-ID traffic. Wrong diagnosis leads to pretty infrastructure that still melts the source.',
            tone: 'amber',
        },
    },
    breakdown: {
        none: {
            verdict: 'HOT KEY STAMPEDE',
            dbPressure: 'spikes on one path',
            bestUse: 'Avoid. One key expiry can wake the whole herd.',
            takeaway: 'Breakdown happens when popularity concentrates load on a single key and your system has no coordination for rebuilding it.',
            tone: 'amber',
        },
        'null-cache': {
            verdict: 'WRONG PRIMARY TOOL',
            dbPressure: 'little change for existing hot data',
            bestUse: 'Useful only if the key might be missing, not when the value is real and popular.',
            takeaway: 'Negative caching protects missing objects; it does not shield a real hot item whose value just expired.',
            tone: 'amber',
        },
        singleflight: {
            verdict: 'BEST DEFENSE',
            dbPressure: 'one rebuild instead of many',
            bestUse: 'Hot key rebuild coordination with locking, leases, or request coalescing.',
            takeaway: 'The goal is simple: one worker pays the rebuild cost, everyone else waits briefly instead of turning the source into a casualty.',
            tone: 'emerald',
        },
        'ttl-jitter': {
            verdict: 'HELPFUL SUPPORT',
            dbPressure: 'some smoothing, but hot key still dangerous',
            bestUse: 'Good companion to reduce synchronized expiry patterns around popular sets.',
            takeaway: 'Jitter lowers synchronized pain, but a truly hot key still needs coordination when it expires.',
            tone: 'violet',
        },
    },
    avalanche: {
        none: {
            verdict: 'BROAD OUTAGE RISK',
            dbPressure: 'many routes fallback together',
            bestUse: 'Avoid. This is how cache becomes a multiplier for failure instead of a shield.',
            takeaway: 'Avalanche is a fleet-shape problem: too many keys or nodes fail together, so the whole backend inherits the shock at once.',
            tone: 'amber',
        },
        'null-cache': {
            verdict: 'SMALL HELP ONLY',
            dbPressure: 'limited relief on missing subsets',
            bestUse: 'Minor protection for not-found lookups during a wider event.',
            takeaway: 'Negative caching can shave some waste, but it does not address mass expiry across large swaths of legitimate data.',
            tone: 'violet',
        },
        singleflight: {
            verdict: 'PARTIAL RELIEF',
            dbPressure: 'reduced duplicate rebuilds, still many cold keys',
            bestUse: 'Useful for the hottest keys in the blast radius.',
            takeaway: 'Coalescing helps hotspots, but avalanche usually needs a broader spread-the-risk strategy instead of only per-key locks.',
            tone: 'violet',
        },
        'ttl-jitter': {
            verdict: 'BEST DEFENSE',
            dbPressure: 'expiries spread over time',
            bestUse: 'Jittered TTLs and staggered refresh so thousands of keys do not die in the same minute.',
            takeaway: 'Avalanche is about synchronization. The fix is to desynchronize expiry, warmup, and recovery so the source never eats the whole surge at once.',
            tone: 'emerald',
        },
    },
};

const ICON_MAP = {
    penetration: ShieldAlert,
    breakdown: Flame,
    avalanche: Waves,
} satisfies Record<IncidentType, typeof ShieldAlert>;

export const CacheIncidentLab = () => {
    const [incident, setIncident] = useState<IncidentType>('penetration');
    const [defense, setDefense] = useState<Defense>('none');

    const result = useMemo(() => RESULT_MAP[incident][defense], [incident, defense]);
    const IncidentIcon = ICON_MAP[incident];

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Snowflake} title="Cache Incident Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Snowflake className="text-cyan-400" />
                        Cache Incident Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare penetration, breakdown, and avalanche incidents against different mitigations to see which defense actually matches the failure shape.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Incident Shape</p>
                        <div className="mt-4 space-y-3">
                            {INCIDENTS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setIncident(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        incident === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Mitigation</p>
                        <div className="mt-4 space-y-3">
                            {DEFENSES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setDefense(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        defense === option.id ? 'border-violet-400/40 bg-violet-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Verdict" value={result.verdict} tone={result.tone} />
                        <LabMetricCard label="DB Pressure" value={result.dbPressure} tone="amber" />
                        <LabMetricCard label="Best Use" value={result.bestUse} tone="cyan" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.06fr_0.94fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <IncidentIcon size={14} />
                                <span>Incident Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">core question</div>
                                    <div className="mt-2 text-sm font-semibold text-white">why did the miss path explode?</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">fix shape</div>
                                    <div className="mt-2 text-sm font-semibold text-white">match defense to failure pattern</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Not Every Miss Is The Same"
                                tone="sky"
                                body="Penetration, breakdown, and avalanche all increase fallback traffic, but they come from different causes. A good backend diagnoses the miss pattern before choosing a fix."
                            />
                            <LabMiniCard
                                title="Mitigation Is About Fit"
                                tone="violet"
                                body="Negative caching, coalescing, and jitter are all useful. The mistake is treating them like universal cache medicine instead of targeted tools."
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabStoryCard
                            icon={ShieldCheck}
                            title="Healthy Reflex"
                            tone="emerald"
                            items={[
                                'If the problem is nonexistent data, remember the empty answer for a short time.',
                                'If the problem is one hot key, coordinate rebuilds so only one request pays the expensive cost.',
                                'If the problem is synchronized expiry, spread the expirations so recovery does not happen all at once.',
                            ]}
                        />
                        <LabStoryCard
                            icon={Layers3}
                            title="Why Teams Get This Wrong"
                            tone="amber"
                            items={[
                                'All three incidents look like “the database suddenly got busy,” so teams often patch symptoms without naming the actual pattern.',
                                'Cache reliability improves when engineers classify the failure shape first and only then choose the matching mitigation.',
                            ]}
                        />
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
