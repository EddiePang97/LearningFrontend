import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Eye, CheckCircle, ArrowRight, User, Terminal, Server, Layers, Play } from 'lucide-react';

export const MiddlewareLab = () => {
    const [step, setStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [forgetNext, setForgetNext] = useState(false);
    const [isError, setIsError] = useState(false);

    // Config
    const [hasAuth, setHasAuth] = useState(true);
    const [hasLogging, setHasLogging] = useState(true);

    const steps = [
        {
            id: 'request',
            name: 'HTTP Request',
            icon: <User size={14} />,
            type: 'entry',
            code: `// Client sends request\nfetch('/api/data');`
        },
        ...(hasLogging ? [{
            id: 'logging-in',
            name: 'Logger (In)',
            icon: <Eye size={14} />,
            type: 'middleware',
            code: `app.use((req, res, next) => {\n  console.log('Incoming!');\n  next(); // Go deeper\n});`
        }] : []),
        ...(hasAuth ? [{
            id: 'auth-in',
            name: 'Auth Check',
            icon: <Shield size={14} />,
            type: 'middleware',
            code: `app.use((req, res, next) => {\n  if (!req.user) throw Error();\n  next();\n});`
        }] : []),
        {
            id: 'handler',
            name: 'Route Handler',
            icon: <Terminal size={14} />,
            type: 'handler',
            code: `app.get('/', (req, res) => {\n  res.send({ status: 'OK' });\n  // No next() here!\n});`
        },
        ...(isError ? [{
            id: 'error-handler',
            name: 'Error Handler',
            icon: <Shield size={14} className="text-red-500" />,
            type: 'middleware',
            code: `app.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).send('Fail');\n});`
        }] : []),
        ...(hasAuth ? [{
            id: 'auth-out',
            name: 'Auth Logout',
            icon: <Key size={14} />,
            type: 'middleware',
            code: `// Logic after handler (rare)\nconsole.log('Finished Auth');\nnext();`
        }] : []),
        ...(hasLogging ? [{
            id: 'logging-out',
            name: 'Logger (Out)',
            icon: <CheckCircle size={14} />,
            type: 'middleware',
            code: `// Logging response time\nconsole.log('Request Done');\nnext();`
        }] : []),
        {
            id: 'response',
            name: 'HTTP Response',
            icon: <Server size={14} />,
            type: 'exit',
            code: `// Client receives data\n{ "status": "${isError ? 'Error' : 'OK'}" }`
        },
    ];

    const nextStep = () => {
        if (forgetNext && steps[step].type === 'middleware' && !steps[step].id.includes('out')) {
            return;
        }

        // If error thrown in Auth Check
        if (isError && steps[step].id === 'auth-in') {
            const errorIdx = steps.findIndex(s => s.id === 'error-handler');
            setStep(errorIdx);
            return;
        }

        if (step < steps.length - 1) {
            setStep(prev => prev + 1);
        } else {
            reset();
        }
    };

    const reset = () => {
        setStep(0);
        setIsActive(false);
    };

    const start = () => {
        setIsActive(true);
        setStep(0);
    };

    const currentData = steps[step];

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Layers className="text-purple-400" />
                        Express Middleware: Onion Model
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                        Visualizing the request/response lifecycle and the power of <code className="text-blue-400">next()</code>.
                    </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <button
                        onClick={() => { setForgetNext(!forgetNext); setIsError(false); }}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${forgetNext ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-gray-800 border-white/10 text-gray-500'}`}
                    >
                        {forgetNext ? '⚠️ FORGET NEXT() ON' : 'MISSING NEXT() OFF'}
                    </button>
                    <button
                        onClick={() => { setIsError(!isError); setForgetNext(false); }}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${isError ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-gray-800 border-white/10 text-gray-500'}`}
                    >
                        {isError ? '🚨 SIMULATE ERROR ON' : 'ERROR HANDLING OFF'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                {/* 1. Stack Config */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                        <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-4">Pipeline Config</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-blue-300">Logging Layer</span>
                                <input type="checkbox" checked={hasLogging} onChange={() => setHasLogging(!hasLogging)} className="w-4 h-4 accent-blue-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-red-300">Auth Layer</span>
                                <input type="checkbox" checked={hasAuth} onChange={() => { if (!isError) setHasAuth(!hasAuth); else setHasAuth(true); }} className="w-4 h-4 accent-red-500" disabled={isError} />
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`bg-black/60 p-4 rounded-xl border min-h-[150px] relative overflow-hidden ${currentData.id === 'error-handler' ? 'border-red-500/50' : 'border-white/5'}`}
                        >
                            <div className="text-[8px] text-gray-600 mb-2 uppercase font-bold tracking-widest">Execution Code</div>
                            <pre className="text-[10px] text-gray-400 whitespace-pre-wrap leading-relaxed">
                                {currentData.code.split('\n').map((line, i) => (
                                    <div key={i} className={line.includes('next(') || line.includes('next()') ? 'text-blue-400 font-bold' : ''}>
                                        {line}
                                    </div>
                                ))}
                            </pre>
                            {forgetNext && currentData.type === 'middleware' && !currentData.id.includes('out') && (
                                <div className="absolute inset-0 bg-red-900/20 backdrop-blur-[1px] flex items-center justify-center p-4 text-center">
                                    <div className="text-[10px] text-red-400 font-bold bg-black/80 px-2 py-1 rounded border border-red-500/50">
                                        Hanging... next() not called!
                                    </div>
                                </div>
                            )}
                            {isError && currentData.id === 'auth-in' && (
                                <div className="absolute inset-0 bg-orange-900/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                                    <div className="text-[10px] text-orange-400 font-bold bg-black/80 px-2 py-1 rounded border border-orange-500/50">
                                        ERROR THROWN!
                                    </div>
                                    <div className="text-[8px] text-orange-200/50 mt-1 uppercase">Jumping to error handler</div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {!isActive ? (
                        <button
                            onClick={start}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl shadow-xl hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Play size={18} fill="currentColor" />
                            Send Request
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            disabled={forgetNext && currentData.type === 'middleware' && !currentData.id.includes('out')}
                            className={`w-full py-4 transition-all rounded-xl shadow-xl font-bold flex items-center justify-center gap-2 ${isError && currentData.id === 'auth-in' ? 'bg-orange-600 hover:bg-orange-500 text-white animate-bounce' :
                                    'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-800 disabled:text-gray-600'
                                }`}
                        >
                            {isError && currentData.id === 'auth-in' ? 'Trigger Error Handler' : 'Call next()'}
                            <ArrowRight size={18} />
                        </button>
                    )}
                </div>

                {/* 2. Onion Visualization */}
                <div className="lg:col-span-9 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center p-12">
                    {/* Ring Backgrounds */}
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full border border-white/[0.03] pointer-events-none"
                            style={{
                                width: `${200 + (i * 120)}px`,
                                height: `${200 + (i * 120)}px`,
                                background: i === 2 ? 'radial-gradient(circle, transparent 60%, rgba(255,255,255,0.01) 100%)' : ''
                            }}
                        />
                    ))}

                    {/* Middlewares nodes mapping to circles */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {steps.map((s, idx) => {
                            if (s.type === 'entry' || s.type === 'exit') return null;
                            const isHandler = s.type === 'handler';
                            const isOut = s.id.includes('out');
                            const isErrorHandler = s.id === 'error-handler';

                            return (
                                <motion.div
                                    key={s.id}
                                    className={`absolute flex items-center justify-center rounded-full border transition-all duration-500 ${step === idx ? (isErrorHandler ? 'bg-red-500/20 border-red-500 ring-4 ring-red-500/20' : 'bg-white/20 border-white ring-4 ring-white/10') + ' scale-110 z-10' : 'bg-gray-800/40 border-white/5 scale-100 opacity-40'}`}
                                    style={{
                                        width: isHandler ? '80px' : '40px',
                                        height: isHandler ? '80px' : '40px',
                                        x: isHandler ? 0 : (isOut ? 100 + (idx * 10) : -100 - (idx * 10)),
                                        y: isHandler ? 0 : (isOut ? 30 : isErrorHandler ? 80 : -30)
                                    }}
                                >
                                    {s.icon}
                                    {isHandler && <div className="absolute -bottom-6 text-[8px] font-bold text-gray-500">HANDLER</div>}
                                    {isErrorHandler && <div className="absolute -bottom-6 text-[8px] font-bold text-red-500 whitespace-nowrap">ERROR CATCHER</div>}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* The "Request" Particle */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                key="particle"
                                className="absolute z-20"
                                animate={{
                                    x: currentData.type === 'entry' ? -350 :
                                        currentData.type === 'exit' ? 350 :
                                            currentData.type === 'handler' ? 0 :
                                                currentData.id === 'error-handler' ? 50 :
                                                    currentData.id.includes('in') ? -100 - (step * 20) :
                                                        100 + ((steps.length - step) * 20),
                                    y: currentData.type === 'handler' ? 0 :
                                        currentData.id === 'error-handler' ? 80 :
                                            currentData.id.includes('in') ? -30 : 30,
                                    scale: currentData.type === 'handler' ? 1.5 : 1
                                }}
                                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            >
                                <div className="relative">
                                    <div className={`w-6 h-6 rounded-full shadow-2xl border-2 border-white transition-colors duration-500 ${currentData.id === 'error-handler' ? 'bg-red-500 shadow-red-500/80' : 'bg-blue-500 shadow-blue-500/80'}`} />
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className={`absolute inset-0 rounded-full ${currentData.id === 'error-handler' ? 'bg-red-400' : 'bg-blue-400'}`}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Progress Info */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                        <div className="flex gap-2">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= step ? (currentData.id === 'error-handler' ? 'bg-red-500' : 'bg-blue-500') + ' scale-125' : 'bg-gray-800'}`}
                                />
                            ))}
                        </div>
                        <div className="text-right">
                            <div className="text-[8px] text-gray-500 uppercase font-black">Current Flow</div>
                            <div className={`text-xs font-bold uppercase italic transition-colors ${currentData.id === 'error-handler' ? 'text-red-500' : 'text-white'}`}>
                                {currentData.name}
                            </div>
                        </div>
                    </div>

                    {!isActive && (
                        <div className="text-center space-y-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto animate-pulse">
                                    <Layers size={40} className="text-blue-400" />
                                </div>
                                {forgetNext && <Shield size={16} className="absolute top-0 right-1/4 text-red-500 animate-bounce" />}
                            </div>
                            <div className="text-gray-500 text-[10px] animate-bounce">Ready to process request...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

