import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

const API = import.meta.env.VITE_API_URL || '/api'

const SAMPLE_QUESTIONS = [
  'What courses are offered?',
  'What are the admission requirements?',
  'What is the fee structure?',
  'What are the exam dates?',
  'Tell me about hostel facilities',
  'What is the placement rate?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [reprocessing, setReprocessing] = useState(false)
  const [reprocessStatus, setReprocessStatus] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => { checkStatus() }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function checkStatus() {
    try {
      const res = await fetch(`${API}/status`)
      const data = await res.json()
      setReady(data.ready)
    } catch {}
  }

  async function handleUpload() {
    if (!selectedFiles.length) return
    setUploading(true)
    setUploadStatus(null)
    const form = new FormData()
    selectedFiles.forEach(f => form.append('files', f))
    try {
      const res = await fetch(`${API}/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        setUploadStatus({ ok: true, msg: `Processed ${selectedFiles.length} file(s) into ${data.chunks} chunks!` })
        setReady(true)
        setSelectedFiles([])
        fileInputRef.current.value = ''
      } else {
        setUploadStatus({ ok: false, msg: data.detail || 'Upload failed.' })
      }
    } catch {
      setUploadStatus({ ok: false, msg: 'Could not connect to server.' })
    }
    setUploading(false)
  }

  async function sendMessage(question) {
    const text = question.trim()
    if (!text || loading) return
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, sources: data.sources }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to server.', sources: [] }])
    }
    setLoading(false)
  }

  async function handleReprocess() {
    setReprocessing(true)
    setReprocessStatus(null)
    try {
      const res = await fetch(`${API}/reprocess`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setReprocessStatus({ ok: true, msg: `Re-indexed ${data.chunks} chunks from data folder.` })
        setReady(true)
      } else {
        setReprocessStatus({ ok: false, msg: data.detail || 'Reprocess failed.' })
      }
    } catch {
      setReprocessStatus({ ok: false, msg: 'Could not connect to server.' })
    }
    setReprocessing(false)
  }

  async function clearChat() {
    try { await fetch(`${API}/clear`, { method: 'POST' }) } catch {}
    setMessages([])
  }

  return (
    <div className="app">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">

        {/* Brand header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo-box">JNCT</div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-main">Jai Narain College</span>
              <span className="sidebar-brand-sub">of Technology, Bhopal</span>
            </div>
          </div>
          <div className="sidebar-tagline">
            <div className="tagline-icon">🤖</div>
            <div className="tagline-text">
              <strong>AI Assistant</strong>
              <span>Powered by RAG + Web Search</span>
            </div>
          </div>
        </div>

        <Link to="/" className="back-home-btn">← Back to Homepage</Link>

        <div className={`status-badge ${ready ? 'ready' : 'pending'}`}>
          {ready ? '✅ Ready to answer' : '⚠️ Upload documents first'}
        </div>

        <section className="sidebar-section">
          <h3>Upload Documents</h3>
          <p className="hint">PDF, CSV, or TXT documents (brochures, syllabi, fee sheets, etc.)</p>
          <label className="file-label">
            📁 Choose files
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.csv,.txt"
              multiple
              onChange={e => { setSelectedFiles(Array.from(e.target.files)); setUploadStatus(null) }}
            />
          </label>
          {selectedFiles.length > 0 && (
            <p className="hint selected">✓ {selectedFiles.length} file(s) selected</p>
          )}
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={!selectedFiles.length || uploading}
          >
            {uploading ? '⏳ Processing...' : '⚡ Process Documents'}
          </button>
          {uploadStatus && (
            <p className={`upload-msg ${uploadStatus.ok ? 'ok' : 'err'}`}>{uploadStatus.msg}</p>
          )}
        </section>

        <section className="sidebar-section">
          <h3>Reprocess Local Data</h3>
          <p className="hint">Re-index files already in the server's data folder.</p>
          <button
            className="btn-primary"
            onClick={handleReprocess}
            disabled={reprocessing}
          >
            {reprocessing ? '⏳ Reprocessing...' : '🔄 Reprocess Data'}
          </button>
          {reprocessStatus && (
            <p className={`upload-msg ${reprocessStatus.ok ? 'ok' : 'err'}`}>{reprocessStatus.msg}</p>
          )}
        </section>

        <section className="sidebar-section">
          <h3>Quick Questions</h3>
          {SAMPLE_QUESTIONS.map(q => (
            <button key={q} className="btn-sample" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </section>

        <button className="btn-clear" onClick={clearChat}>
          🗑 Clear Chat History
        </button>
      </aside>

      {/* ── CHAT MAIN ── */}
      <main className="chat-main">

        {/* Top bar */}
        <div className="chat-topbar">
          <div className="chat-topbar-left">
            <div className="chat-topbar-avatar">🎓</div>
            <div className="chat-topbar-info">
              <strong>JNCT AI Assistant</strong>
              <span>
                <span className="online-dot" />
                {ready ? 'Documents loaded · Ready' : 'Web search mode'}
              </span>
            </div>
          </div>
          <div className="chat-topbar-badge">RGPV · AICTE Approved</div>
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon-wrap">🎓</div>
              <h3>Hi! I'm your JNCT Assistant</h3>
              <p>Ask me anything about admissions, courses, fees, placements, hostel, scholarships, and more.</p>
              <div className="empty-chips">
                {SAMPLE_QUESTIONS.slice(0, 4).map(q => (
                  <button key={q} className="empty-chip" onClick={() => sendMessage(q)}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role}`}>
              <div className="avatar">{msg.role === 'user' ? '🧑' : '🎓'}</div>
              <div className="message-body">
                <div className="msg-label">{msg.role === 'user' ? 'You' : 'JNCT AI'}</div>
                <div className="bubble">{msg.content}</div>
                {msg.sources?.length > 0 && (
                  <div className="sources">
                    <span className="sources-label">Sources:</span>
                    {msg.sources.map((s, j) => (
                      <span key={j} className="source-chip">📄 {s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="avatar">🎓</div>
              <div className="message-body">
                <div className="msg-label">JNCT AI</div>
                <div className="bubble typing"><span /><span /><span /></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          className="input-area"
          onSubmit={e => { e.preventDefault(); sendMessage(input) }}
        >
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about courses, fees, admissions, placements..."
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-send"
            disabled={!input.trim() || loading}
          >
            Send ›
          </button>
        </form>
      </main>
    </div>
  )
}
