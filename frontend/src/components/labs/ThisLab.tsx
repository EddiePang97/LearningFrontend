import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, User, MousePointerClick, Sparkles } from 'lucide-react';
import { LabFrame } from './LabFrame';

export const ThisLab = () => {
    const [activeRule, setActiveRule] = useState<string | null>(null);

    const rules = [
        {
            id: 'default',
            title: 'Default Binding',
            code: 'showThis()',
            desc: 'Standalone function invocation.',
            result: 'Window (or undefined in strict mode)',
            color: 'text-gray-400'
        },
        {
            id: 'implicit',
            title: 'Implicit Binding',
            code: 'user.showThis()',
            desc: 'Invoked as a method of an object.',
            result: 'user { name: "Eddie" }',
            color: 'text-blue-400'
        },
        {
            id: 'explicit',
            title: 'Explicit Binding',
            code: 'showThis.call(ctx)',
            desc: 'Using call(), apply(), or bind().',
            result: 'ctx { id: 123 }',
            color: 'text-orange-400'
        },
        {
            id: 'new',
            title: 'New Binding',
            code: 'new showThis()',
            desc: 'Invoked with the "new" keyword.',
            result: 'New Instance {}',
            color: 'text-emerald-400'
        }
    ];

    return (
        <LabFrame
            className="md:min-h-[560px] md:p-8"
            icon={MousePointerClick}
            title='"this" Binding Rules'
        >
            <h3 className="mb-8 text-center text-xl font-bold uppercase tracking-widest text-white md:mb-12">
                "this" Binding Rules
            </h3>

            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                {/* Rules Selector */}
                <div className="flex flex-col gap-4">
                    {rules.map(rule => (
                        <button
                            key={rule.id}
                            onClick={() => setActiveRule(rule.id)}
                            className={`p-6 rounded-2xl border text-left transition-all duration-300 group ${activeRule === rule.id
                                ? 'bg-white/10 border-white/30'
                                : 'bg-black/40 border-white/5 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-bold ${activeRule === rule.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {rule.title}
                                </span>
                                <code className="text-xs bg-black/50 px-2 py-1 rounded text-gray-400 font-mono">
                                    {rule.code}
                                </code>
                            </div>
                            <p className="text-xs text-gray-500">{rule.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Visualizer */}
                <div className="relative flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/50 p-6 md:p-8">
                    <div className="absolute top-4 left-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
                        Context Visualizer
                    </div>

                    {activeRule ? (
                        <motion.div
                            key={activeRule}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="mb-6 text-accent-purple">
                                {activeRule === 'default' && <Globe size={64} />}
                                {activeRule === 'implicit' && <User size={64} />}
                                {activeRule === 'explicit' && <MousePointerClick size={64} />}
                                {activeRule === 'new' && <Sparkles size={64} />}
                            </div>
                            <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">this points to:</div>
                            <div className={`text-2xl font-bold ${rules.find(r => r.id === activeRule)?.color}`}>
                                {rules.find(r => r.id === activeRule)?.result}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center text-gray-600 italic">Select a rule to see where `this` points...</div>
                    )}
                </div>
            </div>
        </LabFrame>
    );
};
