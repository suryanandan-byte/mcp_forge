# ⚒️ MCP Forge

**Turn your browser clicks into AI superpowers instantly.**

[![Status](https://img.shields.io/badge/Status-Beta-purple.svg)]()
[![Python](https://img.shields.io/badge/Python-3.14+-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.135+-green.svg)]()
[![Model Context Protocol](https://img.shields.io/badge/MCP-Ready-orange.svg)]()

---

## 📖 The "Grandma" Explanation
Imagine you have an old recipe box, and every time you want a recipe, you have to manually open the box, flip through the cards, and find the right one. 

Now, imagine you show a smart assistant *exactly* how you do it just **once**. The assistant watches you, takes notes, and says, *"Got it!"* From then on, you just say, *"Hey, fetch me the apple pie recipe,"* and the assistant zips over, opens the box, finds the card, and hands it to you in seconds.

**MCP Forge is that assistant for your computer.** You record yourself doing something on a website (like searching for a product or checking the weather), hand that recording to MCP Forge, and it turns it into a permanent, reusable tool that an AI can use for you forever.

---

## 🎯 What is this project?
**MCP Forge** is an automated pipeline that ingests web traffic recordings (HAR files), analyzes the underlying API calls, and uses Large Language Models (like Claude or Gemini) to instantly generate fully functional **Model Context Protocol (MCP)** servers.

These servers can then be plugged into AI assistants (like Claude Desktop) to give them the ability to interact with those APIs autonomously.

---

## 😫 What pain point does it solve?
1. **The API Grind:** Manually reading API documentation, writing wrapper classes, handling authentication, and formatting data is tedious and time-consuming.
2. **Undocumented APIs:** Many amazing web tools don't have public APIs. Figuring out how their internal APIs work is a massive headache.
3. **The AI Tool Gap:** AI assistants are incredibly smart, but they are isolated. Giving them tools to interact with the real world (via MCP) currently requires a developer to write custom code for every single service.

**MCP Forge solves this by eliminating the coding step.** If you can click it in a browser, MCP Forge can turn it into an AI tool.

---

## 👥 Who is this for?
* **AI Tool Builders:** Developers building the next generation of agentic workflows who need to rapidly connect LLMs to external services.
* **Automation Enthusiasts:** People who want to automate web scraping, data entry, or research without writing boilerplate API integration code.
* **Security & Network Researchers:** Professionals who analyze network traffic and want to rapidly create reproducible scripts from their intercepts.
* **Anyone using Claude Desktop:** Users who want to give their local AI the ability to interact with their favorite websites directly.

---

## 🚀 How it Works

1. **Capture:** You open your browser's Developer Tools, perform an action on a website (e.g., search for a GitHub repo), and save the network traffic as a `.har` file.
2. **Upload:** You provide the HAR file and a brief task description to the MCP Forge dashboard.
3. **Analyze:** The backend filters out the "noise" (images, analytics trackers, CSS) and isolates the crucial API calls.
4. **Generate:** The filtered endpoints are sent to a reasoning model (Gemini 2.5 Flash / Claude) which synthesizes a clean, heavily-typed Python script using the `fastmcp` library.
5. **Deploy:** The server is instantly available in your registry, ready to be attached to your AI assistant.

---

## 🛠️ Tech Stack

* **Backend:** FastAPI (Python)
* **AI engine:** Google Gemini GenAI SDK / Anthropic SDK
* **Output Standard:** Model Context Protocol (MCP) using `fastmcp`
* **Frontend:** React + Vite + Tailwind CSS (Coming Soon!)

---

## 💻 Getting Started

### Prerequisites
* Python >= 3.14
* `uv` package manager

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   uv sync
   ```
4. Configure your `.env` file with your API keys:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
5. Run the backend:
   ```bash
   uv run uvicorn main:app --reload
   ```

*(Frontend instructions will be added here once Phase 3 is complete!)*
