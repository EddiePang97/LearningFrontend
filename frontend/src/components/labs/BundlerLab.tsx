import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Box,
    Boxes,
    Gauge,
    Play,
    Pause,
    Package,
    RefreshCw,
    Rocket,
    Server,
} from 'lucide-react';

type Mode = 'traditional-dev' | 'vite-dev' | 'vite-build';

interface ScenarioStep {
    id: string;
    title: string;
    summary: string;
    activeNodes: string[];
    changedNodes?: string[];
    metrics: {
        startup: string;
        rebuild: string;
        browser: string;
        dependency: string;
    };
    takeaway: string;
}

interface Scenario {
    id: Mode;
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
    steps: ScenarioStep[];
}

const MODULES = [
    { id: 'entry', label: 'main.tsx', kind: 'entry' },
    { id: 'app', label: 'App.tsx', kind: 'source' },
    { id: 'lesson', label: 'Lesson.tsx', kind: 'source' },
    { id: 'button', label: 'Button.tsx', kind: 'source' },
    { id: 'chart', label: 'Chart.tsx', kind: 'source' },
    { id: 'react', label: 'react', kind: 'dep' },
    { id: 'router', label: 'react-router', kind: 'dep' },
];

const SCENARIOS: Scenario[] = [
    {
        id: 'traditional-dev',
        eyebrow: 'Old Workflow',
        title: '传统开发服务器',
        description: '先把整张模块图打成 bundle，再把结果交给浏览器。改一个文件，也经常要重新处理一大片依赖。',
        accent: 'orange',
        steps: [
            {
                id: 'scan',
                title: '1. 启动时先全量分析依赖图',
                summary: '入口、业务代码、第三方库都会先被构建工具扫描。',
                activeNodes: ['entry', 'app', 'lesson', 'button', 'chart', 'react', 'router'],
                metrics: {
                    startup: '慢启动',
                    rebuild: '尚未开始',
                    browser: '等待 bundle',
                    dependency: '全部一起处理',
                },
                takeaway: '开发环境也像在做一次“小型生产构建”。',
            },
            {
                id: 'bundle',
                title: '2. 先打包，再启动页面',
                summary: '浏览器不能直接拿到源码模块，必须等 bundle 先产出。',
                activeNodes: ['entry', 'app', 'lesson', 'button', 'chart', 'react', 'router'],
                metrics: {
                    startup: '1 次全量 bundle',
                    rebuild: '大概率整片失效',
                    browser: '收到一个大包',
                    dependency: '源码和依赖混在一起',
                },
                takeaway: '项目越大，冷启动越容易拖慢。',
            },
            {
                id: 'change',
                title: '3. 改一个 Button，仍可能触发整段重算',
                summary: '即使只改了一个组件，构建链也常常需要重新走不少步骤。',
                activeNodes: ['entry', 'app', 'lesson', 'button', 'chart', 'react', 'router'],
                changedNodes: ['button'],
                metrics: {
                    startup: '已完成',
                    rebuild: '重建范围偏大',
                    browser: '重新吃 bundle',
                    dependency: '缓存命中受限',
                },
                takeaway: '这就是“改一行，等一会儿”的来源。',
            },
        ],
    },
    {
        id: 'vite-dev',
        eyebrow: 'Why Vite Feels Fast',
        title: 'Vite 开发模式',
        description: '开发时利用浏览器原生 ESM。源码按需请求，依赖预构建一次，文件改动只精准更新受影响模块。',
        accent: 'violet',
        steps: [
            {
                id: 'prebundle',
                title: '1. 第三方依赖预构建一次',
                summary: '像 React、Router 这种依赖先用 esbuild 预处理，后面就稳定复用。',
                activeNodes: ['react', 'router'],
                metrics: {
                    startup: '依赖预热很快',
                    rebuild: '与源码更新分离',
                    browser: '依赖可直接复用',
                    dependency: 'esbuild 预构建',
                },
                takeaway: '慢的往往是依赖解析，Vite 先把这块压缩处理。',
            },
            {
                id: 'ondemand',
                title: '2. 浏览器按需请求源码模块',
                summary: '页面需要哪个模块，就请求哪个模块，不先打整包。',
                activeNodes: ['entry', 'app', 'lesson', 'button', 'react', 'router'],
                metrics: {
                    startup: '不用先全量 bundle',
                    rebuild: '未发生',
                    browser: '直接请求 ESM',
                    dependency: '源码与依赖分层',
                },
                takeaway: '启动快，是因为不做“没必要的提前打包”。',
            },
            {
                id: 'hmr',
                title: '3. 改 Button，只热更新 Button 链路',
                summary: 'Vite 只让受影响模块失效，再通过 HMR 把变化推回页面。',
                activeNodes: ['app', 'button'],
                changedNodes: ['button'],
                metrics: {
                    startup: '已完成',
                    rebuild: '毫秒级 HMR',
                    browser: '只更新变更模块',
                    dependency: '无需重打整包',
                },
                takeaway: '这就是 Vite “改一下几乎秒刷”的核心体验。',
            },
        ],
    },
    {
        id: 'vite-build',
        eyebrow: 'Production Mode',
        title: 'Vite 生产构建',
        description: 'Vite 不是“不打包”，而是开发时不先打包；到生产环境会交给 Rollup 做真正的产物优化。',
        accent: 'emerald',
        steps: [
            {
                id: 'analyze',
                title: '1. 进入生产构建阶段',
                summary: '这时目标从“快迭代”变成“快加载、好缓存、体积小”。',
                activeNodes: ['entry', 'app', 'lesson', 'button', 'chart', 'react', 'router'],
                metrics: {
                    startup: '不适用',
                    rebuild: '构建导向',
                    browser: '准备产物',
                    dependency: '进入 Rollup 管线',
                },
                takeaway: '开发体验快，和生产优化强，并不矛盾。',
            },
            {
                id: 'optimize',
                title: '2. Chunk 拆分、Tree Shaking、压缩',
                summary: 'Rollup 会做真正的代码拆分和死代码删除。',
                activeNodes: ['entry', 'app', 'lesson', 'button', 'chart', 'react', 'router'],
                metrics: {
                    startup: '不适用',
                    rebuild: '构建中',
                    browser: '将获得更小的 chunk',
                    dependency: '按产物策略重组',
                },
                takeaway: 'Vite 快在开发，稳在产物链路。',
            },
            {
                id: 'ship',
                title: '3. 输出可部署静态资源',
                summary: '最终交付给浏览器的是优化后的静态文件，而不是原始源码模块。',
                activeNodes: ['entry', 'app', 'lesson', 'button', 'chart', 'react', 'router'],
                metrics: {
                    startup: '首屏更友好',
                    rebuild: '构建结束',
                    browser: '拿到优化产物',
                    dependency: '可长期缓存',
                },
                takeaway: '一句话：Vite 快，不是省略构建，而是把构建放在更合适的时机。',
            },
        ],
    },
];

