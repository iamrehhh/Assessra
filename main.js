// ==========================================
// MAIN CONTROLLER (GLUE LOGIC)
// ==========================================

// === LOGIN & AUTH ===
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

function tryLogin() {
    const u = document.getElementById('u-in').value.trim();
    const p = document.getElementById('p-in').value.trim();
    
    if(ALLOWED_USERS[u] && ALLOWED_USERS[u] === p) {
        localStorage.setItem('user', u); // Simple auth
        location.reload();
    } else { 
        alert("Invalid Username or Password."); 
    }
}

function doLogout() { 
    localStorage.removeItem('user'); 
    location.reload(); 
}

// === PAPER VIEWER LOGIC ===
function openPaper(pid) {
    // 1. Check if it is an Essay Paper (Business P3/P4, Econ P4, GP)
    // We check if the ID exists in our 'paperData' object
    if(paperData && paperData[pid]) {
        renderEssayPaper(pid);
        return;
    }

    // 2. If not in paperData, assume it's an MCQ Paper (Econ P3)
    // We try to call the MCQ engine
    if(typeof startMCQTest === 'function') {
        startMCQTest(pid);
    } else {
        alert("Paper Data Not Found! (If this is MCQ, ensure economics_p3.js is loaded)");
    }
}

// === ESSAY RENDERER ===
function renderEssayPaper(pid) {
    const data = paperData[pid];
    const u = StorageManager.getUser();
    
    // Load saved answers from StorageManager
    const savedEssays = StorageManager.getData(u).essays?.[pid] || {};

    document.getElementById('insert-pdf').src = data.pdf;
    
    let qHtml = `<h2 style="margin-bottom:20px; color:var(--lime-dark);">${data.title}</h2>`;
    
    data.questions.forEach(q => {
        const att = savedEssays[q.n] || {};
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
    
    // Switch to Workspace View
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    // Ensure workspace view is visible (handling ID variations)
    const ws = document.getElementById('view-workspace');
    if(ws) ws.classList.remove('hidden');
    else {
        // Fallback if ID is different in HTML
        document.getElementById('app-layer').querySelector('.workspace').parentNode.classList.remove('hidden');
    }
    
    // Init word counts
    data.questions.forEach(q => {
        const el = document.getElementById(`ans_${pid}_${q.n}`);
        if(el) updateWordCount(el, q.l);
    });
}

// === ESSAY SUBMISSION ===
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
        
        // SAVE USING STORAGE MANAGER
        StorageManager.saveEssay(pid, qn, {
            answer: ans,
            score: json.score,
            ao1: json.ao1, ao2: json.ao2, ao3: json.ao3, ao4: json.ao4,
            strengths: json.strengths,
            weaknesses: json.weaknesses,
            modelAnswer: json.model_answer
        });
        
        // Reload to show feedback
        openPaper(pid);

    } catch(e) {
        console.error(e);
        alert("Error: Server not responding.");
        btn.innerText = "Retry";
        btn.disabled = false;
    }
}

// === UTILITIES ===
function updateWordCount(el, limitStr) {
    if(!limitStr) return;
    const count = el.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    // Fix ID replacement
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
        btn.innerText = el.classList.contains('expanded') ? "⤡ Shrink" : "⤢ Expand";
    }
}

function backToDash() { 
    // Hide workspace
    document.getElementById('view-workspace').classList.add('hidden');
    // Show Papers view
    document.getElementById('view-papers').classList.remove('hidden');
}

function toggleInsert() { document.getElementById('insert-panel').classList.toggle('show'); }

function toggleInsertMaximize() {
    const el = document.getElementById('insert-panel');
    const btn = document.querySelector('.maximize-insert-btn');
    el.classList.toggle('fullscreen');
    btn.innerText = el.classList.contains('fullscreen') ? "⤡ Minimize" : "⤢ Maximize";
}

