// ==========================================
// STORAGE MANAGER (Fixed for Multi-Subject)
// ==========================================

const StorageManager = {
    
    // --- GENERIC SAVE (Handles Prefixes) ---
    _save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    _get: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // --- SAVE MCQ STATE (Economics) ---
    saveMCQState: function(paperID, answers, submitted, score) {
        // We force a prefix to prevent collision with Business papers
        const key = `Econ_${paperID}`; 
        const data = {
            paperID: paperID,
            subject: 'Economics', // Explicitly save subject
            paper: 'Paper 3 (MCQ)',
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

    // --- SAVE BUSINESS/ESSAY STATE ---
    savePaperState: function(paperID, subject, paperType) {
        const key = `${subject}_${paperID}`;
        const data = {
            paperID: paperID,
            subject: subject, // 'Business' or 'Economics'
            paper: paperType, // 'Paper 3' or 'Paper 4'
            status: 'Viewed',
            timestamp: Date.now(),
            score: 0 // Business papers might not have auto-grading
        };
        // Only save if it doesn't exist (to preserve original timestamp)
        if (!this._get(key)) {
            this._save(key, data);
        }
    },

    // --- GET HISTORY FOR SCORECARD ---
    getHistory: function() {
        const history = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Check for our known prefixes
            if (key.startsWith('Econ_') || key.startsWith('Business_')) {
                const item = JSON.parse(localStorage.getItem(key));
                history.push(item);
            }
        }
        return history.sort((a, b) => b.timestamp - a.timestamp);
    },

    // --- WIPE DATA ---
    clearAll: function() {
        if(confirm("Are you sure? This will delete ALL progress.")) {
            localStorage.clear();
            location.reload();
        }
    }
};