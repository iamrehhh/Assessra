// File: cloud_storage.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Your Firebase Configuration
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

// Make this globally available so logic.js can use it
window.CloudManager = {
    // 1. SAVE SCORE TO CLOUD
    saveAttempt: async (user, paperId, qNum, data) => {
        if (!user) return;
        const safeUser = user.replace('.', '_'); // Firebase keys cannot contain dots
        
        // Save the specific answer
        await set(ref(db, `students/${safeUser}/papers/${paperId}/${qNum}`), data);
        
        // Update the leaderboard stats immediately
        CloudManager.updateLeaderboard(safeUser);
    },

    // 2. FETCH ALL DATA FOR ONE USER (For Scorecard)
    getAllData: async (user) => {
        if (!user) return {};
        const safeUser = user.replace('.', '_');
        const snapshot = await get(child(ref(db), `students/${safeUser}`));
        return snapshot.exists() ? snapshot.val() : {};
    },

    // 3. UPDATE LEADERBOARD TOTALS
    updateLeaderboard: async (safeUser) => {
        const snapshot = await get(child(ref(db), `students/${safeUser}/papers`));
        if (snapshot.exists()) {
            const papers = snapshot.val();
            let biz = 0, econ = 0;

            // Calculate totals
            Object.keys(papers).forEach(pid => {
                const subject = (pid.includes('bus') || pid.includes('9609')) ? 'business' : 'economics';
                Object.values(papers[pid]).forEach(q => {
                    if (q.score) {
                        if (subject === 'business') biz += q.score;
                        else econ += q.score;
                    }
                });
            });

            // Push to public leaderboard
            await update(ref(db, `leaderboard/${safeUser}`), {
                name: safeUser.replace('_', '.'),
                business: biz,
                economics: econ,
                total: biz + econ
            });
        }
    },

    // 5. SPECIAL: SAVE ALL MCQ ANSWERS AT ONCE
    saveMCQBatch: async (user, paperId, allAnswers) => {
        if (!user) return;
        const safeUser = user.replace('.', '_');
        
        // Save the entire set of answers to the cloud
        await set(ref(db, `students/${safeUser}/papers/${paperId}`), allAnswers);
        
        // Update leaderboard immediately
        CloudManager.updateLeaderboard(safeUser);
        console.log("MCQ Batch Saved!");
    },

    // 4. GET GLOBAL LEADERBOARD
    getLeaderboard: async () => {
        const snapshot = await get(child(ref(db), `leaderboard`));
        return snapshot.exists() ? snapshot.val() : {};
    }
};