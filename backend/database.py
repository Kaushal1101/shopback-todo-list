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


def init_db():
    conn = sqlite3.connect("todos.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    create_tables(conn)
    conn.close()


def get_db():
    # FastAPI runs sync route handlers in a thread pool, so the connection may be
    # used in a different thread than the one that created it. check_same_thread=False
    # allows this. Concurrent writes are possible but unlikely for a local single-user
    # app — worst case is a transient "database is locked" error, not data corruption.
    conn = sqlite3.connect("todos.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
