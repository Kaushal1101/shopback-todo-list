# AI Usage Log

Tracks how the developer directed Claude during this project — specifically decisions and information provided by the developer vs. delegated to AI.

---

## Developer-Driven Decisions

- **Tech stack** — Chose React, Python + FastAPI, and SQLite independently before engaging Claude. Claude validated and filled in gaps (Vite, CORS discussion).
- **Goal framing** — Explicitly set the bar as functional over impressive; reliability over polish. This shaped all subsequent architectural recommendations.
- **Behavioural constraints** — Set rules for how Claude should operate: no commands or commits without approval, small focused changes, always show code snippets with explanations.
- **API style** — Chose REST over GraphQL when presented with options.
- **Repo structure** — Chose monorepo (`frontend/` + `backend/`) over separate repos when presented with options.
- **Persistence priority** — Identified persistence as the most important feature, which guided the decision to keep the FastAPI + SQLite backend rather than simplify to localStorage.
- **Single-port via Vite proxy** — Accepted Claude's recommendation after asking about the trade-offs; approved dropping CORS middleware.
- **Deadline field** — Independently decided to add a nullable `deadline` field to the task model, and specified that PUT should support removing it by passing `null`.
- **Test-first planning** — Directed Claude to add a test case definition step before any code is written, to guide logic and catch edge cases early.
- **Backend-first build order** — Decided to build and validate the backend via Postman/FastAPI docs before touching the frontend.
- **Schema ownership in tests** — Questioned why the test fixture was duplicating the `CREATE TABLE` SQL rather than importing it from `database.py`. Led to `create_tables(conn)` being importable and reused in tests.
- **Title validation rules** — Independently decided to reject titles made of only special characters, not just empty/whitespace titles.
- **Manual validation step** — Chose to validate all endpoints via FastAPI docs (`/docs`) before moving to the frontend.

---

- **Frontend test-first** — Directed Claude to write the frontend test suite before any component code was written, consistent with the backend approach.
- **Error message clarity** — Noticed that submitting a title of only special characters showed a generic "something went wrong" message. Directed Claude to surface the actual backend validation message from FastAPI's response body.

---

## Delegated to Claude

- File and folder layout within the chosen stack
- Recommending Vite as the React build tool
- Explaining CORS and the Vite proxy alternative
- Recommending SQLite over Postgres/MongoDB for this scale
- Structuring the backend plan (`agent-plans/backend-plan.md`)
- Writing the test cases for each endpoint
- Documentation format and structure (CLAUDE.md, architecture-decisions.md, this file)
- Structuring the frontend plan (`agent-plans/frontend-plan.md`)
- Writing the frontend test suite (Vitest + React Testing Library)
- All React component implementation (App.jsx, TaskForm.jsx, TaskList.jsx, TaskItem.jsx, api.js)
- Identifying and fixing Codex-flagged issues (form clears on error, stale edit form after delete, empty catch block, useEffect for form population, missing aria-label)
