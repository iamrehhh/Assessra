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

    // --- SAVE ESSAY STATE (Mark as Viewed/Practiced) ---
    savePaperState: function(paperID, subject, paperType) {
        const key = `${subject}_${paperID}`;
        
        // Only save if it's new (don't overwrite if they did self-marking before)
        if (!this._get(key)) {
            const data = {
                paperID: paperID,
                subject: subject,
                paper: paperType,
                type: 'Essay', // Mark type
                status: 'Practiced', // Show this instead of score
                submitted: true, // Counts in stats
                timestamp: Date.now(),
                score: null // Null means "No Score Available"
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