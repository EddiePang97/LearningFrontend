import type { LearningStage, LearningTrack } from '@/constants/learningPath';
import { QuizLab } from './QuizLab';
import { RouteShell } from './RouteShell';

type QuizWorkspaceProps = {
  activeStage: LearningStage;
  activeTrack: LearningTrack;
  currentQuizIndex: number;
  handleAnswer: (optionIndex: number) => void;
  handleNextStage: () => void;
  hasNextStage: boolean;
  isCorrect: boolean | null;
  onExitQuiz: () => void;
  quizFinished: boolean;
  score: number;
  selectedOption: number | null;
  shellKey: string;
};

export const QuizWorkspace = ({
  activeStage,
  activeTrack,
  currentQuizIndex,
  handleAnswer,
  handleNextStage,
  hasNextStage,
  isCorrect,
  onExitQuiz,
  quizFinished,
  score,
  selectedOption,
  shellKey,
}: QuizWorkspaceProps) => {
  return (
    <RouteShell shellKey={shellKey}>
      <QuizLab
        activeStage={activeStage}
        activeTrack={activeTrack}
        currentQuizIndex={currentQuizIndex}
        score={score}
        quizFinished={quizFinished}
        selectedOption={selectedOption}
        isCorrect={isCorrect}
        handleAnswer={handleAnswer}
        onExitQuiz={onExitQuiz}
        handleNextStage={handleNextStage}
        hasNextStage={hasNextStage}
      />
    </RouteShell>
  );
};
