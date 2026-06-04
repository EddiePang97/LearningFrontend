import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Boxes, Brush, FileCode2, FileJson, FileText, Package, Sparkles } from 'lucide-react';

type AssetKind = 'css' | 'ts' | 'html';

const ASSET_META: Record<AssetKind, { label: string; icon: typeof Brush; source: string; loader: string; output: string }> = {
    css: {
        label: 'styles.css',
        icon: Brush,
        source: 'body { color: rebeccapurple; }',
        loader: 'css-loader -> style-loader',
        output: 'Inject CSS into the page',
    },
    ts: {
        label: 'app.ts',
        icon: FileCode2,
        source: 'const total: number = 42;',
        loader: 'ts-loader',
        output: 'Transpile TypeScript to JS',
    },
    html: {
        label: 'index.html',
        icon: FileText,
        source: '<div id="root"></div>',
        loader: 'html-loader',
        output: 'Allow HTML imports in the graph',
    },
};

const PLUGIN_META = [
    {
        id: 'html',
        label: 'HtmlWebpackPlugin',
        effect: 'Generate final HTML and inject bundle tags',
    },
    {
        id: 'mini-css',
        label: 'MiniCssExtractPlugin',
        effect: 'Extract CSS into a separate deployable file',
    },
    {
        id: 'define',
        label: 'DefinePlugin',
        effect: 'Replace environment variables at build time',
    },
] as const;

