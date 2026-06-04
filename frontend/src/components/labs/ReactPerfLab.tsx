import { memo, useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRightLeft, CheckCircle2, Palette, Search, Sparkles } from 'lucide-react';

type CourseCategory = 'all' | 'react' | 'tooling';

type Course = {
    id: string;
    title: string;
    category: Exclude<CourseCategory, 'all'>;
    minutes: number;
};

const COURSES: Course[] = [
    { id: 'c1', title: 'Hooks Deep Dive', category: 'react', minutes: 26 },
    { id: 'c2', title: 'Fiber Scheduling', category: 'react', minutes: 34 },
    { id: 'c3', title: 'Bundler Mental Model', category: 'tooling', minutes: 18 },
    { id: 'c4', title: 'TypeScript Narrowing', category: 'tooling', minutes: 22 },
    { id: 'c5', title: 'React Memo Patterns', category: 'react', minutes: 19 },
    { id: 'c6', title: 'CI Pipeline Basics', category: 'tooling', minutes: 17 },
];

function expensiveFilter(courses: Course[], query: string, category: CourseCategory) {
    const normalizedQuery = query.trim().toLowerCase();
    const next = courses.filter((course) => {
        const matchCategory = category === 'all' || course.category === category;
        const matchQuery = normalizedQuery.length === 0 || course.title.toLowerCase().includes(normalizedQuery);
        return matchCategory && matchQuery;
    });

    let score = 0;
    for (let index = 0; index < 18000; index += 1) {
        score += index % 7;
    }

    return {
        items: next,
        workUnits: score,
    };
}

function useRenderCount() {
    const countRef = useRef(0);
    countRef.current += 1;
    return countRef.current;
}

const MemoToolbarAction = memo(function MemoToolbarAction({
    onBookmark,
}: {
    onBookmark: () => void;
}) {
    const renders = useRenderCount();

    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Action Child</div>
                    <div className="mt-2 text-sm font-bold text-white">Bookmark Button</div>
                </div>
                <RenderBadge count={renders} tone="emerald" />
            </div>
            <button
                type="button"
                onClick={onBookmark}
                className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-emerald-200 transition-all hover:bg-emerald-500/20"
            >
                Save Current Filter
            </button>
        </div>
    );
});

const MemoCourseList = memo(function MemoCourseList({
    courses,
    workUnits,
}: {
    courses: Course[];
    workUnits: number;
}) {
    const renders = useRenderCount();

    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Expensive Child</div>
                    <div className="mt-2 text-sm font-bold text-white">Filtered Lesson List</div>
                </div>
                <RenderBadge count={renders} tone="violet" />
            </div>
            <div className="mt-3 text-xs leading-6 text-gray-400">
                Simulated compute work: <span className="font-bold text-white">{workUnits}</span>
            </div>
            <div className="mt-4 space-y-2">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-gray-200"
                    >
                        {course.title} <span className="text-gray-500">· {course.minutes} min</span>
                    </div>
                ))}
                {courses.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-gray-500">
                        No lesson matches this filter.
                    </div>
                )}
            </div>
        </div>
    );
});

function PlainToolbarAction({ onBookmark }: { onBookmark: () => void }) {
    const renders = useRenderCount();

    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Action Child</div>
                    <div className="mt-2 text-sm font-bold text-white">Bookmark Button</div>
                </div>
                <RenderBadge count={renders} tone="amber" />
            </div>
            <button
                type="button"
                onClick={onBookmark}
                className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-amber-200 transition-all hover:bg-amber-500/20"
            >
                Save Current Filter
            </button>
        </div>
    );
}

function PlainCourseList({
    courses,
    workUnits,
}: {
    courses: Course[];
    workUnits: number;
}) {
    const renders = useRenderCount();

    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Expensive Child</div>
                    <div className="mt-2 text-sm font-bold text-white">Filtered Lesson List</div>
                </div>
                <RenderBadge count={renders} tone="amber" />
            </div>
            <div className="mt-3 text-xs leading-6 text-gray-400">
                Simulated compute work: <span className="font-bold text-white">{workUnits}</span>
            </div>
            <div className="mt-4 space-y-2">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-gray-200"
                    >
                        {course.title} <span className="text-gray-500">· {course.minutes} min</span>
                    </div>
                ))}
                {courses.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-gray-500">
                        No lesson matches this filter.
                    </div>
                )}
            </div>
        </div>
    );
}

