import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RotateCcw, GitBranch, AlertCircle } from 'lucide-react';

interface GraphNode {
    id: string;
    label: string;
    value: unknown;
    x: number;
    y: number;
    refs?: string[];
}

export const DeepCloneLab = () => {
    const [cloneState, setCloneState] = useState<'initial' | 'shallow' | 'deep'>('initial');
    const [visitedMap, setVisitedMap] = useState<Set<string>>(new Set());

    const originalGraph: GraphNode[] = [
        { id: 'root', label: 'root', value: {}, x: 200, y: 50, refs: ['user', 'data'] },
        { id: 'user', label: 'user', value: { name: 'John' }, x: 100, y: 150, refs: ['hobbies'] },
        { id: 'data', label: 'data', value: { count: 10 }, x: 300, y: 150, refs: [] },
        { id: 'hobbies', label: 'hobbies', value: ['reading'], x: 100, y: 250, refs: ['root'] }
    ];

    const reset = () => {
        setCloneState('initial');
        setVisitedMap(new Set());
    };

    const performShallowClone = () => {
        setCloneState('shallow');
        setVisitedMap(new Set());
    };

    const performDeepClone = () => {
        setCloneState('deep');
        const visited = new Set<string>();
        originalGraph.forEach(node => {
            visited.add(node.id);
        });
        setVisitedMap(visited);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Copy className="text-cyan-400" />
                        Deep Clone Lab
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        視覺化深拷貝算法與循環引用處理
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={performShallowClone} className="px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl text-xs font-bold hover:bg-orange-500/20">
                        Shallow Clone
                    </button>
                    <button onClick={performDeepClone} className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-xs font-bold hover:bg-cyan-400">
                        Deep Clone
                    </button>
                    <button onClick={reset} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10">
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Original Object Graph */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black">Original Object</h4>
                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 relative">
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                            {/* Render edges */}
                            {originalGraph.map(node =>
                                node.refs?.map(refId => {
                                    const target = originalGraph.find(n => n.id === refId);
                                    if (!target) return null;
                                    return (
                                        <g key={`${node.id}-${refId}`}>
                                            <line
                                                x1={node.x}
                                                y1={node.y}
                                                x2={target.x}
                                                y2={target.y}
                                                stroke={refId === 'root' ? '#ef4444' : '#4b5563'}
                                                strokeWidth="2"
                                                markerEnd="url(#arrowhead)"
                                            />
                                            {refId === 'root' && (
                                                <text x={(node.x + target.x) / 2} y={(node.y + target.y) / 2 - 10} fontSize="10" fill="#ef4444" fontWeight="bold">
                                                    循環引用
                                                </text>
                                            )}
                                        </g>
                                    );
                                })
                            )}

                            {/* Render nodes */}
                            {originalGraph.map(node => (
                                <g key={node.id}>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r="30"
                                        fill={node.id === 'root' ? '#0891b2' : '#1e293b'}
                                        stroke={cloneState === 'initial' ? '#475569' : visitedMap.has(node.id) ? '#06b6d4' : '#475569'}
                                        strokeWidth="2"
                                    />
                                    <text
                                        x={node.x}
                                        y={node.y + 5}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fill="white"
                                        fontWeight="bold"
                                    >
                                        {node.label}
                                    </text>
                                </g>
                            ))}

                            {/* Arrow marker */}
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                                </marker>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Cloned Result */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
                        Cloned Result
                        {cloneState === 'shallow' && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[8px] rounded">SHALLOW</span>}
                        {cloneState === 'deep' && <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[8px] rounded">DEEP</span>}
                    </h4>
                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center gap-4">
                        <AnimatePresence mode="wait">
                            {cloneState === 'initial' && (
                                <motion.div
                                    key="initial"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <GitBranch size={48} className="text-gray-700 mx-auto mb-4" />
                                    <p className="text-xs text-gray-500">選擇一種拷貝方式</p>
                                </motion.div>
                            )}

                            {cloneState === 'shallow' && (
                                <motion.div
                                    key="shallow"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                                        <AlertCircle size={32} className="text-orange-400 mx-auto mb-3" />
                                        <div className="text-xs text-orange-400 font-bold text-center mb-2">⚠️ 淺拷貝問題</div>
                                        <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs">
                                            只複製了第一層屬性的「引用」。修改 cloned.user.name 會影響原始物件！因為它們指向同一個記憶體位址。
                                        </p>
                                    </div>
                                    <pre className="text-[9px] text-orange-400/70 bg-black/40 p-3 rounded-lg border border-orange-500/20">
                                        {`const cloned = { ...original };
// 循環引用依然存在！`}
                                    </pre>
                                </motion.div>
                            )}

                            {cloneState === 'deep' && (
                                <motion.div
                                    key="deep"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center gap-4 w-full"
                                >
                                    <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl w-full">
                                        <div className="text-xs text-cyan-400 font-bold text-center mb-3">✅ 深拷貝成功</div>
                                        <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
                                            使用 WeakMap 記錄已訪問的節點，當遇到循環引用時返回已克隆的對象引用，避免無限遞歸。
                                        </p>
                                        <div className="bg-black/40 p-3 rounded-lg space-y-2">
                                            {Array.from(visitedMap).map(id => (
                                                <div key={id} className="flex items-center gap-2 text-[10px]">
                                                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                                    <span className="text-cyan-400 font-mono">{id}</span>
                                                    <span className="text-gray-600">→ Cached</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <pre className="text-[9px] text-cyan-400/80 bg-black/40 p-3 rounded-lg border border-cyan-500/20 w-full overflow-x-auto">
                                        {`function deepClone(obj, map = new WeakMap()) {
  if (map.has(obj)) return map.get(obj);
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  for (let key in obj) {
    clone[key] = deepClone(obj[key], map);
  }
  return clone;
}`}
                                    </pre>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Code Solution Section */}
            <div className="mt-8 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-400">💡</span> 完整深拷貝實現與詳解
                </h4>

                <div className="bg-black/60 rounded-2xl border border-cyan-500/20 p-6 space-y-4">
                    <div>
                        <div className="text-xs text-cyan-400 font-bold mb-2 uppercase">為什麼需要深拷貝？</div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-2">
                            淺拷貝（<code className="text-orange-400">{`{...obj}`}</code> 或 <code className="text-orange-400">Object.assign()</code>）只複製第一層屬性的引用。
                            修改嵌套對象會影響原始數據，這在很多場景下是不可接受的。
                        </p>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <pre className="text-[9px] text-red-400">
                                {`const obj = { user: { name: 'John' } };
const shallow = { ...obj };
shallow.user.name = 'Jane';
console.log(obj.user.name); // 'Jane' ❌ 原始對象被修改了！`}
                            </pre>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-cyan-400 font-bold mb-2 uppercase">循環引用問題</div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-2">
                            如果對象中有循環引用（A → B → A），遞歸拷貝會陷入無限循環導致堆疊溢出。
                            必須用 <code className="text-cyan-400">WeakMap</code> 記錄已訪問的對象。
                        </p>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                            <pre className="text-[9px] text-yellow-400">
                                {`const obj = { name: 'test' };
obj.self = obj; // 循環引用

// 錯誤做法：會導致無限遞歸
function badClone(obj) {
  const clone = {};
  for (let key in obj) {
    clone[key] = badClone(obj[key]); // 💥 Stack Overflow!
  }
  return clone;
}`}
                            </pre>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 overflow-x-auto">
                        <div className="text-[10px] text-cyan-400 font-bold mb-2">✅ 正確實現（支持循環引用）</div>
                        <pre className="text-[10px] text-gray-300 leading-relaxed">
                            {`function deepClone(obj, map = new WeakMap()) {
  // 1. 處理基本類型和 null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 2. 處理循環引用 - 核心！
  if (map.has(obj)) {
    return map.get(obj); // 返回已克隆的對象引用
  }
  
  // 3. 處理特殊對象類型
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map) {
    const cloned = new Map();
    map.set(obj, cloned); // 提前設置，防止循環引用
    obj.forEach((val, key) => {
      cloned.set(deepClone(key, map), deepClone(val, map));
    });
    return cloned;
  }
  if (obj instanceof Set) {
    const cloned = new Set();
    map.set(obj, cloned);
    obj.forEach(val => cloned.add(deepClone(val, map)));
    return cloned;
  }
  
  // 4. 處理普通對象和數組
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone); // ⚠️ 必須先設置，再遞歸
  
  // 5. 拷貝所有屬性（包括 Symbol）
  Reflect.ownKeys(obj).forEach(key => {
    clone[key] = deepClone(obj[key], map);
  });
  
  return clone;
}`}
                        </pre>
                    </div>

                    <div>
                        <div className="text-xs text-cyan-400 font-bold mb-2 uppercase">為什麼用 WeakMap 而不是 Map？</div>
                        <div className="space-y-2 text-xs text-gray-300">
                            <div className="flex gap-2">
                                <span className="text-cyan-400">1.</span>
                                <div>
                                    <strong>自動垃圾回收：</strong>當原始對象被銷毀時，WeakMap 中的記錄也會自動清除，避免內存洩漏
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-cyan-400">2.</span>
                                <div>
                                    <strong>只能用對象作為 key：</strong>正好符合我們的需求（追蹤對象引用）
                                </div>
                            </div>
                            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2 mt-2">
                                <code className="text-[9px] text-cyan-400">
                                    map.set(obj, clone) → 當 obj 被回收時，WeakMap 的條目自動消失
                                </code>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-cyan-400 font-bold mb-2 uppercase">關鍵步驟順序（重要！）</div>
                        <div className="bg-white/5 rounded-lg p-3 space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                                <span className="text-green-400 font-bold">①</span>
                                <div>
                                    <strong className="text-gray-200">檢查 map.has(obj)</strong>
                                    <div className="text-gray-500 text-[10px]">如果已訪問過，直接返回已克隆的對象</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-400 font-bold">②</span>
                                <div>
                                    <strong className="text-gray-200">創建新對象 clone = {`{}`}</strong>
                                    <div className="text-gray-500 text-[10px]">為當前對象準備一個空的克隆體</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-400 font-bold">③</span>
                                <div>
                                    <strong className="text-yellow-200">⚠️ 先設置 map.set(obj, clone)</strong>
                                    <div className="text-yellow-500 text-[10px]">這一步必須在遞歸前完成！否則循環引用會死循環</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-400 font-bold">④</span>
                                <div>
                                    <strong className="text-gray-200">遞歸拷貝屬性</strong>
                                    <div className="text-gray-500 text-[10px]">此時如果遇到循環引用，會在步驟①返回</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-cyan-400 font-bold mb-2 uppercase">測試用例</div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <pre className="text-[9px] text-gray-300">
                                {`// 測試循環引用
const obj = { name: 'test' };
obj.self = obj;
const cloned = deepClone(obj);
console.log(cloned.self === cloned); // true ✅

// 測試 Symbol 屬性
const sym = Symbol('id');
const obj2 = { [sym]: 123, name: 'test' };
const cloned2 = deepClone(obj2);
console.log(cloned2[sym]); // 123 ✅

// 測試 Map
const map = new Map([['key', { value: 1 }]]);
const clonedMap = deepClone(map);
clonedMap.get('key').value = 2;
console.log(map.get('key').value); // 1 ✅ 不影響原始`}
                            </pre>
                        </div>
                    </div>

                    <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg">
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            <span className="text-cyan-400 font-bold">面試追問：</span>
                            如果要支持函數拷貝怎麼辦？函數是引用類型，但通常不需要深拷貝函數（可以共享引用）。
                            如果真的需要，可以用 <code className="text-cyan-400">new Function()</code> 或 <code className="text-cyan-400">eval()</code>，但這樣會丟失閉包。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
