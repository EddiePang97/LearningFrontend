import { useMemo, useState } from 'react';
import { Cookie, Database, Fingerprint, ShieldCheck } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type SessionCase = 'fresh-login' | 'valid-cookie' | 'expired-session' | 'missing-cookie';

const SESSION_CASES: Array<{ id: SessionCase; label: string; note: string }> = [
    { id: 'fresh-login', label: 'Fresh login', note: 'Server authenticates the user and creates a new session record before the browser stores a cookie.' },
    { id: 'valid-cookie', label: 'Returning request', note: 'Browser sends the session cookie back and the server restores identity from its own session store.' },
    { id: 'expired-session', label: 'Expired session', note: 'Cookie still exists in the browser, but the backing session record is gone or expired server-side.' },
    { id: 'missing-cookie', label: 'No cookie attached', note: 'Request reaches a protected route without the session identifier needed to resume identity.' },
];

const RESULT_MAP: Record<SessionCase, {
    browserState: string;
    serverState: string;
    backendDecision: string;
    takeaway: string;
    contractLine: string;
    tone: 'emerald' | 'violet' | 'amber';
}> = {
    'fresh-login': {
        browserState: 'stores session id cookie',
        serverState: 'creates session record',
        backendDecision: 'issue Set-Cookie and mark session active',
        takeaway: 'In a session-based flow, the browser keeps only the identifier while the meaningful login state lives on the server side.',
        contractLine: 'cookie is a pointer, session is the real state',
        tone: 'emerald',
    },
    'valid-cookie': {
        browserState: 'sends session id automatically',
        serverState: 'looks up user and session metadata',
        backendDecision: 'restore authenticated identity',
        takeaway: 'A valid cookie does not prove identity by itself. The backend still has to find a matching live session record before trusting the request.',
        contractLine: 'session store is the source of truth',
        tone: 'violet',
    },
    'expired-session': {
        browserState: 'still has old cookie',
        serverState: 'cannot find usable session',
        backendDecision: 'treat request as logged out',
        takeaway: 'With server-side sessions, invalidation is controlled centrally. Even if a stale cookie survives in the browser, the session can already be dead.',
        contractLine: 'cookie presence is not enough',
        tone: 'amber',
    },
    'missing-cookie': {
        browserState: 'sends no session id',
        serverState: 'has no lookup key',
        backendDecision: 'deny protected access or redirect to login',
        takeaway: 'Without the session identifier, the backend has no way to reconnect the request to server-held login state, so protected routes should stay closed.',
        contractLine: 'no cookie means no session lookup',
        tone: 'amber',
    },
};

export const SessionCookieLab = () => {
    const [sessionCase, setSessionCase] = useState<SessionCase>('valid-cookie');
    const result = useMemo(() => RESULT_MAP[sessionCase], [sessionCase]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Cookie} title="Session Cookie Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Cookie className="text-cyan-400" />
                        Session Cookie Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between login and request states to see how browser cookies and server-held sessions cooperate in a stateful authentication flow.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Flow State</p>
                        <div className="mt-4 space-y-3">
                            {SESSION_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSessionCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        sessionCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Browser State" value={result.browserState} tone="cyan" />
                        <LabMetricCard label="Server State" value={result.serverState} tone="violet" />
                        <LabMetricCard label="Backend Decision" value={result.backendDecision} tone={result.tone} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Fingerprint size={14} />
                                <span>Session Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">contract line</div>
                                <div className="mt-2 text-sm font-semibold text-white">{result.contractLine}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Cookie Is Not The Whole Login"
                                tone="sky"
                                body="The cookie usually carries only a session identifier. The authenticated state, expiry, and revoked status still live in server-owned storage."
                            />
                            <LabMiniCard
                                title="Central Invalidation Is Easier"
                                tone="violet"
                                body="Because the server owns the session record, logout and expiry can take effect immediately even if an old cookie is still sitting in the browser."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <Database size={14} />
                            <span>Session Flow Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>After login, store only a lookup key in the browser and keep meaningful session state on the server.</li>
                            <li>On each protected request, resolve the cookie back to a live session record before trusting identity.</li>
                            <li>If the server-side session disappears or expires, treat the request as logged out even if the browser still sends the old cookie.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <ShieldCheck size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Session-based auth teaches an important backend boundary: the browser can help carry a lookup key, but the server remains the owner of whether the login is still real, current, and allowed to continue.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
