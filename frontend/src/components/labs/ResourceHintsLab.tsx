import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, ExternalLink, Globe, Rocket, Sparkles } from 'lucide-react';

type HintMode = 'preload' | 'prefetch' | 'preconnect';
type TimelineTone = 'slate' | 'sky' | 'violet' | 'emerald';

const MODES: Array<{
    id: HintMode;
    label: string;
    intent: string;
    headline: string;
    description: string;
    browserBehavior: string[];
    warning: string;
    benefit: string;
}> = [
    {
        id: 'preload',
        label: 'Preload',
        intent: '当前页面马上就要用',
        headline: '把关键资源提前拉进来，别等浏览器“自己发现”它太晚。',
        description: '适合首屏字体、Hero 图、当前页关键脚本这种马上就会消费的资源。',
        browserBehavior: [
            '浏览器立刻提高这个资源的优先级',
            '下载完成后等待当前页面真正消费它',
            '如果资源其实没被用到，就会浪费带宽',
        ],
        warning: '不要拿 preload 去堆一堆“也许有用”的资源，它是给当前页关键资产用的。',
        benefit: '最适合压缩 LCP 或避免关键字体、关键图晚到。',
    },
    {
        id: 'prefetch',
        label: 'Prefetch',
        intent: '下一页可能会用',
        headline: '趁浏览器空闲时，帮未来的页面做一点准备。',
        description: '适合用户大概率下一步会访问的路由 chunk、详情页数据或下一屏资源。',
        browserBehavior: [
            '浏览器只在空闲带宽存在时低优先级拉取',
            '资源通常先放进缓存，留给未来导航使用',
            '当前页面不会因为它而抢走关键资源优先级',
        ],
        warning: '如果下一步路径并不稳定，prefetch 太多会白下很多东西。',
        benefit: '最适合提升“下一跳页面怎么这么快”的体感。',
    },
    {
        id: 'preconnect',
        label: 'Preconnect',
        intent: '马上要请求第三方域名',
        headline: '资源还没开始下，但先把 DNS / TCP / TLS 握手做掉。',
        description: '适合字体 CDN、图片 CDN、支付域名、分析域名这类跨域请求即将发生的场景。',
        browserBehavior: [
            '先做 DNS 查询与 TCP/TLS 连接准备',
            '真正请求资源时可以少等一段握手时间',
            '它不下载资源，只是提前把路打通',
        ],
        warning: '别给很多永远不会访问的域名 preconnect，不然连接成本也会浪费。',
        benefit: '最适合减少第三方资源“第一跳连接”带来的等待。',
    },
];

const modeTone: Record<HintMode, string> = {
    preload: 'border-violet-500/35 bg-violet-500/10 text-violet-200',
    prefetch: 'border-sky-500/35 bg-sky-500/10 text-sky-200',
    preconnect: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
};

