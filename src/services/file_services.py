import os
from fastapi import HTTPException, status, UploadFile
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from src.utils.write_file_into_server import write_file_into_server
from src.utils.return_url_object import return_url_object
from src.utils.custom_logging import setup_logging
from config import Config

config = Config()
log = setup_logging()


async def upload_images(entity_type: str, file: UploadFile,
                        entity_id: int, get_entity_by_id, update_entity):
    # Проверяем, существует ли сущность
    existing_entity = get_entity_by_id(entity_id)
    if not existing_entity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"{entity_type.capitalize()} with ID {entity_id} not found")
    unique_filename = await write_file_into_server(entity_type, file)
    url = return_url_object(f"/{entity_type}/{unique_filename}")
    existing_entity.ImageUrl = url
    update_entity(entity_id, existing_entity)
    return get_entity_by_id(entity_id)


def delete_images(entity_type: str, entity_id: int,
                  get_entity_by_id, update_entity):
    existing_entity = get_entity_by_id(entity_id)
    url = existing_entity.ImageUrl
    if not existing_entity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Entity with ID {entity_id} not found")
    if not url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Image {entity_type} with ID {entity_id} not exist")
    file_path = os.path.join(config.__getattr__("UPLOAD_DIR"), entity_type, url.split("/")[-1])
    print(file_path)
    if os.path.exists(file_path):
        os.remove(file_path)
        log.info(f"File {file_path} deleted successfully.")
    else:
        log.warning(f"File {file_path} does not exist.")
    existing_entity.ImageUrl = None
    update_entity(entity_id, existing_entity)
    log.info(f"Image entity record with ID {entity_id} deleted from database.")
    return {
        "status": "success"
    }
