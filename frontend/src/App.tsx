import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { matchPath, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_TRACK_ID, LEARNING_TRACKS } from './constants/learningPath';
import type { LearningTrack } from './constants/learningPath';
import { Navbar } from './components/Navbar';
import { CourseAtlasHome } from './components/CourseAtlasHome';
import { ModuleList } from './components/ModuleList';
import { ContentViewer } from './components/ContentViewer';
import { QuizLab } from './components/QuizLab';

const TOTAL_LESSONS = LEARNING_TRACKS.reduce(
  (trackCount, track) => trackCount + track.stages.reduce((stageCount, stage) => stageCount + stage.lessons.length, 0),
  0
);

const ACTIVE_TRACK_STORAGE_KEY = 'learning-atlas.activeTrackId';
const STAGE_INDEX_BY_TRACK_STORAGE_KEY = 'learning-atlas.stageIndexByTrack';
const LESSON_INDEX_BY_TRACK_STORAGE_KEY = 'learning-atlas.lessonIndexByTrack';
const COMPLETED_LESSONS_BY_TRACK_STORAGE_KEY = 'learning-atlas.completedLessonsByTrack';

type ProgressByTrack = Partial<Record<LearningTrack['id'], Record<string, boolean>>>;
type IndexByTrack = Partial<Record<LearningTrack['id'], number>>;

const getTrackById = (trackId?: string) => {
  return LEARNING_TRACKS.find(track => track.id === trackId) ?? null;
};

const getInitialTrackId = (): LearningTrack['id'] => {
  const saved = localStorage.getItem(ACTIVE_TRACK_STORAGE_KEY);
  return getTrackById(saved ?? undefined)?.id ?? DEFAULT_TRACK_ID;
};

const getInitialIndexByTrack = (storageKey: string): IndexByTrack => {
  try {
    const saved = localStorage.getItem(storageKey);
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
    const saved = localStorage.getItem(COMPLETED_LESSONS_BY_TRACK_STORAGE_KEY);
    return saved ? JSON.parse(saved) as ProgressByTrack : {};
  } catch {
    return {};
  }
};

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

