# Code Health Report

Last reviewed: 2026-05-15

## Status

The project builds and passes lint. The codebase is healthy enough to keep growing. It now has a track-aware direction: Frontend, Backend, Full Stack, and Network should each have at least 10 levels.

## Cleaned Up

- Replaced Vite template README with a project-specific README.
- Added a multi-track learning roadmap in `docs/LEARNING_ROADMAP.md`.
- Replaced the default Vite favicon with `public/atlas.svg`.
- Removed unused default assets: `public/vite.svg` and `src/assets/react.svg`.
- Removed the unused `Sidebar.tsx` component.
- Updated app identity from frontend-only branding to `Learning Atlas`.
- Removed footer placeholder links that used `href="#"`.
- Fixed progress counting so only truthy completed lessons count.
- Fixed lesson completion storage so uncompleted lessons are removed instead of saved as `false`.
- Fixed "Next Unit" behavior so it marks a lesson complete instead of toggling an already completed lesson back to incomplete.
- Added the first track-aware data model direction: 4 tracks with a 40+ level baseline.

## Current File Groups

### App Shell

- `src/App.tsx`: Main route, progress, quiz, and storage coordinator. It works, but it now has too many responsibilities.
- `src/components/Navbar.tsx`: Top navigation and progress display. Reasonable to keep as-is for now.
- `src/components/CourseAtlasHome.tsx`: Home/atlas screen. Visually strong, but GSAP animation logic is mixed with content layout.
- `src/components/ModuleList.tsx`: Lesson list and quiz entry. Good candidate for small cleanup after multi-track routing exists.
- `src/components/ContentViewer.tsx`: Lesson renderer and lab loader. The lazy lab registry is useful, but it will get large as more tracks are added.
- `src/components/QuizLab.tsx`: Quiz UI. Should show explanations and answer review in the next product pass.

### Content

- `src/constants/learningPath.ts`: Single-track data model. Good for now, but should become a track-aware model.
- `src/constants/stages/*.ts`: Course content. This should eventually move to Markdown/MDX or structured content files.

### Labs

- `src/components/labs/*.tsx`: The strongest part of the project. Keep them, but extract shared lab layout components before adding many more.

## Main Technical Debt

1. `App.tsx` mixes routing, track state, persistence, quiz state, progress state, and navigation handlers.
2. Content is hardcoded in TypeScript, which makes editing and translation harder.
3. Lab components repeat similar shells, panels, headers, metrics, and control sections.
4. Quiz data has explanations, but the UI does not yet use them well.
5. The current progress storage only knows lessons, not tracks.
6. `dangerouslySetInnerHTML` is used intentionally in security labs, but should stay isolated in clearly named demo-only components.

## Recommended Refactor Order

1. Extract `useLearningProgress` for track-aware localStorage reads/writes and completion logic.
2. Extract `useQuizSession` from `App.tsx`.
3. Add a shared `LabShell` and common lab UI primitives.
4. Move course content out of TypeScript stage files.
5. Fill Backend, Full Stack, and Network placeholders with real units and labs.
6. Add test coverage for routing, progress, quiz scoring, and completion behavior.
