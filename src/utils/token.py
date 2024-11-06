from __future__ import annotations

import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.database.models import Settings
from datetime import datetime, timedelta
from src.database.models import Users
from typing import Dict

settings = Settings()
http_bearer = HTTPBearer()


# >>> private_key = b"-----BEGIN PRIVATE KEY-----\nMIGEAgEAMBAGByqGSM49AgEGBS..."
# >>> public_key = b"-----BEGIN PUBLIC KEY-----\nMHYwEAYHKoZIzj0CAQYFK4EEAC..."


def encode_jwt(payload: dict,
               private_key: str = settings.auth_jwt.private_key_content.read_text(),
               algorithm: str = settings.algoritm,
               expire_minutes: int = settings.auth_jwt.access_token_expire_minutes,
               expire_timedelta: timedelta | None = None) -> str:
    to_encode = payload.copy()
    now = datetime.utcnow()
    if expire_timedelta:
        expire = now + expire_timedelta
    else:
        expire = now + timedelta(minutes=expire_minutes)
    to_encode.update(
        exp=expire,
        iat=now,
        # TODO можно добавить jti (JWT ID) [jti=str(uuid.uuid4())] для реализации blacklist
    )
    encoded = jwt.encode(
        to_encode,
        private_key,
        algorithm=algorithm,
    )
    return encoded


def decode_jwt(token: str | bytes,
               public_key: str = settings.auth_jwt.public_key_content.read_text(),
               algorithm: str = settings.algoritm) -> dict:
    decoded = jwt.decode(
        token,
        public_key,
        algorithms=[algorithm],
    )
    return decoded


def create_jwt(token_type: str,
               token_data: dict,
               expire_minutes: int = settings.auth_jwt.access_token_expire_minutes,
               expire_timedelta: timedelta | None = None) -> str:
    jwt_payload = {"TOKEN_TYPE_FIELD": token_type}
    jwt_payload.update(token_data)
    return encode_jwt(
        payload=jwt_payload,
        expire_minutes=expire_minutes,
        expire_timedelta=expire_timedelta
    )


def create_access_token(user: Users) -> str:
    jwt_payload = {
        "sub": user.Role,
        "user_id": user.ID,
        "first_name": user.FName,
        "last_name": user.LName
    }
    return create_jwt(token_type="access_token_type",
                      token_data=jwt_payload,
                      expire_minutes=settings.auth_jwt.access_token_expire_minutes)


def create_refresh_token(user: Users) -> str:
    jwt_payload = {
        "sub": user.ID
    }
    return create_jwt(token_type="refresh_token_type",
                      token_data=jwt_payload,
                      expire_timedelta=timedelta(days=settings.auth_jwt.refresh_token_expire_days))


def validate_token_type(
        payload: Dict,
        token_type: str,
) -> bool:
    # TODO при добавлении jti (JWT ID) [jti=str(uuid.uuid4())] сделать проверку на хранящиеся
    #  уникальные айди токенов в базе для реализации blacklist
    current_token_type = payload.get("TOKEN_TYPE_FIELD")
    if current_token_type == token_type:
        return True
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail=f"Invalid token type {token_type!r} excepted {current_token_type!r}")
