import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Server, Send, Activity, Bell } from 'lucide-react';

interface ErrorLog {
    id: number;
    type: 'js-error' | 'promise-rejection' | 'resource-error';
    message: string;
    timestamp: number;
    stack?: string;
}

export const MonitoringLab = () => {
    const [errors, setErrors] = useState<ErrorLog[]>([]);
    const [sdkInstalled, setSdkInstalled] = useState(false);
    const [sending, setSending] = useState(false);
    const installSDK = () => {
        setSdkInstalled(true);
        addLog('js-error', '✅ SDK Installed:', 'Monitoring hooks registered');
    };

    const addLog = (type: ErrorLog['type'], message: string, stack?: string) => {
        const newError: ErrorLog = {
            id: Date.now(),
            type,
            message,
            timestamp: Date.now(),
            stack
        };
        setErrors(prev => [newError, ...prev].slice(0, 20));
    };

    const triggerJSError = () => {
        if (!sdkInstalled) return;
        addLog('js-error', 'TypeError: Cannot read property of undefined', 'at handleClick (app.js:42)');
    };

    const triggerPromiseRejection = () => {
        if (!sdkInstalled) return;
        addLog('promise-rejection', 'Unhandled Promise Rejection:', 'Network request failed');
    };

    const triggerResourceError = () => {
        if (!sdkInstalled) return;
        addLog('resource-error', 'Failed to load resource:', 'script.js (404 Not Found)');
    };

    const sendToServer = async () => {
        setSending(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSending(false);
        addLog('js-error', '📤 Errors sent to server', `Batch size: ${errors.length} errors`);
    };

    const reset = () => {
        setErrors([]);
        setSdkInstalled(false);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Activity className="text-red-400" />
                        Error Monitoring Lab
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        視覺化前端錯誤監控系統架構
                    </p>
                </div>
                <button onClick={reset} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10 text-xs">
                    Reset
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                {/* SDK Control */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black">SDK Control Panel</h4>

                    <div className={`p-6 rounded-2xl border transition-all ${sdkInstalled ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <Server size={24} className={sdkInstalled ? 'text-green-400' : 'text-gray-600'} />
                            <div>
                                <div className="text-xs font-bold text-white">Monitoring SDK</div>
                                <div className={`text-[10px] ${sdkInstalled ? 'text-green-400' : 'text-gray-500'}`}>
                                    {sdkInstalled ? 'Active' : 'Not Installed'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={installSDK}
                            disabled={sdkInstalled}
                            className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${sdkInstalled
                                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-400'
                                }`}
                        >
                            {sdkInstalled ? '✓ Installed' : 'Install SDK'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h5 className="text-[10px] text-gray-500 uppercase font-black">Trigger Errors</h5>
                        <button
                            onClick={triggerJSError}
                            disabled={!sdkInstalled}
                            className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold text-xs hover:bg-red-500/20 disabled:opacity-30 transition-all"
                        >
                            JS Error
                        </button>
                        <button
                            onClick={triggerPromiseRejection}
                            disabled={!sdkInstalled}
                            className="w-full py-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-bold text-xs hover:bg-orange-500/20 disabled:opacity-30 transition-all"
                        >
                            Promise Rejection
                        </button>
                        <button
                            onClick={triggerResourceError}
                            disabled={!sdkInstalled}
                            className="w-full py-3 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl font-bold text-xs hover:bg-yellow-500/20 disabled:opacity-30 transition-all"
                        >
                            Resource Error
                        </button>
                    </div>

                    <button
                        onClick={sendToServer}
                        disabled={!sdkInstalled || errors.length === 0 || sending}
                        className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold text-xs hover:bg-blue-400 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                    >
                        {sending ? <><Activity size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Send to Server</>}
                    </button>
                </div>

                {/* Error Logs */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
                            <Bell size={12} /> Error Logs ({errors.length})
                        </h4>
                        <div className="flex gap-2">
                            <div className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-[8px] font-bold">
                                {errors.filter(e => e.type === 'js-error').length} JS
                            </div>
                            <div className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded text-[8px] font-bold">
                                {errors.filter(e => e.type === 'promise-rejection').length} Promise
                            </div>
                            <div className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-[8px] font-bold">
                                {errors.filter(e => e.type === 'resource-error').length} Resource
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-4 overflow-y-auto max-h-[400px] custom-scrollbar">
                        <div className="space-y-2">
                            <AnimatePresence>
                                {errors.map(error => (
                                    <motion.div
                                        key={error.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`p-4 rounded-xl border ${error.type === 'js-error'
                                                ? 'bg-red-500/5 border-red-500/20'
                                                : error.type === 'promise-rejection'
                                                    ? 'bg-orange-500/5 border-orange-500/20'
                                                    : 'bg-yellow-500/5 border-yellow-500/20'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle size={14} className={
                                                    error.type === 'js-error' ? 'text-red-400' :
                                                        error.type === 'promise-rejection' ? 'text-orange-400' : 'text-yellow-400'
                                                } />
                                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${error.type === 'js-error' ? 'bg-red-500/20 text-red-400' :
                                                        error.type === 'promise-rejection' ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {error.type.replace('-', ' ')}
                                                </span>
                                            </div>
                                            <span className="text-[8px] text-gray-500 font-mono">
                                                {new Date(error.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-300 mb-1">{error.message}</div>
                                        {error.stack && (
                                            <div className="text-[10px] text-gray-600 font-mono mt-2 bg-black/40 p-2 rounded">
                                                {error.stack}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {errors.length === 0 && (
                                <div className="text-center text-gray-600 text-xs py-12">
                                    {sdkInstalled ? '觸發錯誤以查看日誌記錄' : '請先安裝 SDK'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            監控SDK通常使用 <span className="text-blue-400 font-mono">window.onerror</span> 捕獲 JS 錯誤，<span className="text-blue-400 font-mono">unhandledrejection</span> 事件捕獲 Promise 錯誤。數據會批量發送至服務器，並進行聚合分析與報警。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
