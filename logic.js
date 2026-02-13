// === SIDE MENU & MULTI-SUBJECT LOGIC ===
function toggleSideMenu() {
    document.getElementById('side-menu').classList.toggle('active');
    document.getElementById('side-menu-overlay').classList.toggle('active');
}

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

function tryLogin() {
    const u = document.getElementById('u-in').value.trim();
    const p = document.getElementById('p-in').value.trim();
    if(ALLOWED_USERS[u] && ALLOWED_USERS[u] === p) {
        setUser(u);
        const name = u.split('.')[0] || u;
        document.getElementById('welcome-msg').innerText = `Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        document.getElementById('login-layer').classList.add('hidden');
        document.getElementById('app-layer').classList.remove('hidden');
        setView('papers');
    } else { alert("Invalid Username or Password."); }
}

function doLogout() { localStorage.removeItem('user'); location.reload(); }

function setView(viewName) {
    ['papers', 'scorecard', 'workspace', 'formulae', 'definitions', 'leaderboard', 'tips', 'score-display'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if(el) el.classList.add('hidden');
    });
    document.getElementById(`view-${viewName}`).classList.remove('hidden');
}

function backToDash() { setView('papers'); }
function toggleInsert() { document.getElementById('insert-panel').classList.toggle('show'); }

// === OPEN PAPER FUNCTION (CLOUD AWARE) ===
async function openPaper(pid) {
    const data = paperData[pid];
    document.getElementById('questions-container').innerHTML = `<div style="text-align:center; padding:50px; color:#888;">⏳ Fetching your answers...</div>`;

    const pdfFrame = document.getElementById('insert-pdf');
    if(pdfFrame && data.pdf) pdfFrame.src = data.pdf;
    
    const u = getUser();
    let attempts = {};
    
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

        // ⚠️ FIXED: Wait for cloud save before reloading
        await window.CloudManager.saveAttempt(getUser(), pid, qn, {
            answer: ans,
            score: json.score,
            ao1: json.ao1, ao2: json.ao2, ao3: json.ao3, ao4: json.ao4,
            strengths: json.strengths,
            weaknesses: json.weaknesses,
            modelAnswer: json.model_answer
        });
        
        await openPaper(pid); 

    } catch(e) {
        console.error(e);
        alert("Error: Server not responding or Save failed.");
        btn.innerText = "Retry";
        btn.disabled = false;
    }
}

// === NEW SCORECARD LOGIC (SUBSECTIONS) ===
function toggleScorecardPanel() {
    const panel = document.getElementById('scorecard-panel');
    document.getElementById('scorecard-overlay').classList.toggle('active');
    panel.classList.toggle('active');
    if(panel.classList.contains('active')) loadCloudScorecard();
}

async function loadCloudScorecard() {
    const u = getUser();
    if(!u) return;

    // Clear old lists
    document.getElementById('sc-bus-p3').innerHTML = '';
    document.getElementById('sc-bus-p4').innerHTML = '';
    document.getElementById('sc-econ-p3').innerHTML = '';
    document.getElementById('sc-econ-p4').innerHTML = '';

    const data = await window.CloudManager.getAllData(u);
    const papers = data.papers || {};

    Object.keys(papers).forEach(pid => {
        const pTitle = (window.paperData && window.paperData[pid]) ? window.paperData[pid].title : pid;
        const category = classifyPaper(pid); // Use the new classifier
        
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

function classifyPaper(pid) {
    // ⚠️ FIXED: Correctly classifies 'econ_' IDs
    if (pid.startsWith('econ_')) {
        if (pid.includes('31') || pid.includes('32') || pid.includes('33') || pid.includes('34')) return { subject: 'economics', paper: 'p3' };
        return { subject: 'economics', paper: 'p4' };
    }
    if (window.paperData && window.paperData[pid]) {
        if (pid.includes('41') || pid.includes('42') || pid.includes('43')) return { subject: 'business', paper: 'p4' };
        return { subject: 'business', paper: 'p3' };
    }
    return { subject: 'business', paper: 'p3' }; // Default fallback
}

// ⚠️ FIXED: Prevents "568 questions" glitch
async function renderPaperScore(pid) {
    toggleScorecardPanel(); 
    setView('score-display'); 
    
    const u = getUser();
    const data = await window.CloudManager.getAllData(u);
    const attempts = data.papers[pid] || {};
    
    // IF ESSAY PAPER
    if (paperData[pid]) {
        const pInfo = paperData[pid];
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
    // IF MCQ PAPER
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

// === LEADERBOARD LOGIC ===
function toggleLeaderboardPanel() {
    const panel = document.getElementById('leaderboard-panel');
    document.getElementById('leaderboard-overlay').classList.toggle('active');
    panel.classList.toggle('active');
    if(panel.classList.contains('active')) loadCloudLeaderboard();
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

if(getUser()) {
    const u = getUser();
    const name = u.split('.')[0] || u;
    document.getElementById('welcome-msg').innerText = `Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    document.getElementById('login-layer').classList.add('hidden');
    document.getElementById('app-layer').classList.remove('hidden');
    setView('papers');
}