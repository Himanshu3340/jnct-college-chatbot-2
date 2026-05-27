# College Chatbot — Setup Guide

A college assistant that searches your uploaded documents first,
then falls back to live web search if the answer is not found locally.

---

## Requirements

- Python 3.10 or higher — https://www.pythonGROQ_API_KEY=your_key_hereGROQ_API_KEY=your_key_here.org/downloads/
- pip (included with Python)

---

## Step 1 — Get a Free Groq API Key

1. Go to https://console.groq.com and sign up (free)
2. Click **API Keys** → **Create API Key**
3. Copy the key (it starts with `gsk_...`)

---

## Step 2 — Add Your API Key

Open the `.env` file and replace the placeholder:

```
GROQ_API_KEY=your_key_here
```

---

## Step 3 — Install Dependencies

**Windows** — double-click `install.bat`

**Mac / Linux** — run in terminal:
```bash
pip install -r requirements.txt
```

Also install the backend server packages:
```bash
pip install fastapi uvicorn python-multipart
```

> First run downloads the AI embedding model (~90 MB). This happens once.

---

## Step 4 — Start the App

### Option A — React UI (recommended)

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn api:app --reload
```
Runs at `http://localhost:8000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Opens at `http://localhost:5173`

### Option B — Streamlit UI (legacy)

```bash
cd backend
streamlit run app.py
```

Opens automatically at `http://localhost:8501`

---

## Step 5 — Use the Chatbot

**Without documents** — just type any question. It will search the web.

**With your college documents (recommended):**
1. Click **Browse files** in the left sidebar
2. Upload your college PDFs or TXT files
3. Click **Process Documents**
4. Start asking questions

The chatbot searches your documents first. If the answer is not there,
it automatically searches the web.

---

## Project Structure

```
college-chatbot/
├── backend/
│   ├── api.py             — FastAPI backend (REST endpoints)
│   ├── app.py             — Streamlit UI (legacy)
│   ├── rag_pipeline.py    — AI logic (local search + web fallback)
│   ├── requirements.txt   — Python packages
│   ├── install.bat        — One-click installer (Windows)
│   ├── .env               — Your API key (never share this)
│   ├── data/              — Your uploaded documents go here
│   └── chroma_db/         — Auto-created vector database (local)
├── frontend/              — React UI (Vite + React)
└── setup.md
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` and `pip install fastapi uvicorn python-multipart` |
| `AuthenticationError` | Check `.env` — key must start with `gsk_` |
| `streamlit: command not found` | Try `python -m streamlit run app.py` |
| "Error connecting to server" | Make sure `uvicorn api:app --reload` is running before opening the frontend |
| Chatbot ignores uploaded files | Click **Process Documents** after uploading |
| Slow first startup | Normal — embedding model loads once |
| Web search returns no results | DuckDuckGo rate-limits heavy use; wait 30 seconds and retry |
| `EPERM` error on `npm run dev` | Delete `frontend/node_modules/.vite` and retry; avoid running from OneDrive folders |
# (recommended) use a Python 3.11 environment
conda create -n college-chatbot python=3.11 -y
conda activate college-chatbot
cd backend
python -m pip install -r requirements.txt

# then start
uvicorn api:app --reload