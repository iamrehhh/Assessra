import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove, update, push } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// === 1. AUTHENTICATION (CLIENT-SIDE LOCK) ===
const CURRENT_USER = localStorage.getItem('user');
if (CURRENT_USER !== 'Abdul.Rehan') {
    alert("⛔ ACCESS DENIED: Admins only.");
    window.location.href = 'index.html';
} else {
    // Show new Admin UI
    const secCheck = document.getElementById('security-check');
    if (secCheck) secCheck.style.display = 'none';

    document.getElementById('admin-sidebar').style.display = 'flex';
    document.getElementById('admin-main').style.display = 'block';
}

// === 2. FIREBASE CONFIG ===
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

// === 3. USER MANAGEMENT ===
async function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

    try {
        const snapshot = await get(child(ref(db), 'leaderboard'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            tbody.innerHTML = ''; // Clear loading

            // Sort by total score descending
            const sortedUsers = Object.values(data).sort((a, b) => (b.total || 0) - (a.total || 0));

            sortedUsers.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.total || 0}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteUser('${user.name}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="3">No users found.</td></tr>';
        }
    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="3" style="color:red;">Error loading users.</td></tr>';
    }
}

// Global scope for HTML onclick access
window.deleteUser = async (name) => {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;

    const safeName = name.replace('.', '_');
    try {
        // Delete from Leaderboard
        await remove(ref(db, `leaderboard/${safeName}`));
        // Optional: Delete from detailed records (students node)
        // await remove(ref(db, `students/${safeName}`)); 

        alert("User deleted.");
        loadUsers(); // Refresh
    } catch (e) {
        alert("Error deleting user: " + e.message);
    }
};

window.adminLogout = () => {
    localStorage.removeItem('user'); // Or just redirect
    window.location.href = 'index.html';
};

// === 4. CONTENT MANAGEMENT (PAPERS) ===
window.savePaperMeta = async () => {
    const pid = document.getElementById('p-id').value.trim();
    const title = document.getElementById('p-title').value.trim();
    const pdf = document.getElementById('p-pdf').value.trim();

    if (!pid || !title) return alert("Paper ID and Title are required.");

    try {
        await update(ref(db, `content/papers/${pid}`), {
            id: pid,
            title: title,
            pdf: pdf,
            addedAt: Date.now()
        });
        alert("Paper metadata saved! Now add questions.");
    } catch (e) {
        alert("Error: " + e.message);
    }
};

window.addQuestion = async () => {
    const pid = document.getElementById('q-pid').value.trim();
    const qNum = document.getElementById('q-num').value.trim();
    const marks = parseInt(document.getElementById('q-marks').value);
    const text = document.getElementById('q-text').value.trim();

    if (!pid || !qNum || !text) return alert("All fields are required.");

    try {
        // We use a list for questions or an object keyed by Question Number?
        // Logic.js usually expects an array loop. Let's start with an object keyed by 'n' for uniqueness then convert if needed.
        // Actually best to push to a 'questions' array node.

        // Let's create a question object structure that matches existing data
        const newQ = {
            n: qNum,
            m: marks,
            q: text,
            // default case study? Maybe allow adding specific case study content later
        };

        // We will store it in `content/papers/{pid}/questions` as a list
        const snapshot = await get(child(ref(db), `content/papers/${pid}/questions`));
        let questions = [];
        if (snapshot.exists()) {
            questions = snapshot.val();
        }

        // Check duplicate
        const exists = questions.find(q => q.n === qNum);
        if (exists) {
            if (!confirm("Question number exists. Overwrite?")) return;
            // Update existing
            const index = questions.findIndex(q => q.n === qNum);
            questions[index] = newQ;
        } else {
            questions.push(newQ);
        }

        await set(ref(db, `content/papers/${pid}/questions`), questions);
        alert(`Question ${qNum} added to ${pid}.`);

        // Clear inputs
        document.getElementById('q-num').value = '';
        document.getElementById('q-text').value = '';
    } catch (e) {
        alert("Error: " + e.message);
    }
};

