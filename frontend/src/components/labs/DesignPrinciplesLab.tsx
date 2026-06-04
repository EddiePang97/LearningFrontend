import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Puzzle, Split, Gem, ArrowRightLeft, Database, Settings2 } from 'lucide-react';

export const DesignPrinciplesLab = () => {
    const [view, setView] = useState<'srp' | 'dip'>('srp');

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Gem className="text-blue-400" />
                        Software Design Principles
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Solidify your architecture by following time-tested engineering rules.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => setView('srp')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'srp' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        SRP (单一職責)
                    </button>
                    <button
                        onClick={() => setView('dip')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'dip' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        DIP (依賴倒置)
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <AnimatePresence mode="wait">
                    {view === 'srp' ? (
                        <motion.div
                            key="srp"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex-1 flex flex-col gap-6"
                        >
                            <SRPLab />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dip"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex-1 flex flex-col gap-6"
                        >
                            <DIPLab />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const SRPLab = () => {
    const [isSplit, setIsSplit] = useState(false);

    return (
        <div className="flex flex-col gap-8 flex-1">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Split className="text-blue-400" />
                        Single Responsibility Principle
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">「一個模組應該只負責一件事情」</p>
                </div>
                <button
                    onClick={() => setIsSplit(!isSplit)}
                    className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${isSplit ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                    {isSplit ? 'Restore God Object' : 'Refactor Now'}
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center relative bg-black/40 rounded-3xl border border-white/5 p-6 md:p-12 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!isSplit ? (
                        <motion.div
                            key="god-object"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-48 h-48 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex flex-col items-center justify-center p-4 border border-white/20 shadow-2xl relative"
                        >
                            <Shield size={40} className="text-white/40 mb-3" />
                            <span className="text-[10px] font-black text-white uppercase text-center">UserProfileComponent</span>
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 rounded text-[8px] font-bold animate-bounce leading-none">
                                MESSY
                            </div>
                            <div className="mt-4 flex flex-col gap-1 w-full">
                                <div className="h-1 w-full bg-blue-400/30 rounded-full" />
                                <div className="h-1 w-3/4 bg-green-400/30 rounded-full" />
                                <div className="h-1 w-1/2 bg-orange-400/30 rounded-full" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="split-objects"
                            initial={{ opacity: 0, scale: 1.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex gap-4 md:gap-8 flex-wrap justify-center"
                        >
                            <motion.div whileHover={{ y: -5 }} className="w-32 h-32 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex flex-col items-center justify-center p-4">
                                <Activity size={24} className="text-blue-400 mb-2" />
                                <span className="text-[10px] font-bold text-blue-400 uppercase text-center leading-tight">UserView</span>
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} className="w-32 h-32 bg-green-500/10 border border-green-500/30 rounded-2xl flex flex-col items-center justify-center p-4">
                                <Database size={16} className="text-green-400 mb-2" />
                                <span className="text-[10px] font-bold text-green-400 uppercase text-center leading-tight">DataFetcher</span>
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} className="w-32 h-32 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex flex-col items-center justify-center p-4">
                                <Settings2 size={16} className="text-orange-400 mb-2" />
                                <span className="text-[10px] font-bold text-orange-400 uppercase text-center leading-tight">FormLogic</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Background Grid */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-xl border border-white/5">
                    <h4 className="text-[8px] text-gray-500 uppercase font-black mb-2">The Danger: God Object</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                        當一個組件包含 UI、數據請求、緩存邏輯、權限檢查、埋點統計時，它就成了一個難以維護的「上帝物件」。
                    </p>
                </div>
                <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                    <h4 className="text-[8px] text-blue-400 uppercase font-black mb-2">The Benefit: Granularity</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        解耦後的模組更容易被測試、復用和理解。改動其中的數據請求邏輯不會影響到 UI 的渲染穩定性。
                    </p>
                </div>
            </div>
        </div>
    );
};

const DIPLab = () => {
    const [injected, setInjected] = useState(false);

    return (
        <div className="flex flex-col gap-8 flex-1">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ArrowRightLeft className="text-blue-400" />
                        Dependency Inversion Principle
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">「依賴於抽象，而非依賴於具體實作」</p>
                </div>
                <button
                    onClick={() => setInjected(!injected)}
                    className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${injected ? 'bg-blue-500 text-white shadow-lg' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
                >
                    {injected ? 'Use Injected Wrapper' : 'Hard Instantiation'}
                </button>
            </div>

            <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center gap-8 md:gap-12 relative overflow-hidden">
                <div className="flex items-center gap-16 md:gap-32 z-10">
                    {/* Higher Level Module */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-blue-600 rounded-3xl flex flex-col items-center justify-center p-4 shadow-xl border border-blue-400/30">
                            <Puzzle size={32} className="text-white mb-2" />
                            <span className="text-[10px] font-black text-white text-center uppercase tracking-widest">Store</span>
                        </div>
                        <span className="text-[8px] text-blue-500 font-bold uppercase tracking-tight">High-Level Mod</span>
                    </div>

                    {/* Connection */}
                    <div className="relative flex flex-col items-center justify-center">
                        <motion.div
                            initial={false}
                            animate={{
                                width: injected ? 50 : 100,
                                backgroundColor: injected ? '#3b82f6' : '#ef4444'
                            }}
                            className="h-1 rounded-full relative"
                        >
                            {!injected && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-red-500 font-bold animate-pulse uppercase tracking-widest">Hard Link</div>}
                            {injected && <CircleInterface className="absolute -right-2 -top-1.5" />}
                        </motion.div>
                    </div>

                    {/* Lower Level Module */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-gray-800 rounded-3xl flex flex-col items-center justify-center p-4 border border-white/10 relative">
                            {injected && <CircleInterface className="absolute -left-2 top-1/2 -translate-y-1/2" />}
                            <Database size={32} className="text-gray-500 mb-2" />
                            <span className="text-[10px] font-black text-gray-500 text-center uppercase tracking-widest">LocalStorage</span>
                        </div>
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tight">Low-Level Mod</span>
                    </div>
                </div>

                <div className="max-w-md text-center">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        {injected
                            ? "✅ 你通過「抽象（介面）」連接了兩個模組。現在你可以輕鬆地把 LocalStorage 換成 IndexedDB 或 Firebase，而無需修改 Store 的代碼。"
                            : "❌ Store 內部直接 new LocalStorage()。這導致它們強耦合，當你想更換存儲引擎時，你必須打開 Store 進行破壞性修改。"}
                    </p>
                </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-xl border border-white/5 font-mono overflow-x-auto">
                <div className="text-[8px] text-gray-600 uppercase mb-2">Code Comparison</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="text-[8px] text-red-500 font-bold mb-1 uppercase">Coupled (Before)</div>
                        <pre className="text-[10px] text-red-400/50">
                            {`class Store {
  db = new LocalStorage();
  save() { this.db.write(); }
}`}
                        </pre>
                    </div>
                    <div>
                        <div className="text-[8px] text-blue-500 font-bold mb-1 uppercase">Injected (After)</div>
                        <pre className="text-[10px] text-blue-400/80">
                            {`class Store {
  constructor(db: Storage) {
    this.db = db;
  }
  save() { this.db.write(); }
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CircleInterface = ({ className }: { className?: string }) => (
    <div className={`w-4 h-4 rounded-full border-2 border-blue-500 bg-black flex items-center justify-center z-10 ${className}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
    </div>
);
