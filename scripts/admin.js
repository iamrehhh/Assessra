import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove, update, push } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// === 1. AUTHENTICATION (CLIENT-SIDE LOCK) ===
const CURRENT_USER = localStorage.getItem('user');
if (CURRENT_USER !== 'Abdul.Rehan') {
    alert("⛔ ACCESS DENIED: Admins only.");
    window.location.href = 'index.html';
} else {
    document.getElementById('security-check').style.display = 'none';
    document.getElementById('admin-content').classList.remove('hidden');
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
loadUsers();