// === SCORECARD RENDERER ===
function renderScorecard(subjectFilter = null) {
    const u = StorageManager.getUser();
    const data = StorageManager.getData(u);
    const essays = data.essays || {};
    
    let rows = '';
    
    // Combine all Essay Papers
    const allPaperIDs = Object.keys(paperData || {});
    
    // Helper to check filter
    const checkFilter = (pid) => {
        let isBusiness = pid.includes('9609') || pid.includes('bus');
        let isEcon = pid.includes('9708') || pid.includes('econ');
        let isGP = pid.includes('8021') || pid.includes('gp');

        if(subjectFilter === 'business' && !isBusiness) return false;
        if(subjectFilter === 'economics' && !isEcon) return false;
        if(subjectFilter === 'general' && !isGP) return false;
        return true;
    };

    allPaperIDs.forEach(pid => {
        if(!checkFilter(pid)) return;

        const pEssays = essays[pid] || {};
        const qs = paperData[pid].questions || [];
        
        let score = 0;
        let max = 0;
        let attempted = 0;

        qs.forEach(q => {
            max += q.m;
            if(pEssays[q.n]) {
                score += (pEssays[q.n].score || 0);
                attempted++;
            }
        });

        if(attempted > 0) {
            const percent = Math.round((score/max)*100);
            rows += `<tr>
                <td><strong>${paperData[pid].title}</strong><br><small>${pid}</small></td>
                <td>${attempted}/${qs.length}</td>
                <td><span class="score-badge">${score}/${max} (${percent}%)</span></td>
                <td><button class="reset-icon-btn" onclick="resetPaper('${pid}')">Reset</button></td>
            </tr>`;
        }
    });

    // ADD MCQ PAPERS (From StorageManager)
    const mcqData = data.mcq || {};
    Object.keys(mcqData).forEach(pid => {
        if(!checkFilter(pid)) return; // Assuming ID contains 'econ'
        
        const session = mcqData[pid];
        if(session.submitted) {
            const percent = Math.round((session.score/30)*100);
            rows += `<tr>
                <td><strong>MCQ: ${pid}</strong><br><small>MCQ</small></td>
                <td>30/30</td>
                <td><span class="score-badge">${session.score}/30 (${percent}%)</span></td>
                <td><button class="reset-icon-btn" onclick="resetPaper('${pid}', true)">Reset</button></td>
            </tr>`;
        }
    });

    document.getElementById('score-table-container').innerHTML = 
        `<table class="modern-table"><thead><tr><th>Paper</th><th>Progress</th><th>Score</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function resetPaper(pid, isMCQ = false) {
    if(confirm("Delete all answers for this paper? This cannot be undone.")) {
        const u = StorageManager.getUser();
        const data = StorageManager.getData(u);
        
        if(isMCQ) {
            if(data.mcq) delete data.mcq[pid];
        } else {
            if(data.essays) delete data.essays[pid];
        }
        
        StorageManager.saveData(u, data);
        renderScorecard(UIManager.currentContext === 'scorecard' ? 'business' : null); // Refresh
    }
}

// === LEADERBOARD FETCHER ===
async function loadLeaderboard(subjectFilter = null) {
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = "⏳ Fetching rankings...";
    
    try {
        const res = await fetch('https://ultimate-exam-guide.onrender.com/leaderboard');
        const data = await res.json();
        
        let html = `<table class="modern-table"><thead><tr><th>Rank</th><th>Student</th><th>Papers</th><th>Total Score</th></tr></thead><tbody>`;
        
        data.forEach((entry, index) => {
            const name = entry[0];
            const stats = entry[1];
            let badge = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : `#${index+1}`));
            
            html += `<tr>
                <td><span style="font-size:1.2rem; font-weight:700;">${badge}</span></td>
                <td style="font-weight:700;">${name}</td>
                <td>${stats.papers}</td>
                <td><span class="score-badge">${stats.score}</span></td>
            </tr>`;
        });
        
        html += `</tbody></table>`;
        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = `<p style="color:red;">Leaderboard offline.</p>`;
    }
}
// ==========================================
// 🟢 RESTORED SIDEBAR LOGIC
// ==========================================

function toggleSideMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('side-menu-overlay');
    if(menu && overlay) {
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function toggleSubject(subId) {
    const content = document.getElementById(subId);
    if(content) {
        content.classList.toggle('expanded');
        // Rotate arrow if exists
        const btn = content.previousElementSibling;
        const arrow = btn.querySelector('span');
        if(arrow) arrow.innerText = content.classList.contains('expanded') ? '▲' : '▼';
    }
}

function switchPaperView(targetViewId) {
    // 1. Hide ALL paper containers
    document.querySelectorAll('.subject-container').forEach(el => el.classList.add('hidden'));
    
    // 2. Show the specific one clicked (e.g., 'container-bus-p3')
    const target = document.getElementById(`container-${targetViewId}`);
    if(target) target.classList.remove('hidden');
    else console.error(`Container not found: container-${targetViewId}`);
    
    // 3. Highlight the active link in the menu
    document.querySelectorAll('.paper-link').forEach(el => el.classList.remove('active'));
    const link = document.getElementById(`link-${targetViewId}`);
    if(link) link.classList.add('active');
    
    // 4. Close the side menu and ensure we are on the Papers view
    toggleSideMenu();
    setView('papers');
}