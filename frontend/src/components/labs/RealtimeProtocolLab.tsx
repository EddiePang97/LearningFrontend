import { useMemo, useState } from 'react';
import { Activity, ArrowUpDown, Radio, Waves } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Scenario = 'notifications' | 'chat' | 'market-data';
type Protocol = 'websocket' | 'sse' | 'long-polling';

const SCENARIOS: Array<{ id: Scenario; label: string; traffic: string; note: string }> = [
    { id: 'notifications', label: 'Notification Feed', traffic: 'low', note: 'Mostly server-to-client events, low send frequency.' },
    { id: 'chat', label: 'Team Chat', traffic: 'medium', note: 'Frequent two-way messages with typing and delivery signals.' },
    { id: 'market-data', label: 'Live Ticker', traffic: 'high', note: 'Very frequent updates where connection overhead becomes visible quickly.' },
];

const PROTOCOLS: Array<{ id: Protocol; label: string; duplex: string; ops: string }> = [
    { id: 'websocket', label: 'WebSocket', duplex: 'full duplex', ops: 'higher connection management' },
    { id: 'sse', label: 'SSE', duplex: 'server -> client', ops: 'simple event stream' },
    { id: 'long-polling', label: 'Long Polling', duplex: 'request -> response loop', ops: 'easy infra, chatty network usage' },
];

export const RealtimeProtocolLab = () => {
    const [scenario, setScenario] = useState<Scenario>('notifications');
    const [protocol, setProtocol] = useState<Protocol>('sse');

    const simulation = useMemo(() => {
        const scenarioMeta = SCENARIOS.find(item => item.id === scenario)!;
        const protocolMeta = PROTOCOLS.find(item => item.id === protocol)!;

        const score =
            scenario === 'notifications'
                ? protocol === 'sse'
                    ? 'BEST FIT'
                    : protocol === 'websocket'
                        ? 'WORKS, MAYBE OVERKILL'
                        : 'WORKS, EXTRA OVERHEAD'
                : scenario === 'chat'
                    ? protocol === 'websocket'
                        ? 'BEST FIT'
                        : protocol === 'sse'
                            ? 'LIMITED'
                            : 'FRAGILE UNDER LOAD'
                    : protocol === 'websocket'
                        ? 'BEST FIT'
                        : protocol === 'sse'
                            ? 'OK FOR ONE-WAY FEEDS'
                            : 'TOO CHATTY';

        const connectionCost =
            protocol === 'websocket'
                ? 'One long-lived socket, low repeat handshake cost.'
                : protocol === 'sse'
                    ? 'One event stream, simple reconnect story, one-way only.'
                    : 'Repeated HTTP request loop, easy to deploy but heavier under frequent updates.';

        const tradeoff =
            protocol === 'websocket'
                ? 'Choose this when the client must also speak back often, not just listen.'
                : protocol === 'sse'
                    ? 'Choose this when the server mainly pushes events and infra simplicity matters.'
                    : 'Choose this only when real realtime needs are modest or infrastructure constraints are strict.';

        return {
            scenarioMeta,
            protocolMeta,
            score,
            connectionCost,
            tradeoff,
        };
    }, [protocol, scenario]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[600px]" icon={Radio} title="Realtime Protocol Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Radio className="text-violet-400" />
                        Realtime Protocol Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Match a realtime scenario with WebSocket, SSE, or long polling and see how directionality, update rate, and ops cost change the best choice.
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
                                        scenario === option.id ? 'border-violet-400/40 bg-violet-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Protocol</p>
                        <div className="mt-4 space-y-3">
                            {PROTOCOLS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setProtocol(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        protocol === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">
                                        {option.duplex} | {option.ops}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Scenario Load" value={simulation.scenarioMeta.traffic} tone="amber" />
                        <LabMetricCard label="Direction" value={simulation.protocolMeta.duplex} tone="cyan" />
                        <LabMetricCard label="Fit Score" value={simulation.score} tone="emerald" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">
                            <ArrowUpDown size={14} />
                            <span>Protocol Tradeoff</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{simulation.connectionCost}</p>
                        <p className="mt-3 text-sm leading-7 text-gray-300">{simulation.tradeoff}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="Selection Heuristic"
                            tone="sky"
                            body={
                                scenario === 'notifications'
                                    ? 'Notification streams usually favor server-push simplicity over full two-way channels.'
                                    : scenario === 'chat'
                                        ? 'Chat usually needs client and server to talk back often, so duplex capability matters more.'
                                        : 'High-frequency market or telemetry feeds expose protocol overhead quickly, so connection efficiency becomes critical.'
                            }
                        />
                        <LabMiniCard
                            title="Ops Heuristic"
                            tone="violet"
                            body={
                                protocol === 'websocket'
                                    ? 'You gain flexibility, but you also take on stateful connection handling, reconnect logic, and more operational nuance.'
                                    : protocol === 'sse'
                                        ? 'SSE is easier to operate for one-way event streams because it stays close to HTTP semantics.'
                                        : 'Long polling works almost anywhere, but frequent reconnect loops turn infrastructure simplicity into runtime cost.'
                            }
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Activity size={14} />
                            <span>Realtime Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Ask whether the client must also send frequent messages back, not just receive updates.</li>
                            <li>Ask how expensive reconnects become when updates are frequent or continuous.</li>
                            <li>Ask whether your infra and observability stack handle long-lived stateful connections comfortably.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            <Waves size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Realtime protocol choice is not a popularity contest. It is a tradeoff among message direction, connection lifetime, update frequency, and operational cost.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