// === 5. DICTIONARY MANAGEMENT ===
// (Placeholder: Logic.js also needs update to read from Cloud Vocab)
window.addVocab = async () => {
    const w = document.getElementById('v-word').value.trim();
    const d = document.getElementById('v-def').value.trim();
    if (!w || !d) return;

    try {
        await push(ref(db, `content/vocab`), { word: w, def: d });
        alert("Vocab added.");
        document.getElementById('v-word').value = '';
        document.getElementById('v-def').value = '';
    } catch (e) { alert(e.message); }
};

window.addIdiom = async () => {
    const w = document.getElementById('i-word').value.trim();
    const d = document.getElementById('i-def').value.trim();
    if (!w || !d) return;

    try {
        await push(ref(db, `content/idioms`), { word: w, def: d });
        alert("Idiom added.");
        document.getElementById('i-word').value = '';
        document.getElementById('i-def').value = '';
    } catch (e) { alert(e.message); }
};

// Initialize
// === 6. SUBJECT MANAGEMENT ===
window.addSubject = async () => {
    const name = document.getElementById('sub-name').value.trim();
    const code = document.getElementById('sub-code').value.trim();
    if (!name || !code) return alert("Name and Code required!");

    try {
        const sid = name.toLowerCase().replace(/\s+/g, '_');
        await set(ref(db, `content/subjects/${sid}`), {
            name: name,
            code: code,
            id: sid
        });
        alert(`Subject '${name}' created!`);
        document.getElementById('sub-name').value = '';
        document.getElementById('sub-code').value = '';
        loadSubjects();
    } catch (e) { alert("Error: " + e.message); }
};

async function loadSubjects() {
    const div = document.getElementById('subjects-list');
    if (!div) return;
    div.innerHTML = 'Loading subjects...';

    try {
        const snapshot = await get(child(ref(db), 'content/subjects'));
        if (snapshot.exists()) {
            const subs = snapshot.val();
            div.innerHTML = Object.values(subs).map(s =>
                `<span style="background:#fff; padding:5px 10px; border-radius:5px; margin-right:5px; border:1px solid #ddd;">
                    ${s.name} (${s.code})
                </span>`
            ).join('');
        } else {
            div.innerHTML = 'No custom subjects yet.';
        }
    } catch (e) { }
}

// === 7. BULK OPERATIONS & TARGETED UPLOAD ===
window.toggleBulkHint = () => {
    const type = document.getElementById('bulk-type').value;
    const hint = document.getElementById('bulk-hint');
    if (type === 'papers') hint.innerText = 'Format: JSON Array of Objects [{"id":"...", "title":"...", "pdf":"...", "questions":[]}]';
    if (type === 'vocab') hint.innerText = 'Format: CSV (Word, Definition) - One per line';
    if (type === 'idioms') hint.innerText = 'Format: CSV (Idiom, Meaning) - One per line';
    if (type === 'formulae') hint.innerText = 'Format: JSON Array [{"title":"...", "body":"..."}] (Subject auto-tagged)';
    if (type === 'definitions') hint.innerText = 'Format: JSON Array [{"term":"...", "desc":"..."}] (Subject auto-tagged)';
};

