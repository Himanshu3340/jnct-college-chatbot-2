import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../Home.css'

const PROGRAMS = [
  { name: 'B.Tech CSE', icon: '💻', seats: 120, fee: '₹55K–65K/yr', desc: 'Computer Science & Engineering' },
  { name: 'B.Tech CSE-AIML', icon: '🤖', seats: 60, fee: '₹55K–65K/yr', desc: 'AI & Machine Learning' },
  { name: 'B.Tech CSE-DS', icon: '📊', seats: 60, fee: '₹55K–65K/yr', desc: 'Data Science & AI' },
  { name: 'B.Tech ECE', icon: '📡', seats: 60, fee: '₹55K–65K/yr', desc: 'Electronics & Communication' },
  { name: 'B.Tech EEE', icon: '⚡', seats: 60, fee: '₹55K–65K/yr', desc: 'Electrical & Electronics' },
  { name: 'B.Tech ME', icon: '⚙️', seats: 60, fee: '₹55K–65K/yr', desc: 'Mechanical Engineering' },
  { name: 'B.Tech CE', icon: '🏗️', seats: 60, fee: '₹55K–65K/yr', desc: 'Civil Engineering' },
  { name: 'M.Tech / MBA', icon: '🎓', seats: null, fee: '₹45K–60K/yr', desc: 'Postgraduate Programs' },
]

const COMPANIES = [
  'TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini',
  'HCL', 'Cognizant', 'Google', 'Microsoft', 'Hexaware',
  'Impetus', 'L&T', 'Ashok Leyland', 'BEML', 'American Express',
]

const FACILITIES = [
  { icon: '🖥️', name: 'Smart Classrooms' },
  { icon: '📚', name: 'Digital Library' },
  { icon: '🔬', name: 'Research Labs' },
  { icon: '📶', name: '24/7 Wi-Fi' },
  { icon: '🏠', name: 'Boys & Girls Hostel' },
  { icon: '🍽️', name: 'Cafeteria' },
  { icon: '🏏', name: 'Sports Complex' },
  { icon: '🚌', name: 'Transport' },
  { icon: '🏥', name: 'Medical Facility' },
  { icon: '🏦', name: 'ATM on Campus' },
  { icon: '📹', name: 'CCTV Security' },
  { icon: '🎭', name: 'Auditorium' },
]

