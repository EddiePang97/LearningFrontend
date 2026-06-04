import { useMemo, useState } from 'react';
import { AlertTriangle, FolderLock, Shield, Waypoints } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Surface = 'public-api' | 'file-upload' | 'admin-panel' | 'webhook';

const SURFACES: Array<{ id: Surface; label: string; note: string }> = [
    { id: 'public-api', label: 'Public API', note: 'Large attack surface with anonymous traffic and abuse risk.' },
    { id: 'file-upload', label: 'File upload', note: 'High parsing and storage risk with untrusted payloads.' },
    { id: 'admin-panel', label: 'Admin panel', note: 'Smaller surface, but high blast radius if compromised.' },
    { id: 'webhook', label: 'Third-party webhook', note: 'Trusted-looking traffic that still needs signature and replay protection.' },
];

export const ThreatModelLab = () => {
    const [surface, setSurface] = useState<Surface>('admin-panel');

    const result = useMemo(() => {
        switch (surface) {
            case 'public-api':
                return {
                    likelyAttacker: 'abusive automation or credential stuffing',
                    criticalAsset: 'availability and identity boundary',
                    firstControl: 'rate limit + auth hardening',
                    takeaway: 'For public APIs, the first job is usually reducing unauthenticated abuse before deeper business logic can even matter.',
                };
            case 'file-upload':
                return {
                    likelyAttacker: 'malicious content or parser abuse',
                    criticalAsset: 'storage boundary and processing workers',
                    firstControl: 'type validation + isolation + scanning',
                    takeaway: 'Uploads look like a feature, but they often hide the widest parser and storage attack surface in the system.',
                };
            case 'webhook':
                return {
                    likelyAttacker: 'forged or replayed callback sender',
                    criticalAsset: 'state transition integrity',
                    firstControl: 'signature verification + idempotency',
                    takeaway: 'Webhook threats are about trust confusion: traffic arrives from the outside but looks like privileged business truth.',
                };
            default:
                return {
                    likelyAttacker: 'privilege escalation or stolen operator session',
                    criticalAsset: 'high-risk controls and internal data',
                    firstControl: 'strong auth + least privilege + audit trail',
                    takeaway: 'Admin surfaces are small but dangerous. Threat modeling should prioritize blast radius, not just request volume.',
                };
        }
    }, [surface]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Shield} title="Threat Model Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Shield className="text-cyan-400" />
                        Threat Model Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Choose a backend surface and map who is most likely to attack it, what asset matters most, and which control should be prioritized first.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Backend Surface</p>
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
                        <LabMetricCard label="Likely Attacker" value={result.likelyAttacker} tone="amber" />
                        <LabMetricCard label="Critical Asset" value={result.criticalAsset} tone="violet" />
                        <LabMetricCard label="First Control" value={result.firstControl} tone="emerald" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Waypoints size={14} />
                                <span>Threat Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">ask first</div>
                                    <div className="mt-2 text-sm font-semibold text-white">Who attacks this and how?</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">then ask</div>
                                    <div className="mt-2 text-sm font-semibold text-white">What loss hurts most if this breaks?</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Threat Modeling Is Ranking"
                                tone="sky"
                                body="The point is not to list every scary possibility. It is to rank likely attacker, valuable asset, and cheapest high-leverage control for the current stage."
                            />
                            <LabMiniCard
                                title="Blast Radius Matters"
                                tone="violet"
                                body="A small admin surface may deserve more urgency than a larger public surface if compromise there hands over the whole system."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <FolderLock size={14} />
                            <span>Threat Modeling Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>List the surface, likely attacker, critical asset, and first control before discussing tools or middleware brands.</li>
                            <li>Prioritize by expected damage and realistic attack path, not just by which topic sounds most security-like.</li>
                            <li>Good threat modeling narrows the next engineering move instead of ending as a generic security brainstorm.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <AlertTriangle size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Security resources are always limited. Threat modeling is how teams decide which boundary to strengthen first instead of spreading effort evenly across the wrong problems.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
