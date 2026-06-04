import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scope {
    name: string;
    vars: Record<string, string | number>;
    active: boolean;
    closed?: boolean;
}

interface Step {
    id: number;
    description: string;
    codeLine: number;
    scopes: Scope[];
    highlightClosure?: boolean;
}

export const ClosureLab = () => {
    const [step, setStep] = useState(0);

    const steps: Step[] = [
        {
            id: 0,
            description: "Initial State",
            codeLine: 0,
            scopes: [
                { name: "Global Scope", vars: { "counterCreator": "Function" }, active: true }
            ]
        },
        {
            id: 1,
            description: "Call counterCreator()",
            codeLine: 8,
            scopes: [
                { name: "Global Scope", vars: { "counterCreator": "Function" }, active: true },
                { name: "counterCreator() Scope", vars: { "count": 0 }, active: true }
            ]
        },
        {
            id: 2,
            description: "Return inner function",
            codeLine: 5,
            scopes: [
                { name: "Global Scope", vars: { "counterCreator": "Function", "myCounter": "Function" }, active: true },
                { name: "Closure (counterCreator)", vars: { "count": 0 }, active: false, closed: true } // Closed but retained
            ]
        },
        {
            id: 3,
            description: "Call myCounter() (1st time)",
            codeLine: 9,
            scopes: [
                { name: "Global Scope", vars: { "counterCreator": "Function", "myCounter": "Function" }, active: true },
                { name: "Closure (counterCreator)", vars: { "count": 0 }, active: false, closed: true },
                { name: "myCounter() Scope", vars: {}, active: true }
            ]
        },
        {
            id: 4,
            description: "Update count (Closure)",
            codeLine: 3,
            highlightClosure: true,
            scopes: [
                { name: "Global Scope", vars: { "counterCreator": "Function", "myCounter": "Function" }, active: true },
                { name: "Closure (counterCreator)", vars: { "count": 1 }, active: false, closed: true },
                { name: "myCounter() Scope", vars: {}, active: true }
            ]
        },
        {
            id: 5,
            description: "Call myCounter() (2nd time)",
            codeLine: 10,
            scopes: [
                { name: "Global Scope", vars: { "counterCreator": "Function", "myCounter": "Function" }, active: true },
                { name: "Closure (counterCreator)", vars: { "count": 1 }, active: false, closed: true },
                { name: "myCounter() Scope", vars: {}, active: true }
            ]
        },
        {
            id: 6,
            description: "Update count (Closure)",
            codeLine: 3,
            highlightClosure: true,
            scopes: [
                { name: "Global Scope", vars: { "counterCreator": "Function", "myCounter": "Function" }, active: true },
                { name: "Closure (counterCreator)", vars: { "count": 2 }, active: false, closed: true },
                { name: "myCounter() Scope", vars: {}, active: true }
            ]
        }
    ];

    const currentStep = steps[step];

    return (
        <div className="flex w-full flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:min-h-[600px] md:p-6 lg:flex-row lg:gap-8">
            {/* Code Panel */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="relative flex-grow overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-4 md:p-6">
                    <div className="absolute top-4 right-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Source Code</div>
                    <pre className="relative z-10 min-w-[280px] text-gray-300 leading-7">
                        {`function counterCreator() {
    let count = 0;
    return function() {
        count++;
        console.log(count);
    };
}

const myCounter = counterCreator();
myCounter(); // 1
myCounter(); // 2`}
                        {/* Highlights */}
                        <motion.div
                            className="absolute left-0 w-full bg-accent-purple/20 border-l-2 border-accent-purple"
                            initial={false}
                            animate={{
                                top: currentStep.codeLine === 0 ? '-100%' : `${(currentStep.codeLine - 1) * 28 + 24}px`,
                                height: '28px'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </pre>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={() => setStep(Math.max(0, step - 1))}
                        disabled={step === 0}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                        Previous
                    </button>
                    <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Step {step + 1}/{steps.length}</div>
                        <div className="font-bold text-white">{currentStep.description}</div>
                    </div>
                    <button
                        onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                        disabled={step === steps.length - 1}
                        className="px-4 py-2 rounded-xl bg-accent-purple hover:bg-accent-purple/80 text-white disabled:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Visualizer Panel */}
            <div className="relative flex flex-1 flex-col justify-end gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 md:p-8">
                <div className="absolute top-4 right-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Scope Chain</div>

                <AnimatePresence>
                    {currentStep.scopes.map((scope) => (
                        <motion.div
                            key={scope.name}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                borderColor: currentStep.highlightClosure && scope.name.includes("Closure") ? '#a855f7' : scope.closed ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'
                            }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className={`w-full p-4 rounded-xl border backdrop-blur-md relative ${scope.closed
                                ? 'bg-accent-purple/10 border-accent-purple/50'
                                : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <div className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${scope.closed ? 'text-accent-purple' : 'text-gray-400'
                                }`}>
                                {scope.closed && <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />}
                                {scope.name}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(scope.vars).map(([key, val]) => (
                                    <motion.div
                                        key={key}
                                        layoutId={`${scope.name}-${key}`} // Shared layout ID for persistence logic if complex
                                        className="px-3 py-1.5 bg-black/40 rounded-lg border border-white/5 text-xs flex gap-2 items-center"
                                    >
                                        <span className="text-gray-400">{key}:</span>
                                        <span className="text-emerald-400 font-bold">
                                            {typeof val === 'number' ? val : String(val)}
                                        </span>
                                    </motion.div>
                                ))}
                                {Object.keys(scope.vars).length === 0 && <span className="text-gray-600 italic text-xs">Empty</span>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
