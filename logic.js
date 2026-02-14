// =============================================
// LOGIC.JS - FULLY RECONSTRUCTED & FIXED
// Includes: Cloud Sync, Smart Sorting, UI Fixes
// =============================================

// === 1. GLOBAL UI & MENU MANAGEMENT ===

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

function switchPaperView(targetViewId) {
    document.querySelectorAll('.subject-container').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`container-${targetViewId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.paper-link').forEach(el => el.classList.remove('active'));
    document.getElementById(`link-${targetViewId}`).classList.add('active');

    closeAllPanels(); // Close menu
    setView('papers');
}

// Allowed Users Configuration
const ALLOWED_USERS = {
    "Jesan.Equebal": "virgin",
    "Newton.Mondal": "anime",
    "Sarwar.Alam": "suspension",
    "Aadrita.Mukhopadhyay": "ipmat",
    "Shinjan.Garain": "xxx",
    "Debraj.Mondal": "indore",
    "Abdul.Subhan": "biology",
    "Biswajit.Saha": "general",
    "Surjayu.Sanyal": "rizz",
    "Shreyas.Bhattacharya": "A....",
    "Ayush.Paul": "ayush",
    "Abdul.Rehan": "jipmat"
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
    setView('home');
}

function doLogout() { localStorage.removeItem('user'); location.reload(); }

function setView(viewName) {
    // 1. Hide all main views
    ['papers', 'scorecard', 'workspace', 'formulae', 'definitions', 'leaderboard', 'tips', 'score-display', 'home'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    // 2. Show target view
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.remove('hidden');

    // 3. Update Navigation Buttons (The Fix)
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

function backToDash() { setView('papers'); }
function toggleInsert() { document.getElementById('insert-panel').classList.toggle('show'); }

// === 3. CORE PAPER LOGIC (CLOUD ENABLED) ===

async function openPaper(pid) {
    const data = paperData[pid];
    document.getElementById('questions-container').innerHTML = `<div style="text-align:center; padding:50px; color:#888;">⏳ Fetching your answers...</div>`;

    const pdfFrame = document.getElementById('insert-pdf');
    if (pdfFrame && data.pdf) pdfFrame.src = data.pdf;

    const u = getUser();
    let attempts = {};

    // FETCH FROM CLOUD
    try {
        if (window.CloudManager) {
            const allData = await window.CloudManager.getAllData(u);
            if (allData.papers && allData.papers[pid]) {
                attempts = allData.papers[pid];
            }
        }
    } catch (e) { console.error("Error loading paper data:", e); }

    let qHtml = `<h2 style="margin-bottom:20px; color:var(--lime-dark);">${data.title}</h2>`;
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
            ${done ? `<div class="feedback-box"><h3>Score: ${att.score}/${q.m}</h3>${aoHtml}<p><strong>Strengths:</strong> ${att.strengths}</p><p><strong>Improvements:</strong> <span style="color:#d63031">${att.weaknesses}</span></p><div class="model-ans-box"><strong>Model Answer:</strong><br>${att.modelAnswer}</div></div>` : ''}
        </div>`;
    });

    document.getElementById('questions-container').innerHTML = qHtml;
    setView('workspace');
    data.questions.forEach(q => {
        const el = document.getElementById(`ans_${pid}_${q.n}`);
        if (el) updateWordCount(el, q.l);
    });
}

