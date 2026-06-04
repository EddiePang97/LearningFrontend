import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowDown, Zap, Layout, Layers, Share2 } from 'lucide-react';
import { LabFrame } from './LabFrame';

type StateMode = 'drilling' | 'global' | 'context';

const StateNode = ({ label, children, isActive, badge, mode }: {
    label: string;
    children?: React.ReactNode;
    isActive: boolean;
    badge?: React.ReactNode;
    mode: StateMode;
}) => (
    <motion.div
        animate={{
            borderColor: isActive ? (mode === 'context' ? '#f97316' : '#60a5fa') : 'rgba(255,255,255,0.1)',
            backgroundColor: isActive ? (mode === 'context' ? 'rgba(249,115,22,0.1)' : 'rgba(59,130,246,0.1)') : 'transparent',
            scale: isActive ? 1.05 : 1
        }}
        className="border-2 rounded-xl p-4 flex flex-col items-center gap-2 min-w-[120px] relative transition-colors"
    >
        {badge && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 border border-current px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap z-20">
                {badge}
            </div>
        )}
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        {children}
    </motion.div>
);

export const StateMgmtLab = () => {
    const [mode, setMode] = useState<StateMode>('drilling');
    const [themeColor, setThemeColor] = useState('blue');
    const [updatePath, setUpdatePath] = useState<string[]>([]);

    // Simulate update flow
    const triggerUpdate = (color: string) => {
        setThemeColor(color);
        if (mode === 'drilling') {
            // Animate path: App -> Layout -> Page -> Button
            setUpdatePath(['app']);
            setTimeout(() => setUpdatePath(['app', 'layout']), 400);
            setTimeout(() => setUpdatePath(['app', 'layout', 'page']), 800);
            setTimeout(() => setUpdatePath(['app', 'layout', 'page', 'button']), 1200);
            setTimeout(() => setUpdatePath([]), 2000);
        } else if (mode === 'global') {
            // Global: Store -> Button directly
            setUpdatePath(['store', 'button']);
            setTimeout(() => setUpdatePath([]), 1000);
        } else {
            // Context: Provider (App) -> Button (Consumer)
            // We highlight App and Button effectively simultaneously or with a "teleport" delay
            setUpdatePath(['app']);
            setTimeout(() => setUpdatePath(['app', 'button']), 600);
            setTimeout(() => setUpdatePath([]), 1500);
        }
    };

    return (
        <LabFrame
            className="relative min-h-[480px] md:min-h-[600px] w-full"
            icon={Database}
            title="State Management Lab"
        >

            {/* Header / Control */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gray-900/50 p-4 rounded-2xl border border-white/5 z-20 w-full">
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => setMode('drilling')}
                        className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${mode === 'drilling' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'border-white/5 hover:bg-white/5 text-gray-400'}`}
                    >
                        <ArrowDown size={16} /> Props Drilling
                    </button>
                    <button
                        onClick={() => setMode('context')}
                        className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${mode === 'context' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'border-white/5 hover:bg-white/5 text-gray-400'}`}
                    >
                        <Share2 size={16} /> React Context
                    </button>
                    <button
                        onClick={() => setMode('global')}
                        className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${mode === 'global' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'border-white/5 hover:bg-white/5 text-gray-400'}`}
                    >
                        <Zap size={16} /> Global State
                    </button>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => triggerUpdate('blue')} className="w-8 h-8 rounded-full bg-blue-500 hover:scale-110 transition-transform ring-2 ring-transparent hover:ring-white" />
                    <button onClick={() => triggerUpdate('red')} className="w-8 h-8 rounded-full bg-red-500 hover:scale-110 transition-transform ring-2 ring-transparent hover:ring-white" />
                    <button onClick={() => triggerUpdate('green')} className="w-8 h-8 rounded-full bg-green-500 hover:scale-110 transition-transform ring-2 ring-transparent hover:ring-white" />
                </div>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 relative flex flex-col md:flex-row items-center md:items-start justify-center pt-4 md:pt-10 w-full">

                {mode === 'global' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        className={`
                            relative mb-8 md:mb-0 md:absolute md:left-4 lg:left-10 md:top-20 z-20
                            border-2 rounded-2xl p-6 
                            ${updatePath.includes('store') ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500/30 bg-purple-900/10'}
                        `}
                    >
                        <div className="flex items-center gap-2 text-purple-400 mb-2 font-bold">
                            <Database size={20} /> GLOBAL STORE
                        </div>
                        <div className="text-xs text-gray-400">Theme: <span style={{ color: themeColor }}>{themeColor}</span></div>

                        {/* Connection Line to Button (Desktop Only) */}
                        <svg className="hidden md:block absolute left-[150px] top-[50px] w-[300px] h-[300px] pointer-events-none opacity-50 overflow-visible">
                            <motion.path
                                d="M0,0 C100,0 100,300 300,300"
                                fill="none"
                                stroke={updatePath.includes('store') ? "#a855f7" : "#581c87"}
                                strokeWidth="4"
                                strokeDasharray="10 5"
                                animate={{ strokeDashoffset: updatePath.includes('store') ? [0, -200] : 0 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </svg>
                    </motion.div>
                )}

                {/* Context Overlay Curve (Desktop Only) */}
                {mode === 'context' && (
                    <svg className="hidden md:flex absolute top-10 w-[200px] h-[400px] pointer-events-none opacity-50 overflow-visible z-0 -right-20">
                        {/* A curve from top (App) to bottom (Button) bypassing the middle */}
                        <motion.path
                            d="M-50,50 C50,50 50,350 -50,350"
                            fill="none"
                            stroke={updatePath.includes('app') && updatePath.includes('button') ? "#f97316" : "#431407"}
                            strokeWidth="4"
                            strokeDasharray="10 5"
                            animate={{ strokeDashoffset: updatePath.includes('button') ? [0, -200] : 0 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>
                )}


                <div className="flex flex-col items-center gap-8 md:gap-12 relative z-10">
                    <StateNode
                        label="<App />"
                        isActive={updatePath.includes('app')}
                        badge={mode === 'context' ? <span className="text-orange-400">Provider</span> : null}
                        mode={mode}
                    >
                        <Layout size={24} className="text-gray-500" />
                        {mode === 'drilling' && <div className="text-[10px] text-gray-500 mt-1">prop: theme={themeColor}</div>}
                        {mode === 'context' && <div className="text-[10px] text-orange-400 mt-1">value={'{'}{themeColor}{'}'}</div>}
                    </StateNode>

                    <div className="h-6 md:h-8 w-0.5 bg-gray-700" />

                    <StateNode label="<Layout />" isActive={updatePath.includes('layout')} mode={mode}>
                        <Layers size={24} className="text-gray-500" />
                        {mode === 'drilling' && <div className="text-[10px] text-gray-500 mt-1">prop: theme={themeColor}</div>}
                    </StateNode>

                    <div className="h-6 md:h-8 w-0.5 bg-gray-700" />

                    <StateNode label="<Page />" isActive={updatePath.includes('page')} mode={mode}>
                        <div className="text-gray-500">📄</div>
                        {mode === 'drilling' && <div className="text-[10px] text-gray-500 mt-1">prop: theme={themeColor}</div>}
                    </StateNode>

                    <div className="h-6 md:h-8 w-0.5 bg-gray-700" />

                    <StateNode
                        label="<ThemedButton />"
                        isActive={updatePath.includes('button')}
                        badge={mode === 'context' ? <span className="text-orange-400">Consumer</span> : null}
                        mode={mode}
                    >
                        <button
                            className="px-6 py-2 rounded-lg font-bold text-white transition-colors duration-500 shadow-lg"
                            style={{ backgroundColor: themeColor === 'blue' ? '#3b82f6' : themeColor === 'red' ? '#ef4444' : '#22c55e' }}
                        >
                            I am {themeColor}
                        </button>
                    </StateNode>
                </div>
            </div>

            {/* Explainer */}
            <div className="mt-8 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs text-gray-400 leading-relaxed min-h-[80px]">
                {mode === 'drilling' && (
                    <p><strong className="text-blue-400">Props Drilling:</strong> Data must flow through EVERY layer (App -&gt; Layout -&gt; Page) just to reach the Button. Intermediate components (Layout, Page) act as "couriers" even if they don't use the data.</p>
                )}
                {mode === 'context' && (
                    <p><strong className="text-orange-400">React Context:</strong> Data is "teleported" from a Provider (App) directly to consuming components (Button). Intermediate components (Layout, Page) are skipped in the data flow, avoiding prop drilling.</p>
                )}
                {mode === 'global' && (
                    <p><strong className="text-purple-400">Global State:</strong> The Button connects DIRECTLY to the Store (external to the component tree). This is similar to Context but often comes with more features like DevTools, middleware, and performance optimizations (Select).</p>
                )}
            </div>
        </LabFrame>
    );
};
