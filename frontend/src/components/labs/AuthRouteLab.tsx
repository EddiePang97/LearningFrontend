import { useMemo, useState } from 'react';
import { ArrowRightCircle, Lock, ShieldCheck, UserRoundCheck, UserRoundX } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Viewer = 'guest' | 'member' | 'editor' | 'admin';
type Route = 'dashboard' | 'editor' | 'billing' | 'admin';

const VIEWERS: Array<{ id: Viewer; label: string; hint: string }> = [
    { id: 'guest', label: 'Guest', hint: 'No session restored yet. Route guard should explain the login path.' },
    { id: 'member', label: 'Member', hint: 'Authenticated reader with normal access to personal app areas.' },
    { id: 'editor', label: 'Editor', hint: 'Can update content but cannot access high-risk admin actions.' },
    { id: 'admin', label: 'Admin', hint: 'Has operational privileges and can access protected admin surfaces.' },
];

const ROUTES: Array<{ id: Route; label: string; hint: string }> = [
    { id: 'dashboard', label: '/dashboard', hint: 'Any authenticated user should be able to land here.' },
    { id: 'editor', label: '/editor/posts/42', hint: 'Requires edit capability, not just a valid session.' },
    { id: 'billing', label: '/settings/billing', hint: 'Valid member area, but often has a loading gate while session restores.' },
    { id: 'admin', label: '/admin/audit-log', hint: 'Privileged surface with a clear 403 boundary for non-admins.' },
];

export const AuthRouteLab = () => {
    const [viewer, setViewer] = useState<Viewer>('guest');
    const [route, setRoute] = useState<Route>('dashboard');

    const result = useMemo(() => {
        const permissionMap: Record<Route, Viewer[]> = {
            dashboard: ['member', 'editor', 'admin'],
            editor: ['editor', 'admin'],
            billing: ['member', 'editor', 'admin'],
            admin: ['admin'],
        };

        const sessionRestored = viewer !== 'guest';
        const canEnter = permissionMap[route].includes(viewer);

        if (!sessionRestored) {
            return {
                gate: 'REDIRECT TO LOGIN',
                shell: 'Public shell with sign-in prompt',
                apiStatus: 'No protected request yet',
                explanation: 'Before route entry, the app should explain that authentication is required and preserve the intended destination when appropriate.',
                boundary: 'Unauthenticated boundary',
            };
        }

        if (!canEnter) {
            return {
                gate: 'SHOW 403 EXPLAINER',
                shell: 'Authenticated shell stays visible',
                apiStatus: 'Protected request would return 403',
                explanation: 'The user is known, but the role is insufficient. This should not look like a broken page or a forced logout.',
                boundary: 'Authenticated but unauthorized',
            };
        }

        return {
            gate: 'ENTER ROUTE',
            shell: route === 'admin' ? 'Privileged admin shell' : 'Authenticated app shell',
            apiStatus: 'Protected data request allowed',
            explanation: 'Session and role both satisfy the route contract, so the user should land directly in the screen instead of bouncing through generic error states.',
            boundary: 'Authorized entry',
        };
    }, [route, viewer]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Lock} title="Auth Route Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Lock className="text-cyan-400" />
                        Auth Route Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Change the viewer and target route to see how login state, route guards, and role-aware UI should cooperate before the screen renders.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Viewer</p>
                        <div className="mt-4 space-y-3">
                            {VIEWERS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setViewer(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        viewer === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.hint}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Target Route</p>
                        <div className="mt-4 space-y-3">
                            {ROUTES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setRoute(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        route === option.id ? 'border-violet-400/40 bg-violet-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.hint}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Route Gate" value={result.gate} tone="cyan" />
                        <LabMetricCard label="UI Shell" value={result.shell} tone="violet" />
                        <LabMetricCard label="Boundary" value={result.boundary} tone="emerald" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <ArrowRightCircle size={14} />
                                <span>Route Decision</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.explanation}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">session status</div>
                                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
                                        {viewer === 'guest' ? <UserRoundX size={16} className="text-amber-300" /> : <UserRoundCheck size={16} className="text-emerald-300" />}
                                        {viewer === 'guest' ? 'not restored' : 'restored'}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">api expectation</div>
                                    <div className="mt-2 text-sm font-semibold text-white">{result.apiStatus}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Login Boundary"
                                tone="sky"
                                body="If the user is unauthenticated, the app should guide them to sign in and preserve intent when possible instead of rendering a fake broken page."
                            />
                            <LabMiniCard
                                title="403 Boundary"
                                tone="violet"
                                body="If the user is authenticated but lacks permission, keep the app shell and explain the access boundary. This is a product state, not a crash."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <ShieldCheck size={14} />
                            <span>Fullstack Route Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Decide route entry only after session restore logic has enough information to distinguish guest from signed-in user.</li>
                            <li>Separate unauthenticated redirects from authenticated-but-forbidden states so support and users can understand the difference.</li>
                            <li>Role-aware UI means more than hiding a button: entry route, shell, data request, and empty states all move together.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
