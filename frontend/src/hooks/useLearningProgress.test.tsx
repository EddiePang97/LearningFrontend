import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_TRACK_ID } from '@/constants/learningPath';
import {
  ACTIVE_TRACK_STORAGE_KEY,
  COMPLETED_LESSONS_BY_TRACK_STORAGE_KEY,
  STAGE_INDEX_BY_TRACK_STORAGE_KEY,
  LESSON_INDEX_BY_TRACK_STORAGE_KEY,
  useLearningProgress,
} from './useLearningProgress';

describe('useLearningProgress', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes from persisted valid track and per-track indexes', () => {
    window.localStorage.setItem(ACTIVE_TRACK_STORAGE_KEY, 'backend');
    window.localStorage.setItem(STAGE_INDEX_BY_TRACK_STORAGE_KEY, JSON.stringify({ backend: 3 }));
    window.localStorage.setItem(LESSON_INDEX_BY_TRACK_STORAGE_KEY, JSON.stringify({ backend: 2 }));

    const { result } = renderHook(() => useLearningProgress());

    expect(result.current.atlasTrackId).toBe('backend');
    expect(result.current.stageIndexByTrack.backend).toBe(3);
    expect(result.current.lessonIndexByTrack.backend).toBe(2);
  });

  it('falls back to the default track when persisted track is invalid', () => {
    window.localStorage.setItem(ACTIVE_TRACK_STORAGE_KEY, 'unknown-track');

    const { result } = renderHook(() => useLearningProgress());

    expect(result.current.atlasTrackId).toBe(DEFAULT_TRACK_ID);
  });

  it('toggles lesson completion per track and updates aggregate progress', () => {
    const { result } = renderHook(() => useLearningProgress());

    act(() => {
      result.current.toggleLessonComplete('frontend', 'frontend-lv0-l1');
      result.current.toggleLessonComplete('backend', 'backend-lv0-l1');
    });

    expect(result.current.completedLessonsByTrack.frontend?.['frontend-lv0-l1']).toBe(true);
    expect(result.current.completedLessonsByTrack.backend?.['backend-lv0-l1']).toBe(true);
    expect(result.current.totalCompleted).toBe(2);
    expect(result.current.totalXP).toBe(20);

    act(() => {
      result.current.toggleLessonComplete('frontend', 'frontend-lv0-l1');
    });

    expect(result.current.completedLessonsByTrack.frontend?.['frontend-lv0-l1']).toBeUndefined();
    expect(result.current.totalCompleted).toBe(1);
  });

  it('marks lessons complete idempotently and persists completion state', () => {
    const { result } = renderHook(() => useLearningProgress());

    act(() => {
      result.current.markLessonComplete('frontend', 'frontend-lv0-l1');
      result.current.markLessonComplete('frontend', 'frontend-lv0-l1');
    });

    expect(result.current.completedLessons['frontend-lv0-l1']).toBe(true);
    expect(result.current.totalCompleted).toBe(1);

    expect(JSON.parse(window.localStorage.getItem(COMPLETED_LESSONS_BY_TRACK_STORAGE_KEY) ?? '{}')).toEqual({
      frontend: {
        'frontend-lv0-l1': true,
      },
    });
  });
});
