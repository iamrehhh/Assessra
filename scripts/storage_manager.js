// storage_manager.js

const StorageManager = {
    getUser: () => localStorage.getItem('user'),

    // === GENERIC SAVE/LOAD ===
    getData: (user) => JSON.parse(localStorage.getItem(`habibi_data_${user}`) || '{}'),
    saveData: (user, data) => localStorage.setItem(`habibi_data_${user}`, JSON.stringify(data)),

    // === ESSAY HANDLING ===
    saveEssay: (paperId, qNum, answerData) => {
        const user = StorageManager.getUser();
        if (!user) return;

        const data = StorageManager.getData(user);
        if (!data.essays) data.essays = {};
        if (!data.essays[paperId]) data.essays[paperId] = {};

        // Ensure answerData is object to store timestamp
        if (typeof answerData !== 'object') {
            // Should verify if this breaks existing strings, but based on inspection it seems to be object with score
            // If string (just answer text), wrap it?
            // Existing code uses q.score. So answerData MUST be object or have score property attached.
            // If answerData is just string, q.score would be undefined.
            // Let's assume object for now as per plan context.
            answerData = { answer: answerData };
        }

        answerData.timestamp = Date.now();

        data.essays[paperId][qNum] = answerData;
        StorageManager.saveData(user, data);
        console.log(`Saved Essay: ${paperId} Q${qNum}`);
    },

    getEssay: (paperId, qNum) => {
        const user = StorageManager.getUser();
        if (!user) return null;
        const data = StorageManager.getData(user);
        return data.essays?.[paperId]?.[qNum] || null;
    },

    // === MCQ HANDLING ===
    saveMCQState: (paperId, answersArray, isSubmitted, score) => {
        const user = StorageManager.getUser();
        if (!user) return;

        const data = StorageManager.getData(user);
        if (!data.mcq) data.mcq = {};

        data.mcq[paperId] = {
            answers: answersArray, // Array of selected letters ['A', 'C', null, 'D'...]
            submitted: isSubmitted,
            score: score,
            timestamp: Date.now()
        };
        StorageManager.saveData(user, data);
    },

    getMCQState: (paperId) => {
        const user = StorageManager.getUser();
        if (!user) return null;
        const data = StorageManager.getData(user);
        return data.mcq?.[paperId] || null;
    },

    // === SCORE SYNC CALCULATOR ===
    calculateSubjectScores: () => {
        const user = StorageManager.getUser();
        if (!user) return { business: 0, economics: 0, total: 0 };

        const data = StorageManager.getData(user);
        let scores = { business: 0, economics: 0, total: 0 };

        // Calculate Essay Scores
        if (data.essays) {
            Object.keys(data.essays).forEach(pid => {
                const subject = pid.includes('9609') || pid.includes('bus') ? 'business' : 'economics';
                Object.values(data.essays[pid]).forEach(q => {
                    if (q.score) scores[subject] += q.score;
                });
            });
        }

        // Calculate MCQ Scores
        if (data.mcq) {
            Object.keys(data.mcq).forEach(pid => {
                const session = data.mcq[pid];
                if (session.submitted && session.score) {
                    scores.economics += session.score; // Assuming MCQs are Econ for now
                }
            });
        }

        scores.total = scores.business + scores.economics;
        return scores;
    },

    // === DAILY PROGRESS & STREAK ===
    getDailyStats: () => {
        const user = StorageManager.getUser();
        if (!user) return { todayScore: 0, streak: 0 };

        const data = StorageManager.getData(user);
        const today = new Date().setHours(0, 0, 0, 0);
        let todayScore = 0;
        let dailyScores = {}; // Map date -> score

        // Helper to sum scores by date
        const aggregate = (source) => {
            if (!source) return;
            Object.values(source).forEach(item => {
                // Item could be a paper object (containing questions) or a session object
                if (item.timestamp && item.score) { // MCQ Session
                    const d = new Date(item.timestamp).setHours(0, 0, 0, 0);
                    dailyScores[d] = (dailyScores[d] || 0) + item.score;
                } else if (typeof item === 'object') { // Paper with questions
                    Object.values(item).forEach(q => {
                        if (q.timestamp && q.score) {
                            const d = new Date(q.timestamp).setHours(0, 0, 0, 0);
                            dailyScores[d] = (dailyScores[d] || 0) + q.score;
                        }
                    });
                }
            });
        };

        aggregate(data.essays);
        aggregate(data.mcq);

        todayScore = dailyScores[today] || 0;

        // Calculate Streak (Strict 50pt Threshold)
        let streak = 0;
        // Check Yesterday first
        let checkDate = today - 86400000;

        while (true) {
            const s = dailyScores[checkDate] || 0;
            if (s >= 50) {
                streak++;
                checkDate -= 86400000;
            } else {
                break; // Broken streak
            }
        }

        // Add Today if target met
        if (todayScore >= 50) streak++;

        return { todayScore, streak };
    }
};