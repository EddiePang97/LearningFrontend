import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Play, RefreshCw, FileText, Layers } from 'lucide-react';

export const StreamLab = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [processedChunks, setProcessedChunks] = useState<number[]>([]);
    const [buffer, setBuffer] = useState<number[]>([]);
    const [readSpeed, setReadSpeed] = useState(500); // ms per chunk
    const [writeSpeed, setWriteSpeed] = useState(1200); // ms per chunk
    const [isPaused, setIsPaused] = useState(false);
    const totalChunks = 30;
    const HIGH_WATER_MARK = 8;
    const LOW_WATER_MARK = 2;

    const runStream = () => {
        setIsStreaming(true);
        setIsPaused(false);
        let current = processedChunks.length;

        // Readable Stream Production Logic
        const readInterval = setInterval(() => {
            setBuffer(prev => {
                // Backpressure Check: If buffer >= HWM, pause reading
                if (prev.length >= HIGH_WATER_MARK) {
                    setIsPaused(true);
                    return prev;
                }

                if (current >= totalChunks) return prev;

                const newBuffer = [...prev, current++];
                return newBuffer;
            });
        }, readSpeed);

        // Writable Stream Consumption Logic
        const writeInterval = setInterval(() => {
            setBuffer(prev => {
                if (prev.length === 0) return prev;

                const chunkToProcess = prev[0];
                const remaining = prev.slice(1);

                // Drain Check: If buffer falls below LWM, resume reading
                if (remaining.length <= LOW_WATER_MARK) {
                    setIsPaused(false);
                }

                setProcessedChunks(p => [...p, chunkToProcess]);
                return remaining;
            });
        }, writeSpeed);

        // Cleanup when done
        const checkDone = setInterval(() => {
            setProcessedChunks(p => {
                if (p.length >= totalChunks) {
                    clearInterval(readInterval);
                    clearInterval(writeInterval);
                    clearInterval(checkDone);
                    setIsStreaming(false);
                    setIsPaused(false);
                }
                return p;
            });
        }, 100);
    };

    const reset = () => {
        setIsStreaming(false);
        setProcessedChunks([]);
        setBuffer([]);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Layers className="text-blue-400" />
                    Stream & Buffer Simulator
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                    Visualizing how data is read as chunks and processed through a buffer instead of loading all at once.
                </p>
            </div>

            <div className="flex flex-col gap-8 md:gap-12 flex-1 justify-center max-w-4xl mx-auto w-full">

                {/* 1. Source (File/Network) */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-2xl bg-blue-900/20 border border-blue-500/50 flex items-center justify-center shadow-lg">
                            <FileText size={32} className="text-blue-400" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-300">Readable Stream</span>
                        <div className="text-[8px] text-gray-600">4GB Video File</div>
                    </div>

                    <div className="flex-1 h-2 bg-gray-900 rounded-full relative overflow-hidden flex items-center">
                        <div className="absolute inset-0 bg-blue-500/10" />
                        <AnimatePresence>
                            {isStreaming && (
                                <motion.div
                                    key="stream-flow"
                                    className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${(processedChunks.length / totalChunks) * 100}%` }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Flying Chunks */}
                        {isStreaming && Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-400 rounded-sm"
                                animate={{ x: [0, 400], opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-28 h-28 rounded-2xl border flex flex-wrap p-2 gap-1 content-start transition-all duration-300 relative ${buffer.length >= HIGH_WATER_MARK
                                ? 'bg-red-900/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] scale-105'
                                : buffer.length > 5 ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-gray-800 border-white/10'
                            }`}>
                            {buffer.map(i => (
                                <motion.div
                                    key={i}
                                    layoutId={`chunk-${i}`}
                                    className="w-4 h-4 bg-yellow-500 rounded-sm shadow-sm"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                />
                            ))}
                            {buffer.length === 0 && <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-600 italic">Empty</div>}

                            {/* Warning Label */}
                            <AnimatePresence>
                                {buffer.length >= HIGH_WATER_MARK && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute -top-6 left-0 right-0 text-center text-[8px] font-bold text-red-400 uppercase tracking-tighter"
                                    >
                                        High Water Mark!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <span className="text-[10px] font-bold text-yellow-300">Internal Buffer</span>
                        <div className="text-[10px] text-gray-500">{buffer.length} / {HIGH_WATER_MARK} Chunks</div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-2xl bg-green-900/20 border border-green-500/50 flex items-center justify-center shadow-lg relative overflow-hidden">
                            <Database size={32} className="text-green-400" />
                            {/* Filling Effect */}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 bg-green-500/20"
                                animate={{ height: `${(processedChunks.length / totalChunks) * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-green-300">Writable Stream</span>
                        <div className="text-[8px] text-gray-600">Video Player / Disk</div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <h4 className="text-blue-300 text-[10px] font-bold mb-2 lowercase">chunk.reading...</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            Data is split into small pieces (Chunks) so we don't need to load the whole 4GB file into RAM.
                        </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <h4 className="text-yellow-300 text-[10px] font-bold mb-2 lowercase">buffer.waiting...</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            Temporary storage for chunks that are waiting to be processed by the objective.
                        </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <h4 className="text-green-300 text-[10px] font-bold mb-2 lowercase">stream.piping...</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            <code className="text-purple-300">readable.pipe(writable)</code> moves data efficiently through memory.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-blue-400 font-bold uppercase">Reading Speed (Source)</span>
                            <span className="text-gray-400">{readSpeed}ms / chunk</span>
                        </div>
                        <input
                            type="range" min="100" max="2000" step="100"
                            value={readSpeed} onChange={(e) => setReadSpeed(Number(e.target.value))}
                            className="w-full accent-blue-500 bg-gray-800 rounded-lg appearance-none h-1.5"
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-green-400 font-bold uppercase">Writing Speed (Sink)</span>
                            <span className="text-gray-400">{writeSpeed}ms / chunk</span>
                        </div>
                        <input
                            type="range" min="100" max="2000" step="100"
                            value={writeSpeed} onChange={(e) => setWriteSpeed(Number(e.target.value))}
                            className="w-full accent-green-500 bg-gray-800 rounded-lg appearance-none h-1.5"
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={runStream}
                        disabled={isStreaming || processedChunks.length === totalChunks}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                    >
                        {isStreaming ? (
                            <div className="flex items-center gap-2">
                                <RefreshCw className="animate-spin" size={18} />
                                {isPaused ? <span className="text-red-300">BACKPRESSURE PAUSE</span> : 'PIPING...'}
                            </div>
                        ) : (
                            <>
                                <Play size={18} />
                                Start Pipe
                            </>
                        )}
                    </button>
                    <button
                        onClick={reset}
                        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 font-bold rounded-xl flex items-center gap-2 transition-all"
                    >
                        <RefreshCw size={18} />
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};
