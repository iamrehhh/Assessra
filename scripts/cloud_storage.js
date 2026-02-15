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
    // SAVE ATTEMPT
    saveAttempt: async (user, paperId, qNum, data) => {
        if (!user) return;
        const safeUser = user.replace('.', '_');
        await set(ref(db, `students/${safeUser}/papers/${paperId}/${qNum}`), data);
        CloudManager.updateLeaderboard(safeUser);
    },

    // SAVE MCQ BATCH
    saveMCQBatch: async (user, paperId, allAnswers) => {
        if (!user) return;
        const safeUser = user.replace('.', '_');
        await set(ref(db, `students/${safeUser}/papers/${paperId}`), allAnswers);
        CloudManager.updateLeaderboard(safeUser);
    },

    // GET DATA
    getAllData: async (user) => {
        if (!user) return {};
        const safeUser = user.replace('.', '_');
        try {
            const snapshot = await get(child(ref(db), `students/${safeUser}`));
            return snapshot.exists() ? snapshot.val() : {};
        } catch (error) { return {}; }
    },

    // UPDATE LEADERBOARD (STRICT FIX)
    updateLeaderboard: async (safeUser) => {
        const snapshot = await get(child(ref(db), `students/${safeUser}/papers`));
        if (snapshot.exists()) {
            const papers = snapshot.val();
            let biz = 0, econ = 0;

            Object.keys(papers).forEach(pid => {
                let isEcon = false;

                // 1. Check ID Prefix
                if (pid.startsWith('econ_')) isEcon = true;

                // 2. Double check 9708 vs 9609 patterns if prefix is missing
                else if (pid.includes('9708')) isEcon = true;

                // 3. Everything else defaults to Business (9609)

                // Sum scores
                Object.values(papers[pid]).forEach(q => {
                    if (q.score) {
                        if (isEcon) econ += q.score;
                        else biz += q.score;
                    }
                });
            });

            // Push clean data to leaderboard
            await update(ref(db, `leaderboard/${safeUser}`), {
                name: safeUser.replace('_', '.'),
                business: biz,
                economics: econ,
                total: biz + econ
            });
        }
    },

    // GET LEADERBOARD
    getLeaderboard: async () => {
        const snapshot = await get(child(ref(db), `leaderboard`));
        return snapshot.exists() ? snapshot.val() : {};
    },

    // === DYNAMIC CONTENT ===
    getPaper: async (pid) => {
        try {
            const snapshot = await get(child(ref(db), `content/papers/${pid}`));
            if (snapshot.exists()) {
                const p = snapshot.val();
                // Ensure structure matches local paperData
                // Local: { title: "", pdf: "", questions: [{n, m, t, l}] }
                // Cloud: { id, title, pdf, questions: [ or { } ] }

                // If questions is object/array, normalize
                return p;
            }
        } catch (e) { console.error(e); }
        return null;
    },

    getAllDynamicPapers: async () => {
        try {
            const snapshot = await get(child(ref(db), `content/papers`));
            return snapshot.exists() ? snapshot.val() : {};
        } catch (e) { return {}; }
    },

    // GENERIC PUBLIC FETCH
    getPublicData: async (path) => {
        try {
            const snapshot = await get(child(ref(db), path));
            return snapshot.exists() ? snapshot.val() : {};
        } catch (e) { return {}; }
    }
};