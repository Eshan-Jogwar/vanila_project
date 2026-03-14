// API Configuration
const API_BASE_URL = 'https://gaykar-neuroassist.hf.space';

// DOM Elements
const signinForm = document.getElementById('signinForm');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const submitBtn = document.getElementById('submitBtn');

// Form Submit Handler
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('mri_option', 'existing'); // always use existing MRI

  setLoading(true, 'Signing in...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/sign_in`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Sign in failed');
    }

    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('patient_data', JSON.stringify(data.patient));

      showSuccess('Sign in successful! Loading your chat history...');

      setTimeout(() => {
        window.location.href = 'chatbot.html';
      }, 1500);
    } else {
      throw new Error('Sign in failed. Please try again.');
    }

  } catch (error) {
    console.error('Sign in error:', error);
    showError(error.message || 'An error occurred during sign in');
  } finally {
    setLoading(false);
  }
});

// Helper Functions
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  errorMessage.className = 'error-message show';
}

function hideError() {
  errorMessage.style.display = 'none';
  errorMessage.className = 'error-message';
}

function showSuccess(message) {
  errorMessage.textContent = message;
  errorMessage.className = 'error-message success show';
  errorMessage.style.display = 'block';
}

function setLoading(isLoading, message = 'Signing in...') {
  if (isLoading) {
    loading.style.display = 'block';
    loadingText.textContent = message;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
  } else {
    loading.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }
}

// Redirect to chatbot if already logged in
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    window.location.href = 'chatbot.html';
  }
});