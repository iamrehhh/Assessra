// ==================================================
// MY SENTENCES VIEW - Display saved vocab/idiom sentences
// ==================================================

async function loadMySentences() {
    const container = document.getElementById('container-sentences');
    if (!container) return;

    container.innerHTML = '<div style="text-align: center; padding: 50px;"><div style="font-size: 2rem;">⏳ Loading your sentences...</div></div>';

    try {
        const response = await fetch('/get_sentences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: window.StorageManager ? window.StorageManager.getUser() : 'default_user' })
        });
        const data = await response.json();
        renderSentencesView(data.sentences || []);
    } catch (e) {
        console.error('Failed to load sentences:', e);
        container.innerHTML = '<div style="text-align: center; padding: 50px;"><div style="color: #ef4444; font-size: 1.5rem;">❌ Failed to load sentences</div></div>';
    }
}

function renderSentencesView(sentences) {
    const container = document.getElementById('container-sentences');

    if (sentences.length === 0) {
        container.innerHTML = `
            <div style="max-width: 800px; margin: 80px auto; text-align: center; padding: 40px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">📝</div>
                <h2 style="color: #666; font-size: 2rem; margin-bottom: 15px;">No Sentences Yet!</h2>
                <p style="color: #888; font-size: 1.2rem;">Start creating sentences when you answer vocab and idioms correctly!</p>
            </div>
        `;
        return;
    }

    // Separate by type
    const vocabSentences = sentences.filter(s => s.type === 'vocab');
    const idiomSentences = sentences.filter(s => s.type === 'idiom');

    container.innerHTML = `
        <div style="max-width: 1200px; margin: 40px auto; padding: 30px;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: var(--lime-dark); font-size: 2.5rem; margin-bottom: 15px;">📚 My Sentences</h1>
                <p style="color: #666; font-size: 1.1rem;">Review your personally created sentences for vocab and idioms</p>
                <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; display: inline-block;">
                    <strong style="color: var(--lime-dark); font-size: 1.2rem;">${sentences.length}</strong>
                    <span style="color: #666; margin-left: 8px;">Total Sentences</span>
                </div>
            </div>

            ${vocabSentences.length > 0 ? `
                <div style="margin-bottom: 50px;">
                    <h2 style="color: var(--lime-dark); font-size: 1.8rem; margin-bottom: 25px; border-bottom: 3px solid var(--lime-primary); padding-bottom: 10px;">
                        📖 Vocabulary (${vocabSentences.length})
                    </h2>
                    <div style="display: grid; gap: 20px;">
                        ${vocabSentences.map(s => createSentenceCard(s)).join('')}
                    </div>
                </div>
            ` : ''}

            ${idiomSentences.length > 0 ? `
                <div>
                    <h2 style="color: var(--lime-dark); font-size: 1.8rem; margin-bottom: 25px; border-bottom: 3px solid #f59e0b; padding-bottom: 10px;">
                        💬 Idioms (${idiomSentences.length})
                    </h2>
                    <div style="display: grid; gap: 20px;">
                        ${idiomSentences.map(s => createSentenceCard(s)).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function createSentenceCard(sentence) {
    const word = sentence.word || sentence.idiom;
    const definition = sentence.definition || sentence.meaning;
    const isVocab = sentence.type === 'vocab';
    const color = isVocab ? 'var(--lime-primary)' : '#f59e0b';

    return `
        <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); border-left: 5px solid ${color}; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <div style="color: ${color}; font-weight: 700; font-size: 1.3rem; margin-bottom: 8px;">
                        ${word}
                    </div>
                    <div style="color: #666; font-size: 0.95rem; font-style: italic;">
                        ${definition}
                    </div>
                </div>
                <button onclick="deleteSentence('${sentence.timestamp}')" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                    🗑️ Delete
                </button>
            </div>
            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f0fdf4 100%); padding: 15px; border-radius: 8px; border-left: 3px solid ${color};">
                <div style="color: #888; font-size: 0.85rem; margin-bottom: 8px; font-weight: 600;">✍️ Your Sentence:</div>
                <div style="color: #333; font-size: 1.05rem; line-height: 1.6;">
                    "${sentence.userSentence}"
                </div>
            </div>
            <div style="color: #999; font-size: 0.8rem; margin-top: 12px;">
                Created: ${new Date(sentence.timestamp).toLocaleDateString()} at ${new Date(sentence.timestamp).toLocaleTimeString()}
            </div>
        </div>
    `;
}

async function deleteSentence(timestamp) {
    if (!confirm('Are you sure you want to delete this sentence?')) return;

    try {
        await fetch('/delete_sentence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: window.StorageManager ? window.StorageManager.getUser() : 'default_user',
                timestamp: timestamp
            })
        });

        // Reload sentences
        loadMySentences();
    } catch (e) {
        console.error('Failed to delete sentence:', e);
        showToast('Failed to delete sentence. Please try again.');
    }
}

// Expose to window
window.loadMySentences = loadMySentences;
