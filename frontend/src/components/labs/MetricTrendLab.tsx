import { useMemo, useState } from 'react';
import { Activity, Gauge, LineChart, TrendingUp } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Scenario = 'healthy' | 'latency-creep' | 'error-burst' | 'queue-backlog';

const SCENARIOS: Array<{ id: Scenario; label: string; note: string }> = [
    { id: 'healthy', label: 'Healthy baseline', note: 'Traffic is stable and all key signals remain inside the expected band.' },
    { id: 'latency-creep', label: 'Latency creep', note: 'Throughput still looks normal, but tail latency is rising over time.' },
    { id: 'error-burst', label: 'Error burst', note: 'Request volume is steady, but a failing dependency pushes error rate above tolerance.' },
    { id: 'queue-backlog', label: 'Queue backlog', note: 'User-facing requests still succeed, but async work is piling up behind them.' },
];

const metricMap: Record<Scenario, { qps: string; errorRate: string; p95: string; backlog: string; takeaway: string }> = {
    healthy: {
        qps: '1.2k',
        errorRate: '0.2%',
        p95: '180ms',
        backlog: '24 jobs',
        takeaway: 'Healthy metrics are boring on purpose. Their job is to define the baseline so degradation is obvious when it arrives.',
    },
    'latency-creep': {
        qps: '1.2k',
        errorRate: '0.4%',
        p95: '740ms',
        backlog: '38 jobs',
        takeaway: 'Throughput can stay flat while user experience quietly degrades. Tail latency often catches that story before total failure appears.',
    },
    'error-burst': {
        qps: '1.1k',
        errorRate: '7.8%',
        p95: '420ms',
        backlog: '41 jobs',
        takeaway: 'Error rate changes answer a different question than latency: is the system still succeeding, or has it started returning failure at scale?',
    },
    'queue-backlog': {
        qps: '1.0k',
        errorRate: '0.6%',
        p95: '210ms',
        backlog: '3.4k jobs',
        takeaway: 'A system can look superficially healthy from request metrics while async capacity silently collapses in the background.',
    },
};

export const MetricTrendLab = () => {
    const [scenario, setScenario] = useState<Scenario>('healthy');

    const result = useMemo(() => metricMap[scenario], [scenario]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={LineChart} title="Metric Trend Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <LineChart className="text-cyan-400" />
                        Metric Trend Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between system states to see how QPS, error rate, latency, and backlog tell different stories about platform health.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Metric Scenario</p>
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
                        <LabMetricCard label="QPS" value={result.qps} tone="cyan" />
                        <LabMetricCard label="Error Rate" value={result.errorRate} tone="amber" />
                        <LabMetricCard label="P95" value={result.p95} tone="violet" />
                        <LabMetricCard label="Queue Backlog" value={result.backlog} tone="emerald" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <TrendingUp size={14} />
                                <span>Trend Interpretation</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">best for</div>
                                    <div className="mt-2 text-sm font-semibold text-white">
                                        {scenario === 'latency-creep'
                                            ? 'spotting slow degradation'
                                            : scenario === 'error-burst'
                                                ? 'measuring failure spread'
                                                : scenario === 'queue-backlog'
                                                    ? 'catching hidden async risk'
                                                    : 'defining baseline health'}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">what metrics answer</div>
                                    <div className="mt-2 text-sm font-semibold text-white">Is the whole system trending worse?</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Metrics See Populations"
                                tone="sky"
                                body="Logs explain one event and trace explains one request path. Metrics summarize what is happening to the whole population over time."
                            />
                            <LabMiniCard
                                title="One Number Is Never Enough"
                                tone="violet"
                                body="QPS, error rate, latency, and backlog each reveal different failure shapes. Looking at only one of them makes partial outages easy to miss."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <Gauge size={14} />
                            <span>Metric Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Track a baseline first, otherwise “bad” has no stable reference point.</li>
                            <li>Use latency, error rate, throughput, and backlog together because real incidents rarely distort all of them the same way.</li>
                            <li>Metrics are strongest when you need to judge whether the platform is drifting, not just whether one request misbehaved.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Activity size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Metrics let backend teams tell the difference between a one-off incident and a service-wide trend. Without them, teams often react too late or optimize the wrong layer.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
