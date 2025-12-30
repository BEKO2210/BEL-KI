/**
 * BEL BRAIN - Client-Side AI Chat Logic
 * Hugging Face Inference API Integration
 * Model: beko2210/Bel-KI-v1
 */

// ============================================
// CONFIGURATION
// ============================================

// Configuration
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/beko2210/Bel-KI-v1";
const MAX_RETRIES = 3;
const RETRY_DELAY = 20000; // 20 seconds

// Get token from localStorage or prompt user
function getToken() {
  return localStorage.getItem('hf_token') || null;
}

// Set token in localStorage
function setToken(token) {
  localStorage.setItem('hf_token', token);
}

// ============================================
// STATE MANAGEMENT
// ============================================

let conversationHistory = [];
let isProcessing = false;
let retryCount = 0;

// ============================================
// DOM ELEMENTS
// ============================================

const messagesArea = document.getElementById('messagesArea');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Auto-resize textarea
  userInput.addEventListener('input', autoResizeTextarea);

  // Send on Enter (Shift+Enter for new line)
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Send button click
  sendButton.addEventListener('click', handleSendMessage);

  // Check model status
  checkModelStatus();
});

// ============================================
// AUTO-RESIZE TEXTAREA
// ============================================

function autoResizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
}

// ============================================
// STATUS MANAGEMENT
// ============================================

function setStatus(status, text) {
  statusBadge.className = `status-badge status-${status}`;
  statusText.textContent = text;
}

async function checkModelStatus() {
  try {
    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: "Test",
        parameters: { max_new_tokens: 1 }
      })
    });

    if (response.ok) {
      setStatus('online', 'Online');
    } else if (response.status === 503) {
      setStatus('loading', 'Modell lädt...');
    } else {
      setStatus('offline', 'Offline');
    }
  } catch (error) {
    setStatus('offline', 'Offline');
  }
}

// ============================================
// MESSAGE HANDLING
// ============================================

async function handleSendMessage() {
  const message = userInput.value.trim();

  // Validation
  if (!message || isProcessing) return;

  // Check if token exists
  const token = getToken();
  if (!token) {
    addSystemMessage("⚠️ **Kein Token gefunden!**\n\nBitte lade die Seite neu und gib deinen HuggingFace Token ein.");
    return;
  }

  // Add user message to UI
  addMessage(message, 'user');

  // Clear input
  userInput.value = '';
  autoResizeTextarea();

  // Add to conversation history
  conversationHistory.push({
    role: 'user',
    content: message
  });

  // Get AI response
  await getAIResponse(message);
}

function addMessage(content, role) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${role}`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  if (role === 'assistant') {
    // Render markdown for assistant messages
    contentDiv.innerHTML = marked.parse(content);
  } else {
    // Plain text for user messages
    contentDiv.textContent = content;
  }

  messageDiv.appendChild(contentDiv);
  messagesArea.appendChild(messageDiv);

  // Scroll to bottom
  scrollToBottom();
}

function addSystemMessage(content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message message-assistant';
  messageDiv.style.background = 'rgba(255, 51, 102, 0.1)';
  messageDiv.style.borderColor = 'rgba(255, 51, 102, 0.3)';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML = marked.parse(content);

  messageDiv.appendChild(contentDiv);
  messagesArea.appendChild(messageDiv);

  scrollToBottom();
}

function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
  scrollToBottom();
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

function scrollToBottom() {
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// ============================================
// AI RESPONSE LOGIC
// ============================================

async function getAIResponse(userMessage) {
  isProcessing = true;
  sendButton.disabled = true;
  showTypingIndicator();
  setStatus('loading', 'Denkt nach...');

  try {
    const response = await queryHuggingFace(userMessage);

    if (response.success) {
      // Add assistant response
      conversationHistory.push({
        role: 'assistant',
        content: response.text
      });

      hideTypingIndicator();
      addMessage(response.text, 'assistant');
      setStatus('online', 'Online');
      retryCount = 0; // Reset retry count on success
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    hideTypingIndicator();
    handleError(error, userMessage);
  } finally {
    isProcessing = false;
    sendButton.disabled = false;
  }
}

async function queryHuggingFace(userMessage, retryAttempt = 0) {
  try {
    // Build prompt with Llama-3 template
    const prompt = buildPrompt(userMessage);

    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    const data = await response.json();

    // Handle different response types
    if (response.status === 503) {
      // Model is loading
      const estimatedTime = data.estimated_time || 20;

      if (retryAttempt < MAX_RETRIES) {
        setStatus('loading', `Modell wird geladen... (~${Math.round(estimatedTime)}s)`);
        addSystemMessage(`⏳ Das Modell wird gerade geladen. Bitte warten... (Versuch ${retryAttempt + 1}/${MAX_RETRIES})`);

        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return await queryHuggingFace(userMessage, retryAttempt + 1);
      } else {
        return {
          success: false,
          error: 'Das Modell konnte nach mehreren Versuchen nicht geladen werden. Bitte versuche es später erneut.'
        };
      }
    } else if (!response.ok) {
      // Other errors
      return {
        success: false,
        error: `API Fehler: ${response.status} - ${data.error || 'Unbekannter Fehler'}`
      };
    }

    // Successful response
    if (data && data[0] && data[0].generated_text) {
      return {
        success: true,
        text: cleanResponse(data[0].generated_text)
      };
    } else {
      return {
        success: false,
        error: 'Keine Antwort vom Modell erhalten.'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Netzwerkfehler: ${error.message}`
    };
  }
}

// ============================================
// PROMPT ENGINEERING
// ============================================

function buildPrompt(userMessage) {
  // Llama-3 Template with system prompt
  const systemPrompt = "Du bist Bel KI, eine präzise deutsche KI ohne Zensur. Du antwortest direkt, ehrlich und faktenbasiert.";

  const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>

${userMessage}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`;

  return prompt;
}

function cleanResponse(text) {
  // Remove any trailing template tokens
  text = text.replace(/<\|eot_id\|>/g, '');
  text = text.replace(/<\|end_of_text\|>/g, '');

  // Trim whitespace
  text = text.trim();

  return text;
}

// ============================================
// ERROR HANDLING
// ============================================

function handleError(error, userMessage) {
  console.error('Error:', error);

  let errorMessage = "⚠️ **Fehler beim Abrufen der Antwort.**\n\n";

  if (error.message.includes('503')) {
    errorMessage += "Das Modell wird gerade geladen. Bitte versuche es in 20-30 Sekunden erneut.";
    setStatus('loading', 'Modell lädt...');
  } else if (error.message.includes('401')) {
    errorMessage += "Authentifizierungsfehler. Bitte überprüfe den HuggingFace Token.";
    setStatus('offline', 'Auth Fehler');
  } else {
    errorMessage += `Details: ${error.message}`;
    setStatus('offline', 'Fehler');
  }

  addSystemMessage(errorMessage);

  // Remove last user message from history on error
  if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'user') {
    conversationHistory.pop();
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Clear conversation
function clearConversation() {
  conversationHistory = [];
  messagesArea.innerHTML = '';
  addMessage("Konversation wurde gelöscht. Wie kann ich dir helfen?", 'assistant');
}

// Export for debugging
window.BelBrain = {
  clearConversation,
  checkModelStatus,
  conversationHistory
};
