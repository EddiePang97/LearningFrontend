import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Layers3, Package2, Route, Sparkles } from 'lucide-react';
import { LabMiniCard } from './LabMiniCard';

type SplitMode = 'single-bundle' | 'route-split' | 'component-split';
type Tone = 'violet' | 'sky' | 'emerald' | 'slate';

interface Phase {
    id: string;
    title: string;
    summary: string;
    activeChunks: string[];
    destination: 'home' | 'dashboard' | 'drawer';
}

interface SplitScenario {
    id: SplitMode;
    label: string;
    eyebrow: string;
    headline: string;
    summary: string;
    firstLoad: string;
    secondLoad: string;
    keyIdea: string;
    chunks: Array<{ id: string; label: string; size: string; tone: Tone }>;
    phases: Phase[];
    code: string;
    tone: Tone;
}

const SCENARIOS: SplitScenario[] = [
    {
        id: 'single-bundle',
        label: 'Single Bundle',
        eyebrow: 'One Big Delivery',
        headline: '浏览器第一口就把整个应用吞下去，首页和未来页面都混在同一个大包里。',
        summary: '实现简单，但首屏会替未来的路由和重组件先垫付成本。',
        firstLoad: '首屏先背完整应用 bundle',
        secondLoad: '二跳很轻，但首屏已经先吃亏',
        keyIdea: '所有页面一起到场，看似省事，实际上让首屏最重。',
        chunks: [
            { id: 'app', label: 'app.bundle.js', size: '420KB', tone: 'violet' },
        ],
        phases: [
            {
                id: 'home',
                title: 'Step 1. 首次进入首页',
                summary: '浏览器必须等待一个完整大包下载、解析、执行后，首页才真正稳定。',
                activeChunks: ['app'],
                destination: 'home',
            },
            {
                id: 'dashboard',
                title: 'Step 2. 用户切去 Dashboard',
                summary: '这次几乎不用再请求新的 chunk，因为代码早就被首屏一起带来了。',
                activeChunks: ['app'],
                destination: 'dashboard',
            },
            {
                id: 'drawer',
                title: 'Step 3. 打开重编辑器 / 图表',
                summary: '重组件也早已在首屏 bundle 里，所以当前交互没额外请求，但首屏早已替它买单。',
                activeChunks: ['app'],
                destination: 'drawer',
            },
        ],
        code: `import Home from './Home';\nimport Dashboard from './Dashboard';\nimport Editor from './Editor';\n\nexport default function App() {\n  return <Router />;\n}`,
        tone: 'violet',
    },
    {
        id: 'route-split',
        label: 'Route Split',
        eyebrow: 'Page By Page',
        headline: '首屏只拿当前路由最小必需代码，等用户跳页时再补那一页自己的 chunk。',
        summary: '这是大多数应用最值得先做的一刀，通常收益最大也最好理解。',
        firstLoad: '首页先下 vendor + home.chunk',
        secondLoad: '跳 Dashboard 时再补 dashboard.chunk',
        keyIdea: '当前页先轻装上阵，二跳时再为新页面付费。',
        chunks: [
            { id: 'vendor', label: 'vendor.js', size: '140KB', tone: 'slate' },
            { id: 'home', label: 'home.chunk.js', size: '42KB', tone: 'emerald' },
            { id: 'dashboard', label: 'dashboard.chunk.js', size: '88KB', tone: 'sky' },
        ],
        phases: [
            {
                id: 'home',
                title: 'Step 1. 首次进入首页',
                summary: '首页只等待共享 vendor 和 home route，自身明显更轻。',
                activeChunks: ['vendor', 'home'],
                destination: 'home',
            },
            {
                id: 'dashboard',
                title: 'Step 2. 用户切去 Dashboard',
                summary: '浏览器此时才请求 dashboard.chunk.js，所以首页不需要替它提前背包袱。',
                activeChunks: ['dashboard'],
                destination: 'dashboard',
            },
            {
                id: 'drawer',
                title: 'Step 3. 回到首页时',
                summary: '首页依然保持轻量；每个页面只背自己那部分独有代码。',
                activeChunks: ['home'],
                destination: 'home',
            },
        ],
        code: `const HomePage = lazy(() => import('./HomePage'));\nconst DashboardPage = lazy(() => import('./DashboardPage'));\n\n<Suspense fallback={<Shell />}>\n  <Routes />\n</Suspense>`,
        tone: 'sky',
    },
    {
        id: 'component-split',
        label: 'Component Split',
        eyebrow: 'Heavy Parts Late',
        headline: '同一路由内部再继续拆，把图表、编辑器、抽屉这类重组件延迟到真正展开时。',
        summary: '当页面本身已经按路由拆过，下一步最有价值的就是把重组件继续后移。',
        firstLoad: '首页先下 vendor + shell，不急着带图表和编辑器',
        secondLoad: '只有展开图表 / 编辑器时才补对应 chunk',
        keyIdea: '不只是“按页面”拆，还要按“是否立刻可见的重功能”继续拆。',
        chunks: [
            { id: 'vendor', label: 'vendor.js', size: '140KB', tone: 'slate' },
            { id: 'shell', label: 'home.shell.js', size: '38KB', tone: 'emerald' },
            { id: 'chart', label: 'chart-panel.chunk.js', size: '74KB', tone: 'sky' },
            { id: 'editor', label: 'editor.chunk.js', size: '96KB', tone: 'violet' },
        ],
        phases: [
            {
                id: 'home',
                title: 'Step 1. 首次进入首页',
                summary: '首页先渲染 shell 和基础信息，首屏不把重图表和编辑器一起搬进来。',
                activeChunks: ['vendor', 'shell'],
                destination: 'home',
            },
            {
                id: 'dashboard',
                title: 'Step 2. 用户点开分析面板',
                summary: '这时才动态 import 图表 chunk，下载成本和用户动作同步。',
                activeChunks: ['chart'],
                destination: 'dashboard',
            },
            {
                id: 'drawer',
                title: 'Step 3. 用户打开编辑器抽屉',
                summary: '编辑器 chunk 直到真正打开时才会出现，避免它污染普通浏览路径。',
                activeChunks: ['editor'],
                destination: 'drawer',
            },
        ],
        code: `const ChartPanel = lazy(() => import('./ChartPanel'));\n\n{showAnalytics ? (\n  <Suspense fallback={<ChartSkeleton />}>\n    <ChartPanel />\n  </Suspense>\n) : null}`,
        tone: 'emerald',
    },
];

