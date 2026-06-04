import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Code, Info, Layers, RefreshCw } from 'lucide-react';

const COMPLEXITIES = [
    {
        id: 'o1',
        name: 'O(1)',
        label: 'Constant',
        desc: '不隨 N 增長。始終是一步。',
        color: 'text-green-400',
        stroke: '#4ade80',
        formula: () => 1,
        code: `function getFirst(arr) {\n  return arr[0]; // 永遠只有 1 步\n}`
    },
    {
        id: 'ologn',
        name: 'O(log N)',
        label: 'Logarithmic',
        desc: '極快及。每次排除一半資料。',
        color: 'text-blue-400',
        stroke: '#60a5fa',
        formula: (n: number) => Math.log2(n) || 1,
        code: `// 二分搜尋\nwhile (low <= high) {\n  mid = (low + high) / 2;\n  // ...每次砍掉一半\n}`
    },
    {
        id: 'on',
        name: 'O(N)',
        label: 'Linear',
        desc: '均勻增長。資料多一倍，時間多一倍。',
        color: 'text-yellow-400',
        stroke: '#facc15',
        formula: (n: number) => n,
        code: `for (let i = 0; i < n; i++) {\n  console.log(arr[i]);\n}`
    },
    {
        id: 'onlogn',
        name: 'O(N log N)',
        label: 'Linearithmic',
        desc: '高效排序的極限。',
        color: 'text-orange-400',
        stroke: '#fb923c',
        formula: (n: number) => n * (Math.log2(n) || 1),
        code: `// 快速排序 / 歸併排序\nfunction sort(arr) {\n  if (arr.length <= 1) return arr;\n  // ...分割並合併\n}`
    },
    {
        id: 'on2',
        name: 'O(N²)',
        label: 'Quadratic',
        desc: '慎用！兩層嵌套循環，增長劇烈。',
        color: 'text-red-400',
        stroke: '#f87171',
        formula: (n: number) => Math.pow(n, 2),
        code: `for (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    // n * n 次運算\n  }\n}`
    }
];

export const BigOLab = () => {
    const [n, setN] = useState(10);
    const [activeComp, setActiveComp] = useState(COMPLEXITIES[2]); // Default O(N)
    const width = 400;
    const height = 300;
    const padding = 40;

    const renderGraph = () => {
        return (
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Axises */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333" strokeWidth="2" />
                <line x1={padding} y1={height - padding} x2={padding} y2={padding} stroke="#333" strokeWidth="2" />
                <text x={width - padding} y={height - padding + 20} fill="#666" fontSize="10" textAnchor="end">Data Size (N)</text>
                <text x={padding - 10} y={padding} fill="#666" fontSize="10" textAnchor="end" transform={`rotate(-90, ${padding - 10}, ${padding})`}>Operations</text>

                {/* Grid */}
                {[...Array(5)].map((_, i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={padding + i * (height - 2 * padding) / 4}
                        x2={width - padding}
                        y2={padding + i * (height - 2 * padding) / 4}
                        stroke="#222"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Curves */}
                {COMPLEXITIES.map((comp) => {
                    const points = [];
                    const maxN = 50;
                    const scaleN = (width - 2 * padding) / maxN;
                    const scaleOps = (height - 2 * padding) / 2500; // Use a fixed max for better comparison

                    for (let i = 0; i <= maxN; i += 2) {
                        const ops = comp.formula(i);
                        points.push(`${padding + i * scaleN},${height - padding - ops * scaleOps}`);
                    }

                    const isSelected = activeComp.id === comp.id;

                    return (
                        <g key={comp.id}>
                            <motion.polyline
                                points={points.join(' ')}
                                fill="none"
                                stroke={comp.stroke}
                                strokeWidth={isSelected ? 4 : 2}
                                opacity={isSelected ? 1 : 0.2}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1 }}
                                className="cursor-pointer"
                                onClick={() => setActiveComp(comp)}
                            />
                            {isSelected && (
                                <motion.circle
                                    cx={padding + n * scaleN}
                                    cy={height - padding - activeComp.formula(n) * ((height - 2 * padding) / 2500)}
                                    r="6"
                                    fill={comp.stroke}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                />
                            )}
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Activity className="text-blue-400" />
                        Big O Complexity Visualizer
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 italic">
                        "How scaling data size impacts algorithm efficiency."
                    </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] text-blue-400 font-bold animate-pulse">
                    N = {n}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* Comparison Selector */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-black/40 rounded-2xl border border-white/5 p-4">
                        <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-4 flex items-center gap-2">
                            <Layers size={14} /> Complexity Levels
                        </h4>
                        <div className="space-y-2">
                            {COMPLEXITIES.map(comp => (
                                <button
                                    key={comp.id}
                                    onClick={() => setActiveComp(comp)}
                                    className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between group ${activeComp.id === comp.id ? 'bg-white/10 border-white/20 shadow-lg' : 'bg-transparent border-transparent grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${comp.color.replace('text-', 'bg-')}`} />
                                        <div className="text-left">
                                            <div className={`font-bold ${comp.color}`}>{comp.name}</div>
                                            <div className="text-[8px] text-gray-500">{comp.label}</div>
                                        </div>
                                    </div>
                                    <Info size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Input size (N)</span>
                            <span className="text-white font-bold">{n}</span>
                        </div>
                        <input
                            type="range" min="1" max="50" value={n}
                            onChange={(e) => setN(parseInt(e.target.value))}
                            className="w-full accent-blue-500 bg-gray-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] text-gray-600 mt-2">
                            <span>Small Data</span>
                            <span>Big Data</span>
                        </div>
                    </div>
                </div>

                {/* Visualization & Logic */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-black/60 rounded-2xl border border-white/5 p-6 flex items-center justify-center min-h-[300px] relative">
                        {renderGraph()}

                        {/* Info Overlay */}
                        <div className="absolute top-4 right-4 text-right bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                            <div className="text-[8px] text-gray-500 uppercase">Est. Operations</div>
                            <div className="text-2xl font-black text-white">
                                {Math.round(activeComp.formula(n)).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-3 flex items-center gap-2">
                                <Code size={14} className="text-purple-400" /> Code Pattern
                            </h4>
                            <pre className="text-[10px] text-gray-400 leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                                {activeComp.code}
                            </pre>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                                <Info size={100} />
                            </div>
                            <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-3 flex items-center gap-2">
                                <Info size={14} className="text-blue-400" /> Behavior
                            </h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
                                {activeComp.desc}
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="text-[8px] text-gray-600 uppercase">Growth Impact</div>
                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${activeComp.color.replace('text-', 'bg-')}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (activeComp.formula(n) / 2500) * 100)}%` }}
                                        transition={{ type: 'spring', damping: 15 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <div className="w-2 h-2 rounded bg-green-500/20 border border-green-500/50" />
                        Scalable (Good)
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <div className="w-2 h-2 rounded bg-red-500/20 border border-red-500/50" />
                        Risk (Bad)
                    </div>
                </div>
                <button
                    onClick={() => { setN(10); setActiveComp(COMPLEXITIES[2]); }}
                    className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                >
                    <RefreshCw size={16} />
                </button>
            </div>
        </div>
    );
};
