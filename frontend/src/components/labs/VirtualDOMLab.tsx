import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileJson, Layout, ArrowRight, RefreshCw, Plus, Minus, Type } from 'lucide-react';

interface VNode {
    id: string;
    type: string;
    props?: { text?: string };
    children?: VNode[];
}

export const VirtualDOMLab = () => {
    const [tree, setTree] = useState<VNode>({
        id: 'root',
        type: 'div',
        children: [
            { id: '1', type: 'h1', props: { text: 'Hello React' } },
            { id: '2', type: 'p', props: { text: 'Virtual DOM is fast.' } },
        ]
    });

    const [highlightId, setHighlightId] = useState<string | null>(null);
    const [version, setVersion] = useState(0);

    const handleUpdateText = () => {
        setHighlightId('1');
        setTimeout(() => {
            setTree(prev => ({
                ...prev,
                children: prev.children?.map(child =>
                    child.id === '1'
                        ? { ...child, props: { text: `Updated ${Math.floor(Math.random() * 100)}` } }
                        : child
                )
            }));
            setVersion(v => v + 1);
            setTimeout(() => setHighlightId(null), 1000);
        }, 500);
    };

    const handleAddNode = () => {
        const newNodeId = Math.random().toString(36).substr(2, 9);
        setTree(prev => ({
            ...prev,
            children: [...(prev.children || []), { id: newNodeId, type: 'div', props: { text: 'New Node' } }]
        }));
        setHighlightId(newNodeId);
        setVersion(v => v + 1);
        setTimeout(() => setHighlightId(null), 1000);
    };

    const handleRemoveNode = () => {
        if (!tree.children || tree.children.length <= 2) return;
        const [last] = [...tree.children].reverse();
        if (last.id === '1' || last.id === '2') return; // Don't remove initial nodes for demo stability

        setTree(prev => ({
            ...prev,
            children: prev.children?.slice(0, -1)
        }));
        setVersion(v => v + 1);
    };

    // Recursive render for VDOM visualizer
    const renderVNode = (node: VNode) => (
        <motion.div
            key={node.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 1,
                scale: 1,
                borderColor: highlightId === node.id ? '#a855f7' : 'rgba(255,255,255,0.1)',
                backgroundColor: highlightId === node.id ? 'rgba(168,85,247,0.1)' : 'transparent'
            }}
            className="border rounded-lg p-2 m-1 font-mono text-xs transition-colors duration-300"
        >
            <div className="flex items-center gap-2 text-blue-400">
                <span className="opacity-50 text-[10px]">&lt;</span>
                {node.type}
                <span className="opacity-50 text-[10px]">&gt;</span>
            </div>
            {node.props && (
                <div className="pl-4 text-gray-500">
                    {JSON.stringify(node.props).replace(/{|}|"/g, '')}
                </div>
            )}
            <div className="pl-4 border-l border-white/5 ml-1 mt-1">
                {node.children?.map(renderVNode)}
            </div>
        </motion.div>
    );

    // Render Real DOM from tree
    const renderRealDOM = (node: VNode) => {
        if (node.type === 'div') return (
            <div key={node.id} className="p-4 bg-gray-900 rounded border border-white/5 my-2">
                {node.children?.map(renderRealDOM)}
                {node.props?.text}
            </div>
        );
        if (node.type === 'h1') return <h1 key={node.id} className="text-xl font-bold text-white mb-2">{node.props?.text}</h1>;
        if (node.type === 'p') return <p key={node.id} className="text-gray-400">{node.props?.text}</p>;
        return null;
    };

    return (
        <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:min-h-[600px] md:p-6">
            <div className="flex flex-col md:flex-row gap-6 h-full">

                {/* VDOM Panel */}
                <div className="flex-1 flex flex-col min-h-0 bg-black/20 rounded-2xl border border-white/5">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-2 text-accent-purple font-bold">
                            <FileJson size={16} />
                            <span>Virtual DOM (JS Object)</span>
                        </div>
                        <div className="text-[10px] text-gray-500">Version: {version}</div>
                    </div>
                    <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                        {renderVNode(tree)}
                    </div>
                </div>

                {/* Diff Action Panel */}
                <div className="w-full md:w-32 flex flex-col justify-center items-center gap-4">
                    <motion.div
                        animate={{ opacity: highlightId ? 1 : 0.2 }}
                        className="flex flex-col items-center gap-2 text-accent-purple"
                    >
                        <RefreshCw size={24} className={highlightId ? 'animate-spin' : ''} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Diffing</span>
                    </motion.div>
                    <ArrowRight size={24} className="text-gray-600 rotate-90 md:rotate-0" />
                </div>

                {/* Real DOM Panel */}
                <div className="flex-1 flex flex-col min-h-0 bg-white/5 rounded-2xl border border-white/5">
                    <div className="p-4 border-b border-white/5 flex items-center gap-2 text-emerald-400 font-bold bg-white/5">
                        <Layout size={16} />
                        <span>Real DOM</span>
                    </div>
                    <div className="flex-1 overflow-auto p-6 flex flex-col justify-center relative">
                        {/* Flash overlay for updates */}
                        <AnimatePresence>
                            {highlightId && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-emerald-500/10 z-10 pointer-events-none"
                                />
                            )}
                        </AnimatePresence>
                        {renderRealDOM(tree)}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-gray-900/90 backdrop-blur border border-white/10 p-2 rounded-2xl shadow-xl">
                <button onClick={handleUpdateText} className="btn-icon group" title="Update Text">
                    <Type size={18} className="group-hover:text-amber-400 transition-colors" />
                </button>
                <button onClick={handleAddNode} className="btn-icon group" title="Add Node">
                    <Plus size={18} className="group-hover:text-emerald-400 transition-colors" />
                </button>
                <button onClick={handleRemoveNode} className="btn-icon group" title="Remove Node">
                    <Minus size={18} className="group-hover:text-red-400 transition-colors" />
                </button>
            </div>

            <style>{`
                .btn-icon {
                    @apply p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 transition-all;
                }
            `}</style>
        </div>
    );
};
