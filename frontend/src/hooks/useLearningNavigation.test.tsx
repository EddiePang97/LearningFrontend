import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LearningTrack } from '@/constants/learningPath';
import { useLearningNavigation } from './useLearningNavigation';

const makeTrack = (): LearningTrack => ({
  id: 'frontend',
  title: 'Frontend',
  shortTitle: 'Frontend',
  description: 'desc',
  mission: 'mission',
  stages: [
    {
      id: 'lv0',
      level: 0,
      title: 'Level 0',
      description: 'desc',
      topics: [],
      keyConcepts: [],
      mission: 'mission',
      outcome: 'outcome',
      checklist: [],
      resources: [],
      lessons: [{ id: 'l1', title: 'L1', content: 'c' }],
      quizzes: [],
    },
    {
      id: 'lv1',
      level: 1,
      title: 'Level 1',
      description: 'desc',
      topics: [],
      keyConcepts: [],
      mission: 'mission',
      outcome: 'outcome',
      checklist: [],
      resources: [],
      lessons: [{ id: 'l2', title: 'L2', content: 'c' }],
      quizzes: [],
    },
  ],
});

describe('useLearningNavigation', () => {
  it('selectStage syncs state, resets quiz, and navigates to the first unit', () => {
    const setAtlasTrackId = vi.fn();
    const setStageIndexByTrack = vi.fn();
    const setLessonIndexByTrack = vi.fn();
    const resetQuizState = vi.fn();
    const navigate = vi.fn();

    const { result } = renderHook(() =>
      useLearningNavigation({
        activeStageIndex: 0,
        activeTrack: makeTrack(),
        activeTrackId: 'frontend',
        ensureTrackIndexes: vi.fn(),
        navigate,
        rememberedLessonIndex: 0,
        resetQuizState,
        resolvedLessonIndex: 0,
        setAtlasTrackId,
        setLessonIndexByTrack,
        setStageIndexByTrack,
      })
    );

    result.current.selectStage(1);

    expect(setAtlasTrackId).toHaveBeenCalledWith('frontend');
    expect(resetQuizState).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/track/frontend/level/1/unit/0');
  });

  it('selectTrack resets quiz and ensures indexes without navigating', () => {
    const ensureTrackIndexes = vi.fn();
    const navigate = vi.fn();
    const resetQuizState = vi.fn();
    const setAtlasTrackId = vi.fn();

    const { result } = renderHook(() =>
      useLearningNavigation({
        activeStageIndex: 0,
        activeTrack: makeTrack(),
        activeTrackId: 'frontend',
        ensureTrackIndexes,
        navigate,
        rememberedLessonIndex: 0,
        resetQuizState,
        resolvedLessonIndex: 0,
        setAtlasTrackId,
        setLessonIndexByTrack: vi.fn(),
        setStageIndexByTrack: vi.fn(),
      })
    );

    result.current.selectTrack('frontend');

    expect(setAtlasTrackId).toHaveBeenCalledWith('frontend');
    expect(resetQuizState).toHaveBeenCalled();
    expect(ensureTrackIndexes).toHaveBeenCalledWith('frontend');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('startQuiz and exitQuiz navigate using the remembered positions', () => {
    const navigate = vi.fn();
    const resetQuizState = vi.fn();

    const { result } = renderHook(() =>
      useLearningNavigation({
        activeStageIndex: 1,
        activeTrack: makeTrack(),
        activeTrackId: 'frontend',
        ensureTrackIndexes: vi.fn(),
        navigate,
        rememberedLessonIndex: 2,
        resetQuizState,
        resolvedLessonIndex: 3,
        setAtlasTrackId: vi.fn(),
        setLessonIndexByTrack: vi.fn(),
        setStageIndexByTrack: vi.fn(),
      })
    );

    result.current.startQuiz();
    result.current.exitQuiz();

    expect(navigate).toHaveBeenNthCalledWith(1, '/track/frontend/level/1/quiz');
    expect(navigate).toHaveBeenNthCalledWith(2, '/track/frontend/level/1/unit/2');
  });

  it('handleNextStage advances only when a next stage exists', () => {
    const navigate = vi.fn();
    const resetQuizState = vi.fn();

    const { result } = renderHook(() =>
      useLearningNavigation({
        activeStageIndex: 0,
        activeTrack: makeTrack(),
        activeTrackId: 'frontend',
        ensureTrackIndexes: vi.fn(),
        navigate,
        rememberedLessonIndex: 0,
        resetQuizState,
        resolvedLessonIndex: 0,
        setAtlasTrackId: vi.fn(),
        setLessonIndexByTrack: vi.fn(),
        setStageIndexByTrack: vi.fn(),
      })
    );

    result.current.handleNextStage();

    expect(navigate).toHaveBeenCalledWith('/track/frontend/level/1/unit/0');
  });
});
