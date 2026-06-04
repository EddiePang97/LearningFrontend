import { useMemo, useState } from 'react';
import { Clock3, RefreshCw, ShieldCheck, TriangleAlert } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';
import { LabStoryCard } from './LabStoryCard';

type DataProfile = 'catalog' | 'publish' | 'inventory' | 'payment';
type Strategy = 'long-ttl' | 'invalidate-on-write' | 'background-refresh' | 'bypass-cache';

const DATA_PROFILES: Array<{ id: DataProfile; label: string; note: string }> = [
    { id: 'catalog', label: 'Course catalog', note: 'Homepage cards and browse pages can usually tolerate a short stale window.' },
    { id: 'publish', label: 'Lesson publish toggle', note: 'Creators expect updates to become visible quickly after a save.' },
    { id: 'inventory', label: 'Seat availability', note: 'Overselling or showing phantom seats creates user trust problems fast.' },
    { id: 'payment', label: 'Payment status', note: 'Billing truth should come from the source of record, not a convenient old cache entry.' },
];

const STRATEGIES: Array<{ id: Strategy; label: string; note: string }> = [
    { id: 'long-ttl', label: 'Long TTL only', note: 'Lean on expiration and accept a wider stale window.' },
    { id: 'invalidate-on-write', label: 'Invalidate on write', note: 'Source of truth updates first, then cache is explicitly cleared.' },
    { id: 'background-refresh', label: 'Background refresh', note: 'Serve cached value briefly while a worker repairs freshness.' },
    { id: 'bypass-cache', label: 'Bypass cache', note: 'Read straight from the source of truth for correctness-sensitive paths.' },
];

const RESULT_MAP: Record<DataProfile, Record<Strategy, {
    verdict: string;
    riskWindow: string;
    operatorMove: string;
    takeaway: string;
    tone: 'emerald' | 'amber' | 'violet';
}>> = {
    catalog: {
        'long-ttl': {
            verdict: 'GOOD FIT',
            riskWindow: 'minutes are acceptable',
            operatorMove: 'Prefer simple TTL when read volume is high and freshness is not critical.',
            takeaway: 'Catalog and browse surfaces are classic cache territory. A little staleness buys a lot of latency and database relief.',
            tone: 'emerald',
        },
        'invalidate-on-write': {
            verdict: 'SAFE, MORE WORK',
            riskWindow: 'small after writes',
            operatorMove: 'Use when editors need quicker visibility than TTL alone can provide.',
            takeaway: 'Explicit invalidation shrinks the stale window, but it adds coupling between write paths and cache repair.',
            tone: 'emerald',
        },
        'background-refresh': {
            verdict: 'STRONG CHOICE',
            riskWindow: 'brief while repair runs',
            operatorMove: 'Useful when traffic is heavy and freshness can lag slightly.',
            takeaway: 'Background refresh lets you keep a fast path while smoothing cache churn around popular read-heavy data.',
            tone: 'emerald',
        },
        'bypass-cache': {
            verdict: 'TOO EXPENSIVE',
            riskWindow: 'none',
            operatorMove: 'Avoid by default because you throw away the main reason caching exists.',
            takeaway: 'If the data can safely be a little old, bypassing cache usually spends correctness budget you did not need to spend.',
            tone: 'amber',
        },
    },
    publish: {
        'long-ttl': {
            verdict: 'RISKY UX',
            riskWindow: 'editor sees stale state after save',
            operatorMove: 'Long TTL alone is too blunt when authors expect the system to reflect recent writes.',
            takeaway: 'When a human just changed data, stale cache feels like a broken save rather than an acceptable optimization.',
            tone: 'amber',
        },
        'invalidate-on-write': {
            verdict: 'BEST DEFAULT',
            riskWindow: 'very small if invalidation is reliable',
            operatorMove: 'Write to the source of truth first, then evict or refresh the affected keys.',
            takeaway: 'This is the common trade-off for mutable product data: fast reads most of the time, deliberate repair after writes.',
            tone: 'emerald',
        },
        'background-refresh': {
            verdict: 'USE CAREFULLY',
            riskWindow: 'users may briefly see old publish state',
            operatorMove: 'Only acceptable if your UI can signal “processing” instead of pretending the new state is already global truth.',
            takeaway: 'Background refresh helps throughput, but it also enlarges the moment where writer and reader disagree.',
            tone: 'amber',
        },
        'bypass-cache': {
            verdict: 'SAFE BUT COSTLY',
            riskWindow: 'none',
            operatorMove: 'Reserve for write-after-read flows where immediate accuracy matters more than read cost.',
            takeaway: 'Sometimes the cleanest post-write experience is to skip cache briefly, but you probably do not want that everywhere.',
            tone: 'violet',
        },
    },
    inventory: {
        'long-ttl': {
            verdict: 'DANGEROUS',
            riskWindow: 'oversell / phantom availability',
            operatorMove: 'Do not trust a wide stale window for scarce resources.',
            takeaway: 'Inventory-style data turns small cache lag into real business damage because many users may race on the same truth.',
            tone: 'amber',
        },
        'invalidate-on-write': {
            verdict: 'BETTER, NOT SUFFICIENT ALONE',
            riskWindow: 'depends on invalidation speed and concurrent contention',
            operatorMove: 'Pair invalidation with stronger source-of-truth controls such as locking or atomic stock updates.',
            takeaway: 'Evicting cache helps, but correctness-sensitive counts usually need stronger protection than “hope readers refetch soon.”',
            tone: 'violet',
        },
        'background-refresh': {
            verdict: 'TOO MUCH RISK',
            riskWindow: 'stale values linger under load',
            operatorMove: 'Avoid because serving old counts while repair runs can mislead many buyers at once.',
            takeaway: 'A repair-friendly strategy is not the same thing as a correctness-safe strategy.',
            tone: 'amber',
        },
        'bypass-cache': {
            verdict: 'SAFEST READ PATH',
            riskWindow: 'minimal',
            operatorMove: 'Prefer direct reads or strongly consistent derived state when business correctness is the priority.',
            takeaway: 'For scarce resources, the system should bias toward the source of truth even if reads cost more.',
            tone: 'emerald',
        },
    },
    payment: {
        'long-ttl': {
            verdict: 'UNACCEPTABLE',
            riskWindow: 'billing truth can drift badly',
            operatorMove: 'Never let a success page or cached flag stand in for confirmed backend payment state.',
            takeaway: 'Payment and entitlement state should be driven by durable records and event confirmation, not a lazy cache guess.',
            tone: 'amber',
        },
        'invalidate-on-write': {
            verdict: 'STILL INCOMPLETE',
            riskWindow: 'depends on async confirmations and webhook timing',
            operatorMove: 'Useful as a supporting optimization, but not as the primary correctness boundary.',
            takeaway: 'Even perfect invalidation cannot solve the fact that payment truth often arrives asynchronously.',
            tone: 'violet',
        },
        'background-refresh': {
            verdict: 'WRONG PRIMARY MODEL',
            riskWindow: 'users may see success before the system truly knows',
            operatorMove: 'Avoid making cache refresh the arbiter of financial truth.',
            takeaway: 'Background repair is for convenience data. Payment state needs explicit reconciliation against durable events.',
            tone: 'amber',
        },
        'bypass-cache': {
            verdict: 'CORRECT DEFAULT',
            riskWindow: 'minimal when backed by durable state',
            operatorMove: 'Read from the authoritative backend record, then derive UI from that result.',
            takeaway: 'This is the lesson: some data should stay slow-but-right because the cost of being wrong is much higher than the cost of an extra query.',
            tone: 'emerald',
        },
    },
};

