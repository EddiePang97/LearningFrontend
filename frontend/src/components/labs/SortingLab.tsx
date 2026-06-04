import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, BarChart3, Settings2 } from 'lucide-react';

const INITIAL_ARRAY = [45, 20, 35, 10, 50, 25, 15, 40];

export const SortingLab = () => {
    const [array, setArray] = useState([...INITIAL_ARRAY]);
    const [sorting, setSorting] = useState(false);
    const [algo, setAlgo] = useState<'bubble' | 'quick'>('bubble');
    const [activeIdx, setActiveIdx] = useState<{ i: number; j: number } | null>(null);
    const [pivotIdx, setPivotIdx] = useState<number | null>(null);
    const [complete, setComplete] = useState<number[]>([]);
    const [speed, setSpeed] = useState(300);
    const stopRef = useRef(false);

    const reset = () => {
        stopRef.current = true;
        setSorting(false);
        setArray([...INITIAL_ARRAY]);
        setActiveIdx(null);
        setPivotIdx(null);
        setComplete([]);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const bubbleSort = async () => {
        setSorting(true);
        stopRef.current = false;
        const arr = [...array];
        const n = arr.length;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (stopRef.current) return;
                setActiveIdx({ i: j, j: j + 1 });
                await sleep(speed);

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    setArray([...arr]);
                    await sleep(speed);
                }
            }
            setComplete(prev => [...prev, n - i - 1]);
        }
        setSorting(false);
        setActiveIdx(null);
    };

    // Very simplified async quicksort for visualization
    const quickSort = async () => {
        setSorting(true);
        stopRef.current = false;
        const arr = [...array];

        const partition = async (low: number, high: number) => {
            const pivot = arr[high];
            setPivotIdx(high);
            let i = low - 1;

            for (let j = low; j < high; j++) {
                if (stopRef.current) return -1;
                setActiveIdx({ i: j, j: high });
                await sleep(speed);

                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    setArray([...arr]);
                    await sleep(speed);
                }
            }
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            setArray([...arr]);
            setComplete(prev => [...prev, i + 1]);
            await sleep(speed);
            return i + 1;
        };

        const qSort = async (low: number, high: number) => {
            if (low < high) {
                const pi = await partition(low, high);
                if (pi === -1) return;
                await qSort(low, pi - 1);
                await qSort(pi + 1, high);
            } else if (low === high) {
                setComplete(prev => [...prev, low]);
            }
        };

        await qSort(0, arr.length - 1);
        setSorting(false);
        setActiveIdx(null);
        setPivotIdx(null);
    };

    const startSort = () => {
        if (algo === 'bubble') bubbleSort();
        else quickSort();
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="text-orange-400" />
                        Sorting Visualizer
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Compare algorithms by watching them manipulate memory in real-time.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => { reset(); setAlgo('bubble'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${algo === 'bubble' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Bubble Sort
                    </button>
                    <button
                        onClick={() => { reset(); setAlgo('quick'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${algo === 'quick' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Quick Sort
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
                {/* Array Visualization */}
                <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-8 flex items-end justify-center gap-2 md:gap-4 relative">
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <div className="w-2 h-2 rounded bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> Comparing
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <div className="w-2 h-2 rounded bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" /> Pivot
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <div className="w-2 h-2 rounded bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> Sorted
                        </div>
                    </div>

                    {array.map((val, idx) => {
                        const isComparing = activeIdx?.i === idx || activeIdx?.j === idx;
                        const isPivot = pivotIdx === idx;
                        const isSorted = complete.includes(idx);

                        return (
                            <motion.div
                                key={idx}
                                layout
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                className={`w-10 sm:w-14 rounded-t-xl relative group flex flex-col items-center justify-end transition-colors duration-300 ${isPivot ? 'bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' :
                                    isComparing ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' :
                                        isSorted ? 'bg-green-500/80 shadow-[0_0_20px_rgba(34,197,94,0.2)]' :
                                            'bg-white/10 hover:bg-white/20'}`}
                                style={{ height: `${(val / 50) * 100}%`, minHeight: '40px' }}
                            >
                                <span className={`text-[10px] font-black mb-2 transition-opacity ${isComparing || isPivot || isSorted ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                                    {val}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 flex items-center gap-4">
                        <button
                            onClick={sorting ? () => stopRef.current = true : startSort}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${sorting ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:bg-orange-400 active:scale-95'}`}
                        >
                            {sorting ? <><Pause size={16} fill="currentColor" /> Stop</> : <><Play size={16} fill="currentColor" /> Start Simulation</>}
                        </button>
                        <button
                            onClick={reset}
                            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>

                    <div className="md:col-span-4 bg-gray-900/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <Settings2 size={16} className="text-gray-500" />
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-[8px] text-gray-500 uppercase font-black">
                                <span>Speed</span>
                                <span>{speed === 10 ? 'Turbo' : speed + 'ms'}</span>
                            </div>
                            <input
                                type="range" min="10" max="1000" step="50"
                                value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                                className="w-full accent-orange-500 bg-gray-800 rounded-lg appearance-none h-1"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                    <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Complexity: {algo === 'bubble' ? 'O(N²)' : 'O(N log N)'}</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        {algo === 'bubble' ? '冒泡排序通過不斷交換鄰近元素將最大值「浮」到末尾，效率較低。' : '快速排序使用分治法 (Divide & Conquer)，通過基準值 (Pivot) 將資料拆分，效率極高。'}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Algorithm Flow</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                        {sorting ? (algo === 'bubble' ? 'Scanning for adjacent swaps...' : 'Partitioning around pivot...') : 'Select an algorithm and click Start.'}
                    </p>
                </div>
            </div>
        </div>
    );
};