export const ResourceHintsLab = () => {
    const [mode, setMode] = useState<HintMode>('preload');
    const active = useMemo(() => MODES.find((item) => item.id === mode) ?? MODES[0], [mode]);

    const timeline = useMemo<Array<{ label: string; detail: string; tone: TimelineTone }>>(() => {
        if (mode === 'preload') {
            return [
                { label: 'HTML parsed', detail: '页面发现一张首屏 Hero 图和关键字体马上要用。', tone: 'slate' },
                { label: '<link rel=\"preload\">', detail: '浏览器立刻把 Hero 图提到前面下载。', tone: 'violet' },
                { label: 'Render', detail: '关键资源已经在路上，首屏内容更早完整出现。', tone: 'emerald' },
            ];
        }

        if (mode === 'prefetch') {
            return [
                { label: 'Current page stable', detail: '当前页主要资源已经差不多加载完。', tone: 'slate' },
                { label: '<link rel=\"prefetch\">', detail: '浏览器趁空闲低优先级拉取下一个路由 chunk。', tone: 'sky' },
                { label: 'Next navigation', detail: '用户点进详情页时，缓存里已经有一部分资源。', tone: 'emerald' },
            ];
        }

        return [
            { label: 'Intent known', detail: '页面很快要访问 fonts.example.com。', tone: 'slate' },
            { label: '<link rel=\"preconnect\">', detail: '先完成 DNS、TCP、TLS 握手，但还没下资源。', tone: 'emerald' },
            { label: 'Real request', detail: '真正请求字体时，连接已经热好了。', tone: 'violet' },
        ];
    }, [mode]);

    const codeExample = useMemo(() => {
        if (mode === 'preload') {
            return `<link\n  rel="preload"\n  as="image"\n  href="/hero-cover.avif"\n/>`;
        }

        if (mode === 'prefetch') {
            return `<link\n  rel="prefetch"\n  href="/assets/course-detail.chunk.js"\n/>`;
        }

        return `<link\n  rel="preconnect"\n  href="https://fonts.example.com"\n  crossorigin\n/>`;
    }, [mode]);

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
                    <div className="min-w-0 2xl:flex-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
                            <Sparkles size={12} />
                            Resource Hints
                        </div>
                        <h3 className="mt-3 max-w-4xl text-2xl font-black tracking-tight text-white md:text-3xl">
                            `preload` 是“现在就要”，`prefetch` 是“等会儿可能要”，`preconnect` 是“先把路打通”
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            先不要死记三个名字。先看浏览器此刻的意图是什么，再决定该发哪个提示。
                        </p>
                    </div>

                    <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:w-[360px]">
                        <MetricCard label="Current Choice" value={active.label} tone={mode} />
                        <MetricCard label="Best For" value={active.intent} tone="neutral" />
                        <MetricCard label="Downloads Bytes?" value={mode === 'preconnect' ? 'No' : 'Yes'} tone={mode === 'preconnect' ? 'neutral' : mode} />
                        <MetricCard label="Priority" value={mode === 'prefetch' ? 'Low / Idle' : mode === 'preconnect' ? 'Connection Only' : 'High'} tone={mode === 'prefetch' ? 'prefetch' : mode === 'preconnect' ? 'preconnect' : 'preload'} />
                    </div>
                </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.82fr_1.18fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Choose Browser Intent</div>
                        <div className="mt-3 grid gap-2">
                            {MODES.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setMode(item.id)}
                                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                        item.id === mode
                                            ? modeTone[item.id]
                                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="text-xs font-black uppercase tracking-widest">{item.label}</div>
                                    <div className="mt-2 text-xs leading-6 text-white/75">{item.intent}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <StoryCard
                        icon={Rocket}
                        title="Use It When"
                        tone={mode}
                        body={active.description}
                    />

                    <StoryCard
                        icon={Clock3}
                        title="Main Warning"
                        tone="neutral"
                        body={active.warning}
                    />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Browser Timeline</div>
                            <div className="mt-1 text-sm font-bold text-white">{active.headline}</div>
                        </div>
                        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${modeTone[mode]}`}>
                            <CheckCircle2 size={12} />
                            {active.label}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Three Frames</div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {timeline.map((step, index) => (
                                    <motion.div
                                        key={`${mode}-${index}`}
                                        initial={{ opacity: 0.5, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.22, delay: index * 0.05 }}
                                        className="rounded-2xl border border-white/10 bg-[#151519] p-3"
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                                            Step {index + 1}
                                        </div>
                                        <div className={`mt-3 flex h-24 items-center justify-center rounded-2xl border ${frameToneClass(step.tone)}`}>
                                            {step.tone === 'slate' ? <Globe size={20} /> : step.tone === 'sky' ? <Rocket size={20} /> : step.tone === 'violet' ? <ExternalLink size={20} /> : <CheckCircle2 size={20} />}
                                        </div>
                                        <div className="mt-3 text-xs font-bold text-white">{step.label}</div>
                                        <p className="mt-2 text-xs leading-6 text-white/75">{step.detail}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Browser Behavior</div>
                            <div className="mt-3 space-y-2">
                                {active.browserBehavior.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-gray-200"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className={`mt-4 rounded-2xl border p-4 ${modeTone[mode]}`}>
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80">Code Shape</div>
                                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-white/90">{codeExample}</pre>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        key={mode}
                        initial={{ opacity: 0.55, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mt-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4"
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">Memory Aid</div>
                        <p className="mt-3 text-sm leading-7 text-white">
                            {active.benefit}
                        </p>
                    </motion.div>
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
    tone: HintMode | 'neutral';
}) {
    const toneClass = tone === 'preload'
        ? modeTone.preload
        : tone === 'prefetch'
            ? modeTone.prefetch
            : tone === 'preconnect'
                ? modeTone.preconnect
                : 'border-white/10 bg-white/5 text-gray-200';

    return (
        <div className={`min-w-0 rounded-2xl border p-4 ${toneClass}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80 break-words">{label}</div>
            <div className="mt-3 break-words text-sm font-bold text-white">{value}</div>
        </div>
    );
}

function StoryCard({
    icon: Icon,
    title,
    tone,
    body,
}: {
    icon: typeof Rocket;
    title: string;
    tone: HintMode | 'neutral';
    body: string;
}) {
    const toneClass = tone === 'preload'
        ? modeTone.preload
        : tone === 'prefetch'
            ? modeTone.prefetch
            : tone === 'preconnect'
                ? modeTone.preconnect
                : 'border-white/10 bg-white/5 text-gray-200';

    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${toneClass}`}>
                <Icon size={12} />
                {title}
            </div>
            <p className="mt-4 text-sm leading-7 text-white">{body}</p>
        </div>
    );
}

function frameToneClass(tone: TimelineTone) {
    if (tone === 'sky') return 'border-sky-500/35 bg-sky-500/12 text-sky-200';
    if (tone === 'violet') return 'border-violet-500/35 bg-violet-500/12 text-violet-200';
    if (tone === 'emerald') return 'border-emerald-500/35 bg-emerald-500/12 text-emerald-200';
    return 'border-white/10 bg-white/5 text-gray-400';
}
