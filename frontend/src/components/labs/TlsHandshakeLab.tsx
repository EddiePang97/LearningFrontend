import { useMemo, useState } from 'react';
import { Fingerprint, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type CertificateState = 'valid' | 'wrong-host' | 'untrusted';
type TlsVersion = 'tls13' | 'tls12';

const CERT_OPTIONS: Array<{ id: CertificateState; label: string; note: string }> = [
    { id: 'valid', label: 'Valid Certificate', note: 'Hostname matches and the chain is trusted.' },
    { id: 'wrong-host', label: 'Wrong Hostname', note: 'Certificate belongs to a different domain.' },
    { id: 'untrusted', label: 'Untrusted Issuer', note: 'Certificate chain is not anchored in a trusted CA.' },
];

export const TlsHandshakeLab = () => {
    const [certificateState, setCertificateState] = useState<CertificateState>('valid');
    const [tlsVersion, setTlsVersion] = useState<TlsVersion>('tls13');

    const simulation = useMemo(() => {
        const secure = certificateState === 'valid';
        const status = secure ? 'HANDSHAKE SUCCEEDED' : 'HANDSHAKE BLOCKED';
        const sessionKey = secure ? (tlsVersion === 'tls13' ? 'Ephemeral session key issued immediately' : 'Session key issued after extra negotiation') : 'No session key created';
        const rounds = tlsVersion === 'tls13' ? 1 : 2;
        const trustMessage =
            certificateState === 'valid'
                ? 'Browser confirms the certificate matches the hostname and chains back to a trusted issuer.'
                : certificateState === 'wrong-host'
                    ? 'Browser sees encryption is possible, but the certificate identity does not belong to the site the user asked for.'
                    : 'Browser cannot extend trust to the certificate chain, so it refuses to treat the site as authenticated.';

        return {
            secure,
            status,
            sessionKey,
            rounds,
            trustMessage,
            warning:
                certificateState === 'valid'
                    ? 'TLS protects the channel and verifies the server identity before application data flows.'
                    : 'Without a valid identity chain, encryption alone is not enough. The browser warns before sensitive traffic continues.',
        };
    }, [certificateState, tlsVersion]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[600px]" icon={LockKeyhole} title="TLS Handshake Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <LockKeyhole className="text-emerald-400" />
                        TLS Handshake Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Explore how TLS version and certificate trust affect whether the browser finishes the handshake or blocks the connection.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Certificate Check</p>
                        <div className="mt-4 space-y-3">
                            {CERT_OPTIONS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setCertificateState(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        certificateState === option.id ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">TLS Version</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {(['tls13', 'tls12'] as const).map(version => (
                                <button
                                    key={version}
                                    type="button"
                                    onClick={() => setTlsVersion(version)}
                                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                        tlsVersion === version ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{version === 'tls13' ? 'TLS 1.3' : 'TLS 1.2'}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{version === 'tls13' ? 'Fewer round trips' : 'Older negotiation flow'}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Handshake" value={simulation.status} tone={simulation.secure ? 'emerald' : 'amber'} />
                        <LabMetricCard label="Round Trips" value={`${simulation.rounds}`} tone="cyan" />
                        <LabMetricCard label="Session Key" value={simulation.sessionKey} tone="violet" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <ShieldCheck size={14} />
                            <span>Trust Decision</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{simulation.trustMessage}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="Certificate Takeaway"
                            tone="emerald"
                            body={
                                certificateState === 'valid'
                                    ? 'A trusted certificate proves the browser is talking to the expected host, not just an encrypted stranger.'
                                    : 'If hostname or issuer trust fails, the browser treats the identity proof as broken even if the transport could still be encrypted.'
                            }
                        />
                        <LabMiniCard
                            title="Version Takeaway"
                            tone="sky"
                            body={
                                tlsVersion === 'tls13'
                                    ? 'TLS 1.3 shortens negotiation so secure connections start faster and expose fewer legacy choices.'
                                    : 'TLS 1.2 still protects traffic, but it usually needs more negotiation steps and carries more historical complexity.'
                            }
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <Fingerprint size={14} />
                            <span>Handshake Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Before HTTP data is trusted, the browser wants both an encrypted channel and proof that the certificate belongs to the requested host.</li>
                            <li>TLS handshake time is part of perceived latency, especially on first connection or cold start paths.</li>
                            <li>Certificate warnings usually point to identity chain issues, while mixed content warnings point to unsafe resources inside an otherwise secure page.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            <KeyRound size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{simulation.warning}</p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
