import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, AlertTriangle, CheckCircle, Smartphone, User, Shield } from 'lucide-react';
import { LabFrame } from './LabFrame';

export const TypeScriptLab = () => {
    const [idType, setIdType] = useState<'number' | 'string'>('string');
    const [hasName, setHasName] = useState(true);
    const [extraProp, setExtraProp] = useState(false);

    // Parse and Validate
    const errors = useMemo(() => {
        const nextErrors: string[] = [];

        if (idType !== 'number') {
            nextErrors.push("Type 'string' is not assignable to type 'number'.");
        }

        if (!hasName) {
            nextErrors.push("Property 'name' is missing in type '{}' but required in type 'User'.");
        }

        if (extraProp) {
            nextErrors.push("Object literal may only specify known properties, and 'role' does not exist in type 'User'.");
        }

        return nextErrors;
    }, [extraProp, hasName, idType]);

    const isSuccess = errors.length === 0;

    return (
        <LabFrame
            className="relative gap-6 md:min-h-[600px] md:flex-row md:gap-8"
            icon={FileCode}
            title="TypeScript Playground"
        >

            {/* Code Editor Panel */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="group relative flex-grow overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-4 md:p-6">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-accent-purple opacity-30" />

                    {/* Interface Definition */}
                    <div className="text-blue-400 mb-6 font-mono">
                        <span className="text-accent-purple">interface</span> <span className="text-yellow-400">User</span> {'{'}
                        <div className="pl-4 text-gray-300">
                            id: <span className="text-blue-400">number</span>;
                        </div>
                        <div className="pl-4 text-gray-300">
                            name: <span className="text-blue-400">string</span>;
                        </div>
                        {'}'}
                    </div>

                    {/* Variable Definition */}
                    <div className="text-gray-300 font-mono">
                        <span className="text-accent-purple">const</span> user: <span className="text-yellow-400">User</span> = {'{'}

                        {/* Interactive Props: ID */}
                        <div className="pl-4 my-2 flex items-center gap-2">
                            <span className="text-gray-400">id: </span>
                            <button
                                onClick={() => setIdType(idType === 'number' ? 'string' : 'number')}
                                className={`px-2 py-0.5 rounded border transition-all ${idType === 'number'
                                        ? 'border-transparent text-emerald-400 bg-emerald-500/10'
                                        : 'bg-red-500/10 border-red-500/50 text-red-400 underline decoration-wavy'
                                    }`}
                            >
                                {idType === 'number' ? '123' : '"123"'}
                            </button>
                            <span className="text-gray-500">,</span>
                        </div>

                        {/* Interactive Props: Name */}
                        {hasName ? (
                            <div className="pl-4 my-2 flex items-center gap-2 group/line">
                                <span className="text-gray-400">name: </span>
                                <span className="text-orange-300">"Eddie"</span>
                                <span className="text-gray-500">,</span>
                                <button
                                    onClick={() => setHasName(false)}
                                    className="ml-2 text-[10px] text-gray-600 opacity-0 group-hover/line:opacity-100 hover:text-red-400 transition-all font-sans border border-gray-700 rounded px-1.5"
                                >
                                    remove
                                </button>
                            </div>
                        ) : (
                            <div className="pl-4 my-2">
                                <button
                                    onClick={() => setHasName(true)}
                                    className="text-gray-500 hover:text-green-400 text-xs flex items-center gap-1 transition-colors border border-dashed border-gray-700 hover:border-green-500/50 rounded px-2 py-1"
                                >
                                    + Add 'name'
                                </button>
                            </div>
                        )}

                        {/* Add Property Button */}
                        <div className="pl-4 my-2">
                            {extraProp ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-red-400 underline decoration-wavy decoration-red-500">role: "admin"</span>
                                    <button
                                        onClick={() => setExtraProp(false)}
                                        className="ml-2 text-[10px] text-gray-500 hover:text-red-400 font-sans border border-gray-700 rounded px-1.5"
                                    >
                                        fix
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setExtraProp(true)}
                                    className="text-gray-500 hover:text-green-400 text-xs flex items-center gap-1 transition-colors border border-dashed border-gray-700 hover:border-green-500/50 rounded px-2 py-1"
                                >
                                    + Add extra prop
                                </button>
                            )}
                        </div>

                        {'}'};
                    </div>
                </div>

                {/* Compiler Output */}
                <div className="h-32 overflow-y-auto rounded-2xl border border-white/10 bg-[#1e1e1e] p-4">
                    <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold border-b border-white/5 pb-2">
                        Compiler Output
                    </div>
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-emerald-400 text-xs flex items-center gap-2"
                            >
                                <CheckCircle size={14} />
                                <span>Build Success! No type errors found.</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="errors"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col gap-2"
                            >
                                {errors.map((err, i) => (
                                    <div key={i} className="text-red-400 text-xs flex items-start gap-2">
                                        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                                        <span>{err}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Application Visualizer (Right Panel) */}
            <div className="flex w-full flex-col gap-4 md:w-1/3">
                <div className="flex items-center gap-2 mb-2 text-gray-400 uppercase tracking-widest text-xs font-bold">
                    <Smartphone size={16} /> App Preview
                </div>

                <div className={`flex-grow rounded-3xl border-4 flex flex-col items-center justify-center p-6 relative transition-colors duration-500 ${isSuccess ? 'bg-gradient-to-b from-gray-900 to-black border-gray-800' : 'bg-red-500/5 border-red-500/20'
                    }`}>
                    {/* Floating Shield Status */}
                    <div className={`absolute top-4 right-4 p-2 rounded-full border transition-all duration-500 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}>
                        <Shield size={20} className={isSuccess ? '' : 'animate-pulse'} />
                    </div>

                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="app-success"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-4 text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-accent-purple p-1">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                        <User size={40} className="text-gray-300" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Eddie</h3>
                                    <p className="text-gray-500 text-xs">ID: 123</p>
                                </div>
                                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold mt-4">
                                    Running Perfectly
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="app-crash"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-4 text-center"
                            >
                                <div className="text-6xl mb-4">💥</div>
                                <h3 className="text-xl font-bold text-red-400">Runtime Error!</h3>
                                <p className="text-gray-500 text-xs max-w-[200px]">
                                    The application crashed because of a type mismatch that wasn't caught.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </LabFrame>
    );
};
