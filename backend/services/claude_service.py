import os
import json
import logging
from google import genai
from google.genai import types
from models.schemas import ClaudePromptContext, GenerateResponse, ToolSchema

logger = logging.getLogger(__name__)

async def generate_mcp_server(context: ClaudePromptContext) -> GenerateResponse:
    # Initialize the Gemini client instead of Anthropic
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))
    
    endpoints_json = [e.model_dump() for e in context.endpoints]
    
    system_prompt = """You are an expert engineering assistant.
Your task is to analyze network intercepts (HAR endpoints) and generate a fully functional Model Context Protocol (MCP) server using the `fastmcp` library in Python.
The server should help the user achieve their specific task.

Here is the FastMCP server template pattern you must follow for your Python code generation:
from mcp.server.fastmcp import FastMCP
import httpx

mcp = FastMCP("{server_name}")

@mcp.tool()
def tool_name(param: str) -> dict:
    \"\"\"Clear description of what this tool does.\"\"\"
    response = httpx.get(
        "https://api.example.com/endpoint",
        params={"param": param},
        headers={"Content-Type": "application/json"}
    )
    return response.json()

if __name__ == "__main__":
    mcp.run()

You must output a single JSON object with the following keys:
- "server_code": A strictly valid Python string containing the fully written FastMCP server.
- "tools": A list of objects, each with "name", "description", "parameters" (key-value dict of param to type/desc), "endpoint" (url string), and "method" (string).
- "install_command": A pip command string to install required dependencies (e.g., 'uv pip install mcp httpx').
- "claude_config": A dictionary representing the config block for claude_desktop_config.json.
- "readme": A markdown formatted string with instructions.

Return ONLY a raw JSON string without any markdown wraps like ```json."""

    user_prompt = f"""Task Description: {context.task_description}
Server Name: {context.server_name}

Here are the filtered network endpoints observed:
{json.dumps(endpoints_json, indent=2)}

Generate the required JSON output."""

    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.2,
            )
        )
        
        response_text = response.text
        
        # Clean up in case Gemini outputs markdown despite instructions
        if response_text.strip().startswith("```json"):
            response_text = response_text.strip()[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
        elif response_text.strip().startswith("```"):
            response_text = response_text.strip()[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
                
        data = json.loads(response_text.strip())
        
        return GenerateResponse(
            server_code=data["server_code"],
            tools=[ToolSchema(**t) for t in data["tools"]],
            install_command=data["install_command"],
            claude_config=data["claude_config"],
            readme=data["readme"]
        )
    except Exception as e:
        logger.error(f"Failed to generate MCP server via Gemini: {str(e)}")
        raise e
