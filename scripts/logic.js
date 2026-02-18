// =============================================
// LOGIC.JS - FULLY RECONSTRUCTED & FIXED
// Includes: Cloud Sync, Smart Sorting, UI Fixes
// =============================================

// === 1. GLOBAL UI & MENU MANAGEMENT ===
// Updated: Force Refresh v1.1

// Helper to close ALL panels to prevent overlaps
function closeAllPanels() {
    ['subjects-panel', 'notes-panel', 'scorecard-panel', 'leaderboard-panel', 'chat-panel'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    ['subjects-overlay', 'notes-overlay', 'scorecard-overlay', 'leaderboard-overlay', 'chat-overlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
}

// Right Side Subjects Panel
function toggleSubjectsPanel() {
    const panel = document.getElementById('subjects-panel');
    const overlay = document.getElementById('subjects-overlay');

    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        closeAllPanels(); // Force close others
        panel.classList.add('active');
        overlay.classList.add('active');
    }
}

// Left Side Notes Panel
function toggleNotesPanel() {
    const panel = document.getElementById('notes-panel');
    const overlay = document.getElementById('notes-overlay');

    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        closeAllPanels(); // Force close others
        panel.classList.add('active');
        overlay.classList.add('active');
        loadNotes(); // Load notes when opening
    }
}

// Left Side Scorecard
function toggleScorecardPanel() {
    const panel = document.getElementById('scorecard-panel');
    const overlay = document.getElementById('scorecard-overlay');

    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        closeAllPanels(); // Force close others
        panel.classList.add('active');
        overlay.classList.add('active');
        loadCloudScorecard(); // Load data when opening
    }
}

// === LEADERBOARD LOGIC ===

// 1. Toggle the Side Panel (FIXED)
function toggleLeaderboardPanel() {
    const panel = document.getElementById('leaderboard-panel');
    const overlay = document.getElementById('leaderboard-overlay');

    // Check if it is currently open
    if (panel.classList.contains('active')) {
        // IF OPEN: Close it
        panel.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        // IF CLOSED: Close others first, then open this one
        closeAllPanels();
        panel.classList.add('active');
        overlay.classList.add('active');
    }
}

// 2. Switch View (Called when clicking a button in the panel)
async function switchLeaderboardView(category) {
    // Close panel
    toggleLeaderboardPanel();

    // Switch to main view
    setView('leaderboard');

    // Update Titles
    const titleEl = document.getElementById('lb-title');
    const subEl = document.getElementById('lb-subtitle');
    const container = document.getElementById('leaderboard-container');

    container.innerHTML = `<div style="padding:40px; color:#888;">⏳ Loading ${category} data...</div>`;

    if (category === 'overall') {
        titleEl.innerText = "🏆 Overall Class Rankings";
        subEl.innerText = "Combined scores across all subjects";
    } else if (category === 'business') {
        titleEl.innerText = "💼 Business Leaderboard";
        subEl.innerText = "Top performers in Business (9609)";
    } else if (category === 'economics') {
        titleEl.innerText = "📈 Economics Leaderboard";
        subEl.innerText = "Top performers in Economics (9708)";
    }

    // Fetch and Render
    await renderBigLeaderboard(category);
}