const toneClass: Record<Tone, string> = {
    violet: 'border-violet-500/35 bg-violet-500/10 text-violet-200',
    sky: 'border-sky-500/35 bg-sky-500/10 text-sky-200',
    emerald: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
    slate: 'border-white/10 bg-white/5 text-gray-200',
};

export const CodeSplittingLab = () => {
    const [mode, setMode] = useState<SplitMode>('route-split');
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);

    const active = useMemo(() => SCENARIOS.find((item) => item.id === mode) ?? SCENARIOS[1], [mode]);
    const phase = active.phases[phaseIndex] ?? active.phases[0];

    const handleModeChange = (nextMode: SplitMode) => {
        setMode(nextMode);
        setPhaseIndex(0);
    };

    useEffect(() => {
        if (!autoPlay) return;

        const timer = window.setInterval(() => {
            setPhaseIndex((current) => (current + 1) % active.phases.length);
        }, 2800);

        return () => window.clearInterval(timer);
    }, [active.phases.length, autoPlay]);

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-violet-500/10 blur-[100px]" />

            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
                    <div className="min-w-0 2xl:flex-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">
                            <Sparkles size={12} />
                            Code Splitting
                        </div>
                        <h3 className="mt-3 max-w-4xl text-2xl font-black tracking-tight text-white md:text-3xl">
                            拆包最有表达力的地方，不在于“文件变多”，而在于你能看见哪些代码被刻意留到更晚才出现
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            切换不同策略，再看下面这条会动的下载路线图。重点不是记术语，而是看浏览器第一口到底吞了什么。
                        </p>
                    </div>

                    <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:w-[390px]">
                        <MetricCard label="First Load" value={active.firstLoad} tone={active.tone === 'violet' ? 'violet' : 'emerald'} />
                        <MetricCard label="Second Load" value={active.secondLoad} tone={active.tone === 'violet' ? 'slate' : 'sky'} />
                        <MetricCard label="Key Idea" value={active.keyIdea} tone="slate" />
                        <MetricCard label="Strategy" value={active.label} tone={active.tone} />
                    </div>
                </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.78fr_1.22fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Choose Strategy</div>
                            <button
                                type="button"
                                onClick={() => setAutoPlay((current) => !current)}
                                className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${autoPlay ? toneClass[active.tone] : toneClass.slate}`}
                            >
                                {autoPlay ? 'Auto Play' : 'Manual'}
                            </button>
                        </div>
                        <div className="mt-3 grid gap-2">
                            {SCENARIOS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleModeChange(item.id)}
                                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                        item.id === mode ? toneClass[item.tone] : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="text-xs font-black uppercase tracking-widest">{item.label}</div>
                                    <div className="mt-2 text-xs leading-6 text-white/75">{item.summary}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Narrative Steps</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {active.phases.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setAutoPlay(false);
                                        setPhaseIndex(index);
                                    }}
                                    className={`rounded-2xl border px-4 py-2 text-xs font-black uppercase tracking-widest ${
                                        index === phaseIndex ? toneClass[active.tone] : 'border-white/10 bg-white/5 text-gray-300'
                                    }`}
                                >
                                    {item.id}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-xs font-black uppercase tracking-widest text-white">{phase.title}</div>
                            <p className="mt-3 text-sm leading-7 text-gray-300">{phase.summary}</p>
                        </div>
                    </div>

                    <StoryPanel
                        icon={active.tone === 'violet' ? Package2 : active.tone === 'sky' ? Route : Layers3}
                        title="Why This Shape Matters"
                        tone={active.tone}
                        body={active.headline}
                    />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Animated Delivery Map</div>
                            <div className="mt-1 text-sm font-bold text-white">浏览器、网络和 chunk 的关系，应该像路线图一样被看见。</div>
                        </div>
                        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${toneClass[active.tone]}`}>
                            <CheckCircle2 size={12} />
                            {active.eyebrow}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.2fr_0.9fr] xl:items-center">
                            <ScreenCard
                                title="Browser View"
                                tone="slate"
                                body={phase.destination === 'home'
                                    ? 'Home route first paint'
                                    : phase.destination === 'dashboard'
                                        ? 'Dashboard route activated'
                                        : 'Heavy drawer / editor opened'}
                            />

                            <div className="relative min-h-[220px] overflow-hidden rounded-3xl border border-white/10 bg-[#121216] p-4">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Network Lane</div>
                                <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />
                                <div className="mt-10 grid gap-3">
                                    {active.chunks.map((chunk) => {
                                        const isActive = phase.activeChunks.includes(chunk.id);
                                        return (
                                            <motion.div
                                                key={`${phase.id}-${chunk.id}`}
                                                initial={{ opacity: 0.35, x: isActive ? -36 : 0, scale: isActive ? 0.96 : 1 }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.32,
                                                    x: 0,
                                                    scale: isActive ? 1 : 0.98,
                                                }}
                                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                                className={`relative rounded-2xl border px-4 py-3 ${toneClass[chunk.tone]} ${isActive ? 'shadow-[0_0_28px_rgba(168,85,247,0.12)]' : ''}`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="text-xs font-black uppercase tracking-widest">{chunk.label}</div>
                                                    <div className="text-sm font-bold text-white">{chunk.size}</div>
                                                </div>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{ duration: 0.6 }}
                                                        className="mt-3 h-1 origin-left rounded-full bg-white/70"
                                                    />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <motion.div
                                    key={`${mode}-${phase.id}`}
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="pointer-events-none absolute right-4 top-12 hidden xl:flex items-center gap-2 text-xs text-gray-400"
                                >
                                    <span>delivery</span>
                                    <ArrowRight size={14} />
                                </motion.div>
                            </div>

                            <RouteDestination phase={phase.destination} tone={active.tone} />
                        </div>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Flow Explanation</div>
                            <div className="mt-4 space-y-3">
                                {active.phases.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`rounded-2xl border px-4 py-4 transition-all ${index === phaseIndex ? toneClass[active.tone] : 'border-white/10 bg-white/5 text-gray-300'}`}
                                    >
                                        <div className="text-xs font-black uppercase tracking-widest">{item.title}</div>
                                        <p className="mt-2 text-xs leading-6 text-white/80">{item.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Code Shape</div>
                            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/90">{active.code}</pre>

                            <div className="mt-4 grid gap-3">
                                <LabMiniCard
                                    title="What Improves"
                                    tone={active.tone}
                                    body={active.id === 'single-bundle'
                                        ? '实现最简单，但只有在应用很小时才不容易伤到首屏。'
                                        : active.id === 'route-split'
                                            ? '当前页更快到达，用户真的跳页时再补下一块。'
                                            : '同一路由里的重组件也不再污染普通浏览路径。'}
                                />
                                <LabMiniCard
                                    title="What To Watch"
                                    tone="slate"
                                    body={active.id === 'single-bundle'
                                        ? '大包不只是下载大，解析和执行成本也一起膨胀。'
                                        : active.id === 'route-split'
                                            ? '跳页会多一个 chunk 请求，所以跟 prefetch 很搭。'
                                            : '不要切得过碎，真正重的块才值得单独延后。'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function MetricCard({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: Tone;
}) {
    return (
        <div className={`min-w-0 rounded-2xl border p-4 ${toneClass[tone]}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80 break-words">{label}</div>
            <div className="mt-3 break-words text-sm font-bold text-white">{value}</div>
        </div>
    );
}

function StoryPanel({
    icon: Icon,
    title,
    tone,
    body,
}: {
    icon: typeof Package2;
    title: string;
    tone: Tone;
    body: string;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${toneClass[tone]}`}>
                <Icon size={12} />
                {title}
            </div>
            <p className="mt-4 text-sm leading-7 text-white">{body}</p>
        </div>
    );
}

function ScreenCard({
    title,
    tone,
    body,
}: {
    title: string;
    tone: Tone;
    body: string;
}) {
    return (
        <div className={`rounded-3xl border p-4 ${toneClass[tone]}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80">{title}</div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-rose-400/80" />
                    <div className="h-2 w-2 rounded-full bg-amber-300/80" />
                    <div className="h-2 w-2 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mt-5 h-16 rounded-2xl border border-white/10 bg-white/5" />
                <p className="mt-4 text-xs leading-6 text-white/80">{body}</p>
            </div>
        </div>
    );
}

function RouteDestination({
    phase,
    tone,
}: {
    phase: 'home' | 'dashboard' | 'drawer';
    tone: Tone;
}) {
    return (
        <div className={`rounded-3xl border p-4 ${toneClass[tone]}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80">Destination</div>
            <div className="mt-4 space-y-3">
                <DestinationRow label="Home Route" active={phase === 'home'} />
                <DestinationRow label="Dashboard Route" active={phase === 'dashboard'} />
                <DestinationRow label="Heavy Drawer" active={phase === 'drawer'} />
            </div>
        </div>
    );
}

function DestinationRow({
    label,
    active,
}: {
    label: string;
    active: boolean;
}) {
    return (
        <motion.div
            initial={false}
            animate={{
                opacity: active ? 1 : 0.45,
                scale: active ? 1 : 0.98,
            }}
            className={`rounded-2xl border px-4 py-4 ${active ? 'border-white/20 bg-white/10 text-white' : 'border-white/10 bg-black/20 text-gray-400'}`}
        >
            <div className="text-xs font-black uppercase tracking-widest">{label}</div>
        </motion.div>
    );
}
