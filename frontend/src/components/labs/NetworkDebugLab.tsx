import { useMemo, useState } from 'react';
import { Bug, Compass, SearchCode, Terminal } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Symptom = 'http-error' | 'dns-mismatch' | 'route-latency' | 'tls-weirdness';
type Tool = 'curl' | 'dig' | 'traceroute' | 'wireshark' | 'devtools';

const SYMPTOMS: Array<{ id: Symptom; label: string; hint: string }> = [
    { id: 'http-error', label: 'API returns unexpected 500 / 404', hint: 'Need to inspect request/response details quickly.' },
    { id: 'dns-mismatch', label: 'Domain resolves to the wrong place', hint: 'Likely a name or propagation issue before app code.' },
    { id: 'route-latency', label: 'Only some users see strange network delay', hint: 'Could be path or transit behavior outside the app.' },
    { id: 'tls-weirdness', label: 'Handshake or packet-level behavior looks suspicious', hint: 'Need lower-level evidence than status codes alone.' },
];

const TOOLS: Array<{ id: Tool; label: string; scope: string }> = [
    { id: 'curl', label: 'curl', scope: 'Replay HTTP requests and inspect headers/status/body.' },
    { id: 'dig', label: 'dig', scope: 'Inspect DNS answers and resolver behavior.' },
    { id: 'traceroute', label: 'traceroute', scope: 'Inspect path and per-hop routing latency.' },
    { id: 'wireshark', label: 'Wireshark', scope: 'Capture packets and inspect lower-level protocol details.' },
    { id: 'devtools', label: 'DevTools', scope: 'Inspect browser waterfall, timing, headers, and resource behavior.' },
];

export const NetworkDebugLab = () => {
    const [symptom, setSymptom] = useState<Symptom>('http-error');
    const [tool, setTool] = useState<Tool>('curl');

    const result = useMemo(() => {
        const bestTool: Record<Symptom, Tool> = {
            'http-error': 'curl',
            'dns-mismatch': 'dig',
            'route-latency': 'traceroute',
            'tls-weirdness': 'wireshark',
        };

        const fallbackTool: Record<Symptom, Tool> = {
            'http-error': 'devtools',
            'dns-mismatch': 'curl',
            'route-latency': 'devtools',
            'tls-weirdness': 'curl',
        };

        const score =
            tool === bestTool[symptom]
                ? 'BEST FIRST MOVE'
                : tool === fallbackTool[symptom]
                    ? 'PARTIAL SIGNAL'
                    : 'LIKELY TOO INDIRECT';

        const evidence =
            symptom === 'http-error'
                ? tool === 'curl'
                    ? 'You can replay the request outside the browser and inspect status code, headers, and body with minimal noise.'
                    : tool === 'devtools'
                        ? 'Useful if the bug only reproduces in-browser, but still focused on HTTP-layer evidence.'
                        : 'This tool skips the fastest layer where request/response truth is visible.'
                : symptom === 'dns-mismatch'
                    ? tool === 'dig'
                        ? 'You can inspect DNS answers, TTL, and resolver differences before touching any application logic.'
                        : 'This may show downstream symptoms, but it does not answer the DNS question directly.'
                    : symptom === 'route-latency'
                        ? tool === 'traceroute'
                            ? 'You can observe hop-by-hop path behavior and spot where latency or routing asymmetry appears.'
                            : 'This may show slow outcomes, but it is weaker at proving where the path itself is degrading.'
                        : tool === 'wireshark'
                            ? 'Packet capture helps when handshake, retransmission, or low-level protocol details are the core uncertainty.'
                            : 'You may see a visible symptom, but not the deeper transport evidence yet.';

        return {
            bestTool: bestTool[symptom],
            score,
            evidence,
        };
    }, [symptom, tool]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[600px]" icon={Bug} title="Network Debug Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Bug className="text-amber-400" />
                        Network Debug Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Start from a symptom, choose a tool, and see whether you are collecting first-layer evidence or skipping to a noisier layer too early.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Symptom</p>
                        <div className="mt-4 space-y-3">
                            {SYMPTOMS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSymptom(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        symptom === option.id ? 'border-amber-400/40 bg-amber-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.hint}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">First Tool</p>
                        <div className="mt-4 space-y-3">
                            {TOOLS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setTool(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        tool === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.scope}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Selected Tool" value={tool} tone="cyan" />
                        <LabMetricCard label="Best First Tool" value={result.bestTool} tone="emerald" />
                        <LabMetricCard label="Decision Score" value={result.score} tone="amber" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <SearchCode size={14} />
                            <span>Evidence Readout</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{result.evidence}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="Layer Heuristic"
                            tone="sky"
                            body="Start as close as possible to the layer where the symptom lives. HTTP symptoms want HTTP tools; naming symptoms want DNS tools; transport weirdness may need path or packet tools."
                        />
                        <LabMiniCard
                            title="Cost Heuristic"
                            tone="violet"
                            body="Heavier tools like Wireshark are powerful, but they cost more attention. Use them when lighter tools cannot answer the question, not before."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Terminal size={14} />
                            <span>Debug Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Pick the tool that speaks the same layer as the symptom before you reach for broader or heavier tooling.</li>
                            <li>Use curl and DevTools for HTTP truth, dig for name resolution, traceroute for path suspicion, and Wireshark for packet-level uncertainty.</li>
                            <li>Good debugging is not about using the fanciest tool; it is about removing the most uncertainty with the least noise.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            <Compass size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Network debugging gets expensive when people skip layers and start guessing. The right first tool narrows the problem before code changes make the picture noisier.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
