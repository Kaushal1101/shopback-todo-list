# Frontend Build Plan

## Overview

Build a React + Vite frontend that talks to the FastAPI backend via REST. Validate visually in the browser after each component is wired up. No routing needed — single page app.

---

## File Structure

```
frontend/
├── index.html
├── vite.config.js        # Proxy /api to localhost:8000
├── package.json
└── src/
    ├── main.jsx          # Entry point, mounts App
    ├── App.jsx           # Root component, holds all state
    ├── api.js            # All fetch calls to the backend
    ├── App.css           # Basic styling
    └── components/
        ├── TaskList.jsx  # Renders the list of tasks
        ├── TaskItem.jsx  # Single task row (complete, edit, delete)
        └── TaskForm.jsx  # Add / edit task form
```

---

## Component Responsibilities

| Component     | Responsibility |
|---------------|----------------|
| `App.jsx`     | Owns the task list state. Fetches tasks on load. Passes data and callbacks down to children. |
| `TaskList.jsx`| Receives task array and renders a `TaskItem` for each. |
| `TaskItem.jsx`| Displays title, deadline, completed status. Has buttons for complete toggle, edit, delete. |
| `TaskForm.jsx`| Controlled form for title + optional deadline. Used for both adding and editing a task. |
| `api.js`      | Exports one function per endpoint: `getTasks`, `createTask`, `updateTask`, `deleteTask`. No fetch logic in components. |

---

## State Design

All state lives in `App.jsx`. No global state library needed.

| State         | Type     | Description |
|---------------|----------|-------------|
| `tasks`       | array    | The full task list fetched from the backend |
| `editingTask` | object \| null | The task currently being edited, or null |

---

## Build Order

### Step 1 — Test Cases
Define what to manually verify in the browser before considering the frontend done. These guide implementation and catch regressions.

**Rendering**
- Tasks load and display on page open
- Empty state shows a message when there are no tasks

**Add task**
- Submitting the form with a title creates a task and it appears in the list
- Submitting with a deadline shows the deadline on the task
- Submitting with an empty title does nothing (or shows an error)
- Submitting with only special characters does nothing

**Complete toggle**
- Clicking complete marks the task visually (e.g. strikethrough)
- Clicking again toggles it back

**Edit task**
- Clicking edit populates the form with the task's current values
- Saving updates the task in the list
- Editing and changing the deadline works
- Editing and removing the deadline works (clear the field)

**Delete task**
- Clicking delete removes the task from the list

**Error handling**
- If the backend is unreachable, the app doesn't crash silently

---

### Step 2 — Scaffold with Vite
Run `npm create vite@latest frontend -- --template react` from the project root. Remove boilerplate (default CSS, SVGs, placeholder content).

### Step 3 — `vite.config.js`
Add the `/api` proxy pointing to `localhost:8000`. This is what allows the frontend to call `/api/tasks` without CORS issues.

### Step 4 — `api.js`
Implement the four fetch functions before touching any component. Each function maps to one backend endpoint. Components call these functions — they never use `fetch` directly.

### Step 5 — Components
Build in this order so each piece is testable before the next depends on it:
1. `TaskList.jsx` + `TaskItem.jsx` — render static/hardcoded tasks first, confirm display is correct
2. `TaskForm.jsx` — controlled form with title and deadline fields
3. Wire `App.jsx` — connect real API calls, pass state and callbacks to components

### Step 6 — Styling
Basic CSS only — enough to make the app usable and readable. No UI framework.

---

## Notes

- No client-side routing — everything is on one page
- No state management library — `useState` and `useEffect` in `App.jsx` is sufficient
- Deadline field is a plain date input (`<input type="date">`) — browser handles formatting
- Styling is intentionally minimal; functionality is the priority
