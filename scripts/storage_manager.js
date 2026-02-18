// storage_manager.js

const StorageManager = {
    getUser: () => localStorage.getItem('user') || 'default_user',

    // === GENERIC SAVE/LOAD ===
    getData: (user) => {
        try {
            const raw = localStorage.getItem(`habibi_data_${user}`);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error("Data corruption detected for user:", user, e);
            return {}; // Fallback to empty object to prevent crash
        }
    },
    saveData: (user, data) => {
        try {
            localStorage.setItem(`habibi_data_${user}`, JSON.stringify(data));
        } catch (e) {
            console.error("Storage full or error saving data:", e);
            showToast("Warning: Storage full. Some progress may not be saved.");
        }
    },

    // === ESSAY HANDLING ===
    saveEssay: (paperId, qNum, answerData) => {
        const user = StorageManager.getUser();
        if (!user) return;

        const data = StorageManager.getData(user);
        if (!data.essays) data.essays = {};
        if (!data.essays[paperId]) data.essays[paperId] = {};

        // Ensure answerData is object to store timestamp
        if (typeof answerData !== 'object') {
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
            answers: answersArray || [], // Ensure array
            submitted: !!isSubmitted,
            score: typeof score === 'number' ? score : 0,
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

    // === AD-HOC DAILY POINTS (Vocab/Idioms) ===
    addDailyPoints: (type, amount) => {
        if (!amount || amount <= 0) return; // Ignore zero or negative

        const user = StorageManager.getUser();
        if (!user) return;
        const data = StorageManager.getData(user);

        if (!data.daily_progress) data.daily_progress = {};

        // Key by date to ensure separation
        const todayStr = new Date().toDateString(); // "Sun Feb 15 2026"
        const key = `${type}_${todayStr}`;

        const current = data.daily_progress[key] || { score: 0, timestamp: Date.now() };
        current.score += amount;
        current.timestamp = Date.now();

        data.daily_progress[key] = current;
        StorageManager.saveData(user, data);
        console.log(`Added ${amount} pts to ${type}`);
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
                if (data.essays[pid]) {
                    Object.values(data.essays[pid]).forEach(q => {
                        if (q && typeof q.score === 'number') scores[subject] += q.score;
                    });
                }
            });
        }

        // Calculate MCQ Scores
        if (data.mcq) {
            Object.keys(data.mcq).forEach(pid => {
                const session = data.mcq[pid];
                if (session && session.submitted && typeof session.score === 'number') {
                    // Refined Subject Detection for MCQs
                    const isBiz = pid.includes('9609') || pid.includes('bus');
                    scores[isBiz ? 'business' : 'economics'] += session.score;
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
                if (!item) return;

                // Item could be a paper object (containing questions) or a session object
                if (item.timestamp && item.score != null) { // MCQ Session or Daily Item
                    const score = Number(item.score);
                    if (!isNaN(score)) {
                        const d = new Date(item.timestamp).setHours(0, 0, 0, 0);
                        dailyScores[d] = (dailyScores[d] || 0) + score;
                    }
                } else if (typeof item === 'object') { // Paper with questions
                    Object.values(item).forEach(q => {
                        if (q && q.timestamp && q.score != null) {
                            const score = Number(q.score);
                            if (!isNaN(score)) {
                                const d = new Date(q.timestamp).setHours(0, 0, 0, 0);
                                dailyScores[d] = (dailyScores[d] || 0) + score;
                            }
                        }
                    });
                }
            });
        };

        aggregate(data.essays);
        aggregate(data.mcq);
        aggregate(data.daily_progress);

        todayScore = dailyScores[today] || 0;

        // Calculate Streak (Strict 50pt Threshold)
        let streak = 0;
        let checkDate = today - 86400000; // Start checking from yesterday

        // Safety break: Max 365 days lookback
        let paramCheck = 0;
        while (paramCheck < 365) {
            const s = dailyScores[checkDate] || 0;
            if (s >= 50) {
                streak++;
                checkDate -= 86400000;
            } else {
                break; // Broken streak
            }
            paramCheck++;
        }

        // Add Today to streak if target met
        if (todayScore >= 50) streak++;

        return { todayScore, streak };
    },
    // === NOTES HANDLING ===
    getNotes: () => {
        const user = StorageManager.getUser();
        if (!user) return [];
        try {
            const raw = localStorage.getItem(`habibi_notes_${user}`);
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    },

    saveNotes: (notes) => {
        const user = StorageManager.getUser();
        if (!user) return;
        localStorage.setItem(`habibi_notes_${user}`, JSON.stringify(notes));
    }
};

window.StorageManager = StorageManager;