# Learning Atlas

Learning Atlas is a React + TypeScript learning platform for building a long-term software engineering roadmap. The current product focuses on structured course tracks, interactive labs, quizzes, progress tracking, and route-based lesson navigation.

## Repository Layout

- `frontend/` — the Learning Atlas app built with React, Vite, and TypeScript
- `docs/` — roadmap and project notes for the learning platform

## Current Scope

- Frontend track with 10 focused levels
- Interactive labs for CSS, JavaScript, React, browser internals, security, algorithms, and architecture
- Level quizzes with local progress persistence
- Route-based navigation for direct lesson and quiz links
- Lazy-loaded lab modules to keep the learning shell responsive

## Future Direction

The next version should evolve from a frontend-only course into a multi-track learning system:

- Frontend: HTML, CSS, JavaScript, TypeScript, React, browser performance, frontend architecture
- Backend: Node.js, API design, databases, auth, caching, queues, observability
- Full Stack: product flows, end-to-end architecture, deployment, testing, real projects
- Network: HTTP, DNS, TCP/IP, TLS, CDN, proxies, WebSocket, security fundamentals

See [docs/LEARNING_ROADMAP.md](./docs/LEARNING_ROADMAP.md) for the proposed structure.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Framer Motion
- GSAP
- React Markdown
- Lucide React

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Recommended Next Refactors

- Move course content out of TypeScript constants into Markdown/MDX or structured content files.
- Extract learning progress and quiz state from `App.tsx` into custom hooks.
- Add a shared lab component system for repeated panel, metric, toolbar, and shell layouts.
- Show quiz explanations and build a wrong-answer review mode.
- Add automated tests for route validation, progress persistence, and quiz behavior.
