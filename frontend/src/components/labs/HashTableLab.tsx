import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Search, ArrowRight, Zap, AlertCircle, Trash2 } from 'lucide-react';

const BUCKETS = 8;

export const HashTableLab = () => {
    const [table, setTable] = useState<{ [key: number]: { key: string, val: string }[] }>(
        Object.fromEntries(Array.from({ length: BUCKETS }, (_, i) => [i, []]))
    );
    const [inputKey, setInputKey] = useState('');
    const [inputVal, setInputVal] = useState('');
    const [hashing, setHashing] = useState(false);
    const [activeBuck, setActiveBuck] = useState<number | null>(null);

    const hashFn = (key: string) => {
        let h = 0;
        for (let i = 0; i < key.length; i++) {
            h += key.charCodeAt(i);
        }
        return h % BUCKETS;
    };

    const insert = async () => {
        if (!inputKey || hashing) return;
        setHashing(true);
        const idx = hashFn(inputKey);
        setActiveBuck(idx);

        await new Promise(r => setTimeout(r, 800));

        setTable(prev => {
            const newBuck = [...prev[idx], { key: inputKey, val: inputVal || 'null' }];
            return { ...prev, [idx]: newBuck };
        });

        setInputKey('');
        setInputVal('');
        setTimeout(() => {
            setHashing(false);
            setActiveBuck(null);
        }, 1000);
    };

    const clear = () => {
        setTable(Object.fromEntries(Array.from({ length: BUCKETS }, (_, i) => [i, []])));
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Hash className="text-yellow-400" />
                    Hash Table: Key-Value Mapping
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Visualize how keys map to buckets and how collisions are handled via Separate Chaining.
                </p>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-8">
                {/* Visual Table */}
                <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-8 flex flex-col gap-3 min-h-[400px] overflow-auto">
                    {Array.from({ length: BUCKETS }).map((_, idx) => {
                        const items = table[idx] || [];
                        const isActive = activeBuck === idx;
                        const hasCollision = items.length > 1;

                        return (
                            <div key={idx} className="flex items-center gap-4 group">
                                <motion.div
                                    className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 transition-all duration-500 ${isActive ? 'bg-yellow-500 border-white shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-110' : 'bg-white/5 border-white/10 text-gray-500'}`}
                                >
                                    {idx}
                                </motion.div>

                                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                    <AnimatePresence>
                                        {items.map((item, i) => (
                                            <div key={`${item.key}-${i}`} className="flex items-center gap-2">
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0, x: -20 }}
                                                    animate={{ scale: 1, opacity: 1, x: 0 }}
                                                    className={`px-3 py-2 rounded-lg border flex flex-col min-w-[80px] ${hasCollision ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}
                                                >
                                                    <span className="text-[8px] text-gray-500 font-bold truncate">KEY: {item.key}</span>
                                                    <span className="text-[10px] text-white font-black truncate">{item.val}</span>
                                                </motion.div>
                                                {i < items.length - 1 && <ArrowRight size={12} className="text-gray-700 shrink-0" />}
                                            </div>
                                        ))}
                                    </AnimatePresence>
                                    {items.length === 0 && !isActive && <div className="text-[10px] text-gray-800 italic">bucket empty</div>}
                                    {isActive && items.length === 0 && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-yellow-500"><Hash size={12} /></motion.div>}
                                </div>

                                {hasCollision && (
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-red-500 text-[8px] font-black uppercase">
                                        <AlertCircle size={10} /> Collision
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Interaction Shell */}
                <div className="w-full md:w-80 flex flex-col gap-6">
                    <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 uppercase font-black">Input Key (String)</label>
                            <input
                                value={inputKey} onChange={e => setInputKey(e.target.value)}
                                placeholder="e.g. name"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-500/50 outline-none text-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 uppercase font-black">Value</label>
                            <input
                                value={inputVal} onChange={e => setInputVal(e.target.value)}
                                placeholder="e.g. Eddie"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-500/50 outline-none text-white transition-all"
                            />
                        </div>

                        <button
                            onClick={insert}
                            disabled={!inputKey || hashing}
                            className="w-full py-4 bg-yellow-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-900/20 hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Zap size={16} fill="currentColor" /> {hashing ? 'Hashing...' : 'Set Key-Value'}
                        </button>

                        <button
                            onClick={clear}
                            className="w-full py-3 bg-white/5 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Trash2 size={14} /> Reset Table
                        </button>
                    </div>

                    <div className="bg-black/60 p-5 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black mb-4 flex items-center gap-2">
                            <Search size={14} /> What is a Collision?
                        </h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">
                            當不同的 Key 通過 Hash 函數計算出相同的下標時，就發生了「衝突」。實驗室使用「鏈地址法」將衝突的元素組成鏈表存放在同一個位子。
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-6 pt-4 border-t border-white/5 overflow-x-auto">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 whitespace-nowrap">
                    <div className="p-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-500"><Search size={8} /></div> Hashing Key
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 whitespace-nowrap">
                    <div className="w-3 h-3 rounded bg-red-500/10 border border-red-500/30" /> Collision Chain
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 whitespace-nowrap">
                    <div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> ID Bucket
                </div>
            </div>
        </div>
    );
};
