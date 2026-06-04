import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, Image as ImageIcon, Layers3, ScrollText, Sparkles, Video } from 'lucide-react';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';
import { LabStoryCard } from './LabStoryCard';

type MediaMode = 'format' | 'responsive' | 'lazy';

const MODES: Array<{
    id: MediaMode;
    label: string;
    headline: string;
    summary: string;
    metrics: {
        bytes: string;
        firstScreen: string;
        perceived: string;
        bestFor: string;
    };
    snapshots: string[];
    recommendation: string;
    warning: string;
}> = [
    {
        id: 'format',
        label: 'Format Choice',
        headline: '先别急着压缩参数，很多时候真正的大头是格式本身选错了。',
        summary: '同一张 Hero 图如果还在用 JPEG，往往一开始就背上了不必要的体积。',
        metrics: {
            bytes: 'JPEG 680KB -> WebP 420KB -> AVIF 260KB',
            firstScreen: '首屏下载明显减轻',
            perceived: 'LCP 更容易提前',
            bestFor: '照片型大图 / Hero Banner',
        },
        snapshots: [
            'JPEG 体积大，但兼容老环境。',
            'WebP 在兼容性和体积之间通常最均衡。',
            'AVIF 更小，但要注意编码成本与兼容策略。',
        ],
        recommendation: '默认先考虑 WebP 或 AVIF，再为旧环境保留回退格式。',
        warning: '不是所有素材都适合一股脑转 AVIF，图标、插画、透明资源也要看场景。',
    },
    {
        id: 'responsive',
        label: 'Responsive Sizes',
        headline: '手机不该下载桌面大图，`<picture>` 和 `srcset` 的价值就在这里。',
        summary: '同一素材给不同屏幕发不同尺寸，避免小设备白白吞下超大分辨率。',
        metrics: {
            bytes: 'Mobile 160KB / Tablet 280KB / Desktop 520KB',
            firstScreen: '小屏少下很多字节',
            perceived: '滚动和首屏都更轻',
            bestFor: '内容图、列表图、Banner',
        },
        snapshots: [
            '手机只拿 640w 版本，不必背 1600w 大图。',
            '平板拿中等尺寸，避免模糊也避免浪费。',
            '桌面才请求真正的大尺寸资源。',
        ],
        recommendation: '让浏览器按视口和 DPR 选择合适版本，而不是一张图喂给所有人。',
        warning: '只改 CSS 宽高不算响应式图片，真正的下载体积不会因此自动变小。',
    },
    {
        id: 'lazy',
        label: 'Lazy Loading',
        headline: '首屏外的图和视频，不该一进页面就和关键资源抢带宽。',
        summary: '懒加载不是让所有东西都变慢，而是让“不急着看见的内容”晚一点出现。',
        metrics: {
            bytes: '首屏先少下 8 张图 / 2 段预览视频',
            firstScreen: '关键资源竞争减少',
            perceived: '首页更快稳定',
            bestFor: '长列表、瀑布流、下方视频卡片',
        },
        snapshots: [
            '首屏先渲染占位骨架，不抢关键带宽。',
            '滚到临近视口时再触发真实图片请求。',
            '用户真正看到之前，视频 poster 和内容按需补上。',
        ],
        recommendation: '把首屏外媒体交给 lazy loading 或 Intersection Observer，优先保住当前视口体验。',
        warning: '首屏 LCP 图不要懒加载，否则你会亲手把最重要的内容推迟。',
    },
];

const modeTone: Record<MediaMode, string> = {
    format: 'border-violet-500/35 bg-violet-500/10 text-violet-200',
    responsive: 'border-sky-500/35 bg-sky-500/10 text-sky-200',
    lazy: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
};

