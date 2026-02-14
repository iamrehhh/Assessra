// ==========================================
// VOCAB NOTES SYSTEM
// ==========================================

let allNotes = {};
let filteredSearch = '';

// Show Notes Container
async function showNotesContainer() {
    hideAllViews();
    document.getElementById('container-notes').classList.remove('hidden');
    await loadAllNotes();
    renderNotes();
}

// Load all notes from cloud
async function loadAllNotes() {
    try {
        const response = await fetch('/get_notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: 'default_user' })
        });
        const data = await response.json();
        allNotes = data.notes || {};
    } catch (e) {
        console.error('Failed to load notes:', e);
        allNotes = {};
    }
}

// Render all notes sections
function renderNotes() {
    const container = document.getElementById('notes-sections-container');
    const emptyState = document.getElementById('notes-empty-state');

    const sections = Object.keys(allNotes);
    const hasNotes = sections.some(section => allNotes[section].length > 0);

    if (!hasNotes) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    // Render each section
    let html = '';
    for (const sectionName of sections) {
        const words = allNotes[sectionName];

        // Filter by search
        const filteredWords = words.filter(word => {
            if (!filteredSearch) return true;
            const searchLower = filteredSearch.toLowerCase();
            return word.word.toLowerCase().includes(searchLower) ||
                word.definition.toLowerCase().includes(searchLower) ||
                word.category.toLowerCase().includes(searchLower);
        });

        if (filteredWords.length === 0 && filteredSearch) continue;

        const isDefault = (sectionName === 'Wrong Vocab' || sectionName === 'Correct Vocab');
        const sectionColor = sectionName === 'Wrong Vocab' ? '#fee2e2' :
            sectionName === 'Correct Vocab' ? '#f0fdf4' : '#f0f9ff';
        const sectionIcon = sectionName === 'Wrong Vocab' ? '❌' :
            sectionName === 'Correct Vocab' ? '✅' : '📝';

        html += `
            <div class="notes-section" style="background: ${sectionColor}; border-radius: 16px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.8rem;">${sectionIcon}</span>
                        ${isDefault ?
                `<h2 style="margin: 0; color: #333; font-size: 1.5rem;">${sectionName} (${filteredWords.length})</h2>` :
                `<input type="text" value="${sectionName}" 
                                onblur="renameSection('${sectionName}', this.value)" 
                                style="font-size: 1.5rem; font-weight: 700; border: none; background: transparent; color: #333; border-bottom: 2px solid transparent; padding: 2px 5px;"
                                onfocus="this.style.borderBottomColor='var(--lime-primary)'"
                                onblur="this.style.borderBottomColor='transparent'"
                            /><span style="color: #666; font-size: 1.2rem;">(${filteredWords.length})</span>`
            }
                    </div>
                    ${!isDefault ? `
                        <button onclick="deleteSection('${sectionName}')" style="
                            padding: 8px 16px;
                            background: #ef4444;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                            🗑️ Delete Section
                        </button>
                    ` : ''}
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${filteredWords.map(word => `
                        <div class="note-card" style="background: white; border-radius: 10px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); position: relative; transition: all 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)'">
                            <button onclick="deleteWord('${sectionName}', '${word.word}')" style="
                                position: absolute;
                                top: 12px;
                                right: 12px;
                                background: #fee2e2;
                                color: #dc2626;
                                border: none;
                                border-radius: 50%;
                                width: 28px;
                                height: 28px;
                                cursor: pointer;
                                font-weight: 700;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='#ef4444'; this.style.color='white'" onmouseout="this.style.background='#fee2e2'; this.style.color='#dc2626'">×</button>
                            
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                <h3 style="margin: 0; color: var(--lime-dark); font-size: 1.3rem;">${word.word}</h3>
                                <span style="background: #e5e7eb; color: #666; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${word.category}</span>
                            </div>
                            
                            <p style="margin: 8px 0; color: #333; font-size: 1.05rem;"><strong>Definition:</strong> ${word.definition}</p>
                            
                            <div style="background: #f9fafb; padding: 12px; border-radius: 6px; border-left: 3px solid var(--lime-primary); margin-top: 10px;">
                                <p style="margin: 0; font-style: italic; color: #555; line-height: 1.5;">${word.example || 'No example available'}</p>
                            </div>
                            
                            <div style="margin-top: 10px; font-size: 0.8rem; color: #999;">
                                Saved: ${new Date(word.savedAt).toLocaleDateString()}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Filter notes by search
function filterNotes(searchTerm) {
    filteredSearch = searchTerm;
    renderNotes();
}

// Delete a word from section
async function deleteWord(sectionName, wordName) {
    if (!confirm(`Delete "${wordName}" from ${sectionName}?`)) return;

    try {
        await fetch('/delete_note_item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                section: sectionName,
                word: wordName
            })
        });

        await loadAllNotes();
        renderNotes();
    } catch (e) {
        console.error('Failed to delete word:', e);
        alert('Failed to delete word');
    }
}