export const CacheConsistencyLab = () => {
    const [profile, setProfile] = useState<DataProfile>('catalog');
    const [strategy, setStrategy] = useState<Strategy>('invalidate-on-write');

    const result = useMemo(() => RESULT_MAP[profile][strategy], [profile, strategy]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={RefreshCw} title="Cache Consistency Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <RefreshCw className="text-cyan-400" />
                        TTL And Consistency Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Pair a data profile with a cache strategy to see how stale windows, write behavior, and business risk change across backend scenarios.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Data Profile</p>
                        <div className="mt-4 space-y-3">
                            {DATA_PROFILES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setProfile(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        profile === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Cache Strategy</p>
                        <div className="mt-4 space-y-3">
                            {STRATEGIES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setStrategy(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        strategy === option.id ? 'border-violet-400/40 bg-violet-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Risk Window" value={result.riskWindow} tone="amber" />
                        <LabMetricCard label="Operator Move" value={result.operatorMove} tone="cyan" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Clock3 size={14} />
                                <span>Consistency Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">real question</div>
                                    <div className="mt-2 text-sm font-semibold text-white">how wrong can we afford to be?</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">source of truth</div>
                                    <div className="mt-2 text-sm font-semibold text-white">DB or durable domain state</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="TTL Is A Business Decision"
                                tone="sky"
                                body="A TTL is not just a performance knob. It defines how long the product is willing to serve yesterday's answer as if it were today's."
                            />
                            <LabMiniCard
                                title="Writes Change The Story"
                                tone="violet"
                                body="The moment humans or external systems mutate data, cache strategy must answer how readers recover freshness and how long disagreement is acceptable."
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabStoryCard
                            icon={ShieldCheck}
                            title="Good Cache Pattern"
                            tone="emerald"
                            items={[
                                'Read-heavy data with a clear tolerance for short-lived staleness can usually lean on TTL plus optional background refresh.',
                                'Write-sensitive data often needs explicit invalidation so the product does not look broken right after an update.',
                            ]}
                        />
                        <LabStoryCard
                            icon={TriangleAlert}
                            title="Danger Pattern"
                            tone="amber"
                            items={[
                                'Scarce inventory, money movement, or entitlements become risky when cache freshness is treated like a generic optimization problem.',
                                'If the cost of being wrong is high, read closer to the source of truth and let cache play only a supporting role.',
                            ]}
                        />
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
