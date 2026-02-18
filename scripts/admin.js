// === 1. FIREBASE CONFIG (COMPAT) ===
const firebaseConfig = {
    apiKey: "AIzaSyDQdGnwbZq_V7Hm6V8IAVz7bnTt25H622s",
    authDomain: "habibi-studies-chat.firebaseapp.com",
    databaseURL: "https://habibi-studies-chat-default-rtdb.firebaseio.com",
    projectId: "habibi-studies-chat",
    storageBucket: "habibi-studies-chat.firebasestorage.app",
    messagingSenderId: "877923996625",
    appId: "1:877923996625:web:9e493c16c618c46a11c6f0"
};

// Initialize Firebase (Compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Helper Refs for Compat
const ref = (path) => db.ref(path);

// === 2. AUTHENTICATION ===
const CURRENT_USER = localStorage.getItem('user');
if (CURRENT_USER !== 'Abdul.Rehan') {
    showToast("⛔ ACCESS DENIED: Admins only.");
    window.location.href = 'index.html';
} else {
    // Show new Admin UI
    const secCheck = document.getElementById('security-check');
    if (secCheck) secCheck.style.display = 'none';

    document.getElementById('admin-sidebar').style.display = 'flex';
    document.getElementById('admin-main').style.display = 'block';
}

// === 3. USER MANAGEMENT ===
window.loadUsers = async function () { // Attach to window for global scope
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

    try {
        const snapshot = await db.ref('leaderboard').once('value');
        if (snapshot.exists()) {
            const data = snapshot.val();
            tbody.innerHTML = '';

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
};

window.deleteUser = async (name) => {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;
    const safeName = name.replace('.', '_');
    try {
        await db.ref(`leaderboard/${safeName}`).remove();
        showToast("User deleted.");
        loadUsers();
    } catch (e) { showToast("Error: " + e.message); }
};

window.adminLogout = () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};

// === 4. CONTENT MANAGEMENT ===
window.savePaperMeta = async () => {
    const pid = document.getElementById('p-id').value.trim();
    const title = document.getElementById('p-title').value.trim();
    const pdf = document.getElementById('p-pdf').value.trim();

    if (!pid || !title) return showToast("Paper ID and Title are required.");

    try {
        await db.ref(`content/papers/${pid}`).update({
            id: pid,
            title: title,
            pdf: pdf,
            addedAt: Date.now()
        });
        showToast("Metadata saved.");
    } catch (e) { showToast("Error: " + e.message); }
};

window.addQuestion = async () => {
    const pid = document.getElementById('q-pid').value.trim();
    const qNum = document.getElementById('q-num').value.trim();
    const marks = parseInt(document.getElementById('q-marks').value);
    const text = document.getElementById('q-text').value.trim();

    if (!pid || !qNum || !text) return showToast("All fields are required.");

    const newQ = { n: qNum, m: marks, q: text };

    try {
        const snapshot = await db.ref(`content/papers/${pid}/questions`).once('value');
        let questions = snapshot.exists() ? snapshot.val() : [];
        if (!Array.isArray(questions)) questions = []; // Safety

        const index = questions.findIndex(q => q.n === qNum);
        if (index > -1) {
            if (!confirm("Overwrite question?")) return;
            questions[index] = newQ;
        } else {
            questions.push(newQ);
        }

        await db.ref(`content/papers/${pid}/questions`).set(questions);
        showToast(`Question ${qNum} added.`);
        document.getElementById('q-text').value = '';
    } catch (e) { showToast("Error: " + e.message); }
};

// === 5. DICTIONARY ===
window.addVocab = async () => {
    const w = document.getElementById('v-word').value.trim();
    const d = document.getElementById('v-def').value.trim();
    if (!w || !d) return;
    try {
        await db.ref(`content/vocab`).push({ word: w, def: d });
        showToast("Vocab added.");
        document.getElementById('v-word').value = '';
        document.getElementById('v-def').value = '';
    } catch (e) { showToast(e.message); }
};

window.addSubject = async () => {
    const name = document.getElementById('sub-name').value.trim();
    const code = document.getElementById('sub-code').value.trim();
    if (!name || !code) return showToast("Required!");
    try {
        const sid = name.toLowerCase().replace(/\s+/g, '_');
        await db.ref(`content/subjects/${sid}`).set({ name: name, code: code, id: sid });
        showToast("Subject created.");
        loadSubjects_Enhanced();
    } catch (e) { showToast("Error: " + e.message); }
};

// === 6. BULK UPLOAD ===
window.toggleBulkHint = () => {
    const type = document.getElementById('bulk-type').value;
    const hint = document.getElementById('bulk-hint');
    if (type === 'papers') hint.innerText = 'Format: JSON Array [{"id":"...", "title":"...", "pdf":"...", "questions":[]}]';
    if (type === 'vocab') hint.innerText = 'Format: CSV (Word, Definition)';
    else hint.innerText = 'Format: JSON Array';
};

window.processBulkUpload = async () => {
    const type = document.getElementById('bulk-type').value;
    const raw = document.getElementById('bulk-data').value.trim();
    const targetSubject = document.getElementById('bulk-subject').value;

    if (!raw) return showToast("No data.");
    if (['formulae', 'definitions'].includes(type) && !targetSubject) return showToast("Select Subject!");

    if (!confirm(`Upload to ${targetSubject || 'General'}?`)) return;

    try {
        if (['vocab', 'idioms'].includes(type)) {
            // CSV
            const lines = raw.split('\n');
            let count = 0;
            const targetNode = type === 'vocab' ? 'content/vocab' : 'content/idioms';
            const updates = {};

            lines.forEach(line => {
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const newKey = db.ref(targetNode).push().key;
                    updates[`${targetNode}/${newKey}`] = {
                        word: parts[0].trim(),
                        def: parts.slice(1).join(',').trim()
                    };
                    count++;
                }
            });
            await db.ref().update(updates);
            showToast(`Uploaded ${count} items.`);
        }
        else {
            // JSON
            let data = JSON.parse(raw);
            if (!Array.isArray(data)) throw new Error("Must be JSON Array");

            if (type === 'papers') {
                const updates = {};
                data.forEach(p => {
                    if (p.id) {
                        if (targetSubject) p.subject = targetSubject;
                        updates[`content/papers/${p.id}`] = p;
                    }
                });
                await db.ref().update(updates);
            } else {
                // Formulae/Definitions
                const updates = {};
                data.forEach(item => {
                    item.subject = targetSubject;
                    const newKey = db.ref(`content/${type}`).push().key;
                    updates[`content/${type}/${newKey}`] = item;
                });
                await db.ref().update(updates);
            }
            showToast("Bulk upload complete.");
        }
        document.getElementById('bulk-data').value = '';
        loadContentManager();
    } catch (e) { showToast("Bulk Error: " + e.message); }
};

