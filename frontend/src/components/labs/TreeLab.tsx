import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Eye, Info } from 'lucide-react';

interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
}

const TREE_DATA: TreeNode = {
    id: 'root',
    label: 'HTML',
    children: [
        {
            id: 'head',
            label: 'HEAD',
            children: [{ id: 'title', label: 'TITLE' }]
        },
        {
            id: 'body',
            label: 'BODY',
            children: [
                {
                    id: 'header',
                    label: 'HEADER',
                    children: [{ id: 'nav', label: 'NAV' }]
                },
                {
                    id: 'main',
                    label: 'MAIN',
                    children: [
                        { id: 'h1', label: 'H1' },
                        { id: 'p', label: 'P' }
                    ]
                }
            ]
        }
    ]
};

export const TreeLab = () => {
    const [traversing, setTraversing] = useState(false);
    const [mode, setMode] = useState<'dfs' | 'bfs'>('dfs');
    const [visited, setVisited] = useState<string[]>([]);
    const [queue, setQueue] = useState<string[]>([]);
    const [current, setCurrent] = useState<string | null>(null);

    const reset = () => {
        setTraversing(false);
        setVisited([]);
        setQueue([]);
        setCurrent(null);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runDFS = async (node: TreeNode, path: string[] = []) => {
        if (!node) return;
        setTraversing(true);
        setCurrent(node.id);
        setVisited(prev => [...prev, node.id]);
        await sleep(800);

        if (node.children) {
            for (const child of node.children) {
                await runDFS(child, path);
            }
        }
    };

    const runBFS = async () => {
        setTraversing(true);
        const q: TreeNode[] = [TREE_DATA];
        const visitedIds: string[] = [];

        while (q.length > 0) {
            const node = q.shift()!;
            setCurrent(node.id);
            setQueue(q.map(n => n.label));
            visitedIds.push(node.id);
            setVisited([...visitedIds]);
            await sleep(800);

            if (node.children) {
                q.push(...node.children);
                setQueue(q.map(n => n.label));
            }
        }
        setTraversing(false);
        setCurrent(null);
    };

    const start = () => {
        reset();
        if (mode === 'dfs') runDFS(TREE_DATA).then(() => { setTraversing(false); setCurrent(null); });
        else runBFS();
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Network className="text-blue-400" />
                        Tree Traversal (DOM)
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Visualize how BFS and DFS visit nodes in a hierarchy.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => { reset(); setMode('dfs'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'dfs' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        DFS (Depth First)
                    </button>
                    <button
                        onClick={() => { reset(); setMode('bfs'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'bfs' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        BFS (Breadth First)
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 md:p-12 overflow-auto flex items-start justify-center min-h-[400px]">
                    <Node node={TREE_DATA} visited={visited} current={current} />
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-black">
                            <span>{mode === 'dfs' ? 'Recursion Stack' : 'Queue (FIFO)'}</span>
                            <span className="text-blue-400">{visited.length} visited</span>
                        </div>
                        <div className="h-12 bg-white/5 rounded-xl border border-white/10 flex items-center px-4 gap-2 overflow-hidden">
                            <AnimatePresence>
                                {mode === 'bfs' ? (
                                    queue.map((label, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -20, opacity: 0 }}
                                            className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] rounded border border-blue-500/30"
                                        >
                                            {label}
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-[10px] text-gray-600 italic">DFS uses system recursion stack...</div>
                                )}
                            </AnimatePresence>
                            {mode === 'bfs' && queue.length === 0 && <span className="text-[10px] text-gray-700 italic">Empty queue</span>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={traversing ? reset : start}
                            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${traversing ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500 text-white shadow-xl shadow-blue-500/20'}`}
                        >
                            {traversing ? 'Reset' : 'Start Traversal'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-gray-900 border border-white/5">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Info size={16} className="text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
                            {mode === 'dfs' ? 'DFS: Go Deep First' : 'BFS: Scan by Layer'}
                        </h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            {mode === 'dfs' ? '深度優先搜尋會沿著路徑一直往下走，直到無法前進才回溯。在處理 DOM 樹或尋找特定節點時非常常用。' : '廣度優先搜尋會先訪問目前節點的所有鄰居，再進入下一層。適合尋找最短路徑或逐層掃描。'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Node = ({ node, visited, current, depth = 0 }: { node: TreeNode; visited: string[]; current: string | null; depth?: number }) => {
    const isVisited = visited.includes(node.id);
    const isCurrent = current === node.id;

    return (
        <div className="flex flex-col items-center">
            <motion.div
                className={`px-4 py-2 rounded-xl border transition-all duration-500 relative flex flex-col items-center justify-center min-w-[80px] ${isCurrent ? 'bg-blue-500 border-white shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-110 z-10' :
                    isVisited ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}
            >
                <span className="text-[10px] font-black uppercase tracking-widest">{node.label}</span>
                {isCurrent && (
                    <motion.div
                        layoutId="pointer"
                        className="absolute -top-8 text-blue-400"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                    >
                        <Eye size={16} />
                    </motion.div>
                )}
            </motion.div>

            {node.children && (
                <div className="flex gap-4 mt-8 relative">
                    <div className="absolute top-[-30px] left-1/2 w-px h-[30px] bg-white/10" />
                    {node.children.map(child => (
                        <Node key={child.id} node={child} visited={visited} current={current} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};
