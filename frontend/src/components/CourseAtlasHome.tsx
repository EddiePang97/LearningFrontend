import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Braces, Cpu, Database, Globe2, Layers3, Palette, ShieldAlert, Terminal, Trophy } from 'lucide-react';
import type { LearningStage, LearningTrack } from '../constants/learningPath';

interface CourseAtlasHomeProps {
    tracks: LearningTrack[];
    activeTrackId: LearningTrack['id'];
    onSelectTrack: (trackId: LearningTrack['id']) => void;
    stages: LearningStage[];
    activeStageIndex: number;
    completedLessons: Record<string, boolean>;
    onSelectStage: (index: number, trackId?: LearningTrack['id']) => void;
}

const getLevelIcon = (level: number) => {
    switch (level) {
        case 0: return <Palette size={18} />;
        case 1: return <Terminal size={18} />;
        case 2: return <Cpu size={18} />;
        case 5: return <ShieldAlert size={18} />;
        case 9: return <Trophy size={18} />;
        default: return <BookOpen size={18} />;
    }
};

const getTrackIcon = (trackId: LearningTrack['id']) => {
    switch (trackId) {
        case 'frontend': return <Palette size={18} />;
        case 'backend': return <Database size={18} />;
        case 'fullstack': return <Layers3 size={18} />;
        case 'network': return <Globe2 size={18} />;
        default: return <Braces size={18} />;
    }
};

gsap.registerPlugin(ScrollTrigger);

