import { matchPath } from 'react-router-dom';
import { LEARNING_TRACKS } from '@/constants/learningPath';
import type { LearningStage, LearningTrack, Lesson } from '@/constants/learningPath';
import type { IndexByTrack } from '@/hooks/useLearningProgress';

const FALLBACK_LESSON: Lesson = {
  id: 'na',
  title: '即将上线',
  content: '本章节课件正在制作中...',
};

const getTrackById = (trackId?: string) => LEARNING_TRACKS.find(track => track.id === trackId) ?? null;

const getValidStageIndex = (track: LearningTrack | null, value?: string) => {
  if (!track) return null;

  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed >= 0 && parsed < track.stages.length ? parsed : null;
};

const getValidLessonIndex = (track: LearningTrack | null, stageIndex: number | null, value?: string) => {
  if (stageIndex === null) return null;

  const parsed = Number.parseInt(value ?? '', 10);
  const lessonCount = track?.stages[stageIndex]?.lessons.length ?? 0;

  return Number.isInteger(parsed) && parsed >= 0 && parsed < lessonCount ? parsed : null;
};

type ResolveLearningRouteStateArgs = {
  atlasTrackId: LearningTrack['id'];
  lessonIndexByTrack: IndexByTrack;
  pathname: string;
  stageIndexByTrack: IndexByTrack;
};

export const resolveLearningRouteState = ({
  atlasTrackId,
  lessonIndexByTrack,
  pathname,
  stageIndexByTrack,
}: ResolveLearningRouteStateArgs) => {
  const unitMatch = matchPath('/track/:trackId/level/:stageIndex/unit/:lessonIndex', pathname);
  const quizMatch = matchPath('/track/:trackId/level/:stageIndex/quiz', pathname);
  const legacyUnitMatch = matchPath('/level/:stageIndex/unit/:lessonIndex', pathname);
  const legacyQuizMatch = matchPath('/level/:stageIndex/quiz', pathname);
  const routeTrack = getTrackById(unitMatch?.params.trackId ?? quizMatch?.params.trackId);
  const routeStageIndex = getValidStageIndex(routeTrack, unitMatch?.params.stageIndex ?? quizMatch?.params.stageIndex);
  const routeLessonIndex = getValidLessonIndex(routeTrack, routeStageIndex, unitMatch?.params.lessonIndex);
  const isUnitRouteValid = Boolean(unitMatch) && routeStageIndex !== null && routeLessonIndex !== null;
  const isQuizRouteValid = Boolean(quizMatch) && routeStageIndex !== null;
  const activeTrack = routeTrack ?? getTrackById(atlasTrackId) ?? LEARNING_TRACKS[0];
  const activeTrackId = activeTrack.id;
  const persistedStageIndex = stageIndexByTrack[activeTrackId] ?? 0;
  const activeStageIndex = routeStageIndex ?? persistedStageIndex;
  const activeStage: LearningStage = activeTrack.stages[activeStageIndex] ?? activeTrack.stages[0];
  const persistedLessonIndex = lessonIndexByTrack[activeTrackId] ?? 0;
  const rememberedLessonIndex = persistedLessonIndex >= 0 && persistedLessonIndex < activeStage.lessons.length ? persistedLessonIndex : 0;
  const resolvedLessonIndex = routeLessonIndex ?? rememberedLessonIndex;
  const activeLesson = activeStage.lessons[resolvedLessonIndex] ?? FALLBACK_LESSON;
  const routeShellKey = pathname === '/'
    ? 'atlas'
    : isQuizRouteValid
      ? `quiz-${activeTrackId}-${activeStageIndex}`
      : isUnitRouteValid
        ? `learning-${activeTrackId}-${activeStageIndex}`
        : 'fallback';

  return {
    activeLesson,
    activeStage,
    activeStageIndex,
    activeTrack,
    activeTrackId,
    isQuizRouteValid,
    isUnitRouteValid,
    legacyQuizMatch,
    legacyUnitMatch,
    rememberedLessonIndex,
    persistedStageIndex,
    resolvedLessonIndex,
    routeShellKey,
  };
};
