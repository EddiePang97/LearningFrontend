import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Zap, Calculator, ArrowRight, RefreshCw, Layers } from 'lucide-react';

export const DPLab = () => {
    const [n, setN] = useState(6);
    const [mode, setMode] = useState<'recursive' | 'dp'>('dp');
    const [calculating, setCalculating] = useState(false);
    const [steps, setSteps] = useState(0);
    const [dpArray, setDpArray] = useState<number[]>([]);
    const [currentIdx, setCurrentIdx] = useState<number | null>(null);

    const reset = () => {
        setSteps(0);
        setDpArray([]);
        setCurrentIdx(null);
        setCalculating(false);
    };

    const runRecursive = async () => {
        reset();
        setCalculating(true);
        let count = 0;

        const fib = async (num: number): Promise<number> => {
            count++;
            setSteps(count);
            setCurrentIdx(num);
            await new Promise(r => setTimeout(r, 200));

            if (num <= 2) return num;
            return (await fib(num - 1)) + (await fib(num - 2));
        };

        await fib(n);
        setCalculating(false);
    };

    const runDP = async () => {
        reset();
        setCalculating(true);
        const dp = new Array(n + 1).fill(0);
        let count = 0;

        dp[1] = 1;
        dp[2] = 2;
        setDpArray([0, 1, 2]);
        await new Promise(r => setTimeout(r, 600));

        for (let i = 3; i <= n; i++) {
            setCurrentIdx(i);
            count++;
            setSteps(count);
            dp[i] = dp[i - 1] + dp[i - 2];
            setDpArray([...dp.slice(0, i + 1)]);
            await new Promise(r => setTimeout(r, 800));
        }

        setCalculating(false);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Network className="text-blue-400" />
                        Dynamic Programming: Climbing Stairs
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Compare redundant Recursive calls vs Efficient DP Table.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => { reset(); setMode('recursive'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'recursive' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Recursive
                    </button>
                    <button
                        onClick={() => { reset(); setMode('dp'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'dp' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        DP Table $O(N)$
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
                <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 md:p-12 flex flex-col items-center justify-center relative min-h-[300px]">
                    {/* Visual DP Array / Recursion Simulation */}
                    <div className="flex gap-3 h-24 items-end">
                        {Array.from({ length: n }).map((_, i) => {
                            const idx = i + 1;
                            const val = dpArray[idx];
                            const isActive = currentIdx === idx;

                            return (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                    <div className="text-[10px] text-gray-600 font-bold">f({idx})</div>
                                    <motion.div
                                        animate={{
                                            height: val ? 20 + val * 4 : 20,
                                            scale: isActive ? 1.1 : 1
                                        }}
                                        className={`w-10 rounded-t-lg border transition-colors ${isActive ? 'bg-blue-500 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                                            val ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/5'
                                            } flex items-center justify-center font-black overflow-hidden`}
                                    >
                                        {val || '?'}
                                    </motion.div>
                                    <div className="text-[8px] text-gray-700">i={idx}</div>
                                </div>
                            );
                        })}
                    </div>

                    {mode === 'recursive' && calculating && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-red-500/20 text-[120px] font-black italic select-none">REDUNDANT</div>
                        </div>
                    )}

                    <div className="mt-12 flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 group">
                        <div className="text-[10px] text-gray-500 uppercase font-black">Formula</div>
                        <div className="text-white font-mono flex items-center gap-3">
                            <span className="text-blue-400">dp[i]</span>
                            <ArrowRight size={14} className="text-gray-700" />
                            <span className="text-gray-400">dp[i-1] + dp[i-2]</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 flex flex-col gap-4">
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
                                    <Layers size={12} className="text-blue-400" /> Stairs Count (N)
                                </span>
                                <input
                                    type="range" min="3" max="10" value={n}
                                    onChange={e => { reset(); setN(parseInt(e.target.value)); }}
                                    className="accent-blue-500 h-1.5 w-32 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={mode === 'recursive' ? runRecursive : runDP}
                                disabled={calculating}
                                className={`w-full py-4 ${mode === 'recursive' ? 'bg-red-600' : 'bg-blue-600'} text-white font-black rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                            >
                                <Zap size={16} fill="currentColor" />
                                {calculating ? 'Processing...' : 'Run Performance Demo'}
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-4">
                        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 h-full flex flex-col justify-center">
                            <div className="text-center space-y-2">
                                <div className="text-[10px] text-gray-500 uppercase font-black">Total Computations</div>
                                <div className={`text-4xl font-black ${mode === 'recursive' ? 'text-red-500' : 'text-blue-500'}`}>{steps}</div>
                                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                                    {mode === 'recursive' ? 'Exponential growth' : 'Linear growth'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-white/5">
                <h4 className="text-[10px] text-gray-500 uppercase font-black mb-2 flex items-center gap-2">
                    <Calculator size={14} className="text-blue-400" /> What is DP?
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                    動態規劃實質上是「記筆記」。遞迴遍歷會重複計算相同的子問題，而 DP 通過一個數組紀錄結果，保證每個狀態只計算一次。
                </p>
            </div>

            <button onClick={reset} className="absolute right-6 top-6 text-gray-700 hover:text-white transition-colors">
                <RefreshCw size={14} />
            </button>
        </div>
    );
};
