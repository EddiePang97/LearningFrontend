import { useMemo, useState } from 'react';
import { Clock3, Mail, ScanSearch, Waves } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type TaskCase = 'welcome-email' | 'video-transcode' | 'invoice-export' | 'profile-save';

const TASK_CASES: Array<{ id: TaskCase; label: string; note: string }> = [
    { id: 'welcome-email', label: 'Welcome email', note: 'Useful to users, but they do not need to wait on the SMTP round-trip before seeing success.' },
    { id: 'video-transcode', label: 'Video transcode', note: 'Heavy media processing can take seconds or minutes and should not sit inside a normal HTTP request window.' },
    { id: 'invoice-export', label: 'Invoice export', note: 'A report can be generated later and delivered asynchronously when the file is ready.' },
    { id: 'profile-save', label: 'Profile save', note: 'User expects the updated name or avatar metadata to be persisted before the request returns success.' },
];

const RESULT_MAP: Record<TaskCase, {
    bestPath: string;
    userExpectation: string;
    backendReason: string;
    takeaway: string;
    contractLine: string;
    tone: 'emerald' | 'violet' | 'amber';
}> = {
    'welcome-email': {
        bestPath: 'sync write, async send',
        userExpectation: 'account creation should feel fast',
        backendReason: 'email delivery is slow and failure-prone compared with the core user record write',
        takeaway: 'The user mainly cares that the account exists. Email sending can be queued after the core transaction succeeds.',
        contractLine: 'core truth now, side effect later',
        tone: 'violet',
    },
    'video-transcode': {
        bestPath: 'enqueue background job',
        userExpectation: 'upload accepted, processing later',
        backendReason: 'CPU-heavy media work would keep the request open too long and tie up web capacity',
        takeaway: 'Long-running jobs belong behind an async boundary so the main API can acknowledge receipt without pretending processing is instant.',
        contractLine: 'do not pin HTTP lifetime to heavy compute',
        tone: 'amber',
    },
    'invoice-export': {
        bestPath: 'return job accepted state',
        userExpectation: 'report can arrive when ready',
        backendReason: 'the result is useful, but not usually required before the page can continue',
        takeaway: 'Exports are classic async work: expensive, bursty, and easy to decouple from the foreground request.',
        contractLine: 'acknowledge request, deliver artifact later',
        tone: 'violet',
    },
    'profile-save': {
        bestPath: 'finish inside main request',
        userExpectation: 'new profile state should exist immediately',
        backendReason: 'this is the core write the user just asked for, not a side effect that can safely lag behind',
        takeaway: 'Not everything should be queued. If the user is waiting on the new truth itself, that write usually belongs in the synchronous path.',
        contractLine: 'primary state change should commit before success',
        tone: 'emerald',
    },
};

export const AsyncBoundaryLab = () => {
    const [taskCase, setTaskCase] = useState<TaskCase>('welcome-email');
    const result = useMemo(() => RESULT_MAP[taskCase], [taskCase]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Clock3} title="Async Boundary Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Clock3 className="text-cyan-400" />
                        Async Boundary Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between backend tasks to decide which work belongs inside the main request and which work should cross an async boundary into a queue or background job.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Task</p>
                        <div className="mt-4 space-y-3">
                            {TASK_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setTaskCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        taskCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Best Path" value={result.bestPath} tone={result.tone} />
                        <LabMetricCard label="User Expectation" value={result.userExpectation} tone="violet" />
                        <LabMetricCard label="Backend Reason" value={result.backendReason} tone="cyan" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                {taskCase === 'welcome-email' ? <Mail size={14} /> : taskCase === 'video-transcode' ? <Waves size={14} /> : <ScanSearch size={14} />}
                                <span>Async Decision</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">contract line</div>
                                <div className="mt-2 text-sm font-semibold text-white">{result.contractLine}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Async Is About User Truth"
                                tone="sky"
                                body="The real question is not “can this be queued?” but “does the user need this work to finish before we can honestly say the main request succeeded?”"
                            />
                            <LabMiniCard
                                title="Queues Protect The Main Path"
                                tone="violet"
                                body="Moving slow or failure-prone side effects out of the request path keeps the API faster and reduces the blast radius when downstream systems wobble."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <Clock3 size={14} />
                            <span>Async Boundary Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Keep the main request focused on the minimum state change the user is actually waiting for.</li>
                            <li>Queue work that is slow, failure-prone, or not immediately required to confirm the primary action.</li>
                            <li>Do not async away the core write if the user expects the new truth to exist before the API returns success.</li>
                        </ul>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabMiniCard
                            title="This Sets Up Retry And Idempotency"
                            tone="emerald"
                            body="Once work crosses an async boundary, retries, duplicate execution, and recovery paths become first-class design problems instead of afterthoughts."
                        />
                        <LabMiniCard
                            title="Good Boundaries Reduce Support Pain"
                            tone="amber"
                            body="If the UI says success before the primary truth is durable, users get confused. If the UI waits for every side effect, the app feels slow and fragile."
                        />
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
