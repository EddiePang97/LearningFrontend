import { useMemo, useState } from 'react';
import { Gauge, ShieldAlert, TimerReset, TrafficCone } from 'lucide-react';
import { LabFrame } from './LabFrame';

type ClientType = 'normal' | 'bursty' | 'abusive';

const CLIENTS: Array<{ id: ClientType; label: string; rpm: number; hint: string }> = [
    { id: 'normal', label: 'Normal User', rpm: 20, hint: 'Ordinary usage with predictable request volume.' },
    { id: 'bursty', label: 'Bursty Client', rpm: 90, hint: 'Legitimate but spiky traffic that may hit the threshold.' },
    { id: 'abusive', label: 'Abusive Bot', rpm: 240, hint: 'Aggressive traffic that should be throttled quickly.' },
];

export const RateLimitLab = () => {
    const [client, setClient] = useState<ClientType>('normal');
    const [limit, setLimit] = useState(60);

    const simulation = useMemo(() => {
        const profile = CLIENTS.find(item => item.id === client)!;
        const accepted = Math.min(profile.rpm, limit);
        const blocked = Math.max(0, profile.rpm - limit);
        const status = blocked === 0 ? 'ALLOW TRAFFIC' : blocked < profile.rpm / 2 ? 'THROTTLE SOME' : 'BLOCK MOST';
        const explanation =
            blocked === 0
                ? 'The client stays within the rate window, so requests continue normally.'
                : blocked < profile.rpm / 2
                    ? 'Some requests are rejected with 429 so the service stays healthy while still serving part of the burst.'
                    : 'Most requests are blocked, which protects downstream systems from abuse and cost spikes.';

        return {
            profile,
            accepted,
            blocked,
            status,
            explanation,
        };
    }, [client, limit]);

    return (
        <LabFrame className="relative min-h-[480px] md:min-h-[600px] w-full" icon={TrafficCone} title="Rate Limit Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <TrafficCone className="text-orange-400" />
                        API Rate Limit Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare ordinary traffic, bursts, and abuse against a configurable requests-per-minute threshold.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Client Pattern</p>
                        <div className="mt-4 space-y-3">
                            {CLIENTS.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setClient(item.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        client === item.id ? 'border-orange-400/40 bg-orange-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{item.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{item.hint}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Requests / Minute Limit</p>
                            <span className="text-xs font-bold text-white">{limit}</span>
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="180"
                            step="10"
                            value={limit}
                            onChange={event => setLimit(Number(event.target.value))}
                            className="mt-4 w-full accent-orange-500"
                        />
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <MetricCard icon={Gauge} label="Client RPM" value={`${simulation.profile.rpm}`} accent="text-orange-300" />
                        <MetricCard icon={TimerReset} label="Accepted" value={`${simulation.accepted}`} accent="text-green-300" />
                        <MetricCard icon={ShieldAlert} label="Blocked (429)" value={`${simulation.blocked}`} accent="text-red-300" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-300">Policy Outcome</p>
                        <p className="mt-3 text-sm font-black text-white">{simulation.status}</p>
                        <p className="mt-3 text-sm leading-7 text-gray-200">{simulation.explanation}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Limiter Checklist</p>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Rate limits protect APIs from abuse, cost spikes, and accidental client storms.</li>
                            <li>Limits should be tuned per route or actor, not copied blindly across every endpoint.</li>
                            <li>A 429 response is only useful when clients and logs can clearly understand why it happened.</li>
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
    icon: typeof Gauge;
    label: string;
    value: string;
    accent: string;
}) => (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <Icon size={14} />
            <span>{label}</span>
        </div>
        <p className={`mt-3 text-2xl font-black ${accent}`}>{value}</p>
    </div>
);
