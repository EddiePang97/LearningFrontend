import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ShieldCheck, BadgeDollarSign, Lock } from 'lucide-react';

export const CSRFLab = () => {
    const [balance, setBalance] = useState(1000);
    const [attackStatus, setAttackStatus] = useState<'idle' | 'sending' | 'success' | 'blocked'>('idle');
    // Cookies state removed as it was unused (originally intending to display raw cookie string but decided against it)

    // Defenses
    const [sameSiteMode, setSameSiteMode] = useState<'None' | 'Lax' | 'Strict'>('None');
    const [csrfTokenEnabled, setCsrfTokenEnabled] = useState(false);

    // Logs
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

    const resetSimulation = () => {
        setAttackStatus('idle');
        setBalance(1000);
        setLogs([]);
    };

    const runAttack = () => {
        if (attackStatus !== 'idle') return;
        setAttackStatus('sending');
        addLog('Attacker: Sending POST /transfer request...');

        setTimeout(() => {
            // Check Defenses
            let blocked = false;
            let blockReason = '';

            // 1. Check SameSite Cookie
            // In reality, Cross-Site POST requests only send cookies if SameSite=None (and Secure).
            // Lax/Strict blocks cookies on cross-site POSTs suitable for CSRF.
            if (sameSiteMode !== 'None') {
                blocked = true;
                blockReason = `Cookie blocked by SameSite=${sameSiteMode}`;
            }

            // 2. Check CSRF Token
            // Attacker cannot read the token from the bank site, so they can't include it.
            if (!blocked && csrfTokenEnabled) {
                blocked = true;
                blockReason = 'Missing CSRF Token in request body';
            }

            if (blocked) {
                setAttackStatus('blocked');
                addLog(`Server: Request Rejected! ${blockReason}`);
            } else {
                setAttackStatus('success');
                setBalance(prev => prev - 100);
                addLog('Server: Transfer successful (-$100)');
            }
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            {/* Header */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Share2 className="text-purple-400" />
                    CSRF Attack Simulator
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                    Cross-Site Request Forgery: Tricking a browser into performing an unwanted action on a trusted site.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

                {/* 1. Malicious Site */}
                <div className="bg-red-900/10 border-2 border-red-500/30 rounded-xl p-4 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-br">
                        malicious-site.com
                    </div>
                    <div className="mt-6 flex-1 flex flex-col justify-center items-center text-center">
                        <h4 className="text-lg font-bold text-red-200 mb-2">WIN A FREE IPHONE!</h4>
                        <p className="text-xs text-red-300 mb-4">Click below to claim your prize now!</p>

                        <button
                            onClick={runAttack}
                            disabled={attackStatus !== 'idle'}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:grayscale animate-pulse"
                        >
                            {attackStatus === 'idle' ? 'CLAIM PRIZE!!!' : 'Processing...'}
                        </button>

                        <div className="mt-4 text-[10px] text-gray-500 bg-black/30 p-2 rounded w-full text-left">
                            <span className="text-purple-400">Hidden Form:</span><br />
                            &lt;form action="bank.com/transfer" method="POST"&gt;<br />
                            &nbsp;&nbsp;&lt;input name="to" value="hacker" /&gt;<br />
                            &nbsp;&nbsp;&lt;input name="amount" value="100" /&gt;<br />
                            &lt;/form&gt;
                        </div>
                    </div>
                </div>

                {/* 2. Middle: Browser & Defense Config */}
                <div className="flex flex-col gap-6">
                    {/* Visualizer Pipeline */}
                    <div className="flex-1 bg-black/20 rounded-xl border border-white/5 relative flex items-center justify-center">
                        {/* Connection Line */}
                        <div className="absolute w-full h-[2px] bg-gray-800" />

                        {/* Request Packet */}
                        <AnimatePresence>
                            {attackStatus === 'sending' && (
                                <motion.div
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 100, opacity: 1 }}
                                    exit={{ x: 150, opacity: 0 }}
                                    transition={{ duration: 1.5, ease: "linear" }}
                                    className="relative z-10 flex flex-col items-center"
                                >
                                    <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-gray-300">
                                        POST /transfer
                                    </div>
                                    {/* Cookie Attachment */}
                                    {sameSiteMode === 'None' && (
                                        <motion.div
                                            initial={{ y: -5, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="mt-1 bg-yellow-500 text-black text-[8px] font-bold px-1.5 rounded-full flex items-center gap-1 shadow-md"
                                        >
                                            <Lock size={8} /> Cookie
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Status Indicators */}
                        {attackStatus === 'blocked' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="z-10 bg-red-500 text-white font-bold p-2 rounded-full shadow-xl border-4 border-[#0f0f11]"
                            >
                                BLOCKED
                            </motion.div>
                        )}
                        {attackStatus === 'success' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="z-10 bg-green-500 text-white font-bold p-2 rounded-full shadow-xl border-4 border-[#0f0f11]"
                            >
                                SUCCESS
                            </motion.div>
                        )}
                    </div>

                    {/* Defenses Panel */}
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-2">
                            <ShieldCheck size={14} /> Server Defenses
                        </div>

                        <div className="space-y-4">
                            {/* SameSite Switch */}
                            <div>
                                <label className="text-xs text-gray-300 mb-1.5 block">Cookie SameSite Attribute</label>
                                <div className="flex gap-1 bg-black/40 p-1 rounded-lg">
                                    {(['None', 'Lax', 'Strict'] as const).map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setSameSiteMode(mode)}
                                            className={`flex-1 py-1.5 rounded text-[10px] font-bold transition-all ${sameSiteMode === mode
                                                ? 'bg-blue-600 text-white shadow'
                                                : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">
                                    {sameSiteMode === 'None' && "Browser sends cookies with cross-site POSTs. (Vulnerable)"}
                                    {sameSiteMode === 'Lax' && "Cookies BLOCKED on cross-site POSTs. (Safe)"}
                                    {sameSiteMode === 'Strict' && "Cookies ONLY sent for same-site requests. (Safest)"}
                                </p>
                            </div>

                            {/* CSRF Token Switch */}
                            <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
                                <span className="text-xs text-gray-300">Require Anti-CSRF Token</span>
                                <button
                                    onClick={() => setCsrfTokenEnabled(!csrfTokenEnabled)}
                                    className={`relative w-8 h-4 shrink-0 rounded-full transition-colors ${csrfTokenEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${csrfTokenEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Trusted Server */}
                <div className="bg-blue-900/10 border-2 border-blue-500/30 rounded-xl p-4 flex flex-col relative">
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-br">
                        bank.com
                    </div>

                    <div className="mt-8 mb-6 p-4 bg-white rounded-lg shadow-inner flex flex-col items-center gap-2">
                        <div className="text-xs text-gray-500 uppercase font-bold">Your Balance</div>
                        <div className="text-3xl font-bold text-gray-800 flex items-center gap-1">
                            <BadgeDollarSign size={24} className="text-green-600" />
                            {balance}
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-lg p-3 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-1">
                        <div className="text-xs text-gray-500 font-bold mb-2 pb-1 border-b border-gray-700">Server Logs:</div>
                        {logs.length === 0 && <span className="opacity-30 italic">No activity</span>}
                        {logs.map((log, i) => (
                            <div key={i} className={log.includes('Rejected') ? 'text-red-300' : 'text-green-300'}>
                                &gt; {log}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={resetSimulation}
                        className="mt-4 w-full py-2 border border-gray-600 text-gray-400 text-xs rounded hover:bg-gray-800"
                    >
                        Reset Simulation
                    </button>
                </div>

            </div>
        </div>
    );
};
