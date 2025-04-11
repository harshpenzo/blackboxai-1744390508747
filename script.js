// Form validation and interaction handling
document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loaded successfully");
    
    // Initialize animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Voice Features
    const startVoiceBtn = document.querySelector('.microphone-button');
    const voiceVisualizer = document.getElementById('voiceVisualizer');
    const messageInput = document.getElementById('messageInput');
    const chatContainer = document.querySelector('.chat-container');
    const sendButton = document.querySelector('.send-button');
    
    console.log("Chat elements found:", {
        startVoiceBtn: !!startVoiceBtn,
        voiceVisualizer: !!voiceVisualizer,
        messageInput: !!messageInput,
        chatContainer: !!chatContainer,
        sendButton: !!sendButton
    });
    
    if (startVoiceBtn) {
        // Check for browser support
        if (!('webkitSpeechRecognition' in window)) {
            console.log("Speech recognition not supported in this browser");
            startVoiceBtn.style.opacity = '0.5';
            startVoiceBtn.style.cursor = 'not-allowed';
            startVoiceBtn.setAttribute('title', 'Speech recognition not supported in this browser');
            startVoiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            addSystemMessage('Voice input is not supported in this browser. Please use text input instead.');
            return;
        }

        // Handle microphone button click
        startVoiceBtn.addEventListener('click', () => {
            console.log("Microphone button clicked");
            startVoiceBtn.style.opacity = '0.5';
            startVoiceBtn.style.cursor = 'not-allowed';
            startVoiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            addSystemMessage('Voice input is currently not available in this environment. Please use text input instead.');
            showError('Voice input is not available. Please use text input.');
        });
    }

    // Chat Features
    if (sendButton && messageInput && chatContainer) {
        console.log("Setting up chat handlers");
        
        const sendMessage = () => {
            const message = messageInput.value.trim();
            console.log("Send message called, input value:", message);
            
            if (!message) {
                console.log("Empty message, not sending");
                return;
            }

            console.log("Sending message:", message);

            // Add user message
            addUserMessage(message);
            
            // Clear input field immediately
            messageInput.value = '';

            // Generate AI response based on keywords
            let response = "I understand how you're feeling. Can you tell me more about that?";
            
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('ready') && lowerMessage.includes('begin')) {
                response = "Great! Let's start. First, find a comfortable position and take a moment to settle. I'll guide you through each breath. Ready? Let's begin with our first deep breath...";
            } else if (lowerMessage.includes('breathing') || lowerMessage.includes('exercise')) {
                response = "Let's do a simple breathing exercise together. Take a deep breath in for 4 counts, hold for 4, and exhale for 4. Let's try this 3 times. Are you ready to begin?";
            } else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
                response = "I hear that you're feeling anxious. Let's take a deep breath together and explore what's causing these feelings. Would you like to try a quick breathing exercise?";
            } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
                response = "I'm sorry you're feeling this way. Sometimes sharing what's bringing you down can help lighten the load. Would you like to talk about what's been troubling you?";
            } else if (lowerMessage.includes('happy') || lowerMessage.includes('good')) {
                response = "I'm glad you're feeling positive! What's been contributing to your good mood? Let's explore these positive experiences.";
            }

            console.log("AI response:", response);

            // Add AI response with a slight delay
            setTimeout(() => {
                addSystemMessage(response);
                
                // Text-to-speech for AI response
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(response);
                    utterance.rate = 0.9;
                    utterance.pitch = 1;
                    speechSynthesis.speak(utterance);
                }
            }, 1000);
        };

        // Add click event listener to send button
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Send button clicked");
            sendMessage();
        });

        // Add keypress event listener to input field
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                console.log("Enter key pressed");
                sendMessage();
            }
        });

        // Add input event listener to track changes
        messageInput.addEventListener('input', (e) => {
            console.log("Input value changed:", e.target.value);
        });

        // Focus the input field
        messageInput.focus();
    } else {
        console.error("Some chat elements not found:", {
            sendButton: !!sendButton,
            messageInput: !!messageInput,
            chatContainer: !!chatContainer
        });
    }
});

// Chat Helper Functions
function addUserMessage(message) {
    console.log("Adding user message:", message);
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) {
        console.error("Chat container not found");
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start justify-end space-x-2 mb-4 fade-in';
    messageDiv.innerHTML = `
        <div class="message-bubble user bg-primary text-white p-3 rounded-lg shadow-sm">
            <p>${escapeHtml(message)}</p>
        </div>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" alt="User" class="w-8 h-8 rounded-full">
    `;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addSystemMessage(message) {
    console.log("Adding system message:", message);
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) {
        console.error("Chat container not found");
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-2 mb-4 fade-in';
    messageDiv.innerHTML = `
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=mindmitra" alt="MindMitra" class="w-8 h-8 rounded-full">
        <div class="message-bubble ai bg-white p-3 rounded-lg shadow-sm">
            <p class="text-gray-800">${escapeHtml(message)}</p>
        </div>
    `;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Form Handling Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    showSuccess('Logging in...');
    setTimeout(() => {
        window.location.href = 'therapy-session.html';
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const terms = document.getElementById('terms')?.checked;

    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (!terms) {
        showError('Please accept the Terms of Service');
        return;
    }

    showSuccess('Creating your account...');
    setTimeout(() => {
        window.location.href = 'therapy-session.html';
    }, 1500);
}

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');
}

function showError(message) {
    console.error("Error:", message);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out flex items-center';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle mr-2';
    errorDiv.appendChild(icon);
    
    const text = document.createElement('span');
    text.textContent = message;
    errorDiv.appendChild(text);
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            errorDiv.remove();
        }, 500);
    }, 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out flex items-center';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-check-circle mr-2';
    successDiv.appendChild(icon);
    
    const text = document.createElement('span');
    text.textContent = message;
    successDiv.appendChild(text);
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            successDiv.remove();
        }, 500);
    }, 3000);
}
