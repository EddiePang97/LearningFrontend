import React, { useEffect, useRef, useState } from 'react';
import { FileText, CheckCircle2, Trophy } from 'lucide-react';
import type { LearningStage } from '../constants/learningPath';

interface ModuleListProps {
    activeStage: LearningStage;
    activeLessonIndex: number;
    setActiveLessonIndex: (index: number) => void;
    completedLessons: Record<string, boolean>;
    toggleLessonComplete: (id: string) => void;
    startQuiz: () => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({
    activeStage,
    activeLessonIndex,
    setActiveLessonIndex,
    completedLessons,
    toggleLessonComplete,
    startQuiz
}) => {
    const [isAtTop, setIsAtTop] = useState(true);
    const [dockMode, setDockMode] = useState<'static' | 'fixed'>('static');
    const [dockMetrics, setDockMetrics] = useState({ width: 0, height: 0 });
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateDockState = () => {
            setIsAtTop(window.scrollY < 24);

            if (!wrapperRef.current || !cardRef.current) {
                return;
            }

            if (window.innerWidth < 1024) {
                setDockMode('static');
                setDockMetrics({ width: 0, height: 0 });
                return;
            }

            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const cardHeight = cardRef.current.offsetHeight;
            const cardWidth = wrapperRef.current.offsetWidth;
            const topOffset = window.scrollY < 24 ? 80 : 16;

            setDockMetrics({ width: cardWidth, height: cardHeight });

            if (wrapperRect.top > topOffset) {
                setDockMode('static');
                return;
            }

            setDockMode('fixed');
        };

        updateDockState();
        window.addEventListener('scroll', updateDockState, { passive: true });
        window.addEventListener('resize', updateDockState);

        return () => {
            window.removeEventListener('scroll', updateDockState);
            window.removeEventListener('resize', updateDockState);
        };
    }, []);

    const topOffsetClass = isAtTop ? 'top-20' : 'top-4';
    const fixedTopOffset = isAtTop ? 80 : 16;
    const fixedBottomOffset = 16;
    const staticTopOffset = 96;
    const dockClass = dockMode === 'fixed'
        ? `lg:fixed ${topOffsetClass} lg:z-30`
        : 'relative';

    return (
        <div
            ref={wrapperRef}
            data-sidebar-shell="true"
            className="relative w-full lg:w-60 xl:w-64 2xl:w-72 shrink-0"
            style={dockMode !== 'static' && dockMetrics.height ? { height: dockMetrics.height } : undefined}
        >
            <div
                ref={cardRef}
                data-sidebar-card="true"
                className={`glass-card premium-card p-4 h-full min-h-0 flex flex-col transition-[top,height] duration-300 ${dockClass}`}
                style={(() => {
                    const desktopHeight = `calc(100vh - ${fixedTopOffset + fixedBottomOffset}px)`;

                    if (dockMode === 'fixed' && dockMetrics.width) {
                        return {
                            width: dockMetrics.width,
                            height: desktopHeight,
                        };
                    }

                    if (dockMode === 'static' && isAtTop) {
                        return {
                            height: `calc(100vh - ${staticTopOffset + fixedBottomOffset}px)`,
                        };
                    }

                    return undefined;
                })()}
            >
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 px-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText size={14} className="text-accent-purple/50" />
                        Modules
                    </div>
                    <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] border border-white/5 shadow-[0_0_14px_rgba(168,85,247,0.08)]">{activeStage.lessons.length} UNITS</span>
                </h3>

                <ul className="space-y-1.5 grow min-h-0 max-h-[50vh] lg:max-h-none overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                    {activeStage.lessons.map((lesson, idx) => {
                        const isCompleted = completedLessons[lesson.id];
                        const isActive = idx === activeLessonIndex;

                        return (
                            <li
                                key={lesson.id}
                                className={`flex items-center gap-2 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-white/10 text-white shadow-xl shadow-black/20 border border-white/10 ring-1 ring-purple-500/15'
                                    : 'text-gray-400 hover:bg-white/5 border border-transparent hover:border-white/5 hover:translate-x-0.5'
                                    }`}
                            >
                                {isActive && (
                                    <div className="pointer-events-none absolute inset-y-2 left-0 w-1 rounded-r-full bg-accent-purple shadow-[0_0_16px_rgba(168,85,247,0.9)]" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => setActiveLessonIndex(idx)}
                                    aria-current={isActive ? 'step' : undefined}
                                    className="min-w-0 grow p-3 text-left"
                                >
                                    <span className={`block text-[10px] font-black tracking-widest mb-0.5 transition-opacity ${isActive ? 'text-accent-purple' : 'opacity-40'}`}>
                                        UNIT {idx + 1}
                                    </span>
                                    <span className={`${isActive ? 'font-bold' : 'font-semibold'} block truncate text-[13px] tracking-tight`}>
                                        {lesson.title.split('. ')[1] || lesson.title}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleLessonComplete(lesson.id)}
                                    aria-pressed={Boolean(isCompleted)}
                                    aria-label={`${isCompleted ? 'Mark incomplete' : 'Mark complete'}: ${lesson.title}`}
                                    className={`mr-2 shrink-0 transition-all duration-300 p-1.5 rounded-lg ${isCompleted ? 'text-green-500 bg-green-500/10' : 'text-white/10 group-hover:text-white/20 hover:bg-white/5'}`}
                                >
                                    <CheckCircle2 size={16} />
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <button
                    onClick={startQuiz}
                    className="w-full mt-4 p-3.5 shine-sweep bg-accent-purple hover:bg-purple-500 active:scale-[0.98] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-purple-900/40 hover:shadow-purple-700/50 flex items-center justify-center gap-2 group overflow-hidden"
                >
                    <Trophy size={16} className="transition-transform group-hover:rotate-12" />
                    Level Exam
                </button>
            </div>
        </div>
    );
};
