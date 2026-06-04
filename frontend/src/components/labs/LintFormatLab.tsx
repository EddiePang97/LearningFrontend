import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, FileSearch, Paintbrush2, Sparkles, Wand2 } from 'lucide-react';

type RuleKey = 'semicolon' | 'quotes' | 'strictEquality' | 'unusedVar';

const RULE_LABELS: Record<RuleKey, string> = {
    semicolon: '缺少分号',
    quotes: '双引号风格不一致',
    strictEquality: '使用 == 而不是 ===',
    unusedVar: '声明了未使用变量',
};

export const LintFormatLab = () => {
    const [brokenRules, setBrokenRules] = useState<Record<RuleKey, boolean>>({
        semicolon: true,
        quotes: true,
        strictEquality: true,
        unusedVar: false,
    });

    const lintIssues = useMemo(() => {
        const next: string[] = [];

        if (brokenRules.strictEquality) {
            next.push("Expected '===' and instead saw '=='.");
        }

        if (brokenRules.unusedVar) {
            next.push("'debugMode' is assigned a value but never used.");
        }

        if (brokenRules.semicolon) {
            next.push('Missing semicolon.');
        }

        return next;
    }, [brokenRules]);

    const prettierChanges = useMemo(() => {
        const next: string[] = [];

        if (brokenRules.quotes) {
            next.push('把双引号改成统一的单引号。');
        }

        if (brokenRules.semicolon) {
            next.push('在语句结尾补上分号。');
        }

        if (!next.length) {
            next.push('当前格式已经满足 Prettier 规则。');
        }

        return next;
    }, [brokenRules]);

    const codeBefore = useMemo(() => {
        const lines = [
            "const title = " + (brokenRules.quotes ? '"Learning Atlas"' : "'Learning Atlas'") + (brokenRules.semicolon ? '' : ';'),
            "const isReady = status " + (brokenRules.strictEquality ? '== "ready"' : "=== 'ready'") + (brokenRules.semicolon ? '' : ';'),
        ];

        if (brokenRules.unusedVar) {
            lines.push("const debugMode = true" + (brokenRules.semicolon ? '' : ';'));
        }

        lines.push("console.log(title)" + (brokenRules.semicolon ? '' : ';'));

        return lines.join('\n');
    }, [brokenRules]);

    const codeAfter = useMemo(() => {
        const lines = [
            "const title = 'Learning Atlas';",
            "const isReady = status === 'ready';",
            "console.log(title);",
        ];

        return lines.join('\n');
    }, []);

    const toggleRule = (rule: RuleKey) => {
        setBrokenRules(current => ({
            ...current,
            [rule]: !current[rule],
        }));
    };

    const lintHealthy = lintIssues.length === 0;

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
                            <Sparkles size={12} />
                            Linting vs Formatting
                        </div>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                            ESLint 负责抓问题，Prettier 负责把代码排整齐
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            点击下面的规则开关，观察哪些问题属于 ESLint，哪些只是 Prettier 会帮你自动统一的格式差异。
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard label="ESLint" value="找 bug / 风险" accent="sky" />
                        <MetricCard label="Prettier" value="统一格式" accent="violet" />
                        <MetricCard label="Lint Issues" value={String(lintIssues.length)} accent={lintHealthy ? 'emerald' : 'amber'} />
                        <MetricCard label="Format Changes" value={String(prettierChanges.filter(item => item !== '当前格式已经满足 Prettier 规则。').length)} accent="violet" />
                    </div>
                </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.82fr_1.18fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Rule Toggles</div>
                        <div className="mt-3 grid gap-2">
                            {(Object.keys(RULE_LABELS) as RuleKey[]).map(rule => (
                                <button
                                    key={rule}
                                    type="button"
                                    onClick={() => toggleRule(rule)}
                                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-black uppercase tracking-widest transition-all ${
                                        brokenRules[rule]
                                            ? 'border-amber-500/35 bg-amber-500/10 text-amber-200'
                                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <span>{RULE_LABELS[rule]}</span>
                                    <span>{brokenRules[rule] ? 'Broken' : 'Clean'}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <StoryPanel
                        icon={FileSearch}
                        title="ESLint 会在意的"
                        accent="sky"
                        items={[
                            '潜在逻辑错误，例如 == 和 === 混用。',
                            '无用变量、危险模式、团队约定的代码风险。',
                            '有些格式问题它也能报，但本质上它更偏向“代码质量检查”。',
                        ]}
                    />

                    <StoryPanel
                        icon={Paintbrush2}
                        title="Prettier 会在意的"
                        accent="violet"
                        items={[
                            '单双引号是否统一。',
                            '分号、缩进、换行、尾随逗号这些纯格式细节。',
                            '它不会帮你判断业务逻辑对不对，只负责让代码长得一致。',
                        ]}
                    />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Side-by-Side Result</div>
                            <div className="mt-1 text-sm font-bold text-white">
                                左边是当前代码状态，右边是格式化和修复后的结果。
                            </div>
                        </div>
                        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                            lintHealthy
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        }`}>
                            {lintHealthy ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                            {lintHealthy ? 'Lint Clean' : 'Needs Attention'}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <CodePanel title="Before" code={codeBefore} accent="amber" />
                        <CodePanel title="After" code={codeAfter} accent="emerald" />
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                        <ResultPanel
                            title="ESLint Output"
                            icon={FileSearch}
                            accent={lintHealthy ? 'emerald' : 'sky'}
                            items={lintHealthy ? ['没有发现 lint 问题，逻辑风险已经清掉。'] : lintIssues}
                        />
                        <ResultPanel
                            title="Prettier Output"
                            icon={Wand2}
                            accent="violet"
                            items={prettierChanges}
                        />
                    </div>

                    <motion.div
                        key={JSON.stringify(brokenRules)}
                        initial={{ opacity: 0.6, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-4"
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">One-Line Memory Aid</div>
                        <p className="mt-3 text-sm leading-7 text-white">
                            ESLint 更像代码审查机器人，Prettier 更像自动排版机。前者帮你减少错误，后者帮团队减少“长得不一样”的争论。
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
    accent,
}: {
    label: string;
    value: string;
    accent: 'sky' | 'violet' | 'amber' | 'emerald';
}) {
    const accentClass = accent === 'violet'
        ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
        : accent === 'amber'
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

function StoryPanel({
    icon: Icon,
    title,
    accent,
    items,
}: {
    icon: typeof FileSearch;
    title: string;
    accent: 'sky' | 'violet';
    items: string[];
}) {
    const accentClass = accent === 'violet'
        ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
        : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${accentClass}`}>
                <Icon size={12} />
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

function CodePanel({
    title,
    code,
    accent,
}: {
    title: string;
    code: string;
    accent: 'amber' | 'emerald';
}) {
    const accentClass = accent === 'amber'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';

    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${accentClass}`}>
                {title}
            </div>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0b0c] p-4 text-[12px] leading-7 text-gray-200">{code}</pre>
        </div>
    );
}

function ResultPanel({
    title,
    icon: Icon,
    accent,
    items,
}: {
    title: string;
    icon: typeof FileSearch;
    accent: 'sky' | 'violet' | 'emerald';
    items: string[];
}) {
    const accentClass = accent === 'violet'
        ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
        : accent === 'emerald'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
            : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${accentClass}`}>
                <Icon size={12} />
                {title}
            </div>
            <div className="mt-3 space-y-2">
                {items.map(item => (
                    <div key={item} className="rounded-xl border border-white/10 bg-[#0b0b0c] px-3 py-3 text-xs leading-6 text-gray-300">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
