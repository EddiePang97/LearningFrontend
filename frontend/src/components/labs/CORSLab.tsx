import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, ArrowRight, ShieldCheck, ShieldAlert, FileCode } from 'lucide-react';

type RequestMethod = 'GET' | 'PUT';
type RequestStatus = 'idle' | 'preflight' | 'pending' | 'success' | 'blocked';

export const CORSLab = () => {
    const [method, setMethod] = useState<RequestMethod>('GET');
    const [serverAllowOrigin, setServerAllowOrigin] = useState(true);
    const [status, setStatus] = useState<RequestStatus>('idle');
    const [logs, setLogs] = useState<string[]>([]);

    const origin = 'http://localhost:3000';
    const api = 'https://api.example.com';

    const runSimulation = () => {
        if (status !== 'idle' && status !== 'success' && status !== 'blocked') return;

        setLogs([]);
        setStatus('idle');

        // Step 1: Check if Preflight needed
        const isPreflightNeeded = method === 'PUT'; // PUT is not a "Simple Request"

        const addToLog = (msg: string) => setLogs(prev => [...prev, msg]);

        if (isPreflightNeeded) {
            addToLog(`Browser detects non-simple method (${method}).`);
            addToLog('Initiating Preflight (OPTIONS) check...');
            setStatus('preflight');

            setTimeout(() => {
                if (serverAllowOrigin) {
                    addToLog('Server response: 204 No Content');
                    addToLog(`Header: Access-Control-Allow-Origin: ${origin}`);
                    addToLog('Browser: Preflight Passed ✅');
                    // Proceed to actual request
                    startActualRequest();
                } else {
                    addToLog('Server response: 403 Forbidden (or missing header)');
                    addToLog('Browser: Preflight Failed ❌');
                    addToLog(`Error: CORS policy blocked access.`);
                    setStatus('blocked');
                }
            }, 1000);
        } else {
            addToLog(`GET is a Simple Request.`);
            addToLog(`Sending request directly...`);
            startActualRequest();
        }

        function startActualRequest() {
            setStatus('pending');
            setTimeout(() => {
                // If it's a simple request, we still check headers on response
                // But for simulation simplicity, if preflight passed (or skipped), we verify origin match again
                if (serverAllowOrigin) {
                    addToLog('Server: Processing request...');
                    setTimeout(() => {
                        addToLog('Server sent response: 200 OK');
                        addToLog(`Header: Access-Control-Allow-Origin: ${origin}`);
                        addToLog('Browser: Response received and exposed to JS ✅');
                        setStatus('success');
                    }, 800);
                } else {
                    // Unique case: Simple requests ARE sent, but response is hidden if header missing
                    addToLog('Server sent response: 200 OK');
                    addToLog('Server missing Allow-Origin header!');
                    addToLog('Browser: Blocked JS from reading the response ❌');
                    setStatus('blocked');
                }
            }, isPreflightNeeded ? 800 : 1000);
        }
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            {/* Header */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Globe className="text-blue-400" />
                    CORS Simulator
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                    Visualizing <strong>Cross-Origin Resource Sharing</strong> policies between Localhost and a Remote API.
                </p>
            </div>

            {/* Config Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2">
                        <FileCode size={14} /> Client Request (Fetch)
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMethod('GET')}
                            className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${method === 'GET' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-800 border-transparent text-gray-500 hover:bg-gray-700'
                                }`}
                        >
                            GET (Simple)
                        </button>
                        <button
                            onClick={() => setMethod('PUT')}
                            className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${method === 'PUT' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-gray-800 border-transparent text-gray-500 hover:bg-gray-700'
                                }`}
                        >
                            PUT (Preflight)
                        </button>
                    </div>
                    <div className="mt-4 p-3 bg-black/40 rounded border border-gray-800 text-gray-300 text-xs">
                        fetch('{api}', {'{'} <br />
                        &nbsp;&nbsp;method: '<span className={method === 'GET' ? 'text-blue-400' : 'text-purple-400'}>{method}</span>'<br />
                        {'}'});
                    </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2">
                        <Server size={14} /> Server Config (Remote)
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700">
                        <span className="text-gray-300 text-xs">Access-Control-Allow-Origin</span>
                        <button
                            onClick={() => setServerAllowOrigin(!serverAllowOrigin)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${serverAllowOrigin ? 'bg-green-500' : 'bg-red-500'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${serverAllowOrigin ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 text-center">
                        {serverAllowOrigin
                            ? <span className="text-green-400 flex items-center justify-center gap-1"><ShieldCheck size={12} /> Server allows {origin}</span>
                            : <span className="text-red-400 flex items-center justify-center gap-1"><ShieldAlert size={12} /> Server blocks external origins</span>
                        }
                    </div>
                </div>
            </div>

            {/* Visual Flow */}
            <div className="flex-1 relative flex items-center justify-between px-4 md:px-12 py-8 bg-black/20 rounded-2xl border border-white/5 mb-6">

                {/* Localhost */}
                <div className="flex flex-col items-center gap-2 z-10">
                    <div className="w-16 h-16 rounded-xl bg-blue-900/20 border border-blue-500 flex items-center justify-center">
                        <Globe className="text-blue-500" />
                    </div>
                    <span className="text-xs text-blue-200 font-bold">Localhost</span>
                </div>

                {/* Animation Area */}
                <div className="flex-1 h-[2px] bg-gray-800 relative mx-4">
                    <AnimatePresence>
                        {(status === 'preflight') && (
                            <motion.div
                                key="preflight"
                                initial={{ left: '0%', opacity: 1 }}
                                animate={{ left: ['0%', '100%', '0%'] }}
                                transition={{ duration: 1, times: [0, 0.5, 1] }}
                                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-[8px] font-bold text-black border-2 border-yellow-200 z-20 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                            >
                                OPT
                            </motion.div>
                        )}
                        {(status === 'pending') && (
                            <motion.div
                                key="request"
                                initial={{ left: '0%' }}
                                animate={{ left: serverAllowOrigin ? ['0%', '100%', '0%'] : ['0%', '100%'] }}
                                transition={{ duration: serverAllowOrigin ? 1 : 0.5 }}
                                className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2 z-20 shadow-lg ${method === 'PUT' ? 'bg-purple-600 border-purple-300' : 'bg-blue-600 border-blue-300'
                                    }`}
                            >
                                {method}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Blocked Indicator */}
                    {status === 'blocked' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl border border-red-400"
                        >
                            BLOCKED
                        </motion.div>
                    )}
                </div>

                {/* API Server */}
                <div className="flex flex-col items-center gap-2 z-10">
                    <div className={`w-16 h-16 rounded-xl border flex items-center justify-center transition-colors ${serverAllowOrigin ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                        <Server className={serverAllowOrigin ? 'text-green-500' : 'text-red-500'} />
                    </div>
                    <span className="text-xs text-gray-400 font-bold">API Server</span>
                </div>
            </div>

            {/* Logs & Controls */}
            <div className="flex flex-col items-center">
                <button
                    onClick={runSimulation}
                    disabled={status !== 'idle' && status !== 'success' && status !== 'blocked'}
                    className="mb-4 px-8 py-2 bg-white text-black font-bold rounded-lg hover:scale-105 active:scale-95 transition-all text-xs flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                >
                    Sending Request <ArrowRight size={14} />
                </button>

                <div className="w-full bg-black/60 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[10px] text-gray-400 border border-white/5 space-y-1">
                    {logs.length === 0 && <span className="opacity-50">Waiting for simulation...</span>}
                    {logs.map((log, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            <span className={log.includes('❌') || log.includes('blocked') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : 'text-gray-300'}>
                                {log}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
