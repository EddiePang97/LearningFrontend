import { useMemo, useState } from 'react';
import { Database, Layers3, ShieldAlert, TimerReset } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Failure = 'database-down' | 'cache-down' | 'queue-stalled' | 'payment-provider-down';

const FAILURES: Array<{ id: Failure; label: string; note: string }> = [
    { id: 'database-down', label: 'Primary database unavailable', note: 'The most critical dependency is gone, so only a narrow safe surface should remain.' },
    { id: 'cache-down', label: 'Cache cluster unavailable', note: 'The system can still work, but only with a more expensive data path.' },
    { id: 'queue-stalled', label: 'Async worker backlog exploding', note: 'Synchronous reads still work while background side effects lag behind.' },
    { id: 'payment-provider-down', label: 'Third-party payment unavailable', note: 'Core browsing can continue, but checkout must degrade safely.' },
];

export const DegradationLab = () => {
    const [failure, setFailure] = useState<Failure>('database-down');

    const result = useMemo(() => {
        switch (failure) {
            case 'cache-down':
                return {
                    keep: 'core reads and writes',
                    degrade: 'disable expensive recommendation widgets',
                    recover: 'watch DB load and re-enable cache-backed features gradually',
                    takeaway: 'When the cache fails, the product can still run, but only if non-critical fan-out features back off before the database becomes the next casualty.',
                };
            case 'queue-stalled':
                return {
                    keep: 'synchronous confirmation path',
                    degrade: 'delay emails, exports, analytics, and secondary side effects',
                    recover: 'drain backlog first, then reconcile side effects before declaring the system healthy again',
                    takeaway: 'Async pipelines are where graceful degradation shines: preserve the user-critical path and let secondary work catch up later.',
                };
            case 'payment-provider-down':
                return {
                    keep: 'catalog, auth, and existing account access',
                    degrade: 'pause new checkout and show explicit payment outage state',
                    recover: 'resume purchase flows only after provider health and missed order reconciliation are verified',
                    takeaway: 'A third-party outage should not take the whole product down. Degrade the revenue edge, not the rest of the app.',
                };
            default:
                return {
                    keep: 'read-only fallback or maintenance shell',
                    degrade: 'freeze writes and hide state-changing features',
                    recover: 'verify data integrity first, then reopen mutations in controlled steps',
                    takeaway: 'When the source of truth is gone, the safest mature response is preserving trust, not pretending the app is still fully writable.',
                };
        }
    }, [failure]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={ShieldAlert} title="Degradation Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <ShieldAlert className="text-cyan-400" />
                        Degradation Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Choose a failing dependency and compare which product capabilities should survive, which should degrade first, and what recovery must confirm before reopening traffic.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Failure Mode</p>
                        <div className="mt-4 space-y-3">
                            {FAILURES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setFailure(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        failure === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Keep Alive" value={result.keep} tone="emerald" />
                        <LabMetricCard label="Degrade First" value={result.degrade} tone="amber" />
                        <LabMetricCard label="Recovery Focus" value={result.recover} tone="violet" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Layers3 size={14} />
                                <span>Degradation Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">preserve first</div>
                                    <div className="mt-2 text-sm font-semibold text-white">{result.keep}</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">sacrifice first</div>
                                    <div className="mt-2 text-sm font-semibold text-white">{result.degrade}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Protect Trust First"
                                tone="sky"
                                body="Graceful degradation is not about keeping every feature alive. It is about preserving the safest, most trustworthy core behavior when a dependency disappears."
                            />
                            <LabMiniCard
                                title="Recovery Is A Phase"
                                tone="violet"
                                body="Healthy infrastructure alone is not enough. Mature systems verify backlog, data integrity, and side-effect reconciliation before reopening every feature."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <TimerReset size={14} />
                            <span>Recovery Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Decide which user-critical capability survives before the incident happens, not during the page storm.</li>
                            <li>Prefer explicit degraded states over silent corruption or fake success.</li>
                            <li>Bring systems back in stages and verify integrity, backlog, and downstream side effects before declaring full recovery.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Database size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Strong system design is measured as much by how it fails and recovers as by how fast it runs in perfect conditions. Degradation policy is the practical half of reliability.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
