import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, MousePointer2 } from 'lucide-react';

export const FiberLab = () => {
    const [mode, setMode] = useState<'stack' | 'fiber'>('stack');
    const [items, setItems] = useState<number[]>([]);
    const [isRendering, setIsRendering] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [frameRate, setFrameRate] = useState(60);
    const frameTimeRef = useRef(performance.now());
    const [progress, setProgress] = useState(0);

    // Track FPS to show "Jank"
    useEffect(() => {
        let frameId: number;
        const loop = () => {
            const now = performance.now();
            const delta = now - frameTimeRef.current;
            frameTimeRef.current = now;
            setFrameRate(Math.min(60, Math.round(1000 / delta)));
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Heavy computation simulation
    const heavyTask = (duration: number) => {
        const start = performance.now();
        while (performance.now() - start < duration) {
            // Block main thread
            Math.random();
        }
    };

    const startRendering = () => {
        setItems([]);
        setProgress(0);
        setIsRendering(true);

        const totalItems = 2000;

        if (mode === 'stack') {
            // Stack Mode: Synchronous Blocking
            // We force a delay to let the UI update the "Computing..." state first
            setTimeout(() => {
                const newItems = [];
                for (let i = 0; i < totalItems; i++) {
                    heavyTask(0.5); // 0.5ms per item = 1s total block
                    newItems.push(i);
                }
                setItems(newItems);
                setProgress(100);
                setIsRendering(false);
            }, 100);
        } else {
            // Fiber Mode: Time Slicing
            let currentItem = 0;
            const processChunk = () => {
                const chunkStart = performance.now();
                const newChunk: number[] = [];

                // Process for max 5ms (Simulating 5ms time slice)
                while (currentItem < totalItems && performance.now() - chunkStart < 5) {
                    heavyTask(0.5);
                    newChunk.push(currentItem);
                    currentItem++;
                }

                setItems(prev => [...prev, ...newChunk]);
                setProgress((currentItem / totalItems) * 100);

                if (currentItem < totalItems) {
                    // Yield to main thread
                    if (window.requestIdleCallback) {
                        window.requestIdleCallback(processChunk);
                    } else {
                        setTimeout(processChunk, 0);
                    }
                } else {
                    setIsRendering(false);
                }
            };
            processChunk();
        }
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-gray-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex gap-4">
                    <button
                        disabled={isRendering}
                        onClick={() => setMode('stack')}
                        className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${mode === 'stack' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'border-white/5 hover:bg-white/5 text-gray-400'}`}
                    >
                        <Activity size={16} /> Stack (Blocking)
                    </button>
                    <button
                        disabled={isRendering}
                        onClick={() => setMode('fiber')}
                        className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${mode === 'fiber' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-white/5 hover:bg-white/5 text-gray-400'}`}
                    >
                        <Zap size={16} /> Fiber (Concurrent)
                    </button>
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <div className={`flex items-center gap-1 ${frameRate < 30 ? 'text-red-500 font-bold' : 'text-green-500'}`}>
                        <Clock size={14} /> FPS: {frameRate}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1">
                {/* Visualizer */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex-1 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">

                        {/* Background Grid Animation - This freezes in Stack mode */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <motion.div
                                className="w-20 h-20 bg-blue-500 rounded-full blur-xl absolute top-1/2 left-1/2"
                                animate={{
                                    x: [0, 100, -100, 0],
                                    y: [0, -100, 100, 0],
                                    scale: [1, 1.5, 0.8, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Rendering Grid */}
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(10px,1fr))] gap-1 w-full max-h-[300px] overflow-hidden content-start">
                            {items.map((i) => (
                                <div key={i} className={`w-2.5 h-2.5 rounded-sm ${mode === 'stack' ? 'bg-red-500/50' : 'bg-green-500/50'}`} />
                            ))}
                        </div>

                        {isRendering && progress < 100 && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
                                <div className="text-xl font-bold text-white mb-2">
                                    {mode === 'stack' ? 'Rendering (Blocking UI)...' : `Rendering (${Math.round(progress)}%)`}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={startRendering}
                        disabled={isRendering}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${isRendering ? 'opacity-50 cursor-not-allowed bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]'}`}
                    >
                        {isRendering ? 'Processing...' : 'Start Heavy Render Task (2000 items)'}
                    </button>
                </div>

                {/* Input Test Area */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="bg-gray-800/30 rounded-2xl p-6 border border-white/5 h-full flex flex-col">
                        <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
                            <MousePointer2 size={16} /> Responsiveness Test
                        </h3>
                        <p className="text-xs text-gray-500 mb-6">
                            Try typing in the box below while the rendering task is running.
                        </p>

                        <label className="text-xs text-gray-400 mb-2 block">Interactive Input</label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Try typing here..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />

                        <div className="mt-auto pt-6 border-t border-white/5 text-xs text-gray-500 leading-relaxed">
                            {mode === 'stack' ? (
                                <p>In <span className="text-red-400">Stack Mode</span>, the rendering task monopolizes the call stack. The browser frame rate drops to 0, and this input box will <strong className="text-white">freeze completely</strong> until rendering finishes.</p>
                            ) : (
                                <p>In <span className="text-green-400">Fiber Mode</span>, React splits the work into small chunks. It yields control back to the browser periodically, keeping animations smooth and the input <strong className="text-white">responsive</strong>.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
