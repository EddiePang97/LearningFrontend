import { useEffect, useState } from 'react';
import { DEFAULT_TRACK_ID, LEARNING_TRACKS } from '@/constants/learningPath';
import type { LearningTrack } from '@/constants/learningPath';

export const ACTIVE_TRACK_STORAGE_KEY = 'learning-atlas.activeTrackId';
export const STAGE_INDEX_BY_TRACK_STORAGE_KEY = 'learning-atlas.stageIndexByTrack';
export const LESSON_INDEX_BY_TRACK_STORAGE_KEY = 'learning-atlas.lessonIndexByTrack';
export const COMPLETED_LESSONS_BY_TRACK_STORAGE_KEY = 'learning-atlas.completedLessonsByTrack';

export type ProgressByTrack = Partial<Record<LearningTrack['id'], Record<string, boolean>>>;
export type IndexByTrack = Partial<Record<LearningTrack['id'], number>>;

const TOTAL_LESSONS = LEARNING_TRACKS.reduce(
  (trackCount, track) => trackCount + track.stages.reduce((stageCount, stage) => stageCount + stage.lessons.length, 0),
  0
);

const getTrackById = (trackId?: string) => LEARNING_TRACKS.find(track => track.id === trackId) ?? null;

const readStorageItem = (storageKey: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(storageKey);
};

const getInitialTrackId = (): LearningTrack['id'] => {
  const saved = readStorageItem(ACTIVE_TRACK_STORAGE_KEY);
  return getTrackById(saved ?? undefined)?.id ?? DEFAULT_TRACK_ID;
};

const getInitialIndexByTrack = (storageKey: string): IndexByTrack => {
  try {
    const saved = readStorageItem(storageKey);
    if (!saved) return {};

    const parsed = JSON.parse(saved) as Record<string, number>;
    return LEARNING_TRACKS.reduce<IndexByTrack>((acc, track) => {
      const value = parsed[track.id];
      if (Number.isInteger(value) && value >= 0) {
        acc[track.id] = value;
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const getInitialCompletedLessonsByTrack = (): ProgressByTrack => {
  try {
    const saved = readStorageItem(COMPLETED_LESSONS_BY_TRACK_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ProgressByTrack) : {};
  } catch {
    return {};
  }
};

export const useLearningProgress = () => {
  const [atlasTrackId, setAtlasTrackId] = useState<LearningTrack['id']>(() => getInitialTrackId());
  const [stageIndexByTrack, setStageIndexByTrack] = useState<IndexByTrack>(() => getInitialIndexByTrack(STAGE_INDEX_BY_TRACK_STORAGE_KEY));
  const [lessonIndexByTrack, setLessonIndexByTrack] = useState<IndexByTrack>(() => getInitialIndexByTrack(LESSON_INDEX_BY_TRACK_STORAGE_KEY));
  const [completedLessonsByTrack, setCompletedLessonsByTrack] = useState<ProgressByTrack>(() => getInitialCompletedLessonsByTrack());

  const completedLessons = completedLessonsByTrack[atlasTrackId] ?? {};
  const totalCompleted = Object.values(completedLessonsByTrack).reduce(
    (count, trackProgress) => count + Object.values(trackProgress ?? {}).filter(Boolean).length,
    0
  );
  const progressPercent = TOTAL_LESSONS > 0 ? Math.min(100, Math.round((totalCompleted / TOTAL_LESSONS) * 100)) : 0;
  const totalXP = totalCompleted * 10;

  useEffect(() => {
    window.localStorage.setItem(ACTIVE_TRACK_STORAGE_KEY, atlasTrackId);
  }, [atlasTrackId]);

  useEffect(() => {
    window.localStorage.setItem(STAGE_INDEX_BY_TRACK_STORAGE_KEY, JSON.stringify(stageIndexByTrack));
  }, [stageIndexByTrack]);

  useEffect(() => {
    window.localStorage.setItem(LESSON_INDEX_BY_TRACK_STORAGE_KEY, JSON.stringify(lessonIndexByTrack));
  }, [lessonIndexByTrack]);

  useEffect(() => {
    window.localStorage.setItem(COMPLETED_LESSONS_BY_TRACK_STORAGE_KEY, JSON.stringify(completedLessonsByTrack));
  }, [completedLessonsByTrack]);

  const ensureTrackIndexes = (trackId: LearningTrack['id']) => {
    setStageIndexByTrack(prev => (prev[trackId] === undefined ? { ...prev, [trackId]: 0 } : prev));
    setLessonIndexByTrack(prev => (prev[trackId] === undefined ? { ...prev, [trackId]: 0 } : prev));
  };

  const getCompletedLessons = (trackId: LearningTrack['id']) => completedLessonsByTrack[trackId] ?? {};

  const toggleLessonComplete = (trackId: LearningTrack['id'], lessonId: string) => {
    setCompletedLessonsByTrack(prev => {
      const trackProgress = prev[trackId] ?? {};

      if (trackProgress[lessonId]) {
        const nextCompletedLessons = { ...trackProgress };
        delete nextCompletedLessons[lessonId];

        return {
          ...prev,
          [trackId]: nextCompletedLessons,
        };
      }

      return {
        ...prev,
        [trackId]: {
          ...trackProgress,
          [lessonId]: true,
        },
      };
    });
  };

  const markLessonComplete = (trackId: LearningTrack['id'], lessonId: string) => {
    setCompletedLessonsByTrack(prev => {
      const trackProgress = prev[trackId] ?? {};
      if (trackProgress[lessonId]) {
        return prev;
      }

      return {
        ...prev,
        [trackId]: {
          ...trackProgress,
          [lessonId]: true,
        },
      };
    });
  };

  return {
    atlasTrackId,
    setAtlasTrackId,
    stageIndexByTrack,
    setStageIndexByTrack,
    lessonIndexByTrack,
    setLessonIndexByTrack,
    completedLessonsByTrack,
    completedLessons,
    totalCompleted,
    progressPercent,
    totalXP,
    ensureTrackIndexes,
    getCompletedLessons,
    toggleLessonComplete,
    markLessonComplete,
  };
};
