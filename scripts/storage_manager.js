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
        if(data.essays) {
            Object.keys(data.essays).forEach(pid => {
                const subject = pid.includes('9609') || pid.includes('bus') ? 'business' : 'economics';
                Object.values(data.essays[pid]).forEach(q => {
                    if(q.score) scores[subject] += q.score;
                });
            });
        }
        
        // Calculate MCQ Scores
        if(data.mcq) {
            Object.keys(data.mcq).forEach(pid => {
                const session = data.mcq[pid];
                if(session.submitted && session.score) {
                    scores.economics += session.score; // Assuming MCQs are Econ for now
                }
            });
        }
        
        scores.total = scores.business + scores.economics;
        return scores;
    }
};