function App() {
  // --- Persistence & State ---
  const navigate = useNavigate();
  const location = useLocation();
  const [atlasTrackId, setAtlasTrackId] = useState<LearningTrack['id']>(getInitialTrackId);
  const [stageIndexByTrack, setStageIndexByTrack] = useState<IndexByTrack>(() => getInitialIndexByTrack(STAGE_INDEX_BY_TRACK_STORAGE_KEY));
  const [lessonIndexByTrack, setLessonIndexByTrack] = useState<IndexByTrack>(() => getInitialIndexByTrack(LESSON_INDEX_BY_TRACK_STORAGE_KEY));
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedLessonsByTrack, setCompletedLessonsByTrack] = useState<ProgressByTrack>(getInitialCompletedLessonsByTrack);
  const quizAdvanceTimeoutRef = useRef<number | null>(null);

  // --- Derived State ---
  const unitMatch = matchPath('/track/:trackId/level/:stageIndex/unit/:lessonIndex', location.pathname);
  const quizMatch = matchPath('/track/:trackId/level/:stageIndex/quiz', location.pathname);
  const legacyUnitMatch = matchPath('/level/:stageIndex/unit/:lessonIndex', location.pathname);
  const legacyQuizMatch = matchPath('/level/:stageIndex/quiz', location.pathname);
  const routeTrack = getTrackById(unitMatch?.params.trackId ?? quizMatch?.params.trackId);
  const routeStageIndex = getValidStageIndex(routeTrack, unitMatch?.params.stageIndex ?? quizMatch?.params.stageIndex);
  const routeLessonIndex = getValidLessonIndex(routeTrack, routeStageIndex, unitMatch?.params.lessonIndex);
  const isUnitRouteValid = Boolean(unitMatch) && routeStageIndex !== null && routeLessonIndex !== null;
  const isQuizRouteValid = Boolean(quizMatch) && routeStageIndex !== null;
  const activeTrack = routeTrack ?? getTrackById(atlasTrackId) ?? LEARNING_TRACKS[0];
  const activeTrackId = activeTrack.id;
  const persistedStageIndex = stageIndexByTrack[activeTrackId] ?? 0;
  const activeStageIndex = routeStageIndex ?? persistedStageIndex;
  const activeStage = activeTrack.stages[activeStageIndex] ?? activeTrack.stages[0];
  const persistedLessonIndex = lessonIndexByTrack[activeTrackId] ?? 0;
  const rememberedLessonIndex = persistedLessonIndex >= 0 && persistedLessonIndex < activeStage.lessons.length ? persistedLessonIndex : 0;
  const resolvedLessonIndex = routeLessonIndex ?? rememberedLessonIndex;
  const activeLesson = activeStage.lessons[resolvedLessonIndex] || { id: 'na', title: '即将上线', content: '本章节课件正在制作中...' };
  const completedLessons = completedLessonsByTrack[activeTrackId] ?? {};
  const totalCompleted = Object.values(completedLessonsByTrack).reduce(
    (count, trackProgress) => count + Object.values(trackProgress ?? {}).filter(Boolean).length,
    0
  );
  const progressPercent = TOTAL_LESSONS > 0 ? Math.min(100, Math.round((totalCompleted / TOTAL_LESSONS) * 100)) : 0;
  const totalXP = totalCompleted * 10;
  const routeShellKey = location.pathname === '/'
    ? 'atlas'
    : isQuizRouteValid
      ? `quiz-${activeTrackId}-${activeStageIndex}`
      : isUnitRouteValid
        ? `learning-${activeTrackId}-${activeStageIndex}`
        : 'fallback';

  const clearQuizAdvanceTimeout = () => {
    if (quizAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(quizAdvanceTimeoutRef.current);
      quizAdvanceTimeoutRef.current = null;
    }
  };

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem(ACTIVE_TRACK_STORAGE_KEY, activeTrackId);
  }, [activeTrackId]);

  useEffect(() => {
    localStorage.setItem(STAGE_INDEX_BY_TRACK_STORAGE_KEY, JSON.stringify(stageIndexByTrack));
  }, [stageIndexByTrack]);

  useEffect(() => {
    localStorage.setItem(LESSON_INDEX_BY_TRACK_STORAGE_KEY, JSON.stringify(lessonIndexByTrack));
  }, [lessonIndexByTrack]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_LESSONS_BY_TRACK_STORAGE_KEY, JSON.stringify(completedLessonsByTrack));
  }, [completedLessonsByTrack]);

  useEffect(() => () => clearQuizAdvanceTimeout(), []);

  // --- Handlers ---
  const resetQuizState = () => {
    clearQuizAdvanceTimeout();
    setQuizFinished(false);
    setCurrentQuizIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const selectStage = (stageIndex: number, trackId = activeTrackId) => {
    setAtlasTrackId(trackId);
    setStageIndexByTrack(prev => ({ ...prev, [trackId]: stageIndex }));
    setLessonIndexByTrack(prev => ({ ...prev, [trackId]: 0 }));
    resetQuizState();
    navigate(`/track/${trackId}/level/${stageIndex}/unit/0`);
  };

  const selectTrack = (trackId: LearningTrack['id']) => {
    setAtlasTrackId(trackId);
    resetQuizState();
    setStageIndexByTrack(prev => prev[trackId] === undefined ? { ...prev, [trackId]: 0 } : prev);
    setLessonIndexByTrack(prev => prev[trackId] === undefined ? { ...prev, [trackId]: 0 } : prev);
  };

  const selectLesson = (lessonIndex: number) => {
    setAtlasTrackId(activeTrackId);
    setStageIndexByTrack(prev => ({ ...prev, [activeTrackId]: activeStageIndex }));
    setLessonIndexByTrack(prev => ({ ...prev, [activeTrackId]: lessonIndex }));
    resetQuizState();
    navigate(`/track/${activeTrackId}/level/${activeStageIndex}/unit/${lessonIndex}`);
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonsByTrack(prev => {
      const trackProgress = prev[activeTrackId] ?? {};

      if (trackProgress[lessonId]) {
        const nextCompletedLessons = { ...trackProgress };
        delete nextCompletedLessons[lessonId];
        return {
          ...prev,
          [activeTrackId]: nextCompletedLessons
        };
      }

      return {
        ...prev,
        [activeTrackId]: {
          ...trackProgress,
          [lessonId]: true
        }
      };
    });
  };

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessonsByTrack(prev => {
      const trackProgress = prev[activeTrackId] ?? {};
      if (trackProgress[lessonId]) {
        return prev;
      }

      return {
        ...prev,
        [activeTrackId]: {
          ...trackProgress,
          [lessonId]: true
        }
      };
    });
  };

  const startQuiz = () => {
    setAtlasTrackId(activeTrackId);
    setStageIndexByTrack(prev => ({ ...prev, [activeTrackId]: activeStageIndex }));
    setLessonIndexByTrack(prev => ({ ...prev, [activeTrackId]: resolvedLessonIndex }));
    resetQuizState();
    navigate(`/track/${activeTrackId}/level/${activeStageIndex}/quiz`);
  };

  const exitQuiz = () => {
    resetQuizState();
    navigate(`/track/${activeTrackId}/level/${activeStageIndex}/unit/${rememberedLessonIndex}`);
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    const correct = optionIndex === activeStage.quizzes[currentQuizIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);

    clearQuizAdvanceTimeout();
    quizAdvanceTimeoutRef.current = window.setTimeout(() => {
      quizAdvanceTimeoutRef.current = null;
      if (currentQuizIndex < activeStage.quizzes.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setQuizFinished(true);
      }
    }, 800);
  };

  const handleNextStage = () => {
    if (activeStageIndex < activeTrack.stages.length - 1) {
      selectStage(activeStageIndex + 1);
    }
  };

  const atlasRoute = (
    <CourseAtlasHome
      key="atlas-home"
      tracks={LEARNING_TRACKS}
      activeTrackId={atlasTrackId}
      onSelectTrack={selectTrack}
      stages={activeTrack.stages}
      activeStageIndex={persistedStageIndex}
      completedLessons={completedLessons}
      onSelectStage={selectStage}
    />
  );

  const learningRoute = isUnitRouteValid ? (
    <div
      key="learning-shell"
      className="relative z-10 grow flex flex-col max-w-[1680px] mx-auto w-full p-4 md:p-6 xl:p-8 transition-all duration-700"
    >
      <main className="grow flex flex-col min-w-0">
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 h-full">
          <ModuleList
            activeStage={activeStage}
            activeLessonIndex={resolvedLessonIndex}
            setActiveLessonIndex={selectLesson}
            completedLessons={completedLessons}
            toggleLessonComplete={toggleLessonComplete}
            startQuiz={startQuiz}
          />

          <ContentViewer
            activeLesson={activeLesson}
            activeStage={activeStage}
            activeLessonIndex={resolvedLessonIndex}
            setActiveLessonIndex={selectLesson}
            goToNextStage={handleNextStage}
            hasNextStage={activeStageIndex < activeTrack.stages.length - 1}
            isLessonComplete={Boolean(completedLessons[activeLesson.id])}
            toggleLessonComplete={toggleLessonComplete}
            markLessonComplete={markLessonComplete}
            totalLessons={activeStage.lessons.length}
          />
        </div>
      </main>
    </div>
  ) : (
    <Navigate to="/" replace />
  );

  const quizRoute = isQuizRouteValid ? (
    <div
      key="quiz-shell"
      className="relative z-10 grow flex flex-col max-w-[1680px] mx-auto w-full p-4 md:p-6 xl:p-8 transition-all duration-700"
    >
      <main className="grow flex flex-col min-w-0">
        <QuizLab
          activeStage={activeStage}
          currentQuizIndex={currentQuizIndex}
          score={score}
          quizFinished={quizFinished}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
          handleAnswer={handleAnswer}
          onExitQuiz={exitQuiz}
          handleNextStage={handleNextStage}
          hasNextStage={activeStageIndex < activeTrack.stages.length - 1}
        />
      </main>
    </div>
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
        onOpenAtlas={() => {
          setAtlasTrackId(activeTrackId);
          setStageIndexByTrack(prev => ({ ...prev, [activeTrackId]: activeStageIndex }));
          setLessonIndexByTrack(prev => ({ ...prev, [activeTrackId]: resolvedLessonIndex }));
          resetQuizState();
          navigate('/');
        }}
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