export const WebpackLab = () => {
    const [asset, setAsset] = useState<AssetKind>('css');
    const [pluginId, setPluginId] = useState<(typeof PLUGIN_META)[number]['id']>('html');
    const [showConfig, setShowConfig] = useState(false);

    const assetMeta = ASSET_META[asset];
    const pluginMeta = PLUGIN_META.find(item => item.id === pluginId) ?? PLUGIN_META[0];

    const loaderStory = useMemo(() => {
        if (asset === 'css') {
            return [
                'Webpack 先碰到一个自己不认识的 .css 文件。',
                'loader 从右到左执行，先把 CSS 读成模块，再交给 style-loader 注入页面。',
                '所以 Loader 的角色是“把资源变成 Webpack 能继续处理的模块”。',
            ];
        }

        if (asset === 'ts') {
            return [
                'Webpack 读到 .ts 文件时，本身并不会理解类型注解。',
                'ts-loader 先把 TypeScript 转成 JavaScript，Webpack 才能继续打包依赖图。',
                '所以 Loader 更像“翻译器”，负责单个文件的转换。',
            ];
        }

        return [
            '当 HTML 也进入依赖图时，Webpack 同样需要先知道怎么读取它。',
            'html-loader 把 HTML 变成可被 import 的模块内容。',
            '这再次说明 Loader 只关注“这个文件怎么变成模块”。',
        ];
    }, [asset]);

    const pluginStory = useMemo(() => {
        if (pluginId === 'html') {
            return [
                '打包完 JS 以后，还需要一份最终 HTML 去引用这些产物。',
                'HtmlWebpackPlugin 不是改一个文件，而是在整个构建流程后生成页面壳。',
                '所以 Plugin 处理的是“整个构建过程中的一个额外任务”。',
            ];
        }

        if (pluginId === 'mini-css') {
            return [
                'Loader 可以把 CSS 塞进 JS 里，但线上往往更希望单独缓存 CSS。',
                'MiniCssExtractPlugin 会在构建阶段把样式抽出成单独文件。',
                '这属于构建级能力，不是某个单文件转换能独立完成的事。',
            ];
        }

        return [
            '有些构建行为不是转文件，而是替换全局常量或环境变量。',
            'DefinePlugin 会在整个 bundle 生成过程中把表达式静态替换掉。',
            '这也是 Plugin 的典型职责：介入编译生命周期，而不是只改一份源码。',
        ];
    }, [pluginId]);

    return (
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <Boxes size={12} />
                            Webpack Pipeline
                        </div>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                            Loader 负责翻译文件，Plugin 负责干预构建流程
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                            这一节不要把 Loader 和 Plugin 都记成“插件”。最容易理解的方法是亲眼看它们分别作用在哪一层。
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowConfig(current => !current)}
                        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                        <FileJson size={14} />
                        {showConfig ? 'Hide Config' : 'Show Config'}
                    </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard label="Loader Scope" value="单个文件" />
                    <MetricCard label="Plugin Scope" value="整个构建流程" />
                    <MetricCard label="Current Asset" value={assetMeta.label} />
                    <MetricCard label="Current Plugin" value={pluginMeta.label} />
                </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Pick A File</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {Object.entries(ASSET_META).map(([key, meta]) => {
                                const Icon = meta.icon;
                                const active = asset === key;

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setAsset(key as AssetKind)}
                                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                            active
                                                ? 'border-violet-500/40 bg-violet-500/12 text-violet-200'
                                                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <Icon size={14} />
                                        {meta.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Pick A Plugin</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {PLUGIN_META.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setPluginId(item.id)}
                                    className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                        item.id === pluginId
                                            ? 'border-sky-500/40 bg-sky-500/12 text-sky-200'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <StoryCard
                            title="Loader Lens"
                            accent="violet"
                            items={loaderStory}
                        />
                        <StoryCard
                            title="Plugin Lens"
                            accent="sky"
                            items={pluginStory}
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111114] p-4">
                    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Build Flow</div>
                            <div className="mt-1 text-sm font-bold text-white">
                                先看 Loader 怎么处理一个文件，再看 Plugin 怎么在构建末端接管额外工作。
                            </div>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Package size={12} />
                            webpack.config.js
                        </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-3">
                        <FlowBlock
                            title="1. Source File"
                            accent="amber"
                            body={assetMeta.source}
                            footer={assetMeta.label}
                        />
                        <FlowBlock
                            title="2. Loader Chain"
                            accent="violet"
                            body={assetMeta.loader}
                            footer="Convert one file into a usable module"
                        />
                        <FlowBlock
                            title="3. Plugin Hook"
                            accent="sky"
                            body={pluginMeta.effect}
                            footer={pluginMeta.label}
                        />
                    </div>

                    <motion.div
                        key={`${asset}-${pluginId}`}
                        initial={{ opacity: 0.55, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-4"
                    >
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">What The Browser Gets</div>
                                <div className="mt-2 text-lg font-black text-white">{assetMeta.output}</div>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                                <Sparkles size={12} />
                                Plugin adds build-time superpowers
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                            <PipelineChip label={assetMeta.label} tone="amber" />
                            <ArrowRight className="hidden text-white/30 xl:block" size={16} />
                            <PipelineChip label={assetMeta.loader} tone="violet" />
                            <ArrowRight className="hidden text-white/30 xl:block" size={16} />
                            <PipelineChip label={pluginMeta.label} tone="sky" />
                        </div>

                        {showConfig && (
                            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0b0c] p-4">
                                <pre className="min-w-[320px] whitespace-pre-wrap text-[11px] leading-6 text-gray-300">{`module.exports = {
  module: {
    rules: [
      { test: /\\.${asset}$/, use: ['${assetMeta.loader.split(' -> ').join("', '")}'] }
    ]
  },
  plugins: [
    new ${pluginMeta.label}()
  ]
};`}</pre>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

function MetricCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">{label}</div>
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
    accent: 'violet' | 'sky';
    items: string[];
}) {
    const accentClass = accent === 'violet'
        ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
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

function FlowBlock({
    title,
    body,
    footer,
    accent,
}: {
    title: string;
    body: string;
    footer: string;
    accent: 'amber' | 'violet' | 'sky';
}) {
    const accentClass = accent === 'amber'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
        : accent === 'violet'
            ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
            : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <div className="rounded-2xl border border-white/10 bg-[#0d0d0f] p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">{title}</div>
            <div className={`mt-4 rounded-2xl border px-4 py-4 text-sm leading-7 ${accentClass}`}>
                {body}
            </div>
            <div className="mt-3 text-xs leading-6 text-gray-400">{footer}</div>
        </div>
    );
}

function PipelineChip({
    label,
    tone,
}: {
    label: string;
    tone: 'amber' | 'violet' | 'sky';
}) {
    const toneClass = tone === 'amber'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
        : tone === 'violet'
            ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
            : 'border-sky-500/30 bg-sky-500/10 text-sky-200';

    return (
        <div className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest ${toneClass}`}>
            {label}
        </div>
    );
}
