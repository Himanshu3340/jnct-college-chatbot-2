import os
import streamlit as st
from rag_pipeline import CollegeChatbot

# ── Page Config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="College Chatbot",
    page_icon="🎓",
    layout="wide"
)

# ── Custom CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    .main-header {
        text-align: center;
        padding: 1rem;
        background: linear-gradient(90deg, #1a237e, #283593);
        color: white;
        border-radius: 10px;
        margin-bottom: 1.5rem;
    }
    .status-ready {
        background-color: #e8f5e9;
        color: #2e7d32;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: bold;
    }
    .status-not-ready {
        background-color: #fff3e0;
        color: #e65100;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: bold;
    }
    .source-box {
        background-color: #f5f5f5;
        padding: 0.5rem;
        border-left: 3px solid #1a237e;
        border-radius: 4px;
        font-size: 0.85rem;
        margin-top: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)

# ── Header ────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="main-header">
    <h1>🎓 College Chatbot</h1>
    <p>Ask me anything about our college — admissions, courses, fees, exams & more!</p>
</div>
""", unsafe_allow_html=True)

# ── Load Chatbot ──────────────────────────────────────────────────────────────
@st.cache_resource(show_spinner="Loading AI model...")
def load_chatbot():
    bot = CollegeChatbot()
    # Auto-load from data/ if documents exist but no vector DB was found
    if not bot.is_ready() and os.path.isdir("data"):
        files = [f for f in os.listdir("data") if f.endswith((".pdf", ".txt"))]
        if files:
            bot.load_documents("data/")
    return bot

chatbot = load_chatbot()

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.header("📁 Upload College Documents")
    st.markdown("Upload PDFs or TXT files like brochures, syllabi, fee structure, etc.")

    uploaded_files = st.file_uploader(
        "Choose PDF files",
        type=["pdf"],
        accept_multiple_files=True
    )

    # Always show Process button so existing data/ files can be (re)processed
    if st.button("Process Documents", type="primary", use_container_width=True):
        os.makedirs("data", exist_ok=True)
        with st.spinner("Processing documents..."):
            for file in (uploaded_files or []):
                with open(f"data/{file.name}", "wb") as f:
                    f.write(file.read())
            chunks = chatbot.load_documents("data/")
        if chunks > 0:
            n = len(uploaded_files) if uploaded_files else 0
            st.success(f"Processed into {chunks} chunks!")
            st.rerun()
        else:
            st.error("No content found in data/ folder.")

    st.divider()

    # Status indicator
    if chatbot.is_ready():
        if chatbot.vectorstore:
            st.markdown('<div class="status-ready">✅ Documents + Web search active</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="status-ready">🌐 Web search active (no documents)</div>', unsafe_allow_html=True)
    else:
        st.markdown('<div class="status-not-ready">⚠️ Loading...</div>', unsafe_allow_html=True)

    st.divider()

    # Clear chat button
    if st.button("Clear Chat History", use_container_width=True):
        st.session_state.messages = []
        chatbot.clear_memory()
        st.rerun()

    st.divider()
    st.markdown("**Sample Questions:**")
    sample_questions = [
        "What courses are offered?",
        "What are the admission requirements?",
        "What is the fee structure?",
        "What are the exam dates?",
        "Tell me about hostel facilities",
    ]
    for q in sample_questions:
        if st.button(q, use_container_width=True, key=q):
            st.session_state.pending_question = q

# ── Chat Interface ────────────────────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = []

if "pending_question" not in st.session_state:
    st.session_state.pending_question = None

# Display existing chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        if message.get("sources"):
            with st.expander("Sources"):
                for src in message["sources"]:
                    st.markdown(f'<div class="source-box">📄 {src}</div>', unsafe_allow_html=True)

# Handle input — either from chat box or sidebar quick question
user_input = st.chat_input("Ask about your college...")

if st.session_state.pending_question:
    user_input = st.session_state.pending_question
    st.session_state.pending_question = None

if user_input:
    # Show user message
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Get bot response
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            answer, sources = chatbot.chat(user_input)
        st.markdown(answer)
        if sources:
            with st.expander("Sources"):
                for src in sources:
                    st.markdown(f'<div class="source-box">📄 {src}</div>', unsafe_allow_html=True)

    st.session_state.messages.append({
        "role": "assistant",
        "content": answer,
        "sources": sources
    })
