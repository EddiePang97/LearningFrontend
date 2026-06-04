import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2, Gauge, Sparkles } from 'lucide-react';

type ScenarioId = 'healthy' | 'slow-hero' | 'janky-input' | 'layout-shift';

const SCENARIOS: Array<{
    id: ScenarioId;
    label: string;
    summary: string;
    lcp: number;
    inp: number;
    cls: number;
    culprits: string[];
    fix: string;
}> = [
    {
        id: 'healthy',
        label: 'Healthy Baseline',
        summary: '首屏图按时出现，点击响应干净，布局也没有乱跳。',
        lcp: 1.8,
        inp: 78,
        cls: 0.03,
        culprits: ['关键资源优先级合理', '主线程空闲足够', '图片与广告位预留尺寸'],
        fix: '这是理想状态，后续优化应该尽量守住这个体验基线。',
    },
    {
        id: 'slow-hero',
        label: 'Slow Hero Image',
        summary: '最大内容块迟迟不出现，用户会觉得页面“还没开完”。',
        lcp: 4.6,
        inp: 92,
        cls: 0.05,
        culprits: ['首屏大图太重', '字体和轮播脚本抢带宽', '服务器响应或 CDN 命中慢'],
        fix: '优先压缩首屏资源、预加载关键图片，并让非关键脚本晚一点再下载。',
    },
    {
        id: 'janky-input',
        label: 'Main Thread Jam',
        summary: '页面看起来到了，但点按钮后要等一会儿才响应。',
        lcp: 2.1,
        inp: 286,
        cls: 0.04,
        culprits: ['主线程被长任务占满', '初始化 JS 太重', '事件处理里做了同步计算'],
        fix: '拆分长任务、延后非关键初始化，并把重计算移到 Worker 或空闲时段。',
    },
    {
        id: 'layout-shift',
        label: 'Jumping Layout',
        summary: '内容一边加载一边乱跳，用户会点错东西，也会觉得页面不稳。',
        lcp: 2.3,
        inp: 88,
        cls: 0.31,
        culprits: ['图片/广告位没留尺寸', '异步插入 banner', '字体切换导致文字重排'],
        fix: '给媒体与广告位预留空间，谨慎插入顶部内容，并控制字体切换策略。',
    },
];

const metricTone = (metric: 'lcp' | 'inp' | 'cls', value: number) => {
    if (metric === 'lcp') {
        return value <= 2.5 ? 'emerald' : value <= 4 ? 'amber' : 'rose';
    }

    if (metric === 'inp') {
        return value <= 200 ? 'emerald' : value <= 500 ? 'amber' : 'rose';
    }

    return value <= 0.1 ? 'emerald' : value <= 0.25 ? 'amber' : 'rose';
};

