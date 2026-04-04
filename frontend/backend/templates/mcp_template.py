MCP_TEMPLATE = """from mcp.server.fastmcp import FastMCP
import httpx

mcp = FastMCP("{server_name}")

@mcp.tool()
def tool_name(param: str) -> dict:
    \"\"\"Clear description of what this tool does.\"\"\"
    response = httpx.get(
        "https://api.example.com/endpoint",
        params={"param": param},
        headers={{"Content-Type": "application/json"}}
    )
    return response.json()

if __name__ == "__main__":
    mcp.run()
"""