export const CourseAtlasHome: React.FC<CourseAtlasHomeProps> = ({
    tracks,
    activeTrackId,
    onSelectTrack,
    stages,
    activeStageIndex,
    completedLessons,
    onSelectStage
}) => {
    const rootRef = useRef<HTMLElement | null>(null);
    const isLeavingRef = useRef(false);
    const activeTrack = tracks.find(track => track.id === activeTrackId) ?? tracks[0];
    const totalLessons = stages.reduce((count, stage) => count + stage.lessons.length, 0);
    const completedCount = Object.values(completedLessons).filter(Boolean).length;
    const ctaStageIndex = completedCount === 0 ? 0 : activeStageIndex;
    const ctaStage = stages[ctaStageIndex] ?? stages[0];
    const ctaLabel = completedCount === 0 ? 'Start Level 0' : `Continue Level ${ctaStage.level}`;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set('.atlas-light-line', { autoAlpha: 0, scaleX: 0 });
            gsap.set('.atlas-entrance-item', { autoAlpha: 0, y: 14, filter: 'blur(8px)', force3D: true });
            gsap.set('.atlas-stat-card', { autoAlpha: 0, y: 12, scale: 0.98, force3D: true });
            gsap.set('.atlas-roadmap-shell', { autoAlpha: 0, y: 18, filter: 'blur(8px)', force3D: true });
            gsap.set('.atlas-roadmap-card', { autoAlpha: 0, y: 14, scale: 0.98, force3D: true });
            gsap.set('.atlas-roadmap-progress', { scaleX: 0, transformOrigin: 'left center' });

            const heroTimeline = gsap.timeline({
                defaults: { ease: 'expo.out' },
                scrollTrigger: {
                    trigger: '.atlas-hero-section',
                    start: 'top 82%',
                    end: 'bottom 26%',
                    toggleActions: 'play reverse play reverse',
                },
            });

            heroTimeline
                .addLabel('partOne')
                .to('.atlas-light-line', { autoAlpha: 1, scaleX: 1, duration: 1.25 })
                .to('.atlas-entrance-item', {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.9,
                    stagger: 0.12,
                }, '-=0.72')
                .to('.atlas-stat-card', {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.72,
                    stagger: 0.08,
                }, '-=0.38')

            const roadmapTimeline = gsap.timeline({
                paused: true,
                defaults: { ease: 'expo.out' },
                scrollTrigger: {
                    trigger: '.atlas-roadmap-shell',
                    start: 'top 78%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reset',
                },
            });

            roadmapTimeline
                .to('.atlas-roadmap-shell', {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.9,
                })
                .to('.atlas-roadmap-card', {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.68,
                    stagger: 0.045,
                }, '-=0.34')
                .to('.atlas-roadmap-progress', {
                    scaleX: 1,
                    duration: 0.8,
                    stagger: 0.035,
                    ease: 'power3.out',
                }, '-=0.34');

            ScrollTrigger.refresh();
        }, rootRef);

        return () => ctx.revert();
    }, []);

    const selectStageWithExit = (stageIndex: number) => {
        if (isLeavingRef.current) return;
        isLeavingRef.current = true;

        const root = rootRef.current;
        if (!root) {
            onSelectStage(stageIndex, activeTrackId);
            return;
        }

        const ctx = gsap.context(() => {
            gsap.timeline({
                defaults: { ease: 'power3.inOut' },
                onComplete: () => onSelectStage(stageIndex, activeTrackId),
            })
                .to('.atlas-roadmap-card', {
                    autoAlpha: 0,
                    y: 12,
                    scale: 0.98,
                    duration: 0.34,
                    stagger: { each: 0.02, from: 'end' },
                })
                .to('.atlas-roadmap-progress', {
                    scaleX: 0,
                    duration: 0.24,
                    stagger: { each: 0.012, from: 'end' },
                }, '<')
                .to('.atlas-roadmap-shell', {
                    autoAlpha: 0,
                    y: 16,
                    filter: 'blur(8px)',
                    duration: 0.44,
                }, '-=0.12')
                .to(['.atlas-stat-card', '.atlas-entrance-item'], {
                    autoAlpha: 0,
                    y: -12,
                    filter: 'blur(6px)',
                    duration: 0.46,
                    stagger: { each: 0.028, from: 'end' },
                }, '-=0.18')
                .to('.atlas-light-line', {
                    autoAlpha: 0,
                    scaleX: 0,
                    duration: 0.38,
                }, '-=0.22');
        }, root);

        return () => ctx.revert();
    };

    return (
        <main
            ref={rootRef}
            key="course-atlas-home"
            className="relative z-10 grow w-full max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16 flex flex-col"
        >
            <div
                aria-hidden="true"
                className="atlas-light-line pointer-events-none absolute left-1/2 top-8 h-px w-3/4 max-w-3xl origin-center -translate-x-1/2 bg-linear-to-r from-transparent via-accent-purple/60 to-transparent"
            />
            <div className="flex flex-col gap-10">
                <section className="atlas-hero-section min-h-[calc(100vh-11rem)] flex flex-col justify-center text-center mx-auto max-w-4xl space-y-7">
                    <div className="atlas-entrance-item will-change-transform inline-flex items-center gap-2 rounded-full border border-accent-purple/25 bg-accent-purple/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-accent-purple shadow-[0_0_24px_rgba(168,85,247,0.16)]">
                        Software Engineering Atlas
                    </div>

                    <div className="atlas-entrance-item will-change-transform space-y-5">
                        <h1 className="text-4xl md:text-6xl font-black font-display tracking-tighter text-white leading-none">
                            Master engineering across
                            <span className="block text-accent-purple drop-shadow-[0_0_32px_rgba(168,85,247,0.35)]">
                                4 deep tracks.
                            </span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-sm md:text-base text-gray-400 leading-7 font-semibold">
                            Frontend, backend, full stack, and network each get at least 10 levels, so every path can stand on its own.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
                        {[
                            ['Tracks', tracks.length],
                            ['Levels', tracks.reduce((count, track) => count + track.stages.length, 0)],
                            ['Units', totalLessons],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="atlas-stat-card will-change-transform glass-card premium-card p-4 rounded-3xl transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                            >
                                <div className="text-2xl font-black text-white">{value}</div>
                                <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="atlas-entrance-item will-change-transform mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {tracks.map(track => {
                            const isActiveTrack = track.id === activeTrackId;

                            return (
                                <button
                                    type="button"
                                    key={track.id}
                                    onClick={() => onSelectTrack(track.id)}
                                    className={`rounded-3xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 ${isActiveTrack
                                        ? 'border-accent-purple/40 bg-accent-purple/10 text-white shadow-[0_0_28px_rgba(168,85,247,0.16)]'
                                        : 'border-white/5 bg-white/3 text-gray-400 hover:border-white/15 hover:bg-white/7'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`grid h-10 w-10 place-items-center rounded-2xl ${isActiveTrack ? 'bg-accent-purple text-white' : 'bg-white/5 text-gray-500'}`}>
                                            {getTrackIcon(track.id)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white">{track.shortTitle}</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{track.stages.length} levels</div>
                                        </div>
                                    </div>
                                    <p className="mt-3 line-clamp-3 text-xs font-semibold leading-5 text-gray-400">
                                        {track.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    <div className="atlas-entrance-item will-change-transform flex justify-center">
                        <button
                            type="button"
                            onClick={() => selectStageWithExit(ctaStageIndex)}
                            className="shine-sweep inline-flex items-center justify-center gap-3 rounded-2xl bg-accent-purple px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-2xl shadow-purple-900/40 transition-all hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-purple-500 hover:shadow-purple-700/50 active:scale-[0.98]"
                        >
                            {ctaLabel}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </section>

                <section className="atlas-roadmap-shell will-change-transform glass-card premium-card rounded-4xl border-white/10 p-4 md:p-5 mb-12 md:mb-20">
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Roadmap</div>
                            <div className="mt-1 text-sm font-bold text-white">{activeTrack.title}</div>
                            <div className="mt-1 text-xs font-semibold text-gray-500">{activeTrack.mission}</div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                            {stages.length} levels minimum
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {stages.map((stage, index) => {
                            const completedInStage = stage.lessons.filter(lesson => completedLessons[lesson.id]).length;
                            const stagePercent = stage.lessons.length > 0
                                ? Math.round((completedInStage / stage.lessons.length) * 100)
                                : 0;
                            const isActive = index === activeStageIndex;

                            return (
                                <button
                                    type="button"
                                    key={stage.id}
                                    onClick={() => selectStageWithExit(index)}
                                    className={`atlas-roadmap-card will-change-transform group rounded-3xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] ${isActive
                                        ? 'border-accent-purple/40 bg-white/10 text-white shadow-[0_0_28px_rgba(168,85,247,0.16)]'
                                        : 'border-white/5 bg-white/3 text-gray-400 hover:border-white/15 hover:bg-white/7'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition-all ${isActive ? 'bg-accent-purple text-white shadow-[0_0_18px_rgba(168,85,247,0.48)]' : 'bg-white/5 text-gray-500 group-hover:text-accent-purple'}`}>
                                            {getLevelIcon(stage.level)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[9px] font-black uppercase tracking-widest opacity-60">LVL {stage.level}</div>
                                            <div className="truncate text-sm font-black text-white">{stage.title.split(' - ')[1] || stage.title}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-[10px] font-black text-gray-500">
                                        <span>{stage.lessons.length} units</span>
                                        <span>{stagePercent}%</span>
                                    </div>
                                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/7">
                                        <div
                                            className="atlas-roadmap-progress h-full rounded-full bg-linear-to-r from-purple-500 via-fuchsia-400 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.45)]"
                                            style={{ width: `${stagePercent}%` }}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
};