export const MediaOptimizationLab = () => {
    const [mode, setMode] = useState<MediaMode>('format');
    const active = useMemo(() => MODES.find((item) => item.id === mode) ?? MODES[0], [mode]);

    const codeExample = useMemo(() => {
        if (mode === 'format') {
            return `<picture>\n  <source srcSet="/hero.avif" type="image/avif" />\n  <source srcSet="/hero.webp" type="image/webp" />\n  <img src="/hero.jpg" alt="Course hero" />\n</picture>`;
        }

        if (mode === 'responsive') {
            return `<img\n  src="/cover-1280.jpg"\n  srcSet="/cover-640.jpg 640w, /cover-960.jpg 960w, /cover-1280.jpg 1280w"\n  sizes="(max-width: 768px) 92vw, 1200px"\n  alt="Course cover"\n/>`;
        }

        return `<img\n  src="/gallery-item.webp"\n  loading="lazy"\n  alt="Preview"\n/>\n\n<video preload="none" poster="/video-poster.webp"></video>`;
    }, [mode]);

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
                    <div className="min-w-0 2xl:flex-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">
                            <Sparkles size={12} />
                            Media Optimization
                        </div>
                        <h3 className="mt-3 max-w-4xl text-2xl font-black tracking-tight text-white md:text-3xl">
                            媒体优化不只是“再压一点”，而是决定谁先下、下多大、什么时候再下
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            试着在格式、响应式尺寸、懒加载之间切换，看看它们各自到底在解决哪一种浪费。
                        </p>
                    </div>

                    <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:w-[380px]">
                        <LabMetricCard label="Transfer Cost" value={active.metrics.bytes} tone={mode} />
                        <LabMetricCard label="First Screen" value={active.metrics.firstScreen} tone="neutral" />
                        <LabMetricCard label="Perceived Speed" value={active.metrics.perceived} tone={mode} />
                        <LabMetricCard label="Best For" value={active.metrics.bestFor} tone="neutral" />
                    </div>
                </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.82fr_1.18fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Optimization Lever</div>
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
                                    <div className="mt-2 text-xs leading-6 text-white/75">{item.summary}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <LabStoryCard
                        icon={mode === 'format' ? ImageIcon : mode === 'responsive' ? Layers3 : ScrollText}
                        title="Recommended Move"
                        tone={mode}
                        body={active.recommendation}
                    />

                    <LabStoryCard
                        icon={mode === 'lazy' ? Video : Eye}
                        title="Watch Out"
                        tone="neutral"
                        body={active.warning}
                    />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Visual Comparison</div>
                            <div className="mt-1 text-sm font-bold text-white">{active.headline}</div>
                        </div>
                        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${modeTone[mode]}`}>
                            <CheckCircle2 size={12} />
                            {active.label}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Three Snapshots</div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {active.snapshots.map((text, index) => (
                                    <motion.div
                                        key={`${mode}-${index}`}
                                        initial={{ opacity: 0.5, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.22, delay: index * 0.05 }}
                                        className="rounded-2xl border border-white/10 bg-[#151519] p-3"
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                                            View {index + 1}
                                        </div>
                                        <div className={`mt-3 h-24 rounded-2xl border ${frameClass(mode, index)}`} />
                                        <p className="mt-3 text-xs leading-6 text-white/75">{text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Code Shape</div>
                            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/90">{codeExample}</pre>
                            <div className="mt-4 grid gap-3">
                                <LabMiniCard
                                    title="Waste It Removes"
                                    tone={mode}
                                    body={mode === 'format'
                                        ? '同样内容，不再背着老格式的冗余字节。'
                                        : mode === 'responsive'
                                            ? '小屏不再下载桌面资源，按设备拿刚刚好的版本。'
                                            : '首屏外媒体不再和关键资源一起抢第一波带宽。'}
                                />
                                <LabMiniCard
                                    title="If You Skip It"
                                    tone="neutral"
                                    body={mode === 'format'
                                        ? 'LCP 大图体积会天然偏重，后面再调网络优先级也很吃力。'
                                        : mode === 'responsive'
                                            ? '看起来图片宽度缩小了，但真实下载成本一点没变。'
                                            : '长列表里一堆看不见的图和视频会把首页一起拖慢。'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function frameClass(mode: MediaMode, index: number) {
    if (mode === 'format') {
        return index === 0
            ? 'border-amber-500/35 bg-amber-500/12'
            : index === 1
                ? 'border-sky-500/35 bg-sky-500/12'
                : 'border-violet-500/35 bg-violet-500/12';
    }

    if (mode === 'responsive') {
        return index === 0
            ? 'border-emerald-500/35 bg-emerald-500/12'
            : index === 1
                ? 'border-sky-500/35 bg-sky-500/12'
                : 'border-violet-500/35 bg-violet-500/12';
    }

    return index === 0
        ? 'border-white/10 bg-white/5'
        : index === 1
            ? 'border-emerald-500/35 bg-emerald-500/12'
            : 'border-violet-500/35 bg-violet-500/12';
}
