from src.database.my_connector import db
from src.database.models import CandidateVacancies


def get_all_candidate_vacancies():
    query = "SELECT * FROM candidate_vacancies"
    return db.fetch_all(query)


def get_candidate_vacancy_by_id(candidate_vacancy_id: int):
    query = "SELECT * FROM candidate_vacancies WHERE id=%s"
    return db.fetch_one(query, (candidate_vacancy_id,))


def create_candidate_vacancy(candidate_vacancy: CandidateVacancies):
    query = "INSERT INTO candidate_vacancies (user_id, vacancy_id) VALUES (%s, %s)"
    params = candidate_vacancy.UserID, candidate_vacancy.VacancyID
    cursor = db.execute_query(query, params)
    return cursor.lastrowid


def update_candidate_vacancy(candidate_vacancy_id: int, candidate_vacancy: CandidateVacancies):
    query = "UPDATE candidate_vacancies SET user_id=%s, vacancy_id=%s WHERE id=%s"
    params = candidate_vacancy.UserID, candidate_vacancy.VacancyID, candidate_vacancy_id
    db.execute_query(query, params)


def delete_candidate_vacancy(candidate_vacancy_id: int):
    query = "DELETE FROM candidate_vacancies WHERE id=%s"
    db.execute_query(query, (candidate_vacancy_id,))
