import { useState, useRef } from 'react';
import { List, Gauge, Activity } from 'lucide-react';

const ITEM_HEIGHT = 40;
const VIEWPORT_HEIGHT = 400;

export const VirtualListLab = () => {
    const [itemCount] = useState(100000);
    const [virtualEnabled, setVirtualEnabled] = useState(true);
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const visibleStart = virtualEnabled ? Math.floor(scrollTop / ITEM_HEIGHT) : 0;
    const visibleEnd = virtualEnabled
        ? Math.min(itemCount, visibleStart + Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT) + 5)
        : Math.min(itemCount, 100); // 非虛擬模式最多顯示100條

    const totalHeight = itemCount * ITEM_HEIGHT;
    const offsetY = visibleStart * ITEM_HEIGHT;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    const visibleItems = Array.from({ length: visibleEnd - visibleStart }, (_, i) => visibleStart + i);

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <List className="text-emerald-400" />
                        Virtual List Lab
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        視覺化虛擬列表性能優化
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                        <Gauge size={14} className="text-gray-500" />
                        <span className="text-[10px] text-gray-500 font-bold">Items: {itemCount.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={() => setVirtualEnabled(!virtualEnabled)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${virtualEnabled
                                ? 'bg-emerald-500 text-white'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                    >
                        {virtualEnabled ? '✓ Virtual ON' : '✗ Virtual OFF'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                {/* Virtual List Viewport */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
                            <Activity size={12} /> Scrollable List
                        </h4>
                        <div className="text-[10px] text-gray-500">
                            Rendering: <span className="text-emerald-400 font-bold">{visibleItems.length}</span> / {itemCount.toLocaleString()}
                        </div>
                    </div>

                    <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        className="flex-1 bg-black/40 rounded-2xl border border-white/5 overflow-y-auto custom-scrollbar"
                        style={{ height: `${VIEWPORT_HEIGHT}px` }}
                    >
                        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                            <div style={{ transform: `translateY(${offsetY}px)` }}>
                                {visibleItems.map(index => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between px-6 border-b border-white/5 hover:bg-white/5 transition-colors"
                                        style={{ height: `${ITEM_HEIGHT}px` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-[10px]">
                                                {index + 1}
                                            </div>
                                            <span className="text-xs text-gray-300">Item #{index + 1}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-600 font-mono">
                                            UUID-{index.toString(36).padStart(9, '0')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black">Performance</h4>

                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
                        <div>
                            <div className="text-[8px] text-gray-500 uppercase mb-2">DOM Nodes</div>
                            <div className="text-2xl font-black text-white">
                                {virtualEnabled ? visibleItems.length : '100+'}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1">
                                {virtualEnabled ? '僅渲染可視區域' : '渲染全部（受限）'}
                            </div>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div>
                            <div className="text-[8px] text-gray-500 uppercase mb-2">Scroll Position</div>
                            <div className="text-lg font-black text-emerald-400">
                                {Math.round(scrollTop)}px
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500"
                                    style={{ width: `${(scrollTop / totalHeight) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div>
                            <div className="text-[8px] text-gray-500 uppercase mb-2">Visible Range</div>
                            <div className="text-xs text-gray-400">
                                {visibleStart.toLocaleString()} - {visibleEnd.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${virtualEnabled
                            ? 'bg-emerald-500/5 border-emerald-500/10'
                            : 'bg-red-500/5 border-red-500/10'
                        }`}>
                        <div className={`text-[10px] font-bold mb-2 uppercase ${virtualEnabled ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                            {virtualEnabled ? '✓ Optimized' : '⚠ Performance Warning'}
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            {virtualEnabled
                                ? '虛擬滾動只渲染可視區域的項目，大幅降低 DOM 節點數量，即使有 10 萬條數據也能流暢滾動。'
                                : '非虛擬模式渲染所有 DOM 節點，當數據量大時會造成瀏覽器卡頓甚至崩潰。已限制最多顯示 100 項。'
                            }
                        </p>
                    </div>

                    <div className="p-4 bg-gray-900/50 rounded-xl border border-white/5">
                        <div className="text-[8px] text-gray-500 uppercase mb-2 font-bold">Algorithm</div>
                        <pre className="text-[9px] text-gray-400 overflow-x-auto">
                            {`visibleStart = scrollTop / itemHeight
visibleEnd = visibleStart + viewportHeight
offsetY = visibleStart * itemHeight`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};
