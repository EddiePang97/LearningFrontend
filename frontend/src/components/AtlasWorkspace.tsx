import type { LearningStage, LearningTrack } from '@/constants/learningPath';
import { CourseAtlasHome } from './CourseAtlasHome';

type AtlasWorkspaceProps = {
  activeStageIndex: number;
  activeTrackId: LearningTrack['id'];
  completedLessons: Record<string, boolean>;
  onSelectStage: (stageIndex: number, trackId?: LearningTrack['id']) => void;
  onSelectTrack: (trackId: LearningTrack['id']) => void;
  stages: LearningStage[];
  tracks: LearningTrack[];
};

export const AtlasWorkspace = ({
  activeStageIndex,
  activeTrackId,
  completedLessons,
  onSelectStage,
  onSelectTrack,
  stages,
  tracks,
}: AtlasWorkspaceProps) => {
  return (
    <CourseAtlasHome
      key="atlas-home"
      tracks={tracks}
      activeTrackId={activeTrackId}
      onSelectTrack={onSelectTrack}
      stages={stages}
      activeStageIndex={activeStageIndex}
      completedLessons={completedLessons}
      onSelectStage={onSelectStage}
    />
  );
};
