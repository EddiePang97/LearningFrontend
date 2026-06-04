import { useMemo, useState } from 'react';
import { BadgeCheck, CreditCard, RefreshCw, TimerReset, Webhook } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Scenario = 'happy-path' | 'redirect-only' | 'webhook-late' | 'webhook-duplicate';

const SCENARIOS: Array<{ id: Scenario; label: string; note: string }> = [
    { id: 'happy-path', label: 'Happy Path', note: 'Checkout succeeds and webhook confirms the order quickly.' },
    { id: 'redirect-only', label: 'Frontend Redirect Only', note: 'User lands back on success page, but backend has not confirmed payment yet.' },
    { id: 'webhook-late', label: 'Webhook Arrives Late', note: 'Payment succeeds, but async confirmation reaches the backend after a visible delay.' },
    { id: 'webhook-duplicate', label: 'Duplicate Webhook', note: 'Provider retries the same event and backend must not apply the order twice.' },
];

export const PaymentStateLab = () => {
    const [scenario, setScenario] = useState<Scenario>('happy-path');

    const result = useMemo(() => {
        switch (scenario) {
            case 'redirect-only':
                return {
                    frontend: 'success page visible',
                    orderState: 'processing',
                    webhookState: 'not received',
                    unlockState: 'wait',
                    takeaway: 'A browser redirect can be optimistic UI, but it is not enough evidence to unlock paid product access yet.',
                    recovery: 'Show pending confirmation copy and keep polling or refreshing from backend truth.',
                };
            case 'webhook-late':
                return {
                    frontend: 'return page says pending',
                    orderState: 'processing',
                    webhookState: 'received later',
                    unlockState: 'unlock after webhook',
                    takeaway: 'The backend can only move from processing to succeeded when async confirmation actually lands.',
                    recovery: 'Design the UI for waiting states instead of pretending the money state is final immediately.',
                };
            case 'webhook-duplicate':
                return {
                    frontend: 'success page visible',
                    orderState: 'succeeded once',
                    webhookState: 'duplicate retry',
                    unlockState: 'no double grant',
                    takeaway: 'Payment callbacks must be idempotent so duplicate provider retries do not issue credits or entitlements twice.',
                    recovery: 'Store event identity and make repeated callbacks safe no-ops.',
                };
            default:
                return {
                    frontend: 'success page visible',
                    orderState: 'succeeded',
                    webhookState: 'confirmed',
                    unlockState: 'unlock',
                    takeaway: 'The clean path still needs both frontend feedback and backend confirmation to stay consistent across systems.',
                    recovery: 'Once backend confirms success, the app can safely unlock access and clear pending state.',
                };
        }
    }, [scenario]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={CreditCard} title="Payment State Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <CreditCard className="text-cyan-400" />
                        Payment State Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between redirect, delayed confirmation, and duplicate callback scenarios to see why payment truth belongs to backend state, not just the success page.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Scenario</p>
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <LabMetricCard label="Frontend" value={result.frontend} tone="cyan" />
                        <LabMetricCard label="Order State" value={result.orderState} tone="amber" />
                        <LabMetricCard label="Webhook" value={result.webhookState} tone="violet" />
                        <LabMetricCard label="Unlock" value={result.unlockState} tone="emerald" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Webhook size={14} />
                                <span>State Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 space-y-3">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">what frontend knows</div>
                                    <div className="mt-2 font-semibold text-white">{result.frontend}</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">what backend should trust</div>
                                    <div className="mt-2 font-semibold text-white">{result.orderState}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Redirect Is UI"
                                tone="sky"
                                body="Returning from checkout can update the page, but it should not be treated as final accounting truth without backend confirmation."
                            />
                            <LabMiniCard
                                title="Webhook Is Reconciliation"
                                tone="violet"
                                body="Webhook delivery is the durable way external payment state re-enters your system, so it must be verified, stored, and made idempotent."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            {scenario === 'happy-path' ? <BadgeCheck size={14} /> : scenario === 'webhook-late' ? <TimerReset size={14} /> : <RefreshCw size={14} />}
                            <span>Recovery Rule</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{result.recovery}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <CreditCard size={14} />
                            <span>Payment Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Separate customer-facing success feedback from backend bookkeeping truth.</li>
                            <li>Expect async confirmation delays and give the UI an explicit pending state instead of pretending every payment is immediate.</li>
                            <li>Make webhook handling idempotent so retries never double-ship product access, credits, or emails.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
