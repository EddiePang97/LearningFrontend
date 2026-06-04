import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import type { LearningStage } from '../constants/learningPath';

interface QuizLabProps {
    activeStage: LearningStage;
    currentQuizIndex: number;
    score: number;
    quizFinished: boolean;
    selectedOption: number | null;
    isCorrect: boolean | null;
    handleAnswer: (index: number) => void;
    onExitQuiz: () => void;
    handleNextStage: () => void;
    hasNextStage: boolean;
}

export const QuizLab: React.FC<QuizLabProps> = ({
    activeStage,
    currentQuizIndex,
    score,
    quizFinished,
    selectedOption,
    isCorrect,
    handleAnswer,
    onExitQuiz,
    handleNextStage,
    hasNextStage
}) => {
    const currentQuestion = activeStage.quizzes[currentQuizIndex];
    const progress = ((currentQuizIndex + 1) / activeStage.quizzes.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            className="max-w-4xl mx-auto w-full pt-4 md:pt-12 px-4"
        >
            {!quizFinished ? (
                <div className="glass-card p-6 md:p-14 border-accent-purple/20 relative overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,1)]">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-linear-to-r from-purple-500 to-pink-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 md:mb-16">
                        <button
                            onClick={onExitQuiz}
                            className="group flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-[0.2em]"
                        >
                            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-accent-purple/20 transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                            Abort Mission
                        </button>
                        <span className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
                            Chamber {currentQuizIndex + 1} / {activeStage.quizzes.length}
                        </span>
                    </div>

                    <div className="mb-14">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuizIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            className="p-6 md:p-10 bg-white/2 rounded-[32px] border border-white/5 shadow-inner"
                            >
                                <p className="text-xl md:text-3xl font-black font-display leading-tight text-white mb-4">
                                    {currentQuestion.question}
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className={`h-1.5 w-1.5 rounded-full ${currentQuestion.difficulty === 'Hard' ? 'bg-red-500' : currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{currentQuestion.difficulty} LEVEL</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, oIdx) => {
                            const isSelected = selectedOption === oIdx;
                            const isCorrectOption = oIdx === currentQuestion.correctAnswer;

                            let stateStyles = 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-400';
                            if (selectedOption !== null) {
                                if (isSelected) {
                                    stateStyles = isCorrect
                                        ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.1)]'
                                        : 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.1)]';
                                } else if (isCorrectOption) {
                                    stateStyles = 'bg-green-500/10 border-green-500/30 text-green-400';
                                } else {
                                    stateStyles = 'opacity-20 bg-transparent border-white/5';
                                }
                            }

                            return (
                                <motion.button
                                    key={oIdx}
                                    whileHover={selectedOption === null ? { scale: 1.02, x: 4 } : {}}
                                    whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                                    onClick={() => handleAnswer(oIdx)}
                                    disabled={selectedOption !== null}
                                    className={`p-4 md:p-6 flex items-center gap-4 md:gap-5 border rounded-3xl text-left transition-all duration-300 ${stateStyles}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-lg shrink-0
                    ${selectedOption !== null && isSelected
                                            ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                                            : 'bg-white/5 text-gray-500'}
                  `}>
                                        {String.fromCharCode(65 + oIdx)}
                                    </div>
                                    <span className="text-sm md:text-base font-bold leading-snug">{option}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="glass-card p-8 md:p-20 text-center relative overflow-hidden border-accent-purple/30 shadow-[0_0_100px_rgba(168,85,247,0.15)]">
                    <div className="absolute inset-0 bg-linear-to-b from-accent-purple/8 via-transparent to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                        className="w-28 h-28 md:w-32 md:h-32 bg-accent-purple/20 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-purple-500/30 relative"
                    >
                        <div className="absolute inset-0 bg-accent-purple blur-2xl opacity-20 animate-pulse" />
                        <Trophy size={64} className="text-accent-purple relative z-10" />
                    </motion.div>

                    <h2 className="text-4xl md:text-7xl font-black mb-6 font-display text-white tracking-tighter italic">LEGACY SECURED</h2>
                    <div className="text-7xl md:text-[9rem] font-black text-accent-purple mb-10 font-display drop-shadow-[0_0_40px_rgba(168,85,247,0.6)] leading-none">
                        {score}<span className="text-3xl md:text-4xl text-gray-700 font-black italic">/{activeStage.quizzes.length}</span>
                    </div>

                    <p className="text-gray-400 mb-14 text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-semibold">
                        {score >= activeStage.quizzes.length * 0.8
                            ? "Your technical capacity exceeds expectations. Access to deeper levels is now authorized."
                            : "Diagnostic complete. Core concepts identified, but optimization is recommended before further advancement."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <button
                            onClick={onExitQuiz}
                            className="px-10 py-5 rounded-[24px] border border-white/10 hover:bg-white/5 transition-all text-xs font-black text-white uppercase tracking-[0.3em]"
                        >
                            Review Modules
                        </button>
                        {hasNextStage && score >= activeStage.quizzes.length / 2 && (
                            <button
                                onClick={handleNextStage}
                                className="px-12 py-5 bg-accent-purple hover:bg-purple-500 rounded-[24px] font-black transition-all text-xs text-white shadow-2xl shadow-purple-900/60 uppercase tracking-[0.3em] group"
                            >
                                Next Level
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="inline-block ml-2"
                                >→</motion.span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};