const ANNOUNCEMENTS = [
  'Admissions Open 2025–26 — Apply Now through DTE MP Portal',
  'Campus Placements: TCS, Infosys & Wipro visiting in Feb 2026',
  'Annual Technical Fest "TechNova 2026" — Register before 30th Jan',
  'Scholarship applications open for SC/ST/OBC on MP Scholarship Portal',
  'Last date for hostel allotment: 31st January 2026',
]

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [annIdx, setAnnIdx] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setAnnIdx(i => (i + 1) % ANNOUNCEMENTS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const closeNav = () => setNavOpen(false)

  return (
    <div className="jnct">

      {/* ── NAVBAR ── */}
      <header className={`jnct-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="jnct-header-inner">
          <div className="jnct-brand">
            <div className="jnct-logo-box">JNCT</div>
            <div className="jnct-brand-text">
              <span className="jnct-brand-main">Jai Narain College of Technology</span>
              <span className="jnct-brand-sub">Affiliated to RGPV · Approved by AICTE · Est. 2003</span>
            </div>
          </div>

          <nav className={`jnct-nav ${navOpen ? 'open' : ''}`}>
            <a href="#about" onClick={closeNav}>About</a>
            <a href="#programs" onClick={closeNav}>Programs</a>
            <a href="#admissions" onClick={closeNav}>Admissions</a>
            <a href="#placements" onClick={closeNav}>Placements</a>
            <a href="#facilities" onClick={closeNav}>Facilities</a>
            <a href="#contact" onClick={closeNav}>Contact</a>
            <Link to="/chat" className="nav-chatbot-btn" onClick={closeNav}>🤖 AI Chatbot</Link>
          </nav>

          <button className="jnct-hamburger" onClick={() => setNavOpen(v => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── TICKER ── */}
      <div className="jnct-ticker">
        <span className="ticker-badge">📢 Notice</span>
        <span className="ticker-msg">{ANNOUNCEMENTS[annIdx]}</span>
      </div>

      {/* ── HERO ── */}
      <section className="jnct-hero">
        <div className="hero-bg" />
        <div className="hero-body">
          <p className="hero-eyebrow">LNCT Group of Colleges · Bhopal, MP</p>
          <h1 className="hero-title">
            Jai Narain College of<br />Technology
          </h1>
          <p className="hero-tagline">
            Shaping Engineers of Tomorrow — Excellence in Education Since 2003
          </p>
          <div className="hero-actions">
            <a href="#admissions" className="btn-primary-hero">Apply Now 2025–26</a>
            <Link to="/chat" className="btn-secondary-hero">🤖 Ask AI Chatbot</Link>
          </div>
          <div className="hero-stats-bar">
            <div className="hstat"><strong>2003</strong><span>Established</span></div>
            <div className="hstat-div" />
            <div className="hstat"><strong>135+</strong><span>Faculty</span></div>
            <div className="hstat-div" />
            <div className="hstat"><strong>70%</strong><span>Placements</span></div>
            <div className="hstat-div" />
            <div className="hstat"><strong>28 LPA</strong><span>Top Package</span></div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="jnct-section">
        <div className="jnct-container">
          <div className="section-hd">
            <h2>About JNCT</h2>
            <div className="section-rule" />
          </div>
          <div className="about-layout">
            <div className="about-copy">
              <p>
                Jai Narain College of Technology (JNCT) is one of the premier private engineering
                institutions in Madhya Pradesh, established in 2003 under the prestigious
                <strong> LNCT Group of Colleges</strong>.
              </p>
              <p>
                Located on Raisen Road, Bhopal, JNCT is approved by <strong>AICTE</strong> and
                affiliated to <strong>Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)</strong>.
                With over two decades of academic excellence, the college prepares students
                for thriving careers in engineering, technology, and management.
              </p>
              <div className="about-tags">
                <span>AICTE Approved</span>
                <span>RGPV Affiliated</span>
                <span>LNCT Group</span>
                <span>Est. 2003</span>
              </div>
            </div>
            <div className="about-kpi-grid">
              <div className="kpi-card"><div className="kpi-icon">🎓</div><strong>8+</strong><span>Programs</span></div>
              <div className="kpi-card"><div className="kpi-icon">👩‍🏫</div><strong>135+</strong><span>Faculty</span></div>
              <div className="kpi-card"><div className="kpi-icon">🏢</div><strong>500+</strong><span>Recruiters</span></div>
              <div className="kpi-card"><div className="kpi-icon">🏆</div><strong>20+</strong><span>Years</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section id="programs" className="jnct-section jnct-section-alt">
        <div className="jnct-container">
          <div className="section-hd">
            <h2>Programs Offered</h2>
            <div className="section-rule" />
            <p className="section-sub">Industry-aligned engineering and management programs</p>
          </div>
          <div className="programs-grid">
            {PROGRAMS.map(p => (
              <div key={p.name} className="prog-card">
                <div className="prog-icon">{p.icon}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="prog-meta">
                  {p.seats && <span>Seats: {p.seats}</span>}
                  <span>{p.fee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADMISSIONS ── */}
      <section id="admissions" className="jnct-section">
        <div className="jnct-container">
          <div className="section-hd">
            <h2>Admissions 2025–26</h2>
            <div className="section-rule" />
          </div>
          <div className="adm-grid">
            <div className="adm-card">
              <div className="adm-badge">UG</div>
              <h3>B.Tech</h3>
              <ul>
                <li>10+2 with PCM, min 45% (40% for SC/ST)</li>
                <li>JEE Main score required</li>
                <li>Via DTE MP State Counselling</li>
                <li>Annual Fee: ₹55,000 – ₹65,000</li>
              </ul>
              <a href="https://www.dte.mponline.gov.in" target="_blank" rel="noreferrer" className="btn-adm">
                Apply via DTE MP →
              </a>
            </div>
            <div className="adm-card">
              <div className="adm-badge">PG</div>
              <h3>M.Tech</h3>
              <ul>
                <li>B.Tech/BE in relevant discipline, min 55%</li>
                <li>GATE Score / RGPV Entrance Test</li>
                <li>Annual Fee: ₹45,000 – ₹55,000</li>
                <li>Duration: 2 Years</li>
              </ul>
              <a href="mailto:info@jnctbhopal.ac.in" className="btn-adm">
                Contact Admissions →
              </a>
            </div>
            <div className="adm-card">
              <div className="adm-badge">MBA</div>
              <h3>MBA</h3>
              <ul>
                <li>Any bachelor's degree, min 50%</li>
                <li>CAT / MAT / CMAT or merit-based</li>
                <li>Total Fee: ₹60,000 (entire 2 years)</li>
                <li>Duration: 2 Years</li>
              </ul>
              <a href="mailto:info@jnctbhopal.ac.in" className="btn-adm">
                Contact Admissions →
              </a>
            </div>
          </div>
          <div className="adm-chatbot-cta">
            <p>Have questions about admissions, fees, or eligibility?</p>
            <Link to="/chat" className="btn-primary-hero">Chat with AI Assistant</Link>
          </div>
        </div>
      </section>

      {/* ── PLACEMENTS ── */}
      <section id="placements" className="jnct-section jnct-section-alt">
        <div className="jnct-container">
          <div className="section-hd">
            <h2>Placements</h2>
            <div className="section-rule" />
          </div>
          <div className="placement-stats">
            <div className="ps-card"><strong>70%</strong><span>Placement Rate</span></div>
            <div className="ps-card highlight"><strong>28 LPA</strong><span>Highest Package</span></div>
            <div className="ps-card"><strong>6.25 LPA</strong><span>Average Package</span></div>
            <div className="ps-card"><strong>500+</strong><span>Recruiting Companies</span></div>
          </div>
          <h3 className="recruiters-title">Top Recruiters</h3>
          <div className="companies-grid">
            {COMPANIES.map(c => (
              <div key={c} className="company-chip">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACILITIES ── */}
      <section id="facilities" className="jnct-section">
        <div className="jnct-container">
          <div className="section-hd">
            <h2>Campus Facilities</h2>
            <div className="section-rule" />
            <p className="section-sub">World-class infrastructure for holistic development</p>
          </div>
          <div className="facilities-grid">
            {FACILITIES.map(f => (
              <div key={f.name} className="fac-card">
                <div className="fac-icon">{f.icon}</div>
                <span>{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="jnct-section jnct-section-dark">
        <div className="jnct-container">
          <div className="section-hd">
            <h2>Contact Us</h2>
            <div className="section-rule white" />
          </div>
          <div className="contact-layout">
            <div className="contact-details">
              <div className="cd-item">
                <span className="cd-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>LNCT Campus, Raisen Road,<br />Bhopal – 462021, Madhya Pradesh</p>
                </div>
              </div>
              <div className="cd-item">
                <span className="cd-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>info@jnctbhopal.ac.in<br />placement@jnctbhopal.ac.in</p>
                </div>
              </div>
              <div className="cd-item">
                <span className="cd-icon">🕐</span>
                <div>
                  <strong>Office Hours</strong>
                  <p>Mon – Sat: 9:00 AM – 5:00 PM<br />Sunday: Closed</p>
                </div>
              </div>
              <div className="cd-item">
                <span className="cd-icon">🌐</span>
                <div>
                  <strong>Website</strong>
                  <p>www.jnctbhopal.ac.in</p>
                </div>
              </div>
            </div>
            <div className="contact-chatbot">
              <div className="chatbot-promo">
                <div className="chatbot-promo-icon">🤖</div>
                <h3>Need Instant Answers?</h3>
                <p>
                  Get answers about admissions, fees, courses, placements, hostel,
                  scholarships, and more — available 24/7.
                </p>
                <Link to="/chat" className="btn-primary-hero">Open AI Chatbot</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="jnct-footer">
        <div className="jnct-container">
          <div className="footer-grid">
            <div className="footer-col footer-brand-col">
              <div className="footer-logo">JNCT</div>
              <p>Jai Narain College of Technology<br />Part of LNCT Group of Colleges<br />Bhopal, Madhya Pradesh</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <a href="#about">About JNCT</a>
              <a href="#programs">Programs</a>
              <a href="#admissions">Admissions</a>
              <a href="#placements">Placements</a>
              <a href="#facilities">Facilities</a>
            </div>
            <div className="footer-col">
              <h4>Programs</h4>
              <span>B.Tech CSE / ECE / ME</span>
              <span>B.Tech EEE / CE</span>
              <span>B.Tech CSE-AIML / DS</span>
              <span>M.Tech (3 branches)</span>
              <span>MBA</span>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <Link to="/chat">🤖 AI Chatbot</Link>
              <a href="mailto:info@jnctbhopal.ac.in">📧 Email Us</a>
              <a href="#admissions">📋 Apply Now</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Jai Narain College of Technology, Bhopal. All rights reserved.</p>
            <p>Affiliated to RGPV · Approved by AICTE · LNCT Group</p>
          </div>
        </div>
      </footer>

      {/* ── FLOATING CHAT BUTTON ── */}
      <Link to="/chat" className="float-chat-btn" title="Ask AI Chatbot">
        🤖
        <span className="float-chat-label">Ask AI</span>
      </Link>
    </div>
  )
}
