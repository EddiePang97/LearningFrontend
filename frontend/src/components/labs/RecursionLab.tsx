import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Play, RotateCcw, ChevronRight, Calculator, HelpCircle } from 'lucide-react';

interface StackFrame {
    id: string;
    n: number;
    status: 'pending' | 'active' | 'complete';
    depth: number;
    result?: number;
}

export const RecursionLab = () => {
    const [n, setN] = useState(5);
    const [running, setRunning] = useState(false);
    const [stack, setStack] = useState<StackFrame[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [finalResult, setFinalResult] = useState<number | null>(null);
    const frameIdRef = useRef(0);

    const reset = () => {
        setRunning(false);
        setStack([]);
        setLogs([]);
        setFinalResult(null);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fib = async (val: number, depth: number): Promise<number> => {
        const frameId = `frame-${frameIdRef.current++}`;
        const newFrame: StackFrame = { id: frameId, n: val, status: 'active', depth };

        setStack(prev => [...prev, newFrame]);
        setLogs(prev => [`[Depth ${depth}] fib(${val}) called`, ...prev].slice(0, 5));
        await sleep(600);

        if (val <= 1) {
            setStack(prev => prev.map(f => f.id === frameId ? { ...f, status: 'complete', result: val } : f));
            setLogs(prev => [`[Depth ${depth}] fib(${val}) returns ${val}`, ...prev].slice(0, 5));
            await sleep(400);
            return val;
        }

        // Parent is now pending while children run
        setStack(prev => prev.map(f => f.id === frameId ? { ...f, status: 'pending' } : f));

        const r1 = await fib(val - 1, depth + 1);
        const r2 = await fib(val - 2, depth + 1);

        const result = r1 + r2;
        setStack(prev => prev.map(f => f.id === frameId ? { ...f, status: 'complete', result: result } : f));

        // Remove frame as it returns
        await sleep(600);
        setStack(prev => prev.filter(f => f.id !== frameId));
        setLogs(prev => [`[Depth ${depth}] fib(${val}) totals ${result}`, ...prev].slice(0, 5));

        return result;
    };

    const start = async () => {
        reset();
        setRunning(true);
        const result = await fib(n, 0);
        setFinalResult(result);
        setRunning(false);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Layers className="text-purple-400" />
                    Recursion Stack Visualizer
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                    Visualizing the Fibonacci sequence $F(n) = F(n-1) + F(n-2)$.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* 1. Control & Params */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Calculation</span>
                            <span className="text-purple-400 font-bold">fib({n})</span>
                        </div>
                        <input
                            type="range" min="2" max="7" value={n}
                            onChange={(e) => setN(parseInt(e.target.value))}
                            disabled={running}
                            className="w-full accent-purple-500 bg-gray-800 rounded-lg appearance-none h-1.5"
                        />
                        <div className="text-[8px] text-gray-600 mt-2 flex justify-between uppercase">
                            <span>Fast</span>
                            <span>Explosive Growth</span>
                        </div>

                        {!running ? (
                            <button
                                onClick={start}
                                className="w-full mt-6 py-4 bg-purple-600 text-white font-black rounded-xl shadow-xl shadow-purple-900/20 hover:bg-purple-500 transition-all flex items-center justify-center gap-2"
                            >
                                <Play size={18} fill="currentColor" />
                                Run Recursion
                            </button>
                        ) : (
                            <button
                                onClick={reset}
                                className="w-full mt-6 py-4 bg-red-900/20 text-red-400 border border-red-500/30 font-black rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={18} />
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex-1 min-h-[150px]">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black mb-3">Call Stack Trace</h4>
                        <div className="space-y-2">
                            {logs.map((log, i) => (
                                <div key={i} className={`text-[10px] ${i === 0 ? 'text-purple-300' : 'text-gray-600'} flex items-center gap-2`}>
                                    <ChevronRight size={10} className={i === 0 ? 'animate-pulse' : ''} />
                                    {log}
                                </div>
                            ))}
                            {logs.length === 0 && <div className="text-[10px] text-gray-700 italic">Ready to compute...</div>}
                        </div>
                    </div>
                </div>

                {/* 2. Stack Visualization */}
                <div className="lg:col-span-8 bg-black/40 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-end relative min-h-[400px]">
                    <AnimatePresence>
                        {finalResult !== null && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                            >
                                <div className="text-[10px] text-purple-400 uppercase font-black mb-2">Final Result</div>
                                <div className="text-6xl font-black text-white shadow-purple-500/50 drop-shadow-2xl">
                                    {finalResult}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col-reverse items-center gap-2 w-full max-w-[200px]">
                        <AnimatePresence mode="popLayout">
                            {stack.map((frame) => (
                                <motion.div
                                    key={frame.id}
                                    layout
                                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -50, opacity: 0, scale: 0.8 }}
                                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${frame.status === 'active' ? 'bg-purple-600 border-white shadow-xl z-20' :
                                        frame.status === 'pending' ? 'bg-purple-900/40 border-purple-500/30 text-purple-300' :
                                            'bg-green-500/20 border-green-500/50 text-green-400'}`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase font-black opacity-50">Stack Frame</span>
                                        <span className="font-bold">fib({frame.n})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {frame.status === 'pending' && <Calculator size={14} className="animate-spin" />}
                                        {frame.status === 'complete' && <span className="text-xs font-black">{'->'} {frame.result}</span>}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {stack.length === 0 && !finalResult && (
                            <div className="text-gray-700 uppercase font-black text-xs opacity-20 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-800 flex items-center justify-center">
                                    <HelpCircle size={32} />
                                </div>
                                Stack is empty
                            </div>
                        )}
                    </div>

                    {/* Ground Line */}
                    <div className="w-full h-px bg-white/10 mt-8" />
                </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <div className="w-2.5 h-2.5 rounded bg-purple-600" /> Active Frame
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <div className="w-2.5 h-2.5 rounded bg-purple-900/40 border border-purple-500/30" /> Pending (Waiting for children)
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <div className="w-2.5 h-2.5 rounded bg-green-500/20 border border-green-500/50" /> Base Case Result
                </div>
            </div>
        </div>
    );
};
