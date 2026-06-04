import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Square, Settings, FileJson } from 'lucide-react';
import { LabFrame } from './LabFrame';

interface Log {
    id: string;
    message: string;
    type: 'mount' | 'update' | 'unmount' | 'render';
    timestamp: number;
}

interface DemoProps {
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>;
    addLog: (message: string, type: Log['type']) => void;
    depArray: 'empty' | 'count';
}

// Extracted and Memoized
const DemoComponent = memo(({ count, setCount, addLog, depArray }: DemoProps) => {

    // Simulate "Render" phase log
    useEffect(() => {
        addLog(`组件渲染 (Count: ${count})`, 'render');
    });

    useEffect(() => {
        addLog('🔵 副作用执行 (挂载 / 更新)', 'mount');

        return () => {
            addLog('🔴 清除函数执行 (卸载 / 更新前)', 'unmount');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depArray === 'count' ? count : undefined]);

    return (
        <div className="p-6 bg-gray-900 rounded-xl border border-white/10 flex flex-col items-center gap-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                {count}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setCount(c => c + 1)}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors font-bold text-xs"
                >
                    增加 Count
                </button>
            </div>
        </div>
    );
});

export const HooksLab = () => {
    const [mounted, setMounted] = useState(true);
    const [count, setCount] = useState(0);
    const [logs, setLogs] = useState<Log[]>([]);
    const [depArray, setDepArray] = useState<'empty' | 'count'>('empty');

    // Auto-scroll logs
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Stable callback to prevent passing new function on every render
    const addLog = useCallback((message: string, type: Log['type']) => {
        setLogs(prev => [...prev, {
            id: Math.random().toString(36),
            message,
            type,
            timestamp: Date.now()
        }]);
    }, []);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <LabFrame
            className="relative md:min-h-[600px]"
            icon={Terminal}
            title="Hooks Effect Lab"
        >

            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Controls & Code Panel */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    {/* Controls */}
                    <div className="flex gap-2 p-4 bg-gray-900/50 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setMounted(!mounted)}
                            className={`flex-1 py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${mounted
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                        >
                            {mounted ? <><Square size={14} /> 卸载组件</> : <><Play size={14} /> 挂载组件</>}
                        </button>

                        <button
                            onClick={() => setDepArray(curr => curr === 'empty' ? 'count' : 'empty')}
                            className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 font-bold text-xs flex items-center justify-center gap-2"
                        >
                            <Settings size={14} />
                            依赖项: {depArray === 'empty' ? '[]' : '[count]'}
                        </button>
                    </div>

                    {/* Code Preview */}
                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20">
                            <FileJson size={100} />
                        </div>
                        <div className="text-gray-400 text-xs leading-relaxed font-mono">
                            <span className="text-purple-400">useEffect</span>(() =&gt; {'{'}<br />
                            &nbsp;&nbsp;<span className="text-green-400">// 副作用逻辑</span><br />
                            &nbsp;&nbsp;console.log('副作用执行');<br /><br />
                            &nbsp;&nbsp;<span className="text-purple-400">return</span> () =&gt; {'{'}<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">// 清除逻辑</span><br />
                            &nbsp;&nbsp;&nbsp;&nbsp;console.log('清除执行');<br />
                            &nbsp;&nbsp;{'}'}<br />
                            {'}'}, <span className={`font-bold transition-colors duration-300 ${depArray === 'count' ? 'text-yellow-400' : 'text-gray-500'}`}>
                                {depArray === 'empty' ? '[]' : '[count]'}
                            </span>);
                        </div>
                        <div className="mt-4 p-2 bg-yellow-400/10 border border-yellow-400/20 rounded text-[10px] text-yellow-200">
                            {depArray === 'count'
                                ? "👉 依赖项 = [count]: 当 'count' 变化时，副作用会重新执行。"
                                : "👉 依赖项 = []: 副作用仅在挂载时执行一次。忽略后续更新。"}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Render & Console */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 min-h-0">
                    {/* Render Area */}
                    <div className="h-1/2 bg-white/5 rounded-2xl border border-white/5 relative flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            {mounted && (
                                <motion.div
                                    key="demo"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <DemoComponent
                                        count={count}
                                        setCount={setCount}
                                        addLog={addLog}
                                        depArray={depArray}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!mounted && (
                            <div className="text-gray-600 text-xs">组件已卸载</div>
                        )}
                    </div>

                    {/* Console Log */}
                    <div className="h-1/2 bg-black rounded-2xl border border-white/10 flex flex-col min-h-0">
                        <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                <Terminal size={14} /> 控制台日志
                            </div>
                            <button onClick={() => setLogs([])} className="text-[10px] text-gray-600 hover:text-white transition-colors">清空</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 custom-scrollbar">
                            {logs.map(log => (
                                <div key={log.id} className={`flex gap-2 ${log.type === 'mount' ? 'text-blue-400' :
                                    log.type === 'unmount' ? 'text-red-400' :
                                        'text-gray-500'
                                    }`}>
                                    <span className="opacity-30">[{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}]</span>
                                    <span>{log.message}</span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
