import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, CloudUpload, GitBranch, Hammer, PackageCheck, PlayCircle, TestTube2 } from 'lucide-react';

type StepId = 'checkout' | 'install' | 'quality' | 'build' | 'deploy';

const PIPELINE_STEPS: Array<{
    id: StepId;
    title: string;
    icon: typeof GitBranch;
    success: string;
    failure: string;
}> = [
    {
        id: 'checkout',
        title: 'Checkout',
        icon: GitBranch,
        success: '拿到最新代码，流水线可以开始。',
        failure: '代码都没拉下来，后面的步骤根本无从谈起。',
    },
    {
        id: 'install',
        title: 'Install',
        icon: PackageCheck,
        success: '依赖安装成功，环境准备完成。',
        failure: '依赖装不上，测试和构建都无法继续。',
    },
    {
        id: 'quality',
        title: 'Lint & Test',
        icon: TestTube2,
        success: '质量门通过，允许进入构建阶段。',
        failure: '这是最重要的拦截点，质量不过关就禁止部署。',
    },
    {
        id: 'build',
        title: 'Build',
        icon: Hammer,
        success: '产物已经生成，说明代码至少能被正确打包。',
        failure: '构建失败说明线上不会得到可部署产物。',
    },
    {
        id: 'deploy',
        title: 'Deploy',
        icon: CloudUpload,
        success: '只有前面都绿了，部署才有资格开始。',
        failure: '部署本身不该是第一道质量检查，它只负责交付。',
    },
];

export const CICDLab = () => {
    const [failingStep, setFailingStep] = useState<StepId | null>('quality');

    const stepStates = useMemo(() => {
        let blocked = false;

        return PIPELINE_STEPS.map(step => {
            if (blocked) {
                return { ...step, state: 'blocked' as const };
            }

            if (failingStep === step.id) {
                blocked = true;
                return { ...step, state: 'failed' as const };
            }

            return { ...step, state: 'passed' as const };
        });
    }, [failingStep]);

    const summary = useMemo(() => {
        if (!failingStep) {
            return {
                title: '这次可以部署',
                body: '所有步骤都通过了，所以 deploy 是最后自然发生的结果，而不是一场“碰运气”的手动操作。',
                tone: 'emerald' as const,
            };
        }

        const failed = PIPELINE_STEPS.find(step => step.id === failingStep) ?? PIPELINE_STEPS[2];
        return {
            title: `${failed.title} 挡住了发布`,
            body: failed.failure,
            tone: 'amber' as const,
        };
    }, [failingStep]);

    const releaseReady = failingStep === null;

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <PlayCircle size={12} />
                            Pipeline Gatekeeper
                        </div>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                            CI/CD 的重点不是“自动”，而是“每一步都能阻止坏版本继续前进”
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            点下面的失败点，看看流水线会在哪一步停下，以及为什么质量检查应该发生在部署之前。
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard label="Quality Gate" value="Lint + Test" accent="emerald" />
                        <MetricCard label="Current Failure" value={failingStep ? PIPELINE_STEPS.find(step => step.id === failingStep)?.title ?? 'None' : 'None'} accent={failingStep ? 'amber' : 'emerald'} />
                        <MetricCard label="Deploy Status" value={releaseReady ? 'Allowed' : 'Blocked'} accent={releaseReady ? 'emerald' : 'amber'} />
                        <MetricCard label="Core Principle" value="Fail Fast" accent="sky" />
                    </div>
                </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.8fr_1.2fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Choose Failure Point</div>
                        <div className="mt-3 grid gap-2">
                            <button
                                type="button"
                                onClick={() => setFailingStep(null)}
                                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-black uppercase tracking-widest transition-all ${
                                    failingStep === null
                                        ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                                        : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                <span>All Green</span>
                                <span>Deployable</span>
                            </button>
                            {PIPELINE_STEPS.map(step => (
                                <button
                                    key={step.id}
                                    type="button"
                                    onClick={() => setFailingStep(step.id)}
                                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-black uppercase tracking-widest transition-all ${
                                        failingStep === step.id
                                            ? 'border-amber-500/35 bg-amber-500/10 text-amber-200'
                                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <span>{step.title}</span>
                                    <span>Break Here</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <StoryCard
                        title="为什么 CI 值钱"
                        accent="sky"
                        items={[
                            '它让错误尽量在最早、最便宜的地方暴露。',
                            '每次 push 都经过同样的流程，减少“我本地可以”的侥幸。',
                            '真正稳定的团队不是靠记忆部署，而是靠流水线兜底。',
                        ]}
                    />

                    <StoryCard
                        title="为什么 CD 不能瞎跑"
                        accent="emerald"
                        items={[
                            '部署不是质量检查，它只是把通过检查的版本送出去。',
                            '如果前面的门禁失效，CD 只会更快地把坏版本送到线上。',
                            '所以好流水线的关键是“先拦住，再发布”。',
                        ]}
                    />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Pipeline Run</div>
                            <div className="mt-1 text-sm font-bold text-white">
                                每一站都决定了后面的命运。前面一红，后面就应该全部停住。
                            </div>
                        </div>
                        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                            releaseReady
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        }`}>
                            {releaseReady ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                            {releaseReady ? 'Ready To Deploy' : 'Pipeline Stopped'}
                        </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-5">
                        {stepStates.map(step => {
                            const Icon = step.icon;
                            const stateClass = step.state === 'passed'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                : step.state === 'failed'
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                                    : 'border-white/10 bg-white/5 text-gray-500';

                            return (
                                <motion.div
                                    key={`${step.id}-${step.state}`}
                                    initial={{ opacity: 0.55, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.22 }}
                                    className={`rounded-2xl border p-4 ${stateClass}`}
                                >
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em]">
                                        <Icon size={12} />
                                        {step.title}
                                    </div>
                                    <div className="mt-4 text-sm font-bold text-white">
                                        {step.state === 'passed' ? 'Passed' : step.state === 'failed' ? 'Failed' : 'Blocked'}
                                    </div>
                                    <div className="mt-3 text-xs leading-6 text-white/75">
                                        {step.state === 'passed' ? step.success : step.state === 'failed' ? step.failure : '上一站没通过，所以这里不会开始。'}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        key={summary.title}
                        initial={{ opacity: 0.55, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24 }}
                        className={`mt-4 rounded-3xl border p-4 ${
                            summary.tone === 'emerald'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                        }`}
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80">Release Summary</div>
                        <div className="mt-3 text-lg font-black text-white">{summary.title}</div>
                        <p className="mt-2 text-sm leading-7 text-white/85">{summary.body}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

function MetricCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent: 'sky' | 'emerald' | 'amber';
}) {
    const accentClass = accent === 'amber'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
        : accent === 'emerald'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
            : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <div className={`rounded-2xl border p-4 ${accentClass}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80">{label}</div>
            <div className="mt-3 text-sm font-bold text-white">{value}</div>
        </div>
    );
}

function StoryCard({
    title,
    accent,
    items,
}: {
    title: string;
    accent: 'sky' | 'emerald';
    items: string[];
}) {
    const accentClass = accent === 'emerald'
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
        : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${accentClass}`}>
                {title}
            </div>
            <div className="mt-3 space-y-3">
                {items.map(item => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-[#0b0b0c] px-4 py-3 text-sm leading-7 text-gray-300">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
