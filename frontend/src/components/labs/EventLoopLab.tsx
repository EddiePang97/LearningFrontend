import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, FastForward } from 'lucide-react';

const PRESETS = [
    {
        id: 'sync',
        title: 'Synchronous',
        code: `console.log('1');\nconsole.log('2');\nconsole.log('3');`,
        steps: [
            { id: 0, description: 'Initial State', callStack: [], microTasks: [], macroTasks: [], logs: [], highlightLines: [] },
            { id: 1, description: 'Run console.log("1")', callStack: ['console.log("1")'], microTasks: [], macroTasks: [], logs: [], highlightLines: [1] },
            { id: 2, description: 'Log "1"', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [1] },
            { id: 3, description: 'Run console.log("2")', callStack: ['console.log("2")'], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [2] },
            { id: 4, description: 'Log "2"', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '2', type: 'sync' }], highlightLines: [2] },
            { id: 5, description: 'Run console.log("3")', callStack: ['console.log("3")'], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '2', type: 'sync' }], highlightLines: [3] },
            { id: 6, description: 'Log "3"', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '2', type: 'sync' }, { id: 3, text: '3', type: 'sync' }], highlightLines: [3] },
            { id: 7, description: 'Done', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '2', type: 'sync' }, { id: 3, text: '3', type: 'sync' }], highlightLines: [] },
        ]
    },
    {
        id: 'promise',
        title: 'Promise (Microtask)',
        code: `console.log('Start');\nPromise.resolve().then(() => {\n  console.log('Promise');\n});\nconsole.log('End');`,
        steps: [
            { id: 0, description: 'Initial State', callStack: [], microTasks: [], macroTasks: [], logs: [], highlightLines: [] },
            { id: 1, description: 'Log "Start"', callStack: ['console.log("Start")'], microTasks: [], macroTasks: [], logs: [], highlightLines: [1] },
            { id: 2, description: 'Output "Start"', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }], highlightLines: [1] },
            { id: 3, description: 'Register Promise callback', callStack: ['Promise.resolve().then(...)'], microTasks: [], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }], highlightLines: [2] },
            { id: 4, description: 'Promise callback added to Microtask Queue', callStack: [], microTasks: ['() => console.log("Promise")'], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }], highlightLines: [2] },
            { id: 5, description: 'Log "End"', callStack: ['console.log("End")'], microTasks: ['() => console.log("Promise")'], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }], highlightLines: [5] },
            { id: 6, description: 'Output "End"', callStack: [], microTasks: ['() => console.log("Promise")'], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }, { id: 2, text: 'End', type: 'sync' }], highlightLines: [5] },
            { id: 7, description: 'Stack Empty: Check Microtasks', callStack: [], microTasks: ['() => console.log("Promise")'], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }, { id: 2, text: 'End', type: 'sync' }], highlightLines: [] },
            { id: 8, description: 'Run Microtask', callStack: ['() => console.log("Promise")'], microTasks: [], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }, { id: 2, text: 'End', type: 'sync' }], highlightLines: [3] },
            { id: 9, description: 'Log "Promise"', callStack: ['console.log("Promise")'], microTasks: [], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }, { id: 2, text: 'End', type: 'sync' }], highlightLines: [3] },
            { id: 10, description: 'Output "Promise"', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }, { id: 2, text: 'End', type: 'sync' }, { id: 3, text: 'Promise', type: 'micro' }], highlightLines: [3] },
            { id: 11, description: 'Done', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: 'Start', type: 'sync' }, { id: 2, text: 'End', type: 'sync' }, { id: 3, text: 'Promise', type: 'micro' }], highlightLines: [] },
        ]
    },
    {
        id: 'mixed',
        title: 'Interview Classic',
        code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
        steps: [
            { id: 0, description: 'Initial State', callStack: [], microTasks: [], macroTasks: [], logs: [], highlightLines: [] },
            { id: 1, description: 'Log "1"', callStack: ['console.log("1")'], microTasks: [], macroTasks: [], logs: [], highlightLines: [1] },
            { id: 2, description: 'Output "1"', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [1] },

            { id: 3, description: 'Call setTimeout', callStack: ['setTimeout(...)'], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [2] },
            { id: 4, description: 'Register Timer (Web API)', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [2] },
            { id: 5, description: 'Timer Done: Add to Macrotask Queue', callStack: [], microTasks: [], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [2] },

            { id: 6, description: 'Call Promise.then', callStack: ['Promise.then(...)'], microTasks: [], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [3] },
            { id: 7, description: 'Add to Microtask Queue', callStack: [], microTasks: ['() => console.log("3")'], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [3] },

            { id: 8, description: 'Log "4"', callStack: ['console.log("4")'], microTasks: ['() => console.log("3")'], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }], highlightLines: [4] },
            { id: 9, description: 'Output "4"', callStack: [], microTasks: ['() => console.log("3")'], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '4', type: 'sync' }], highlightLines: [4] },

            { id: 10, description: 'Stack Empty: Check Microtasks', callStack: [], microTasks: ['() => console.log("3")'], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '4', type: 'sync' }], highlightLines: [] },
            { id: 11, description: 'Run Microtask', callStack: ['() => console.log("3")'], microTasks: [], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '4', type: 'sync' }], highlightLines: [3] },
            { id: 12, description: 'Output "3"', callStack: [], microTasks: [], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '4', type: 'sync' }, { id: 3, text: '3', type: 'micro' }], highlightLines: [3] },

            { id: 13, description: 'Stack & Micros Empty: Check Macrotasks', callStack: [], microTasks: [], macroTasks: ['() => console.log("2")'], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '4', type: 'sync' }, { id: 3, text: '3', type: 'micro' }], highlightLines: [] },
            { id: 14, description: 'Run Macrotask', callStack: ['() => console.log("2")'], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '4', type: 'sync' }, { id: 3, text: '3', type: 'micro' }], highlightLines: [2] },
            { id: 15, description: 'Output "2"', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '4', type: 'sync' }, { id: 3, text: '3', type: 'micro' }, { id: 4, text: '2', type: 'macro' }], highlightLines: [2] },

            { id: 16, description: 'Done', callStack: [], microTasks: [], macroTasks: [], logs: [{ id: 1, text: '1', type: 'sync' }, { id: 2, text: '4', type: 'sync' }, { id: 3, text: '3', type: 'micro' }, { id: 4, text: '2', type: 'macro' }], highlightLines: [] },
        ]
    }
];

