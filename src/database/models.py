from pydantic import (BaseModel, Field, StrictStr, Json, condecimal,
                      StrictInt, PrivateAttr, SecretBytes, StrictBytes, StrictBool, root_validator,
                      SecretStr)
from enum import Enum
from typing import Optional, List, ClassVar
from pydantic_settings import BaseSettings
from datetime import datetime
import os
from pathlib import Path
from env import Env
from datetime import datetime

env = Env()

ACCESS_TOKEN_EXPIRE_MINUTES = int(env.__getattr__("ACCESS_TOKEN_EXPIRE_MINUTES"))
REFRESH_TOKEN_EXPIRE_DAYS = int(env.__getattr__("REFRESH_TOKEN_EXPIRE_DAYS"))


class AuthJWT(BaseModel):
    private_key_path: Optional[str] = None
    public_key_path: Optional[str] = None
    _private_key_content: str = PrivateAttr()
    _public_key_content: str = PrivateAttr()
    access_token_expire_minutes: ClassVar[int] = ACCESS_TOKEN_EXPIRE_MINUTES
    refresh_token_expire_days: ClassVar[int] = REFRESH_TOKEN_EXPIRE_DAYS

    def __init__(self, **data):
        super().__init__(**data)
        self._private_key_content: Path = Path(__file__).resolve().parent.parent / "certs" / "jwt-private.pem"
        self._public_key_content: Path = Path(__file__).resolve().parent.parent / "certs" / "jwt-public.pem"

    @property
    def private_key_content(self):
        return self._private_key_content

    @property
    def public_key_content(self):
        return self._public_key_content


class Settings(BaseSettings):
    auth_jwt: AuthJWT = AuthJWT()
    algoritm: str = "RS256"


class TokenInfo(BaseModel):
    """
    Model of information about token
    """
    AccessToken: StrictStr = Field(...,
                                   alias="access_token")
    RefreshToken: Optional[StrictStr] = Field(None,
                                              alias="refresh_token")
    Type: StrictStr = Field("Bearer",
                            alias="token_type")


class Auth(BaseModel):
    """
    Model of auth
    """
    Email: StrictStr = Field(...,
                             alias="email",
                             examples=["john.doe@example.com"])
    Password: StrictStr = Field(...,
                                alias="password",
                                examples=["password"])


class RoleEnum(StrictStr, Enum):
    """
    Model of role enum
    """
    user = 'user'
    admin = 'admin'


class TypeUser(Enum):
    """
    Enum of type user
    """
    candidate = "candidate"
    employer = "employer"


class GenderUser(Enum):
    """
    Enum of gender
    """
    male = "male"
    female = "female"


class Users(BaseModel):
    """
    Модель пользователя
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    Email: StrictStr = Field(...,
                             alias="email",
                             examples=["john.doe@example.com"],
                             description="Почта пользователя")
    Password: StrictStr = Field(...,
                                alias="password",
                                examples=["password"],
                                description="Пароль пользователя")
    Type: TypeUser = Field(...,
                           alias="type",
                           examples=[TypeUser.candidate],
                           description="Тип пользователя")
    InfoID: Optional[StrictInt] = Field(None,
                                        alias="info_id",
                                        examples=[1],
                                        description="Информация по пользователю")
    CreatedAt: Optional[datetime] = Field(datetime.now(),
                                          alias="created_at",
                                          examples=[f"{datetime.now()}"],
                                          description="Дата создания пользователя")
    Role: Optional[RoleEnum] = Field(RoleEnum.user,
                                     alias="role",
                                     examples=["user"])


class InfoCandidates(BaseModel):
    """
    Модель информации по кандидату
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    Name: Optional[StrictStr] = Field(None,
                                      alias="name",
                                      examples=["John Doe"],
                                      description="Имя кандидата")
    Phone: Optional[StrictStr] = Field(None,
                                       alias="phone",
                                       examples=["123-456-7890"],
                                       description="Номер телефона кандидата")
    Gender: Optional[GenderUser] = Field(None,
                                         alias="gender",
                                         examples=[GenderUser.male],
                                         description="Пол кандидата")
    DateBirth: Optional[datetime] = Field(None,
                                          alias="date_birth",
                                          examples=[f"{datetime.now()}"],
                                          description="Дата рождения кандидата")
    FileID: Optional[StrictInt] = Field(None,
                                        alias="file_id",
                                        examples=[1],
                                        description="ID видеовизитки кандидата")
    EmbeddingID: Optional[StrictInt] = Field(None,
                                             alias="embedding_id",
                                             examples=[1],
                                             description="Эмбеддинг кандидата")