// 3. Render the Big Table
async function renderBigLeaderboard(category) {
    const lbData = await window.CloudManager.getLeaderboard();
    const container = document.getElementById('leaderboard-container');

    // Convert to array
    let sorted = Object.values(lbData);

    // Filter & Sort based on Category
    if (category === 'overall') {
        sorted.sort((a, b) => (b.total || 0) - (a.total || 0));
    } else if (category === 'business') {
        sorted.sort((a, b) => (b.business || 0) - (a.business || 0));
    } else if (category === 'economics') {
        sorted.sort((a, b) => (b.economics || 0) - (a.economics || 0));
    }

    // Build Table Header
    let scoreHeader = "Total Score";
    if (category === 'business') scoreHeader = "Business Score";
    if (category === 'economics') scoreHeader = "Econ Score";

    let html = `<table class="modern-table" style="text-align:left;">
        <thead>
            <tr>
                <th style="width:100px;">Rank</th>
                <th>Student Name</th>
                <th style="text-align:right;">${scoreHeader}</th>
            </tr>
        </thead>
        <tbody>`;

    sorted.forEach((s, index) => {
        let score = 0;
        if (category === 'overall') score = s.total || 0;
        else if (category === 'business') score = s.business || 0;
        else if (category === 'economics') score = s.economics || 0;

        // Medals
        let rankDisplay = `#${index + 1}`;
        if (index === 0) rankDisplay = '🥇';
        if (index === 1) rankDisplay = '🥈';
        if (index === 2) rankDisplay = '🥉';

        // Highlight current user
        const isMe = (getUser() && s.name && getUser().includes(s.name));
        const rowStyle = isMe ? 'background:#f0fdf4; border-left: 4px solid var(--lime-primary);' : '';

        html += `
            <tr style="${rowStyle}">
                <td style="font-size:1.2rem; font-weight:bold;">${rankDisplay}</td>
                <td style="font-weight:700; color:#333;">
                    ${s.name} 
                    ${isMe ? '<span style="font-size:0.8rem; color:var(--lime-dark); margin-left:5px;">(You)</span>' : ''}
                </td>
                <td style="text-align:right;">
                    <span class="score-badge" style="font-size:1.1rem;">${score}</span>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// Chat Panel (Right Side)
function toggleChat() {
    const panel = document.getElementById('chat-panel');
    const overlay = document.getElementById('chat-overlay');
    const badge = document.getElementById('unread-badge');

    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        closeAllPanels(); // Force close others
        panel.classList.add('active');
        overlay.classList.add('active'); // Use generic overlay logic if preferred, or keep chat-specific
        if (badge) badge.classList.add('hidden');
        localStorage.setItem('habibi_chat_last_read', Date.now());
    }
}

// === 2. NAVIGATION & LOGIN LOGIC ===

function toggleSubject(subId) {
    const content = document.getElementById(subId);
    content.classList.toggle('expanded');
}

function selectPaper(subject, paper) {
    // 1. Hide all containers first
    document.querySelectorAll('.subject-container').forEach(el => el.classList.add('hidden'));

    // 2. Determine target container ID
    let targetId = '';
    if (subject === 'business') targetId = `container-bus-${paper}`; // bus-p3, bus-p4
    else if (subject === 'economics') {
        targetId = `container-econ-${paper}`; // econ-p3, econ-p4
        if (paper === 'p3' && window.loadMCQPapers) window.loadMCQPapers();
    }
    else if (subject === 'general') targetId = `container-general-${paper}`; // general-p1, general-p2

    // 3. Show target container
    const target = document.getElementById(targetId);
    if (target) {
        target.classList.remove('hidden');
    } else {
        console.warn(`Container not found for ${subject} ${paper} (ID: ${targetId})`);
    }

    // 4. Close the menu
    closeAllPanels();
    setView('papers');
}

function switchPaperView(targetViewId) {
    // Deprecated but kept for backward compatibility if used elsewhere
    document.querySelectorAll('.subject-container').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`container-${targetViewId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.paper-link').forEach(el => el.classList.remove('active'));
    // document.getElementById(`link-${targetViewId}`).classList.add('active'); // Element might not exist

    closeAllPanels(); // Close menu
    setView('papers');
}

// Allowed Users Configuration
const ALLOWED_USERS = {
    "Jesan.Equebal": "virgin",
    "Newton.Mondal": "anime",
    "Sarwar.Alam": "suspension",
    "Aadrita.Mukhopadhyay": "ipmat",
    "Shinjan.Garain": "Shinjan",
    "Debraj.Mondal": "Debraj",
    "Abdul.Subhan": "biology",
    "Biswajit.Saha": "general",
    "Surjayu.Sanyal": "rizz",
    "Shreyas.Bhattacharya": "A....",
    "Ayush.Paul": "ayush",
    "Abdul.Rehan": "jipmat",
    "Shefa.Hassan": "maths",
    "Swapneel.Tiwari": "2026"
};

function getUser() { return localStorage.getItem('user'); }
function setUser(u) { localStorage.setItem('user', u); }

function tryLogin() {
    const u = document.getElementById('u-in').value.trim();
    const p = document.getElementById('p-in').value.trim();
    if (ALLOWED_USERS[u] && ALLOWED_USERS[u] === p) {
        setUser(u);
        initApp(u);
    } else { alert("Invalid Username or Password."); }
}

function initApp(u) {
    document.getElementById('login-layer').classList.add('hidden');
    document.getElementById('app-layer').classList.remove('hidden');
    initHome();
    if (window.loadDynamicPapers && window.CloudManager) {
        try {
            window.loadDynamicPapers();
        } catch (e) { console.warn("Dynamic papers failed:", e); }
    } else {
        console.warn("CloudManager not ready or Dynamic Papers script missing.");
    }

    // Admin Button Removed per user request


    // Restore Last View
    const lastView = localStorage.getItem('lastView') || 'home';
    setView(lastView);
}

function doLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('lastView'); // Clear view state on logout
    location.reload();
}

function setView(viewName) {
    // Save state
    localStorage.setItem('lastView', viewName);

    // 1. Hide all main views
    ['papers', 'scorecard', 'workspace', 'formulae', 'definitions', 'leaderboard', 'tips', 'score-display', 'home'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    // 2. Show target view
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.remove('hidden');

    // Refresh Home Stats if entering Home view
    if (viewName === 'home' && window.updateHomeStats && window.StorageManager) {
        window.updateHomeStats(window.StorageManager.getUser());
    }

    // 3. Update Navigation Buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');

        // Match button text to view name
        const text = btn.innerText.toLowerCase().trim();

        // Simple mapping check (Updated for Dropdowns)
        if (text.includes(viewName) ||
            (viewName === 'papers' && text.includes('papers')) ||
            (viewName === 'formulae' && text.includes('formulae')) ||
            (viewName === 'definitions' && text.includes('definitions'))) {
            btn.classList.add('active');
        }
    });
}

function filterView(viewId, subject) {
    // 1. Switch to the main view
    setView(viewId);

    // 2. Initial state: Show all, hide none
    const container = document.getElementById(`view-${viewId}`);
    if (!container) return;

    // 3. Find all relevant sections
    const sections = container.querySelectorAll('.formula-section, .def-section, .subject-container');

    // 4. Toggle visibility
    sections.forEach(section => {
        // Special handling for subject containers (papers) if we use this for papers too
        // But logic.js originally only had formula-section and def-section.
        // I added .subject-container to the querySelector.
        // I need to ensure subject-container has data-subject if I want it to filter.
        // Or I can just manually handle it in selectSubject.
        // For now, let's keep the original logic for formulae/definitions.

        if (!subject || subject === 'all') {
            section.classList.remove('hidden');
        } else {
            const sectionSubject = section.getAttribute('data-subject');
            // If it's a paper container, it might not have data-subject yet.
            // But if I add it, this works.

            if (sectionSubject && sectionSubject.includes(subject)) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        }
    });

    // 5. Allow event bubbling to close menu
    event.stopPropagation();
    closeAllPanels();
}

// Show Vocab Container and load monthly sets
function showVocabContainer() {
    // Hide all main views
    ['papers', 'scorecard', 'workspace', 'formulae', 'definitions', 'leaderboard', 'tips', 'score-display', 'home'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    // Hide all subject containers
    document.querySelectorAll('.subject-container').forEach(c => c.classList.add('hidden'));

    // Show papers view and vocab container
    const papersView = document.getElementById('view-papers');
    if (papersView) papersView.classList.remove('hidden');

    const vocabContainer = document.getElementById('container-vocab');
    if (vocabContainer) {
        vocabContainer.classList.remove('hidden');
        // Use new monthly sets system
        if (typeof initVocabSets === 'function') {
            initVocabSets();
        } else {
            console.error("initVocabSets function not found. Check vocab_sets.js");
            vocabContainer.innerHTML = `<div style="color:red; padding:40px; text-align:center;"><h2>Error: Vocab Script Not Loaded</h2><p>Please refresh the page. If the issue persists, the script file may have a syntax error.</p></div>`;
        }
    }

    // --- SAVE LAST ACTIVITY ---
    localStorage.setItem('habibi_last_activity', JSON.stringify({
        type: 'vocab',
        title: 'Vocabulary Builder',
        subtitle: 'Master new words'
    }));

    closeAllPanels();
}

// Show Idioms Container and load monthly sets
function showIdiomsContainer() {
    // Hide all main views
    ['papers', 'scorecard', 'workspace', 'formulae', 'definitions', 'leaderboard', 'tips', 'score-display', 'home'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    // Hide all subject containers
    document.querySelectorAll('.subject-container').forEach(c => c.classList.add('hidden'));

    // Show papers view and idioms container
    const papersView = document.getElementById('view-papers');
    if (papersView) papersView.classList.remove('hidden');

    const idiomsContainer = document.getElementById('container-idioms');
    if (idiomsContainer) {
        idiomsContainer.classList.remove('hidden');
        // Use new monthly sets system
        if (typeof initIdiomsSets === 'function') {
            initIdiomsSets();
        } else {
            console.error("initIdiomsSets function not found. Check idioms_sets.js");
        }
    }

    // --- SAVE LAST ACTIVITY ---
    localStorage.setItem('habibi_last_activity', JSON.stringify({
        type: 'idioms',
        title: 'Idioms & Phrases',
        subtitle: 'Expand your expressions'
    }));

    closeAllPanels();
}

// Show My Sentences Container
function showSentencesContainer() {
    // Hide all main views
    ['papers', 'scorecard', 'workspace', 'formulae', 'definitions', 'leaderboard', 'tips', 'score-display', 'home'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    // Hide all subject containers
    document.querySelectorAll('.subject-container').forEach(c => c.classList.add('hidden'));

    // Show papers view and sentences container
    const papersView = document.getElementById('view-papers');
    if (papersView) papersView.classList.remove('hidden');

    const sentencesContainer = document.getElementById('container-sentences');
    if (sentencesContainer) {
        sentencesContainer.classList.remove('hidden');
        if (typeof loadMySentences === 'function') {
            loadMySentences();
        } else {
            console.error("loadMySentences function not found. Check sentences_view.js");
        }
    }

    closeAllPanels();
}


function backToDash() {
    document.body.style.overflow = 'auto';
    setView('papers');
}
// toggleInsert removed - no longer needed with split-screen view

// === 3. CORE PAPER LOGIC (CLOUD ENABLED) ===

async function openPaper(pid, preservedScrollTop = 0) {
    let data = paperData[pid];
    const u = getUser();

    // 1. Try Cloud if not local
    if (!data && window.CloudManager) {
        const cloudPaper = await window.CloudManager.getPaper(pid);
        if (cloudPaper) {
            data = cloudPaper;
            // Normalize questions if needed (Cloud might store as object, we need array for logic)
            if (data.questions && !Array.isArray(data.questions)) {
                data.questions = Object.values(data.questions);
            }
        }
    }

    // --- SAVE LAST ACTIVITY ---
    localStorage.setItem('habibi_last_activity', JSON.stringify({
        type: 'paper',
        id: pid,
        title: data ? data.title : pid,
        subtitle: 'Resume Paper'
    }));

    if (!data) return alert("Paper not found or loading...");

    let attempts = {};

    // FETCH ATTEMPTS FROM CLOUD
    try {
        if (window.CloudManager) {
            const allData = await window.CloudManager.getAllData(u);
            if (allData.papers && allData.papers[pid]) {
                attempts = allData.papers[pid];
            }
        }
    } catch (e) { console.error("Error loading paper data:", e); }

    // Generate questions HTML
    let qHtml = `<h2 style="margin-bottom:20px; color:var(--lime-dark); border-bottom:2px solid #eee; padding-bottom:10px;">${data.title}</h2>`;
    data.questions.forEach(q => {
        const att = attempts[q.n] || {};
        const done = att.score !== undefined;

        let aoHtml = '';
        if (done) {
            aoHtml = `<div style="display:flex; gap:10px; flex-wrap:wrap; margin:15px 0;">
            <span class="score-badge" style="background:#fff; font-size:0.8rem;">AO1: ${att.ao1 || '-'}</span>
            <span class="score-badge" style="background:#fff; font-size:0.8rem;">AO2: ${att.ao2 || '-'}</span>
            <span class="score-badge" style="background:#fff; font-size:0.8rem;">AO3: ${att.ao3 || '-'}</span>
            <span class="score-badge" style="background:#fff; font-size:0.8rem;">AO4: ${att.ao4 || '-'}</span>
            </div>`;
        }

        qHtml += `<div class="question-card">
            <div class="q-header"><strong>Q${q.n}</strong><span class="q-badge">${q.m} Marks</span></div>
            <p style="font-weight:600; margin-bottom:10px;">${q.t}</p>
            ${q.l ? `<p class="word-limit">Limit: ${q.l} words</p>` : ''}
            <button class="expand-btn" id="btn_exp_${pid}_${q.n}" onclick="toggleExpand('ans_${pid}_${q.n}', 'btn_exp_${pid}_${q.n}')">⤢ Expand</button>
            <textarea id="ans_${pid}_${q.n}" oninput="updateWordCount(this, '${q.l}')">${att.answer || ''}</textarea>
            <div id="wc_${pid}_${q.n}" class="word-count">0 words</div>
            <button class="submit-btn ${done ? 'completed' : ''}" onclick="submitAnswer('${pid}', '${q.n}')">${done ? '✓ Re-Evaluate' : 'Submit for Strict Marking'}</button>
            <div style="text-align: center; margin-top: 6px; font-size: 0.85rem; color: #888;">${(() => { const today = new Date().toISOString().split('T')[0]; const used = parseInt(localStorage.getItem('submissions_daily_' + today) || '0', 10); const left = Math.max(0, 12 - used); return left > 0 ? '📊 ' + left + '/12 submissions remaining today' : '⚠️ Daily limit reached (12/12)'; })()}</div>
            ${done ? `<div class="feedback-box"><h3>Score: ${att.score}/${q.m}</h3>${aoHtml}<div class="feedback-content" style="background:#fff3cd; color:#856404; padding:15px; border-radius:8px; margin-bottom:15px; border-left:4px solid #ffeeba;"><strong>Detailed Critique:</strong><br>${att.feedback || att.weaknesses || "No feedback available."}</div><div class="model-ans-box"><strong>Model Answer:</strong><br>${(att.modelAnswer || 'Model answer not generated.').replace(/\n/g, '<br>')}</div></div>` : ''}
        </div>`;
    });

    // Generate layout HTML
    let viewHTML = '';
    // Ensure it's General Paper AND Paper 1 (suffix _11, _12, or _13)
    const isGeneralPaper1 = pid.startsWith('gp_') && (pid.endsWith('_11') || pid.endsWith('_12') || pid.endsWith('_13'));

    if (isGeneralPaper1) {
        // FULL SCREEN LAYOUT FOR GENERAL PAPER 1
        viewHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: white; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="flex-shrink: 0; background: white; padding: 15px 30px; border-bottom: 2px solid var(--lime-primary); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <div style="display:flex; align-items:center; gap:20px;">
                    <button onclick="closePaperView()" style="background: #eee; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight:bold;">← Back to Papers</button>
                    <h3 style="margin:0; color:var(--lime-dark);">${data.title}</h3>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:0.9rem; font-weight:600; color:#555;">AI Model: GPT-4o Mini</span>
                </div>
            </div>

            <!-- Full Width Questions Container -->
            <div id="questions-panel" style="flex-grow: 1; overflow-y: auto; padding: 40px; background: #f9f9f9; display: flex; justify-content: center;">
                <div style="width: 100%; max-width: 900px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <div style="text-align: center; margin-bottom: 30px; color: #666;">
                        <p><em>For General Paper 1, the questions are self-contained. No external text is required.</em></p>
                    </div>
                    ${qHtml}
                    <div style="height: 100px;"></div>
                </div>
            </div>
        </div>
        `;
    } else {
        // SPLIT SCREEN LAYOUT FOR OTHER PAPERS (Business, Economics)
        viewHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: white; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="flex-shrink: 0; background: white; padding: 15px 30px; border-bottom: 2px solid var(--lime-primary); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <div style="display:flex; align-items:center; gap:20px;">
                    <button onclick="closePaperView()" style="background: #eee; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight:bold;">← Back to Papers</button>
                    <h3 style="margin:0; color:var(--lime-dark);">${data.title}</h3>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:0.9rem; font-weight:600; color:#555;">AI Model: GPT-4o Mini</span>
                </div>
            </div>

            <!-- Split Screen Container -->
            <div id="split-container" style="flex-grow: 1; display: flex; overflow: hidden; background: #f5f5f5;">
                <!-- Left: PDF Viewer (60%) -->
                <div id="pdf-panel" style="flex: 6; height: 100%; position: relative;">
                    <iframe src="${data.pdf}#toolbar=0&navpanes=0&scrollbar=1&view=FitH" width="100%" height="100%" style="border:none;"></iframe>
                </div>
                
                <!-- Draggable Divider -->
                <div id="divider" style="
                    width: 8px;
                    height: 100%;
                    background: #ddd;
                    cursor: col-resize;
                    position: relative;
                    flex-shrink: 0;
                    transition: background 0.2s;
                " onmouseenter="this.style.background='var(--lime-primary)'" onmouseleave="this.style.background='#ddd'">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 3px; height: 40px; background: white; border-radius: 2px; pointer-events: none;"></div>
                </div>
                
                <!-- Right: Questions Panel (40%) -->
                <div id="questions-panel" style="flex: 4; height: 100%; overflow-y: auto; padding: 30px; background: white; box-sizing: border-box;" id="questions-container">
                    ${qHtml}
                    <div style="height: 100px;"></div>
                </div>
            </div>
        </div>
        `;
    }

    // Inject into workspace view
    const workspaceView = document.getElementById('view-workspace');
    if (workspaceView) {
        workspaceView.innerHTML = viewHTML;
        workspaceView.classList.remove('hidden');
    }

    // Hide other views
    ['papers', 'scorecard', 'leaderboard', 'tips', 'score-display', 'home', 'formulae', 'definitions'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Initialize word counts
    data.questions.forEach(q => {
        const el = document.getElementById(`ans_${pid}_${q.n}`);
        if (el) updateWordCount(el, q.l);
    });

    // Setup resizable divider
    setupResizableDivider();

    // Restore scroll if provided
    if (preservedScrollTop > 0) {
        const qPanel = document.getElementById('questions-panel');
        if (qPanel) qPanel.scrollTop = preservedScrollTop;
    }
}

function closePaperView() {
    document.body.style.overflow = 'auto';
    setView('papers');
}

// Setup resizable divider for split-screen
function setupResizableDivider() {
    const divider = document.getElementById('divider');
    const pdfPanel = document.getElementById('pdf-panel');
    const questionsPanel = document.getElementById('questions-panel');
    const container = document.getElementById('split-container');

    if (!divider || !pdfPanel || !questionsPanel || !container) return;

    let isDragging = false;
    let animationFrameId = null;
    let currentX = 0;

    const updatePanels = () => {
        const containerRect = container.getBoundingClientRect();
        const newLeftWidth = currentX - containerRect.left;
        const containerWidth = containerRect.width;

        // Calculate percentage (min 20%, max 80%)
        let leftPercent = (newLeftWidth / containerWidth) * 100;
        leftPercent = Math.max(20, Math.min(80, leftPercent));

        const rightPercent = 100 - leftPercent;

        // Update flex values proportionally
        pdfPanel.style.flex = leftPercent;
        questionsPanel.style.flex = rightPercent;

        animationFrameId = null;
    };

    divider.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const containerRect = container.getBoundingClientRect();
        const newLeftWidth = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;

        // Calculate percentage (min 20%, max 80%)
        let leftPercent = (newLeftWidth / containerWidth) * 100;
        leftPercent = Math.max(20, Math.min(80, leftPercent));

        const rightPercent = 100 - leftPercent;

        // Update flex values proportionally
        pdfPanel.style.flex = leftPercent;
        questionsPanel.style.flex = rightPercent;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            // Cancel any pending animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
    });
}

async function submitAnswer(pid, qn) {
    // ---- 12-QUESTION DAILY LIMIT ----
    const today = new Date().toISOString().split('T')[0];
    const limitKey = 'submissions_daily_' + today;
    const dailyCount = parseInt(localStorage.getItem(limitKey) || '0', 10);
    if (dailyCount >= 12) {
        alert('⚠️ You\'ve reached your daily limit of 12 question submissions. Come back tomorrow!');
        return;
    }
    // -----------------------------------

    const el = document.getElementById(`ans_${pid}_${qn}`);
    const btn = event.target;
    const ans = el.value.trim();
    if (!ans) return alert("Please write an answer first.");

    btn.innerText = "⏳ Strict Marking...";
    btn.disabled = true;

    // Get selected model
    // Model selection removed - defaulting to backend configuration
    const model = 'gpt';

    const qData = paperData[pid].questions.find(q => q.n === qn);

    try {
        const res = await fetch('/mark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: qData.t,
                // Send the PDF path so the backend can extract text
                pdf_path: paperData[pid].pdf,
                case_study: `Refer to extracted text from ${paperData[pid].title}.`,
                answer: ans,
                marks: qData.m,
                model: model,
                // Dynamic Protocols (if present in DB/JS)
                rubric: qData.rubric || paperData[pid].rubric || null,
                system_prompt: qData.system_prompt || paperData[pid].system_prompt || null,
                model_instruction: qData.model_instruction || paperData[pid].model_instruction || null
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Server Error (${res.status}): ${errText || res.statusText}`);
        }

        const json = await res.json();

        // Increment daily submission counter AFTER successful response
        localStorage.setItem(limitKey, String(dailyCount + 1));

        // SAVE TO CLOUD AND WAIT
        await window.CloudManager.saveAttempt(getUser(), pid, qn, {
            answer: ans,
            score: json.score,
            ao1: json.ao1, ao2: json.ao2, ao3: json.ao3, ao4: json.ao4,
            feedback: json.detailed_critique,
            feedback: json.detailed_critique || "No feedback available.",
            modelAnswer: json.model_answer || "Model answer not generated."
        });

        // SAVE TO LOCAL STORAGE (For Daily Target)
        if (window.StorageManager) {
            window.StorageManager.saveEssay(pid, qn, {
                answer: ans,
                score: json.score,
                timestamp: Date.now()
            });
        }

        // Get current scroll from closure or re-query if needed, 
        // but better to get it from the panel currently in DOM before refresh
        // Actually submitAnswer is called from the old DOM, so we can get it from document
        const qPanel = document.getElementById('questions-panel');
        const currentScroll = qPanel ? qPanel.scrollTop : 0;

        await openPaper(pid, currentScroll); // Refresh view with scroll preserved

    } catch (e) {
        console.error("Submission Error:", e);
        alert(`Error: ${e.message || "Server not responding or Save failed."}`);
        btn.innerText = "Retry";
        btn.disabled = false;
    }
}

// === 4. HELPER FUNCTIONS ===

function updateWordCount(el, limitStr) {
    if (!limitStr) return;
    const count = el.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    const wcId = el.id.replace('ans_', 'wc_');
    const wcEl = document.getElementById(wcId);
    if (wcEl) {
        wcEl.innerText = `${count} words (${limitStr})`;
        wcEl.classList.toggle('bad', count < parseInt(limitStr.split('-')[0]));
        wcEl.classList.toggle('good', count >= parseInt(limitStr.split('-')[0]));
    }
}

function toggleExpand(textAreaId, btnId) {
    const el = document.getElementById(textAreaId);
    const btn = document.getElementById(btnId);
    if (el) {
        el.classList.toggle('expanded');
        btn.innerText = el.classList.contains('expanded') ? "⤡ Shrink" : "⤢ Expand";
    }
}

// toggleInsertMaximize removed - no longer needed with split-screen view

// === 5. SCORECARD & LEADERBOARD LOGIC ===

function classifyPaper(pid) {
    // 1. General Paper
    if (pid.startsWith('gp_')) {
        return { subject: 'gp', paper: 'p1' };
    }
    // 2. Explicit Economics ID
    if (pid.startsWith('econ_')) {
        if (pid.includes('31') || pid.includes('32') || pid.includes('33') || pid.includes('34')) return { subject: 'economics', paper: 'p3' };
        return { subject: 'economics', paper: 'p4' };
    }
    // 3. Business Paper Check (fallback)
    if (window.paperData && window.paperData[pid]) {
        if (pid.includes('41') || pid.includes('42') || pid.includes('43')) return { subject: 'business', paper: 'p4' };
        return { subject: 'business', paper: 'p3' };
    }
    // 4. Default (Assume Econ MCQ if unknown and not in Business data)
    return { subject: 'economics', paper: 'p3' };
}

async function loadCloudScorecard() {
    const u = getUser();
    if (!u) return;

    // Reset Containers
    ['sc-bus-p3', 'sc-bus-p4', 'sc-econ-p3', 'sc-econ-p4', 'sc-gp-p1'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    const data = await window.CloudManager.getAllData(u);
    const papers = data.papers || {};

    Object.keys(papers).forEach(pid => {
        // Get title from paperData (Business/GP) or just use the pid
        const pTitle = (window.paperData && window.paperData[pid]) ? window.paperData[pid].title : pid;
        const category = classifyPaper(pid);

        const html = `<div class="paper-link" onclick="renderPaperScore('${pid}')">
            ${pTitle} <span style="font-size:0.75rem; color:#999; display:block;">${pid}</span>
        </div>`;

        if (category.subject === 'business') {
            if (category.paper === 'p3') document.getElementById('sc-bus-p3').innerHTML += html;
            else document.getElementById('sc-bus-p4').innerHTML += html;
        }
        else if (category.subject === 'economics') {
            if (category.paper === 'p3') document.getElementById('sc-econ-p3').innerHTML += html;
            else document.getElementById('sc-econ-p4').innerHTML += html;
        }
        else if (category.subject === 'gp') {
            const gpEl = document.getElementById('sc-gp-p1');
            if (gpEl) gpEl.innerHTML += html;
        }
    });
}

async function renderPaperScore(pid) {
    toggleScorecardPanel();
    setView('score-display');

    const u = getUser();
    const data = await window.CloudManager.getAllData(u);
    const attempts = data.papers[pid] || {};

    // IS IT AN ESSAY PAPER? (Business)
    if (window.paperData && window.paperData[pid]) {
        const pInfo = window.paperData[pid];
        document.getElementById('score-display-title').innerText = pInfo.title;
        let html = '', total = 0, max = 0;

        pInfo.questions.forEach(q => {
            const att = attempts[q.n] || {};
            const score = att.score || 0;
            const qMax = q.m || 20;
            total += score;
            max += qMax;

            html += `<div class="score-row">
                <span><strong>Q${q.n}</strong></span>
                <span><span class="score-badge">${score} / ${qMax}</span></span>
            </div>`;
        });

        const percent = max > 0 ? Math.round(total / max * 100) : 0;
        document.getElementById('score-display-content').innerHTML = `
            <div style="background:white; padding:30px; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
                <div style="font-size:3rem; font-weight:800; color:var(--lime-dark);">${percent}%</div>
                <div style="color:#666; margin-bottom:20px;">Score: ${total} / ${max}</div>
                ${html}
            </div>`;
    }
    // IS IT AN MCQ PAPER? (Economics)
    else {
        let total = 0;
        Object.values(attempts).forEach(ans => { if (ans.score === 1) total++; });

        document.getElementById('score-display-title').innerText = "MCQ Result: " + pid;
        document.getElementById('score-display-content').innerHTML = `
            <div style="background:white; padding:30px; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
                <div style="font-size:3rem; font-weight:800; color:#3b82f6;">${Math.round(total / 30 * 100)}%</div>
                <div style="color:#666; margin-bottom:20px;">Score: ${total} / 30</div>
                <p>To review individual answers, please open the paper from the main menu.</p>
            </div>`;
    }
}

async function renderSubjectTotal(subject, user) {
    toggleScorecardPanel();
    setView('score-display');
    const data = await window.CloudManager.getAllData(user);
    const papers = data.papers || {};
    let total = 0, count = 0;

    Object.keys(papers).forEach(pid => {
        let isTarget = false;
        if (subject === 'Business') isTarget = !pid.startsWith('econ_') && !pid.startsWith('gp_');
        else if (subject === 'Economics') isTarget = pid.startsWith('econ_');
        else if (subject === 'General Paper') isTarget = pid.startsWith('gp_');
        if (isTarget) {
            Object.values(papers[pid]).forEach(q => total += (q.score || 0));
            count++;
        }
    });

    document.getElementById('score-display-title').innerText = subject + " Overview";
    document.getElementById('score-display-content').innerHTML = `
        <div class="total-card">
            <h3>Cumulative Score</h3>
            <div style="font-size:5rem; font-weight:800; margin:20px 0;">${total}</div>
            <p>Across ${count} papers attempted</p>
        </div>`;
}

async function loadCloudLeaderboard() {
    const lb = await window.CloudManager.getLeaderboard();
    const sorted = Object.values(lb).sort((a, b) => b.total - a.total);

    let html = `<table class="modern-table"><thead><tr><th>Rank</th><th>Name</th><th>Business</th><th>Econ</th></tr></thead><tbody>`;
    sorted.forEach((s, i) => {
        html += `<tr>
            <td>#${i + 1}</td>
            <td style="font-weight:bold;">${s.name}</td>
            <td><span class="score-badge" style="background:#e0f2fe; color:#0284c7;">${s.business || 0}</span></td>
            <td><span class="score-badge" style="background:#fef3c7; color:#d97706;">${s.economics || 0}</span></td>
        </tr>`;
    });
    document.getElementById('leaderboard-content').innerHTML = html + "</tbody></table>";
}

// === 6. INITIALIZATION (WAIT FOR CLOUD MANAGER) ===
async function waitForCloudManager() {
    let attempts = 0;
    while (!window.CloudManager && attempts < 50) { // Wait up to 5 seconds
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }
    if (!window.CloudManager) {
        console.warn("CloudManager failed to load in time.");
    }
}

if (getUser()) {
    waitForCloudManager().then(() => {
        initApp(getUser());
    });
}
// === NEW LOGIC FOR UI OVERHAUL ===

// Subject Accordion
function toggleCat(catId) {
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.classList.toggle('hidden');
    // Simple toggle. CSS transition handled by flow or we can add max-height if we want animation.
}

function selectSubject(subject) {
    toggleSubjectsPanel(); // Close right panel

    // Switch to Papers view
    setView('papers');

    // Filter papers by subject
    // We reuse filterView logic but specific for papers container if needed.
    // Or just manually:
    const container = document.getElementById('view-papers');
    const sections = container.querySelectorAll('.subject-container');

    sections.forEach(section => {
        // Check ID or data-subject. 
        // IDs are 'container-bus-p3', 'container-econ-p3', etc.
        const id = section.id || '';
        if (subject === 'business') {
            if (id.includes('bus')) section.classList.remove('hidden');
            else section.classList.add('hidden');
        } else if (subject === 'economics') {
            if (id.includes('econ')) section.classList.remove('hidden');
            else section.classList.add('hidden');
        } else {
            section.classList.remove('hidden');
        }
    });
}

// === HOME PAGE LOGIC ===

// === HOME PAGE LOGIC ===

async function initHome() {
    const u = window.StorageManager ? window.StorageManager.getUser() : localStorage.getItem('user');
    if (!u) return;

    const name = u.split('.')[0] || 'Student';
    // Random Quote
    const quotes = [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The only way to do great work is to love what you do.",
        "Believe you can and you're halfway there.",
        "Education is the most powerful weapon which you can use to change the world.",
        "Difficult roads often lead to beautiful destinations.",
        "Don't watch the clock; do what it does. Keep going."
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    // Insert into DOM
    const view = document.getElementById('view-home');
    if (view) {
        // --- CONTINUE CARD LOGIC ---
        let suggestedTitle = "Continue Learning";
        let suggestedSubtitle = "Pick up where you left off";
        let suggestedAction = "setView('papers')"; // Default fallback
        let suggestedLabel = "Welcome Back";

        try {
            const lastActivity = JSON.parse(localStorage.getItem('habibi_last_activity'));
            if (lastActivity) {
                suggestedTitle = lastActivity.title || "Continue Session";
                suggestedSubtitle = lastActivity.subtitle || "Resume your progress";
                // If it's a function call string, use it. If it's a paper ID, open it.
                if (lastActivity.type === 'paper') {
                    suggestedAction = `openPaper('${lastActivity.id}')`;
                    suggestedLabel = "Resume Paper";
                } else if (lastActivity.type === 'vocab') {
                    suggestedAction = "showVocabContainer()";
                    suggestedLabel = "Continue Vocabulary";
                    suggestedTitle = "Vocabulary Builder";
                    suggestedSubtitle = "Master new words";
                } else if (lastActivity.type === 'idioms') {
                    suggestedAction = "showIdiomsContainer()";
                    suggestedLabel = "Continue Idioms";
                    suggestedTitle = "Idioms & Phrases";
                    suggestedSubtitle = "Expand your expressions";
                }
            }
        } catch (e) { console.error("Error reading last activity", e); }

        // --- DAILY TARGET LOGIC ---
        // We will fetch real stats in updateHomeStats, but here we set the skeleton matching the Continue Card style

        view.innerHTML = `
            <div class="decoration-orb"></div>
            
            <div class="welcome-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 30px;">
                <div>
                    <h1>Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}</h1>
                    <p class="motivation-quote">"${quote}"</p>
                </div>
                <div id="exam-countdown-widget" onclick="openExamTimeline()" style="
                    min-width: 280px;
                    max-width: 340px;
                    padding: 24px 28px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.5);
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(22, 163, 74, 0.12), inset 0 1px 0 rgba(255,255,255,0.6);
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                " onmouseover="this.style.transform='translateY(-4px) scale(1.02)'; this.style.boxShadow='0 16px 48px rgba(22, 163, 74, 0.2), inset 0 1px 0 rgba(255,255,255,0.7)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 32px rgba(22, 163, 74, 0.12), inset 0 1px 0 rgba(255,255,255,0.6)';">
                    <!-- Water shimmer effect -->
                    <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(ellipse at 30% 20%, rgba(22, 163, 74, 0.06) 0%, transparent 60%); pointer-events: none; animation: shimmer 4s ease-in-out infinite;"></div>
                    <div id="exam-widget-content" style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                            <span style="font-size: 1.1rem;">📅</span>
                            <span style="font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: rgba(22, 163, 74, 0.8);">Next Exam</span>
                        </div>
                        <div id="exam-widget-body" style="font-family: 'Inter', sans-serif;">Loading...</div>
                    </div>
                    <div style="position: absolute; bottom: 10px; right: 16px; font-size: 0.7rem; color: rgba(100,116,139,0.5); font-family: 'Inter', sans-serif; letter-spacing: 1px;">TAP FOR FULL TIMELINE →</div>
                </div>
            </div>
            
            <div class="home-grid">
                <!-- LEFT COLUMN: Actionable Content -->
                <div class="home-left-col">
                    <!-- Continue Card -->
                    <div class="glass-panel continue-card" onclick="${suggestedAction}">
                        <div class="continue-label">
                            <span>⚡</span> ${suggestedLabel}
                        </div>
                        <div class="continue-title">${suggestedTitle}</div>
                        <div class="continue-subtitle">
                           ${suggestedSubtitle} <span style="margin-left:auto">➜</span>
                        </div>
                    </div>

                    <!-- DAILY TARGET (Redesigned to match Continue Card) -->
                    <!-- Added onclick to maybe scroll to papers or just visual feedback -->
                    <!-- DAILY TARGET (Green Theme & Golden Thunder) -->
                    <div class="glass-panel continue-card" id="daily-target-card" style="border-left-color: var(--lime-primary); position: relative; overflow: hidden;"> 
                        <div class="continue-label" style="color: var(--lime-dark);">
                            <span>🎯</span> Daily Goal
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 5px;">
                            <div class="continue-title" style="margin-bottom: 0; color: #1e293b;">Daily Target</div>
                            <div style="text-align: right;">
                                <span id="daily-score-big" style="font-size: 1.8rem; font-weight: 800; color: var(--lime-dark);">0</span>
                                <span style="font-size: 0.9rem; color: #94a3b8; font-weight: 600;">/ 50 PTS</span>
                            </div>
                        </div>
                        
                        <!-- Progress Bar Container -->
                        <div style="height: 8px; background: #e2e8f0; border-radius: 4px; margin-top: 15px; overflow: hidden; position: relative;">
                            <div id="daily-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--lime-primary), var(--lime-dark)); border-radius: 4px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                        </div>
                        
                        <div class="continue-subtitle" style="margin-top: 15px; font-size: 0.9rem;">
                           <span id="daily-msg">Let's hit 50 points today!</span> 
                           <span style="margin-left:auto; display: flex; align-items: center; gap: 5px;">
                                <span style="font-size: 1.2rem; color: #f59e0b;">⚡</span> <span id="streak-days" style="font-weight: 700; color: #f59e0b;">0</span> Day Streak
                           </span>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: Stats & Progress -->
                <div class="home-right-col">
                    <div class="stat-card-glass" onclick="SWOTManager.openModal()" style="cursor: pointer;">
                        <div class="stat-icon">🧠</div>
                        <div class="stat-info">
                             <div class="stat-value">OPEN</div>
                             <div class="stat-label">SWOT Analysis</div>
                        </div>
                    </div>
                    
                    <div class="stat-card-glass">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-info">
                             <div class="stat-value" id="home-stat-score">-</div>
                             <div class="stat-label">Cumulative Score</div>
                        </div>
                    </div>
                    
                    <div class="stat-card-glass">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-info">
                             <div class="stat-value" id="home-stat-rank">-</div>
                             <div class="stat-label">Class Rank</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Fetch Stats
        updateHomeStats(u);
        // Populate exam countdown widget
        updateExamWidget();
    }
}

async function updateHomeStats(user) {
    // 1. Daily Progress & Reset Logic
    if (window.StorageManager && window.StorageManager.getDailyStats) {
        // Logic simplified: StorageManager calculates stats dynamically based on timestamps.
        // No manual reset needed here.

        const daily = window.StorageManager.getDailyStats(); // Should return updated stats
        const maxScore = 50;

        // Update Score Text
        const scoreEl = document.getElementById('daily-score-big');
        if (scoreEl) {
            scoreEl.innerText = daily.todayScore;
        }

        // Update Streak
        const streakEl = document.getElementById('streak-days');
        if (streakEl) streakEl.innerText = daily.streak || 0;

        // Update Progress Bar
        const bar = document.getElementById('daily-progress-bar');
        const percentage = Math.min((daily.todayScore / maxScore) * 100, 100);

        if (bar) {
            bar.style.width = `${percentage}%`;

            // Color Logic based on progress
            if (percentage >= 100) {
                bar.style.background = "linear-gradient(90deg, #10b981, #059669)"; // Green for completion
                document.getElementById('daily-target-card').style.borderLeftColor = "#10b981";
            } else {
                // Default Green (same as inline style)
                bar.style.background = "linear-gradient(90deg, var(--lime-primary), var(--lime-dark))";
                document.getElementById('daily-target-card').style.borderLeftColor = "var(--lime-primary)";
            }
        }

        // Dynamic Msg
        const msgEl = document.getElementById('daily-msg');
        if (msgEl) {
            if (daily.todayScore >= 50) {
                msgEl.innerText = "Target smashed! 🚀";
                msgEl.style.color = "#10b981";
                msgEl.style.fontWeight = "700";
            } else if (daily.todayScore > 25) {
                msgEl.innerText = "Halfway there! Keep pushing!";
                msgEl.style.color = "#333";
            } else {
                msgEl.innerText = "Let's hit 50 points today!";
                msgEl.style.color = "#666";
            }
        }
    }

    try {
        // Wait for CloudManager to initialize (module loads asynchronously)
        let retries = 0;
        while (!window.CloudManager && retries < 10) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
            retries++;
        }

        if (!window.CloudManager) {
            console.warn("CloudManager failed to initialize after retries");
            document.getElementById('home-stat-papers').innerText = "0";
            document.getElementById('home-stat-score-mini').innerText = "0"; // Mini score
            document.getElementById('home-stat-rank').innerText = "-";
            return;
        }

        // Get User Data
        const userData = await window.CloudManager.getAllData(user);
        const papers = userData.papers || {};

        // Calculate Business Papers Count
        let busCount = 0;
        let totalScore = 0;

        const data = await window.CloudManager.getPublicData('leaderboard');
        if (data) {
            const sorted = Object.values(data).sort((a, b) => (b.total || 0) - (a.total || 0));
            const myRank = sorted.findIndex(s => user && s.name && user.includes(s.name));
            const myData = sorted[myRank];

            document.getElementById('home-stat-rank').innerText = myRank !== -1 ? `#${myRank + 1}` : '-';
            // document.getElementById('home-stat-score').innerText = myData ? (myData.total || 0) : '0'; // Old large card removed
            const scoreVal = myData ? (myData.total || 0) : '0';
            const miniScore = document.getElementById('home-stat-score-mini');
            if (miniScore) miniScore.innerText = scoreVal;
        }

        Object.keys(papers).forEach(pid => {
            const type = classifyPaper(pid);
            // Count ALL papers, not just business
            if (type.subject) {
                const attempts = papers[pid];
                let isAttempted = false;
                Object.values(attempts).forEach(q => {
                    if (q.score !== undefined) {
                        isAttempted = true;
                        totalScore += (q.score || 0);
                    }
                });
                if (isAttempted) busCount++;
            }
        });

        const elPapers = document.getElementById('home-stat-papers');
        if (elPapers) elPapers.innerText = busCount;

        // Calculate Rank and Score
        const lb = await window.CloudManager.getLeaderboard();

        const sortedTotal = Object.values(lb).sort((a, b) => (b.total || 0) - (a.total || 0));
        let myRank = '-';
        let myTotalScore = 0;

        sortedTotal.forEach((s, i) => {
            if (user && s.name && user.toLowerCase().includes(s.name.toLowerCase())) {
                myRank = `#${i + 1}`;
                myTotalScore = s.total || 0;
            }
        });

        const elRank = document.getElementById('home-stat-rank');
        if (elRank) elRank.innerText = myRank;

        const elScore = document.getElementById('home-stat-score');
        if (elScore) elScore.innerText = myTotalScore;

        const label = document.querySelector('#view-home .stat-card-home:nth-child(2) .stat-label');
        if (label) label.innerText = "Cumulative Score";

    } catch (e) {
        console.error("Stats Error", e);
    }
}





// === NOTES LOGIC ===

function loadNotes() {
    if (!window.StorageManager) return;
    const notes = window.StorageManager.getNotes();
    const container = document.getElementById('saved-notes-list');
    if (!container) return;
    container.innerHTML = '';

    if (notes.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:rgba(255,255,255,0.6);">
                <div style="font-size:3rem; margin-bottom:10px; opacity:0.5;">📝</div>
                <div style="font-family:'Plus Jakarta Sans', sans-serif; font-size:1rem;">No notes yet</div>
                <div style="font-size:0.85rem; margin-top:5px;">Click "+ New Note" to start</div>
            </div>`;
        return;
    }

    notes.forEach((note, index) => {
        const div = document.createElement('div');
        div.className = 'saved-note-item glass-card';
        div.onclick = (e) => {
            if (e.target.closest('.delete-note-btn')) return;
            openNote(index);
        };

        let displayTitle = note.title || 'Untitled Note';
        let displayText = note.text ? note.text.substring(0, 60) + (note.text.length > 60 ? '...' : '') : 'No content';
        let dateStr = note.date ? new Date(note.date).toLocaleDateString() : 'Just now';

        div.innerHTML = `
            <div class="note-content">
                <div class="note-title">${displayTitle}</div>
                <div class="note-preview">${displayText}</div>
                <div class="note-date">${dateStr}</div>
            </div>
            <button class="delete-note-btn" onclick="deleteNote(${index})">
                <span style="font-size:1.1rem; line-height:1;">×</span>
            </button>
        `;
        container.appendChild(div);
    });
}

function createNewNote() {
    const editor = document.getElementById('note-editor');
    if (editor) {
        editor.value = '';
        editor.dataset.index = '';
        editor.focus();
    }
}

function saveCurrentNote() {
    if (!window.StorageManager) return;
    const editor = document.getElementById('note-editor');
    const text = editor.value;
    if (!text.trim()) return alert("Empty note!");

    const notes = window.StorageManager.getNotes();
    const idx = editor.dataset.index;

    // Generate Title
    const title = text.split('\n')[0].substring(0, 30);
    const noteObj = { title, text, date: new Date().toISOString() };

    if (idx !== '' && idx !== undefined && idx !== null && notes[idx]) {
        notes[idx] = noteObj;
    } else {
        notes.unshift(noteObj);
    }

    window.StorageManager.saveNotes(notes);
    loadNotes();
    alert("Note saved!");
}

function openNote(index) {
    const notes = JSON.parse(localStorage.getItem('habibi_notes') || '[]');
    if (notes[index]) {
        const editor = document.getElementById('note-editor');
        editor.value = notes[index].text;
        editor.dataset.index = index;
    }
}

function deleteNote(index) {
    if (!confirm("Delete this note?")) return;

    if (window.StorageManager) {
        const notes = window.StorageManager.getNotes();
        notes.splice(index, 1);
        window.StorageManager.saveNotes(notes);
        loadNotes();
        // If we deleted the currently viewed note, reset logic might be needed, 
        // but createNewNote() clears the editor which is safe.
        createNewNote();
    }
}

// === NEW SUB-CATEGORY LOGIC ===

function toggleSubCat(subId) {
    const el = document.getElementById(`sub-${subId}`);
    // Simple toggle hidden class
    if (el) {
        el.classList.toggle('hidden');
        // Rotate arrow if we want? (Optional enhancement)
    }
}

function selectPaper(subject, paper) {
    toggleSubjectsPanel(); // Close right panel

    // Switch to Papers view
    setView('papers');

    // Construct valid ID
    // input: subject='business' paper='p3' -> target='container-bus-p3'
    // input: subject='economics' paper='p3' -> target='container-econ-p3'

    let shortSub = subject;
    if (subject === 'business') shortSub = 'bus';
    if (subject === 'economics') shortSub = 'econ';

    const targetIdCheck = `container-${shortSub}-${paper}`;

    const container = document.getElementById('view-papers');
    if (!container) return;

    const sections = container.querySelectorAll('.subject-container');

    let found = false;
    sections.forEach(section => {
        if (section.id === targetIdCheck) {
            section.classList.remove('hidden');
            found = true;
        } else {
            section.classList.add('hidden');
        }
    });

    if (!found) {
        console.warn('Paper container not found:', targetIdCheck);
        // Fallback: Show everything for this subject so user sees SOMETHING
        sections.forEach(section => {
            if (section.id.includes(shortSub)) section.classList.remove('hidden');
        });
    }

    // Fallback: if not found, maybe show all for that subject?
    if (!found) {
        console.warn('Paper container not found:', targetIdCheck);
        // Try to show at least something for the subject
        sections.forEach(section => {
            if (section.id.includes(shortSub)) section.classList.remove('hidden');
        });
    }
}
// === FIX: Mock Data for all papers to prevent crashes ===

// Ensure paperData exists
if (typeof paperData === 'undefined') {
    var paperData = {};
}

// Helper to add mock if missing
function ensurePaperData(pid, title) {
    if (!paperData[pid]) {
        paperData[pid] = {
            title: title,
            pdf: "assets/sample.pdf", // Placeholder
            questions: [
                { n: "1a", m: 2, t: "Define the term 'Opportunity Cost'.", l: 20 },
                { n: "1b", m: 3, t: "Explain one reason why a business might fail.", l: 50 },
                { n: "2", m: 5, t: "Analyse the importance of cash flow to a startup.", l: 100 }
            ]
        };
    }
}

// Populate likely missing papers
// Business 9609
ensurePaperData('2024_fm_32', 'Feb/March 2024 Paper 32');
ensurePaperData('2024_mj_31', 'May/June 2024 Paper 31');
ensurePaperData('2024_mj_32', 'May/June 2024 Paper 32');
ensurePaperData('2024_mj_33', 'May/June 2024 Paper 33');

// Business P4 (Mock)
ensurePaperData('2024_fm_42', 'Feb/March 2024 Paper 42');
ensurePaperData('2024_mj_41', 'May/June 2024 Paper 41');

// Economics P3/P4 (Mock)
ensurePaperData('econ_2024_fm_32', 'Economics Feb/March 2024 P32');
ensurePaperData('econ_2024_mj_31', 'Economics May/June 2024 P31');
ensurePaperData('econ_2024_mj_41', 'Economics May/June 2024 P41');


// === DYNAMIC CONTENT LOADER (Subjects & Papers) ===
async function loadDynamicContent() {
    if (!window.CloudManager || !window.CloudManager.getPublicData) return;

    // 1. LOAD SUBJECTS & CREATE SECTIONS
    let customSubjects = [];
    try {
        const subjects = await window.CloudManager.getPublicData('content/subjects');
        const papersView = document.getElementById('view-papers');
        const dynamicContainer = document.getElementById('container-dynamic');

        if (subjects && papersView && dynamicContainer) {
            customSubjects = Object.values(subjects);
            customSubjects.forEach(sub => {
                const containerId = `container-${sub.id}`;
                const gridId = `${sub.id}-papers-grid`;

                // Create Section if missing
                if (!document.getElementById(containerId)) {
                    const div = document.createElement('div');
                    div.id = containerId;
                    div.className = 'subject-container';
                    div.style.marginTop = '40px';
                    div.style.borderTop = '1px solid #eee';
                    div.style.paddingTop = '1px'; // Fixed padding

                    div.innerHTML = `
                        <div class="series-header">
                            <div class="series-name" style="font-size:1.5rem; color:var(--lime-dark);">
                                ${sub.name} <span style="font-size:1rem; color:#888;">(${sub.code})</span>
                            </div>
                        </div>
                        <div id="${gridId}" class="papers-grid"></div>
                    `;
                    // Insert custom subjects BEFORE the general community section
                    papersView.insertBefore(div, dynamicContainer);
                }
            });
        }
    } catch (e) { console.error("Subject Load Error", e); }

    // 2. LOAD & DISTRIBUTE PAPERS
    try {
        const papers = await window.CloudManager.getPublicData('content/papers');
        if (!papers) return;

        const paperIds = Object.keys(papers);
        if (paperIds.length === 0) return;

        // Ensure General Container is visible
        const dynamicSection = document.getElementById('container-dynamic');
        if (dynamicSection) dynamicSection.classList.remove('hidden');

        // Clear all dynamic grids first (to prevent duplicates on re-run)
        const genericGrid = document.getElementById('dynamic-papers-grid');
        if (genericGrid) genericGrid.innerHTML = '';

        customSubjects.forEach(sub => {
            const g = document.getElementById(`${sub.id}-papers-grid`);
            if (g) g.innerHTML = '';
        });

        paperIds.forEach(pid => {
            const p = papers[pid];
            const pidLower = p.id.toLowerCase();

            // Create Card
            const card = document.createElement('div');
            card.className = 'paper-card';
            card.onclick = () => openPaper(p.id);

            // Determine Tag
            let tag = 'Extra';
            if (pidLower.includes('bus') || pidLower.includes('9609')) tag = 'Business';
            else if (pidLower.includes('econ') || pidLower.includes('9708')) tag = 'Economics';
            else tag = p.id.split('_')[1] || 'Community'; // Fallback tag

            card.innerHTML = `
                <span class="paper-tag" style="text-transform:capitalize;">${tag}</span>
                <h3>${p.title}</h3>
                <p style="color:#888; margin-top:5px;">PDF Available</p>
            `;

            // Distribute to Subject Grid vs General Grid
            let placed = false;
            for (const sub of customSubjects) {
                // If paper ID contains subject ID (e.g. 'physics_9702')
                if (pidLower.includes(sub.id)) {
                    const subGrid = document.getElementById(`${sub.id}-papers-grid`);
                    if (subGrid) {
                        subGrid.appendChild(card);
                        placed = true;
                        break;
                    }
                }
            }

            if (!placed && genericGrid) {
                genericGrid.appendChild(card);
            }
        });
    } catch (e) { console.error("Dynamic Load Error:", e); }

    // 3. LOAD FORMULAE & DEFINITIONS
    loadDynamicExtras('formulae');
    loadDynamicExtras('definitions');
}

// === 3. LOAD FORMULAE & DEFINITIONS (Targeted) ===
async function loadDynamicExtras(type) {
    try {
        const data = await window.CloudManager.getPublicData(`content/${type}`);
        if (!data) return;

        const containerId = type === 'formulae' ? 'view-formulae' : 'view-definitions';
        const view = document.getElementById(containerId);
        if (!view) return;

        // Group by Subject
        const grouped = {};
        Object.values(data).forEach(item => {
            const sub = item.subject || 'general'; // Default to general if no tag
            if (!grouped[sub]) grouped[sub] = [];
            grouped[sub].push(item);
        });

        // Render Groups
        Object.keys(grouped).forEach(sub => {
            // Check if section exists (e.g., business-formulae)
            // Hardcoded sections don't have IDs usually, they are filtered by classes or data-attributes.
            // In logic.js filterView, it hides/shows based on classes like 'container-bus-p4' but for formulae??
            // checking filterView: 
            // if (viewName === 'formulae' || viewName === 'definitions') { ... 
            // document.querySelectorAll('.formula-section, .def-section').forEach(el => {
            //   if (el.dataset.subject === subject) el.classList.remove('hidden'); ...

            // So we need to create a section with data-subject="{sub}"

            // 1. Try to find existing dynamic section for this subject
            let sectionId = `dynamic-${type}-${sub}`;
            let section = document.getElementById(sectionId);

            if (!section) {
                section = document.createElement('div');
                section.id = sectionId;
                section.className = type === 'formulae' ? 'formula-section' : 'def-section';
                section.setAttribute('data-subject', sub);

                // Add Header for Custom Subjects (don't duplicate header for known ones if not needed, but safe to add)
                // Actually, existing hardcoded sections have headers? 
                // Let's add a sub-header "Community [Subject] Content"
                section.innerHTML = `<h3 class="chapter-title" style="color:#e056fd; margin-top:20px; font-size:1.2rem;">✨ Extra ${sub} Content</h3>`;

                const grid = document.createElement('div');
                grid.className = type === 'formulae' ? 'formula-grid' : 'def-grid';
                if (type === 'definitions') grid.style.display = 'grid';

                section.appendChild(grid);
                view.appendChild(section);
            }

            const grid = section.querySelector('div'); // The grid div
            grid.innerHTML = ''; // Clear

            grouped[sub].forEach(item => {
                const div = document.createElement('div');
                if (type === 'formulae') {
                    div.className = 'formula-card';
                    div.innerHTML = `
                        <div class="f-title">${item.title}</div>
                        <div class="f-body">${item.body}</div>
                    `;
                } else {
                    div.className = 'def-card';
                    div.innerHTML = `
                        <div class="d-term">${item.term || item.word}</div>
                        <div class="d-desc">${item.desc || item.def}</div>
                    `;
                }
                grid.appendChild(div);
            });
        });

    } catch (e) { console.error(`Error loading ${type}`, e); }
}


// ==========================================
// EXAM TIMELINE SYSTEM
// ==========================================

const EXAM_SCHEDULE = [
    { code: '9709/52', subject: 'Mathematics', paper: 'Probability & Statistics 1', date: '2026-02-17', time: 'AM', icon: '📐' },
    { code: '9609/32', subject: 'Business', paper: 'Decision-Making Paper 3', date: '2026-02-17', time: 'PM', icon: '💼' },
    { code: '9709/32', subject: 'Mathematics', paper: 'Pure Mathematics 3', date: '2026-02-20', time: 'AM', icon: '📐' },
    { code: '8021/12', subject: 'General Paper', paper: 'Essay (Paper 1)', date: '2026-02-23', time: 'AM', icon: '✍️' },
    { code: '9609/42', subject: 'Business', paper: 'Business Strategy Paper 4', date: '2026-02-24', time: 'AM', icon: '💼' },
    { code: '8021/22', subject: 'General Paper', paper: 'Comprehension (Paper 2)', date: '2026-02-27', time: 'AM', icon: '📖' },
    { code: '9708/42', subject: 'Economics', paper: 'Data Response & Essays', date: '2026-03-02', time: 'PM', icon: '📊' },
    { code: '9708/32', subject: 'Economics', paper: 'Multiple Choice', date: '2026-03-09', time: 'AM', icon: '📊' }
];

let examCountdownInterval = null;

function getExamDateTime(exam) {
    // AM = 08:00, PM = 13:00 (local time approximation)
    const hour = exam.time === 'AM' ? 8 : 13;
    return new Date(exam.date + 'T' + (hour < 10 ? '0' : '') + hour + ':00:00');
}

function getNextExam() {
    const now = new Date();
    for (const exam of EXAM_SCHEDULE) {
        const examEnd = getExamDateTime(exam);
        examEnd.setHours(examEnd.getHours() + 3); // Assume 3-hour exam duration
        if (examEnd > now) return exam;
    }
    return null;
}

function formatCountdown(diffMs) {
    if (diffMs <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, isLive: true };
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
    return { days, hours, mins, secs, isLive: false };
}

function updateExamWidget() {
    const body = document.getElementById('exam-widget-body');
    if (!body) return;

    const nextExam = getNextExam();
    if (!nextExam) {
        body.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: 700; color: #16a34a; margin-bottom: 4px;">🎉 All exams complete!</div>
            <div style="font-size: 0.85rem; color: #64748b;">You've finished all scheduled exams.</div>
        `;
        return;
    }

    const examDT = getExamDateTime(nextExam);
    const now = new Date();
    const diff = examDT - now;
    const cd = formatCountdown(diff);

    // Subject color mapping
    const subjectColors = {
        'Mathematics': '#6366f1',
        'Business': '#ea580c',
        'General Paper': '#0891b2',
        'Economics': '#7c3aed'
    };
    const accent = subjectColors[nextExam.subject] || '#16a34a';

    if (cd.isLive) {
        body.innerHTML = `
            <div style="font-size: 1.15rem; font-weight: 800; color: #dc2626; margin-bottom: 6px; animation: pulse 1.5s infinite;">🔴 EXAM IN PROGRESS</div>
            <div style="font-size: 0.95rem; font-weight: 600; color: #1e293b;">${nextExam.icon} ${nextExam.paper}</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">${nextExam.subject} · ${nextExam.code}</div>
        `;
    } else {
        body.innerHTML = `
            <div style="font-size: 1.05rem; font-weight: 700; color: #1e293b; margin-bottom: 10px; line-height: 1.3;">${nextExam.icon} ${nextExam.paper}</div>
            <div style="font-size: 0.8rem; color: ${accent}; font-weight: 600; margin-bottom: 12px;">${nextExam.subject} · ${nextExam.code} · ${nextExam.time}</div>
            <div style="display: flex; gap: 10px;">
                ${[
                { val: cd.days, label: 'D' },
                { val: cd.hours, label: 'H' },
                { val: cd.mins, label: 'M' },
                { val: cd.secs, label: 'S' }
            ].map(u => `
                    <div style="text-align: center; flex: 1;">
                        <div style="
                            font-size: 1.5rem;
                            font-weight: 800;
                            color: #1e293b;
                            background: rgba(255,255,255,0.6);
                            border-radius: 10px;
                            padding: 6px 0;
                            font-variant-numeric: tabular-nums;
                            border: 1px solid rgba(255,255,255,0.8);
                        ">${String(u.val).padStart(2, '0')}</div>
                        <div style="font-size: 0.65rem; color: #94a3b8; font-weight: 600; margin-top: 4px; letter-spacing: 1px;">${u.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Refresh every second
    if (examCountdownInterval) clearInterval(examCountdownInterval);
    examCountdownInterval = setInterval(() => {
        const el = document.getElementById('exam-widget-body');
        if (!el) { clearInterval(examCountdownInterval); return; }
        updateExamWidget();
    }, 1000);
}

function openExamTimeline() {
    // Remove existing modal if any
    const existing = document.getElementById('exam-timeline-modal');
    if (existing) existing.remove();

    const now = new Date();

    const subjectColors = {
        'Mathematics': { bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.3)', text: '#6366f1' },
        'Business': { bg: 'rgba(234, 88, 12, 0.08)', border: 'rgba(234, 88, 12, 0.3)', text: '#ea580c' },
        'General Paper': { bg: 'rgba(8, 145, 178, 0.08)', border: 'rgba(8, 145, 178, 0.3)', text: '#0891b2' },
        'Economics': { bg: 'rgba(124, 58, 237, 0.08)', border: 'rgba(124, 58, 237, 0.3)', text: '#7c3aed' }
    };

    const examCards = EXAM_SCHEDULE.map(exam => {
        const examDT = getExamDateTime(exam);
        const examEnd = new Date(examDT); examEnd.setHours(examEnd.getHours() + 3);
        const isPast = examEnd < now;
        const isNext = !isPast && getNextExam() && getNextExam().code === exam.code && getNextExam().date === exam.date;
        const colors = subjectColors[exam.subject] || { bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.3)', text: '#16a34a' };

        const dateObj = new Date(exam.date + 'T12:00:00');
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = dateObj.getDate();
        const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });

        let statusBadge = '';
        if (isPast) {
            statusBadge = '<span style="font-size: 0.7rem; font-weight: 700; color: #16a34a; background: rgba(22,163,74,0.1); padding: 3px 10px; border-radius: 20px;">✓ DONE</span>';
        } else if (isNext) {
            statusBadge = '<span style="font-size: 0.7rem; font-weight: 700; color: #dc2626; background: rgba(220,38,38,0.1); padding: 3px 10px; border-radius: 20px; animation: pulse 2s infinite;">● UP NEXT</span>';
        } else {
            statusBadge = '<span style="font-size: 0.7rem; font-weight: 700; color: #94a3b8; background: rgba(148,163,184,0.1); padding: 3px 10px; border-radius: 20px;">UPCOMING</span>';
        }

        return `
            <div style="
                display: flex; align-items: center; gap: 20px;
                padding: 18px 22px;
                background: ${isPast ? 'rgba(148,163,184,0.04)' : isNext ? 'rgba(22,163,74,0.06)' : 'rgba(255,255,255,0.25)'};
                backdrop-filter: blur(12px);
                border: 1px solid ${isNext ? 'rgba(22,163,74,0.3)' : 'rgba(255,255,255,0.3)'};
                border-radius: 16px;
                transition: all 0.3s;
                opacity: ${isPast ? '0.55' : '1'};
                ${isNext ? 'box-shadow: 0 0 20px rgba(22, 163, 74, 0.1);' : ''}
            " onmouseover="this.style.transform='translateX(6px)'" onmouseout="this.style.transform='translateX(0)'">
                <!-- Date Badge -->
                <div style="
                    min-width: 60px; text-align: center;
                    background: ${colors.bg};
                    border: 1px solid ${colors.border};
                    border-radius: 12px; padding: 10px 8px;
                ">
                    <div style="font-size: 0.65rem; font-weight: 700; color: ${colors.text}; text-transform: uppercase; letter-spacing: 1px;">${dayName}</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #1e293b; line-height: 1.2;">${dayNum}</div>
                    <div style="font-size: 0.7rem; font-weight: 600; color: #64748b;">${monthName}</div>
                </div>
                <!-- Details -->
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-size: 1.15rem;">${exam.icon}</span>
                        <span style="font-size: 1rem; font-weight: 700; color: #1e293b; ${isPast ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${exam.paper}</span>
                    </div>
                    <div style="font-size: 0.82rem; color: ${colors.text}; font-weight: 600;">${exam.subject} · ${exam.code}</div>
                </div>
                <!-- Time + Status -->
                <div style="text-align: right; min-width: 80px;">
                    ${statusBadge}
                    <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px; font-weight: 600;">${exam.time === 'AM' ? '🌅 Morning' : '🌇 Afternoon'}</div>
                </div>
            </div>
        `;
    }).join('');

    const modal = document.createElement('div');
    modal.id = 'exam-timeline-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex; justify-content: center; align-items: center;
        animation: fadeIn 0.3s ease;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="
            max-width: 640px; width: 100%; max-height: 85vh;
            background: linear-gradient(160deg, rgba(255,255,255,0.7) 0%, rgba(240,253,244,0.5) 50%, rgba(255,255,255,0.6) 100%);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255,255,255,0.6);
            border-radius: 28px;
            box-shadow: 0 24px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8);
            overflow: hidden;
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        ">
            <!-- Header -->
            <div style="
                padding: 28px 32px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.4);
                background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(240,253,244,0.2) 100%);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="
                            font-family: 'Playfair Display', serif;
                            font-size: 1.8rem; font-weight: 700;
                            color: #1e293b; margin: 0 0 6px 0;
                            background: linear-gradient(135deg, #1e293b, #16a34a);
                            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                        ">📋 Exam Timeline</h2>
                        <p style="font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #64748b; margin: 0;">March 2026 Series · GCE AS & A Level</p>
                    </div>
                    <button onclick="document.getElementById('exam-timeline-modal').remove()" style="
                        width: 36px; height: 36px;
                        background: rgba(0,0,0,0.06);
                        border: none; border-radius: 50%;
                        font-size: 1.2rem; cursor: pointer;
                        display: flex; align-items: center; justify-content: center;
                        transition: all 0.2s;
                        color: #64748b;
                    " onmouseover="this.style.background='rgba(0,0,0,0.12)'" onmouseout="this.style.background='rgba(0,0,0,0.06)'">✕</button>
                </div>
            </div>
            <!-- Body -->
            <div style="padding: 20px 28px 28px; overflow-y: auto; max-height: calc(85vh - 100px); display: flex; flex-direction: column; gap: 12px;">
                ${examCards}
            </div>
        </div>
    `;

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
}

