import { useMemo, useState } from 'react';
import { CreditCard, Mail, RefreshCw, ShieldCheck, Ticket, TriangleAlert } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';
import { LabStoryCard } from './LabStoryCard';

type TaskType = 'welcome-email' | 'payment-webhook' | 'seat-reservation' | 'coupon-claim';
type Protection = 'none' | 'dedupe-key' | 'upsert' | 'provider-event-log';

const TASKS: Array<{ id: TaskType; label: string; note: string }> = [
    { id: 'welcome-email', label: 'Welcome email', note: 'Duplicate delivery is annoying, but usually not financially catastrophic.' },
    { id: 'payment-webhook', label: 'Payment webhook', note: 'Third-party callbacks can be replayed or retried after timeouts.' },
    { id: 'seat-reservation', label: 'Seat reservation', note: 'Repeating the same reservation logic can oversell limited inventory.' },
    { id: 'coupon-claim', label: 'Coupon claim', note: 'Retrying a reward grant can create duplicate value or inconsistent balances.' },
];

const PROTECTIONS: Array<{ id: Protection; label: string; note: string }> = [
    { id: 'none', label: 'No protection', note: 'Every retry executes the side effect again.' },
    { id: 'dedupe-key', label: 'Idempotency key', note: 'Store a request key so repeated submissions map to the same result.' },
    { id: 'upsert', label: 'Unique constraint / upsert', note: 'Let the database collapse duplicates into one durable row.' },
    { id: 'provider-event-log', label: 'Processed event log', note: 'Persist upstream event IDs so replays are recognized and skipped.' },
];

const RESULT_MAP: Record<TaskType, Record<Protection, {
    verdict: string;
    repeatOutcome: string;
    operatorMove: string;
    takeaway: string;
    tone: 'emerald' | 'amber' | 'violet';
}>> = {
    'welcome-email': {
        none: {
            verdict: 'DUPLICATE SEND',
            repeatOutcome: 'user may receive multiple emails',
            operatorMove: 'Usually survivable, but noisy and unprofessional.',
            takeaway: 'Retries without protection turn transient queue noise into repeated visible side effects.',
            tone: 'amber',
        },
        'dedupe-key': {
            verdict: 'GOOD FIT',
            repeatOutcome: 'same request maps to one send decision',
            operatorMove: 'Use when the caller can attach a stable request identity.',
            takeaway: 'A dedupe key makes repeated submits collapse into one logical action instead of many physical attempts.',
            tone: 'emerald',
        },
        upsert: {
            verdict: 'HELPFUL',
            repeatOutcome: 'delivery job row stays unique',
            operatorMove: 'Useful when email send attempts are represented as durable records.',
            takeaway: 'Database uniqueness works well when the business action is naturally modeled as one row per recipient/event.',
            tone: 'violet',
        },
        'provider-event-log': {
            verdict: 'OVERKILL',
            repeatOutcome: 'works, but more useful for external callbacks than ordinary internal sends',
            operatorMove: 'Prefer simpler request-scoped protection first.',
            takeaway: 'You can solve the problem this way, but it is usually more machinery than an internal email flow needs.',
            tone: 'violet',
        },
    },
    'payment-webhook': {
        none: {
            verdict: 'DANGEROUS',
            repeatOutcome: 'order may be marked paid twice or side effects may duplicate',
            operatorMove: 'Never trust “the provider only sends once.”',
            takeaway: 'Webhook systems are retry-heavy by design. Without idempotency, a normal replay becomes a billing bug.',
            tone: 'amber',
        },
        'dedupe-key': {
            verdict: 'HELPFUL BUT INCOMPLETE',
            repeatOutcome: 'good if the key is stable and durable',
            operatorMove: 'Works only if you persist the mapping long enough and treat it as backend truth.',
            takeaway: 'Request keys help, but webhooks usually need a durable record tied to upstream event identity as well.',
            tone: 'violet',
        },
        upsert: {
            verdict: 'STRONG SUPPORT',
            repeatOutcome: 'payment record stays unique per provider reference',
            operatorMove: 'Use unique business identifiers so duplicate callbacks converge on one state row.',
            takeaway: 'Unique constraints are powerful when payment state is modeled around a stable external reference.',
            tone: 'emerald',
        },
        'provider-event-log': {
            verdict: 'BEST DEFAULT',
            repeatOutcome: 'replayed callback becomes a harmless no-op',
            operatorMove: 'Persist processed event IDs before running expensive or irreversible follow-up work.',
            takeaway: 'For upstream retries, the cleanest mental model is simple: have we already handled this event ID or not?',
            tone: 'emerald',
        },
    },
    'seat-reservation': {
        none: {
            verdict: 'OVERSALE RISK',
            repeatOutcome: 'same user or concurrent retries can reserve more than intended',
            operatorMove: 'Bad fit for naive retry because scarce resources are easy to double-spend.',
            takeaway: 'Idempotency matters more when repeated execution mutates a limited shared resource.',
            tone: 'amber',
        },
        'dedupe-key': {
            verdict: 'GOOD OUTER LAYER',
            repeatOutcome: 'same client retry can collapse cleanly',
            operatorMove: 'Still pair with source-of-truth inventory protections underneath.',
            takeaway: 'A request key prevents duplicate submits from one actor, but it does not replace real stock consistency.',
            tone: 'violet',
        },
        upsert: {
            verdict: 'BEST DATA LAYER',
            repeatOutcome: 'duplicate reservation identity converges on one row',
            operatorMove: 'Combine uniqueness with transactionally protected stock updates.',
            takeaway: 'Upserts and unique constraints are strongest when the action can be defined as one reservation per actor/resource pair.',
            tone: 'emerald',
        },
        'provider-event-log': {
            verdict: 'MISALIGNED',
            repeatOutcome: 'limited value unless an external event source is driving the reservation',
            operatorMove: 'Use only when the retry source is truly an upstream event stream.',
            takeaway: 'This pattern is excellent for external callbacks, but not the natural first line for ordinary reservation writes.',
            tone: 'amber',
        },
    },
    'coupon-claim': {
        none: {
            verdict: 'VALUE DUPLICATION',
            repeatOutcome: 'credit or benefit may be granted multiple times',
            operatorMove: 'A small retry bug can turn into a real financial leak.',
            takeaway: 'Whenever retries mint value, the cost of duplicate execution rises sharply.',
            tone: 'amber',
        },
        'dedupe-key': {
            verdict: 'GOOD API EDGE',
            repeatOutcome: 'repeat submission from same client can return the original outcome',
            operatorMove: 'Useful at the request boundary, especially for flaky mobile or browser clients.',
            takeaway: 'Client-facing idempotency keys are a strong first fence against accidental double-submits.',
            tone: 'emerald',
        },
        upsert: {
            verdict: 'BEST CORE MODEL',
            repeatOutcome: 'reward grant stays unique for the same user/campaign pair',
            operatorMove: 'Protect the actual value grant with a unique business key in durable storage.',
            takeaway: 'The strongest idempotency often lives in the data model, where duplicates literally cannot create a second grant.',
            tone: 'emerald',
        },
        'provider-event-log': {
            verdict: 'CONTEXTUAL',
            repeatOutcome: 'useful only if grants arrive from an external reward stream',
            operatorMove: 'Prefer when the duplication source is a third-party event rather than a direct client request.',
            takeaway: 'Processed-event logs shine when the retry source is external and replayable.',
            tone: 'violet',
        },
    },
};

