// === SIDE MENU & MULTI-SUBJECT LOGIC ===
function toggleSideMenu() {
    document.getElementById('side-menu').classList.toggle('active');
    document.getElementById('side-menu-overlay').classList.toggle('active');
}

function toggleSubject(subId) {
    const content = document.getElementById(subId);
    // Expand or collapse the clicked subject
    content.classList.toggle('expanded');
}

function switchPaperView(targetViewId) {
    // 1. Hide ALL paper containers
    document.querySelectorAll('.subject-container').forEach(el => el.classList.add('hidden'));
    
    // 2. Show the specific one clicked
    const target = document.getElementById(`container-${targetViewId}`);
    if(target) target.classList.remove('hidden');
    
    // 3. Highlight the active link in the menu
    document.querySelectorAll('.paper-link').forEach(el => el.classList.remove('active'));
    document.getElementById(`link-${targetViewId}`).classList.add('active');
    
    // 4. Close the side menu and ensure we are on the Papers view
    toggleSideMenu();
    setView('papers');
}

// === CHAT UI LOGIC ===
function toggleChat() {
    const panel = document.getElementById('chat-panel');
    const overlay = document.getElementById('chat-overlay');
    const badge = document.getElementById('unread-badge'); 
    
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
        overlay.classList.remove('hidden');
        if (badge) badge.classList.add('hidden'); 
        
        // 🧠 NEW: Remember the exact millisecond you opened the chat!
        localStorage.setItem('habibi_chat_last_read', Date.now());
    } else {
        overlay.classList.add('hidden');
    }
}

// === AUTHORIZED USERS LIST ===
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
function getAttempts(u) { return JSON.parse(localStorage.getItem(`attempts_${u}`) || '{}'); }

function saveAttempt(u, pid, qn, data) {
    const atts = getAttempts(u);
    if(!atts[pid]) atts[pid] = {};
    atts[pid][qn] = data;
    localStorage.setItem(`attempts_${u}`, JSON.stringify(atts));
    // SYNC ON SAVE
    setTimeout(syncScore, 500);
}

function tryLogin() {
    const u = document.getElementById('u-in').value.trim();
    const p = document.getElementById('p-in').value.trim();
    
    // NEW RESTRICTED LOGIN CHECK
    if(ALLOWED_USERS[u] && ALLOWED_USERS[u] === p) {
        setUser(u);
        const name = u.split('.')[0] || u;
        document.getElementById('welcome-msg').innerText = `Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        document.getElementById('login-layer').classList.add('hidden');
        document.getElementById('app-layer').classList.remove('hidden');
        setView('papers');
        syncScore(); // Sync on login
    } else { 
        alert("Invalid Username or Password."); 
    }
}

function doLogout() { localStorage.removeItem('user'); location.reload(); }

function setView(viewName) {
    ['papers', 'scorecard', 'workspace', 'formulae', 'definitions', 'leaderboard', 'tips'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if(el) el.classList.add('hidden');
    });
    document.getElementById(`view-${viewName}`).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(viewName.replace('leaderboard','🏆').replace('scorecard','scorecard'))) btn.classList.add('active');
    });
    if(viewName === 'scorecard') renderScorecard();
    if(viewName === 'leaderboard') loadLeaderboard();
}

function backToDash() { setView('papers'); }
function toggleInsert() { document.getElementById('insert-panel').classList.toggle('show'); }

function openPaper(pid) {
    const data = paperData[pid];
    const u = getUser();
    const attempts = getAttempts(u)[pid] || {};

    document.getElementById('insert-pdf').src = data.pdf;
    
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
            
            ${done ? `<div class="feedback-box">
                <h3>Score: ${att.score}/${q.m}</h3>
                ${aoHtml}
                <p><strong>Strengths:</strong> ${att.strengths}</p>
                <p><strong>Improvements:</strong> <span style="color:#d63031">${att.weaknesses}</span></p>
                <div class="model-ans-box"><strong>Model Answer:</strong><br>${att.modelAnswer}</div>
            </div>` : ''}
        </div>`;
    });
    document.getElementById('questions-container').innerHTML = qHtml;
    setView('workspace');
    
    // Init word counts
    data.questions.forEach(q => {
        const el = document.getElementById(`ans_${pid}_${q.n}`);
        if(el) updateWordCount(el, q.l);
    });
}