async function submitAnswer(pid, qn) {
    const el = document.getElementById(`ans_${pid}_${qn}`);
    const btn = event.target;
    const ans = el.value.trim();
    if (!ans) return alert("Please write an answer first.");

    btn.innerText = "⏳ Strict Marking...";
    btn.disabled = true;

    const qData = paperData[pid].questions.find(q => q.n === qn);

    try {
        const res = await fetch('https://ultimate-exam-guide.onrender.com/mark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: qData.t,
                case_study: `Refer to attached PDF for ${paperData[pid].title}.`,
                answer: ans,
                marks: qData.m
            })
        });

        const json = await res.json();

        // SAVE TO CLOUD AND WAIT
        await window.CloudManager.saveAttempt(getUser(), pid, qn, {
            answer: ans,
            score: json.score,
            ao1: json.ao1, ao2: json.ao2, ao3: json.ao3, ao4: json.ao4,
            strengths: json.strengths,
            weaknesses: json.weaknesses,
            modelAnswer: json.model_answer
        });

        await openPaper(pid); // Refresh view

    } catch (e) {
        console.error(e);
        alert("Error: Server not responding or Save failed.");
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

function toggleInsertMaximize() {
    const el = document.getElementById('insert-panel');
    const btn = document.querySelector('.maximize-insert-btn');
    el.classList.toggle('fullscreen');
    btn.innerText = el.classList.contains('fullscreen') ? "⤡ Minimize" : "⤢ Maximize";
}

// === 5. SCORECARD & LEADERBOARD LOGIC ===

function classifyPaper(pid) {
    // 1. Explicit Economics ID
    if (pid.startsWith('econ_')) {
        if (pid.includes('31') || pid.includes('32') || pid.includes('33') || pid.includes('34')) return { subject: 'economics', paper: 'p3' };
        return { subject: 'economics', paper: 'p4' };
    }
    // 2. Business Paper Check (fallback)
    if (window.paperData && window.paperData[pid]) {
        if (pid.includes('41') || pid.includes('42') || pid.includes('43')) return { subject: 'business', paper: 'p4' };
        return { subject: 'business', paper: 'p3' };
    }
    // 3. Default (Assume Econ MCQ if unknown and not in Business data)
    return { subject: 'economics', paper: 'p3' };
}

async function loadCloudScorecard() {
    const u = getUser();
    if (!u) return;

    // Reset Containers
    ['sc-bus-p3', 'sc-bus-p4', 'sc-econ-p3', 'sc-econ-p4'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    const data = await window.CloudManager.getAllData(u);
    const papers = data.papers || {};

    Object.keys(papers).forEach(pid => {
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
        const isTarget = subject === 'Business' ? (!pid.startsWith('econ_')) : (pid.startsWith('econ_'));
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

// === 6. INITIALIZATION ===
if (getUser()) {
    initApp(getUser());
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

async function initHome() {
    const u = getUser();
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
        view.innerHTML = `
            <div class="welcome-header">
                <h1>Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}</h1>
                <p class="motivation-quote">"${quote}"</p>
            </div>
            
            <div class="home-grid">
                <div class="stat-card-home">
                    <div class="stat-label">Business Papers</div>
                    <div class="stat-value" id="home-stat-papers">-</div>
                </div>
                <div class="stat-card-home">
                    <div class="stat-label">Average Score</div>
                    <div class="stat-value" id="home-stat-score">-</div>
                </div>
                <div class="stat-card-home">
                    <div class="stat-label">Class Rank</div>
                    <div class="stat-value" id="home-stat-rank">-</div>
                </div>
                
                <div class="ai-tutor-home">
                    <div style="font-size:3rem;">🤖</div>
                    <div class="ai-content">
                        <h3 style="margin:0; color:var(--lime-dark);">AI Personal Tutor</h3>
                        <p style="color:#666; margin-top:5px;">Ask me anything about Business or Economics!</p>
                        <div class="ai-input-group">
                            <input type="text" class="ai-input-home" placeholder="Explain price elasticity..." id="home-ai-input" onkeypress="handleHomeAIEnter(event)">
                            <button class="ai-send-btn" onclick="handleHomeAI()">➜</button>
                        </div>
                        <div id="home-ai-response" style="margin-top:15px; font-size:0.95rem; line-height:1.5;"></div>
                    </div>
                </div>
            </div>
        `;

        // Fetch Stats
        updateHomeStats(u);
    }
}

async function updateHomeStats(user) {
    try {
        // Safety check for CloudManager
        if (!window.CloudManager) {
            console.warn("CloudManager not initialized");
            document.getElementById('home-stat-papers').innerText = "0";
            document.getElementById('home-stat-score').innerText = "0";
            document.getElementById('home-stat-rank').innerText = "-";
            return;
        }

        // Get User Data
        const userData = await window.CloudManager.getAllData(user);
        const papers = userData.papers || {};

        // Calculate Business Papers Count
        let busCount = 0;
        let totalScore = 0;

        Object.keys(papers).forEach(pid => {
            const type = classifyPaper(pid);
            if (type.subject === 'business') {
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

function handleHomeAIEnter(e) {
    if (e.key === 'Enter') handleHomeAI();
}

async function handleHomeAI() {
    const input = document.getElementById('home-ai-input');
    const responseDiv = document.getElementById('home-ai-response');
    const txt = input.value.trim();

    if (!txt) return;

    // Loading State
    const originalPlaceholder = input.placeholder;
    input.value = '';
    input.placeholder = "Thinking...";
    input.disabled = true;
    if (responseDiv) responseDiv.innerHTML = '<span style="color:#888;">Thinking...</span>';

    try {
        const res = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: txt })
        });

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        const reply = data.reply || "No response.";

        // Typewriter effect or just text? Text is fine for now.
        if (responseDiv) {
            responseDiv.innerHTML = `<strong style="color:var(--lime-dark);">AI Tutor:</strong> ${reply}`;
        }

    } catch (e) {
        console.error(e);
        if (responseDiv) responseDiv.innerHTML = `<span style="color:red;">Error: Is the backend server running? (python app.py)</span>`;
    } finally {
        input.disabled = false;
        input.placeholder = originalPlaceholder;
        input.focus();
    }
}

// === NOTES LOGIC ===

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('habibi_notes') || '[]');
    const container = document.getElementById('saved-notes-list');
    if (!container) return;
    container.innerHTML = '';

    if (notes.length === 0) {
        container.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">No notes yet. Create one!</div>';
        return;
    }

    notes.forEach((note, index) => {
        const div = document.createElement('div');
        div.className = 'saved-note-item';
        // Check for title or use text excerpt
        let displayTitle = note.title;
        if (!displayTitle) {
            displayTitle = note.text ? note.text.substring(0, 20) + (note.text.length > 20 ? '...' : '') : 'Untitled Note';
        }

        div.innerHTML = `
            <span onclick="openNote(${index})" style="flex:1;">${displayTitle}</span>
            <button class="delete-note-btn" onclick="deleteNote(${index})">🗑</button>
        `;
        container.appendChild(div);
    });
}

function createNewNote() {
    const editor = document.getElementById('note-editor');
    editor.value = '';
    editor.dataset.index = ''; // Clear current index
    editor.focus();
}

function saveCurrentNote() {
    const editor = document.getElementById('note-editor');
    const text = editor.value;
    if (!text.trim()) return alert("Empty note!");

    const notes = JSON.parse(localStorage.getItem('habibi_notes') || '[]');
    const idx = editor.dataset.index;

    // Generate Title from first line
    const title = text.split('\n')[0].substring(0, 30);
    const noteObj = { title, text, date: new Date().toISOString() };

    if (idx !== '' && idx !== undefined && idx !== null && notes[idx]) {
        notes[idx] = noteObj;
    } else {
        notes.unshift(noteObj);
    }

    localStorage.setItem('habibi_notes', JSON.stringify(notes));
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
    const notes = JSON.parse(localStorage.getItem('habibi_notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('habibi_notes', JSON.stringify(notes));
    loadNotes();
    createNewNote();
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

