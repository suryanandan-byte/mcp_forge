from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from models.schemas import RegistryResponse
from services.registry_service import read_registry, get_server_file_path

router = APIRouter()

@router.get("/", response_model=RegistryResponse)
async def list_registry():
    servers = await read_registry()
    return RegistryResponse(servers=servers)

@router.get("/download/{server_name}")
async def download_server(server_name: str):
    try:
        file_path = await get_server_file_path(server_name)
        return FileResponse(
            path=file_path, 
            filename=f"{server_name}_mcp.py",
            media_type="text/x-python"
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Server not found in registry")