function updateWordCount(el, limitStr) {
    if(!limitStr) return;
    const count = el.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    // FIX: Using replace is safer than splitting by underscore since paper IDs contain underscores
    const wcId = el.id.replace('ans_', 'wc_');
    const wcEl = document.getElementById(wcId);
    
    if(wcEl) {
        const [min, max] = limitStr.split('-').map(Number);
        wcEl.innerText = `${count} words (${limitStr})`;
        
        if(count < min || count > max) {
            wcEl.classList.add('bad'); wcEl.classList.remove('good');
        } else {
            wcEl.classList.add('good'); wcEl.classList.remove('bad');
        }
    }
}

function toggleExpand(textAreaId, btnId) {
    const el = document.getElementById(textAreaId);
    const btn = document.getElementById(btnId);
    if(el) {
        el.classList.toggle('expanded');
        if(el.classList.contains('expanded')) {
            btn.innerText = "⤡ Shrink";
        } else {
            btn.innerText = "⤢ Expand";
        }
    }
}

function toggleInsertMaximize() {
    const el = document.getElementById('insert-panel');
    const btn = document.querySelector('.maximize-insert-btn');
    el.classList.toggle('fullscreen');
    
    if(el.classList.contains('fullscreen')) {
        btn.innerText = "⤡ Minimize";
    } else {
        btn.innerText = "⤢ Maximize";
    }
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
        saveAttempt(getUser(), pid, qn, {
            answer: ans,
            score: json.score,
            ao1: json.ao1, ao2: json.ao2, ao3: json.ao3, ao4: json.ao4,
            strengths: json.strengths,
            weaknesses: json.weaknesses,
            modelAnswer: json.model_answer
        });
        openPaper(pid);

    } catch(e) {
        console.error(e);
        alert("Error: Server not responding.");
        btn.innerText = "Retry";
        btn.disabled = false;
    }
}

// === ADMIN DELETE FUNCTION ===
async function deleteUser(name) {
    if(!confirm(`Are you sure you want to delete ${name} from the leaderboard?`)) return;
    try {
        const res = await fetch(`https://ultimate-exam-guide.onrender.com/delete_user?name=${name}`);
        if(res.ok) {
            alert(`Deleted ${name}`);
            loadLeaderboard(); 
        } else {
            alert("Failed to delete. Make sure app.py is updated.");
        }
    } catch(e) { console.error(e); alert("Connection error."); }
}

// === LEADERBOARD LOGIC ===
async function syncScore() {
    const u = getUser();
    if(!u) return;
    
    const atts = getAttempts(u);
    let totalScore = 0;
    let papersDone = 0;
    
    // Calculate total score locally
    Object.keys(atts).forEach(pid => {
        let hasScore = false;
        Object.values(atts[pid]).forEach(q => {
            if(q.score) {
                totalScore += q.score;
                hasScore = true;
            }
        });
        if(hasScore) papersDone++;
    });

    // Send to backend
    try {
        await fetch('https://ultimate-exam-guide.onrender.com/update_score', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: u,
                total_score: totalScore,
                papers_completed: papersDone
            })
        });
    } catch(e) { console.error("Sync failed", e); }
}

