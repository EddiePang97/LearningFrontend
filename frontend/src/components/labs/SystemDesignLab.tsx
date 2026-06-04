import { useMemo, useState } from 'react';
import { Activity, Database, Layers3, Server, ShieldCheck, Zap } from 'lucide-react';
import { LabFrame } from './LabFrame';

type TrafficProfile = 'steady' | 'spiky' | 'hypergrowth';
type ReliabilityTarget = 'balanced' | 'high' | 'critical';

const trafficOptions: Array<{ id: TrafficProfile; label: string; hint: string }> = [
    { id: 'steady', label: 'Steady SaaS', hint: 'Predictable traffic and moderate growth.' },
    { id: 'spiky', label: 'Spiky Launch', hint: 'Heavy peaks around campaigns and releases.' },
    { id: 'hypergrowth', label: 'Hypergrowth', hint: 'Rapid growth and frequent bottleneck shifts.' },
];

const reliabilityOptions: Array<{ id: ReliabilityTarget; label: string; hint: string }> = [
    { id: 'balanced', label: 'Balanced', hint: 'Good enough reliability without overspending.' },
    { id: 'high', label: 'High Availability', hint: 'Fast recovery and fewer user-visible failures.' },
    { id: 'critical', label: 'Mission Critical', hint: 'Strict uptime with strong resilience posture.' },
];

export const SystemDesignLab = () => {
    const [traffic, setTraffic] = useState<TrafficProfile>('steady');
    const [reliability, setReliability] = useState<ReliabilityTarget>('balanced');

    const recommendation = useMemo(() => {
        const needsQueue = traffic !== 'steady';
        const needsReadReplica = traffic === 'hypergrowth' || reliability === 'critical';
        const needsCircuitBreaker = reliability !== 'balanced';
        const needsMultiRegion = reliability === 'critical';

        const latencyScore =
            (traffic === 'steady' ? 82 : traffic === 'spiky' ? 70 : 62) +
            (needsQueue ? 4 : 0) +
            (needsReadReplica ? 3 : 0);

        const resilienceScore =
            (reliability === 'balanced' ? 68 : reliability === 'high' ? 82 : 93) +
            (needsCircuitBreaker ? 4 : 0) +
            (needsMultiRegion ? 3 : 0);

        const complexityScore =
            35 +
            (needsQueue ? 14 : 0) +
            (needsReadReplica ? 16 : 0) +
            (needsCircuitBreaker ? 10 : 0) +
            (needsMultiRegion ? 18 : 0);

        const stack = [
            'API Gateway + stateless app tier',
            needsQueue ? 'Async job queue for peak smoothing' : 'Synchronous request flow is still acceptable',
            needsReadReplica ? 'Primary DB + read replica split' : 'Single primary database is still viable',
            needsCircuitBreaker ? 'Circuit breaker + degraded fallback path' : 'Basic retry and health checks',
            needsMultiRegion ? 'Multi-region failover posture' : 'Single-region with strong backup plan',
        ];

        const bottleneck =
            traffic === 'steady'
                ? 'Application and database stay simple, so schema/query design matters more than topology.'
                : traffic === 'spiky'
                    ? 'Traffic peaks will hammer cache misses and downstream jobs first; smoothing and backpressure matter.'
                    : 'At hypergrowth scale, bottlenecks migrate from app CPU to database reads, queue depth, and recovery workflows.';

        return {
            stack,
            latencyScore,
            resilienceScore,
            complexityScore,
            bottleneck,
        };
    }, [traffic, reliability]);

    return (
        <LabFrame className="relative min-h-[480px] md:min-h-[600px] w-full" icon={Layers3} title="System Design Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Layers3 className="text-cyan-400" />
                        System Design Tradeoff Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Tune traffic and reliability targets, then inspect how the recommended backend architecture changes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-4">
                    <SelectionCard title="Traffic Profile" options={trafficOptions} active={traffic} onSelect={setTraffic} />
                    <SelectionCard title="Reliability Target" options={reliabilityOptions} active={reliability} onSelect={setReliability} />
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <ScoreCard icon={Zap} label="Latency Posture" value={recommendation.latencyScore} accent="text-cyan-300" />
                        <ScoreCard icon={ShieldCheck} label="Resilience" value={recommendation.resilienceScore} accent="text-green-300" />
                        <ScoreCard icon={Activity} label="Complexity Cost" value={recommendation.complexityScore} accent="text-amber-300" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            Recommended Architecture
                        </p>
                        <div className="mt-4 grid gap-3">
                            {recommendation.stack.map((item, index) => (
                                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-black text-cyan-300">
                                        {index + 1}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InsightCard
                            icon={Server}
                            title="Likely Bottleneck Shift"
                            body={recommendation.bottleneck}
                            accent="text-purple-300"
                        />
                        <InsightCard
                            icon={Database}
                            title="Design Reminder"
                            body="Every reliability upgrade buys safety by increasing moving parts. Add only the layers that your traffic pattern and failure cost actually justify."
                            accent="text-emerald-300"
                        />
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

const SelectionCard = <T extends string>({
    title,
    options,
    active,
    onSelect,
}: {
    title: string;
    options: Array<{ id: T; label: string; hint: string }>;
    active: T;
    onSelect: (value: T) => void;
}) => (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">{title}</p>
        <div className="mt-4 space-y-3">
            {options.map(option => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                        active === option.id
                            ? 'border-cyan-400/40 bg-cyan-500/10'
                            : 'border-white/8 bg-black/20 hover:border-white/15 hover:bg-white/5'
                    }`}
                >
                    <p className="text-xs font-bold text-white">{option.label}</p>
                    <p className="mt-1 text-[11px] leading-5 text-gray-400">{option.hint}</p>
                </button>
            ))}
        </div>
    </div>
);

const ScoreCard = ({
    icon: Icon,
    label,
    value,
    accent,
}: {
    icon: typeof Zap;
    label: string;
    value: number;
    accent: string;
}) => (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <Icon size={14} />
            <span>{label}</span>
        </div>
        <p className={`mt-3 text-3xl font-black ${accent}`}>{value}</p>
    </div>
);

const InsightCard = ({
    icon: Icon,
    title,
    body,
    accent,
}: {
    icon: typeof Server;
    title: string;
    body: string;
    accent: string;
}) => (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] ${accent}`}>
            <Icon size={14} />
            <span>{title}</span>
        </div>
        <p className="mt-3 text-xs leading-6 text-gray-300">{body}</p>
    </div>
);
