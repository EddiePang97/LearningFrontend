import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Columns, AppWindow, ReceiptText } from 'lucide-react';

export const LayoutLab: React.FC = () => {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    const sections = [
        { id: 'header', label: '<header>', desc: '页眉：通常包含 Logo、搜索框和用户信息。', color: 'bg-indigo-500/20', borderColor: 'border-indigo-500/50', icon: Layout },
        { id: 'nav', label: '<nav>', desc: '导航：包含指向站点其他部分的链接。', color: 'bg-emerald-500/20', borderColor: 'border-emerald-500/50', icon: Columns },
        { id: 'main', label: '<main>', desc: '主体：页面的核心内容，每页唯一。', color: 'bg-sky-500/20', borderColor: 'border-sky-500/50', icon: AppWindow },
        { id: 'footer', label: '<footer>', desc: '页脚：包含版权信息、友情链接和联系方式。', color: 'bg-rose-500/20', borderColor: 'border-rose-500/50', icon: ReceiptText },
    ];

    const handleSectionToggle = (sectionId: string) => {
        setHoveredSection(current => current === sectionId ? null : sectionId);
    };

    return (
        <div className="flex w-full min-h-[420px] flex-col gap-5 rounded-3xl border border-white/5 bg-black/20 p-4 md:min-h-[520px] md:p-6 overflow-hidden">
            <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Spatial Layout Lab</h4>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />)}
                </div>
            </div>

            <div className="relative flex min-h-[280px] flex-1 flex-col gap-2">
                {/* Header */}
                <motion.div
                    onClick={() => handleSectionToggle('header')}
                    onMouseEnter={() => setHoveredSection('header')}
                    onMouseLeave={() => setHoveredSection(null)}
                    className={`h-12 rounded-xl border-2 transition-all cursor-help flex items-center justify-center gap-2 ${hoveredSection === 'header' ? 'bg-indigo-500/20 border-indigo-500' : 'bg-white/5 border-white/10 opacity-60'
                        }`}
                >
                    <Layout size={14} className={hoveredSection === 'header' ? 'text-indigo-400' : 'text-gray-500'} />
                    <span className="text-[10px] font-bold tracking-wider">HEADER</span>
                </motion.div>

                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                    {/* Nav */}
                    <motion.div
                        onClick={() => handleSectionToggle('nav')}
                        onMouseEnter={() => setHoveredSection('nav')}
                        onMouseLeave={() => setHoveredSection(null)}
                        className={`h-16 rounded-xl border-2 transition-all cursor-help flex items-center justify-center gap-2 sm:h-auto sm:w-16 sm:flex-col ${hoveredSection === 'nav' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5 border-white/10 opacity-60'
                            }`}
                    >
                        <Columns size={14} className={hoveredSection === 'nav' ? 'text-emerald-400' : 'text-gray-500'} />
                        <span className="text-[8px] font-black sm:rotate-90">NAV</span>
                    </motion.div>

                    {/* Main */}
                    <motion.div
                        onClick={() => handleSectionToggle('main')}
                        onMouseEnter={() => setHoveredSection('main')}
                        onMouseLeave={() => setHoveredSection(null)}
                        className={`flex-grow rounded-xl border-2 transition-all cursor-help flex flex-col items-center justify-center gap-3 relative overflow-hidden ${hoveredSection === 'main' ? 'bg-sky-500/20 border-sky-500' : 'bg-white/5 border-white/10 opacity-60'
                            }`}
                    >
                        <AppWindow size={20} className={hoveredSection === 'main' ? 'text-sky-400' : 'text-gray-500'} />
                        <span className="text-[10px] font-bold">MAIN CONTENT</span>

                        {/* Fake Content lines */}
                        <div className="w-1/2 space-y-1 opacity-20">
                            <div className="h-1 bg-current rounded-full" />
                            <div className="h-1 bg-current rounded-full w-3/4" />
                            <div className="h-1 bg-current rounded-full w-1/2" />
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                    onClick={() => handleSectionToggle('footer')}
                    onMouseEnter={() => setHoveredSection('footer')}
                    onMouseLeave={() => setHoveredSection(null)}
                    className={`h-10 rounded-xl border-2 transition-all cursor-help flex items-center justify-center gap-2 ${hoveredSection === 'footer' ? 'bg-rose-500/20 border-rose-500' : 'bg-white/5 border-white/10 opacity-60'
                        }`}
                >
                    <ReceiptText size={14} className={hoveredSection === 'footer' ? 'text-rose-400' : 'text-gray-500'} />
                    <span className="text-[10px] font-bold tracking-wider">FOOTER</span>
                </motion.div>
            </div>

            <div className="h-12 flex items-center justify-center text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={hoveredSection || 'hint'}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[11px] text-gray-400 px-4"
                    >
                        {hoveredSection ? (
                            <span className="text-white font-medium">
                                {sections.find(s => s.id === hoveredSection)?.desc}
                            </span>
                        ) : (
                            "点击、触摸或悬停于布局块上以探索语义化结构。"
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
