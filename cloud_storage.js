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
        const path = `students/${safeUser}/papers/${paperId}/${qNum}`;
        await set(ref(db, path), data);
        console.log("Saved to Cloud:", path);
        
        // Update Total Score for Leaderboard
        CloudManager.updateLeaderboard(safeUser);
    },

    // 2. SAVE MCQ BATCH (For Paper 3)
    saveMCQBatch: async (user, paperId, allAnswers) => {
        if (!user) return;
        const safeUser = user.replace('.', '_');
        await set(ref(db, `students/${safeUser}/papers/${paperId}`), allAnswers);
        CloudManager.updateLeaderboard(safeUser);
    },

    // 3. GET ALL DATA
    getAllData: async (user) => {
        if (!user) return {};
        const safeUser = user.replace('.', '_');
        try {
            const snapshot = await get(child(ref(db), `students/${safeUser}`));
            return snapshot.exists() ? snapshot.val() : {};
        } catch (error) {
            console.error("Error fetching data", error);
            return {};
        }
    },

    // 4. UPDATE LEADERBOARD (STRICT CLASSIFICATION)
    updateLeaderboard: async (safeUser) => {
        const snapshot = await get(child(ref(db), `students/${safeUser}/papers`));
        if (snapshot.exists()) {
            const papers = snapshot.val();
            let totalScore = 0;
            let businessScore = 0;
            let econScore = 0;

            Object.keys(papers).forEach(pid => {
                const questions = papers[pid];
                let subject = 'business'; // Default to business

                // Check prefix
                if (pid.startsWith('econ_')) {
                    subject = 'economics';
                } else if (pid.startsWith('gp_')) {
                    subject = 'general'; // If you add General Paper later
                }

                // Sum up scores
                Object.values(questions).forEach(q => {
                    if (q.score) {
                        totalScore += q.score;
                        if (subject === 'business') businessScore += q.score;
                        else if (subject === 'economics') econScore += q.score;
                    }
                });
            });

            // Save to public leaderboard
            await update(ref(db, `leaderboard/${safeUser}`), {
                name: safeUser.replace('_', '.'),
                total: totalScore,
                business: businessScore,
                economics: econScore,
                last_active: Date.now()
            });
        }
    },

    // 5. GET GLOBAL LEADERBOARD
    getLeaderboard: async () => {
        const snapshot = await get(child(ref(db), `leaderboard`));
        return snapshot.exists() ? snapshot.val() : {};
    }
};