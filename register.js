// API Configuration
const API_BASE_URL = 'https://gaykar-neuroassist.hf.space';

// DOM Elements
const registerForm = document.getElementById('registerForm');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const submitBtn = document.getElementById('submitBtn');

// File Preview Handler
fileInput.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    const file = this.files[0];

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB');
      this.value = '';
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showError('Please upload a valid image file (JPG, PNG)');
      this.value = '';
      return;
    }

    fileName.textContent = '📄 ' + file.name;
    fileName.classList.add('show');
    uploadArea.classList.add('hidden');

    const reader = new FileReader();
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      imagePreview.classList.add('show');
    };
    reader.readAsDataURL(file);

    hideError();
  }
});

// Form Submit Handler
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();
  const country = document.getElementById('country').value.trim();
  const imageFile = fileInput.files[0];

  // Validation
  if (!imageFile) {
    showError('Please upload an MRI image');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }

  // Prepare FormData
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('city', city);
  formData.append('state', state);
  formData.append('country', country);
  formData.append('image', imageFile);

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Registration failed');
    }

    if (data.success) {
      // Store token and patient data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('patient_data', JSON.stringify(data.patient));

      showSuccess('Registration successful! Redirecting to chatbot...');

      setTimeout(() => {
        window.location.href = 'chatbot.html';
      }, 2000);
    } else {
      throw new Error('Registration failed. Please try again.');
    }

  } catch (error) {
    console.error('Registration error:', error);
    showError(error.message || 'An error occurred during registration');
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

function setLoading(isLoading) {
  if (isLoading) {
    loading.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
  } else {
    loading.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Analyze MRI';
  }
}

// Redirect to chatbot if already logged in
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    window.location.href = 'chatbot.html';
  }
});