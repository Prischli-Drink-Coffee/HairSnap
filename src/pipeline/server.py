import os
from fastapi import FastAPI, HTTPException, Depends, Request, File, UploadFile, status, Form
from typing import Dict
from fastapi.openapi.models import Tag as OpenApiTag
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from src.utils.custom_logging import setup_logging
from src.utils.log_debugging import debug_ex, debug_err, debug_info
from fastapi.staticfiles import StaticFiles
from env import Env
from src import path_to_project
from src.database.models import (Users, TokenInfo, Auth, Personalities, PersonalityVacancies, Magics, Embeddings,
                                 Files, InfoCandidates, Vacancies, CandidateVacancies, PersonalityCandidates)
from src.services import (auth_services, user_services, info_candidate_services, magic_services, personality_services,
                          personality_vacancy_services, candidate_vacancy_services, file_services, embedding_services,
                          vacancy_services, personality_candidate_services)
from src.utils.jwt_bearer import JWTBearer
from jwt import InvalidTokenError

env = Env()
log = setup_logging()


app_server = FastAPI(title="API - server")
# app_public = FastAPI(title="API - public")

app = FastAPI()

app.mount("/server", app_server)
# app.mount("/public", app_public)
app.mount("/data", StaticFiles(directory=os.path.join(path_to_project(), "data")), name="data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Определяем теги
# PublicMainTag = OpenApiTag(name="Main", description="CRUD operations main")
# ServerMainTag = OpenApiTag(name="Main", description="CRUD operations main")
ServerAuthTag = OpenApiTag(name="Auth", description="CRUD operations auth")
ServerUserTag = OpenApiTag(name="User", description="CRUD operations user")
ServerInfoCandidateTag = OpenApiTag(name="InfoCandidate", description="CRUD operations info candidate")
ServerMagicTag = OpenApiTag(name="Magic", description="CRUD operations magic")
ServerVacancyTag = OpenApiTag(name="Vacancy", description="CRUD operations vacancy")
ServerPersonalityTag = OpenApiTag(name="Personality", description="CRUD operations personality")
ServerPersonalityVacancyTag = OpenApiTag(name="PersonalityVacancy", description="CRUD operations personality vacancy")
ServerPersonalityCandidateTag = OpenApiTag(name="PersonalityCandidate", description="CRUD operations personality candidate")
ServerCandidateVacancyTag = OpenApiTag(name="CandidateVacancy", description="CRUD operations candidate vacancy")
ServerFileTag = OpenApiTag(name="File", description="CRUD operations file")
ServerEmbeddingTag = OpenApiTag(name="Embedding", description="CRUD operations embedding")


# Настройка документации с тегами
app_server.openapi_tags = [
    # ServerMainTag.model_dump(),
    ServerAuthTag.model_dump(),
    ServerUserTag.model_dump(),
    ServerInfoCandidateTag.model_dump(),
    ServerMagicTag.model_dump(),
    ServerVacancyTag.model_dump(),
    ServerPersonalityTag.model_dump(),
    ServerPersonalityVacancyTag.model_dump(),
    ServerPersonalityCandidateTag.model_dump(),
    ServerCandidateVacancyTag.model_dump(),
    ServerFileTag.model_dump(),
    ServerEmbeddingTag.model_dump(),
]

# app_public.openapi_tags = [
#     PublicMainTag.model_dump(),
# ]



@app_server.post("/signup/", response_model=TokenInfo, tags=["Auth"])
async def signup(email: str = Form(...),
                 password: str = Form(...),
                 type_user: str = Form(...),
                 role: str = Form("user")):
    """
    Регистрация нового пользователя.
    """
    try:

        return auth_services.signup(Users(email=email, password=password,
                                          type=type_user, role=role))
    except HTTPException as ex:
        log.exception("Error during registration", exc_info=ex)
        raise ex


@app_server.post("/signin/", response_model=TokenInfo, tags=["Auth"])
async def signin(email: str = Form(...),
                 password: str = Form(...)):
    """
    Авторизация пользователя.
    """
    try:
        return auth_services.signin(Auth(email=email, password=password))
    except HTTPException as ex:
        log.exception("Error during registration", exc_info=ex)
        raise ex


@app.post("/auth_refresh_jwt/", response_model=TokenInfo, response_model_exclude_none=True,
          dependencies=[Depends(JWTBearer(access_level=1))], tags=["Auth"])
async def auth_refresh_jwt(user: Users = Depends(auth_services.UserGetFromToken("refresh_token_type"))):
    """
    Route for refresh jwt access token.

    :param token: valid refresh token. [Str]

    :return: response model TokenInfo.
    """
    try:
        return auth_services.auth_refresh_jwt(user)
    except HTTPException as ex:
        log.exception(f"Error {ex}")
        raise ex


@app.get("/get_current_auth_user/", response_model=Users,
         dependencies=[Depends(JWTBearer(access_level=1))],
         tags=["Auth"])
async def get_current_auth_user(user: Users = Depends(auth_services.UserGetFromToken("access_token_type"))):
    """
    Route for getting auth user.

    :param token: valid token. [Str]

    :return: response model User.
    """
    try:
        return user
    except HTTPException as ex:
        log.exception(f"Error {ex}")
        raise ex


@app_server.get("/users/", response_model=list[Users], tags=["User"])
async def get_all_users():
    """
    Route for get all users from basedata.

    :return: response model List[Users].
    """
    try:
        return user_services.get_all_users()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/users/user_id/{user_id}", response_model=Users, tags=["User"])
async def get_user_by_id(user_id: int):
    """
    Route for get user by UserID.

    :param user_id: ID by user. [int]

    :return: response model Users.
    """
    try:
        return user_services.get_user_by_id(user_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/users/email/{email}", response_model=Users, tags=["User"])
async def get_user_by_email(email: str):
    """
    Route for get user by user email.

    :param email: Email by user. [int]

    :return: response model Users.
    """
    try:
        return user_services.get_user_by_email(email)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/users/", response_model=Users, tags=["User"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_user(user: Users):
    """
    Route for create user in basedata.

    :param user: Model user. [Users]

    :return: response model Users.
    """
    try:
        return user_services.create_user(user)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/users/{user_id}", response_model=Dict, tags=["User"],
                dependencies=[Depends(JWTBearer(access_level=1))])
async def update_user(user_id, user: Dict):
    """
    Route for update user in basedata.

    :param user_id: ID by user. [int]

    :param user: Model user. [Users]

    :return: response model dict.
    """
    try:
        return user_services.update_user(user_id, user)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.delete("/users/{user_id}", response_model=Dict, tags=["User"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_user(user_id):
    """
    Route for delete user from basedata.

    :param user_id: ID by user. [int]

    :return: response model dict.
    """
    try:
        return user_services.delete_user(user_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/info_candidates/", response_model=list[InfoCandidates], tags=["InfoCandidate"])
async def get_all_info_candidates():
    """
    Route for get all info candidates from basedata.

    :return: response model List[InfoCandidates].
    """
    try:
        return info_candidate_services.get_all_info_candidates()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/info_candidates/info_candidate_id/{info_candidate_id}", response_model=InfoCandidates)
async def get_info_candidate_by_id(info_candidate_id: int):
    """
    Route for get info candidate by InfoCandidateID.

    :param info_candidate_id: ID by info candidate. [int]

    :return: response model InfoCandidates.
    """
    try:
        return info_candidate_services.get_info_candidate_by_id(info_candidate_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/info_candidates/", response_model=InfoCandidates, tags=["InfoCandidate"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_info_candidate(info_candidate: InfoCandidates):
    """
    Route for create info candidate in basedata.

    :param info_candidate: Model info candidate. [InfoCandidates]

    :return: response model InfoCandidates.
    """
    try:
        return info_candidate_services.create_info_candidate(info_candidate)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/info_candidates/{info_candidate_id}", response_model=Dict, tags=["InfoCandidate"],
                dependencies=[Depends(JWTBearer(access_level=0))])
async def update_info_candidate(info_candidate_id, info_candidate: Dict):
    """
    Route for update info candidate in basedata.

    :param info_candidate_id: ID by info candidate. [int]

    :param info_candidate: Model info candidate. [InfoCandidates]

    :return: response model dict.
    """
    try:
        return info_candidate_services.update_info_candidate(info_candidate_id, info_candidate)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex



@app_server.delete("/info_candidates/{info_candidate_id}", response_model=Dict, tags=["InfoCandidate"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_info_candidate(info_candidate_id):
    """
    Route for delete info candidate from basedata.

    :param info_candidate_id: ID by info candidate. [int]

    :return: response model dict.
    """
    try:
        return info_candidate_services.delete_info_candidate(info_candidate_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/vacancies/", response_model=list[Vacancies], tags=["Vacancy"])
async def get_all_vacancies():
    """
    Route for get all vacancies from basedata.

    :return: response model List[Vacancies].
    """
    try:
        return vacancy_services.get_all_vacancies()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/vacancies/vacancy_id/{vacancy_id}", response_model=Vacancies, tags=["Vacancy"])
async def get_vacancy_by_id(vacancy_id: int):
    """
    Route for get vacancy by id from basedata.

    :param vacancy_id: id of vacancy.
    :return: response model Vacancy.
    """
    try:
        return vacancy_services.get_vacancy_by_id(vacancy_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/vacancies/", response_model=Vacancies, tags=["Vacancy"])
async def create_vacancy(vacancy: Vacancies):
    """
    Route for create vacancy in basedata.

    :param vacancy: Model vacancy. [Vacancy]

    :return: response model Vacancy.
    """
    try:
        return vacancy_services.create_vacancy(vacancy)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/vacancies/{vacancy_id}", response_model=Dict, tags=["Vacancy"])
async def update_vacancy(vacancy_id: int, vacancy: Dict):
    """
    Route for update vacancy in basedata.

    :param vacancy_id: id of vacancy.
    :param vacancy: Model vacancy. [Vacancy]

    :return: response model Vacancy.
    """
    try:
        return vacancy_services.update_vacancy(vacancy_id, vacancy)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.delete("/vacancies/{vacancy_id}", response_model=Dict, tags=["Vacancy"])
async def delete_vacancy(vacancy_id: int):
    """
    Route for delete vacancy in basedata.

    :param vacancy_id: id of vacancy.

    :return: response model Vacancy.
    """
    try:
        return vacancy_services.delete_vacancy(vacancy_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/magics/", response_model=list[Magics], tags=["Magic"])
async def get_all_magics():
    """
    Route for get all magics from basedata.

    :return: response model List[Magics].
    """
    try:
        return magic_services.get_all_magics()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/magics/magic_id/{magic_id}", response_model=Magics, tags=["Magic"])
async def get_magic_by_id(magic_id: int):
    """
    Route for get magic by MagicID.

    :param magic_id: ID by magic. [int]

    :return: response model Magics.
    """
    try:
        return magic_services.get_magic_by_id(magic_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/magics/", response_model=Magics, tags=["Magic"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_magic(magic: Magics):
    """
    Route for create magic in basedata.

    :param magic: Model magic. [Magics]

    :return: response model Magics.
    """
    try:
        return magic_services.create_magic(magic)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/magics/{magic_id}", response_model=Dict, tags=["Magic"],
                dependencies=[Depends(JWTBearer(access_level=1))])
async def update_magic(magic_id, magic: Dict):
    """
    Route for update magic in basedata.

    :param magic_id: ID by magic. [int]

    :param magic: Model magic. [Magics]

    :return: response model dict.
    """
    try:
        return magic_services.update_magic(magic_id, magic)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex



@app_server.delete("/magics/{magic_id}", response_model=Dict, tags=["Magic"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_magic(magic_id):
    """
    Route for delete magic from basedata.

    :param magic_id: ID by magic. [int]

    :return: response model dict.
    """
    try:
        return magic_services.delete_magic(magic_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/personalities/", response_model=list[Personalities], tags=["Personality"])
async def get_all_personalities():
    """
    Route for get all personalities from basedata.

    :return: response model List[Personalities].
    """
    try:
        return personality_services.get_all_personalities()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/personalities/personality_id/{personality_id}", response_model=Personalities)
async def get_personality_by_id(personality_id: int):
    """
    Route for get personality by PersonalityID.

    :param personality_id: ID by personality. [int]

    :return: response model Personalities.
    """
    try:
        return personality_services.get_personality_by_id(personality_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/personalities/", response_model=Personalities, tags=["Personality"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_personality(personality: Personalities):
    """
    Route for create personality in basedata.

    :param personality: Model personality. [Personalities]

    :return: response model Personalities.
    """
    try:
        return personality_services.create_personality(personality)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/personalities/{personality_id}", response_model=Dict, tags=["Personality"],
                dependencies=[Depends(JWTBearer(access_level=1))])
async def update_personality(personality_id, personality: Dict):
    """
    Route for update personality in basedata.

    :param personality_id: ID by personality. [int]

    :param personality: Model personality. [Personalities]

    :return: response model dict.
    """
    try:
        return personality_services.update_personality(personality_id, personality)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.delete("/personalities/{personality_id}", response_model=Dict, tags=["Personality"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_personality(personality_id):
    """
    Route for delete personality from basedata.

    :param personality_id: ID by personality. [int]

    :return: response model dict.
    """
    try:
        return personality_services.delete_personality(personality_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/personality_vacancies/", response_model=list[PersonalityVacancies], tags=["PersonalityVacancy"])
async def get_all_personality_vacancies():
    """
    Route for get all personality vacancies from basedata.

    :return: response model List[PersonalityVacancies].
    """
    try:
        return personality_vacancy_services.get_all_personality_vacancies()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/personality_vacancies/personality_vacancy_id/{personality_vacancy_id}", response_model=PersonalityVacancies,
                tags=["PersonalityVacancy"])
async def get_personality_vacancy_by_id(personality_vacancy_id: int):
    """
    Route for get personality vacancy by PersonalityVacancyID.

    :param personality_vacancy_id: ID by personality vacancy. [int]

    :return: response model PersonalityVacancies.
    """
    try:
        return personality_vacancy_services.get_personality_vacancy_by_id(personality_vacancy_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/personality_vacancies/", response_model=PersonalityVacancies, tags=["PersonalityVacancy"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_personality_vacancy(personality_vacancy: PersonalityVacancies):
    """
    Route for create personality vacancy in basedata.

    :param personality_vacancy: Model personality vacancy. [PersonalityVacancies]

    :return: response model PersonalityVacancies.
    """
    try:
        return personality_vacancy_services.create_personality_vacancy(personality_vacancy)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/personality_vacancies/{personality_vacancy_id}", response_model=Dict, tags=["PersonalityVacancy"],
                dependencies=[Depends(JWTBearer(access_level=1))])
async def update_personality_vacancy(personality_vacancy_id, personality_vacancy: Dict):
    """
    Route for update personality vacancy in basedata.

    :param personality_vacancy_id: ID by personality vacancy. [int]

    :param personality_vacancy: Model personality vacancy. [PersonalityVacancies]

    :return: response model dict.
    """
    try:
        return personality_vacancy_services.update_personality_vacancy(personality_vacancy_id, personality_vacancy)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.delete("/personality_vacancies/{personality_vacancy_id}", response_model=Dict, tags=["PersonalityVacancy"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_personality_vacancy(personality_vacancy_id):
    """
    Route for delete personality vacancy from basedata.

    :param personality_vacancy_id: ID by personality vacancy. [int]

    :return: response model dict.
    """
    try:
        return personality_vacancy_services.delete_personality_vacancy(personality_vacancy_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/personality_candidates/", response_model=list[PersonalityCandidates], tags=["PersonalityCandidate"])
async def get_all_personality_candidates():
    """
    Route for get all personality candidates from basedata.

    :return: response model List[PersonalityCandidates].
    """
    try:
        return personality_candidate_services.get_all_personality_candidates()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/personality_candidates/personality_candidate_id/{personality_candidate_id}", response_model=PersonalityCandidates,
                tags=["PersonalityCandidate"])
async def get_personality_candidate_by_id(personality_candidate_id: int):
    """
    Route for get personality candidate by PersonalityCandidateID.

    :param personality_candidate_id: ID by personality candidate. [int]

    :return: response model PersonalityCandidates.
    """
    try:
        return personality_candidate_services.get_personality_candidate_by_id(personality_candidate_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/personality_candidates/", response_model=PersonalityCandidates, tags=["PersonalityCandidate"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_personality_candidate(personality_candidate: PersonalityCandidates):
    """
    Route for create personality candidate in basedata.

    :param personality_candidate: Model personality candidate. [PersonalityCandidates]

    :return: response model PersonalityCandidates.
    """
    try:
        return personality_candidate_services.create_personality_candidate(personality_candidate)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/personality_candidates/{personality_candidate_id}", response_model=Dict, tags=["PersonalityCandidate"],
                dependencies=[Depends(JWTBearer(access_level=1))])
async def update_personality_candidate(personality_candidate_id, personality_candidate: Dict):
    """
    Route for update personality candidate in basedata.

    :param personality_candidate_id: ID by personality candidate. [int]

    :param personality_candidate: Model personality candidate. [PersonalityCandidates]

    :return: response model dict.
    """
    try:
        return personality_candidate_services.update_personality_candidate(personality_candidate_id, personality_candidate)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.delete("/personality_candidates/{personality_candidate_id}", response_model=Dict, tags=["PersonalityCandidate"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_personality_candidate(personality_candidate_id):
    """
    Route for delete personality candidate from basedata.

    :param personality_candidate_id: ID by personality candidate. [int]

    :return: response model dict.
    """
    try:
        return personality_candidate_services.delete_personality_candidate(personality_candidate_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/candidate_vacancies/", response_model=list[CandidateVacancies], tags=["CandidateVacancy"])
async def get_all_candidate_vacancies():
    """
    Route for get all candidate vacancies from basedata.

    :return: response model List[CandidateVacancies].
    """
    try:
        return candidate_vacancy_services.get_all_candidate_vacancies()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/candidate_vacancies/candidate_vacancy_id/{candidate_vacancy_id}", response_model=CandidateVacancies,
                tags=["CandidateVacancy"])
async def get_candidate_vacancy_by_id(candidate_vacancy_id: int):
    """
    Route for get candidate vacancy by CandidateVacancyID.

    :param candidate_vacancy_id: ID by candidate vacancy. [int]

    :return: response model CandidateVacancies.
    """
    try:
        return candidate_vacancy_services.get_candidate_vacancy_by_id(candidate_vacancy_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/candidate_vacancies/", response_model=CandidateVacancies, tags=["CandidateVacancy"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_candidate_vacancy(candidate_vacancy: CandidateVacancies):
    """
    Route for create candidate vacancy in basedata.

    :param candidate_vacancy: Model candidate vacancy. [CandidateVacancies]

    :return: response model CandidateVacancies.
    """
    try:
        return candidate_vacancy_services.create_candidate_vacancy(candidate_vacancy)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/candidate_vacancies/{candidate_vacancy_id}", response_model=Dict, tags=["CandidateVacancy"],
                dependencies=[Depends(JWTBearer(access_level=1))])
async def update_candidate_vacancy(candidate_vacancy_id, candidate_vacancy: Dict):
    """
    Route for update candidate vacancy in basedata.

    :param candidate_vacancy_id: ID by candidate vacancy. [int]

    :param candidate_vacancy: Model candidate vacancy. [CandidateVacancies]

    :return: response model dict.
    """
    try:
        return candidate_vacancy_services.update_candidate_vacancy(candidate_vacancy_id, candidate_vacancy)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.delete("/candidate_vacancies/{candidate_vacancy_id}", response_model=Dict, tags=["CandidateVacancy"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_candidate_vacancy(candidate_vacancy_id):
    """
    Route for delete candidate vacancy from basedata.

    :param candidate_vacancy_id: ID by candidate vacancy. [int]

    :return: response model dict.
    """
    try:
        return candidate_vacancy_services.delete_candidate_vacancy(candidate_vacancy_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/files/", response_model=list[Files], tags=["File"])
async def get_all_files():
    """
    Route for get all files from basedata.

    :return: response model List[Files].
    """
    try:
        return file_services.get_all_files()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/files/file_id/{file_id}", response_model=Files, tags=["File"])
async def get_file_by_id(file_id: int):
    """
    Route for get file by FileID.

    :param file_id: ID by file. [int]

    :return: response model Files.
    """
    try:
        return file_services.get_file_by_id(file_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/files/", response_model=Files, tags=["File"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_file(file: Files):
    """
    Route for create file in basedata.

    :param file: Model file. [Files]

    :return: response model Files.
    """
    try:
        return file_services.create_file(file)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/files/{file_id}", response_model=Dict, tags=["File"],
                dependencies=[Depends(JWTBearer(access_level=1))])
async def update_file(file_id, file: Dict):
    """
    Route for update file in basedata.

    :param file_id: ID by file. [int]

    :param file: Model file. [Files]

    :return: response model dict.
    """
    try:
        return file_services.update_file(file_id, file)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.delete("/files/{file_id}", response_model=Dict, tags=["File"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_file(file_id):
    """
    Route for delete file from basedata.

    :param file_id: ID by file. [int]

    :return: response model dict.
    """
    try:
        return file_services.delete_file(file_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/embeddings/", response_model=list[Embeddings], tags=["Embedding"])
async def get_all_embeddings():
    """
    Route for get all embeddings from basedata.

    :return: response model List[Embeddings].
    """
    try:
        return embedding_services.get_all_embeddings()
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.get("/embeddings/embedding_id/{embedding_id}", response_model=Embeddings, tags=["Embedding"])
async def get_embedding_by_id(embedding_id: int):
    """
    Route for get embedding by EmbeddingID.

    :param embedding_id: ID by embedding. [int]

    :return: response model Embeddings.
    """
    try:
        return embedding_services.get_embedding_by_id(embedding_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.post("/embeddings/", response_model=Embeddings, tags=["Embedding"],
                 dependencies=[Depends(JWTBearer(access_level=0))])
async def create_embedding(embedding: Embeddings):
    """
    Route for create embedding in basedata.

    :param embedding: Model embedding. [Embeddings]

    :return: response model Embeddings.
    """
    try:
        return embedding_services.create_embedding(embedding)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.put("/embeddings/{embedding_id}", response_model=Dict, tags=["Embedding"],
                dependencies=[Depends(JWTBearer(access_level=1))])
async def update_embedding(embedding_id, embedding: Dict):
    """
    Route for update embedding in basedata.

    :param embedding_id: ID by embedding. [int]

    :param embedding: Model embedding. [Embeddings]

    :return: response model dict.
    """
    try:
        return embedding_services.update_embedding(embedding_id, embedding)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex


@app_server.delete("/embeddings/{embedding_id}", response_model=Dict, tags=["Embedding"],
                   dependencies=[Depends(JWTBearer(access_level=1))])
async def delete_embedding(embedding_id):
    """
    Route for delete embedding from basedata.

    :param embedding_id: ID by embedding. [int]

    :return: response model dict.
    """
    try:
        return embedding_services.delete_embedding(embedding_id)
    except HTTPException as ex:
        log.exception(f"Error", exc_info=ex)
        raise ex




def run_server():
    import logging
    import uvicorn
    import yaml
    from src import path_to_logging
    uvicorn_log_config = path_to_logging()
    with open(uvicorn_log_config, 'r') as f:
        uvicorn_config = yaml.safe_load(f.read())
        logging.config.dictConfig(uvicorn_config)
    if env.__getattr__("DEBUG") == "TRUE":
        reload = True
    elif env.__getattr__("DEBUG") == "FALSE":
        reload = False
    else:
        raise Exception("Not init debug mode in env file")
    uvicorn.run("server:app", host=env.__getattr__("HOST"), port=int(env.__getattr__("SERVER_PORT")),
                log_config=uvicorn_log_config, reload=reload)


if __name__ == "__main__":

    # Создание датабазы и таблиц, если они не существуют и вкючен дебаг мод
    debug_info("Start create/update database")

    if env.__getattr__("DEBUG") == "TRUE":
        from create_sql import CreateSQL
        create_sql = CreateSQL()
        create_sql.read_sql()

    # Запуск сервера
    log.info("Start run server")
    run_server()
