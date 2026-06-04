import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Share2, Layers, ShieldCheck, Play, ExternalLink, Cpu, Database, Layout } from 'lucide-react';

interface MicroApp {
    id: string;
    name: string;
    color: string;
    loaded: boolean;
    port: number;
    globalVar: string;
}

export const MicroFrontendLab = () => {
    const [apps, setApps] = useState<MicroApp[]>([
        { id: 'auth', name: 'Auth Service', color: 'bg-blue-500', loaded: true, port: 3001, globalVar: 'window.user' },
        { id: 'product', name: 'Product Catalog', color: 'bg-green-500', loaded: false, port: 3002, globalVar: 'window.cart' },
        { id: 'payment', name: 'Payment Gateway', color: 'bg-orange-500', loaded: false, port: 3003, globalVar: 'window.stripe' }
    ]);
    const [sandboxMode, setSandboxMode] = useState(true);
    const [view, setView] = useState<'federation' | 'sandbox'>('federation');

    const toggleApp = (id: string) => {
        setApps(apps.map(app =>
            app.id === id ? { ...app, loaded: !app.loaded } : app
        ));
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Layers className="text-green-400" />
                        Micro-Frontend Lab
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Decompose large applications into smaller, independent, yet unified pieces.
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => setView('federation')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'federation' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Federation
                    </button>
                    <button
                        onClick={() => setView('sandbox')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'sandbox' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        Sandbox
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <AnimatePresence mode="wait">
                    {view === 'federation' ? (
                        <motion.div
                            key="federation"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col gap-6"
                        >
                            <FederationLab apps={apps} toggleApp={toggleApp} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sandbox"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col gap-6"
                        >
                            <SandboxLab apps={apps} sandboxMode={sandboxMode} setSandboxMode={setSandboxMode} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const FederationLab = ({ apps, toggleApp }: { apps: MicroApp[], toggleApp: (id: string) => void }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Control Panel */}
            <div className="lg:col-span-4 space-y-4">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black mb-4 flex items-center gap-2">
                        <Cpu size={14} /> Remote Application Registry
                    </h4>
                    <div className="space-y-3">
                        {apps.map(app => (
                            <div
                                key={app.id}
                                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${app.loaded ? 'bg-white/5 border-green-500/30' : 'bg-transparent border-transparent grayscale opacity-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${app.color}`} />
                                    <div>
                                        <div className="text-xs font-bold">{app.name}</div>
                                        <div className="text-[8px] text-gray-500">Port: {app.port}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleApp(app.id)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${app.loaded ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500 text-white hover:bg-green-400'}`}
                                >
                                    {app.loaded ? 'UNLOAD' : 'LOAD'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl relative overflow-hidden">
                    <Share2 size={80} className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none" />
                    <h4 className="text-[10px] text-green-400 uppercase font-black mb-2 flex items-center gap-2 italic">Module Federation</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        組件不再是編譯時打包在一起，而是在運行時從不同的伺服器動態下載。
                    </p>
                </div>
            </div>

            {/* Visual Workspace */}
            <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-8 relative flex flex-col items-center justify-center">
                    <div className="absolute top-4 left-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Layout size={12} /> Host Application (Shell)
                    </div>

                    {/* Shell Container */}
                    <div className="w-full max-w-lg aspect-video border-2 border-dashed border-white/10 rounded-3xl p-6 flex flex-col gap-4 bg-white/[0.02]">
                        <div className="h-8 w-full bg-white/5 rounded-lg flex items-center px-4 justify-between">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-[8px] text-gray-500 font-mono">https://main-shell.app</div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <AnimatePresence>
                                {apps.filter(a => a.loaded).map(app => (
                                    <motion.div
                                        key={app.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className={`${app.color} rounded-2xl flex flex-col items-center justify-center p-4 shadow-xl shadow-black/40 relative group`}
                                    >
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink size={10} className="text-white/60" />
                                        </div>
                                        <Box size={24} className="text-white/80 mb-2" />
                                        <span className="text-[10px] font-black text-white text-center leading-tight uppercase tracking-widest">{app.name}</span>
                                        <span className="text-[8px] text-white/40 mt-1">REMOTE</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {apps.filter(a => a.loaded).length === 0 && (
                                <div className="col-span-2 flex flex-col items-center justify-center text-gray-700">
                                    <Database size={32} className="mb-2 opacity-20" />
                                    <span className="text-[10px] uppercase font-black tracking-widest">Waiting for remotes...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shared Libs Notification */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Shared: React v18.3</span>
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Shared: Design System</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SandboxLab = ({ apps, sandboxMode, setSandboxMode }: { apps: MicroApp[], sandboxMode: boolean, setSandboxMode: (m: boolean) => void }) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldCheck className={sandboxMode ? 'text-green-400' : 'text-red-400'} />
                        JS Runtime Sandbox
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">是否隔離子應用的全局變量？</p>
                </div>
                <button
                    onClick={() => setSandboxMode(!sandboxMode)}
                    className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${sandboxMode ? 'bg-green-500 text-white shadow-lg' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}
                >
                    {sandboxMode ? 'Sandbox Active' : 'Sandbox Disabled'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                    <div className="text-[10px] text-gray-500 uppercase font-black px-2">Global Environment (window)</div>
                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-6 overflow-hidden font-mono text-[10px]">
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-600">// window properties</div>
                            <div className="text-blue-400">location: "/"</div>
                            <div className="text-blue-400">navigator: "..."</div>
                            {apps.filter(a => a.loaded).map(app => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={sandboxMode ? 'text-gray-700 italic' : 'text-red-400 font-bold'}
                                >
                                    {app.globalVar}: {sandboxMode ? 'undefined (Isolated)' : '"dirty data!"'}
                                </motion.div>
                            ))}
                            {sandboxMode && (
                                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400/80 leading-relaxed">
                                    <Play size={10} className="inline mr-2" />
                                    Proxy 監聽中...子應用的修改已被重定向到微沙箱中。
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="text-[10px] text-gray-500 uppercase font-black px-2">Technical Implementation</div>
                    <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5 text-[10px] text-gray-400 leading-relaxed">
                        <p className="mb-4 font-bold text-gray-200 uppercase tracking-widest">How it works:</p>
                        <ul className="space-y-3 list-disc pl-4">
                            <li><span className="text-white">Snapshot Sandbox</span>: 在載入子應用前記錄 window 快照，卸載後恢復。</li>
                            <li><span className="text-white">Proxy Sandbox</span>: 使用 ES6 Proxy 代理 window 物件，每個子應用擁有獨立的「虛擬 window」。</li>
                            <li><span className="text-white">CSS Isolation</span>: 通過 Shadow DOM 或 動態命名空間（Scoped CSS）防止樣式汙染。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