export const EventLoopLab = () => {
    const [selectedPreset, setSelectedPreset] = useState(PRESETS[2]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef<number | null>(null);

    const currentStep = selectedPreset.steps[currentStepIndex];

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentStepIndex(prev => {
                    if (prev < selectedPreset.steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isPlaying, selectedPreset]);

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
    };

    const handlePresetChange = (preset: typeof PRESETS[0]) => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
        setSelectedPreset(preset);
    };

    return (
        <div className="flex min-h-[520px] w-full flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:min-h-[680px] md:p-6">
            {/* Control Panel */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap gap-2">
                    {PRESETS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => handlePresetChange(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedPreset.id === p.id
                                ? 'bg-accent-purple text-white border-accent-purple'
                                : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
                                }`}
                        >
                            {p.title}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Reset"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${isPlaying
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
                            }`}
                    >
                        {isPlaying ? 'Pause' : <><Play size={16} /> Run</>}
                    </button>
                    <button
                        onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIndex(prev => Math.min(prev + 1, selectedPreset.steps.length - 1));
                        }}
                        disabled={currentStepIndex >= selectedPreset.steps.length - 1}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                        title="Step Forward"
                    >
                        <FastForward size={18} />
                    </button>
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Code Panel */}
                <div className="lg:col-span-4 flex flex-col gap-4 min-h-[300px]">
                    <div className="relative flex-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-4">
                        <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Source Code</div>
                        <pre className="min-w-[280px] whitespace-pre-wrap text-gray-300 leading-6">
                            {selectedPreset.code.split('\n').map((line, i) => (
                                <div
                                    key={i}
                                    className={`px-2 -mx-2 rounded transition-colors duration-300 ${currentStep.highlightLines.includes(i + 1)
                                        ? 'bg-yellow-500/20 text-yellow-200'
                                        : ''
                                        }`}
                                >
                                    <span className="inline-block w-6 text-gray-600 select-none">{i + 1}</span>
                                    {line}
                                </div>
                            ))}
                        </pre>
                    </div>

                    <div className="h-40 bg-black/80 rounded-2xl border border-white/10 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                        <div className="sticky top-0 bg-black/80 pb-2 border-b border-white/10 mb-2 flex justify-between">
                            <span className="text-gray-400 font-bold uppercase tracking-widest">Console</span>
                            <span className="text-gray-600 text-[10px]">{currentStep.logs.length} logs</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            {currentStep.logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex gap-2 ${log.type === 'micro' ? 'text-blue-400' :
                                        log.type === 'macro' ? 'text-orange-400' : 'text-gray-300'
                                        }`}
                                >
                                    <span className="opacity-50">&gt;</span>
                                    {log.text}
                                    {log.type !== 'sync' && <span className="ml-auto text-[10px] opacity-40 uppercase border border-current px-1 rounded">{log.type}</span>}
                                </motion.div>
                            ))}
                            {currentStep.logs.length === 0 && <span className="text-gray-700 italic">Console is empty...</span>}
                        </div>
                    </div>
                </div>

                {/* Simulation Panel */}
                <div className="lg:col-span-8 grid md:grid-rows-2 gap-6 min-h-[420px] md:min-h-[500px]">
                    {/* Top Row: Call Stack & Web APIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Call Stack */}
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col relative overflow-hidden">
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                Call Stack
                            </div>
                            <div className="flex-grow flex flex-col-reverse justify-start gap-2">
                                <AnimatePresence>
                                    {currentStep.callStack.map((item, i) => (
                                        <motion.div
                                            key={i} // In a real stack we'd need better keys
                                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                            className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                        >
                                            {item}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {currentStep.callStack.length === 0 && (
                                    <div className="h-full flex items-center justify-center text-gray-700 italic text-xs">
                                        Stack Empty
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Web APIs / Background */}
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col border-dashed relative">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">Web APIs / Background</div>
                            <div className="flex-1 flex items-center justify-center text-gray-700 text-xs italic">
                                (Timers, Fetch, DOM Events handled here)
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Queues */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Microtask Queue */}
                        <div className="bg-white/5 rounded-2xl border border-blue-500/20 p-4 flex flex-col relative">
                            <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                Microtask Queue
                                <span className="text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded text-blue-300 ml-auto">Promise</span>
                            </div>
                            <div className="flex-grow flex flex-col gap-2">
                                <AnimatePresence>
                                    {currentStep.microTasks.map((item, i) => (
                                        <motion.div
                                            key={`${item}-${i}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-lg text-xs"
                                        >
                                            {item}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {currentStep.microTasks.length === 0 && (
                                    <div className="h-full flex items-center justify-center text-gray-700 italic text-xs">
                                        Queue Empty
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Macrotask Queue */}
                        <div className="bg-white/5 rounded-2xl border border-orange-500/20 p-4 flex flex-col relative">
                            <div className="text-xs text-orange-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                                Macrotask Queue
                                <span className="text-[10px] bg-orange-500/10 px-1.5 py-0.5 rounded text-orange-300 ml-auto">setTimeout</span>
                            </div>
                            <div className="flex-grow flex flex-col gap-2">
                                <AnimatePresence>
                                    {currentStep.macroTasks.map((item, i) => (
                                        <motion.div
                                            key={`${item}-${i}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-2 bg-orange-500/10 border border-orange-500/30 text-orange-300 rounded-lg text-xs"
                                        >
                                            {item}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {currentStep.macroTasks.length === 0 && (
                                    <div className="h-full flex items-center justify-center text-gray-700 italic text-xs">
                                        Queue Empty
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-center text-gray-400 text-xs flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                State: <span className="text-white font-bold">{currentStep.description}</span>
            </div>
        </div>
    );
};
