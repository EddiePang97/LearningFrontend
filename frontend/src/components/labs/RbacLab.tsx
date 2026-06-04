import { useMemo, useState } from 'react';
import { CheckCircle2, Lock, Shield, User, XCircle } from 'lucide-react';
import { LabFrame } from './LabFrame';

type Role = 'student' | 'editor' | 'admin';
type Action = 'read:lesson' | 'update:lesson' | 'delete:course';

const PERMISSIONS: Record<Role, Action[]> = {
    student: ['read:lesson'],
    editor: ['read:lesson', 'update:lesson'],
    admin: ['read:lesson', 'update:lesson', 'delete:course'],
};

const ACTIONS: Array<{ id: Action; label: string; resource: string }> = [
    { id: 'read:lesson', label: 'Read Lesson', resource: '/api/lessons/42' },
    { id: 'update:lesson', label: 'Update Lesson', resource: '/api/lessons/42' },
    { id: 'delete:course', label: 'Delete Course', resource: '/api/courses/7' },
];

const ROLES: Array<{ id: Role; label: string; hint: string }> = [
    { id: 'student', label: 'Student', hint: 'Read-only learner permissions' },
    { id: 'editor', label: 'Editor', hint: 'Can manage lesson content' },
    { id: 'admin', label: 'Admin', hint: 'Full course management access' },
];

export const RbacLab = () => {
    const [activeRole, setActiveRole] = useState<Role>('student');
    const [activeAction, setActiveAction] = useState<Action>('read:lesson');

    const decision = useMemo(() => {
        const allowed = PERMISSIONS[activeRole].includes(activeAction);
        const reason = allowed
            ? `${activeRole} includes ${activeAction}, so the policy check passes.`
            : `${activeRole} does not include ${activeAction}, so the API should return 403 Forbidden.`;

        return { allowed, reason };
    }, [activeAction, activeRole]);

    return (
        <LabFrame className="relative min-h-[480px] md:min-h-[600px] w-full" icon={Shield} title="RBAC Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Shield className="text-indigo-400" />
                        RBAC Permission Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Change the role and requested action to see how an authorization policy should allow or deny the request.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Role</p>
                        <div className="mt-4 space-y-3">
                            {ROLES.map(role => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setActiveRole(role.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        activeRole === role.id ? 'border-indigo-400/40 bg-indigo-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{role.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{role.hint}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Requested Action</p>
                        <div className="mt-4 grid gap-3">
                            {ACTIONS.map(action => (
                                <button
                                    key={action.id}
                                    type="button"
                                    onClick={() => setActiveAction(action.id)}
                                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                        activeAction === action.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-white/4'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{action.label}</p>
                                    <p className="mt-1 text-[11px] font-medium text-gray-500">{action.resource}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                                <User size={14} />
                                <span>Role Permissions</span>
                            </div>
                            <div className="mt-4 space-y-2">
                                {PERMISSIONS[activeRole].map(permission => (
                                    <div key={permission} className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2 text-xs font-semibold text-gray-200">
                                        {permission}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                                <Lock size={14} />
                                <span>Policy Result</span>
                            </div>
                            <div className={`mt-4 rounded-2xl border px-4 py-4 ${
                                decision.allowed ? 'border-green-500/25 bg-green-500/10' : 'border-red-500/25 bg-red-500/10'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {decision.allowed ? (
                                        <CheckCircle2 size={16} className="text-green-400" />
                                    ) : (
                                        <XCircle size={16} className="text-red-400" />
                                    )}
                                    <span className={`text-sm font-black ${decision.allowed ? 'text-green-300' : 'text-red-300'}`}>
                                        {decision.allowed ? 'ALLOW' : 'DENY'}
                                    </span>
                                </div>
                                <p className="mt-3 text-xs leading-6 text-gray-200">{decision.reason}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
