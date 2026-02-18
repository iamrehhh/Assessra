import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getDatabase, ref, push, onChildAdded, onChildChanged, onChildRemoved, serverTimestamp, remove, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDQdGnwbZq_V7Hm6V8IAVz7bnTt25H622s",
    authDomain: "habibi-studies-chat.firebaseapp.com",
    databaseURL: "https://habibi-studies-chat-default-rtdb.firebaseio.com",
    projectId: "habibi-studies-chat",
    storageBucket: "habibi-studies-chat.firebasestorage.app",
    messagingSenderId: "877923996625",
    appId: "1:877923996625:web:9e493c16c618c46a11c6f0"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const chatRef = ref(db, 'class_chat');

  let replyingToData = null; // Remembers who you are replying to

  function getChatUser() {
      return localStorage.getItem('username') || localStorage.getItem('user') || localStorage.getItem('currentUser') || "Student";
  }

  // --- SEND MESSAGES ---
  window.sendChatMessage = function() {
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      const user = getChatUser(); 

      if (text !== '') {
          const messageData = { name: user, text: text, timestamp: serverTimestamp() };
          
          if (replyingToData) messageData.replyTo = replyingToData; // Attach quote if replying

          push(chatRef, messageData).catch(error => showToast("Firebase Error: " + error.message));
          
          input.value = ''; 
          window.cancelReply(); // Clear the reply box
      }
  };

  window.handleChatEnter = function(event) {
      if (event.key === 'Enter') window.sendChatMessage();
  };

  // --- EDIT, DELETE & REPLY LOGIC ---
  window.deleteMessage = function(msgId) {
      if(confirm("Delete this message for everyone?")) {
          remove(ref(db, `class_chat/${msgId}`));
      }
  };

  window.editMessage = function(msgId, oldText) {
      const newText = prompt("Edit your message:", oldText);
      if(newText !== null && newText.trim() !== "" && newText !== oldText) {
          update(ref(db, `class_chat/${msgId}`), { text: newText.trim(), edited: true });
      }
  };

  window.replyToMessage = function(name, text) {
      replyingToData = { name: name, text: text };
      document.getElementById('reply-preview-name').innerText = "Replying to " + name.replace('.', ' ');
      document.getElementById('reply-preview-text').innerText = text.length > 40 ? text.substring(0,40) + '...' : text;
      document.getElementById('reply-preview-bar').classList.add('active');
      document.getElementById('chat-input').focus();
  };

  window.cancelReply = function() {
      replyingToData = null;
      document.getElementById('reply-preview-bar').classList.remove('active');
  };

  // --- REAL-TIME RENDERER ---
  const chatMessages = document.getElementById('chat-messages');

  function renderMessage(snapshot) {
      const data = snapshot.val();
      const msgId = snapshot.key; // Unique Firebase ID for each message
      
      const welcome = chatMessages.querySelector('div[style*="text-align: center"]');
      if (welcome) welcome.remove();

      const isMe = data.name === getChatUser();
      const cleanName = data.name ? data.name.replace('.', ' ') : 'Unknown';
      
      // 1. Build Quote Box if it's a reply
      let quoteHtml = '';
      if (data.replyTo) {
          quoteHtml = `
              <div class="quote-box">
                  <strong style="color: var(--lime-dark); font-size: 0.75rem;">${data.replyTo.name.replace('.', ' ')}</strong><br>
                  ${data.replyTo.text}
              </div>`;
      }

      // 2. Build Action Buttons (Hidden until you hover over the message)
      const safeText = data.text.replace(/"/g, '&quot;').replace(/'/g, "\\'");
      let actionsHtml = `
          <div class="msg-actions">
              <button class="msg-action-btn" onclick="replyToMessage('${data.name}', '${safeText}')">↩️ Reply</button>
              ${isMe ? `
                  <button class="msg-action-btn" onclick="editMessage('${msgId}', '${safeText}')">✏️ Edit</button>
                  <button class="msg-action-btn" onclick="deleteMessage('${msgId}')">🗑️ Delete</button>
              ` : ''}
          </div>`;

      // 3. Inject into the DOM
      let msgDiv = document.getElementById(`msg-${msgId}`);
      let isNew = false;
      if (!msgDiv) {
          msgDiv = document.createElement('div');
          msgDiv.id = `msg-${msgId}`;
          isNew = true;
      }

      msgDiv.className = `msg-box ${isMe ? 'me' : 'other'}`;
      msgDiv.innerHTML = `
          <div class="msg-name">${isMe ? 'You' : cleanName}</div>
          <div class="msg-bubble">
              ${quoteHtml}
              <span class="msg-text-content">${data.text}</span>
              ${data.edited ? '<span class="edited-tag">(edited)</span>' : ''}
          </div>
          ${actionsHtml}
      `;
      
      if (isNew) {
          chatMessages.appendChild(msgDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight; 
          
          const panel = document.getElementById('chat-panel');
          const badge = document.getElementById('unread-badge');
          
          // Grab the time you last read the chat (default to 0 if never opened)
          const lastRead = localStorage.getItem('habibi_chat_last_read') || 0;
          
          // Only show red dot if: 
          // 1. Chat is closed, 2. Someone else sent it, AND 3. It was sent AFTER you last checked the chat!
          if (panel && badge && !panel.classList.contains('open') && !isMe) {
              if (data.timestamp && data.timestamp > lastRead) {
                  badge.classList.remove('hidden');
              }
          }
      }
  }

  // FIREBASE REAL-TIME LISTENERS
  onChildAdded(chatRef, renderMessage);   // When a new message arrives
  onChildChanged(chatRef, renderMessage); // When someone edits a message
  onChildRemoved(chatRef, (snapshot) => { // When someone deletes a message
      const el = document.getElementById(`msg-${snapshot.key}`);
      if(el) el.remove();
  });