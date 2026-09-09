# Backend Build Plan

## Overview

Build a FastAPI backend that exposes a REST API for managing tasks, backed by a SQLite database. Validate each endpoint using FastAPI's built-in `/docs` UI or Postman before moving to the frontend.

---

## File Structure

```
backend/
├── main.py        # FastAPI app instance, all routes
├── database.py    # SQLite connection, table creation on startup
├── models.py      # Pydantic models for request/response shapes
└── todos.db       # SQLite database file (auto-created on first run)
```

---

## Data Model

A single `tasks` table in SQLite:

| Column      | Type    | Notes                        |
|-------------|---------|------------------------------|
| id          | INTEGER | Primary key, auto-increment  |
| title       | TEXT    | The task description         |
| completed   | BOOLEAN | Defaults to false            |
| deadline    | TEXT    | ISO 8601 date string, nullable (e.g. `"2026-09-15"`) |

---

## API Endpoints

| Method | Path             | Description          | Request Body              | Response              |
|--------|------------------|----------------------|---------------------------|-----------------------|
| GET    | /api/tasks       | Fetch all tasks      | None                      | Array of task objects |
| POST   | /api/tasks       | Create a new task    | `{ title: string }`       | Created task object   |
| PUT    | /api/tasks/{id}  | Update a task        | `{ title?, completed?, deadline? }` — pass `null` for `deadline` to remove it | Updated task object   |
| DELETE | /api/tasks/{id}  | Delete a task        | None                      | `{ success: true }`   |

---

## Build Order

### Step 1 — Test Cases
Define test cases before writing any logic. These are not final — they can be tweaked as we build — but they serve as a guide to ensure our implementation covers the expected behaviour and edge cases.

**GET /api/tasks**
- Returns an empty array when no tasks exist
- Returns all tasks when tasks exist

**POST /api/tasks**
- Creates a task with a title; `completed` defaults to `false`, `deadline` defaults to `null`
- Creates a task with a title and a deadline
- Fails with `422` if `title` is missing or empty

**PUT /api/tasks/{id}**
- Updates the title only
- Marks a task as complete
- Marks a task as incomplete (toggles back)
- Adds a deadline to a task that had none
- Removes a deadline by passing `null`
- Updates title, completed, and deadline in one request
- Fails with `404` if the task `id` doesn't exist

**DELETE /api/tasks/{id}**
- Deletes a task; confirms it no longer appears in GET
- Fails with `404` if the task `id` doesn't exist

---

### Step 2 — `database.py`
- Open a connection to `todos.db`
- Create the `tasks` table if it doesn't already exist
- Expose a `get_db()` function that routes will use to get a connection

### Step 3 — `models.py`
- `TaskCreate` — validates the request body for POST (requires `title`, optional `deadline`)
- `TaskUpdate` — validates the request body for PUT (`title`, `completed`, `deadline` all optional; `deadline` accepts a string or `null` to remove it)
- `TaskResponse` — shape of every task returned in responses (`id`, `title`, `completed`, `deadline`)

### Step 4 — `main.py`
- Instantiate the FastAPI app
- Call the table-creation function on startup
- Implement the 4 routes in order: GET, POST, PUT, DELETE

---

## Validation Plan (Postman / FastAPI Docs)

After each step, validate before moving on:

1. **POST /api/tasks** — create a task, confirm it returns the task with an `id`
2. **GET /api/tasks** — confirm the created task appears in the list
3. **PUT /api/tasks/{id}** — update the title, then mark it complete; confirm changes persist across a GET
4. **DELETE /api/tasks/{id}** — delete the task, confirm it no longer appears in GET

---

## Notes

- No authentication — this is a local app
- No pagination — task list will always be small
- Errors (e.g. task not found) return a `404` with a plain message
- `todos.db` should be added to `.gitignore`
