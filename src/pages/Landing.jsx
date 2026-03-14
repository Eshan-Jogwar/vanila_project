import { Link } from 'react-router-dom';
import './Landing.css';

const features = [
  {
    icon: '🖼️',
    title: 'MRI Classification',
    desc: 'CNN classifies Glioma, Meningioma, Pituitary Tumor, or No Tumor from uploaded scans.',
  },
  {
    icon: '🤖',
    title: 'Medical Chatbot',
    desc: 'Groq LLM powered assistant with full conversation memory and context awareness.',
  },
  {
    icon: '🔍',
    title: 'Hybrid RAG',
    desc: 'Dense + sparse (BM25) retrieval over a scraped medical knowledge base for precise answers.',
  },
  {
    icon: '🏆',
    title: 'Reranking',
    desc: 'Cohere reranker selects the most relevant context chunks from retrieved documents.',
  },
  {
    icon: '🌍',
    title: 'Web Search',
    desc: 'SerpAPI fetches real-time hospital & treatment info personalised to your location.',
  },
  {
    icon: '📡',
    title: 'REST API',
    desc: 'Full FastAPI backend with JWT auth, chat history, and MRI classification endpoints.',
  },
  {
    icon: '☁️',
    title: 'Cloud Native',
    desc: 'Neon PostgreSQL, Cloudinary image storage, and hosted on Hugging Face Spaces.',
  },
  {
    icon: '🔐',
    title: 'Secure Auth',
    desc: 'JWT token-based authentication with bcrypt password hashing for patient privacy.',
  },
];

const techStack = [
  {
    category: '🖥️ Backend',
    items: ['FastAPI', 'Uvicorn', 'Python 3.12', 'Docker'],
  },
  {
    category: '🤖 AI / ML',
    items: ['TensorFlow', 'Groq LLM', 'LangChain', 'Sentence Transformers', 'Pinecone', 'BM25', 'Cohere', 'NLTK'],
  },
  {
    category: '🌐 Web Intelligence',
    items: ['SerpAPI', 'BeautifulSoup', 'Requests'],
  },
  {
    category: '🗄️ Data & Storage',
    items: ['PostgreSQL', 'Neon.tech', 'SQLAlchemy', 'Cloudinary'],
  },
  {
    category: '🔐 Auth',
    items: ['JWT (python-jose)', 'Bcrypt', 'Passlib'],
  },
  {
    category: '🚀 Deployment',
    items: ['Docker', 'Hugging Face Spaces', 'HF Hub'],
  },
];

const whatItDoes = [
  { icon: '🧬', text: 'Detects brain tumors from MRI scans using a CNN deep learning model built with TensorFlow' },
  { icon: '💬', text: 'Answers medical questions through a RAG-powered conversational assistant' },
  { icon: '🌐', text: 'Searches the web in real-time for treatment options and hospital information' },
  { icon: '📍', text: 'Personalizes responses based on the patient\'s city, state, and country' },
  { icon: '🔐', text: 'Manages patients with secure JWT-based authentication' },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* ── Nav ── */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="nav-brain">🧠</span>
          <span className="nav-title">NeuroAssist</span>
        </div>
        <div className="nav-links">
          <Link to="/signin" className="nav-link">Sign In</Link>
          <Link to="/register" className="nav-btn">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">🚀 Production-Ready Medical AI</div>
        <h1 className="hero-title">
          AI-Powered<br />
          <span className="hero-gradient">Brain Tumor Detection</span><br />
          & Medical Assistant
        </h1>
        <p className="hero-sub">
          NeuroAssist combines deep learning MRI classification with a RAG-powered
          conversational AI to deliver personalised, real-time medical guidance.
        </p>
        <div className="hero-tags">
          {['Python', 'FastAPI', 'TensorFlow', 'Docker', 'HuggingFace', 'PostgreSQL', 'Pinecone', 'LangChain', 'Groq', 'Cohere'].map((t) => (
            <span key={t} className="hero-tag">{t}</span>
          ))}
        </div>
        <div className="hero-ctas">
          <Link to="/register" className="cta-primary">Start Free Consultation</Link>
          <Link to="/signin" className="cta-secondary">Sign In</Link>
        </div>
      </section>

      {/* ── What is NeuroAssist ── */}
      <section className="section what-section">
        <div className="section-inner">
          <div className="section-label">🔬 What is NeuroAssist?</div>
          <h2 className="section-title">A production-grade medical AI backend</h2>
          <p className="section-sub">
            NeuroAssist is an end-to-end intelligent platform built for real clinical utility.
          </p>
          <div className="what-list">
            {whatItDoes.map((item, i) => (
              <div key={i} className="what-item">
                <div className="what-icon">{item.icon}</div>
                <p className="what-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Diagram ── */}
      <section className="section diagram-section">
        <div className="section-inner">
          <div className="section-label">🗺️ System Architecture</div>
          <h2 className="section-title">Medical Query Answering Flow</h2>
          <p className="section-sub">
            See how your query travels through the AI pipeline — from MRI upload to personalised answer.
          </p>
          <div className="diagram-wrapper">
            <img
              src="/flow-diagram.png"
              alt="Medical Query Answering Flow diagram"
              className="diagram-img"
            />
          </div>
        </div>
      </section>

      {/* ── Key Features ── */}
      <section className="section features-section">
        <div className="section-inner">
          <div className="section-label">✨ Key Features</div>
          <h2 className="section-title">Everything you need, built in</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="section stack-section">
        <div className="section-inner">
          <div className="section-label">🛠️ Tech Stack</div>
          <h2 className="section-title">Built with industry-grade tools</h2>
          <div className="stack-grid">
            {techStack.map((group, i) => (
              <div key={i} className="stack-group">
                <div className="stack-category">{group.category}</div>
                <div className="stack-pills">
                  {group.items.map((item) => (
                    <span key={item} className="stack-pill">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <h2>Ready to get your MRI analysed?</h2>
          <p>Create your free account and chat with NeuroAssist today.</p>
          <div className="cta-banner-btns">
            <Link to="/register" className="cta-primary">Create Free Account</Link>
            <Link to="/signin" className="cta-outline">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <span className="nav-brain">🧠</span>
        <span className="footer-name">NeuroAssist</span>
        <span className="footer-sep">·</span>
        <span className="footer-note">AI responses are for informational purposes only. Always consult a qualified healthcare professional.</span>
      </footer>
    </div>
  );
}