window.processBulkUpload = async () => {
    const type = document.getElementById('bulk-type').value;
    const raw = document.getElementById('bulk-data').value.trim();
    const targetSubject = document.getElementById('bulk-subject').value;

    if (!raw) return alert("No data to process.");

    // Validation: Require subject for subject-specific content
    if (['formulae', 'definitions'].includes(type) && !targetSubject) {
        return alert("Please select a Target Subject for Formulae/Definitions.");
    }

    if (!confirm(`Ready to upload bulk ${type} to '${targetSubject || 'General'}'?`)) return;

    try {
        // A. JSON HANDLING
        if (['papers', 'formulae', 'definitions'].includes(type)) {
            let data;
            try { data = JSON.parse(raw); }
            catch (e) { return alert("Invalid JSON! Please check format."); }

            if (!Array.isArray(data)) return alert("Data must be a JSON Array [ ... ]");

            if (type === 'papers') {
                for (const p of data) {
                    if (p.id) {
                        // Tag with subject if selected
                        if (targetSubject && !p.id.includes(targetSubject)) {
                            // Optional: Auto-append subject to ID or just add metadata?
                            // Let's just add metadata 'subject' property
                            p.subject = targetSubject;
                        }
                        await set(ref(db, `content/papers/${p.id}`), p);
                    }
                }
            }
            if (type === 'formulae' || type === 'definitions') {
                // Push each item with subject tag
                for (const item of data) {
                    item.subject = targetSubject; // FORCE tag
                    await push(ref(db, `content/${type}`), item);
                }
            }
        }

        // B. CSV HANDLING
        if (['vocab', 'idioms'].includes(type)) {
            const lines = raw.split('\n');
            let count = 0;
            const targetNode = type === 'vocab' ? 'content/vocab' : 'content/idioms';

            for (const line of lines) {
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const word = parts[0].trim();
                    const def = parts.slice(1).join(',').trim();
                    if (word && def) {
                        await push(ref(db, targetNode), { word, def });
                        count++;
                    }
                }
            }
            alert(`Uploaded ${count} items to ${type}!`);
        } else {
            alert(`Bulk ${type} upload complete!`);
        }

        document.getElementById('bulk-data').value = '';
        loadContentManager(); // Refresh list

    } catch (e) {
        alert("Bulk Error: " + e.message);
        console.error(e);
    }
};