async function loadLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = "⏳ Fetching rankings...";
    
    try {
        const res = await fetch('https://ultimate-exam-guide.onrender.com/leaderboard');
        const data = await res.json();
        const isAdmin = (getUser() === 'admin');
        
        let html = `<table class="modern-table"><thead><tr><th>Rank</th><th>Student</th><th>Papers</th><th>Total Score</th>${isAdmin ? '<th>Action</th>' : ''}</tr></thead><tbody>`;
        
        data.forEach((entry, index) => {
            const name = entry[0];
            const stats = entry[1];
            let badge = '';
            if(index === 0) badge = '🥇';
            else if(index === 1) badge = '🥈';
            else if(index === 2) badge = '🥉';
            else badge = `#${index+1}`;
            
            let actionBtn = '';
            if(isAdmin) {
                actionBtn = `<button class="reset-icon-btn" style="padding:2px 8px; font-size:12px;" onclick="deleteUser('${name}')">❌</button>`;
            }
            
            html += `<tr>
                <td><span style="font-size:1.2rem; font-weight:700;">${badge}</span></td>
                <td style="font-weight:700; color:var(--text-dark);">${name}</td>
                <td>${stats.papers}</td>
                <td><span class="score-badge">${stats.score}</span></td>
                ${isAdmin ? `<td>${actionBtn}</td>` : ''}
            </tr>`;
        });
        
        html += `</tbody></table>`;
        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = `<p style="color:red; font-weight:600;">Failed to load leaderboard. Server might be sleeping.</p>`;
    }
}

function renderScorecard() {
    const u = getUser();
    const allAtts = getAttempts(u);
    let totalQ = 0, totalAns = 0, totalScore = 0, possibleScore = 0, papersStarted = 0;
    let rows = '';

    Object.keys(paperData).forEach(pid => {
        const pAtts = allAtts[pid] || {};
        const qs = paperData[pid].questions;
        const answeredCount = Object.keys(pAtts).length;
        if(answeredCount > 0) papersStarted++;

        let pScore = 0, pMax = 0;
        qs.forEach(q => {
            pMax += q.m;
            if(pAtts[q.n]) {
                pScore += (pAtts[q.n].score || 0);
                totalScore += (pAtts[q.n].score || 0);
                possibleScore += q.m;
            }
        });
        totalQ += qs.length;
        totalAns += answeredCount;

        const percent = (answeredCount / qs.length) * 100;

        rows += `<tr>
        <td><div style="font-weight:700;">${paperData[pid].title}</div><div style="font-size:0.8rem; color:#888;">${pid}</div></td>
        <td><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div> <span style="font-size:0.9rem; font-weight:600;">${answeredCount}/${qs.length}</span></td>
        <td><span class="score-badge">${pScore}/${pMax}</span></td>
        <td>${answeredCount > 0 ? `<button class="reset-icon-btn" onclick="resetPaper('${pid}')">Reset</button>` : '-'}</td>
        </tr>`;
    });

    const accuracy = possibleScore > 0 ? Math.round((totalScore/possibleScore)*100) : 0;

    document.getElementById('stats-overview').innerHTML = `
        <div class="stat-card"><span class="stat-value">${papersStarted}</span><span class="stat-label">Papers Started</span></div>
        <div class="stat-card"><span class="stat-value">${totalAns}</span><span class="stat-label">Questions Solved</span></div>
        <div class="stat-card"><span class="stat-value">${accuracy}%</span><span class="stat-label">Global Accuracy</span></div>
    `;

    document.getElementById('score-table-container').innerHTML = `<table class="modern-table"><thead><tr><th>Paper</th><th>Progress</th><th>Score</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table>`;
    
    // Auto-Sync score when viewing scorecard
    syncScore();
}

function resetPaper(pid) {
    if(confirm("Delete all answers for this paper?")) {
        const u = getUser();
        const atts = getAttempts(u);
        delete atts[pid];
        localStorage.setItem(`attempts_${u}`, JSON.stringify(atts));
        renderScorecard();
    }
}

function resetAll() {
    if(confirm("WIPE ALL DATA?")) { localStorage.clear(); location.reload(); }
}

if(getUser()) {
    const u = getUser();
    const name = u.split('.')[0] || u;
    document.getElementById('welcome-msg').innerText = `Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    document.getElementById('login-layer').classList.add('hidden');
    document.getElementById('app-layer').classList.remove('hidden');
    setView('papers');
    // Sync on auto-login
    setTimeout(syncScore, 1000);
}