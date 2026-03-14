import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const API_BASE_URL = 'https://gaykar-neuroassist.hf.space';

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
}

export default function Chatbot() {
  const navigate = useNavigate();
  const chatMessagesRef = useRef(null);
  const textareaRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const patient = JSON.parse(localStorage.getItem('patient_data') || 'null');

    if (!token || !patient) {
      navigate('/register');
      return;
    }

    setAuthToken(token);
    setPatientData(patient);
    loadChatHistory(token, patient);
  }, [navigate]);

  const loadChatHistory = async (token, patient) => {
    setHistoryLoading(true);
    setHistoryError(false);
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load chat history');
      }

      if (data.history && data.history.length > 0) {
        const loaded = data.history.map((msg, i) => ({
          id: i,
          role: msg.role,
          content: msg.role === 'bot' ? parseMarkdown(msg.content) : msg.content,
          isHTML: msg.role === 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(loaded);
      } else {
        setMessages([
          {
            id: 0,
            role: 'bot',
            content: `Hello ${patient.username}! I am your medical assistant. How can I help you today?`,
            isHTML: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setHistoryError(true);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      setTimeout(() => {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: query,
      isHTML: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setIsTyping(false);

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get response');
      }

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: data.html_response,
        isHTML: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setIsTyping(false);
      const errMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        isHTML: false,
        isError: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('patient_data');
      navigate('/register');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <div className="brain-icon">🧠</div>
          <div className="header-info">
            <h2>NeuroAssist</h2>
            <p className="status">AI Medical Assistant</p>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span>{patientData?.username || 'Loading...'}</span>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="chat-messages" ref={chatMessagesRef}>
        {historyLoading && (
          <div className="loading-messages">
            <div className="spinner" />
            <p>Loading chat history...</p>
          </div>
        )}

        {historyError && (
          <div className="error-message-area">
            <p>Failed to load chat history</p>
            <button
              onClick={() => loadChatHistory(authToken, patientData)}
            >
              Retry
            </button>
          </div>
        )}

        {!historyLoading &&
          !historyError &&
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'} ${msg.isError ? 'error' : ''}`}
            >
              {msg.isHTML ? (
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              ) : (
                <div className="message-content">{msg.content}</div>
              )}
              <div className="message-time">{msg.time}</div>
            </div>
          ))}

        {isTyping && (
          <div className="message bot-message typing-indicator">
            <div className="message-content">
              <div className="typing-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              id="messageInput"
              placeholder="Ask me about brain tumors, treatments, symptoms..."
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleTextareaInput}
              required
            />
            <button type="submit" id="sendBtn" disabled={isLoading}>
              <span className="send-icon">➤</span>
            </button>
          </div>
        </form>
        <p className="disclaimer">
          AI responses are for informational purposes only. Consult healthcare
          professionals for medical advice.
        </p>
      </div>
    </div>
  );
}
