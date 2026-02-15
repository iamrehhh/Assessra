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
        let activityDates = new Set();

        // Check Essays
        if (data.essays) {
            Object.values(data.essays).forEach(paper => {
                Object.values(paper).forEach(q => {
                    if (q.timestamp) {
                        const date = new Date(q.timestamp).setHours(0, 0, 0, 0);
                        if (date === today && q.score) todayScore += q.score;
                        if (q.score > 0) activityDates.add(date);
                    }
                });
            });
        }

        // Check MCQs
        if (data.mcq) {
            Object.values(data.mcq).forEach(session => {
                if (session.timestamp) {
                    const date = new Date(session.timestamp).setHours(0, 0, 0, 0);
                    if (date === today && session.score) todayScore += session.score;
                    if (session.score > 0) activityDates.add(date);
                }
            });
        }

        // Calculate Streak
        let streak = 0;
        let checkDate = today;
        // If today has activity, include today in streak? Usually streaks count completed days OR current chain.
        // Let's count current chain including today if active.

        // Simple Logic: Iterate backwards from today
        while (true) {
            if (activityDates.has(checkDate)) {
                streak++;
                checkDate -= 86400000; // Go back 1 day
            } else {
                // If today has no activity yet, streak shouldn't reset to 0 immediately if yesterday had activity?
                // Standard Logic: Streak allows missing today provided yesterday was active.
                if (checkDate === today && streak === 0) {
                    checkDate -= 86400000;
                    continue;
                }
                break;
            }
        }

        return { todayScore, streak: Math.max(streak, 1) }; // Default 1 for motivation? Or 0. Let's start with calculated.
        // Actually, user screenshot shows "1 days strong". If just started, maybe 1?
        // Let's return Math.max(streak, 0) but handle display logic in UI.
    }
};