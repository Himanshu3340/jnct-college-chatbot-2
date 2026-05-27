import os
import csv
from typing import List
from types import SimpleNamespace
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.messages import SystemMessage, HumanMessage
import requests

load_dotenv()

CHROMA_DB_DIR = "./chroma_db"
DATA_DIR = "./data"

DOC_SYSTEM = (
    "You are a helpful college assistant. Answer using ONLY the provided context and chat history. "
    "If the context does not contain enough information to answer, reply with exactly: NOT_IN_DOCUMENTS"
)

WEB_SYSTEM = (
    "You are a helpful assistant. Answer the question using the web search results and chat history. "
    "Be concise and helpful."
)


class CollegeChatbot:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"}
        )
        self.llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.3,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        self.search = DuckDuckGoSearchRun()
        self.vectorstore = None
        self.chat_history: list[tuple[str, str]] = []
        self._load_existing_db()

    def _history_text(self) -> str:
        return "".join(
            f"Human: {h}\nAssistant: {a}\n\n"
            for h, a in self.chat_history[-5:]
        )

    def _load_existing_db(self):
        if os.path.exists(CHROMA_DB_DIR):
            try:
                self.vectorstore = Chroma(
                    persist_directory=CHROMA_DB_DIR,
                    embedding_function=self.embeddings
                )
            except Exception:
                pass

    def load_documents(self, data_dir: str = DATA_DIR):
        documents = []
        pdf_loader = DirectoryLoader(data_dir, glob="**/*.pdf", loader_cls=PyPDFLoader)
        txt_loader = DirectoryLoader(data_dir, glob="**/*.txt", loader_cls=TextLoader,
                                     loader_kwargs={"encoding": "utf-8"})
        documents.extend(pdf_loader.load())
        documents.extend(txt_loader.load())

        # Load CSV files: convert each CSV row into a small document
        for root, _, files in os.walk(data_dir):
            for fname in files:
                if not fname.lower().endswith(".csv"):
                    continue
                path = os.path.join(root, fname)
                try:
                    with open(path, newline="", encoding="utf-8") as fh:
                        reader = csv.reader(fh)
                        # Try to interpret first row as header
                        headers = next(reader, None)
                        has_header = headers is not None and any(h.strip() for h in headers)
                        for i, row in enumerate(reader):
                            if has_header:
                                pairs = [f"{headers[j].strip()}: {row[j].strip()}" for j in range(min(len(headers), len(row)))]
                                content = "\n".join(pairs)
                            else:
                                content = ", ".join(cell.strip() for cell in row)
                            doc = SimpleNamespace(page_content=content, metadata={"source": path, "row": i})
                            documents.append(doc)
                except Exception:
                    # ignore malformed CSVs
                    continue

        if not documents:
            return 0

        chunks = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        ).split_documents(documents)

        self.vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=CHROMA_DB_DIR
        )
        return len(chunks)

    def chat(self, question: str) -> tuple[str, list]:
        history = self._history_text()

        # ── Step 1: try local documents ───────────────────────────────────────
        if self.vectorstore:
            docs = self.vectorstore.similarity_search(question, k=4)
            if docs:
                context = "\n\n".join(d.page_content for d in docs)
                response = self.llm.invoke([
                    SystemMessage(content=DOC_SYSTEM),
                    HumanMessage(content=(
                        f"Chat History:\n{history}\n\n"
                        f"Context:\n{context}\n\n"
                        f"Question: {question}"
                    )),
                ])
                answer = response.content.strip()

                if "NOT_IN_DOCUMENTS" not in answer:
                    sources = []
                    for doc in docs:
                        page = doc.metadata.get("page", None)
                        src = doc.metadata.get("source", "Unknown")
                        try:
                            label = f"Page {int(page) + 1} — " if page is not None else ""
                        except (TypeError, ValueError):
                            label = ""
                        sources.append(f"{label}{os.path.basename(src)}")
                    self.chat_history.append((question, answer))
                    return answer, list(set(sources))

        # ── Step 2: fall back to web search ───────────────────────────────────
        web_results = ""
        try:
            web_results = self.search.run(question)
        except Exception as e:
            err = str(e)
            # Try a lightweight fallback to DuckDuckGo Instant Answer API if the search tool fails
            if any(t in err.lower() for t in ("dns", "connect", "no connections available", "connection refused", "timeout")):
                try:
                    resp = requests.get(
                        "https://api.duckduckgo.com/",
                        params={"q": question, "format": "json", "no_redirect": 1, "no_html": 1},
                        timeout=10,
                    )
                    data = resp.json()
                    parts = []
                    if data.get("AbstractText"):
                        parts.append(data["AbstractText"])
                    if data.get("Answer"):
                        parts.append(data["Answer"])
                    # include some related topics titles
                    for t in data.get("RelatedTopics", [])[:5]:
                        if isinstance(t, dict):
                            if t.get("Text"):
                                parts.append(t.get("Text"))
                            elif t.get("Name"):
                                parts.append(t.get("Name"))
                    web_results = "\n\n".join(parts) or "(no instant-answer results)"
                except Exception:
                    return (
                        "Web search failed due to a network/DNS error. "
                        "Please check your internet connection, DNS settings, or proxy (HTTP_PROXY/HTTPS_PROXY).",
                        []
                    )
            else:
                return (
                    "Web search failed due to a search service error. "
                    "Please check your search configuration or try again later.",
                    []
                )

        if not web_results:
            web_results = "(no web search results available)"

        try:
            response = self.llm.invoke([
                SystemMessage(content=WEB_SYSTEM),
                HumanMessage(content=(
                    f"Chat History:\n{history}\n\n"
                    f"Web search results:\n{web_results}\n\n"
                    f"Question: {question}"
                )),
            ])
            answer = response.content.strip()
            self.chat_history.append((question, answer))
            return answer, ["🌐 Web search"]
        except Exception as e:
            return f"Sorry, I couldn't find an answer: {str(e)}", []

    def clear_memory(self):
        self.chat_history.clear()

    def is_ready(self) -> bool:
        return True
