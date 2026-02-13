// ==========================================
// STORAGE MANAGER (Fixed for Essay Papers)
// ==========================================

const StorageManager = {
    
    _save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    _get: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // --- SAVE MCQ STATE (Graded Automatically) ---
    saveMCQState: function(paperID, answers, submitted, score) {
        const key = `Econ_${paperID}`; 
        const data = {
            paperID: paperID,
            subject: 'Economics',
            paper: 'Paper 3 (MCQ)',
            type: 'MCQ', // Mark type
            answers: answers,
            submitted: submitted,
            score: score,
            timestamp: Date.now()
        };
        this._save(key, data);
    },

    getMCQState: function(paperID) {
        return this._get(`Econ_${paperID}`);
    },

  // --- SAVE ESSAY STATE ---
    savePaperState: function(paperID, subject, paperType) {
        const key = `${subject}_${paperID}`;
        
        // Only save if it's new (so we don't overwrite existing progress)
        if (!this._get(key)) {
            const data = {
                paperID: paperID,
                subject: subject,
                paper: paperType,
                type: 'Essay',
                status: 'Practiced', 
                submitted: true, 
                timestamp: Date.now(),
                score: null // IMPORTANT: No score for essays
            };
            this._save(key, data);
        }
    },

    // --- GET HISTORY ---
    getHistory: function() {
        const history = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('Econ_') || key.startsWith('Business_')) {
                const item = JSON.parse(localStorage.getItem(key));
                history.push(item);
            }
        }
        return history.sort((a, b) => b.timestamp - a.timestamp);
    },

    clearAll: function() {
        if(confirm("Are you sure? This will delete ALL progress.")) {
            localStorage.clear();
            location.reload();
        }
    }
};