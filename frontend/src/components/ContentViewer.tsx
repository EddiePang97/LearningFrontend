import React, { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Lesson, LearningStage, LearningTrack } from '../constants/learningPath';
import { BookOpen, CheckCircle2, ChevronRight, ExternalLink, GraduationCap, Layers3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ContentViewerProps {
    activeLesson: Lesson;
    activeStage: LearningStage;
    activeTrack: LearningTrack;
    activeLessonIndex: number;
    setActiveLessonIndex: (index: number) => void;
    goToNextStage: () => void;
    hasNextStage: boolean;
    isLessonComplete: boolean;
    toggleLessonComplete: (id: string) => void;
    markLessonComplete: (id: string) => void;
    totalLessons: number;
}

type LabId = NonNullable<Lesson['labId']>;

const lazyNamed = <T extends Record<string, unknown>, K extends keyof T>(
    loader: () => Promise<T>,
    exportName: K
) => lazy(async () => {
    const module = await loader();
    return { default: module[exportName] as React.ComponentType };
});

const LAB_COMPONENTS: Record<LabId, React.LazyExoticComponent<React.ComponentType>> = {
    'box-model': lazyNamed(() => import('./labs/BoxModelLab'), 'BoxModelLab'),
    'layout-spatial': lazyNamed(() => import('./labs/LayoutLab'), 'LayoutLab'),
    'flex-box': lazyNamed(() => import('./labs/FlexBoxLab'), 'FlexBoxLab'),
    'grid-layout': lazyNamed(() => import('./labs/GridLayoutLab'), 'GridLayoutLab'),
    'specificity': lazyNamed(() => import('./labs/SpecificityLab'), 'SpecificityLab'),
    'event-loop': lazyNamed(() => import('./labs/EventLoopLab'), 'EventLoopLab'),
    'closure-scope': lazyNamed(() => import('./labs/ClosureLab'), 'ClosureLab'),
    'prototype-chain': lazyNamed(() => import('./labs/PrototypeLab'), 'PrototypeLab'),
    'this-binding': lazyNamed(() => import('./labs/ThisLab'), 'ThisLab'),
    'bundler-flow': lazyNamed(() => import('./labs/BundlerLab'), 'BundlerLab'),
    'webpack-pipeline': lazyNamed(() => import('./labs/WebpackLab'), 'WebpackLab'),
    'typescript-check': lazyNamed(() => import('./labs/TypeScriptLab'), 'TypeScriptLab'),
    'typescript-advanced': lazyNamed(() => import('./labs/TypeScriptAdvancedLab'), 'TypeScriptAdvancedLab'),
    'lint-format-lab': lazyNamed(() => import('./labs/LintFormatLab'), 'LintFormatLab'),
    'ci-cd-lab': lazyNamed(() => import('./labs/CICDLab'), 'CICDLab'),
    'virtual-dom': lazyNamed(() => import('./labs/VirtualDOMLab'), 'VirtualDOMLab'),
    'react-hooks': lazyNamed(() => import('./labs/HooksLab'), 'HooksLab'),
    'react-perf-lab': lazyNamed(() => import('./labs/ReactPerfLab'), 'ReactPerfLab'),
    'state-mgmt': lazyNamed(() => import('./labs/StateMgmtLab'), 'StateMgmtLab'),
    'component-patterns': lazyNamed(() => import('./labs/ComponentPatternsLab'), 'ComponentPatternsLab'),
    'fiber-architecture': lazyNamed(() => import('./labs/FiberLab'), 'FiberLab'),
    'web-vitals-lab': lazyNamed(() => import('./labs/WebVitalsLab'), 'WebVitalsLab'),
    'resource-hints-lab': lazyNamed(() => import('./labs/ResourceHintsLab'), 'ResourceHintsLab'),
    'media-optimization-lab': lazyNamed(() => import('./labs/MediaOptimizationLab'), 'MediaOptimizationLab'),
    'code-splitting-lab': lazyNamed(() => import('./labs/CodeSplittingLab'), 'CodeSplittingLab'),
    'crp-process': lazyNamed(() => import('./labs/CRPLab'), 'CRPLab'),
    'web-workers': lazyNamed(() => import('./labs/WebWorkerLab'), 'WebWorkerLab'),
    'http-cache': lazyNamed(() => import('./labs/HttpCacheLab'), 'HttpCacheLab'),
    'xss-lab': lazyNamed(() => import('./labs/XSSLab'), 'XSSLab'),
    'cors-lab': lazyNamed(() => import('./labs/CORSLab'), 'CORSLab'),
    'jwt-lab': lazyNamed(() => import('./labs/JWTLab'), 'JWTLab'),
    'csrf-lab': lazyNamed(() => import('./labs/CSRFLab'), 'CSRFLab'),
    'csp-lab': lazyNamed(() => import('./labs/CSPLab'), 'CSPLab'),
    'node-event-loop': lazyNamed(() => import('./labs/NodeEventLoopLab'), 'NodeEventLoopLab'),
    'stream-lab': lazyNamed(() => import('./labs/StreamLab'), 'StreamLab'),
    'middleware-lab': lazyNamed(() => import('./labs/MiddlewareLab'), 'MiddlewareLab'),
    'queue-retry-lab': lazyNamed(() => import('./labs/QueueRetryLab'), 'QueueRetryLab'),
    'big-o-lab': lazyNamed(() => import('./labs/BigOLab'), 'BigOLab'),
    'sorting-lab': lazyNamed(() => import('./labs/SortingLab'), 'SortingLab'),
    'tree-lab': lazyNamed(() => import('./labs/TreeLab'), 'TreeLab'),
    'recursion-lab': lazyNamed(() => import('./labs/RecursionLab'), 'RecursionLab'),
    'array-ll-lab': lazyNamed(() => import('./labs/ArrayLLLab'), 'ArrayLLLab'),
    'stack-queue-lab': lazyNamed(() => import('./labs/StackQueueLab'), 'StackQueueLab'),
    'hash-table-lab': lazyNamed(() => import('./labs/HashTableLab'), 'HashTableLab'),
    'search-lab': lazyNamed(() => import('./labs/SearchLab'), 'SearchLab'),
    'dp-lab': lazyNamed(() => import('./labs/DPLab'), 'DPLab'),
    'design-patterns-lab': lazyNamed(() => import('./labs/DesignPatternsLab'), 'DesignPatternsLab'),
    'mfe-lab': lazyNamed(() => import('./labs/MicroFrontendLab'), 'MicroFrontendLab'),
    'solid-lab': lazyNamed(() => import('./labs/DesignPrinciplesLab'), 'DesignPrinciplesLab'),
    'concurrency-lab': lazyNamed(() => import('./labs/ConcurrencyLab'), 'ConcurrencyLab'),
    'deep-clone-lab': lazyNamed(() => import('./labs/DeepCloneLab'), 'DeepCloneLab'),
    'reactivity-lab': lazyNamed(() => import('./labs/ReactivityLab'), 'ReactivityLab'),
    'monitoring-lab': lazyNamed(() => import('./labs/MonitoringLab'), 'MonitoringLab'),
    'virtual-list-lab': lazyNamed(() => import('./labs/VirtualListLab'), 'VirtualListLab'),
};

export const ContentViewer: React.FC<ContentViewerProps> = ({
    activeLesson,
    activeStage,
    activeTrack,
    activeLessonIndex,
    setActiveLessonIndex,
    goToNextStage,
    hasNextStage,
    isLessonComplete,
    toggleLessonComplete,
    markLessonComplete,
    totalLessons
}) => {
    const LabComponent = activeLesson.labId ? LAB_COMPONENTS[activeLesson.labId] : null;
    const isLastLesson = activeLessonIndex === totalLessons - 1;
    const stageLabel = activeTrack.id === 'backend' ? 'Backend Level' : 'Stage';
    const unitLabel = activeTrack.id === 'backend' ? 'Lesson' : 'Unit';
    const missionLabel = activeTrack.id === 'backend' ? 'Service Mission' : 'Level Mission';
    const checklistLabel = activeTrack.id === 'backend' ? 'Readiness Checklist' : 'Completion Checklist';
    const topicsLabel = activeTrack.id === 'backend' ? 'Service Topics' : 'Core Topics';
    const conceptsLabel = activeTrack.id === 'backend' ? 'Key Backend Concepts' : 'Key Concepts';
    const resourcesLabel = activeTrack.id === 'backend' ? 'Field Notes' : 'Resources';
    const nextLabel = isLastLesson ? (hasNextStage ? 'Next Level' : 'Level Complete') : activeTrack.id === 'backend' ? 'Next Lesson' : 'Next Unit';

    return (
        <div className="grow glass-card premium-card overflow-hidden flex flex-col min-h-[70vh] relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-purple-300/50 to-transparent" />
            <div className="pointer-events-none absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-purple-500/10 blur-[90px] aurora-orb" />
            <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
                <GraduationCap size={120} />
            </div>

            <div className="p-5 md:p-8 xl:p-10 grow overflow-y-auto custom-scrollbar relative">
                <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeStage.id}-${activeLesson.id}`}
                        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex flex-col gap-12 xl:gap-16 max-w-6xl mx-auto">
                            <div className="prose-custom max-w-none">
                                <header className="mb-8 xl:mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 bg-accent-purple/10 border border-accent-purple/25 text-accent-purple rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_24px_rgba(168,85,247,0.18)]">
                                            {stageLabel} {activeStage.level}
                                        </span>
                                        <div className="h-px w-8 bg-white/10" />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                            {unitLabel} {activeLessonIndex + 1} of {totalLessons}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black font-display text-white leading-[1.1] tracking-tight drop-shadow-[0_0_24px_rgba(168,85,247,0.16)]">
                                        {activeLesson.title}
                                    </h2>
                                </header>

                                <section className="mb-8 grid gap-3 rounded-4xl border border-white/10 bg-white/4 p-4 md:grid-cols-[1.1fr_0.9fr] md:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-accent-purple">
                                            {missionLabel}
                                        </p>
                                        <p className="mt-3 text-sm font-bold leading-6 text-white">
                                            {activeStage.mission}
                                        </p>
                                        <p className="mt-3 text-xs font-semibold leading-6 text-gray-400">
                                            <span className="text-gray-300">Outcome:</span> {activeStage.outcome}
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-white/7 bg-black/20 p-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                                            {checklistLabel}
                                        </p>
                                        <ul className="mt-3 space-y-2.5">
                                            {activeStage.checklist.map(item => (
                                                <li key={item} className="flex gap-2.5 text-xs font-semibold leading-5 text-gray-300">
                                                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent-purple" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <section className="mb-10 grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
                                    <div className="rounded-4xl border border-white/10 bg-white/3 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-accent-purple">
                                            <Layers3 size={14} />
                                            <span>{topicsLabel}</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {activeStage.topics.map(topic => (
                                                <span
                                                    key={topic}
                                                    className="rounded-full border border-accent-purple/20 bg-accent-purple/8 px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-gray-200"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-5 border-t border-white/8 pt-5">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">
                                                <BookOpen size={14} />
                                                <span>{conceptsLabel}</span>
                                            </div>
                                            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                                                {activeStage.keyConcepts.map(concept => (
                                                    <li
                                                        key={concept}
                                                        className="rounded-2xl border border-white/7 bg-black/20 px-3 py-2 text-xs font-semibold text-gray-300"
                                                    >
                                                        {concept}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {activeStage.resources.length > 0 && (
                                        <div className="rounded-4xl border border-white/10 bg-black/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-accent-purple">
                                                {resourcesLabel}
                                            </p>
                                            <p className="mt-3 text-xs font-semibold leading-6 text-gray-400">
                                                Keep one or two trusted references nearby while working through this lesson path.
                                            </p>
                                            <div className="mt-4 space-y-3">
                                                {activeStage.resources.map(resource => (
                                                    <a
                                                        key={resource.url}
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="group flex items-center justify-between rounded-3xl border border-white/8 bg-white/3 px-4 py-3 transition-all duration-300 hover:border-accent-purple/30 hover:bg-accent-purple/8"
                                                    >
                                                        <div>
                                                            <p className="text-xs font-bold text-white">{resource.name}</p>
                                                            <p className="mt-1 text-[11px] font-medium text-gray-500">{resource.url}</p>
                                                        </div>
                                                        <ExternalLink
                                                            size={15}
                                                            className="shrink-0 text-gray-500 transition-colors duration-300 group-hover:text-accent-purple"
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                            </div>

                            {LabComponent && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative min-h-[420px] md:min-h-[600px] w-full"
                                >
                                    <Suspense
                                        fallback={
                                            <div className="min-h-[420px] md:min-h-[600px] w-full rounded-3xl border border-white/10 bg-white/2 flex flex-col items-center justify-center gap-4 text-center">
                                                <div className="h-10 w-10 rounded-2xl border border-accent-purple/30 bg-accent-purple/10 shadow-[0_0_28px_rgba(168,85,247,0.22)] animate-pulse" />
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-accent-purple">Loading Lab</p>
                                                    <p className="mt-2 text-xs text-gray-500">Preparing the interactive playground...</p>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <LabComponent />
                                    </Suspense>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <footer className="p-6 md:p-8 border-t border-white/5 bg-white/1 backdrop-blur-md flex items-center justify-between z-10">
                <button
                    type="button"
                    disabled={activeLessonIndex === 0}
                    onClick={() => setActiveLessonIndex(activeLessonIndex - 1)}
                    aria-label="Go to previous unit"
                    className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all duration-300"
                >
                    <ChevronRight size={20} className="rotate-180" />
                    <span className="hidden sm:inline tracking-widest uppercase text-xs">Back</span>
                </button>

                <div className="flex gap-1.5">
                    {Array.from({ length: totalLessons }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === activeLessonIndex ? 'w-6 bg-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'w-2 bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (isLessonComplete) {
                                toggleLessonComplete(activeLesson.id);
                                return;
                            }

                            markLessonComplete(activeLesson.id);
                        }}
                        aria-pressed={isLessonComplete}
                        aria-label={`${isLessonComplete ? 'Mark current unit incomplete' : 'Mark current unit complete'}`}
                        className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                            isLessonComplete
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                : 'text-accent-purple hover:text-white hover:bg-accent-purple/10'
                        }`}
                    >
                        {isLessonComplete ? 'Completed' : 'Mark Complete'}
                    </button>

                    <button
                        type="button"
                        disabled={isLastLesson && !hasNextStage}
                        onClick={() => {
                            if (isLastLesson) {
                                goToNextStage();
                                return;
                            }

                            setActiveLessonIndex(activeLessonIndex + 1);
                        }}
                        aria-label={isLastLesson ? 'Go to next level' : 'Go to next unit'}
                        className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black text-accent-purple hover:text-white hover:bg-accent-purple/10 disabled:opacity-20 transition-all duration-300 group"
                    >
                        <span className="hidden sm:inline tracking-widest uppercase text-xs">
                            {nextLabel}
                        </span>
                        <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </footer>
        </div>
    );
};
