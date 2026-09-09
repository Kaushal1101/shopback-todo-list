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

**Trade-off:** The proxy only works while the Vite dev server is running. This is a non-issue for local development but means the backend cannot be accessed directly from a browser during development without running on a separate port. If external API access were needed, we'd switch back to separate ports + CORS.

**Configured in:** `frontend/vite.config.js`
```js
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```
