import json
import os
import aiofiles
from datetime import datetime
from threading import Lock
from typing import List
from models.schemas import RegistryServerItem, GenerateResponse

REGISTRY_FILE = "registry_data.json"
SERVERS_DIR = "generated_servers"

# Ensure directories exist
os.makedirs(SERVERS_DIR, exist_ok=True)

# Simple lock for concurrent writes
_lock = Lock()

def _init_registry():
    if not os.path.exists(REGISTRY_FILE):
        with open(REGISTRY_FILE, "w") as f:
            json.dump([], f)

_init_registry()

async def read_registry() -> List[RegistryServerItem]:
    try:
        async with aiofiles.open(REGISTRY_FILE, mode='r') as f:
            contents = await f.read()
            data = json.loads(contents)
            return [RegistryServerItem(**item) for item in data]
    except Exception:
        return []

async def save_server_to_registry(server_name: str, task_desc: str, response: GenerateResponse) -> RegistryServerItem:
    registry = await read_registry()
    
    # Write server python code to disk
    server_filename = f"{server_name}_server.py"
    server_path = os.path.join(SERVERS_DIR, server_filename)
    
    async with aiofiles.open(server_path, mode='w') as f:
        await f.write(response.server_code)
        
    # Write README
    readme_path = os.path.join(SERVERS_DIR, f"{server_name}_README.md")
    async with aiofiles.open(readme_path, mode='w') as f:
        await f.write(response.readme)
    
    new_item = RegistryServerItem(
        name=server_name,
        description=task_desc,
        tools_count=len(response.tools),
        created_at=datetime.utcnow().isoformat() + "Z",
        download_url=f"/download/{server_name}"
    )
    
    # Simple check to avoid exact duplicates
    registry = [item for item in registry if item.name != server_name]
    registry.append(new_item)
    
    with _lock:
        with open(REGISTRY_FILE, "w") as f:
            json.dump([item.model_dump() for item in registry], f, indent=2)

    return new_item

async def get_server_file_path(server_name: str) -> str:
    path = os.path.join(SERVERS_DIR, f"{server_name}_server.py")
    if os.path.exists(path):
        return path
    raise FileNotFoundError(f"Server {server_name} not found")
