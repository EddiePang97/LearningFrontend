import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LearningStage } from '@/constants/learningPath';
import { useQuizSession } from './useQuizSession';

const makeStage = (): LearningStage => ({
  id: 'frontend-lv0',
  level: 0,
  title: 'Level 0',
  description: 'desc',
  topics: [],
  keyConcepts: [],
  mission: 'mission',
  outcome: 'outcome',
  checklist: [],
  resources: [],
  lessons: [
    { id: 'l1', title: 'Lesson 1', content: 'content' },
  ],
  quizzes: [
    {
      id: 'q1',
      question: 'Q1',
      options: ['A', 'B'],
      correctAnswer: 0,
      explanation: 'exp',
      difficulty: 'Easy',
    },
    {
      id: 'q2',
      question: 'Q2',
      options: ['A', 'B'],
      correctAnswer: 1,
      explanation: 'exp',
      difficulty: 'Medium',
    },
  ],
});

describe('useQuizSession', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('starts with a fresh quiz state and can reset back to it', () => {
    const { result } = renderHook(() => useQuizSession());

    act(() => {
      result.current.setQuizFinished(true);
      result.current.setCurrentQuizIndex(1);
      result.current.setScore(1);
      result.current.setSelectedOption(0);
      result.current.setIsCorrect(true);
      result.current.resetQuizState();
    });

    expect(result.current.quizFinished).toBe(false);
    expect(result.current.currentQuizIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.selectedOption).toBeNull();
    expect(result.current.isCorrect).toBeNull();
  });

  it('scores a correct answer and advances to the next question after the delay', () => {
    const stage = makeStage();
    const { result } = renderHook(() => useQuizSession());

    act(() => {
      result.current.handleAnswer(stage, 0);
    });

    expect(result.current.selectedOption).toBe(0);
    expect(result.current.isCorrect).toBe(true);
    expect(result.current.score).toBe(1);

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(result.current.currentQuizIndex).toBe(1);
    expect(result.current.selectedOption).toBeNull();
    expect(result.current.isCorrect).toBeNull();
    expect(result.current.quizFinished).toBe(false);
  });

  it('finishes the quiz on the last answer instead of advancing again', () => {
    const stage = makeStage();
    const { result } = renderHook(() => useQuizSession());

    act(() => {
      result.current.handleAnswer(stage, 0);
      vi.advanceTimersByTime(800);
    });

    act(() => {
      result.current.handleAnswer(stage, 1);
      vi.advanceTimersByTime(800);
    });

    expect(result.current.score).toBe(2);
    expect(result.current.quizFinished).toBe(true);
    expect(result.current.currentQuizIndex).toBe(1);
  });

  it('ignores duplicate answers while the current question is locked', () => {
    const stage = makeStage();
    const { result } = renderHook(() => useQuizSession());

    act(() => {
      result.current.handleAnswer(stage, 1);
      result.current.handleAnswer(stage, 0);
    });

    expect(result.current.selectedOption).toBe(1);
    expect(result.current.score).toBe(0);
  });
});
