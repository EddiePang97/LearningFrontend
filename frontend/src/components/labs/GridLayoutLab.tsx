import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GridLayoutLab = () => {
    const [columns, setColumns] = useState(3);
    const [gap, setGap] = useState(16);
    const [items, setItems] = useState([1, 2, 3, 4, 5, 6]);

    const code = `.container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap}px;
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
                <span className="text-xs font-mono text-white/40">GRID INSPECTOR</span>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row">
                {/* Controls Panel */}
                <div className="w-full border-b border-white/10 bg-black/20 p-4 overflow-y-auto custom-scrollbar lg:w-80 lg:border-b-0 lg:border-r lg:p-6">
                    <div className="space-y-8">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                Columns: {columns}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={columns}
                                onChange={(e) => setColumns(parseInt(e.target.value))}
                                className="w-full accent-accent-purple"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                Gap: {gap}px
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="48"
                                value={gap}
                                onChange={(e) => setGap(parseInt(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Items</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => items.length < 12 && setItems([...items, items.length + 1])}
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
                        className="flex-grow rounded-2xl border-2 border-dashed border-white/20 relative transition-all duration-500 p-6"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${Math.min(columns, items.length)}, minmax(0, 1fr))`,
                            gap: `${gap}px`,
                            alignContent: 'start'
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
                                    className="aspect-square rounded-2xl flex items-center justify-center text-2xl font-black bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg text-white border border-white/10 relative group"
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
