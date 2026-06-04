import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Eye, RefreshCw, Database } from 'lucide-react';

export const ReactivityLab = () => {
    const [reactiveData, setReactiveData] = useState({ count: 0, name: 'Vue' });
    const [effects, setEffects] = useState<string[]>([]);
    const [deps, setDeps] = useState<Set<string>>(new Set());

    const trackProperty = (key: string) => {
        setDeps(prev => new Set([...prev, key]));
        addEffect(`📌 Track: ${key}`);
    };

    const triggerUpdate = (key: string, value: string | number) => {
        if (deps.has(key)) {
            addEffect(`🔔 Trigger: ${key} = ${value}`);
            setEffects(prev => [...prev, `♻️ Re-render triggered!`]);
        }
    };

    const addEffect = (message: string) => {
        setEffects(prev => [...prev.slice(-9), message]);
    };

    const updateCount = () => {
        const newValue = reactiveData.count + 1;
        setReactiveData(prev => ({ ...prev, count: newValue }));
        trackProperty('count');
        triggerUpdate('count', newValue);
    };

    const updateName = () => {
        const newValue = reactiveData.name === 'Vue' ? 'React' : 'Vue';
        setReactiveData(prev => ({ ...prev, name: newValue }));
        trackProperty('name');
        triggerUpdate('name', newValue);
    };

    const reset = () => {
        setReactiveData({ count: 0, name: 'Vue' });
        setEffects([]);
        setDeps(new Set());
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Zap className="text-purple-400" />
                        Reactivity Lab
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        視覺化 Vue 3 Proxy 響應式系統
                    </p>
                </div>
                <button onClick={reset} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10 flex items-center gap-2 text-xs">
                    <RefreshCw size={14} /> Reset
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                {/* Reactive Data */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
                        <Database size={12} /> Reactive Data
                    </h4>
                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                            <div className="text-[10px] text-purple-400 font-bold mb-3 uppercase">Proxy Wrapper</div>
                            <pre className="text-sm text-white font-mono">
                                {`{
  count: ${reactiveData.count},
  name: "${reactiveData.name}"
}`}
                            </pre>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={updateCount}
                                className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold text-xs hover:bg-purple-400 transition-all"
                            >
                                count++
                            </button>
                            <button
                                onClick={updateName}
                                className="w-full py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl font-bold text-xs hover:bg-purple-500/30 transition-all"
                            >
                                Toggle name
                            </button>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl">
                            <div className="text-[8px] text-gray-500 uppercase font-bold mb-2">Tracked Dependencies</div>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(deps).map(dep => (
                                    <div key={dep} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-[10px] font-mono">
                                        {dep}
                                    </div>
                                ))}
                                {deps.size === 0 && <span className="text-[10px] text-gray-600">No dependencies tracked</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Effect Timeline */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
                        <Eye size={12} /> Effect Track & Trigger Timeline
                    </h4>
                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 overflow-y-auto max-h-[400px] custom-scrollbar">
                        <div className="space-y-2">
                            <AnimatePresence>
                                {effects.map((effect, idx) => (
                                    <motion.div
                                        key={`${effect}-${idx}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`p-3 rounded-xl border ${effect.includes('Track')
                                                ? 'bg-blue-500/10 border-blue-500/20'
                                                : effect.includes('Trigger')
                                                    ? 'bg-purple-500/10 border-purple-500/20'
                                                    : 'bg-green-500/10 border-green-500/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{effect.split(':')[0]}</span>
                                            <span className="text-xs text-gray-400 font-mono">{effect.split(':')[1]}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {effects.length === 0 && (
                                <div className="text-center text-gray-600 text-xs py-8">
                                    修改屬性以查看響應式追蹤過程
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            <span className="text-purple-400 font-bold">Proxy</span> 會攔截物件的 get/set 操作。當讀取屬性時（get），會自動「追蹤依賴」；當修改屬性時（set），會「觸發更新」通知所有依賴該屬性的 effect 重新執行。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
