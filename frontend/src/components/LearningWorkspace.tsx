import type { Lesson, LearningStage, LearningTrack } from '@/constants/learningPath';
import { ContentViewer } from './ContentViewer';
import { ModuleList } from './ModuleList';
import { RouteShell } from './RouteShell';

type LearningWorkspaceProps = {
  activeLesson: Lesson;
  activeLessonIndex: number;
  activeStage: LearningStage;
  activeTrack: LearningTrack;
  goToNextStage: () => void;
  hasNextStage: boolean;
  isLessonComplete: boolean;
  markLessonComplete: (lessonId: string) => void;
  onSelectLesson: (lessonIndex: number) => void;
  onStartQuiz: () => void;
  shellKey: string;
  toggleLessonComplete: (lessonId: string) => void;
  totalLessons: number;
  completedLessons: Record<string, boolean>;
};

export const LearningWorkspace = ({
  activeLesson,
  activeLessonIndex,
  activeStage,
  activeTrack,
  goToNextStage,
  hasNextStage,
  isLessonComplete,
  markLessonComplete,
  onSelectLesson,
  onStartQuiz,
  shellKey,
  toggleLessonComplete,
  totalLessons,
  completedLessons,
}: LearningWorkspaceProps) => {
  return (
    <RouteShell shellKey={shellKey}>
      <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 h-full">
        <ModuleList
          activeStage={activeStage}
          activeTrack={activeTrack}
          activeLessonIndex={activeLessonIndex}
          setActiveLessonIndex={onSelectLesson}
          completedLessons={completedLessons}
          toggleLessonComplete={toggleLessonComplete}
          startQuiz={onStartQuiz}
        />

        <ContentViewer
          activeLesson={activeLesson}
          activeStage={activeStage}
          activeTrack={activeTrack}
          activeLessonIndex={activeLessonIndex}
          setActiveLessonIndex={onSelectLesson}
          goToNextStage={goToNextStage}
          hasNextStage={hasNextStage}
          isLessonComplete={isLessonComplete}
          toggleLessonComplete={toggleLessonComplete}
          markLessonComplete={markLessonComplete}
          totalLessons={totalLessons}
        />
      </div>
    </RouteShell>
  );
};
