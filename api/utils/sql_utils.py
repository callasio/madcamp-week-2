import sqlite3

TABLE_PATH = 'data.db'

init_tables = [
"""
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Google ID
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  profilePicture BLOB
);
""",
"""
CREATE TABLE IF NOT EXISTS user_friends (
  id TEXT NOT NULL,
  friend_id TEXT NOT NULL,
  PRIMARY KEY (id, friend_id),
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);
"""
]

def new_connection():
  connection = sqlite3.connect(TABLE_PATH)
  cursor = connection.cursor()

  return connection, cursor

def init_db():
  connection, cursor = new_connection()

  for table in init_tables:
    cursor.execute(table)
  connection.commit()

  cursor.close()
  connection.close()

def db_execute(todo: callable):
  connection, cursor = new_connection()

  try:
    result = todo(cursor)
    cursor.close()
    connection.commit()
    connection.close()

    return result
  except Exception as e:
    cursor.close()
    connection.close()
    raise e

def get_db():
  connection, cursor = new_connection()
  try:
    yield cursor
  finally:
    cursor.close()
    connection.commit()
    connection.close()