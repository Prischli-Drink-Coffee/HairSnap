from src.database.my_connector import db
from src.database.models import Embeddings


def get_all_embeddings():
    query = "SELECT * FROM embeddings"
    return db.fetch_all(query)


def get_embedding_by_id(embedding_id: int):
    query = "SELECT * FROM embeddings WHERE id=%s"
    return db.fetch_one(query, (embedding_id,))


def create_embedding(embedding: Embeddings):
    query = "INSERT INTO embeddings (url) VALUES (%s)"
    params = embedding.Url
    cursor = db.execute_query(query, params)
    return cursor.lastrowid


def update_embedding(embedding_id: int, embedding: Embeddings):
    query = "UPDATE embeddings SET url=%s WHERE id=%s"
    params = (embedding.Url, embedding_id)
    db.execute_query(query, params)


def delete_embedding(embedding_id: int):
    query = "DELETE FROM embeddings WHERE id=%s"
    db.execute_query(query, (embedding_id,))
