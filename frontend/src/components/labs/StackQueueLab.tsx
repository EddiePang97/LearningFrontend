import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowDown, ArrowUp, Play, RotateCcw, Box } from 'lucide-react';

export const StackQueueLab = () => {
    const [structure, setStructure] = useState<'stack' | 'queue'>('stack');
    const [items, setItems] = useState<string[]>([]);
    const [animating, setAnimating] = useState(false);

    const push = () => {
        if (items.length >= 8) return;
        const newItem = String.fromCharCode(65 + items.length);
        setItems([...items, newItem]);
    };

    const pop = async () => {
        if (items.length === 0 || animating) return;
        setAnimating(true);

        if (structure === 'stack') {
            // LIFO - Remove from end
            setItems(items.slice(0, -1));
        } else {
            // FIFO - Remove from front
            setItems(items.slice(1));
        }

        setTimeout(() => setAnimating(false), 500);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Layers className="text-purple-400" />
                        Linear Structures: Stack & Queue
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Interact with LIFO and FIFO behaviors through visual animations.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => { setItems([]); setStructure('stack'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${structure === 'stack' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Stack (LIFO)
                    </button>
                    <button
                        onClick={() => { setItems([]); setStructure('queue'); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${structure === 'queue' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Queue (FIFO)
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-full max-w-2xl h-[400px] bg-black/40 rounded-3xl border border-white/5 p-6 md:p-12 flex items-center justify-center relative group">
                    {/* Stack/Queue Container */}
                    <div className={`relative flex gap-4 transition-all duration-700 ${structure === 'stack' ? 'flex-col-reverse items-center justify-end h-full w-24 border-x border-b border-white/10 p-2 rounded-b-xl' : 'flex-row items-center justify-start w-full border-y border-white/10 p-4 h-24 rounded-none'}`}>
                        <AnimatePresence mode="popLayout">
                            {items.map((item, idx) => (
                                <motion.div
                                    key={item}
                                    layout
                                    initial={{
                                        opacity: 0,
                                        y: structure === 'stack' ? -100 : 0,
                                        x: structure === 'queue' ? 100 : 0,
                                        scale: 0.8
                                    }}
                                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.5,
                                        x: structure === 'queue' ? -200 : 0,
                                        y: structure === 'stack' ? -200 : 0
                                    }}
                                    className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border flex items-center justify-center font-black text-xl shadow-lg relative ${structure === 'stack' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-blue-500/20 border-blue-500/50 text-blue-400'}`}
                                >
                                    {item}
                                    <span className="absolute -right-2 top-0 text-[8px] bg-white/10 px-1 rounded opacity-50">
                                        {idx}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {items.length === 0 && (
                            <div className="text-gray-700 italic text-xs animate-pulse">
                                {structure === 'stack' ? 'Empty Stack' : 'Empty Queue'}
                            </div>
                        )}
                    </div>

                    {/* Annotations */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-black">
                            <Box size={12} /> Capacity: 8
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={push}
                        disabled={items.length >= 8}
                        className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:bg-purple-500 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <ArrowDown size={16} /> {structure === 'stack' ? 'Push' : 'Enqueue'}
                    </button>
                    <button
                        onClick={pop}
                        disabled={items.length === 0 || animating}
                        className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <ArrowUp size={16} className={structure === 'queue' ? 'rotate-90' : ''} /> {structure === 'stack' ? 'Pop' : 'Dequeue'}
                    </button>
                    <button
                        onClick={() => setItems([])}
                        className="p-4 bg-gray-900 text-gray-500 rounded-2xl hover:text-white transition-all border border-white/5"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gray-900/50 border border-white/5 flex gap-6">
                <div className="flex-1">
                    <h4 className="text-[10px] text-gray-400 uppercase font-black mb-2 flex items-center gap-2">
                        <Play size={10} className="text-purple-400" />
                        {structure === 'stack' ? 'How Stack Works: LIFO' : 'How Queue Works: FIFO'}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        {structure === 'stack'
                            ? '棧像是一疊盤子，最後放上去的盤子必須最先拿走。在前端中，這被用於管理「遞歸調用」與「撤銷操作」。'
                            : '隊列就像排隊買票，第一個來的排第一位，也最先離開。這在底層用於處理「事件任務池」與「微任務」。'}
                    </p>
                </div>
                <div className="w-1/3 flex flex-col justify-center border-l border-white/5 pl-6">
                    <div className="text-[24px] font-black text-white/10 uppercase tracking-tighter leading-none">
                        {structure === 'stack' ? 'Stack' : 'Queue'}
                    </div>
                    <div className="text-[10px] text-purple-500 font-bold mt-1">
                        {structure === 'stack' ? 'Last-In First-Out' : 'First-In First-Out'}
                    </div>
                </div>
            </div>
        </div>
    );
};
