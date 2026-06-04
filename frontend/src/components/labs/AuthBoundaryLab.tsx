import { useMemo, useState } from 'react';
import { KeyRound, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type AccessCase = 'guest-delete' | 'member-dashboard' | 'editor-delete' | 'admin-delete';

const ACCESS_CASES: Array<{ id: AccessCase; label: string; note: string }> = [
    { id: 'guest-delete', label: 'Guest hits delete API', note: 'No valid login state exists before the privileged action is requested.' },
    { id: 'member-dashboard', label: 'Member opens dashboard', note: 'Identity is established and the requested area belongs to the normal signed-in experience.' },
    { id: 'editor-delete', label: 'Editor tries admin action', note: 'The user is real and logged in, but the role is still too weak for this operation.' },
    { id: 'admin-delete', label: 'Admin deletes course', note: 'Both identity and permission boundary pass, so the protected action can continue.' },
];

const RESULT_MAP: Record<AccessCase, {
    authentication: string;
    authorization: string;
    backendDecision: string;
    takeaway: string;
    contractLine: string;
    tone: 'emerald' | 'violet' | 'amber';
}> = {
    'guest-delete': {
        authentication: 'failed or missing',
        authorization: 'not evaluated yet',
        backendDecision: 'reject as unauthenticated',
        takeaway: 'If the backend cannot confirm who the caller is, the flow stops at authentication. Permission checks come later.',
        contractLine: 'unknown identity means no protected action',
        tone: 'amber',
    },
    'member-dashboard': {
        authentication: 'passed',
        authorization: 'passed for member route',
        backendDecision: 'allow entry',
        takeaway: 'Authentication answers “who is this user?” Once identity is known, authorization checks whether this route is inside that role’s allowed surface.',
        contractLine: 'identity first, capability second',
        tone: 'emerald',
    },
    'editor-delete': {
        authentication: 'passed',
        authorization: 'failed for admin-only action',
        backendDecision: 'return 403 forbidden',
        takeaway: 'This is the classic distinction: the user is logged in correctly, but that still does not grant every operation.',
        contractLine: 'authenticated does not mean all-powerful',
        tone: 'violet',
    },
    'admin-delete': {
        authentication: 'passed',
        authorization: 'passed for protected action',
        backendDecision: 'allow privileged mutation',
        takeaway: 'Protected workflows only proceed cleanly when both layers agree: identity is real and the role or permission model explicitly allows the action.',
        contractLine: 'both gates must pass',
        tone: 'emerald',
    },
};

export const AuthBoundaryLab = () => {
    const [accessCase, setAccessCase] = useState<AccessCase>('member-dashboard');
    const result = useMemo(() => RESULT_MAP[accessCase], [accessCase]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={KeyRound} title="Auth Boundary Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <KeyRound className="text-cyan-400" />
                        Auth Boundary Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between request situations to see how authentication decides who the caller is, while authorization decides whether that identified caller may continue.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Request Case</p>
                        <div className="mt-4 space-y-3">
                            {ACCESS_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setAccessCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        accessCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Authentication" value={result.authentication} tone="cyan" />
                        <LabMetricCard label="Authorization" value={result.authorization} tone="violet" />
                        <LabMetricCard label="Backend Decision" value={result.backendDecision} tone={result.tone} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <UserCheck size={14} />
                                <span>Boundary Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">contract line</div>
                                <div className="mt-2 text-sm font-semibold text-white">{result.contractLine}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Authentication Gate"
                                tone="sky"
                                body="This layer answers whether the backend can trust the claimed identity at all. No identity means no protected workflow."
                            />
                            <LabMiniCard
                                title="Authorization Gate"
                                tone="violet"
                                body="This layer starts only after identity is known. It decides whether that specific user, role, or permission set may perform the requested action."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <ShieldAlert size={14} />
                            <span>Auth Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Authenticate the caller before deciding whether they may access a protected route or mutation.</li>
                            <li>Return a different outcome for “not logged in” versus “logged in but forbidden,” because they describe different backend states.</li>
                            <li>Keep permission decisions in a model or policy layer instead of scattering ad hoc role checks across handlers.</li>
                        </ul>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabMiniCard
                            title="401 And 403 Tell Different Stories"
                            tone="amber"
                            body="A missing or invalid identity should not look the same as an authenticated user hitting a forbidden boundary. Clients and support flows depend on that distinction."
                        />
                        <LabMiniCard
                            title="This Connects The Whole Stack"
                            tone="emerald"
                            body="Session restoration, JWT verification, route guards, and RBAC policies all get easier to reason about once the team agrees on where authentication stops and authorization begins."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <ShieldCheck size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Teams often say “auth” as if it were one thing, but backend behavior gets much clearer once you separate identity proof from permission policy. That distinction shapes APIs, logs, route guards, and support debugging.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