class Vacancies(BaseModel):
    """
    Модель вакансии
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    Name: StrictStr = Field(...,
                            alias="name",
                            examples=["Программист Python"],
                            description="Название вакансии")
    Salary: Optional[StrictStr] = Field(None,
                                        alias="salary",
                                        examples=["80000, 90000"],
                                        description="Зарплата вакансии")
    Description: StrictStr = Field(...,
                                   alias="description",
                                   examples=["Разработка и поддержка веб-приложений на Python, написание REST API"],
                                   description="Описание вакансии")
    Skill: Optional[StrictStr] = Field(None,
                                       alias="skill",
                                       examples=["Python, Django, REST API, SQL"],
                                       description="Навыки вакансии")
    EmbeddingID: Optional[StrictInt] = Field(None,
                                             alias="embedding_id",
                                             examples=[1],
                                             description="Эмбеддинг вакансии")


class Personalities(BaseModel):
    """
    Модель типа личности
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    Name: StrictStr = Field(...,
                            alias="name",
                            examples=["Personality 1"],
                            description="Название личности")
    Description: StrictStr = Field(...,
                                   alias="description",
                                   examples=["Description of personality 1"],
                                   description="Описание личности")
    EmbeddingID: Optional[StrictInt] = Field(None,
                                             alias="embedding_id",
                                             examples=[1],
                                             description="Эмбеддинг личности")


class PersonalityVacancies(BaseModel):
    """
    Модель связи личности и вакансии
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    PersonalityID: StrictInt = Field(...,
                                     alias="personality_id",
                                     examples=[1],
                                     description="ID личности")
    VacancyID: StrictInt = Field(...,
                                 alias="vacancy_id",
                                 examples=[1],
                                 description="ID вакансии")
    Distance: condecimal(max_digits=6,
                         decimal_places=6) = Field(...,
                                                   alias="distance",
                                                   examples=[0.563215],
                                                   description="Семантическое сходство личности и вакансии")


class CandidateVacancies(BaseModel):
    """
    Модель связи кандидата и вакансии
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    UserID: StrictInt = Field(...,
                              alias="user_id",
                              examples=[1],
                              description="ID пользователя")
    VacancyID: StrictInt = Field(...,
                                 alias="vacancy_id",
                                 examples=[1],
                                 description="ID вакансии")
    Distance: condecimal(max_digits=6,
                         decimal_places=6) = Field(...,
                                                   alias="distance",
                                                   examples=[0.563215],
                                                   description="Семантическое сходство вакансии и вакансии")


class Magics(BaseModel):
    """
    Модель карт таро
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    Name: StrictStr = Field(...,
                            alias="name",
                            examples=["Дурак"],
                            description="Название карты таро")
    CandidateAnswer: StrictStr = Field(...,
                                       alias="candidate_answer",
                                       examples=["Эта карта символизирует новые начинания и готовность к приключениям."
                                                 " Откликнуться на вакансию будет правильным шагом, так как это может"
                                                 " привести к новым возможностям."],
                                       description="Ответ кандидату")
    VacancyAnswer: StrictStr = Field(...,
                                     alias="vacancy_answer",
                                     examples=["Этот аркан символизирует новые начала и открытость к новым"
                                               " возможностям. Кандидат готов к экспериментам и может принести"
                                               " свежие идеи в команду."],
                                     description="Ответ вакансии")
    FileID: Optional[StrictInt] = Field(None,
                                        alias="file_id",
                                        examples=[1],
                                        description="ID изображения карты таро")


class Embeddings(BaseModel):
    """
    Модель венденции
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    Url: StrictStr = Field(...,
                           alias="url",
                           examples=["./data/embeddings/embedding.npy"],
                           description="Путь к эмбеддингу")


class Files(BaseModel):
    """
    Модель файлов
    """
    ID: Optional[int] = Field(None,
                              alias="id",
                              examples=[1])
    Url: StrictStr = Field(...,
                           alias="url",
                           examples=["./data/files/file.png"],
                           description="Путь к файлу")
