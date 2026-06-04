import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, MousePointer2, ArrowRight, Zap, List } from 'lucide-react';

const DATA = ['A', 'B', 'C', 'D', 'E'];

export const ArrayLLLab = () => {
    const [mode, setMode] = useState<'array' | 'linkedlist'>('array');
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [searching, setSearching] = useState(false);
    const [searchIdx, setSearchIdx] = useState(3);
    const [step, setStep] = useState<number | null>(null);

    const reset = () => {
        setActiveIdx(null);
        setSearching(false);
        setStep(null);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleAccess = async () => {
        reset();
        setSearching(true);

        if (mode === 'array') {
            // Random Access O(1)
            setStep(0);
            await sleep(400);
            setActiveIdx(searchIdx);
            setStep(null);
        } else {
            // Traversal Access O(N)
            for (let i = 0; i <= searchIdx; i++) {
                setStep(i);
                setActiveIdx(i);
                await sleep(500);
            }
            setStep(null);
        }
        setSearching(false);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Database className="text-cyan-400" />
                        Memory Layout: Array vs Linked List
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Visualize how data is stored and accessed in memory.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => { reset(); setMode('array'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'array' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Array
                    </button>
                    <button
                        onClick={() => { reset(); setMode('linkedlist'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'linkedlist' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Linked List
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
                {/* Visualizer Area */}
                <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 md:p-12 flex items-center justify-center relative min-h-[300px]">
                    <div className="flex items-center gap-4">
                        <AnimatePresence mode="popLayout">
                            {DATA.map((val, idx) => {
                                const isActive = activeIdx === idx;
                                const isCurrentStep = step === idx;

                                return (
                                    <div key={idx} className="flex items-center">
                                        <motion.div
                                            layout
                                            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border flex flex-col items-center justify-center relative transition-colors duration-300 ${isActive ? 'bg-cyan-500 border-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' :
                                                isCurrentStep ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                        >
                                            <span className="text-[10px] absolute top-2 opacity-30 font-black">
                                                {mode === 'array' ? `0x0${idx * 4}` : 'Node'}
                                            </span>
                                            <span className="text-xl font-bold">{val}</span>
                                            {mode === 'array' && (
                                                <span className="text-[8px] absolute bottom-2 opacity-50 uppercase tracking-tighter">
                                                    index: {idx}
                                                </span>
                                            )}

                                            {isCurrentStep && (
                                                <motion.div
                                                    layoutId="search-pointer"
                                                    className="absolute -top-10 text-yellow-400"
                                                    initial={{ y: -5 }} animate={{ y: 0 }}
                                                >
                                                    <Search size={20} />
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        {mode === 'linkedlist' && idx < DATA.length - 1 && (
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                className="w-8 h-px bg-white/20 relative"
                                            >
                                                <ArrowRight size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" />
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Array Random Access Visual */}
                    {mode === 'array' && searching && step === 0 && (
                        <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20 pointer-events-none">
                            <motion.div
                                className="absolute left-0 h-full bg-cyan-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${(searchIdx / DATA.length) * 100}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Controls & Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-7 space-y-4">
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-2">
                                    <MousePointer2 size={12} /> Target Index to Access
                                </span>
                                <span className="text-cyan-400 font-black text-xl">{searchIdx}</span>
                            </div>
                            <input
                                type="range" min="0" max={DATA.length - 1} value={searchIdx}
                                onChange={(e) => setSearchIdx(parseInt(e.target.value))}
                                className="w-full accent-cyan-500 bg-gray-800 rounded-lg appearance-none h-1.5"
                            />
                            <button
                                onClick={handleAccess}
                                disabled={searching}
                                className="w-full mt-6 py-4 bg-cyan-600 text-white font-black rounded-xl shadow-xl shadow-cyan-900/20 hover:bg-cyan-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Zap size={16} fill="currentColor" />
                                Run Access Performance Test
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-5 space-y-4">
                        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 h-full">
                            <h4 className="text-[10px] text-gray-500 uppercase font-black mb-4 flex items-center gap-2">
                                <List size={14} /> Complexity Profile
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Access Strategy</span>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded ${mode === 'array' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {mode === 'array' ? 'RANDOM ACCESS' : 'SEQUENTIAL SEARCH'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Time Complexity</span>
                                    <span className="text-white font-black">{mode === 'array' ? 'O(1)' : `O(${searchIdx + 1})`}</span>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                        {mode === 'array' ? '陣列在內存中是連續的，CPU 可以通過基址 + 偏移量直接定位。速度極快！' : '鏈表節點分散在內存各處，必須像「尋寶」一樣沿著指標一個個找下去。'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <div className="w-3 h-3 rounded bg-cyan-500" /> Current Value
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/50" /> Accessing...
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Memory Slot
                </div>
            </div>
        </div>
    );
};
