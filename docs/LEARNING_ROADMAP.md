# Learning Atlas Roadmap

This project should become a four-track learning atlas: Frontend, Backend, Full Stack, and Network. Each track must have at least 10 levels, and each track should be strong enough to stand as its own learning path. Every track keeps the same product language you already built: levels, units, labs, quizzes, missions, outcomes, and completion checklists.

Minimum scope:

- Frontend Engineering: 10+ levels
- Backend Engineering: 10+ levels
- Full Stack Product Engineering: 10+ levels
- Network and Web Infrastructure: 10+ levels
- Total atlas baseline: 40+ levels

## Track 1: Frontend Engineering

The existing 10 levels belong here. Keep them as the first complete 10-level track.

Suggested levels:

1. HTML, CSS, layout, responsive design
2. JavaScript runtime, scope, async, prototypes
3. Tooling, TypeScript, bundlers, debugging
4. React foundations, hooks, state, component patterns
5. Browser rendering, performance, workers, caching
6. Frontend security: XSS, CSRF, CORS, CSP, JWT
7. Node.js bridge concepts for frontend engineers
8. Algorithms and data structures for UI work
9. Architecture: design patterns, micro-frontends, SOLID
10. Advanced systems: concurrency, reactivity, observability, virtualization

## Track 2: Backend Engineering

Backend should teach how real services are designed, protected, deployed, and observed. This track also needs at least 10 levels, not just a small backend appendix.

Suggested levels:

1. Node.js and server fundamentals
2. REST API design and validation
3. Authentication, authorization, sessions, tokens
4. SQL, PostgreSQL, indexing, transactions
5. NoSQL, Redis, caching strategy
6. Queues, background jobs, scheduling
7. File upload, object storage, streaming
8. Observability: logs, metrics, traces, alerts
9. Security: rate limits, secrets, OWASP, threat modeling
10. System design for backend services

## Track 3: Full Stack Product Engineering

Full stack should connect frontend and backend into real product workflows. This track needs its own 10-level path because full stack is not just "frontend plus a little API".

Suggested levels:

1. Product requirements into technical scope
2. End-to-end feature architecture
3. Database schema plus API plus UI flow
4. Forms, validation, optimistic UI, error states
5. Authenticated dashboards and role-based access
6. Payments or subscriptions
7. Testing strategy: unit, integration, E2E
8. Deployment, environments, CI/CD
9. Performance budgets across client and server
10. Capstone: production-style SaaS project

## Track 4: Network and Web Infrastructure

Network should make the web feel less magical and more debuggable. This track needs its own 10-level path because network knowledge supports both frontend and backend engineering.

Suggested levels:

1. HTTP request lifecycle
2. DNS, domains, records, propagation
3. TCP/IP, UDP, sockets, latency
4. TLS, HTTPS, certificates
5. Browser networking, connection reuse, HTTP/2, HTTP/3
6. CDN, cache headers, edge routing
7. Proxies, reverse proxies, load balancers
8. WebSocket, SSE, realtime protocols
9. Network security: CORS, CSRF, MITM, WAF basics
10. Debugging with DevTools, curl, dig, traceroute, Wireshark

## Product Model

Use this hierarchy when the app grows:

```txt
Atlas
  Track
    Level
      Unit
        Lesson Content
        Interactive Lab
      Quiz
      Project
```

## Data Model Direction

The original `LearningStage` model was good for a single track. Multi-track growth uses a parent `LearningTrack`:

```ts
interface LearningTrack {
  id: string;
  title: string;
  description: string;
  color: string;
  stages: LearningStage[];
}
```

Later, course content can move from TypeScript constants to MDX or structured content files:

```txt
src/content/
  frontend/
  backend/
  fullstack/
  network/
```

## Suggested Build Order

1. Keep the existing frontend track intact.
2. Fill Backend, Full Stack, and Network placeholder levels with real lessons.
3. Extract progress storage to support richer `trackId + lessonId` metadata.
4. Add projects after every 2-3 levels.
5. Add review mode, wrong-answer history, and learning recommendations.
6. Add real labs for every track, not only frontend.
