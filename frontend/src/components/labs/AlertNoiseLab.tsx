import { useMemo, useState } from 'react';
import { Bell, BellRing, Siren, TriangleAlert } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Scenario = 'chatty-warning' | 'checkout-broken' | 'queue-spike' | 'transient-blip';

const SCENARIOS: Array<{ id: Scenario; label: string; note: string }> = [
    { id: 'chatty-warning', label: 'Noisy low-value warning', note: 'Background jobs emit lots of warnings, but user-facing traffic is still healthy.' },
    { id: 'checkout-broken', label: 'Checkout path failing', note: 'Overall QPS is normal, but a revenue-critical path is returning errors.' },
    { id: 'queue-spike', label: 'Queue backlog rising', note: 'Core requests still work, but async lag is growing toward an SLA breach.' },
    { id: 'transient-blip', label: 'Short transient spike', note: 'Latency jumps for one minute and then self-recovers before humans can act.' },
];

export const AlertNoiseLab = () => {
    const [scenario, setScenario] = useState<Scenario>('checkout-broken');

    const result = useMemo(() => {
        switch (scenario) {
            case 'chatty-warning':
                return {
                    severity: 'DO NOT PAGE',
                    userImpact: 'low',
                    actionWindow: 'during business hours',
                    reason: 'This creates log noise, but it does not yet justify waking someone up because user-facing service is still healthy.',
                    takeaway: 'A real alert should map to meaningful user impact or a high-confidence precursor to it, not just “something happened.”',
                };
            case 'queue-spike':
                return {
                    severity: 'TICKET OR SLACK',
                    userImpact: 'medium',
                    actionWindow: 'soon, but not instantly',
                    reason: 'Async lag is degrading, so the signal matters, but the team still has room to respond before the primary path is down.',
                    takeaway: 'Some signals deserve escalation, but not every escalation deserves a pager. Good systems separate page-worthy from queue-worthy.',
                };
            case 'transient-blip':
                return {
                    severity: 'AUTO-CLOSE OR SUPPRESS',
                    userImpact: 'unclear',
                    actionWindow: 'observe trend first',
                    reason: 'A single short blip often creates alert fatigue if it wakes people up before proving it is sustained or user-visible.',
                    takeaway: 'Duration and persistence matter. Alerting on every spike trains teams to ignore the pager.',
                };
            default:
                return {
                    severity: 'PAGE NOW',
                    userImpact: 'high',
                    actionWindow: 'immediate',
                    reason: 'The business-critical checkout path is failing right now, so the alert should be loud, specific, and routed to an owner who can act.',
                    takeaway: 'The best alerts are tied to user pain and business-critical paths, not just infrastructure trivia.',
                };
        }
    }, [scenario]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Bell} title="Alert Noise Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Bell className="text-cyan-400" />
                        Alert Noise Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare noisy signals with genuinely urgent failures to see why good alerts are designed around actionability, not raw event count.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Alert Scenario</p>
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
                        <LabMetricCard label="Severity" value={result.severity} tone="amber" />
                        <LabMetricCard label="User Impact" value={result.userImpact} tone="violet" />
                        <LabMetricCard label="Response Window" value={result.actionWindow} tone="cyan" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                {result.severity === 'PAGE NOW' ? <Siren size={14} /> : result.severity === 'DO NOT PAGE' ? <Bell size={14} /> : <BellRing size={14} />}
                                <span>Decision Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.reason}</p>

                            <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">design principle</div>
                                <p className="mt-2 text-sm leading-6 text-white">{result.takeaway}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Page Only For Action"
                                tone="sky"
                                body="A pager should mean someone must wake up and do something now. If the alert does not demand that, it belongs in a quieter channel."
                            />
                            <LabMiniCard
                                title="Measure User Pain"
                                tone="violet"
                                body="The strongest alert signals track real user or business damage: failed checkout, auth outage, or a critical SLA breach, not just noisy internal counters."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <TriangleAlert size={14} />
                            <span>Alert Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Ask whether the signal reflects meaningful user impact or a high-confidence precursor to it.</li>
                            <li>Decide whether the right destination is pager, team chat, ticket queue, or pure dashboard visibility.</li>
                            <li>Use duration, threshold, and route ownership to keep short-lived spikes from turning into permanent alert fatigue.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
