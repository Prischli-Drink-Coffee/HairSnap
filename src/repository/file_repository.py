from src.database.my_connector import db
from src.database.models import Files


def get_all_files():
    query = "SELECT * FROM files"
    return db.fetch_all(query)


def get_file_by_id(file_id: int):
    query = "SELECT * FROM files WHERE id=%s"
    return db.fetch_one(query, (file_id,))


def create_file(file: Files):
    query = "INSERT INTO files (url) VALUES (%s)"
    params = file.Url
    cursor = db.execute_query(query, params)
    return cursor.lastrowid


def update_file(file_id: int, file: files):
    query = "UPDATE files SET url=%s WHERE id=%s"
    params = (file.Url, file_id)
    db.execute_query(query, params)


def delete_file(file_id: int):
    query = "DELETE FROM files WHERE id=%s"
    db.execute_query(query, (file_id,))
