import os
from google import genai
from dotenv import load_dotenv

# Load .env from the same directory
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path, override=True)

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")

try:
    for model in client.models.list():
        print(f"Model Name: {model.name}, Display Name: {model.display_name}, Methods: {model.supported_generation_methods}")
except Exception as e:
    print(f"Error listing models: {e}")
