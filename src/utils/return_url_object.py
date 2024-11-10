from fastapi.responses import FileResponse, JSONResponse
from env import Env
env = Env()


def return_url_object(url: str):
    url = url[2:]
    return (f"http://{env.__getattr__('HOST')}:{env.__getattr__('SERVER_PORT')}/"
            f"{url}")
