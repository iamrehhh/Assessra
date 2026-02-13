// =============================================
// LOGIC.JS - FULLY RECONSTRUCTED & FIXED
// Includes: Cloud Sync, Smart Sorting, UI Fixes
// =============================================

// === 1. GLOBAL UI & MENU MANAGEMENT ===

// Helper to close ALL panels to prevent overlaps
function closeAllPanels() {
    ['side-menu', 'scorecard-panel', 'leaderboard-panel', 'chat-panel'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('active');
    });
    
    ['side-menu-overlay', 'scorecard-overlay', 'leaderboard-overlay', 'chat-overlay'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('active');
    });
}

// Right Side Main Menu
function toggleSideMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('side-menu-overlay');
    
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        closeAllPanels(); // Force close others
        menu.classList.add('active');
        overlay.classList.add('active');
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

// 1. Toggle the Side Panel
function toggleLeaderboardPanel() {
    const panel = document.getElementById('leaderboard-panel');
    const overlay = document.getElementById('leaderboard-overlay');
    
    // Close others first
    closeAllPanels();

    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    } else {
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
    if(target) target.classList.remove('hidden');
    
    document.querySelectorAll('.paper-link').forEach(el => el.classList.remove('active'));
    document.getElementById(`link-${targetViewId}`).classList.add('active');
    
    toggleSideMenu(); // Close menu
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
    if(ALLOWED_USERS[u] && ALLOWED_USERS[u] === p) {
        setUser(u);
        initApp(u);
    } else { alert("Invalid Username or Password."); }
}

function initApp(u) {
    const name = u.split('.')[0] || u;
    document.getElementById('welcome-msg').innerText = `Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    document.getElementById('login-layer').classList.add('hidden');
    document.getElementById('app-layer').classList.remove('hidden');
    setView('papers');
}

function doLogout() { localStorage.removeItem('user'); location.reload(); }

function setView(viewName) {
    // 1. Hide all main views
    ['papers', 'scorecard', 'workspace', 'formulae', 'definitions', 'leaderboard', 'tips', 'score-display'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if(el) el.classList.add('hidden');
    });

    // 2. Show target view
    const target = document.getElementById(`view-${viewName}`);
    if(target) target.classList.remove('hidden');

    // 3. Update Navigation Buttons (The Fix)
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        
        // Match button text to view name
        const text = btn.innerText.toLowerCase().trim();
        
        // Simple mapping check
        if (text === viewName || 
           (viewName === 'papers' && text === 'papers') ||
           (viewName === 'formulae' && text === 'formulae') ||
           (viewName === 'definitions' && text === 'definitions')) {
            btn.classList.add('active');
        }
    });
}

function backToDash() { setView('papers'); }
function toggleInsert() { document.getElementById('insert-panel').classList.toggle('show'); }

// === 3. CORE PAPER LOGIC (CLOUD ENABLED) ===

async function openPaper(pid) {
    const data = paperData[pid];
    document.getElementById('questions-container').innerHTML = `<div style="text-align:center; padding:50px; color:#888;">⏳ Fetching your answers...</div>`;

    const pdfFrame = document.getElementById('insert-pdf');
    if(pdfFrame && data.pdf) pdfFrame.src = data.pdf;
    
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
        if(done) {
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
        if(el) updateWordCount(el, q.l);
    });
}

async function submitAnswer(pid, qn) {
    const el = document.getElementById(`ans_${pid}_${qn}`);
    const btn = event.target;
    const ans = el.value.trim();
    if(!ans) return alert("Please write an answer first.");

    btn.innerText = "⏳ Strict Marking...";
    btn.disabled = true;

    const qData = paperData[pid].questions.find(q => q.n === qn);

    try {
        const res = await fetch('https://ultimate-exam-guide.onrender.com/mark', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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

    } catch(e) {
        console.error(e);
        alert("Error: Server not responding or Save failed.");
        btn.innerText = "Retry";
        btn.disabled = false;
    }
}

// === 4. HELPER FUNCTIONS ===

function updateWordCount(el, limitStr) {
    if(!limitStr) return;
    const count = el.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    const wcId = el.id.replace('ans_', 'wc_');
    const wcEl = document.getElementById(wcId);
    if(wcEl) {
        wcEl.innerText = `${count} words (${limitStr})`;
        wcEl.classList.toggle('bad', count < parseInt(limitStr.split('-')[0]));
        wcEl.classList.toggle('good', count >= parseInt(limitStr.split('-')[0]));
    }
}

function toggleExpand(textAreaId, btnId) {
    const el = document.getElementById(textAreaId);
    const btn = document.getElementById(btnId);
    if(el) {
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
    if(!u) return;

    // Reset Containers
    ['sc-bus-p3', 'sc-bus-p4', 'sc-econ-p3', 'sc-econ-p4'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerHTML = '';
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

        const percent = max > 0 ? Math.round(total/max*100) : 0;
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
        Object.values(attempts).forEach(ans => { if(ans.score === 1) total++; });
        
        document.getElementById('score-display-title').innerText = "MCQ Result: " + pid;
        document.getElementById('score-display-content').innerHTML = `
            <div style="background:white; padding:30px; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
                <div style="font-size:3rem; font-weight:800; color:#3b82f6;">${Math.round(total/30*100)}%</div>
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
        if(isTarget) {
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
    const sorted = Object.values(lb).sort((a,b) => b.total - a.total);
    
    let html = `<table class="modern-table"><thead><tr><th>Rank</th><th>Name</th><th>Business</th><th>Econ</th></tr></thead><tbody>`;
    sorted.forEach((s, i) => {
        html += `<tr>
            <td>#${i+1}</td>
            <td style="font-weight:bold;">${s.name}</td>
            <td><span class="score-badge" style="background:#e0f2fe; color:#0284c7;">${s.business || 0}</span></td>
            <td><span class="score-badge" style="background:#fef3c7; color:#d97706;">${s.economics || 0}</span></td>
        </tr>`;
    });
    document.getElementById('leaderboard-content').innerHTML = html + "</tbody></table>";
}

// === 6. INITIALIZATION ===
if(getUser()) {
    initApp(getUser());
}