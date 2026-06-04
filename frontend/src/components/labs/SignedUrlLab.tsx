import { useMemo, useState } from 'react';
import { Clock3, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { LabFrame } from './LabFrame';

type Viewer = 'guest' | 'member' | 'admin';
type AssetMode = 'public' | 'private';

const VIEWERS: Array<{ id: Viewer; label: string; hint: string }> = [
    { id: 'guest', label: 'Guest', hint: 'No authenticated session attached to the request.' },
    { id: 'member', label: 'Member', hint: 'Authenticated user with ordinary download rights.' },
    { id: 'admin', label: 'Admin', hint: 'Privileged operator who can generate secure links.' },
];

export const SignedUrlLab = () => {
    const [viewer, setViewer] = useState<Viewer>('member');
    const [assetMode, setAssetMode] = useState<AssetMode>('private');
    const [ttlMinutes, setTtlMinutes] = useState(10);

    const result = useMemo(() => {
        const canGenerate = viewer === 'admin' || viewer === 'member';
        const canAccess = assetMode === 'public' || viewer !== 'guest';
        const expiresAt = `${ttlMinutes} minute${ttlMinutes === 1 ? '' : 's'}`;

        if (assetMode === 'public') {
            return {
                status: 'PUBLIC DELIVERY',
                accent: 'text-green-300',
                explanation: 'This asset can be served directly through CDN without a signed URL because access is intentionally public.',
            };
        }

        if (!canGenerate) {
            return {
                status: 'DENY GENERATION',
                accent: 'text-red-300',
                explanation: 'Guests should not receive a signed URL because the backend cannot verify who is asking for the private asset.',
            };
        }

        if (!canAccess) {
            return {
                status: 'ACCESS BLOCKED',
                accent: 'text-red-300',
                explanation: 'The backend must reject the request before any object storage URL is issued.',
            };
        }

        return {
            status: `SIGNED URL ACTIVE (${expiresAt})`,
            accent: 'text-cyan-300',
            explanation: 'Backend verifies identity, then issues a short-lived signed URL so the file can be fetched without exposing the bucket publicly.',
        };
    }, [assetMode, ttlMinutes, viewer]);

    return (
        <LabFrame className="relative min-h-[480px] md:min-h-[600px] w-full" icon={KeyRound} title="Signed URL Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <KeyRound className="text-cyan-400" />
                        Signed URL Access Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Explore when the backend should issue a signed object-storage URL and when it should reject the request.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Requester</p>
                        <div className="mt-4 space-y-3">
                            {VIEWERS.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setViewer(item.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        viewer === item.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{item.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{item.hint}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Asset Visibility</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setAssetMode('public')}
                                className={`rounded-2xl border px-4 py-3 text-xs font-bold transition-all ${
                                    assetMode === 'public' ? 'border-green-400/40 bg-green-500/10 text-white' : 'border-white/8 bg-black/20 text-gray-400'
                                }`}
                            >
                                Public
                            </button>
                            <button
                                type="button"
                                onClick={() => setAssetMode('private')}
                                className={`rounded-2xl border px-4 py-3 text-xs font-bold transition-all ${
                                    assetMode === 'private' ? 'border-cyan-400/40 bg-cyan-500/10 text-white' : 'border-white/8 bg-black/20 text-gray-400'
                                }`}
                            >
                                Private
                            </button>
                        </div>

                        <div className="mt-5">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">URL TTL</p>
                                <span className="text-xs font-bold text-white">{ttlMinutes} min</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="60"
                                value={ttlMinutes}
                                onChange={event => setTtlMinutes(Number(event.target.value))}
                                className="mt-3 w-full accent-cyan-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <MetricCard icon={Lock} label="Asset Mode" value={assetMode === 'public' ? 'Public CDN' : 'Private Object'} accent="text-cyan-300" />
                        <MetricCard icon={Clock3} label="TTL" value={`${ttlMinutes} min`} accent="text-amber-300" />
                        <MetricCard icon={ShieldCheck} label="Decision" value={result.status} accent={result.accent} />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">Policy Outcome</p>
                        <p className={`mt-3 text-sm font-black ${result.accent}`}>{result.status}</p>
                        <p className="mt-3 text-sm leading-7 text-gray-200">{result.explanation}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Signed URL Checklist</p>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Issue signed URLs only after the backend verifies identity and access rights.</li>
                            <li>Keep TTL short enough to reduce leakage risk, but long enough for real download flows.</li>
                            <li>Public assets and private assets should not share the same delivery policy by accident.</li>
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
    icon: typeof KeyRound;
    label: string;
    value: string;
    accent: string;
}) => (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <Icon size={14} />
            <span>{label}</span>
        </div>
        <p className={`mt-3 text-sm font-black ${accent}`}>{value}</p>
    </div>
);
