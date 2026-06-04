import { useEffect, useRef, useState } from 'react';
import type { LearningStage } from '@/constants/learningPath';

export const useQuizSession = () => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const quizAdvanceTimeoutRef = useRef<number | null>(null);
  const answerLockedRef = useRef(false);

  const clearQuizAdvanceTimeout = () => {
    if (quizAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(quizAdvanceTimeoutRef.current);
      quizAdvanceTimeoutRef.current = null;
    }
  };

  useEffect(() => () => clearQuizAdvanceTimeout(), []);

  const resetQuizState = () => {
    clearQuizAdvanceTimeout();
    answerLockedRef.current = false;
    setQuizFinished(false);
    setCurrentQuizIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleAnswer = (activeStage: LearningStage, optionIndex: number) => {
    if (selectedOption !== null || answerLockedRef.current) return;

    answerLockedRef.current = true;
    setSelectedOption(optionIndex);
    const correct = optionIndex === activeStage.quizzes[currentQuizIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }

    clearQuizAdvanceTimeout();
    quizAdvanceTimeoutRef.current = window.setTimeout(() => {
      quizAdvanceTimeoutRef.current = null;
      if (currentQuizIndex < activeStage.quizzes.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        answerLockedRef.current = false;
      } else {
        setQuizFinished(true);
      }
    }, 800);
  };

  return {
    currentQuizIndex,
    setCurrentQuizIndex,
    score,
    setScore,
    quizFinished,
    setQuizFinished,
    selectedOption,
    setSelectedOption,
    isCorrect,
    setIsCorrect,
    resetQuizState,
    handleAnswer,
  };
};
