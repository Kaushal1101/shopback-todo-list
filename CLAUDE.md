# shopback-todo-list

A simple To-Do list app built as a learning/demo project.

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | React + Vite        |
| Backend  | Python + FastAPI    |
| Database | SQLite              |
| API      | REST (JSON over HTTP)|

## Repo Layout

```
shopback-todo-list/
├── frontend/        # React app (Vite)
│   └── src/
└── backend/         # FastAPI app
    ├── main.py      # App entry point + routes
    ├── database.py  # SQLite connection, schema, init
    ├── models.py    # Pydantic models
    └── test_main.py # pytest test suite
```

## Features

- Add, edit, delete tasks
- Mark tasks as complete/incomplete
- Persistence via SQLite

## Architecture

- The React frontend talks to the FastAPI backend over REST.
- The backend owns all persistence; the frontend holds no local state beyond what's needed to render the current view.
- SQLite database file lives at `backend/todos.db`.

## Development Workflow

- Frontend dev server: `npm run dev` (inside `frontend/`) — runs on port 5173
- Backend dev server: `uvicorn main:app --reload` (inside `backend/`) — runs on port 8000
- Frontend proxies `/api` requests to `localhost:8000` (configured in `vite.config.js`) — no CORS needed.

## Coding Guardrails

1. No commits without explicit user approval.
2. Make small, focused changes — one concern per change.
3. Show code snippets with explanations for every change.
4. Avoid unnecessary abstractions — keep it simple and readable.
5. Do not run commands without explicit user approval.
