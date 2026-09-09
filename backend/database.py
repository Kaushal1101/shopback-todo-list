import sqlite3


def create_tables(conn):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            title     TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            deadline  TEXT
        )
    """)
    conn.commit()


def get_db():
    conn = sqlite3.connect("todos.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
