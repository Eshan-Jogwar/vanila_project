// API Configuration
const API_BASE_URL = 'https://gaykar-neuroassist.hf.space';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const userInfo = document.getElementById('userInfo');
const username = document.getElementById('username');

// Global State
let isLoading = false;
let patientData = null;
let authToken = null;

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
    authToken = localStorage.getItem('auth_token');
    patientData = JSON.parse(localStorage.getItem('patient_data') || 'null');

    if (!authToken || !patientData) {
        window.location.href = 'register.html';
        return;
    }

    username.textContent = patientData.username;
    await loadChatHistory();
    messageInput.addEventListener('input', autoResizeTextarea);
});

// Load full chat history for display
async function loadChatHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to load chat history');
        }

        chatMessages.innerHTML = '';

        if (data.history && data.history.length > 0) {
            data.history.forEach(msg => {
                // bot messages from DB are plain text, parse markdown
                if (msg.role === 'bot') {
                    addMessageToUI(parseMarkdown(msg.content), 'bot', false, true);
                } else {
                    addMessageToUI(msg.content, 'user');
                }
            });
        } else {
            addMessageToUI(
                `Hello ${patientData.username}! I am your medical assistant. How can I help you today?`,
                'bot'
            );
        }

        scrollToBottom();

    } catch (error) {
        console.error('Error loading chat history:', error);
        chatMessages.innerHTML = `
            <div class="error-message">
                <p>Failed to load chat history</p>
                <button onclick="loadChatHistory()">Retry</button>
            </div>
        `;
    }
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = messageInput.value.trim();
    if (!query || isLoading) return;

    addMessageToUI(query, 'user');

    messageInput.value = '';
    messageInput.style.height = 'auto';

    isLoading = true;
    sendBtn.disabled = true;

    const typingId = showTypingIndicator();

    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        removeTypingIndicator(typingId);

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to get response');
        }

        // Use html_response from backend (already markdown rendered)
        addMessageToUI(data.html_response, 'bot', false, true);

    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator(typingId);
        addMessageToUI(
            'Sorry, I encountered an error. Please try again.',
            'bot',
            true
        );
    } finally {
        isLoading = false;
        sendBtn.disabled = false;
        messageInput.focus();
    }
});

// Add message to UI
// isHTML = true means content is already rendered HTML, inject directly
function addMessageToUI(content, role, isError = false, isHTML = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message ${isError ? 'error' : ''}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    if (isHTML && !isError) {
        messageContent.innerHTML = content;
    } else {
        messageContent.textContent = content;
    }

    const timestamp = document.createElement('div');
    timestamp.className = 'message-time';
    timestamp.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(timestamp);
    chatMessages.appendChild(messageDiv);

    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    return 'typing-indicator';
}

// Remove typing indicator
function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) indicator.remove();
}

// Simple markdown parser (used for history messages from DB)
function parseMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
}

// Auto-resize textarea
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
}

// Scroll to bottom
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('patient_data');
        window.location.href = 'register.html';
    }
}

// Handle Enter key (send on Enter, new line on Shift+Enter)
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});