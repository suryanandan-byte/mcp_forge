import logging
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
import asyncio

from models.schemas import GenerateResponse, ClaudePromptContext
from services.har_service import parse_har_file
from services.claude_service import generate_mcp_server
from services.registry_service import save_server_to_registry

logger = logging.getLogger(__name__)
router = APIRouter()


async def _run_pipeline(content_str: str, task_description: str, server_name: str) -> GenerateResponse:
    """Shared pipeline: parse HAR → generate MCP → save to registry."""
    endpoints = await asyncio.to_thread(parse_har_file, content_str)

    if not endpoints:
        raise HTTPException(
            status_code=400,
            detail="No relevant API endpoints found in the provided HAR file after filtering noise.",
        )

    context = ClaudePromptContext(
        task_description=task_description,
        server_name=server_name,
        endpoints=endpoints,
    )

    response = await generate_mcp_server(context)
    await save_server_to_registry(server_name, task_description, response)
    return response


@router.post("/", response_model=GenerateResponse)
async def generate_server(
    har_file: UploadFile = File(...),
    task_description: str = Form(...),
    server_name: str = Form(...)
):
    """Generate MCP server from an uploaded HAR file (multipart form)."""
    try:
        content = await har_file.read()
        try:
            content_str = content.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Uploaded HAR is not a valid UTF-8 text file.")

        return await _run_pipeline(content_str, task_description, server_name)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


class GenerateJsonRequest(BaseModel):
    har_content: str
    task_description: str
    server_name: str


@router.post("/json", response_model=GenerateResponse)
async def generate_server_json(body: GenerateJsonRequest):
    """Generate MCP server from raw HAR JSON string (for Chrome extension)."""
    try:
        return await _run_pipeline(body.har_content, body.task_description, body.server_name)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during JSON generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
