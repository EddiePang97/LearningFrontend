import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Users, Zap, Settings2, ShoppingCart, Percent, CreditCard, Plus, Trash2 } from 'lucide-react';

export const DesignPatternsLab = () => {
    const [activeTab, setActiveTab] = useState<'observer' | 'strategy'>('observer');

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Settings2 className="text-accent-purple" />
                        Design Patterns Lab
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Visualize how objects collaborate to solve common software design problems.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => setActiveTab('observer')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'observer' ? 'bg-accent-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Observer
                    </button>
                    <button
                        onClick={() => setActiveTab('strategy')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'strategy' ? 'bg-accent-purple text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Strategy
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <AnimatePresence mode="wait">
                    {activeTab === 'observer' ? (
                        <motion.div
                            key="observer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex-1 flex flex-col gap-6"
                        >
                            <ObserverLab />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="strategy"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex-1 flex flex-col gap-6"
                        >
                            <StrategyLab />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ObserverLab = () => {
    const [observers, setObservers] = useState([
        { id: 1, name: 'Sidebar', lastEvent: '', pulse: false },
        { id: 2, name: 'Analytics', lastEvent: '', pulse: false },
        { id: 3, name: 'Logger', lastEvent: '', pulse: false }
    ]);
    const [eventCount, setEventCount] = useState(0);

    const notifyAll = () => {
        setEventCount(prev => prev + 1);
        const eventId = `EVT-${Math.floor(Math.random() * 1000)}`;

        setObservers(prev => prev.map(obs => ({
            ...obs,
            lastEvent: eventId,
            pulse: true
        })));

        setTimeout(() => {
            setObservers(prev => prev.map(obs => ({ ...obs, pulse: false })));
        }, 1000);
    };

    const addObserver = () => {
        const id = Date.now();
        setObservers([...observers, { id, name: `Subscriber-${observers.length + 1}`, lastEvent: '', pulse: false }]);
    };

    const removeObserver = (id: number) => {
        setObservers(observers.filter(o => o.id !== id));
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 flex-1">
            {/* Subject Area */}
            <div className="md:w-1/3 flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10 relative">
                <div className="absolute top-4 left-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Subject</div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={notifyAll}
                    className="w-32 h-32 rounded-full bg-accent-purple flex flex-col items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.4)] relative z-10"
                >
                    <Bell size={40} className="text-white mb-2" />
                    <span className="text-[10px] font-black text-white/80">NOTIFY</span>
                </motion.div>
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">點擊主體發送通知</p>
                    <p className="text-[10px] text-accent-purple font-bold mt-1 tracking-widest">EVENTS SENT: {eventCount}</p>
                </div>
            </div>

            {/* Observers Area */}
            <div className="md:w-2/3 flex flex-col gap-4">
                <div className="flex justify-between items-center px-2">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
                        <Users size={14} /> Active Observers ({observers.length})
                    </h4>
                    <button
                        onClick={addObserver}
                        className="p-2 bg-accent-purple/10 text-accent-purple hover:bg-accent-purple hover:text-white rounded-lg transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence>
                        {observers.map((obs) => (
                            <motion.div
                                key={obs.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: obs.pulse ? 1.05 : 1,
                                    borderColor: obs.pulse ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.05)'
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="p-4 bg-white/[0.02] border rounded-xl flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors ${obs.pulse ? 'bg-accent-purple text-white' : 'bg-white/5 text-gray-500'}`}>
                                        <Zap size={14} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-200">{obs.name}</div>
                                        <div className="text-[8px] text-gray-500 truncate max-w-[100px]">
                                            {obs.lastEvent ? `Last: ${obs.lastEvent}` : 'Waiting...'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeObserver(obs.id)}
                                    className="p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-auto p-4 bg-accent-purple/5 border border-accent-purple/10 rounded-xl">
                    <p className="text-[10px] text-gray-400 leading-relaxed italic">
                        觀察者模式實現了「發布-訂閱」機制。主體不需要知道誰在監聽，只需要在狀態改變時發送通知。這在 React 的 Context 或 Redux 中非常常見。
                    </p>
                </div>
            </div>
        </div>
    );
};

const StrategyLab = () => {
    const [amount, setAmount] = useState(1000);
    const [strategy, setStrategy] = useState<'normal' | 'member' | 'holiday'>('normal');

    const strategies = {
        normal: { name: 'Normal', discount: 0, icon: <ShoppingCart size={14} />, color: 'text-gray-400' },
        member: { name: 'Member (10%)', discount: 0.1, icon: <Users size={14} />, color: 'text-blue-400' },
        holiday: { name: 'Holiday (30%)', discount: 0.3, icon: <Percent size={14} />, color: 'text-orange-400' }
    };

    const finalPrice = amount * (1 - strategies[strategy].discount);

    return (
        <div className="flex flex-col gap-8 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Context / Input */}
                <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black mb-4 flex items-center gap-2">
                            <ShoppingCart size={14} /> Price Context
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-2 uppercase">Input Amount ($)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                {(Object.keys(strategies) as Array<keyof typeof strategies>).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setStrategy(key)}
                                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${strategy === key ? 'bg-accent-purple/20 border-accent-purple text-white' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}
                                    >
                                        {strategies[key].icon}
                                        <span className="text-[10px] font-bold">{strategies[key].name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-accent-purple/5 border border-accent-purple/10 rounded-2xl">
                        <h4 className="text-[10px] text-accent-purple uppercase font-black mb-3 italic">Mechanism</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            策略模式允許在運行時切換算法。Calculator 類不包含具體的折扣邏輯，而是將邏輯委託給傳入的 Strategy 對象。
                        </p>
                    </div>
                </div>

                {/* Strategy Output */}
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        <motion.div
                            key={strategy}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center z-10"
                        >
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-black">Calculation Output</div>
                            <div className="text-6xl font-black text-white flex items-center justify-center gap-2">
                                <span className="text-2xl text-accent-purple">$</span>
                                {Math.round(finalPrice).toLocaleString()}
                            </div>
                            <div className={`mt-4 text-xs font-bold ${strategies[strategy].color}`}>
                                {strategies[strategy].discount > 0 ? `Saved $${Math.round(amount * strategies[strategy].discount)}` : 'No Discount'}
                            </div>
                        </motion.div>

                        {/* Background Decoration */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <CreditCard size={200} className="absolute -bottom-10 -right-10 rotate-12" />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-900/50 rounded-xl border border-white/5 font-mono">
                        <div className="text-[8px] text-gray-600 uppercase mb-2">Pseudocode</div>
                        <pre className="text-[10px] text-orange-400/80 overflow-x-auto">
                            {`const context = new PriceCalculator();
context.setStrategy(new ${strategies[strategy].name}Strategy());
const price = context.calculate(${amount});`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};
