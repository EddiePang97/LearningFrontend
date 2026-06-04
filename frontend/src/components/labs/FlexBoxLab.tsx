import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FlexBoxLab = () => {
    const [flexDirection, setFlexDirection] = useState<React.CSSProperties['flexDirection']>('row');
    const [justifyContent, setJustifyContent] = useState<React.CSSProperties['justifyContent']>('flex-start');
    const [alignItems, setAlignItems] = useState<React.CSSProperties['alignItems']>('stretch');
    const [flexWrap, setFlexWrap] = useState<React.CSSProperties['flexWrap']>('nowrap');
    const [items, setItems] = useState([1, 2, 3]);

    const code = `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
}`;

    return (
        <div className="flex min-h-[480px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl md:min-h-[600px]">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs font-mono text-white/40">FLEXBOX INSPECTOR</span>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row">
                {/* Controls Panel */}
                <div className="w-full border-b border-white/10 bg-black/20 p-4 overflow-y-auto custom-scrollbar lg:w-80 lg:border-b-0 lg:border-r lg:p-6">
                    <div className="space-y-8">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">flex-direction</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['row', 'row-reverse', 'column', 'column-reverse'] as const).map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setFlexDirection(val)}
                                    className={`min-w-0 break-words px-3 py-2 text-xs rounded-lg transition-all ${flexDirection === val
                                            ? 'bg-accent-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">justify-content</label>
                            <div className="flex flex-wrap gap-2">
                                {(['flex-start', 'flex-end', 'center', 'space-between', 'space-around'] as const).map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setJustifyContent(val)}
                                    className={`px-3 py-2 text-xs rounded-lg transition-all ${justifyContent === val
                                            ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">align-items</label>
                            <div className="flex flex-wrap gap-2">
                                {(['flex-start', 'flex-end', 'center', 'stretch', 'baseline'] as const).map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setAlignItems(val)}
                                        className={`px-3 py-2 text-xs rounded-lg transition-all ${alignItems === val
                                            ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">flex-wrap</label>
                            <div className="flex flex-wrap gap-2">
                                {(['nowrap', 'wrap', 'wrap-reverse'] as const).map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setFlexWrap(val)}
                                        className={`px-3 py-2 text-xs rounded-lg transition-all ${flexWrap === val
                                            ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Items</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => items.length < 8 && setItems([...items, items.length + 1])}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors"
                                >
                                    Add Item +
                                </button>
                                <button
                                    onClick={() => items.length > 1 && setItems(items.slice(0, -1))}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Remove -
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 overflow-x-auto rounded-xl border border-white/5 bg-black/40 p-4">
                        <pre className="text-[10px] leading-relaxed text-gray-400 font-mono whitespace-pre-wrap">
                            {code}
                        </pre>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="relative flex min-h-[320px] flex-1 flex-col overflow-hidden bg-[#0f0f11] p-4 md:min-h-[420px] md:p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />

                    <div
                        className="flex-grow rounded-2xl border-2 border-dashed border-white/20 relative transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                        style={{
                            display: 'flex',
                            flexDirection,
                            justifyContent,
                            alignItems,
                            flexWrap,
                            gap: '16px',
                            padding: window.innerWidth < 768 ? '16px' : '24px'
                        }}
                    >
                        <AnimatePresence>
                            {items.map(item => (
                                <motion.div
                                    key={item}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    className="w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-2xl font-black bg-gradient-to-br from-accent-purple to-blue-600 shadow-lg text-white border border-white/10 relative group"
                                >
                                    <span className="relative z-10">{item}</span>
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
