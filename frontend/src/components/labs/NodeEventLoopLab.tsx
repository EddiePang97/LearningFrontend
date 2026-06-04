import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, Pause, ArrowRight, Terminal } from 'lucide-react';

const PHASES = [
    { id: 'timers', name: 'Timers', desc: 'setTimeout, setInterval', color: 'bg-blue-500' },
    { id: 'pending', name: 'Pending Callbacks', desc: 'System I/O errors', color: 'bg-purple-500' },
    { id: 'idle', name: 'Idle, Prepare', desc: 'Internal use', color: 'bg-gray-700' },
    { id: 'poll', name: 'Poll', desc: 'I/O callbacks', color: 'bg-green-500' },
    { id: 'check', name: 'Check', desc: 'setImmediate', color: 'bg-yellow-500' },
    { id: 'close', name: 'Close Callbacks', desc: 'socket.on("close")', color: 'bg-red-500' }
];

export const NodeEventLoopLab = () => {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [tasks, setTasks] = useState<{ id: number; phase: string; type: string }[]>([]);
    const [microTasks, setMicroTasks] = useState<{ id: number; type: 'nextTick' | 'promise' }[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [isExecutingMicrotask, setIsExecutingMicrotask] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isRunning) {
            interval = setInterval(() => {
                // 1. Process Microtasks (Priority)
                // These always block the phase from advancing
                if (microTasks.length > 0) {
                    setIsExecutingMicrotask(true);
                    const nextMicro = microTasks[0];
                    setLogs(prev => [`[Microtask] Executing ${nextMicro.type}...`, ...prev].slice(0, 5));
                    setMicroTasks(prev => prev.slice(1));
                    return; // Loop is stuck here while microtasks run
                }

                if (isExecutingMicrotask) {
                    setIsExecutingMicrotask(false);
                    return; // Brief pause after microtasks
                }

                // 2. Check if CURRENT phase has tasks to execute
                const currentPhaseId = PHASES[currentPhase].id;
                const phaseTasks = tasks.filter(t => t.phase === currentPhaseId);

                if (phaseTasks.length > 0) {
                    // Task found! Execute it and STAY in this phase for this tick
                    const taskToExecute = phaseTasks[0];
                    setLogs(prev => [`[${PHASES[currentPhase].name}] Running callback: ${taskToExecute.type}`, ...prev].slice(0, 5));
                    setTasks(prev => {
                        const index = prev.findIndex(t => t.id === taskToExecute.id);
                        const newTasks = [...prev];
                        newTasks.splice(index, 1);
                        return newTasks;
                    });
                    // Optimization: We don't call setCurrentPhase, so it stays highlighted
                    return;
                }

                // 3. No microtasks and no tasks in current phase? Advance to next phase
                setCurrentPhase(prev => (prev + 1) % PHASES.length);

            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, tasks, microTasks, currentPhase, isExecutingMicrotask]);

    const addTask = (phaseId: string, type: string) => {
        setTasks(prev => [...prev, { id: Math.random(), phase: phaseId, type }]);
        setLogs(prev => [`[System] Queued: ${type}`, ...prev].slice(0, 5));
    };

    const addMicroTask = (type: 'nextTick' | 'promise') => {
        setMicroTasks(prev => [...prev, { id: Math.random(), type }]);
        setLogs(prev => [`[System] Queued Microtask: ${type}`, ...prev].slice(0, 5));
    };

    const reset = () => {
        setIsRunning(false);
        setCurrentPhase(0);
        setTasks([]);
        setLogs(['[System] Reset complete.']);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <RefreshCw className={`text-green-400 ${isRunning ? 'animate-spin' : ''}`} />
                        Node.js Event Loop Visualizer
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                        Understanding how Libuv manages the six phases of the Node.js event loop.
                    </p>
                </div>
                <button
                    onClick={reset}
                    className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                    title="Reset Simulation"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Visualizer Loop */}
                <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[350px] scale-75 sm:scale-100">
                    {/* Background Trace */}
                    <svg className="absolute w-[320px] h-[320px] rotate-[-90deg]">
                        <circle
                            cx="160"
                            cy="160"
                            r="140"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-white/5"
                        />
                        {/* Active Progress Trace */}
                        {isRunning && (
                            <motion.circle
                                cx="160"
                                cy="160"
                                r="140"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray="880"
                                animate={{ strokeDashoffset: [880, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                className="text-blue-500/20"
                            />
                        )}
                    </svg>

                    {PHASES.map((phase, idx) => {
                        const angle = (idx / PHASES.length) * 2 * Math.PI - Math.PI / 2;
                        const x = Math.cos(angle) * 140;
                        const y = Math.sin(angle) * 140;
                        const isActive = currentPhase === idx;

                        return (
                            <motion.div
                                key={phase.id}
                                className={`absolute w-32 p-3 rounded-xl border transition-all duration-500 ${isActive
                                    ? `scale-110 shadow-[0_0_20px_rgba(255,255,255,0.1)] ${phase.color} border-white text-white z-10`
                                    : 'bg-gray-900 border-white/10 text-gray-500'
                                    }`}
                                animate={{
                                    x: x,
                                    y: y,
                                    opacity: 1
                                }}
                                initial={{ opacity: 0 }}
                            >
                                <div className="text-[10px] font-bold uppercase truncate">{phase.name}</div>
                                <div className="text-[8px] opacity-70 leading-tight mt-1">{phase.desc}</div>

                                {/* Task Counter Badge */}
                                <AnimatePresence>
                                    {tasks.filter(t => t.phase === phase.id).length > 0 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg"
                                        >
                                            {tasks.filter(t => t.phase === phase.id).length}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}

                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all z-20 relative ${isRunning
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                            : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                            }`}
                    >
                        {/* Microtask Queue Visualizer in the middle */}
                        <AnimatePresence>
                            {microTasks.length > 0 && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute -top-12 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[8px] flex gap-1 items-center"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                    Microtasks: {microTasks.length}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isRunning ? <Pause size={24} className={isExecutingMicrotask ? 'text-purple-400 animate-pulse' : ''} /> : <Play size={24} />}
                        <span className="text-[10px] font-bold uppercase">
                            {isExecutingMicrotask ? 'Microtask...' : (isRunning ? 'Pause' : 'Start')}
                        </span>
                    </button>
                </div>

                {/* Controls & Logs */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                        <h4 className="text-xs text-gray-400 uppercase font-bold mb-4 flex items-center gap-2">
                            <Terminal size={14} /> Task Interaction
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => addTask('timers', 'setTimeout')} className="group p-3 bg-blue-900/10 border border-blue-500/20 rounded-xl text-[10px] text-blue-300 hover:bg-blue-900/20 transition-all flex items-center justify-between">
                                <span>setTimeout</span>
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </button>
                            <button onClick={() => addTask('poll', 'fs.readFile')} className="group p-3 bg-green-900/10 border border-green-500/20 rounded-xl text-[10px] text-green-300 hover:bg-green-900/20 transition-all flex items-center justify-between">
                                <span>I/O Read</span>
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </button>
                            <button onClick={() => addTask('check', 'setImmediate')} className="group p-3 bg-yellow-900/10 border border-yellow-500/20 rounded-xl text-[10px] text-yellow-300 hover:bg-yellow-900/20 transition-all flex items-center justify-between">
                                <span>setImmediate</span>
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </button>
                            <button onClick={() => addTask('close', 'socket.close')} className="group p-3 bg-red-900/10 border border-red-500/20 rounded-xl text-[10px] text-red-300 hover:bg-red-900/20 transition-all flex items-center justify-between">
                                <span>socket.close</span>
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5">
                            <h4 className="text-[9px] text-purple-400 uppercase font-bold mb-3 flex items-center gap-2">
                                <RefreshCw size={12} /> Microtasks (Priority)
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => addMicroTask('nextTick')} className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl text-[10px] text-purple-300 hover:bg-purple-900/30 transition-all text-left">
                                    process.nextTick()
                                </button>
                                <button onClick={() => addMicroTask('promise')} className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl text-[10px] text-purple-300 hover:bg-purple-900/30 transition-all text-left">
                                    Promise.resolve()
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col min-h-[200px]">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Event Log</h4>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-2 font-mono overflow-y-auto custom-scrollbar">
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`text-[10px] border-l-2 pl-2 ${log.includes('Executing') ? 'text-green-400 border-green-500/50' :
                                        log.includes('Queued') ? 'text-blue-400 border-blue-500/20' :
                                            'text-gray-600 border-gray-800'
                                        }`}
                                >
                                    <span className="opacity-30 mr-2">{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                    {log}
                                </motion.div>
                            ))}
                            {logs.length === 0 && <div className="text-[10px] text-gray-700 italic text-center py-8">Idle... schedule a task to begin</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Improved Legend */}
            <div className="mt-8 flex flex-wrap gap-6 pt-6 border-t border-white/5">
                {[
                    { color: 'bg-blue-500', label: 'Timers (Macrotasks)' },
                    { color: 'bg-green-500', label: 'I/O (Polling)' },
                    { color: 'bg-yellow-500', label: 'Immediate (Check)' },
                    { color: 'bg-red-500', label: 'Close/Cleanup' }
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-[10px] text-gray-500 group cursor-default">
                        <div className={`w-2.5 h-2.5 rounded shadow-sm ${item.color} group-hover:scale-125 transition-transform`} />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
