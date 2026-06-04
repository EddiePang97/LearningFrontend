import { useMemo, useState } from 'react';
import { Database, Layers3, RefreshCcw, Waypoints } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Scenario = 'read-hit' | 'read-miss' | 'write-through' | 'async-repair';

const SCENARIOS: Array<{ id: Scenario; label: string; note: string }> = [
    { id: 'read-hit', label: 'Hot read via cache hit', note: 'Most traffic is served from cache and the database stays cool.' },
    { id: 'read-miss', label: 'Cache miss with DB fallback', note: 'The read path goes back to the source of truth before rebuilding cache.' },
    { id: 'write-through', label: 'Write updates DB then cache', note: 'The mutation path keeps user-facing freshness tight, but coordination cost rises.' },
    { id: 'async-repair', label: 'Async compensation after queue event', note: 'The main request returns quickly while downstream consistency catches up later.' },
];

export const DataFlowLab = () => {
    const [scenario, setScenario] = useState<Scenario>('read-hit');

    const result = useMemo(() => {
        switch (scenario) {
            case 'read-miss':
                return {
                    sourceOfTruth: 'database',
                    userPath: 'cache -> DB -> cache rebuild',
                    consistency: 'fresh but slower',
                    takeaway: 'A miss is acceptable when the fallback path is controlled. The real danger is many misses turning into a thundering herd against the database.',
                };
            case 'write-through':
                return {
                    sourceOfTruth: 'database first',
                    userPath: 'write DB -> update cache -> ack user',
                    consistency: 'tighter read freshness',
                    takeaway: 'Synchronizing cache on the mutation path improves freshness, but it also increases coordination cost and failure branching during writes.',
                };
            case 'async-repair':
                return {
                    sourceOfTruth: 'database plus event log',
                    userPath: 'write core state -> enqueue repair -> downstream sync later',
                    consistency: 'eventual consistency window',
                    takeaway: 'Queue-based repair keeps the main path fast, but the team must explicitly manage lag, retries, and user-visible consistency windows.',
                };
            default:
                return {
                    sourceOfTruth: 'database with warm cache',
                    userPath: 'cache hit -> return user',
                    consistency: 'fast read path',
                    takeaway: 'The happy path is cheap because the cache absorbs reads, but the architecture only works if the fallback and invalidation paths are also designed.',
                };
        }
    }, [scenario]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Waypoints} title="Data Flow Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Waypoints className="text-cyan-400" />
                        Data Flow Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between cache hits, misses, write coordination, and async repair to see how database, cache, and queue each change the request path.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Flow Scenario</p>
                        <div className="mt-4 space-y-3">
                            {SCENARIOS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setScenario(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        scenario === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Source Of Truth" value={result.sourceOfTruth} tone="violet" />
                        <LabMetricCard label="Request Path" value={result.userPath} tone="cyan" />
                        <LabMetricCard label="Consistency" value={result.consistency} tone="emerald" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Layers3 size={14} />
                                <span>Coordination Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">database role</div>
                                    <div className="mt-2 text-sm font-semibold text-white">core persistence and correctness</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">queue/cache role</div>
                                    <div className="mt-2 text-sm font-semibold text-white">speed, smoothing, and async coordination</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Cache Is A Performance Tool"
                                tone="sky"
                                body="Cache makes reads cheaper, but it does not replace the database as the durable source of truth. Every cache win needs an invalidation story."
                            />
                            <LabMiniCard
                                title="Queue Is A Time-Shift Tool"
                                tone="violet"
                                body="Queues move non-critical or compensating work out of the main request, but they introduce lag, retries, and visibility requirements that the product must respect."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <RefreshCcw size={14} />
                            <span>System Design Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Always decide which layer owns correctness before optimizing for speed.</li>
                            <li>Design cache miss and rebuild behavior as carefully as the cache hit path, or the database becomes the next outage source.</li>
                            <li>When queues create eventual consistency, make the lag and repair strategy explicit instead of pretending everything is instant.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Database size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Mature backend systems are not “DB plus Redis plus queue” by decoration. They work only when each layer has a clear purpose, a fallback path, and a consistency story the team actually understands.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
