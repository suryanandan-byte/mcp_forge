from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os

from routers import generate, registry

# Load environment variables (mostly for GEMINI_API_KEY)
load_dotenv(override=True)

app = FastAPI(
    title="MCP Forge API",
    description="Backend API for capturing HAR files and generating MCP servers.",
    version="0.1.0"
)

# Useful for linking up to your future React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/generate", tags=["generation"])
app.include_router(registry.router, prefix="/registry", tags=["registry"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to MCP Forge API",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
