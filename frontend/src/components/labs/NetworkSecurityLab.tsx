import { useMemo, useState } from 'react';
import { Lock, ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Threat = 'cors' | 'csrf' | 'mitm' | 'credential-abuse';
type DefenseLayer = 'browser' | 'transport' | 'edge' | 'application';

const THREATS: Array<{ id: Threat; label: string; note: string }> = [
    { id: 'cors', label: 'Cross-Origin Read Attempt', note: 'A site tries to read data from another origin through the browser.' },
    { id: 'csrf', label: 'Forged Authenticated Action', note: 'A victim browser is tricked into sending an unwanted state-changing request.' },
    { id: 'mitm', label: 'Man-in-the-Middle Interception', note: 'An attacker tries to observe or tamper with traffic on the path.' },
    { id: 'credential-abuse', label: 'Abusive Credentialed Traffic', note: 'High-volume authenticated traffic hits the edge and business API.' },
];

const LAYERS: Array<{ id: DefenseLayer; label: string; note: string }> = [
    { id: 'browser', label: 'Browser Boundary', note: 'Same-origin and credential sending behavior in the browser.' },
    { id: 'transport', label: 'Transport Security', note: 'TLS channel protection and certificate trust.' },
    { id: 'edge', label: 'Edge / WAF Layer', note: 'Proxy, rate limiting, filtering, and coarse traffic protection.' },
    { id: 'application', label: 'Application Logic', note: 'Authorization, anti-forgery tokens, and business rule checks.' },
];

export const NetworkSecurityLab = () => {
    const [threat, setThreat] = useState<Threat>('cors');
    const [layer, setLayer] = useState<DefenseLayer>('browser');

    const verdict = useMemo(() => {
        const bestLayer: Record<Threat, DefenseLayer> = {
            cors: 'browser',
            csrf: 'application',
            mitm: 'transport',
            'credential-abuse': 'edge',
        };

        const status =
            layer === bestLayer[threat]
                ? 'BEST PRIMARY DEFENSE'
                : layer === 'application' && threat === 'credential-abuse'
                    ? 'USEFUL, BUT LATE'
                    : 'PARTIAL OR MISALIGNED';

        const explanation =
            threat === 'cors'
                ? layer === 'browser'
                    ? 'CORS lives in the browser’s read boundary. The key question is whether scripts on one origin may read responses from another.'
                    : 'Other layers may help indirectly, but CORS is fundamentally about browser-enforced cross-origin read policy.'
                : threat === 'csrf'
                    ? layer === 'application'
                        ? 'CSRF is about a valid browser sending an unwanted authenticated action. The app must validate intent with tokens or same-site protections.'
                        : 'Transport and edge defenses do not understand whether the user truly intended the state change.'
                    : threat === 'mitm'
                        ? layer === 'transport'
                            ? 'MITM risk is primarily reduced by TLS, certificate trust, and refusing unsafe transport paths.'
                            : 'Other layers may notice symptoms, but they do not replace a trusted encrypted transport channel.'
                        : layer === 'edge'
                            ? 'Rate limiting and WAF-style controls are strongest when abuse first hits the perimeter, before downstream systems get saturated.'
                            : 'Application checks still matter, but if you wait too long to react, abusive traffic can already create load and cost damage.';

        return {
            bestLayer: bestLayer[threat],
            status,
            explanation,
        };
    }, [layer, threat]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[600px]" icon={ShieldAlert} title="Network Security Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <ShieldAlert className="text-red-400" />
                        Network Security Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Match each threat to the layer that should carry the primary defense so browser policy, transport protection, edge filtering, and application checks stop getting mixed together.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Threat</p>
                        <div className="mt-4 space-y-3">
                            {THREATS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setThreat(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        threat === option.id ? 'border-red-400/40 bg-red-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Defense Layer</p>
                        <div className="mt-4 space-y-3">
                            {LAYERS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setLayer(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        layer === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Selected Layer" value={layer} tone="cyan" />
                        <LabMetricCard label="Best Primary Layer" value={verdict.bestLayer} tone="emerald" />
                        <LabMetricCard label="Verdict" value={verdict.status} tone="amber" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-300">
                            <TriangleAlert size={14} />
                            <span>Threat Mapping</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{verdict.explanation}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="Layering Rule"
                            tone="sky"
                            body="The most stable security systems ask first where the threat originates, then put the first strong control as close as possible to that boundary."
                        />
                        <LabMiniCard
                            title="Common Confusion"
                            tone="violet"
                            body="CORS is not CSRF, HTTPS is not a substitute for authorization, and WAFs are not a replacement for application logic. Similar names do not mean identical layers."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Lock size={14} />
                            <span>Defense Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Browser-boundary problems want browser-boundary thinking first.</li>
                            <li>Transport-channel problems want trusted encryption and certificate verification first.</li>
                            <li>Abusive traffic wants perimeter controls early, but application authorization still remains mandatory.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <ShieldCheck size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Security conversations get messy when teams skip the “which layer owns this threat?” question. Clear threat-to-layer mapping turns vague fear into concrete defensive design.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
