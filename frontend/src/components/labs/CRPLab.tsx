import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Layers, Paintbrush, Zap, AlertTriangle, Eye, type LucideIcon } from 'lucide-react';

const PipelineStage = ({
    label,
    icon: Icon,
    active,
    completed,
    color
}: {
    label: string,
    icon: LucideIcon,
    active: boolean,
    completed: boolean,
    color: string
}) => (
    <div className={`
            flex flex-col items-center gap-3 transition-all duration-500
            ${active ? 'scale-110 opacity-100' : completed ? 'opacity-50' : 'opacity-30'}
        `}>
        <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-lg
                ${active ? `border-${color}-500 bg-${color}-500/20 shadow-${color}-500/30` : `border-gray-700 bg-gray-900`}
            `}>
            <Icon size={32} className={active ? `text-${color}-400` : 'text-gray-600'} />
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider ${active ? `text-${color}-400` : 'text-gray-600'}`}>
            {label}
        </span>
    </div>
);

export const CRPLab = () => {
    const [config, setConfig] = useState({
        asyncJS: false,
        inlineCSS: false,
        largeDOM: false
    });
    const [status, setStatus] = useState<'idle' | 'parsing' | 'layout' | 'painting' | 'done'>('idle');
    const [metrics, setMetrics] = useState({ fcp: 0, lcp: 0 });

    const runSimulation = () => {
        if (status !== 'idle' && status !== 'done') return;
        setStatus('parsing');

        // Base times
        let parseTime = 1500;
        if (config.asyncJS) parseTime -= 500;
        if (config.inlineCSS) parseTime -= 400;
        if (config.largeDOM) parseTime += 800;

        // Simulate CRP stages
        setTimeout(() => {
            setStatus('layout');
            setTimeout(() => {
                setStatus('painting');
                setTimeout(() => {
                    setStatus('done');
                    setMetrics({
                        fcp: Math.round(parseTime * 0.6),
                        lcp: Math.round(parseTime + 800)
                    });
                }, 1000);
            }, 1000);
        }, parseTime);
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">

            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-gray-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex gap-4">
                    <button
                        onClick={() => setConfig(p => ({ ...p, asyncJS: !p.asyncJS }))}
                        className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-xs transition-all ${config.asyncJS ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-gray-700 text-gray-500'}`}
                    >
                        <Zap size={14} /> Async Scripts
                    </button>
                    <button
                        onClick={() => setConfig(p => ({ ...p, inlineCSS: !p.inlineCSS }))}
                        className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-xs transition-all ${config.inlineCSS ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-gray-700 text-gray-500'}`}
                    >
                        <FileCode size={14} /> Inline CSS
                    </button>
                    <button
                        onClick={() => setConfig(p => ({ ...p, largeDOM: !p.largeDOM }))}
                        className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-xs transition-all ${config.largeDOM ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-gray-700 text-gray-500'}`}
                    >
                        <AlertTriangle size={14} /> Complex DOM
                    </button>
                </div>

                <button
                    onClick={runSimulation}
                    disabled={status !== 'idle' && status !== 'done'}
                    className={`
                        px-6 py-2 rounded-xl font-bold transition-all
                        ${status === 'idle' || status === 'done'
                            ? 'bg-accent-purple hover:bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    {status === 'idle' || status === 'done' ? 'Start Render' : 'Rendering...'}
                </button>
            </div>

            {/* Pipeline Visualization */}
            <div className="flex-1 flex flex-col justify-center gap-8 md:gap-12 relative">

                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10" />
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -z-10"
                    initial={{ width: '0%' }}
                    animate={{
                        width: status === 'idle' ? '0%' :
                            status === 'parsing' ? '33%' :
                                status === 'layout' ? '66%' : '100%'
                    }}
                    transition={{ duration: 0.5 }}
                />

                <div className="flex justify-between px-8 md:px-20 relative z-10">
                    <PipelineStage
                        label="Parse & Style"
                        icon={FileCode}
                        color="blue"
                        active={status === 'parsing'}
                        completed={status === 'layout' || status === 'painting' || status === 'done'}
                    />
                    <PipelineStage
                        label="Layout"
                        icon={Layers}
                        color="orange"
                        active={status === 'layout'}
                        completed={status === 'painting' || status === 'done'}
                    />
                    <PipelineStage
                        label="Paint & Composite"
                        icon={Paintbrush}
                        color="green"
                        active={status === 'painting'}
                        completed={status === 'done'}
                    />
                </div>

                {/* Metrics Overlay */}
                <AnimatePresence>
                    {status === 'done' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 mx-auto max-w-md w-full"
                        >
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <Eye size={16} className="text-accent-purple" />
                                Performance Results
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                    <div className="text-gray-500 text-xs mb-1">First Contentful Paint</div>
                                    <div className={`text-xl font-bold ${metrics.fcp < 1000 ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {metrics.fcp}ms
                                    </div>
                                </div>
                                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                    <div className="text-gray-500 text-xs mb-1">Largest Contentful Paint</div>
                                    <div className={`text-xl font-bold ${metrics.lcp < 2500 ? 'text-green-400' : 'text-red-400'}`}>
                                        {metrics.lcp}ms
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-xs text-gray-400 border-t border-white/5 pt-4">
                                {config.asyncJS && <div className="text-green-400">✓ Async scripts unblocked DOM parsing.</div>}
                                {config.inlineCSS && <div className="text-green-400">✓ Inline CSS reduced network latency.</div>}
                                {config.largeDOM && <div className="text-red-400">⚠ Large DOM increased layout calculation time.</div>}
                                {!config.asyncJS && !config.inlineCSS && !config.largeDOM && "Try enabling optimizations to see the impact!"}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend / Info */}
            <div className="text-center text-xs text-gray-600 mt-auto">
                Critical Rendering Path: The sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on the screen.
            </div>
        </div>
    );
};
