# shopback-todo-list

A simple full-stack To-Do list app.

## Stack

- **Frontend:** React + Vite
- **Backend:** Python + FastAPI
- **Database:** SQLite

## Features

- Add, edit, and delete tasks
- Mark tasks as complete/incomplete
- Optional deadline per task
- Data persists via SQLite

## Project Structure

```
shopback-todo-list/
├── frontend/        # React app (Vite)
└── backend/         # FastAPI app
    ├── main.py      # Routes
    ├── database.py  # SQLite connection and schema
    ├── models.py    # Pydantic request/response models
    └── test_main.py # Test suite
```

## Getting Started

Both servers need to run at the same time. Start the backend first, then the frontend.

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend proxies all API requests to the backend — no need to access port 8000 directly.

> During development you can also browse `http://localhost:8000/docs` for the interactive API reference.

### Running Tests

**Backend:**
```bash
cd backend
pytest test_main.py -v
```

**Frontend:**
```bash
cd frontend
npm run test
```

---

## Project Documents

| Document | Path |
|----------|------|
| AI prompting log | `prompt.md` |
| AI usage reflection | `reflection.md` |
| App screenshots | `media/` |
