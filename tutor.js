let chatHistory = [];

// Initialize input listener
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function askQuestion(question) {
    document.getElementById('user-input').value = question;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Clear welcome message on first interaction
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Process and respond
    setTimeout(() => {
        const response = processQuery(message);
        addMessage(response, 'tutor');
    }, 500);
}

function addMessage(text, sender) {
    const chatArea = document.getElementById('chat-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender}-avatar`;
    avatar.textContent = sender === 'user' ? 'You' : '📚';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatArea.appendChild(messageDiv);
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
}

function processQuery(query) {
    const lowercaseQuery = query.toLowerCase();
    
    // Find matching topic
    let bestMatch = null;
    let highestScore = 0;
    
    for (const [topic, data] of Object.entries(businessKnowledge)) {
        let score = 0;
        
        // Check if topic name is in query
        if (lowercaseQuery.includes(topic)) {
            score += 10;
        }
        
        // Check keywords
        for (const keyword of data.keywords) {
            if (lowercaseQuery.includes(keyword)) {
                score += 5;
            }
        }
        
        if (score > highestScore) {
            highestScore = score;
            bestMatch = data;
        }
    }
    
    // Generate response
    if (bestMatch && highestScore > 0) {
        return formatResponse(bestMatch.content);
    } else {
        return `
            <p>I don't have specific information about that topic yet. Try asking about:</p>
            <ul>
                <li>Marketing & Market Segmentation</li>
                <li>Break-even Analysis & Cash Flow</li>
                <li>Motivation & Leadership</li>
                <li>Quality & Lean Production</li>
                <li>Stakeholders & Business Objectives</li>
            </ul>
        `;
    }
}

function formatResponse(content) {
    let html = `<h3>📖 ${content.definition}</h3>`;
    
    if (content.keyPoints && content.keyPoints.length > 0) {
        html += '<p><strong>Key Points:</strong></p><ul>';
        content.keyPoints.forEach(point => {
            html += `<li>${point}</li>`;
        });
        html += '</ul>';
    }
    
    if (content.example) {
        html += `<p><strong>Example:</strong> ${content.example}</p>`;
    }
    
    return html;
}