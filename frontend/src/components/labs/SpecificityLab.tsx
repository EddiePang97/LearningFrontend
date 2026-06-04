import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type SpecificityScore = [number, number, number, number];

export const SpecificityLab = () => {
    const [selector, setSelector] = useState('div.container #nav li:hover');

    const calculateSpecificity = (sel: string): SpecificityScore => {
        // Simplified parser for educational purposes
        const inline = 0;
        let id = 0;
        let cls = 0;
        let tag = 0;

        // Count IDs
        const ids = sel.match(/#[a-zA-Z0-9_-]+/g);
        if (ids) id = ids.length;

        // Count Classes/Attributes/Pseudo-classes
        // Matches .class, [attr], :hover (but checks to exclude pseudo-elements ::)
        const classes = sel.match(/\.[a-zA-Z0-9_-]+/g);
        if (classes) cls += classes.length;

        const attribs = sel.match(/\[[^\]]+\]/g);
        if (attribs) cls += attribs.length;

        const pseudos = sel.match(/:[a-zA-Z0-9_-]+/g);
        // Exclude :: (pseudo-elements) which are tags, and specific pseudo-classes that might be parsed differently in full spec
        // But for this simplified version we'll count single colons as classes
        if (pseudos) {
            // Filter out double colons if any slipped in (though regex is single colon)
            cls += pseudos.filter(p => !p.startsWith('::')).length;
        }

        // Count Elements/Pseudo-elements
        // detailed parsing is hard without a tokenizer, so we use a heuristic
        // Remove known parts and split by space/combinators to find tags
        const cleanSel = sel
            .replace(/#[a-zA-Z0-9_-]+/g, '')
            .replace(/\.[a-zA-Z0-9_-]+/g, '')
            .replace(/\[[^\]]+\]/g, '')
            .replace(/:[a-zA-Z0-9_-]+/g, '');

        const pseudoElements = sel.match(/::[a-zA-Z0-9_-]+/g);
        if (pseudoElements) tag += pseudoElements.length;

        // Split by combinators
        const tags = cleanSel.split(/[\s>+~]+/).filter(s => s.length > 0 && s !== '*');
        tag += tags.length;

        return [inline, id, cls, tag];
    };

    const presets = [
        '#nav',
        '.btn.primary',
        'div ul li',
        'a:hover',
        'body #content .data img:hover'
    ];
    const score = useMemo(() => calculateSpecificity(selector), [selector]);

    return (
        <div className="flex min-h-[480px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl md:min-h-[600px]">
            <div className="flex flex-col items-center justify-center border-b border-white/10 bg-white/5 p-4 py-10 md:p-8 md:py-16">
                <input
                    type="text"
                    value={selector}
                    onChange={(e) => setSelector(e.target.value)}
                    className="w-full max-w-2xl rounded-2xl border-2 border-accent-purple/50 bg-black/50 px-4 py-3 text-base text-white placeholder-white/20 shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-colors focus:border-accent-purple focus:outline-none md:px-6 md:py-4 md:text-3xl"
                    placeholder="Type a CSS selector..."
                />

                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {presets.map(p => (
                        <button
                            key={p}
                            onClick={() => setSelector(p)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-mono text-gray-300 transition-all border border-white/5"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center bg-[#0f0f11] p-4 md:p-8">
                <div className="grid w-full max-w-4xl grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
                    <ScoreCard label="Inline Style" score={score[0]} color="bg-pink-500" multiplier={1000} />
                    <ScoreCard label="ID" score={score[1]} color="bg-accent-purple" multiplier={100} />
                    <ScoreCard label="Class / Attribute" score={score[2]} color="bg-blue-500" multiplier={10} />
                    <ScoreCard label="Element" score={score[3]} color="bg-emerald-500" multiplier={1} />
                </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm">
                    Total Specificity Value: <span className="font-mono text-white font-bold text-lg ml-2">
                        {score[0]},{score[1]},{score[2]},{score[3]}
                    </span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                    (Note: This is a simplified parser for educational purposes. It handles standard selectors but might miss complex edge cases.)
                </p>
            </div>
        </div>
    );
};

const ScoreCard = ({ label, score, color, multiplier }: { label: string; score: number; color: string; multiplier: number }) => (
    <motion.div
        layout
        className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6"
    >
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${color}`} />
        <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 text-center h-8">{label}</span>
        <motion.div
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-clip-text text-5xl font-black text-transparent md:text-8xl ${color}`}
        >
            {score}
        </motion.div>
        <div className="mt-4 text-xs font-mono text-gray-600">
            Weight: {multiplier}
        </div>
    </motion.div>
);
