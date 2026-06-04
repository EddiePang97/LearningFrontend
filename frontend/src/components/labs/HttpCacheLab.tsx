import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Monitor, Globe, FileJson, Clock, Database, RefreshCw, HardDrive } from 'lucide-react';

type CacheType = 'none' | 'strong' | 'negotiated';
type RequestState = 'idle' | 'sending' | 'processing' | 'receiving' | 'done';

export const HttpCacheLab = () => {
    const [requestState, setRequestState] = useState<RequestState>('idle');
    const [cacheType, setCacheType] = useState<CacheType>('none');
    const [logs, setLogs] = useState<string[]>([]);
    const [latency, setLatency] = useState(0);
    const [explanation, setExplanation] = useState<string>('Select a strategy to see how it works.');

    const simulateRequest = (type: CacheType) => {
        if (requestState !== 'idle' && requestState !== 'done') return;

        setRequestState('sending');
        setCacheType(type);
        setLogs([]);
        setLatency(0);

        const startTime = performance.now();

        // Simulation Logic
        if (type === 'strong') {
            setExplanation('Browser checks local "Disk Cache" first. Found valid "max-age", so no network request is needed.');
            setLogs(['Checking Cache-Control...', 'Hit: max-age=3600', 'Loading from Disk Cache']);
            setTimeout(() => {
                setRequestState('done');
                setLatency(Math.round(performance.now() - startTime));
                setExplanation('Content loaded instantly (0ms) from local cache! The server was never contacted.');
            }, 500); // Fast simulation
        } else {
            setExplanation('Browser sends a request packet to the server...');
            setLogs(['Request sent to server...']);
            // Network travel time
            setTimeout(() => {
                setRequestState('processing');
                setExplanation('Server is processing the request...');

                // Server processing
                setTimeout(() => {
                    setRequestState('receiving');

                    if (type === 'negotiated') {
                        setExplanation('Server compares ETag. Content has not changed, so it sends back a small "304 Not Modified" response (no body).');
                        setLogs(prev => [...prev, 'Server: ETag matched', 'Response: 304 Not Modified']);
                    } else {
                        setExplanation('Server generates the full content and sends back a "200 OK" response with the data.');
                        setLogs(prev => [...prev, 'Server: Generates content', 'Response: 200 OK']);
                    }

                    // Return travel
                    setTimeout(() => {
                        setRequestState('done');
                        setLatency(Math.round(performance.now() - startTime));
                        setExplanation('Response received by browser. Page renders.');
                    }, 800);

                }, 800);
            }, 800);
        }
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Database className="text-accent-purple" />
                    HTTP Caching Strategies
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                    Click the buttons below to visualize how different cache strategies affect network traffic and latency.
                </p>
            </div>

            {/* Live Explanation Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8 text-center min-h-[60px] flex items-center justify-center">
                <p className="text-blue-200 text-sm font-medium animate-pulse-slow">
                    {explanation}
                </p>
            </div>

            {/* Main Visualizer Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-8 relative px-4 py-8">

                {/* Client Side */}
                <div className="flex-1 flex flex-col items-center gap-4 relative z-10">
                    <div className="w-32 h-32 bg-gray-800 rounded-2xl border-2 border-blue-500/30 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.1)] relative">
                        <Monitor size={40} className="text-blue-400 mb-2" />
                        <span className="text-xs text-blue-200 font-bold tracking-widest uppercase">Client</span>

                        {/* Disk Cache Indicator */}
                        <div className={`absolute -right-12 top-0 bg-gray-900 border border-gray-700 p-2 rounded-lg flex flex-col items-center gap-1 transition-opacity duration-300 ${cacheType === 'strong' && requestState !== 'idle' ? 'opacity-100 scale-110 shadow-lg shadow-green-500/20 border-green-500' : 'opacity-30'}`}>
                            <HardDrive size={16} className={cacheType === 'strong' ? 'text-green-400' : 'text-gray-500'} />
                            <span className="text-[8px] uppercase">Disk Cache</span>
                        </div>
                    </div>
                </div>

                {/* Network / Middle Area */}
                <div className="flex-[2] relative flex items-center justify-center min-h-[100px]">
                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 rounded-full" />
                    <Globe size={24} className="text-gray-700 bg-[#0f0f11] z-10 px-1" />

                    {/* Animated Packet */}
                    <AnimatePresence>
                        {requestState !== 'idle' && requestState !== 'done' && cacheType !== 'strong' && (
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 z-20"
                                initial={{ left: '10%' }}
                                animate={{
                                    left: requestState === 'sending' ? '90%' :
                                        requestState === 'processing' ? '90%' : '10%'
                                }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <div className={`p-2 rounded-lg shadow-lg flex items-center gap-2 ${requestState === 'receiving'
                                        ? (cacheType === 'negotiated' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black')
                                        : 'bg-blue-500 text-white'
                                    }`}>
                                    <FileJson size={14} />
                                    <span className="text-[10px] font-bold whitespace-nowrap">
                                        {requestState === 'sending' ? 'GET /api' :
                                            requestState === 'processing' ? 'Processing...' :
                                                cacheType === 'negotiated' ? '304 Not Modified' : '200 OK'}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Server Side */}
                <div className="flex-1 flex flex-col items-center gap-4 relative z-10">
                    <div className={`w-32 h-32 bg-gray-800 rounded-2xl border-2 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-colors duration-300 ${requestState === 'processing' ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_50px_rgba(168,85,247,0.3)]' : 'border-purple-500/30'
                        }`}>
                        <Server size={40} className={`mb-2 transition-colors ${requestState === 'processing' ? 'text-purple-300' : 'text-purple-500'}`} />
                        <span className="text-xs text-purple-200 font-bold tracking-widest uppercase">Server</span>
                        {requestState === 'processing' && (
                            <div className="absolute top-2 right-2 flex gap-0.5">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-0" />
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100" />
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-200" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                {/* Console Log */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 h-40 overflow-y-auto font-mono text-xs">
                    <div className="text-gray-500 mb-2 sticky top-0 bg-transparent flex justify-between">
                        <span>Console Output</span>
                        {requestState === 'done' && <span className="text-green-400">{latency}ms</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-gray-300 border-l-2 border-gray-700 pl-2"
                            >
                                {log}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => simulateRequest('none')}
                        disabled={requestState !== 'idle' && requestState !== 'done'}
                        className="group relative flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 border border-white/5 hover:border-blue-500/50 rounded-xl transition-all disabled:opacity-50"
                    >
                        <div className="flex flex-col items-start">
                            <span className="font-bold text-blue-200">First Load / No Cache</span>
                            <span className="text-[10px] text-gray-400">Full 200 OK Response</span>
                        </div>
                        <RefreshCw size={16} className="text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                    </button>

                    <button
                        onClick={() => simulateRequest('strong')}
                        disabled={requestState !== 'idle' && requestState !== 'done'}
                        className="group relative flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 border border-white/5 hover:border-green-500/50 rounded-xl transition-all disabled:opacity-50"
                    >
                        <div className="flex flex-col items-start">
                            <span className="font-bold text-green-200">Strong Cache (Hit)</span>
                            <span className="text-[10px] text-gray-400">Cache-Control: max-age=3600</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-green-500 bg-green-900/40 px-2 py-0.5 rounded">0ms</span>
                            <HardDrive size={16} className="text-green-500" />
                        </div>
                    </button>

                    <button
                        onClick={() => simulateRequest('negotiated')}
                        disabled={requestState !== 'idle' && requestState !== 'done'}
                        className="group relative flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 border border-white/5 hover:border-yellow-500/50 rounded-xl transition-all disabled:opacity-50"
                    >
                        <div className="flex flex-col items-start">
                            <span className="font-bold text-yellow-200">Negotiated Cache (304)</span>
                            <span className="text-[10px] text-gray-400">If-None-Match / ETag</span>
                        </div>
                        <Clock size={16} className="text-yellow-500" />
                    </button>
                </div>
            </div>

        </div>
    );
};
