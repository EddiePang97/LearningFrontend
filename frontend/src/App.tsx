import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_TRACK_ID, LEARNING_TRACKS } from './constants/learningPath';
import { useLearningNavigation } from './hooks/useLearningNavigation';
import { useLearningProgress } from './hooks/useLearningProgress';
import { useQuizSession } from './hooks/useQuizSession';
import { resolveLearningRouteState } from './lib/learningRouteState';
import { AtlasWorkspace } from './components/AtlasWorkspace';
import { Navbar } from './components/Navbar';
import { LearningWorkspace } from './components/LearningWorkspace';
import { QuizWorkspace } from './components/QuizWorkspace';

function App() {
  // --- Persistence & State ---
  const navigate = useNavigate();
  const location = useLocation();
  const {
    atlasTrackId,
    setAtlasTrackId,
    stageIndexByTrack,
    setStageIndexByTrack,
    lessonIndexByTrack,
    setLessonIndexByTrack,
    progressPercent,
    totalXP,
    ensureTrackIndexes,
    getCompletedLessons,
    toggleLessonComplete,
    markLessonComplete,
  } = useLearningProgress();
  const {
    currentQuizIndex,
    score,
    quizFinished,
    selectedOption,
    isCorrect,
    resetQuizState,
    handleAnswer,
  } = useQuizSession();

  // --- Derived State ---
  const {
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
  } = resolveLearningRouteState({
    atlasTrackId,
    lessonIndexByTrack,
    pathname: location.pathname,
    stageIndexByTrack,
  });
  const completedLessons = getCompletedLessons(activeTrackId);

  const {
    exitQuiz,
    handleNextStage,
    openAtlas,
    selectLesson,
    selectStage,
    selectTrack,
    startQuiz,
  } = useLearningNavigation({
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
  });

  const atlasRoute = (
    <AtlasWorkspace
      activeStageIndex={persistedStageIndex}
      activeTrackId={atlasTrackId}
      completedLessons={completedLessons}
      onSelectStage={selectStage}
      onSelectTrack={selectTrack}
      stages={activeTrack.stages}
      tracks={LEARNING_TRACKS}
    />
  );

  const learningRoute = isUnitRouteValid ? (
    <LearningWorkspace
      activeLesson={activeLesson}
      activeLessonIndex={resolvedLessonIndex}
      activeStage={activeStage}
      completedLessons={completedLessons}
      goToNextStage={handleNextStage}
      hasNextStage={activeStageIndex < activeTrack.stages.length - 1}
      isLessonComplete={Boolean(completedLessons[activeLesson.id])}
      markLessonComplete={lessonId => markLessonComplete(activeTrackId, lessonId)}
      onSelectLesson={selectLesson}
      onStartQuiz={startQuiz}
      shellKey="learning-shell"
      toggleLessonComplete={lessonId => toggleLessonComplete(activeTrackId, lessonId)}
      totalLessons={activeStage.lessons.length}
    />
  ) : (
    <Navigate to="/" replace />
  );

  const quizRoute = isQuizRouteValid ? (
    <QuizWorkspace
      activeStage={activeStage}
      currentQuizIndex={currentQuizIndex}
      handleAnswer={optionIndex => handleAnswer(activeStage, optionIndex)}
      handleNextStage={handleNextStage}
      hasNextStage={activeStageIndex < activeTrack.stages.length - 1}
      isCorrect={isCorrect}
      onExitQuiz={exitQuiz}
      quizFinished={quizFinished}
      score={score}
      selectedOption={selectedOption}
      shellKey="quiz-shell"
    />
  ) : (
    <Navigate to="/" replace />
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-gray-200 selection:bg-purple-500/30 relative overflow-x-hidden overflow-y-visible">
      <div className="pointer-events-none absolute inset-0 ambient-grid opacity-40" />
      <div className="pointer-events-none absolute -top-44 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[130px] aurora-orb" />
      <div className="pointer-events-none absolute top-1/3 -right-48 h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-[120px] aurora-orb" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/6 to-transparent" />
      <Navbar
        progress={progressPercent}
        xp={totalXP}
        onOpenAtlas={openAtlas}
      />

      <AnimatePresence mode="wait">
      <Routes location={location} key={routeShellKey}>
          <Route path="/" element={atlasRoute} />
          <Route path="/track/:trackId/level/:stageIndex/unit/:lessonIndex" element={learningRoute} />
          <Route path="/track/:trackId/level/:stageIndex/quiz" element={quizRoute} />
          <Route
            path="/level/:stageIndex/unit/:lessonIndex"
            element={legacyUnitMatch ? (
              <Navigate
                to={`/track/${DEFAULT_TRACK_ID}/level/${legacyUnitMatch.params.stageIndex}/unit/${legacyUnitMatch.params.lessonIndex}`}
                replace
              />
            ) : <Navigate to="/" replace />}
          />
          <Route
            path="/level/:stageIndex/quiz"
            element={legacyQuizMatch ? (
              <Navigate
                to={`/track/${DEFAULT_TRACK_ID}/level/${legacyQuizMatch.params.stageIndex}/quiz`}
                replace
              />
            ) : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-black/40 text-center backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-600 text-[10px] font-black tracking-[0.3em] uppercase">
            &copy; 2026 Learning Atlas &bull; 4 tracks, 40+ levels
          </p>
          <div className="flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span>Frontend</span>
            <span>Backend</span>
            <span>Full Stack</span>
            <span>Network</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
