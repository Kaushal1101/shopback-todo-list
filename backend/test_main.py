import pytest
import sqlite3
from fastapi.testclient import TestClient
from main import app, get_db
from database import create_tables


# --- Test database fixture ---
# Each test gets a fresh in-memory SQLite database so tests don't affect each other.
# Schema is imported from database.py so it stays in sync with production.

@pytest.fixture(autouse=True)
def override_db():
    # Same reasoning as production: FastAPI runs handlers in a thread pool,
    # so the connection must be usable across threads.
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    create_tables(conn)

    def get_test_db():
        yield conn

    app.dependency_overrides[get_db] = get_test_db
    yield
    conn.close()
    app.dependency_overrides.clear()


client = TestClient(app)


# --- 1. Backend runs ---

def test_backend_runs():
    response = client.get("/api/tasks")
    assert response.status_code == 200


# --- 2. GET, POST, DELETE ---

def test_get_tasks_returns_empty_list():
    response = client.get("/api/tasks")
    assert response.json() == []

def test_create_task():
    response = client.post("/api/tasks", json={"title": "Buy milk"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy milk"
    assert data["completed"] == False
    assert data["deadline"] is None
    assert "id" in data

def test_get_tasks_returns_created_task():
    client.post("/api/tasks", json={"title": "Buy milk"})
    response = client.get("/api/tasks")
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Buy milk"

def test_delete_task():
    task = client.post("/api/tasks", json={"title": "Buy milk"}).json()
    response = client.delete(f"/api/tasks/{task['id']}")
    assert response.status_code == 200
    assert len(client.get("/api/tasks").json()) == 0

def test_delete_nonexistent_task_returns_404():
    response = client.delete("/api/tasks/999")
    assert response.status_code == 404


# --- 3. PUT partial updates ---

def test_put_update_title_only():
    task = client.post("/api/tasks", json={"title": "Old title"}).json()
    response = client.put(f"/api/tasks/{task['id']}", json={"title": "New title"})
    assert response.status_code == 200
    assert response.json()["title"] == "New title"
    assert response.json()["completed"] == False  # unchanged

def test_put_update_completed_only():
    task = client.post("/api/tasks", json={"title": "Buy milk"}).json()
    response = client.put(f"/api/tasks/{task['id']}", json={"completed": True})
    assert response.status_code == 200
    assert response.json()["completed"] == True
    assert response.json()["title"] == "Buy milk"  # unchanged

def test_put_toggle_completed_back_to_false():
    task = client.post("/api/tasks", json={"title": "Buy milk"}).json()
    client.put(f"/api/tasks/{task['id']}", json={"completed": True})
    response = client.put(f"/api/tasks/{task['id']}", json={"completed": False})
    assert response.json()["completed"] == False

def test_put_update_deadline_only():
    task = client.post("/api/tasks", json={"title": "Buy milk"}).json()
    response = client.put(f"/api/tasks/{task['id']}", json={"deadline": "2026-12-01"})
    assert response.status_code == 200
    assert response.json()["deadline"] == "2026-12-01"

def test_put_remove_deadline_with_null():
    task = client.post("/api/tasks", json={"title": "Buy milk", "deadline": "2026-12-01"}).json()
    response = client.put(f"/api/tasks/{task['id']}", json={"deadline": None})
    assert response.status_code == 200
    assert response.json()["deadline"] is None

def test_put_nonexistent_task_returns_404():
    response = client.put("/api/tasks/999", json={"title": "Ghost"})
    assert response.status_code == 404


# --- 4. Task with no deadline ---

def test_create_task_without_deadline():
    response = client.post("/api/tasks", json={"title": "No deadline task"})
    assert response.status_code == 201
    assert response.json()["deadline"] is None

def test_create_task_with_valid_deadline():
    response = client.post("/api/tasks", json={"title": "Has deadline", "deadline": "2026-12-01"})
    assert response.status_code == 201
    assert response.json()["deadline"] == "2026-12-01"


# --- 5. Invalid date rejected ---

def test_create_task_with_gibberish_date_returns_422():
    response = client.post("/api/tasks", json={"title": "Bad date", "deadline": "not-a-date"})
    assert response.status_code == 422

def test_create_task_with_wrong_date_format_returns_422():
    # Only ISO 8601 (YYYY-MM-DD) is accepted
    response = client.post("/api/tasks", json={"title": "Bad date", "deadline": "15/12/2026"})
    assert response.status_code == 422


# --- 6. Error handling ---

def test_create_task_missing_title_returns_422():
    response = client.post("/api/tasks", json={})
    assert response.status_code == 422

def test_create_task_empty_title_returns_422():
    response = client.post("/api/tasks", json={"title": ""})
    assert response.status_code == 422

def test_create_task_whitespace_only_title_returns_422():
    response = client.post("/api/tasks", json={"title": "   "})
    assert response.status_code == 422

def test_create_task_special_chars_only_returns_422():
    response = client.post("/api/tasks", json={"title": "!@#$%^"})
    assert response.status_code == 422

def test_put_special_chars_only_title_returns_422():
    task = client.post("/api/tasks", json={"title": "Buy milk"}).json()
    response = client.put(f"/api/tasks/{task['id']}", json={"title": "!@#$%^"})
    assert response.status_code == 422


# --- 7. Title length limit (address later) ---

@pytest.mark.skip(reason="Length limits not yet implemented")
def test_create_task_title_too_long():
    response = client.post("/api/tasks", json={"title": "x" * 300})
    assert response.status_code == 422
