import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Boxes, CheckCircle2, Layers3, Sparkles } from 'lucide-react';
import { LabMetricCard } from './LabMetricCard';
import { LabStoryCard } from './LabStoryCard';

type Mode = 'generics' | 'union';
type GenericType = 'number' | 'string';
type StatusValue = 'loading' | 'success' | 'failed' | 'error';

export const TypeScriptAdvancedLab = () => {
    const [mode, setMode] = useState<Mode>('generics');
    const [genericType, setGenericType] = useState<GenericType>('number');
    const [statusValue, setStatusValue] = useState<StatusValue>('failed');

    const genericAnalysis = useMemo(() => {
        const valid = genericType === 'number';
        return {
            valid,
            signature: 'createBox<number>(value)',
            input: valid ? 'createBox(100)' : "createBox('hello')",
            valuePreview: valid ? '100' : "'hello'",
            message: valid
                ? 'T 被推导成 number，后续只能按 number 的能力来用它。'
                : '如果你以为它会是 number，但实际传进来的是 string，类型系统会立刻提醒你。',
            error: valid ? null : "Type 'string' is not assignable to type 'number'.",
        };
    }, [genericType]);

    const unionAnalysis = useMemo(() => {
        const valid = statusValue !== 'failed';
        return {
            valid,
            allowed: "'idle' | 'loading' | 'success' | 'error'",
            chosen: statusValue,
            message: valid
                ? `当前状态是 ${statusValue}，它在联合类型允许的范围内。`
                : "'failed' 不在允许集合里，所以 TS 会阻止它流进业务状态。",
            error: valid ? null : "Type 'failed' is not assignable to type 'Status'.",
        };
    }, [statusValue]);

    const current = mode === 'generics' ? genericAnalysis : unionAnalysis;

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            <Sparkles size={12} />
                            TypeScript Advanced
                        </div>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                            泛型帮你保留“值的形状”，联合类型帮你限制“值的范围”
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            这节不要死背术语。先切换两种模式，看看 TypeScript 到底在保护什么。
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setMode('generics')}
                            className={`rounded-2xl border px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                                mode === 'generics'
                                    ? 'border-violet-500/40 bg-violet-500/12 text-violet-200'
                                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Generics
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('union')}
                            className={`rounded-2xl border px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                                mode === 'union'
                                    ? 'border-cyan-500/40 bg-cyan-500/12 text-cyan-200'
                                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Union Types
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <LabMetricCard label="Current Mode" value={mode === 'generics' ? 'Preserve Type' : 'Restrict Options'} tone={mode === 'generics' ? 'violet' : 'cyan'} />
                    <LabMetricCard label="Type Safety" value={current.valid ? 'Healthy' : 'Blocked'} tone={current.valid ? 'emerald' : 'amber'} />
                    <LabMetricCard label="TS Focus" value={mode === 'generics' ? 'What flows through T' : 'What values are allowed'} tone="slate" />
                    <LabMetricCard label="Mental Cue" value={mode === 'generics' ? 'Shape' : 'Range'} tone="slate" />
                </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.78fr_1.22fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                            Interactive Controls
                        </div>

                        {mode === 'generics' ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setGenericType('number')}
                                    className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                        genericType === 'number'
                                            ? 'border-emerald-500/40 bg-emerald-500/12 text-emerald-200'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    Pass number
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGenericType('string')}
                                    className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                        genericType === 'string'
                                            ? 'border-amber-500/40 bg-amber-500/12 text-amber-200'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    Pass string
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {(['loading', 'success', 'failed', 'error'] as StatusValue[]).map(value => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setStatusValue(value)}
                                        className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                            statusValue === value
                                                ? value === 'failed'
                                                    ? 'border-amber-500/40 bg-amber-500/12 text-amber-200'
                                                    : 'border-cyan-500/40 bg-cyan-500/12 text-cyan-200'
                                                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <LabStoryCard
                        icon={mode === 'generics' ? Boxes : Layers3}
                        title={mode === 'generics' ? 'Generics 心智模型' : 'Union 心智模型'}
                        tone={mode === 'generics' ? 'violet' : 'cyan'}
                        items={
                            mode === 'generics'
                                ? [
                                    'T 不是 magic，它只是“先留一个类型占位”。',
                                    '谁传进来，T 就跟着变成谁。',
                                    '所以泛型的价值是保住信息，不要在流程中把类型弄丢。',
                                ]
                                : [
                                    '联合类型不是“模糊”，而是“有限集合”。',
                                    '它把允许值收窄到一个清单里。',
                                    '所以写错状态名时，TS 能比运行时更早阻止你。',
                                ]
                        }
                    />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Compiler View</div>
                            <div className="mt-1 text-sm font-bold text-white">
                                {mode === 'generics'
                                    ? '先看 T 被推导成了什么，再看后续操作是否合法。'
                                    : '先看值是否落在允许集合里，再决定状态能不能继续流动。'}
                            </div>
                        </div>
                        <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                            current.valid
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        }`}>
                            {current.valid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                            {current.valid ? 'Type OK' : 'Type Error'}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <CodeCard
                            title={mode === 'generics' ? 'Source Example' : 'Allowed Union'}
                            tone={mode === 'generics' ? 'violet' : 'cyan'}
                            code={mode === 'generics'
                                ? `function createBox<T>(value: T) {\n  return { value };\n}\n\nconst result = ${genericAnalysis.input};`
                                : `type Status = ${unionAnalysis.allowed};\n\nlet currentStatus: Status = '${unionAnalysis.chosen}';`}
                        />
                        <CodeCard
                            title="TypeScript Result"
                            tone={current.valid ? 'emerald' : 'amber'}
                            code={current.valid
                                ? current.message
                                : current.error ?? 'Unknown type issue'}
                        />
                    </div>

                    <motion.div
                        key={`${mode}-${current.valid ? 'ok' : 'error'}`}
                        initial={{ opacity: 0.55, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-4"
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Why It Matters</div>
                        <p className="mt-3 text-sm leading-7 text-white">
                            {mode === 'generics'
                                ? '泛型让你在抽象通用逻辑时，不需要退回 any。它的价值是“抽象了，但信息还在”。'
                                : '联合类型让业务状态从“任意字符串”变成“有限选项”，它的价值是“拼错之前就拦住”。'}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

function CodeCard({
    title,
    tone,
    code,
}: {
    title: string;
    tone: 'violet' | 'cyan' | 'emerald' | 'amber';
    code: string;
}) {
    const toneClass = tone === 'violet'
        ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
        : tone === 'cyan'
            ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200'
            : tone === 'emerald'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-200';

    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${toneClass}`}>
                {title}
            </div>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0b0c] p-4 whitespace-pre-wrap text-[12px] leading-7 text-gray-200">{code}</pre>
        </div>
    );
}