// === 8. CONTENT MANAGER (VIEW & DELETE) ===
window.loadContentManager = async () => {
    const list = document.getElementById('content-manager-list');
    const type = document.getElementById('manage-type').value; // papers, subjects, formulae, ...

    list.innerHTML = 'Loading...';

    try {
        const snapshot = await get(child(ref(db), `content/${type}`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            list.innerHTML = '';

            Object.keys(data).forEach(key => {
                const item = data[key];
                const div = document.createElement('div');
                div.style.cssText = 'display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee; align-items:center;';

                let label = key;
                if (item.name) label = `${item.name} (${item.code})`; // Subject
                else if (item.title) label = `${item.title} <span style="font-size:0.8em; color:#888;">${item.subject || ''}</span>`; // Paper/Formula
                else if (item.term) label = `${item.term} <span style="font-size:0.8em; color:#888;">${item.subject || ''}</span>`; // Def
                else if (item.word) label = item.word; // Vocab/Idiom

                div.innerHTML = `
                    <div>${label}</div>
                    <button onclick="deleteContent('content/${type}/${key}')" class="delete-btn">Delete</button>
                `;
                list.appendChild(div);
            });
        } else {
            list.innerHTML = '<div style="padding:20px; text-align:center;">No content found.</div>';
        }
    } catch (e) {
        list.innerHTML = '<div style="color:red;">Error loading content.</div>';
    }
};

window.deleteContent = async (path) => {
    if (!confirm("Are you sure you want to delete this? This cannot be undone.")) return;
    try {
        await remove(ref(db, path));
        alert("Deleted.");
        loadContentManager(); // Refresh
        // If subject deleted, refresh subjects list too
        if (path.includes('subjects')) loadSubjects_Enhanced();
    } catch (e) { alert("Error: " + e.message); }
}

// === 1. NAVIGATION & VIEW LOGIC ===
window.switchView = (viewId, navEl) => {
    // 1. Hide all views
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    // 2. Show target
    document.getElementById(`view-${viewId}`).classList.add('active');

    // 3. Update Sidebar
    if (navEl) {
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        navEl.classList.add('active');
    }

    // 4. Dynamic Title
    const titles = {
        'dashboard': 'Dashboard',
        'content': 'Content Library',
        'users': 'User Management',
        'settings': 'Settings'
    };
    document.getElementById('page-title').innerText = titles[viewId] || 'Admin';

    // 5. Load Data on Switch
    if (viewId === 'dashboard') loadDashboardStats();
    if (viewId === 'users') loadUsers();
    if (viewId === 'content') loadContentManager();
};

// === 2. DASHBOARD STATS ===
async function loadDashboardStats() {
    try {
        // Users
        const userSnap = await get(child(ref(db), 'leaderboard'));
        const userCount = userSnap.exists() ? Object.keys(userSnap.val()).length : 0;

        // Papers (Hardcoded + Dynamic)
        // Hard to count hardcoded ones easily without importing paperData. 
        // Let's count dynamic ones for now or fetch all.
        const paperSnap = await get(child(ref(db), 'content/papers'));
        const paperCount = paperSnap.exists() ? Object.keys(paperSnap.val()).length : 0;

        // Subjects
        const subSnap = await get(child(ref(db), 'content/subjects'));
        const subCount = subSnap.exists() ? Object.keys(subSnap.val()).length : 0; // +5 standard

        // Animate Numbers
        animateValue("stat-users", 0, userCount, 1000);
        animateValue("stat-papers", 0, paperCount + 50, 1000); // +50 estimated base
        animateValue("stat-subs", 0, subCount + 5, 1000);

    } catch (e) { console.error("Stats Error", e); }
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// === 3. MANUAL CREATE LOGIC ===
window.toggleCreateForm = () => {
    const type = document.getElementById('create-type').value;
    const container = document.getElementById('create-form-container');

    if (type === 'subject') {
        container.innerHTML = `
            <div class="form-group"><label class="form-label">Name</label><input id="sub-name" class="form-input" placeholder="e.g. Physics"></div>
            <div class="form-group"><label class="form-label">Code</label><input id="sub-code" class="form-input" placeholder="e.g. 9702"></div>
            <button class="btn-primary" onclick="addSubject()">Create Subject</button>
        `;
    }
    else if (type === 'paper_meta') {
        container.innerHTML = `
            <div class="form-group"><label class="form-label">Paper ID</label><input id="p-id" class="form-input" placeholder="yyyy_sub_pp"></div>
            <div class="form-group"><label class="form-label">Title</label><input id="p-title" class="form-input"></div>
            <div class="form-group"><label class="form-label">PDF Link</label><input id="p-pdf" class="form-input"></div>
            <button class="btn-primary" onclick="savePaperMeta()">Save Metadata</button>
            <hr style="margin:20px 0; border:0; border-top:1px solid #eee;">
            <h3>Add Question</h3>
             <div class="form-group"><label class="form-label">Target Paper ID</label><input id="q-pid" class="form-input"></div>
             <div class="form-group"><label class="form-label">Q No.</label><input id="q-num" class="form-input"></div>
             <div class="form-group"><label class="form-label">Marks</label><input id="q-marks" class="form-input" type="number"></div>
             <div class="form-group"><label class="form-label">Text</label><textarea id="q-text" class="form-input" rows="3"></textarea></div>
             <button class="btn-primary" onclick="addQuestion()">Add Question</button>
        `;
    }
    else if (type === 'vocab') {
        container.innerHTML = `
             <div class="form-group"><label class="form-label">Word</label><input id="v-word" class="form-input"></div>
             <div class="form-group"><label class="form-label">Def</label><input id="v-def" class="form-input"></div>
             <button class="btn-primary" onclick="addVocab()">Add Word</button>
        `;
    }
};

// Initial Load
document.getElementById('security-check').style.display = 'none';
document.getElementById('admin-sidebar').style.display = 'flex';
document.getElementById('admin-main').style.display = 'block';

// Start at Dashboard
loadDashboardStats();
loadSubjects_Enhanced(); // Pre-load dropdowns