const ICON_MAP = {
    'welcome-email': Mail,
    'payment-webhook': CreditCard,
    'seat-reservation': Ticket,
    'coupon-claim': ShieldCheck,
} satisfies Record<TaskType, typeof Mail>;

export const IdempotencyLab = () => {
    const [task, setTask] = useState<TaskType>('payment-webhook');
    const [protection, setProtection] = useState<Protection>('provider-event-log');

    const result = useMemo(() => RESULT_MAP[task][protection], [task, protection]);
    const TaskIcon = ICON_MAP[task];

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={RefreshCw} title="Idempotency Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <RefreshCw className="text-amber-400" />
                        Idempotency Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Pair a retry-prone backend task with different idempotency protections to see which side effects stay safe when the same work arrives twice.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Backend Task</p>
                        <div className="mt-4 space-y-3">
                            {TASKS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setTask(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        task === option.id ? 'border-amber-400/40 bg-amber-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Protection Strategy</p>
                        <div className="mt-4 space-y-3">
                            {PROTECTIONS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setProtection(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        protection === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Verdict" value={result.verdict} tone={result.tone} />
                        <LabMetricCard label="Repeat Outcome" value={result.repeatOutcome} tone="amber" />
                        <LabMetricCard label="Operator Move" value={result.operatorMove} tone="cyan" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.06fr_0.94fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <TaskIcon size={14} />
                                <span>Retry Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">real question</div>
                                    <div className="mt-2 text-sm font-semibold text-white">if this runs twice, what breaks?</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">best defense layer</div>
                                    <div className="mt-2 text-sm font-semibold text-white">request edge, DB model, or event log</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Retries Are Normal"
                                tone="sky"
                                body="Timeouts, crashed workers, browser double-submits, and provider replays all create duplicate execution attempts. Idempotency is not paranoia; it is table stakes."
                            />
                            <LabMiniCard
                                title="Choose The Right Layer"
                                tone="violet"
                                body="Some problems are best solved with client-facing idempotency keys, some with unique constraints, and some with durable processed-event records."
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabStoryCard
                            icon={ShieldCheck}
                            title="Healthy Pattern"
                            tone="emerald"
                            items={[
                                'Model a stable business identity for the side effect so repeated attempts can converge on one durable outcome.',
                                'Return the previous result when the same logical request reappears instead of executing the mutation again.',
                            ]}
                        />
                        <LabStoryCard
                            icon={TriangleAlert}
                            title="Common Failure"
                            tone="amber"
                            items={[
                                'Teams add retries first, then discover too late that duplicates can send emails twice, oversell stock, or apply value repeatedly.',
                                'If the system cannot explain what happens on the second execution, it is not ready for real-world retries.',
                            ]}
                        />
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