const accentClasses: Record<string, string> = {
    orange: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    violet: 'text-violet-300 border-violet-500/40 bg-violet-500/10',
    emerald: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
};

const moduleBaseClass =
    'rounded-2xl border px-3 py-3 text-center text-[11px] font-bold tracking-wide transition-all duration-300 md:px-4';

export const BundlerLab = () => {
    const [mode, setMode] = useState<Mode>('vite-dev');
    const [stepIndex, setStepIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    const scenario = SCENARIOS.find(item => item.id === mode) ?? SCENARIOS[1];
    const step = scenario.steps[stepIndex] ?? scenario.steps[0];

    const activeSet = useMemo(() => new Set(step.activeNodes), [step.activeNodes]);
    const changedSet = useMemo(() => new Set(step.changedNodes ?? []), [step.changedNodes]);

    const resetToScenario = (nextMode: Mode) => {
        setMode(nextMode);
        setStepIndex(0);
    };

    const goPrev = () => setStepIndex(current => Math.max(0, current - 1));
    const goNext = () => setStepIndex(current => Math.min(scenario.steps.length - 1, current + 1));

    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = window.setInterval(() => {
            setStepIndex(current => current >= scenario.steps.length - 1 ? 0 : current + 1);
        }, 2600);

        return () => window.clearInterval(timer);
    }, [isAutoPlaying, scenario.steps.length]);

    const pipelineModeLabel = mode === 'traditional-dev'
        ? '先打整包'
        : mode === 'vite-dev'
            ? '按需请求 + HMR'
            : 'Rollup 生产优化';
    const mentalModelPoints = mode === 'traditional-dev'
        ? [
            '启动时先扫描源码和依赖',
            '浏览器要等 bundle 先生成',
            '改一个组件也常会带出更大范围重建',
        ]
        : mode === 'vite-dev'
            ? [
                '依赖先预构建一次',
                '源码保持原生 ESM，页面按需请求',
                '改动时只热更新受影响链路',
            ]
            : [
                '开发时快，不代表永远不构建',
                '发布前交给 Rollup 做拆包和摇树',
                '浏览器拿到的是优化后的静态产物',
            ];

    const visibleSourceModules = MODULES.filter(module => module.kind !== 'dep' && activeSet.has(module.id));
    const visibleDependencyModules = MODULES.filter(module => module.kind === 'dep' && activeSet.has(module.id));

    return (
        <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${accentClasses[scenario.accent]}`}>
                            <Rocket size={12} />
                            {scenario.eyebrow}
                        </div>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                            为什么 Vite 这么快？
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            {scenario.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {SCENARIOS.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => resetToScenario(item.id)}
                                className={`rounded-2xl border px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                                    item.id === mode
                                        ? accentClasses[item.accent]
                                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {item.title}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setIsAutoPlaying(current => !current)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                        >
                            {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                            {isAutoPlaying ? 'Pause Auto' : 'Auto Play'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                    <MetricCard icon={Gauge} label="Startup" value={step.metrics.startup} />
                    <MetricCard icon={RefreshCw} label="Update Cost" value={step.metrics.rebuild} />
                    <MetricCard icon={Server} label="Browser Model" value={step.metrics.browser} />
                    <MetricCard icon={Package} label="Dependencies" value={step.metrics.dependency} />
                </div>
            </div>

            <div className="grid flex-1 gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Step</div>
                                <div className="mt-1 text-lg font-black text-white">{step.title}</div>
                            </div>
                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                {stepIndex + 1} / {scenario.steps.length}
                            </div>
                        </div>
                        <p className="text-sm leading-7 text-gray-400">{step.summary}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {scenario.steps.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setStepIndex(index)}
                                    className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        index === stepIndex
                                            ? accentClasses[scenario.accent]
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    Step {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                            One-Line Model
                        </div>
                        <div className="grid gap-3">
                            {mentalModelPoints.map(point => (
                                <div
                                    key={point}
                                    className="rounded-2xl border border-white/10 bg-[#0b0b0c] px-4 py-3 text-sm leading-7 text-gray-300"
                                >
                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`rounded-3xl border p-4 ${accentClasses[scenario.accent]}`}>
                        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-current/80">
                            Why This Matters
                        </div>
                        <p className="text-sm leading-7 text-white">{step.takeaway}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={stepIndex === 0}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-300 transition-all hover:bg-white/10 disabled:opacity-30"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={stepIndex === scenario.steps.length - 1}
                            className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-violet-400 disabled:opacity-30"
                        >
                            Next
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Module Graph</div>
                                <div className="mt-1 text-sm font-bold text-white">
                                    {mode === 'vite-dev' ? 'Source modules stay separate in dev' : mode === 'traditional-dev' ? 'Everything moves toward one bundle first' : 'Build pipeline prepares deployment chunks'}
                                </div>
                            </div>
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <Boxes size={12} />
                                {scenario.title}
                            </div>
                        </div>

                        <div className="mb-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Animated Flow</span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-300">
                                    {pipelineModeLabel}
                                </span>
                            </div>

                            <div className="grid gap-3 xl:grid-cols-3">
                                <FlowStageCard
                                    title="1. 发生了什么"
                                    subtitle={mode === 'vite-dev' ? '当前真正被访问的源码模块' : '当前被纳入处理的源码范围'}
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {visibleSourceModules.map(module => (
                                            <FlowTag
                                                key={`source-${module.id}`}
                                                label={module.label}
                                                active
                                                changed={changedSet.has(module.id)}
                                                tone={changedSet.has(module.id) ? 'violet' : 'default'}
                                            />
                                        ))}
                                        {visibleSourceModules.length === 0 && (
                                            <div className="text-xs leading-6 text-gray-500">
                                                这一步主要还在处理依赖和构建准备。
                                            </div>
                                        )}
                                    </div>
                                    {visibleDependencyModules.length > 0 && (
                                        <div className="mt-3 border-t border-white/10 pt-3">
                                            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                                                Dependencies
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {visibleDependencyModules.map(module => (
                                                    <FlowTag key={`dep-${module.id}`} label={module.label} active tone="sky" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </FlowStageCard>

                                <FlowStageCard
                                    title="2. 中间链路"
                                    subtitle={mode === 'traditional-dev' ? '构建器先整合后再给浏览器' : mode === 'vite-dev' ? '浏览器按需请求，改动时只补丁更新' : 'Rollup 在发布前做产物优化'}
                                >
                                    <motion.div
                                        key={`${mode}-${step.id}-core`}
                                        initial={{ opacity: 0.55, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className={`rounded-2xl border px-4 py-4 ${
                                            mode === 'traditional-dev'
                                                ? 'border-orange-500/30 bg-orange-500/10 text-orange-200'
                                                : mode === 'vite-dev'
                                                    ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
                                                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                        }`}
                                    >
                                        <div className="text-xs font-black uppercase tracking-[0.18em]">
                                            {mode === 'traditional-dev'
                                                ? 'Build Bundle First'
                                                : mode === 'vite-dev'
                                                    ? step.id === 'hmr'
                                                        ? 'Patch Only The Changed Chain'
                                                        : 'Serve Native ESM On Demand'
                                                    : 'Optimize And Split Chunks'}
                                        </div>
                                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/30">
                                            <motion.div
                                                key={`${mode}-${step.id}-bar`}
                                                initial={{ width: '18%' }}
                                                animate={{ width: step.id === scenario.steps[0].id ? '42%' : step.id === scenario.steps[1].id ? '72%' : '100%' }}
                                                transition={{ duration: 0.45 }}
                                                className={`h-full ${
                                                    mode === 'traditional-dev'
                                                        ? 'bg-orange-400'
                                                        : mode === 'vite-dev'
                                                            ? 'bg-violet-400'
                                                            : 'bg-emerald-400'
                                                }`}
                                            />
                                        </div>
                                        <div className="mt-3 text-xs leading-6 text-white/80">
                                            {step.summary}
                                        </div>
                                    </motion.div>
                                </FlowStageCard>

                                <FlowStageCard
                                    title="3. 浏览器最后感受到什么"
                                    subtitle={mode === 'vite-dev' ? '重点看是不是只更新必要内容' : '重点看是不是要等整包或拿到优化产物'}
                                >
                                    <div className="space-y-2">
                                        {mode === 'vite-dev' ? (
                                            <>
                                                <FlowRow label="Request main.tsx" active={step.id !== 'prebundle'} tone="sky" />
                                                <FlowRow label="Request App.tsx" active={step.id === 'ondemand' || step.id === 'hmr'} tone="sky" />
                                                <FlowRow label="Patch Button.tsx via HMR" active={step.id === 'hmr'} tone="violet" />
                                            </>
                                        ) : (
                                            <>
                                                <FlowRow
                                                    label={mode === 'traditional-dev' ? 'Wait for one dev bundle' : 'Receive optimized chunks'}
                                                    active
                                                    tone={mode === 'traditional-dev' ? 'orange' : 'emerald'}
                                                />
                                                <FlowRow
                                                    label={mode === 'traditional-dev' ? 'Broader rebuild after changes' : 'Static assets ready for deploy'}
                                                    active={step.id !== 'analyze'}
                                                    tone={mode === 'traditional-dev' ? 'orange' : 'emerald'}
                                                />
                                            </>
                                        )}
                                    </div>
                                </FlowStageCard>
                            </div>
                        </div>

                        <div className="hidden gap-3 2xl:grid 2xl:grid-cols-3">
                            {MODULES.map(module => {
                                const isActive = activeSet.has(module.id);
                                const isChanged = changedSet.has(module.id);
                                const isDep = module.kind === 'dep';
                                const baseColor = isDep
                                    ? 'border-sky-500/20 bg-sky-500/10 text-sky-200'
                                    : module.kind === 'entry'
                                        ? 'border-amber-500/20 bg-amber-500/10 text-amber-200'
                                        : 'border-white/10 bg-white/5 text-gray-200';

                                return (
                                    <motion.div
                                        key={module.id}
                                        layout
                                        animate={{
                                            scale: isChanged ? 1.05 : isActive ? 1.02 : 1,
                                            opacity: isActive ? 1 : 0.48,
                                        }}
                                        className={`${moduleBaseClass} ${baseColor} ${isChanged ? 'ring-2 ring-violet-400/70 shadow-[0_0_20px_rgba(139,92,246,0.25)]' : ''}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {module.kind === 'dep' ? <Package size={14} /> : <Box size={14} />}
                                            <span>{module.label}</span>
                                        </div>
                                        <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/45">
                                            {isChanged ? 'Changed' : isDep ? 'Dependency' : module.kind}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <PipelineCard
                            title={mode === 'vite-dev' ? 'Browser Requests' : 'Build Output'}
                            description={
                                mode === 'vite-dev'
                                    ? '浏览器直接请求当前页面真正需要的 ESM 模块。'
                                    : mode === 'traditional-dev'
                                        ? '浏览器通常要等 bundler 先吐出整包。'
                                        : '生产环境输出的是优化后的静态 chunk。'
                            }
                            accent={scenario.accent}
                        />
                        <PipelineCard
                            title={mode === 'vite-dev' ? 'HMR Scope' : 'Rebuild Scope'}
                            description={
                                mode === 'vite-dev'
                                    ? '改一个组件，只让受影响模块链路热更新。'
                                    : mode === 'traditional-dev'
                                        ? '一个改动可能牵动更大的重建范围。'
                                        : '生产构建追求的是产物质量，不是即时热更新。'
                            }
                            accent={scenario.accent}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

function FlowStageCard({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#0d0d0f] p-4">
            <div className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">{title}</div>
            <div className="mb-4 text-xs leading-6 text-gray-400">{subtitle}</div>
            {children}
        </div>
    );
}

function FlowTag({
    label,
    active,
    changed = false,
    tone,
}: {
    label: string;
    active: boolean;
    changed?: boolean;
    tone: 'default' | 'sky' | 'violet';
}) {
    const colorClass =
        tone === 'sky'
            ? 'border-sky-500/30 bg-sky-500/10 text-sky-200'
            : tone === 'violet'
                ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
                : 'border-white/10 bg-white/5 text-gray-200';

    return (
        <motion.div
            animate={{ opacity: active ? 1 : 0.4, scale: changed ? [1, 1.03, 1] : 1 }}
            transition={{ duration: 0.4, repeat: changed ? 1 : 0 }}
            className={`rounded-xl border px-3 py-2 text-xs font-bold ${colorClass}`}
        >
            {label}
        </motion.div>
    );
}

function FlowRow({
    label,
    active,
    tone,
}: {
    label: string;
    active: boolean;
    tone: 'sky' | 'violet' | 'orange' | 'emerald';
}) {
    const accentClass =
        tone === 'violet'
            ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
            : tone === 'orange'
                ? 'border-orange-500/30 bg-orange-500/10 text-orange-200'
                : tone === 'emerald'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <motion.div
            animate={{ opacity: active ? 1 : 0.35, scale: active ? 1 : 0.98 }}
            transition={{ duration: 0.25 }}
            className={`rounded-xl border px-3 py-2 text-xs leading-6 ${accentClass}`}
        >
            {label}
        </motion.div>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Gauge;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                <Icon size={12} />
                {label}
            </div>
            <div className="mt-3 text-sm font-bold text-white">{value}</div>
        </div>
    );
}

function PipelineCard({
    title,
    description,
    accent,
}: {
    title: string;
    description: string;
    accent: string;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${accentClasses[accent]}`}>
                {title}
            </div>
            <p className="mt-3 text-sm leading-7 text-gray-400">{description}</p>
        </div>
    );
}
