import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader, Mail, Play, RefreshCw, RotateCcw, ShieldAlert } from 'lucide-react';

type JobStatus = 'queued' | 'running' | 'retrying' | 'done' | 'dead-letter';

interface Job {
    id: string;
    name: string;
    failuresBeforeSuccess: number;
    attempts: number;
    status: JobStatus;
}

const INITIAL_JOBS: Job[] = [
    { id: 'welcome-email', name: 'Welcome Email', failuresBeforeSuccess: 0, attempts: 0, status: 'queued' },
    { id: 'invoice-pdf', name: 'Invoice PDF', failuresBeforeSuccess: 1, attempts: 0, status: 'queued' },
    { id: 'analytics-sync', name: 'Analytics Sync', failuresBeforeSuccess: 2, attempts: 0, status: 'queued' },
    { id: 'webhook-replay', name: 'Webhook Replay', failuresBeforeSuccess: 5, attempts: 0, status: 'queued' },
];

const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const QueueRetryLab = () => {
    const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
    const [isRunning, setIsRunning] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<string[]>([
        'Queue ready. Start the worker to process jobs with retry and DLQ rules.',
    ]);

    const stats = useMemo(() => ({
        queued: jobs.filter(job => job.status === 'queued').length,
        running: jobs.filter(job => job.status === 'running' || job.status === 'retrying').length,
        done: jobs.filter(job => job.status === 'done').length,
        deadLetter: jobs.filter(job => job.status === 'dead-letter').length,
    }), [jobs]);

    const appendLog = (message: string) => {
        setTimeline(prev => [message, ...prev].slice(0, 8));
    };

    const reset = () => {
        setJobs(INITIAL_JOBS);
        setIsRunning(false);
        setActiveJobId(null);
        setTimeline(['Queue reset. Start again to inspect retry and dead-letter behavior.']);
    };

    const processQueue = async () => {
        if (isRunning) {
            return;
        }

        setIsRunning(true);
        setTimeline(['Worker started. Pulling jobs from queue...', ...timeline].slice(0, 8));

        for (const queuedJob of jobs) {
            let currentAttempt = queuedJob.attempts;
            let finished = false;

            while (!finished) {
                currentAttempt += 1;
                setActiveJobId(queuedJob.id);
                setJobs(prev => prev.map(job => (
                    job.id === queuedJob.id
                        ? {
                            ...job,
                            attempts: currentAttempt,
                            status: currentAttempt === 1 ? 'running' : 'retrying',
                        }
                        : job
                )));

                appendLog(`${queuedJob.name}: attempt ${currentAttempt} started.`);
                await sleep(900);

                const shouldFail = currentAttempt <= queuedJob.failuresBeforeSuccess;

                if (shouldFail && currentAttempt < MAX_ATTEMPTS) {
                    appendLog(`${queuedJob.name}: transient failure, requeue with backoff.`);
                    setJobs(prev => prev.map(job => (
                        job.id === queuedJob.id
                            ? { ...job, attempts: currentAttempt, status: 'queued' }
                            : job
                    )));
                    setActiveJobId(null);
                    await sleep(500);
                    continue;
                }

                if (shouldFail) {
                    appendLog(`${queuedJob.name}: exceeded retry budget, moved to DLQ.`);
                    setJobs(prev => prev.map(job => (
                        job.id === queuedJob.id
                            ? { ...job, attempts: currentAttempt, status: 'dead-letter' }
                            : job
                    )));
                    finished = true;
                    setActiveJobId(null);
                    await sleep(400);
                    continue;
                }

                appendLog(`${queuedJob.name}: completed successfully on attempt ${currentAttempt}.`);
                setJobs(prev => prev.map(job => (
                    job.id === queuedJob.id
                        ? { ...job, attempts: currentAttempt, status: 'done' }
                        : job
                )));
                finished = true;
                setActiveJobId(null);
                await sleep(400);
            }
        }

        appendLog('Worker idle. Queue drained; only DLQ items require manual intervention.');
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <RefreshCw className="text-amber-400" />
                        Queue Retry Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Visualize retry budgets, backoff, and why some jobs must land in a dead-letter queue.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 transition-colors hover:bg-white/10"
                >
                    <RotateCcw size={14} className="mr-2 inline" />
                    Reset
                </button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                        <StatCard label="Queued" value={stats.queued} accent="text-blue-300" />
                        <StatCard label="Running" value={stats.running} accent="text-amber-300" />
                        <StatCard label="Done" value={stats.done} accent="text-green-300" />
                        <StatCard label="DLQ" value={stats.deadLetter} accent="text-red-300" />
                    </div>

                    <div className="flex-1 rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                                Job Queue
                            </h4>
                            <span className="text-[10px] font-bold text-gray-600">
                                max attempts: {MAX_ATTEMPTS}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <AnimatePresence>
                                {jobs.map(job => (
                                    <motion.div
                                        key={job.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`rounded-2xl border px-4 py-3 transition-all ${
                                            job.status === 'done'
                                                ? 'border-green-500/25 bg-green-500/8'
                                                : job.status === 'dead-letter'
                                                    ? 'border-red-500/25 bg-red-500/8'
                                                    : job.status === 'running' || job.status === 'retrying'
                                                        ? 'border-amber-500/25 bg-amber-500/8'
                                                        : 'border-white/10 bg-white/4'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <JobIcon status={job.status} active={activeJobId === job.id} />
                                                <div>
                                                    <p className="text-xs font-bold text-white">{job.name}</p>
                                                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500">
                                                        {job.status.replace('-', ' ')} · attempt {job.attempts}/{MAX_ATTEMPTS}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-bold text-gray-300">
                                                fail before success: {job.failuresBeforeSuccess}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            Worker Controls
                        </h4>
                        <button
                            type="button"
                            onClick={processQueue}
                            disabled={isRunning || stats.done + stats.deadLetter === jobs.length}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isRunning ? <Loader size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                            {isRunning ? 'Processing Jobs' : 'Start Worker'}
                        </button>
                        <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4 text-[11px] leading-6 text-gray-400">
                            Jobs that fail temporarily are re-queued. Jobs that still fail after the retry budget move into the DLQ for manual inspection.
                        </div>
                    </div>

                    <div className="flex-1 rounded-3xl border border-white/10 bg-black/30 p-5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            Worker Timeline
                        </h4>
                        <div className="mt-4 space-y-2">
                            <AnimatePresence>
                                {timeline.map(item => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="rounded-2xl border border-white/6 bg-white/4 px-3 py-2 text-xs text-gray-300"
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, accent }: { label: string; value: number; accent: string }) => (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className={`mt-2 text-2xl font-black ${accent}`}>{value}</p>
    </div>
);

const JobIcon = ({ status, active }: { status: JobStatus; active: boolean }) => {
    if (status === 'done') {
        return <CheckCircle2 size={16} className="text-green-400" />;
    }

    if (status === 'dead-letter') {
        return <ShieldAlert size={16} className="text-red-400" />;
    }

    if (status === 'running' || status === 'retrying') {
        return <Loader size={16} className={`text-amber-400 ${active ? 'animate-spin' : ''}`} />;
    }

    return <Mail size={16} className="text-blue-400" />;
};