export const WebVitalsLab = () => {
    const [scenarioId, setScenarioId] = useState<ScenarioId>('slow-hero');
    const activeScenario = useMemo(
        () => SCENARIOS.find((scenario) => scenario.id === scenarioId) ?? SCENARIOS[0],
        [scenarioId]
    );

    const timeline = useMemo(() => {
        if (scenarioId === 'healthy') {
            return [
                '0.4s HTML 到达，首屏骨架立刻出现',
                '1.1s 关键 CSS 与字体完成，界面稳定可读',
                '1.8s Hero 图完成，LCP 落在健康区间',
            ];
        }

        if (scenarioId === 'slow-hero') {
            return [
                '0.6s 页面壳到了，但主视觉还是空的',
                '2.3s 非关键脚本和字体仍在争抢下载',
                '4.6s Hero 图终于出现，LCP 明显超标',
            ];
        }

        if (scenarioId === 'janky-input') {
            return [
                '1.2s 页面已经看起来可用了',
                '1.7s 用户第一次点击筛选按钮',
                '2.0s - 2.3s 主线程被同步计算堵住，输入延迟被拉高',
            ];
        }

        return [
            '1.3s 首屏内容已经渲染出来',
            '1.9s Banner 异步插入顶部，正文整体下移',
            '2.2s 图片补尺寸再次挤动布局，CLS 持续累加',
        ];
    }, [scenarioId]);

    const verdict = useMemo(() => {
        const badMetrics = [
            metricTone('lcp', activeScenario.lcp),
            metricTone('inp', activeScenario.inp),
            metricTone('cls', activeScenario.cls),
        ].filter((tone) => tone !== 'emerald').length;

        if (badMetrics === 0) {
            return {
                title: '用户会觉得页面很稳',
                body: '看到、能点、不会跳，这三件事都成立时，Web Vitals 才真的同时健康。',
                tone: 'emerald' as const,
            };
        }

        if (badMetrics === 1) {
            return {
                title: '体验有一个明显短板',
                body: '性能优化不是只看总分，而是先抓住那一个正在拖后腿的指标。',
                tone: 'amber' as const,
            };
        }

        return {
            title: '用户会明显感觉页面“不舒服”',
            body: '这时不要泛泛而谈“页面慢”，先分清是内容出现慢、点击反应慢，还是布局不稳定。',
            tone: 'rose' as const,
        };
    }, [activeScenario]);

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <Sparkles size={12} />
                            Core Web Vitals
                        </div>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                            不要只说“这个页面慢”，要说清它是看得慢、点得慢，还是会乱跳
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            切换下面的页面场景，看看 LCP、INP、CLS 分别在描述什么体验问题。
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard label="LCP" value={`${activeScenario.lcp.toFixed(1)}s`} accent={metricTone('lcp', activeScenario.lcp)} />
                        <MetricCard label="INP" value={`${activeScenario.inp}ms`} accent={metricTone('inp', activeScenario.inp)} />
                        <MetricCard label="CLS" value={activeScenario.cls.toFixed(2)} accent={metricTone('cls', activeScenario.cls)} />
                        <MetricCard label="Primary Pain" value={primaryPainLabel(activeScenario.id)} accent="sky" />
                    </div>
                </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.82fr_1.18fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Scenario Switcher</div>
                        <div className="mt-3 grid gap-2">
                            {SCENARIOS.map((scenario) => (
                                <button
                                    key={scenario.id}
                                    type="button"
                                    onClick={() => setScenarioId(scenario.id)}
                                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                        scenario.id === scenarioId
                                            ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-100'
                                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="text-xs font-black uppercase tracking-widest">{scenario.label}</div>
                                    <div className="mt-2 text-xs leading-6 text-white/70">{scenario.summary}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <StoryCard
                        icon={Gauge}
                        title="快速记忆"
                        accent="sky"
                        items={[
                            'LCP 问的是“主要内容多久真正出现”。',
                            'INP 问的是“用户操作后多久真的有反应”。',
                            'CLS 问的是“页面在加载过程中会不会乱跳”。',
                        ]}
                    />

                    <StoryCard
                        icon={Activity}
                        title="排查顺序"
                        accent="emerald"
                        items={[
                            '先看哪个指标最差，再倒推具体阶段出了什么问题。',
                            '看到大图慢，就想资源优先级与体积。',
                            '看到点了没反应，就想主线程和长任务。',
                        ]}
                    />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Experience Timeline</div>
                            <div className="mt-1 text-sm font-bold text-white">
                                性能指标不是抽象数字，它们对应的是用户在时间线上真实感受到的卡点。
                            </div>
                        </div>
                        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                            verdict.tone === 'emerald'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : verdict.tone === 'amber'
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                            {verdict.tone === 'emerald' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                            {verdict.tone === 'emerald' ? 'Healthy Feel' : verdict.tone === 'amber' ? 'Needs Work' : 'Poor Feel'}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Mini Filmstrip</div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {timeline.map((step, index) => (
                                    <motion.div
                                        key={`${scenarioId}-${index}`}
                                        initial={{ opacity: 0.5, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.22, delay: index * 0.05 }}
                                        className="rounded-2xl border border-white/10 bg-[#151519] p-3"
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                                            Frame {index + 1}
                                        </div>
                                        <div className={`mt-3 h-24 rounded-2xl border ${
                                            frameAccentClass(scenarioId, index)
                                        }`} />
                                        <p className="mt-3 text-xs leading-6 text-white/75">{step}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">What To Fix First</div>
                            <div className="mt-3 space-y-2">
                                {activeScenario.culprits.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-gray-200"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">Recommended Move</div>
                                <p className="mt-3 text-sm leading-7 text-white">{activeScenario.fix}</p>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        key={scenarioId}
                        initial={{ opacity: 0.55, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24 }}
                        className={`mt-4 rounded-3xl border p-4 ${
                            verdict.tone === 'emerald'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                : verdict.tone === 'amber'
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                                    : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                        }`}
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80">Verdict</div>
                        <div className="mt-3 text-lg font-black text-white">{verdict.title}</div>
                        <p className="mt-2 text-sm leading-7 text-white/85">{verdict.body}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

function primaryPainLabel(id: ScenarioId) {
    if (id === 'slow-hero') return 'Late LCP';
    if (id === 'janky-input') return 'High INP';
    if (id === 'layout-shift') return 'Bad CLS';
    return 'All Stable';
}

function frameAccentClass(id: ScenarioId, index: number) {
    if (id === 'slow-hero') {
        return index === 2
            ? 'border-amber-500/40 bg-linear-to-br from-amber-400/35 to-orange-500/20'
            : 'border-white/10 bg-white/5';
    }

    if (id === 'janky-input') {
        return index === 1
            ? 'border-sky-500/40 bg-linear-to-br from-sky-400/20 to-cyan-500/15'
            : index === 2
                ? 'border-amber-500/40 bg-linear-to-br from-amber-400/25 to-rose-500/15'
                : 'border-white/10 bg-white/5';
    }

    if (id === 'layout-shift') {
        return index > 0
            ? 'border-rose-500/40 bg-linear-to-br from-rose-400/25 to-fuchsia-500/15'
            : 'border-white/10 bg-white/5';
    }

    return 'border-emerald-500/35 bg-linear-to-br from-emerald-400/20 to-cyan-500/10';
}

function MetricCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent: 'sky' | 'emerald' | 'amber' | 'rose';
}) {
    const accentClass = accent === 'emerald'
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
        : accent === 'amber'
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
            : accent === 'rose'
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <div className={`rounded-2xl border p-4 ${accentClass}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80">{label}</div>
            <div className="mt-3 text-sm font-bold text-white">{value}</div>
        </div>
    );
}

function StoryCard({
    icon: Icon,
    title,
    accent,
    items,
}: {
    icon: typeof Gauge;
    title: string;
    accent: 'sky' | 'emerald';
    items: string[];
}) {
    const accentClass = accent === 'emerald'
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
        : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${accentClass}`}>
                <Icon size={12} />
                {title}
            </div>
            <div className="mt-4 space-y-2">
                {items.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-gray-200">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
