import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Plus, RotateCcw, Loader, CheckCircle2, Clock, Settings2 } from 'lucide-react';

interface Task {
    id: number;
    name: string;
    status: 'pending' | 'running' | 'done';
    startTime?: number;
    endTime?: number;
}

export const ConcurrencyLab = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [concurrencyLimit, setConcurrencyLimit] = useState(3);
    const [isRunning, setIsRunning] = useState(false);
    const taskIdRef = useRef(1);
    const stopRef = useRef(false);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const addTask = () => {
        const newTask: Task = {
            id: taskIdRef.current++,
            name: `Task-${taskIdRef.current - 1}`,
            status: 'pending'
        };
        setTasks(prev => [...prev, newTask]);
    };

    const addBatch = () => {
        const newTasks: Task[] = Array.from({ length: 10 }, (_, i) => ({
            id: taskIdRef.current + i,
            name: `Task-${taskIdRef.current + i}`,
            status: 'pending' as const
        }));
        taskIdRef.current += 10;
        setTasks(prev => [...prev, ...newTasks]);
    };

    const reset = () => {
        stopRef.current = true;
        setIsRunning(false);
        setTasks([]);
        taskIdRef.current = 1;
    };

    const runTasks = async () => {
        if (isRunning) {
            stopRef.current = true;
            setIsRunning(false);
            return;
        }

        setIsRunning(true);
        stopRef.current = false;

        const runningTasks = new Set<number>();
        const queue = [...tasks];

        const executeTask = async (task: Task) => {
            setTasks(prev => prev.map(t =>
                t.id === task.id ? { ...t, status: 'running', startTime: Date.now() } : t
            ));

            await sleep(2000 + Math.random() * 1000);

            if (!stopRef.current) {
                setTasks(prev => prev.map(t =>
                    t.id === task.id ? { ...t, status: 'done', endTime: Date.now() } : t
                ));
            }

            runningTasks.delete(task.id);
        };

        while (queue.length > 0 || runningTasks.size > 0) {
            if (stopRef.current) break;

            while (runningTasks.size < concurrencyLimit && queue.length > 0) {
                const task = queue.shift();
                if (task && task.status === 'pending') {
                    runningTasks.add(task.id);
                    executeTask(task);
                }
            }

            await sleep(100);
        }

        setIsRunning(false);
    };

    const runningCount = tasks.filter(t => t.status === 'running').length;
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Clock className="text-yellow-400" />
                        Concurrency Control Lab
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        視覺化 Promise 並發限制與任務調度器
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                        <Settings2 size={14} className="text-gray-500" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Limit: {concurrencyLimit}</span>
                        <input
                            type="range"
                            min="1"
                            max="8"
                            value={concurrencyLimit}
                            onChange={(e) => setConcurrencyLimit(Number(e.target.value))}
                            disabled={isRunning}
                            className="w-20 accent-yellow-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                {/* Task Queue */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black">Task Queue ({tasks.length})</h4>
                        <div className="flex gap-2">
                            <button onClick={addTask} disabled={isRunning} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-colors disabled:opacity-30">
                                <Plus size={12} className="inline mr-1" />
                                Add Task
                            </button>
                            <button onClick={addBatch} disabled={isRunning} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-colors disabled:opacity-30">
                                Add 10
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <AnimatePresence>
                                {tasks.map(task => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className={`p-3 rounded-xl border transition-all ${task.status === 'running'
                                            ? 'bg-yellow-500/10 border-yellow-500/30'
                                            : task.status === 'done'
                                                ? 'bg-green-500/10 border-green-500/30'
                                                : 'bg-white/5 border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {task.status === 'pending' && <Clock size={12} className="text-gray-500" />}
                                                {task.status === 'running' && <Loader size={12} className="text-yellow-400 animate-spin" />}
                                                {task.status === 'done' && <CheckCircle2 size={12} className="text-green-400" />}
                                                <span className="text-xs font-bold">{task.name}</span>
                                            </div>
                                            <span className={`text-[8px] px-2 py-0.5 rounded uppercase font-bold ${task.status === 'running'
                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                : task.status === 'done'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-500'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Stats & Controls */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black mb-4">Statistics</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Pending</span>
                                <span className="text-lg font-black text-gray-300">{pendingCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Running</span>
                                <span className="text-lg font-black text-yellow-400">{runningCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Completed</span>
                                <span className="text-lg font-black text-green-400">{doneCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={runTasks}
                            disabled={tasks.length === 0}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${isRunning
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                                : 'bg-yellow-500 text-white shadow-xl hover:bg-yellow-400'
                                } disabled:opacity-30`}
                        >
                            {isRunning ? (<><Pause size={14} fill="currentColor" /> Stop</>) : (<><Play size={14} fill="currentColor" /> Start Scheduler</>)}
                        </button>
                        <button
                            onClick={reset}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                        >
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>

                    <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">
                            這個調度器會維護一個「Promise Pool」，確保同時執行的 Promise 數量不超過並發限制。當有任務完成時，自動從隊列中取出下一個任務執行。
                        </p>
                    </div>
                </div>
            </div>

            {/* Code Solution Section */}
            <div className="mt-8 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-yellow-400">💡</span> 完整代碼實現與解析
                </h4>

                <div className="bg-black/60 rounded-2xl border border-yellow-500/20 p-6 space-y-4">
                    <div>
                        <div className="text-xs text-yellow-400 font-bold mb-2 uppercase">題目解讀</div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            題目要求實現一個「帶並發限制的 Promise.all」，即：執行 100 個異步任務，但同時最多只能有 5 個在跑。
                            雖然叫 Promise.all，但<strong className="text-yellow-400">實現時需要用 Promise.race()</strong> 來監聽任意一個完成。
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 overflow-x-auto">
                        <div className="text-[10px] text-yellow-400 font-bold mb-2">方案一：使用 Promise.race（推薦）</div>
                        <pre className="text-[10px] text-gray-300 leading-relaxed">
                            {`async function promiseAllWithLimit(limit, tasks) {
  const results = [];
  const executing = new Set();
  
  for (const task of tasks) {
    const promise = Promise.resolve(task()).then(result => {
      executing.delete(promise);
      return result;
    });
    
    results.push(promise);
    executing.add(promise);
    
    // 達到並發上限時，等待任意一個完成
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  
  // 等待所有任務完成
  return Promise.all(results);
}

// 使用
const tasks = Array.from({ length: 100 }, (_, i) => 
  () => fetch(\`/api/image-\${i}.jpg\`)
);
const results = await promiseAllWithLimit(5, tasks);`}
                        </pre>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 overflow-x-auto">
                        <div className="text-[10px] text-orange-400 font-bold mb-2">方案二：分批使用 Promise.all（簡單但不夠優化）</div>
                        <pre className="text-[10px] text-gray-300 leading-relaxed">
                            {`async function batchPromiseAll(limit, tasks) {
  const results = [];
  
  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit);
    const batchResults = await Promise.all(
      batch.map(task => task())
    );
    results.push(...batchResults);
  }
  
  return results;
}

// 缺點：如果某個任務特別慢，會阻塞整批`}
                        </pre>
                    </div>

                    <div>
                        <div className="text-xs text-yellow-400 font-bold mb-2 uppercase">關鍵知識點</div>
                        <div className="space-y-2">
                            <div className="flex gap-2 text-xs">
                                <span className="text-yellow-400">•</span>
                                <div>
                                    <span className="text-gray-300 font-bold">Promise.race()</span>
                                    <span className="text-gray-500 ml-2">等待最先完成的 Promise，用於釋放並發槽位</span>
                                </div>
                            </div>
                            <div className="flex gap-2 text-xs">
                                <span className="text-yellow-400">•</span>
                                <div>
                                    <span className="text-gray-300 font-bold">Promise.all()</span>
                                    <span className="text-gray-500 ml-2">在最後用來等待所有結果收集完畢</span>
                                </div>
                            </div>
                            <div className="flex gap-2 text-xs">
                                <span className="text-yellow-400">•</span>
                                <div>
                                    <span className="text-gray-300 font-bold">Set 數據結構</span>
                                    <span className="text-gray-500 ml-2">追蹤正在執行的 Promise，方便刪除</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            <span className="text-yellow-400 font-bold">為什麼不能只用 Promise.all？</span>
                            因為 Promise.all 會等所有 Promise 都完成才返回，無法在中途控制並發數量。我們需要 Promise.race 來實時監控哪個任務先完成。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
