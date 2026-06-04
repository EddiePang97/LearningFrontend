import { useState } from 'react';
import { MousePointer2, Code2, Layers, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export const ComponentPatternsLab = () => {
    const [pattern, setPattern] = useState<'hoc' | 'render-props' | 'hooks'>('hooks');

    // --- Mock Implementation Logic ---
    // In a real app these would be separate files, but for the lab we mock the "usage" code view.

    const getCodeSnippet = (p: typeof pattern) => {
        switch (p) {
            case 'hoc':
                return `// 1. Higher-Order Component
const withHover = (Component) => (props) => {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} 
         onMouseLeave={() => setHover(false)}>
      <Component {...props} isHovered={hover} />
    </div>
  );
};

// Usage
const Button = ({ isHovered }) => (
  <button>{isHovered ? 'HOVERED' : 'Normal'}</button>
);
export default withHover(Button);`;
            case 'render-props':
                return `// 2. Render Props
const Hover = ({ render }) => {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} 
         onMouseLeave={() => setHover(false)}>
      {render(hover)}
    </div>
  );
};

// Usage
<Hover render={(isHovered) => (
  <button>{isHovered ? 'HOVERED' : 'Normal'}</button>
)} />`;
            case 'hooks':
                return `// 3. React Hooks (Modern)
const useHover = () => {
  const [hover, setHover] = useState(false);
  const bind = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };
  return [hover, bind];
};

// Usage
const Button = () => {
  const [isHovered, bind] = useHover();
  return (
    <button {...bind}>
      {isHovered ? 'HOVERED' : 'Normal'}
    </button>
  );
};`;
        }
    };

    return (
        <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:min-h-[600px] md:p-6">

            {/* Header / Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-900 rounded-xl border border-white/5 w-fit">
                <button
                    onClick={() => setPattern('hoc')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${pattern === 'hoc' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <Layers size={14} /> HOC
                </button>
                <button
                    onClick={() => setPattern('render-props')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${pattern === 'render-props' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <Code2 size={14} /> Render Props
                </button>
                <button
                    onClick={() => setPattern('hooks')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${pattern === 'hooks' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <Box size={14} /> Hooks
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">

                {/* Visual Demo Area */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 p-8 flex flex-col items-center justify-center flex-1 relative group">

                        <div className="absolute top-4 left-4 text-xs text-gray-500 uppercase tracking-widest font-bold">Interactive Demo</div>

                        {/* A generic interactive element that works for all patterns conceptually */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    w-40 h-40 rounded-3xl flex flex-col items-center justify-center gap-4 text-white font-bold text-xl shadow-2xl transition-all duration-300
                                    ${pattern === 'hoc' ? 'bg-orange-500 shadow-orange-500/20' :
                                        pattern === 'render-props' ? 'bg-pink-500 shadow-pink-500/20' :
                                            'bg-emerald-500 shadow-emerald-500/20'}
                                `}
                            >
                                <MousePointer2 size={32} className="group-hover:animate-bounce" />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">HOVERED!</span>
                            </motion.button>

                            {/* Wrapper visualizer for HOC/RenderProps */}
                            {pattern !== 'hooks' && (
                                <div className="absolute -inset-4 border-2 border-dashed border-white/20 rounded-[40px] pointer-events-none flex items-start justify-center pt-2">
                                    <span className="bg-black/80 text-[10px] text-gray-400 px-2 rounded">
                                        {pattern === 'hoc' ? 'Higher-Order Wrapper' : 'Render Prop Container'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-400">
                        <strong className="text-white block mb-1">Pros & Cons:</strong>
                        {pattern === 'hoc' && "HOCs can lead to 'Wrapper Hell' (deeply nested components in DevTools) and prop naming collisions."}
                        {pattern === 'render-props' && "Render Props solve naming collisions but can lead to 'Callback Hell' (nested functions in JSX)."}
                        {pattern === 'hooks' && "Hooks flatten the logic. No wrappers, no nesting, just function calls. This is the implementation used in modern React."}
                    </div>
                </div>

                {/* Code Comparison */}
                <div className="w-full md:w-1/2 bg-black rounded-2xl border border-white/10 p-4 overflow-hidden flex flex-col">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-2 flex items-center gap-2">
                        <Code2 size={14} /> Implementation Pattern
                    </div>
                    <pre className="text-xs font-mono text-gray-300 overflow-auto flex-1 custom-scrollbar">
                        <code dangerouslySetInnerHTML={{
                            __html: getCodeSnippet(pattern)
                                .replace(/const/g, '<span class="text-purple-400">const</span>')
                                .replace(/return/g, '<span class="text-purple-400">return</span>')
                                .replace(/useState/g, '<span class="text-yellow-300">useState</span>')
                                .replace(/\/\/.*/g, '<span class="text-gray-500">$&</span>')
                        }} />
                    </pre>
                </div>
            </div>
        </div>
    );
};