// Rename section (custom sections only)
async function renameSection(oldName, newName) {
    if (oldName === newName || !newName.trim()) return;
    if (newName === 'Wrong Vocab' || newName === 'Correct Vocab') {
        alert('Cannot use reserved section names');
        renderNotes();
        return;
    }

    // Rename in local copy
    allNotes[newName] = allNotes[oldName];
    delete allNotes[oldName];

    // Save to cloud
    try {
        await fetch('/update_notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                notes: allNotes
            })
        });
        renderNotes();
    } catch (e) {
        console.error('Failed to rename section:', e);
        alert('Failed to rename section');
    }
}

// Delete custom section
async function deleteSection(sectionName) {
    if (!confirm(`Delete entire "${sectionName}" section and all its words?`)) return;

    delete allNotes[sectionName];

    try {
        await fetch('/update_notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                notes: allNotes
            })
        });
        renderNotes();
    } catch (e) {
        console.error('Failed to delete section:', e);
        alert('Failed to delete section');
    }
}

// Show modal to add new section
function showAddSectionModal() {
    const sectionName = prompt('Enter new section name:');
    if (!sectionName || !sectionName.trim()) return;

    if (sectionName === 'Wrong Vocab' || sectionName === 'Correct Vocab') {
        alert('Cannot use reserved section names');
        return;
    }

    if (allNotes[sectionName]) {
        alert('Section already exists');
        return;
    }

    allNotes[sectionName] = [];

    // Save to cloud
    fetch('/update_notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: 'default_user',
            notes: allNotes
        })
    }).then(() => {
        renderNotes();
    }).catch(e => {
        console.error('Failed to create section:', e);
        alert('Failed to create section');
    });
}

// Export notes to PDF
function exportNotesToPDF() {
    let pdfContent = '📚 MY VOCAB NOTES\n\n';
    pdfContent += '='.repeat(60) + '\n\n';

    for (const sectionName of Object.keys(allNotes)) {
        const words = allNotes[sectionName];
        if (words.length === 0) continue;

        pdfContent += `${sectionName.toUpperCase()} (${words.length} words)\n`;
        pdfContent += '-'.repeat(60) + '\n\n';

        words.forEach((word, idx) => {
            pdfContent += `${idx + 1}. ${word.word}\n`;
            pdfContent += `   Category: ${word.category}\n`;
            pdfContent += `   Definition: ${word.definition}\n`;
            pdfContent += `   Example: ${word.example || 'N/A'}\n`;
            pdfContent += `   Saved: ${new Date(word.savedAt).toLocaleDateString()}\n\n`;
        });

        pdfContent += '\n';
    }

    // Create downloadable text file (simple alternative to PDF library)
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocab_notes_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert('✅ Notes exported as text file! (PDF library can be added for formatted PDF)');
}
