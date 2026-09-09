from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from database import get_db, create_tables
from models import TaskCreate, TaskUpdate, TaskResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables(next(get_db()))
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/api/tasks", response_model=list[TaskResponse])
def get_tasks(db=Depends(get_db)):
    rows = db.execute("SELECT * FROM tasks").fetchall()
    return [dict(row) for row in rows]


@app.post("/api/tasks", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, db=Depends(get_db)):
    cursor = db.execute(
        "INSERT INTO tasks (title, completed, deadline) VALUES (?, ?, ?)",
        (task.title, False, task.deadline),
    )
    db.commit()
    row = db.execute("SELECT * FROM tasks WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return dict(row)


@app.put("/api/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, update: TaskUpdate, db=Depends(get_db)):
    row = db.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Task not found")

    updated = dict(row)
    if "title" in update.model_fields_set:
        updated["title"] = update.title
    if "completed" in update.model_fields_set:
        updated["completed"] = update.completed
    if "deadline" in update.model_fields_set:
        updated["deadline"] = update.deadline

    db.execute(
        "UPDATE tasks SET title = ?, completed = ?, deadline = ? WHERE id = ?",
        (updated["title"], updated["completed"], updated["deadline"], task_id),
    )
    db.commit()
    return updated


@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, db=Depends(get_db)):
    cursor = db.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True}
