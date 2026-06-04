import { useMemo, useState } from 'react';
import { Activity, ArrowLeftRight, Route, ShieldPlus } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type TrafficPattern = 'steady' | 'spiky';
type FailureState = 'healthy' | 'api-b-down';

const SERVERS = ['api-a', 'api-b', 'api-c'] as const;

export const ReverseProxyLab = () => {
    const [trafficPattern, setTrafficPattern] = useState<TrafficPattern>('steady');
    const [failureState, setFailureState] = useState<FailureState>('healthy');

    const simulation = useMemo(() => {
        const requests = trafficPattern === 'steady' ? 12 : 24;
        const healthyTargets = failureState === 'healthy' ? [...SERVERS] : SERVERS.filter(server => server !== 'api-b');
        const distribution = healthyTargets.reduce<Record<string, number>>((acc, server) => {
            acc[server] = 0;
            return acc;
        }, {});

        for (let index = 0; index < requests; index += 1) {
            const server = healthyTargets[index % healthyTargets.length];
            distribution[server] += 1;
        }

        return {
            requests,
            healthyCount: healthyTargets.length,
            droppedTarget: failureState === 'healthy' ? 'none' : 'api-b removed after failed health checks',
            distribution,
            takeaway:
                failureState === 'healthy'
                    ? 'With all instances healthy, the reverse proxy can spread load evenly and keep no single backend overloaded.'
                    : 'Once health checks fail, the proxy stops sending traffic to the unhealthy instance and redistributes requests to the remaining pool.',
        };
    }, [failureState, trafficPattern]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[600px]" icon={ArrowLeftRight} title="Reverse Proxy Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <ArrowLeftRight className="text-cyan-400" />
                        Reverse Proxy Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Toggle traffic shape and backend health to see how a reverse proxy redistributes requests and protects unhealthy instances.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Traffic Pattern</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {(['steady', 'spiky'] as const).map(pattern => (
                                <button
                                    key={pattern}
                                    type="button"
                                    onClick={() => setTrafficPattern(pattern)}
                                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                        trafficPattern === pattern ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{pattern === 'steady' ? 'Steady Flow' : 'Spike Burst'}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{pattern === 'steady' ? 'Ordinary request volume' : 'Sudden burst of traffic'}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Backend Health</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {(['healthy', 'api-b-down'] as const).map(state => (
                                <button
                                    key={state}
                                    type="button"
                                    onClick={() => setFailureState(state)}
                                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                        failureState === state ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{state === 'healthy' ? 'All Healthy' : 'api-b Fails'}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{state === 'healthy' ? 'Full target pool available' : 'Health checks remove one backend'}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Incoming Requests" value={`${simulation.requests}`} tone="cyan" />
                        <LabMetricCard label="Healthy Targets" value={`${simulation.healthyCount}`} tone="emerald" />
                        <LabMetricCard label="Removed Target" value={simulation.droppedTarget} tone="amber" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            <Route size={14} />
                            <span>Traffic Distribution</span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                            {Object.entries(simulation.distribution).map(([server, count]) => (
                                <div key={server} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">{server}</p>
                                    <p className="mt-3 text-2xl font-black text-white">{count}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">requests routed here</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="Health Check Takeaway"
                            tone="emerald"
                            body="Reverse proxies are not just request splitters. They continuously observe backend health so failed instances can be taken out of rotation before more users are impacted."
                        />
                        <LabMiniCard
                            title="Routing Takeaway"
                            tone="sky"
                            body={
                                trafficPattern === 'spiky'
                                    ? 'Burst traffic makes distribution strategy visible quickly. A healthy pool absorbs spikes better than a single backend ever could.'
                                    : 'Even steady traffic benefits from consistent routing because it prevents one instance from becoming a silent bottleneck.'
                            }
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Activity size={14} />
                            <span>Proxy Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Load balancing decisions are tied to health checks, not just a naive round-robin counter.</li>
                            <li>Reverse proxies can terminate TLS, route to different services, and shield clients from internal topology changes.</li>
                            <li>When one backend fails, the goal is not perfect fairness; it is keeping the overall service available.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <ShieldPlus size={14} />
                            <span>System Outcome</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{simulation.takeaway}</p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
