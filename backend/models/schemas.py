from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ToolSchema(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any]
    endpoint: str
    method: str

class GenerateRequestForm(BaseModel):
    task_description: str
    server_name: str

class GenerateResponse(BaseModel):
    server_code: str
    tools: List[ToolSchema]
    install_command: str
    claude_config: Dict[str, Any]
    readme: str

class RegistryServerItem(BaseModel):
    name: str
    description: str
    tools_count: int
    created_at: str
    download_url: str

class RegistryResponse(BaseModel):
    servers: List[RegistryServerItem]

class HAREndpoint(BaseModel):
    method: str
    url: str
    request_headers: Dict[str, str]
    request_body: Optional[str] = None
    response_status: int
    response_body: Optional[str] = None

class ClaudePromptContext(BaseModel):
    task_description: str
    server_name: str
    endpoints: List[HAREndpoint]
