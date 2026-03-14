import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';

const API_BASE_URL = 'https://gaykar-neuroassist.hf.space';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) navigate('/chatbot');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('mri_option', 'existing');

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sign_in`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Sign in failed');
      }

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('patient_data', JSON.stringify(data.patient));
        setMessage({ text: 'Sign in successful! Loading your chat history...', type: 'success' });
        setTimeout(() => navigate('/chatbot'), 1500);
      } else {
        throw new Error('Sign in failed. Please try again.');
      }
    } catch (error) {
      setMessage({ text: error.message || 'An error occurred during sign in', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue your consultation</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message.text && (
            <div className={`error-message show ${message.type === 'success' ? 'success' : ''}`}>
              {message.text}
            </div>
          )}

          {loading && (
            <div className="loading" style={{ display: 'block' }}>
              <div className="spinner" />
              <p>Signing in...</p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
