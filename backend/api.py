import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from rag_pipeline import CollegeChatbot

app = FastAPI()

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chatbot = CollegeChatbot()


class ChatRequest(BaseModel):
    question: str


@app.get("/status")
def status():
    return {"ready": chatbot.is_ready()}


@app.post("/upload")
async def upload(files: List[UploadFile] = File(...)):
    os.makedirs("data", exist_ok=True)
    for file in files:
        dest = os.path.join("data", file.filename)
        with open(dest, "wb") as f:
            shutil.copyfileobj(file.file, f)
    chunks = chatbot.load_documents("./data/")
    if chunks == 0:
        raise HTTPException(status_code=400, detail="No content found in uploaded files.")
    return {"chunks": chunks, "files": len(files)}


@app.post("/chat")
def chat(req: ChatRequest):
    answer, sources = chatbot.chat(req.question)
    return {"answer": answer, "sources": sources}


@app.post("/reprocess")
def reprocess():
    if not os.path.exists("./data/") or not os.listdir("./data/"):
        raise HTTPException(status_code=400, detail="No files found in data folder.")
    chunks = chatbot.load_documents("./data/")
    if chunks == 0:
        raise HTTPException(status_code=400, detail="No content found in data folder.")
    return {"chunks": chunks}


@app.post("/clear")
def clear():
    chatbot.clear_memory()
    return {"ok": True}
