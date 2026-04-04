import logging
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import asyncio

from models.schemas import GenerateResponse, ClaudePromptContext
from services.har_service import parse_har_file
from services.claude_service import generate_mcp_server
from services.registry_service import save_server_to_registry

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=GenerateResponse)
async def generate_server(
    har_file: UploadFile = File(...),
    task_description: str = Form(...),
    server_name: str = Form(...)
):
    try:
        # 1. Read HAR file
        content = await har_file.read()
        
        try:
            content_str = content.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Uploaded HAR is not a valid UTF-8 text file.")
        
        # 2. Parse and filter HAR
        endpoints = await asyncio.to_thread(parse_har_file, content_str)
        
        if not endpoints:
            raise HTTPException(status_code=400, detail="No relevant API endpoints found in the provided HAR file after filtering noise.")
            
        # 3. Prepare context for Claude
        context = ClaudePromptContext(
            task_description=task_description,
            server_name=server_name,
            endpoints=endpoints
        )
        
        # 4. Generate the server logic via Claude
        response = await generate_mcp_server(context)
        
        # 5. Save generated server to registry & filesystem
        await save_server_to_registry(server_name, task_description, response)
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