export const ReactPerfLab = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<CourseCategory>('all');
    const [theme, setTheme] = useState<'midnight' | 'mint'>('midnight');
    const [savedCount, setSavedCount] = useState(0);
    const parentRenders = useRenderCount();

    const plainResult = expensiveFilter(COURSES, query, category);

    const deferredQuery = useDeferredValue(query);
    const memoizedResult = useMemo(
        () => expensiveFilter(COURSES, deferredQuery, category),
        [deferredQuery, category]
    );

    const handleOptimizedBookmark = useCallback(() => {
        setSavedCount((count) => count + 1);
    }, []);

    const panelTone = theme === 'mint'
        ? 'border-emerald-500/20 bg-emerald-500/[0.05]'
        : 'border-violet-500/20 bg-violet-500/[0.05]';

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
                    <div className="min-w-0 2xl:flex-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">
                            <Sparkles size={12} />
                            React Re-render Lab
                        </div>
                        <h3 className="mt-3 max-w-4xl text-2xl font-black tracking-tight text-white md:text-3xl 2xl:max-w-none">
                            真正该优化的，不是“所有代码”，而是那些会被无关状态反复拖着重跑的部分
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            试着只切换主题，不改筛选条件。左边的未优化版本会把昂贵列表和子按钮一起重新渲染，右边则会更克制。
                        </p>
                    </div>

                    <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:w-[360px]">
                        <MetricCard label="Parent Renders" value={String(parentRenders)} tone="slate" />
                        <MetricCard label="Saved Views" value={String(savedCount)} tone="emerald" />
                        <MetricCard label="Query Strategy" value={deferredQuery === query ? 'Live' : 'Deferred'} tone="violet" />
                        <MetricCard label="Theme Toggle" value={theme === 'mint' ? 'Mint' : 'Midnight'} tone={theme === 'mint' ? 'emerald' : 'violet'} />
                    </div>
                </div>
            </div>

            <div className="grid gap-5">
                <div className={`grid gap-3 rounded-3xl border p-4 md:grid-cols-[1.1fr_0.9fr] ${panelTone}`}>
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                        <label className="block">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Search Query</div>
                            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                                <Search size={14} className="text-gray-500" />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Try: react / typescript / pipeline"
                                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                                />
                            </div>
                        </label>

                        <button
                            type="button"
                            onClick={() => setTheme((current) => current === 'midnight' ? 'mint' : 'midnight')}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-200 transition-all hover:bg-white/10"
                        >
                            <span className="inline-flex items-center gap-2">
                                <Palette size={14} />
                                Toggle Theme
                            </span>
                        </button>
                    </div>

                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Category Filter</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(['all', 'react', 'tooling'] as CourseCategory[]).map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setCategory(value)}
                                    className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                        category === value
                                            ? 'border-violet-500/35 bg-violet-500/10 text-violet-200'
                                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 2xl:grid-cols-[1fr_auto_1fr]">
                    <ComparisonPanel
                        title="Without Optimization"
                        subtitle="Any parent render recreates callbacks and recomputes the expensive list."
                        tone="amber"
                    >
                        <PlainToolbarAction onBookmark={() => setSavedCount((count) => count + 1)} />
                        <PlainCourseList courses={plainResult.items} workUnits={plainResult.workUnits} />
                        <InsightCard
                            title="What just happened"
                            tone="amber"
                            items={[
                                '主题切换也会重新创建 onBookmark。',
                                '昂贵过滤逻辑每次父组件 render 都会重跑。',
                                '所以无关状态也在拖着整个区域一起忙。'
                            ]}
                        />
                    </ComparisonPanel>

                    <div className="hidden 2xl:flex items-center justify-center text-gray-600">
                        <div className="rounded-full border border-white/10 bg-white/5 p-4">
                            <ArrowRightLeft size={18} />
                        </div>
                    </div>

                    <ComparisonPanel
                        title="With memo + useMemo + useCallback"
                        subtitle="Only real filter changes should wake up expensive children."
                        tone="emerald"
                    >
                        <MemoToolbarAction onBookmark={handleOptimizedBookmark} />
                        <MemoCourseList courses={memoizedResult.items} workUnits={memoizedResult.workUnits} />
                        <InsightCard
                            title="Why this is calmer"
                            tone="emerald"
                            items={[
                                'useCallback 让子按钮拿到稳定函数引用。',
                                'useMemo 让昂贵列表只在 query/category 真变化时重算。',
                                'React.memo 让 props 没变的子组件直接跳过。'
                            ]}
                        />
                    </ComparisonPanel>
                </div>

                <motion.div
                    key={`${query}-${category}-${theme}`}
                    initial={{ opacity: 0.55, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="rounded-3xl border border-white/10 bg-black/30 p-4"
                >
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">One-Line Rule</div>
                            <p className="mt-3 text-sm leading-7 text-white">
                                如果某段计算或子组件会被“无关状态”反复唤醒，它才是 `useMemo / useCallback / React.memo` 真正值得出手的地方。
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                            <CheckCircle2 size={12} />
                            Optimize Friction, Not Everything
                        </div>
                    </div>
                </motion.div>
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
    tone: 'slate' | 'emerald' | 'violet';
}) {
    const toneClass = tone === 'emerald'
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
        : tone === 'violet'
            ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
            : 'border-white/10 bg-white/5 text-gray-200';

    return (
        <div className={`min-w-0 rounded-2xl border p-4 ${toneClass}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80 break-words">{label}</div>
            <div className="mt-3 break-words text-sm font-bold text-white">{value}</div>
        </div>
    );
}

function RenderBadge({
    count,
    tone,
}: {
    count: number;
    tone: 'amber' | 'emerald' | 'violet';
}) {
    const toneClass = tone === 'amber'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
        : tone === 'violet'
            ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';

    return (
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${toneClass}`}>
            <Activity size={12} />
            {count} renders
        </div>
    );
}

function ComparisonPanel({
    title,
    subtitle,
    tone,
    children,
}: {
    title: string;
    subtitle: string;
    tone: 'amber' | 'emerald';
    children: React.ReactNode;
}) {
    const toneClass = tone === 'amber'
        ? 'border-amber-500/20 bg-amber-500/[0.04]'
        : 'border-emerald-500/20 bg-emerald-500/[0.04]';

    return (
        <div className={`rounded-3xl border p-4 ${toneClass}`}>
            <div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">{title}</div>
                <div className="mt-2 text-sm font-bold text-white">{subtitle}</div>
            </div>
            <div className="mt-4 grid gap-4">
                {children}
            </div>
        </div>
    );
}

function InsightCard({
    title,
    tone,
    items,
}: {
    title: string;
    tone: 'amber' | 'emerald';
    items: string[];
}) {
    const toneClass = tone === 'amber'
        ? 'border-amber-500/20 bg-amber-500/[0.06] text-amber-200'
        : 'border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-200';

    return (
        <div className={`rounded-2xl border p-4 ${toneClass}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-current/80">{title}</div>
            <div className="mt-3 space-y-2">
                {items.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-white/85">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
