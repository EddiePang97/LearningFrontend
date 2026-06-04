import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Target, RotateCcw } from 'lucide-react';

const ARRAY_SIZE = 16;
const DATA = Array.from({ length: ARRAY_SIZE }, (_, i) => i * 2 + 1);

export const SearchLab = () => {
    const [strategy, setStrategy] = useState<'linear' | 'binary'>('linear');
    const [target, setTarget] = useState(13);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [searching, setSearching] = useState(false);
    const [range, setRange] = useState<{ low: number; high: number } | null>(null);
    const [found, setFound] = useState<boolean | null>(null);
    const [steps, setSteps] = useState(0);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const reset = () => {
        setActiveIdx(null);
        setSearching(false);
        setRange(null);
        setFound(null);
        setSteps(0);
    };

    const runLinear = async () => {
        reset();
        setSearching(true);
        for (let i = 0; i < DATA.length; i++) {
            setActiveIdx(i);
            setSteps(prev => prev + 1);
            await sleep(400);
            if (DATA[i] === target) {
                setFound(true);
                break;
            }
            if (i === DATA.length - 1) setFound(false);
        }
        setSearching(false);
    };

    const runBinary = async () => {
        reset();
        setSearching(true);
        let low = 0;
        let high = DATA.length - 1;
        setRange({ low, high });

        while (low <= high) {
            setSteps(prev => prev + 1);
            const mid = Math.floor((low + high) / 2);
            setActiveIdx(mid);
            await sleep(800);

            if (DATA[mid] === target) {
                setFound(true);
                break;
            } else if (DATA[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
            setRange({ low, high });
            await sleep(400);
        }
        if (found !== true) setFound(false);
        setSearching(false);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Search className="text-emerald-400" />
                        Search Algorithms
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Compare Linear Search $O(N)$ vs Bi-section $O(\log N)$ visually.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => { reset(); setStrategy('linear'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${strategy === 'linear' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Linear
                    </button>
                    <button
                        onClick={() => { reset(); setStrategy('binary'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${strategy === 'binary' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Binary
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
                <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-8 flex flex-wrap items-center justify-center gap-2 relative min-h-[300px]">
                    {DATA.map((val, idx) => {
                        const isActive = activeIdx === idx;
                        const isInRange = range && idx >= range.low && idx <= range.high;
                        const isTarget = val === target;
                        const isFound = found === true && isActive;

                        return (
                            <motion.div
                                key={idx}
                                layout
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border flex items-center justify-center font-bold text-xs transition-all duration-300 relative ${isFound ? 'bg-emerald-500 border-white text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 z-10' :
                                    isActive ? 'bg-blue-500 border-white text-white z-10' :
                                        isInRange ? 'bg-white/10 border-white/20 text-white' :
                                            searching ? 'bg-white/5 border-transparent text-gray-700 opacity-20' : 'bg-white/5 border-white/10 text-gray-500'
                                    }`}
                            >
                                {val}
                                {isTarget && !searching && found === null && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                )}
                            </motion.div>
                        );
                    })}

                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {found !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`absolute top-4 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${found ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
                            >
                                {found ? `Goal Found in ${steps} steps!` : 'Unreachable Target'}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 flex flex-col gap-4">
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
                                    <Target size={12} className="text-emerald-400" /> Target Value
                                </span>
                                <select
                                    value={target}
                                    onChange={(e) => { reset(); setTarget(parseInt(e.target.value)); }}
                                    className="bg-black/50 border border-white/10 rounded-lg px-4 py-1.5 outline-none text-white focus:border-emerald-500/50 transition-all font-bold"
                                >
                                    {DATA.map(v => <option key={v} value={v}>{v}</option>)}
                                    <option value={100}>100 (Not Found)</option>
                                </select>
                            </div>

                            <button
                                onClick={strategy === 'linear' ? runLinear : runBinary}
                                disabled={searching}
                                className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Zap size={16} fill="currentColor" />
                                Start Search Simulation
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-4">
                        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 h-full flex flex-col justify-center">
                            <div className="text-center space-y-2">
                                <div className="text-[10px] text-gray-500 uppercase font-black">Search Steps</div>
                                <div className="text-4xl font-black text-white">{steps}</div>
                                <div className="text-[8px] text-emerald-500 font-bold uppercase tracking-tighter">
                                    Complexity: {strategy === 'linear' ? 'O(N)' : 'O(log N)'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-3 h-3 rounded bg-blue-500" /> Current Mid/Pointer
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-3 h-3 rounded bg-white/10 border border-white/20" /> Search Range
                </div>
                <button onClick={reset} className="ml-auto text-gray-600 hover:text-white transition-colors">
                    <RotateCcw size={14} />
                </button>
            </div>
        </div>
    );
};
