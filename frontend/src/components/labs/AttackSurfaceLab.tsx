import { useMemo, useState } from 'react';
import { Globe, KeyRound, Shield, Upload, Webhook } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Surface = 'public-api' | 'login' | 'file-upload' | 'admin' | 'webhook';

const SURFACES: Array<{ id: Surface; label: string; note: string }> = [
    { id: 'public-api', label: 'Public API', note: 'Wide traffic exposure, anonymous access, and abuse pressure.' },
    { id: 'login', label: 'Login / signup', note: 'Identity entrypoint with credential abuse and account takeover risk.' },
    { id: 'file-upload', label: 'File upload', note: 'Untrusted payloads can pressure parsing, storage, and execution boundaries.' },
    { id: 'admin', label: 'Admin panel', note: 'Narrower traffic surface, but very high privilege blast radius.' },
    { id: 'webhook', label: 'Third-party callback', note: 'External source that may look trusted if signatures and replay controls are weak.' },
];

export const AttackSurfaceLab = () => {
    const [surface, setSurface] = useState<Surface>('public-api');

    const result = useMemo(() => {
        switch (surface) {
            case 'login':
                return {
                    icon: KeyRound,
                    asset: 'identity and session integrity',
                    priority: 'credential abuse, brute force, recovery flow hardening',
                    firstControl: 'rate limit + MFA / lockout posture',
                    takeaway: 'Login is not just a form. It is the front door to every downstream privilege in the system.',
                };
            case 'file-upload':
                return {
                    icon: Upload,
                    asset: 'processing workers and storage boundary',
                    priority: 'malicious files, parser bombs, MIME confusion',
                    firstControl: 'strict validation + isolation + scanning',
                    takeaway: 'Uploads combine user-controlled bytes with expensive backend processing, so they deserve earlier threat attention than many teams give them.',
                };
            case 'admin':
                return {
                    icon: Shield,
                    asset: 'high-privilege controls and sensitive operations',
                    priority: 'session theft, privilege escalation, operator misuse',
                    firstControl: 'strong auth + least privilege + audit log',
                    takeaway: 'Admin surfaces are small in traffic but huge in blast radius, which is why they often deserve outsized protection.',
                };
            case 'webhook':
                return {
                    icon: Webhook,
                    asset: 'state transition trust',
                    priority: 'forged source, replay, duplicate delivery',
                    firstControl: 'signature verification + idempotency',
                    takeaway: 'Callback endpoints are an easy place to accept false truth unless the backend verifies who sent the event and whether it already acted on it.',
                };
            default:
                return {
                    icon: Globe,
                    asset: 'availability and public request budget',
                    priority: 'abuse, enumeration, cost amplification',
                    firstControl: 'auth boundary + rate shaping + input limits',
                    takeaway: 'Public APIs are broad attack surfaces because anyone can reach them, so early controls must focus on abuse containment and cost control.',
                };
        }
    }, [surface]);

    const Icon = result.icon;

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Shield} title="Attack Surface Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Shield className="text-cyan-400" />
                        Attack Surface Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare common backend entrypoints and see which asset each one exposes first, what kind of attacker pressure is realistic, and which control should go in earliest.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Backend Entry Surface</p>
                        <div className="mt-4 space-y-3">
                            {SURFACES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSurface(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        surface === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Critical Asset" value={result.asset} tone="violet" />
                        <LabMetricCard label="Likely Pressure" value={result.priority} tone="amber" />
                        <LabMetricCard label="First Control" value={result.firstControl} tone="emerald" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Icon size={14} />
                                <span>Surface Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">ask first</div>
                                    <div className="mt-2 text-sm font-semibold text-white">What does this surface expose?</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">then ask</div>
                                    <div className="mt-2 text-sm font-semibold text-white">What is the cheapest strong first barrier?</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Surfaces Are Not Equal"
                                tone="sky"
                                body="A public API, file upload, admin panel, and webhook may all be “HTTP endpoints,” but they expose different assets and need different first defenses."
                            />
                            <LabMiniCard
                                title="Prioritize By Damage"
                                tone="violet"
                                body="Attack surface review is most useful when it helps the team rank what to harden next instead of treating every entrypoint as equally urgent."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <Shield size={14} />
                            <span>Surface Review Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>List the entrypoints that accept outside traffic before choosing any specific mitigation.</li>
                            <li>Map each surface to the asset it exposes and the most realistic abuse pattern.</li>
                            <li>Pick the first protective barrier that meaningfully shrinks risk without pretending every issue can be solved at once.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
