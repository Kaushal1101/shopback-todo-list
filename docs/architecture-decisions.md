# Architecture Decisions

A record of key architectural choices made during this project and the reasoning behind them.

---

## ADR-1: Single port via Vite proxy instead of separate ports with CORS

**Decision:** Run the frontend and backend on separate ports (5173 and 8000), but use Vite's built-in proxy to forward `/api` requests to the backend. No CORS middleware on the FastAPI side.

**Context:** The default approach for a React + FastAPI setup is to run each on its own port and configure CORS middleware on the backend so the browser allows cross-origin requests. This is more common in production-style setups.

**Why we chose the Vite proxy instead:**
- The browser's Same-Origin Policy only blocks requests when the browser itself sees two different origins. Vite's proxy forwards requests server-side, so the browser only ever sees one origin (`localhost:5173`). CORS is never triggered.
- This removes the need for CORS configuration entirely — one less moving part.
- The frontend code is identical either way (`fetch('/api/tasks')` works the same). No added complexity.
- For a minimal local app with no external clients (no mobile app, no third-party consumers), there is no benefit to exposing the backend on a separate accessible port.

**Trade-off:** The proxy only works while the Vite dev server is running. The backend still runs independently on `localhost:8000` — including `/docs` — so direct API access is always available during development. The proxy purely eliminates the need for CORS headers on browser requests originating from the frontend. If external clients (mobile, third-party) needed to hit the API, no additional changes would be required.

**Configured in:** `frontend/vite.config.js`
```js
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

---

## ADR-2: All frontend state lives in App.jsx — no external state library

**Decision:** Keep all React state (`tasks`, `editingTask`, `error`) in `App.jsx` and pass it down as props. No Redux, Zustand, or React Context.

**Context:** Larger React apps typically reach for a state management library when state needs to be shared across many components that aren't in a direct parent-child relationship ("prop drilling"). Common choices are Redux Toolkit, Zustand, or React Context.

**Why we chose centralized local state instead:**
- The component tree is shallow: `App → TaskList → TaskItem` and `App → TaskForm`. Every component that needs state is at most one level from `App`, so prop drilling is not a problem.
- Adding a library introduces boilerplate (stores, actions, reducers) that would dwarf the actual business logic in an app this size.
- All data-fetching and mutation logic living in one file (`App.jsx`) makes the data flow easy to follow end-to-end.

**Trade-off:** If the app grows significantly — more pages, deeper component nesting, or state shared across sibling trees — this approach will become unwieldy and a state library would be the right call.