// === 7. MANAGER & VIEW ===
window.loadContentManager = async () => {
    const list = document.getElementById('content-manager-list');
    const type = document.getElementById('manage-type').value;
    list.innerHTML = 'Loading...';

    try {
        const snapshot = await db.ref(`content/${type}`).once('value');
        if (snapshot.exists()) {
            const data = snapshot.val();
            list.innerHTML = '';
            Object.keys(data).forEach(key => {
                const item = data[key];
                const div = document.createElement('div');
                div.style.cssText = 'display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee; align-items:center;';

                let label = key;
                if (item.name) label = `${item.name} (${item.code})`;
                else if (item.title) label = `${item.title}`;
                else if (item.word) label = item.word;
                else if (item.term) label = item.term;

                div.innerHTML = `<div>${label}</div> <button onclick="deleteContent('content/${type}/${key}')" class="delete-btn">Delete</button>`;
                list.appendChild(div);
            });
        } else { list.innerHTML = 'No content.'; }
    } catch (e) { list.innerHTML = 'Error.'; }
};

window.deleteContent = async (path) => {
    if (!confirm("Delete?")) return;
    try {
        await db.ref(path).remove();
        showToast("Deleted.");
        loadContentManager();
        if (path.includes('subjects')) loadSubjects_Enhanced();
    } catch (e) { showToast(e.message); }
};

window.switchView = (viewId, navEl) => {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');

    if (navEl) {
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        navEl.classList.add('active');
    }

    const titles = { 'dashboard': 'Dashboard', 'content': 'Content Library', 'users': 'User Management', 'settings': 'Settings' };
    document.getElementById('page-title').innerText = titles[viewId] || 'Admin';

    if (viewId === 'dashboard') loadDashboardStats();
    if (viewId === 'users') loadUsers();
    if (viewId === 'content') loadContentManager();
};

async function loadDashboardStats() {
    try {
        const userSnap = await db.ref('leaderboard').once('value');
        const paperSnap = await db.ref('content/papers').once('value');
        const subSnap = await db.ref('content/subjects').once('value');

        const uC = userSnap.exists() ? Object.keys(userSnap.val()).length : 0;
        const pC = paperSnap.exists() ? Object.keys(paperSnap.val()).length : 0;
        const sC = subSnap.exists() ? Object.keys(subSnap.val()).length : 0;

        document.getElementById('stat-users').innerText = uC;
        document.getElementById('stat-papers').innerText = pC;
        document.getElementById('stat-subs').innerText = sC;
    } catch (e) { console.error(e); }
}

window.toggleCreateForm = () => {
    const type = document.getElementById('create-type').value;
    const container = document.getElementById('create-form-container');
    // Simplified injection for brevity - logic same as before
    if (type === 'subject') {
        container.innerHTML = `<div class="form-group"><input id="sub-name" class="form-input" placeholder="Name"><input id="sub-code" class="form-input" placeholder="Code"></div><button class="btn-primary" onclick="addSubject()">Create</button>`;
    } else if (type === 'paper_meta') {
        container.innerHTML = `<button class="btn-primary" onclick="showToast('Use Bulk Upload for Papers for now or see old form!')">See Bulk Upload</button>`;
        // Re-add full form if needed, but bulk is better
    }
};

async function loadSubjects_Enhanced() {
    const div = document.getElementById('subjects-list');
    const select = document.getElementById('bulk-subject');
    try {
        const snapshot = await db.ref('content/subjects').once('value');
        if (snapshot.exists()) {
            const subs = snapshot.val();
            // Update Select
            if (select) {
                const opts = Object.values(subs).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
                select.innerHTML = `<option value="">None</option>` + opts;
            }
        }
    } catch (e) { }
}

// Init
loadUsers();
loadSubjects_Enhanced();
loadDashboardStats();
