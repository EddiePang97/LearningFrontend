import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Orbit } from 'lucide-react';

interface NavbarProps {
    progress: number;
    xp: number;
    onOpenAtlas: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ progress, xp, onOpenAtlas }) => {
    const [isAtTop, setIsAtTop] = useState(true);
    /** 滚离顶部后：仅把手或已拉下的 Navbar 能保持展开 */
    const [chromeRevealed, setChromeRevealed] = useState(false);
    const dockPointerInside = useRef(false);
    const navPointerInside = useRef(false);
    const closeDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearCloseTimer = () => {
        if (closeDelayRef.current !== null) {
            window.clearTimeout(closeDelayRef.current);
            closeDelayRef.current = null;
        }
    };

    const scheduleMaybeCloseChrome = () => {
        clearCloseTimer();
        closeDelayRef.current = window.setTimeout(() => {
            closeDelayRef.current = null;
            if (!dockPointerInside.current && !navPointerInside.current) {
                setChromeRevealed(false);
            }
        }, 140);
    };

    const navExpanded = isAtTop || chromeRevealed;

    useEffect(() => {
        const updateNavState = () => {
            setIsAtTop(window.scrollY < 24);
        };

        updateNavState();
        window.addEventListener('scroll', updateNavState, { passive: true });

        return () => window.removeEventListener('scroll', updateNavState);
    }, []);

    useEffect(() => {
        return () => clearCloseTimer();
    }, []);

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-40 h-20 pointer-events-none">
                <nav
                    onMouseEnter={() => {
                        if (!isAtTop) {
                            navPointerInside.current = true;
                            clearCloseTimer();
                            setChromeRevealed(true);
                        }
                    }}
                    onMouseLeave={() => {
                        if (!isAtTop) {
                            navPointerInside.current = false;
                            scheduleMaybeCloseChrome();
                        }
                    }}
                    onFocusCapture={() => {
                        if (!isAtTop) {
                            clearCloseTimer();
                            setChromeRevealed(true);
                        }
                    }}
                    onBlurCapture={(event) => {
                        if (!isAtTop && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
                            scheduleMaybeCloseChrome();
                        }
                    }}
                    className={`pointer-events-auto border-b border-white/10 bg-black/35 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.24)] transition-transform duration-500 ease-out will-change-transform ${navExpanded ? 'translate-y-0' : '-translate-y-full'
                        }`}
                >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-purple-400/70 to-transparent" />
                    <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={onOpenAtlas}
                                aria-label="Open Course Atlas"
                                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-all hover:text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.25)]"
                            >
                                <Orbit size={20} />
                            </button>
                            <div className="w-8 h-8 shrink-0 bg-accent-purple rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 ring-1 ring-white/15 relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-transparent" />
                                <GraduationCap size={20} className="text-white" />
                            </div>
                            <h1 className="truncate text-base sm:text-lg md:text-xl font-bold font-display tracking-tight text-white">
                                Learning <span className="text-accent-purple">Atlas</span>
                            </h1>
                        </div>

                        <div className="hidden sm:flex items-center gap-6">
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase leading-none">Overall Progress</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden shadow-inner shadow-black">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 shadow-[0_0_18px_rgba(236,72,153,0.65)]"
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-white/50">{progress}%</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="px-3 py-1.5 glass-card shine-sweep flex items-center gap-2 border-accent-purple/20">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-[10px] font-black text-white tracking-widest whitespace-nowrap">{xp} XP</span>
                            </div>
                        </div>
                    </div>
                    <div className="sm:hidden h-1 bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-purple-500"
                        />
                        <span className="sr-only">Overall progress {progress}%, {xp} XP</span>
                    </div>
                </nav>

                {/* 仅占位渐变，不参与 hover */}
                <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-14 transition-opacity duration-500 ${isAtTop ? 'opacity-0' : 'opacity-100'
                        }`}
                >
                    <div className="absolute inset-x-0 top-0 h-14 bg-linear-to-b from-black/65 via-black/20 to-transparent" />
                </div>

                {/* 仅有把手接收指针与 hover 触发 */}
                <div
                    className={`absolute inset-x-0 top-0 flex justify-center pt-1 transition-opacity duration-500 ${isAtTop ? 'pointer-events-none opacity-0' : 'pointer-events-none opacity-100'
                        }`}
                >
                    <button
                        type="button"
                        onClick={onOpenAtlas}
                        aria-label="Open navigation"
                        onMouseEnter={() => {
                            dockPointerInside.current = true;
                            clearCloseTimer();
                            setChromeRevealed(true);
                        }}
                        onMouseLeave={() => {
                            dockPointerInside.current = false;
                            scheduleMaybeCloseChrome();
                        }}
                        onFocus={() => {
                            clearCloseTimer();
                            setChromeRevealed(true);
                        }}
                        onBlur={(event) => {
                            if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
                                dockPointerInside.current = false;
                                scheduleMaybeCloseChrome();
                            }
                        }}
                        className={`group/dock pointer-events-auto absolute left-1/2 top-0 flex h-8 w-34 -translate-x-1/2 items-center justify-center overflow-hidden rounded-b-[1.4rem] rounded-t-md border-x border-b border-purple-300/15 bg-black/45 shadow-[0_16px_34px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(168,85,247,0.22),0_0_30px_rgba(168,85,247,0.16)] backdrop-blur-2xl transition-all duration-500 ease-out hover:w-42 hover:border-purple-300/30 hover:bg-black/62 hover:shadow-[0_18px_42px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(216,180,254,0.28),0_0_38px_rgba(168,85,247,0.26)] ${navExpanded && !isAtTop ? 'translate-y-17 sm:translate-y-16 scale-[1.03]' : ''
                            }`}
                    >
                        <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-purple-300/10 via-white/3 to-transparent" />
                        <span className="pointer-events-none absolute -left-10 top-0 h-12 w-8 rotate-12 bg-linear-to-r from-transparent via-purple-200/18 to-transparent blur-[1px] transition-transform duration-700 group-hover/dock:translate-x-52" />
                        <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/45 to-transparent" />
                        <span className="relative flex items-center gap-2.5">
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-purple-500/10 text-purple-200 ring-1 ring-purple-300/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                <Orbit size={12} />
                            </span>
                            <span className="h-1 w-16 overflow-hidden rounded-full bg-purple-950/60 ring-1 ring-purple-200/10">
                                <span
                                    className="block h-full rounded-full bg-linear-to-r from-purple-500 via-fuchsia-400 to-pink-400 shadow-[0_0_12px_rgba(217,70,239,0.45)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </span>
                        </span>
                    </button>
                </div>
            </div>
            <div className="h-16" aria-hidden="true" />
        </>
    );
};
