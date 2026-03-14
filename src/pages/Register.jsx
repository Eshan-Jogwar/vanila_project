import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const API_BASE_URL = 'https://gaykar-neuroassist.hf.space';

export default function Register() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    city: '',
    state: '',
    country: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) navigate('/chatbot');
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ text: 'File size must be less than 10MB', type: 'error' });
      e.target.value = '';
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setMessage({ text: 'Please upload a valid image file (JPG, PNG)', type: 'error' });
      e.target.value = '';
      return;
    }

    setMessage({ text: '', type: '' });
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setPreviewSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!imageFile) {
      setMessage({ text: 'Please upload an MRI image', type: 'error' });
      return;
    }

    if (form.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('city', form.city);
    formData.append('state', form.state);
    formData.append('country', form.country);
    formData.append('image', imageFile);

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('patient_data', JSON.stringify(data.patient));
        setMessage({ text: 'Registration successful! Redirecting to chatbot...', type: 'success' });
        setTimeout(() => navigate('/chatbot'), 2000);
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage({ text: error.message || 'An error occurred during registration', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>Brain Tumor Detection</h2>
        <p className="subtitle">Enter your details and upload MRI scan</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
          />

          <div className={`upload-area${imageFile ? ' hidden' : ''}`}>
            <div className="upload-icon">🧠</div>
            <div className="upload-text">Click to upload MRI image</div>
            <div className="upload-hint">Supports: JPG, PNG</div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {imageFile && (
            <div className="file-name show">📄 {imageFile.name}</div>
          )}

          {previewSrc && (
            <div className="image-preview show">
              <img src={previewSrc} alt="MRI Preview" />
            </div>
          )}

          {message.text && (
            <div className={`error-message show ${message.type === 'success' ? 'success' : ''}`}>
              {message.text}
            </div>
          )}

          {loading && (
            <div className="loading" style={{ display: 'block' }}>
              <div className="spinner" />
              <p>Analyzing MRI scan...</p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Analyze MRI'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
