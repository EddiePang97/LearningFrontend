import { useState, useEffect, useRef } from 'react';

import { Cpu, Zap, Activity, Clock, AlertTriangle } from 'lucide-react';

export const WebWorkerLab = () => {
    const [status, setStatus] = useState<'idle' | 'running-main' | 'running-worker' | 'done'>('idle');
    const [result, setResult] = useState<number | null>(null);
    const [executionTime, setExecutionTime] = useState(0);
    const workerRef = useRef<Worker | null>(null);

    // Animation frame for visual responsiveness check
    const [rotation, setRotation] = useState(0);
    useEffect(() => {
        let frameId: number;
        const animate = () => {
            setRotation(r => (r + 5) % 360);
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Cleanup worker
    useEffect(() => {
        return () => {
            if (workerRef.current) workerRef.current.terminate();
        };
    }, []);

    const calculatePrimesMainThread = () => {
        setStatus('running-main');
        setResult(null);
        setExecutionTime(0);

        // Allow UI to update status before blocking
        setTimeout(() => {
            const start = performance.now();

            // INTENTIONALLY BLOCKING LOOP
            const iterations = 50000;
            let count = 0;
            const isPrime = (num: number) => {
                for (let i = 2, s = Math.sqrt(num); i <= s; i++)
                    if (num % i === 0) return false;
                return num > 1;
            }

            // Simulate heavy work (approx 1-3 seconds depending on CPU)
            let current = 2;
            while (count < iterations) {
                if (isPrime(current)) {
                    count++;
                }
                current++;
            }

            // Simulating extra artificial delay to ensure freeze is noticeable on fast machines
            const endBlock = performance.now() + 2000;
            while (performance.now() < endBlock) {
                // busy wait
            }

            const end = performance.now();
            setExecutionTime(end - start);
            setResult(iterations);
            setStatus('done');
        }, 100);
    };

    const calculatePrimesWorker = () => {
        setStatus('running-worker');
        setResult(null);
        setExecutionTime(0);
        const start = performance.now();

        // Inline worker for simplicity in this lab environment
        const workerCode = `
            self.onmessage = function(e) {
                const iterations = e.data;
                let count = 0;
                const isPrime = (num) => {
                    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
                        if(num % i === 0) return false; 
                    return num > 1;
                }
                
                let current = 2;
                while(count < iterations) {
                    if(isPrime(current)) {
                        count++;
                    }
                    current++;
                }
                
                // Artificial delay inside worker
                const endBlock = performance.now() + 2000;
                while (performance.now() < endBlock) {}

                self.postMessage(iterations);
            }
        `;

        const blob = new Blob([workerCode], { type: "application/javascript" });
        const worker = new Worker(URL.createObjectURL(blob));
        workerRef.current = worker;

        worker.onmessage = (e) => {
            const end = performance.now();
            setExecutionTime(end - start);
            setResult(e.data);
            setStatus('done');
            worker.terminate();
            workerRef.current = null;
        };

        worker.postMessage(50000); // Same workload
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">

            {/* Header */}
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Cpu className="text-accent-purple" />
                Main Thread vs. Worker Thread
            </h3>

            <div className="flex flex-col md:flex-row gap-6 flex-1">

                {/* Visualizer Section */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Responsiveness Indicator */}
                    <div className="bg-gray-900/50 rounded-2xl p-8 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Monitor</span>
                        </div>

                        {/* Glowing Ring Container */}
                        <div className="relative flex items-center justify-center w-56 h-56">

                            {/* Outer Glow */}
                            <div
                                className="absolute inset-0 bg-accent-purple/20 blur-3xl rounded-full"
                                style={{ transform: `scale(${status === 'running-main' ? 0.8 : 1.2})`, opacity: status === 'running-main' ? 0.2 : 0.6, transition: 'all 0.5s' }}
                            />

                            {/* Rotating Ring Layer */}
                            <div
                                className="absolute inset-0 rounded-full p-[4px]"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent 0%, #a855f7 50%, #3b82f6 100%)',
                                    transform: `rotate(${rotation}deg)`,
                                    boxShadow: '0 0 30px rgba(168,85,247,0.2)'
                                }}
                            >
                                <div className="absolute inset-0 rounded-full blur-md opacity-50"
                                    style={{ background: 'conic-gradient(from 0deg, transparent 0%, #a855f7 50%, #3b82f6 100%)' }}
                                />
                            </div>

                            {/* Static Inner Content Layer */}
                            <div className="absolute inset-[4px] bg-[#0f0f11] rounded-full z-10 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-1">
                                    <span className={`text-6xl font-black tabular-nums tracking-tighter transition-colors duration-300 ${status === 'running-main' ? 'text-red-500' : 'text-white'
                                        }`}>
                                        {status === 'running-main' ? '0' : '60'}
                                        <span className="text-sm align-top opacity-50 ml-1 font-medium">FPS</span>
                                    </span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Realtime</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Label */}
                        <div className="mt-8 text-center z-10 min-h-[24px]">
                            {status === 'running-main' ? (
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                    <AlertTriangle size={14} /> MAIN THREAD BLOCKED
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                    <Activity size={14} /> SYSTEM RESPONSIVE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
                        {status === 'idle' && <div className="text-gray-500">Ready to compute...</div>}
                        {(status === 'running-main' || status === 'running-worker') && (
                            <div className="text-yellow-400 animate-pulse">Computing 50,000 Primes + Artificial Delay...</div>
                        )}
                        {status === 'done' && (
                            <div className="text-center">
                                <div className="text-gray-400 text-xs mb-1">Task Completed In</div>
                                <div className="text-3xl font-bold text-white mb-2">{Math.round(executionTime)}ms</div>
                                {result && <div className="text-green-400 text-xs">Result: {result} primes found</div>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Section */}
                <div className="w-full md:w-1/3 flex flex-col gap-4 justify-center">

                    <button
                        onClick={calculatePrimesMainThread}
                        disabled={status !== 'idle' && status !== 'done'}
                        className={`
                            p-6 rounded-2xl border transition-all flex flex-col gap-2 relative overflow-hidden group
                            ${status === 'running-main'
                                ? 'bg-red-500/20 border-red-500 text-red-100'
                                : 'bg-gray-800 border-white/5 hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 hover:text-red-300'}
                            ${(status !== 'idle' && status !== 'done') && status !== 'running-main' ? 'opacity-30 blur-sm pointer-events-none' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3 font-bold text-lg">
                            <Zap size={20} /> Main Thread
                        </div>
                        <p className="text-xs opacity-70 leading-relaxed text-left">
                            Runs directly on the UI thread. Will cause the spinner to <strong>freeze completely</strong> until finished.
                        </p>
                    </button>

                    <button
                        onClick={calculatePrimesWorker}
                        disabled={status !== 'idle' && status !== 'done'}
                        className={`
                            p-6 rounded-2xl border transition-all flex flex-col gap-2 relative overflow-hidden group
                            ${status === 'running-worker'
                                ? 'bg-green-500/20 border-green-500 text-green-100'
                                : 'bg-gray-800 border-white/5 hover:border-green-500/50 hover:bg-green-500/10 text-gray-400 hover:text-green-300'}
                            ${(status !== 'idle' && status !== 'done') && status !== 'running-worker' ? 'opacity-30 blur-sm pointer-events-none' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3 font-bold text-lg">
                            <Cpu size={20} /> Web Worker
                        </div>
                        <p className="text-xs opacity-70 leading-relaxed text-left">
                            Spawns a background thread. The UI remains <strong>smooth and interactive</strong> during calculation.
                        </p>
                    </button>

                    <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                        <div className="flex items-start gap-3">
                            <Clock className="text-blue-400 shrink-0 mt-0.5" size={16} />
                            <div className="text-xs text-blue-200">
                                <strong>Observation:</strong> Watch the spinning circle on the left. In Main Thread mode, it stops because the browser cannot update pixels while calculating.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
