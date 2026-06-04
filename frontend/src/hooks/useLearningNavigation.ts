import type { NavigateFunction } from 'react-router-dom';
import type { LearningTrack } from '@/constants/learningPath';
import type { IndexByTrack } from './useLearningProgress';

type UseLearningNavigationArgs = {
  activeStageIndex: number;
  activeTrack: LearningTrack;
  activeTrackId: LearningTrack['id'];
  ensureTrackIndexes: (trackId: LearningTrack['id']) => void;
  navigate: NavigateFunction;
  rememberedLessonIndex: number;
  resetQuizState: () => void;
  resolvedLessonIndex: number;
  setAtlasTrackId: (trackId: LearningTrack['id']) => void;
  setLessonIndexByTrack: React.Dispatch<React.SetStateAction<IndexByTrack>>;
  setStageIndexByTrack: React.Dispatch<React.SetStateAction<IndexByTrack>>;
};

export const useLearningNavigation = ({
  activeStageIndex,
  activeTrack,
  activeTrackId,
  ensureTrackIndexes,
  navigate,
  rememberedLessonIndex,
  resetQuizState,
  resolvedLessonIndex,
  setAtlasTrackId,
  setLessonIndexByTrack,
  setStageIndexByTrack,
}: UseLearningNavigationArgs) => {
  const syncTrackLocation = (trackId: LearningTrack['id'], stageIndex: number, lessonIndex: number) => {
    setAtlasTrackId(trackId);
    setStageIndexByTrack(prev => ({ ...prev, [trackId]: stageIndex }));
    setLessonIndexByTrack(prev => ({ ...prev, [trackId]: lessonIndex }));
  };

  const selectStage = (stageIndex: number, trackId = activeTrackId) => {
    syncTrackLocation(trackId, stageIndex, 0);
    resetQuizState();
    navigate(`/track/${trackId}/level/${stageIndex}/unit/0`);
  };

  const selectTrack = (trackId: LearningTrack['id']) => {
    setAtlasTrackId(trackId);
    resetQuizState();
    ensureTrackIndexes(trackId);
  };

  const selectLesson = (lessonIndex: number) => {
    syncTrackLocation(activeTrackId, activeStageIndex, lessonIndex);
    resetQuizState();
    navigate(`/track/${activeTrackId}/level/${activeStageIndex}/unit/${lessonIndex}`);
  };

  const startQuiz = () => {
    syncTrackLocation(activeTrackId, activeStageIndex, resolvedLessonIndex);
    resetQuizState();
    navigate(`/track/${activeTrackId}/level/${activeStageIndex}/quiz`);
  };

  const exitQuiz = () => {
    resetQuizState();
    navigate(`/track/${activeTrackId}/level/${activeStageIndex}/unit/${rememberedLessonIndex}`);
  };

  const handleNextStage = () => {
    if (activeStageIndex < activeTrack.stages.length - 1) {
      selectStage(activeStageIndex + 1);
    }
  };

  const openAtlas = () => {
    syncTrackLocation(activeTrackId, activeStageIndex, resolvedLessonIndex);
    resetQuizState();
    navigate('/');
  };

  return {
    exitQuiz,
    handleNextStage,
    openAtlas,
    selectLesson,
    selectStage,
    selectTrack,
    startQuiz,
    syncTrackLocation,
  };
};
