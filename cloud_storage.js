import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

window.CloudManager = {
    // 1. SAVE INDIVIDUAL ATTEMPT
    saveAttempt: async (user, paperId, qNum, data) => {
        if (!user) return;
        const safeUser = user.replace('.', '_');
        await set(ref(db, `students/${safeUser}/papers/${paperId}/${qNum}`), data);
        CloudManager.updateLeaderboard(safeUser);
    },

    // 2. SAVE MCQ BATCH (For Paper 3)
    saveMCQBatch: async (user, paperId, allAnswers) => {
        if (!user) return;
        const safeUser = user.replace('.', '_');
        await set(ref(db, `students/${safeUser}/papers/${paperId}`), allAnswers);
        CloudManager.updateLeaderboard(safeUser);
    },

    // 3. GET DATA
    getAllData: async (user) => {
        if (!user) return {};
        const safeUser = user.replace('.', '_');
        const snapshot = await get(child(ref(db), `students/${safeUser}`));
        return snapshot.exists() ? snapshot.val() : {};
    },

    // 4. UPDATE LEADERBOARD (THE FIX IS HERE)
    updateLeaderboard: async (safeUser) => {
        const snapshot = await get(child(ref(db), `students/${safeUser}/papers`));
        if (snapshot.exists()) {
            const papers = snapshot.val();
            let biz = 0, econ = 0;

            Object.keys(papers).forEach(pid => {
                let subject = '';

                // === STRICT CLASSIFICATION LOGIC ===
                if (pid.startsWith('econ_')) {
                    subject = 'economics';
                } else if (pid.startsWith('gp_')) {
                    subject = 'general';
                } else {
                    // If it doesn't start with 'econ', it's Business (e.g., '2024_mj_31')
                    subject = 'business';
                }

                // Sum up scores
                Object.values(papers[pid]).forEach(q => {
                    if (q.score) {
                        if (subject === 'business') biz += q.score;
                        else if (subject === 'economics') econ += q.score;
                    }
                });
            });

            // Save to public leaderboard
            await update(ref(db, `leaderboard/${safeUser}`), {
                name: safeUser.replace('_', '.'),
                business: biz,
                economics: econ,
                total: biz + econ
            });
        }
    },

    // 5. GET GLOBAL LEADERBOARD
    getLeaderboard: async () => {
        const snapshot = await get(child(ref(db), `leaderboard`));
        return snapshot.exists() ? snapshot.val() : {};
    }
};