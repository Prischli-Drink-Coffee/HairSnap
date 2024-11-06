from src.database.my_connector import db
from src.database.models import PersonalityVacancies


def get_all_personality_vacancies():
    query = "SELECT * FROM personality_vacancies"
    return db.fetch_all(query)


def get_personality_vacancy_by_id(personality_vacancy_id: int):
    query = "SELECT * FROM personality_vacancies WHERE id=%s"
    return db.fetch_one(query, (personality_vacancy_id,))


def create_personality_vacancy(personality_vacancy: PersonalityVacancies):
    query = "INSERT INTO personality_vacancies (personality_id, vacancy_id) VALUES (%s, %s)"
    params = personality_vacancy.PersonalityID, personality_vacancy.VacancyID
    cursor = db.execute_query(query, params)
    return cursor.lastrowid


def update_personality_vacancy(personality_vacancy_id: int, personality_vacancy: PersonalityVacancies):
    query = "UPDATE personality_vacancies SET personality_id=%s, vacancy_id=%s WHERE id=%s"
    params = personality_vacancy.PersonalityID, personality_vacancy.VacancyID, personality_vacancy_id
    db.execute_query(query, params)


def delete_personality_vacancy(personality_vacancy_id: int):
    query = "DELETE FROM personality_vacancies WHERE id=%s"
    db.execute_query(query, (personality_vacancy_id,))
