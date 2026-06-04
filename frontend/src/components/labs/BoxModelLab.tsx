import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from 'lucide-react';

export const BoxModelLab: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState<'content' | 'padding' | 'border' | 'margin' | null>(null);

    const layers: Array<{
        id: NonNullable<typeof activeLayer>;
        label: string;
        color: string;
        borderColor: string;
        textColor: string;
    }> = [
        { id: 'margin', label: 'MARGIN', color: 'bg-orange-500/20', borderColor: 'border-orange-500/40', textColor: 'text-orange-400' },
        { id: 'border', label: 'BORDER', color: 'bg-yellow-500/20', borderColor: 'border-yellow-500/40', textColor: 'text-yellow-400' },
        { id: 'padding', label: 'PADDING', color: 'bg-green-500/20', borderColor: 'border-green-500/40', textColor: 'text-green-400' },
        { id: 'content', label: 'CONTENT', color: 'bg-blue-500/20', borderColor: 'border-blue-500/40', textColor: 'text-blue-400' },
    ];

    const handleLayerToggle = (layerId: NonNullable<typeof activeLayer>) => {
        setActiveLayer(current => current === layerId ? null : layerId);
    };

    return (
        <div className="w-full flex min-h-[420px] flex-col items-center justify-center gap-6 rounded-3xl border border-white/5 bg-black/20 p-4 md:min-h-[520px] md:p-8 overflow-hidden">
            <div className="flex flex-wrap justify-center gap-3">
                {layers.map(layer => (
                    <button
                        key={layer.id}
                        type="button"
                        onClick={() => handleLayerToggle(layer.id)}
                        onMouseEnter={() => setActiveLayer(layer.id)}
                        onMouseLeave={() => setActiveLayer(null)}
                        className={`min-w-[92px] rounded-full px-3 py-2 text-[10px] font-black tracking-tighter transition-all md:min-w-0 ${activeLayer === layer.id ? `${layer.color} ${layer.textColor} ring-1 ring-white/10` : 'bg-white/5 text-gray-500'
                            }`}
                    >
                        {layer.label}
                    </button>
                ))}
            </div>

            <div className="relative flex w-full max-w-[280px] aspect-square items-center justify-center md:max-w-[320px]">
                {/* Margin */}
                <motion.div
                    animate={{
                        scale: activeLayer === 'margin' ? 1.05 : 1,
                        opacity: activeLayer && activeLayer !== 'margin' ? 0.3 : 1
                    }}
                    className="absolute inset-0 border-2 border-dashed border-orange-500/20 rounded-xl flex items-start justify-start p-2"
                >
                    <span className="text-[8px] font-black text-orange-500/40 uppercase tracking-widest">Margin</span>
                </motion.div>

                {/* Border */}
                <motion.div
                    animate={{
                        scale: activeLayer === 'border' ? 1.05 : 1,
                        opacity: activeLayer && activeLayer !== 'border' ? 0.3 : 1
                    }}
                    className="absolute inset-[15%] border-4 border-yellow-500/30 rounded-lg bg-yellow-500/5 flex items-start justify-start p-2"
                >
                    <span className="text-[8px] font-black text-yellow-500/40 uppercase tracking-widest">Border</span>
                </motion.div>

                {/* Padding */}
                <motion.div
                    animate={{
                        scale: activeLayer === 'padding' ? 1.05 : 1,
                        opacity: activeLayer && activeLayer !== 'padding' ? 0.3 : 1
                    }}
                    className="absolute inset-[25%] border-2 border-dashed border-green-500/20 rounded-md bg-green-500/5 flex items-start justify-start p-2"
                >
                    <span className="text-[8px] font-black text-green-500/40 uppercase tracking-widest">Padding</span>
                </motion.div>

                {/* Content */}
                <motion.div
                    layoutId="box-content"
                    animate={{
                        scale: activeLayer === 'content' ? 1.1 : 1,
                        backgroundColor: activeLayer === 'content' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                    }}
                    className="absolute inset-[35%] rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-2xl shadow-blue-500/20"
                >
                    <Box className="text-blue-500/50" size={24} />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeLayer === 'content' ? 1 : 0 }}
                        className="absolute inset-x-0 -bottom-8 text-center text-[10px] font-bold text-blue-400"
                    >
                        120px x 120px
                    </motion.div>
                </motion.div>

                {/* Connectors/Lines for visual flair */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <line x1="0" y1="0" x2="35%" y2="35%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="100%" y1="0" x2="65%" y2="35%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="0" y1="100%" x2="35%" y2="65%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="100%" y1="100%" x2="65%" y2="65%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                </svg>
            </div>

            <div className="max-w-[280px] text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={activeLayer || 'default'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-gray-400 leading-relaxed"
                    >
                        {activeLayer === 'margin' && "Margin 是盒子之间的距离。它不影响盒子自身的大小，但决定了它周边的空间。"}
                        {activeLayer === 'border' && "Border 是盒子的边框。它位于 Padding 和 Margin 之间，可以有宽度、样式和颜色。"}
                        {activeLayer === 'padding' && "Padding 是内容与边框之间的‘呼吸空间’。它会撑大盒子的背景。"}
                        {activeLayer === 'content' && "Content 是你放置文本、图片或子组件的真实核心区域。"}
                        {!activeLayer && "点击或悬停在不同层级上，探索 CSS 盒模型的空间构成。"}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};
