// ui_manager.js

const UIManager = {
    currentContext: null, // 'leaderboard', 'scorecard', 'formulae', etc.

    // Toggle the generic Right-Sidebar
    toggleSelector: (active) => {
        const el = document.getElementById('subject-selector-panel');
        const overlay = document.getElementById('selector-overlay');
        if (active) {
            el.classList.add('active');
            overlay.classList.add('active');
        } else {
            el.classList.remove('active');
            overlay.classList.remove('active');
        }
    },

    // Triggered when user clicks "Formulae", "Leaderboard" on main nav
    openSubjectSelection: (context) => {
        UIManager.currentContext = context;
        document.getElementById('selector-title').innerText = `Select Subject for ${context.charAt(0).toUpperCase() + context.slice(1)}`;
        UIManager.toggleSelector(true);
    },

    // Triggered when user clicks "Business" inside the slider
    selectSubject: (subject) => {
        UIManager.toggleSelector(false); // Close slider
        const context = UIManager.currentContext;

        // Hide all views first
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

        if (context === 'leaderboard') {
            document.getElementById('view-leaderboard').classList.remove('hidden');
            loadLeaderboard(subject); // You need to update loadLeaderboard to accept subject
        } 
        else if (context === 'scorecard') {
            document.getElementById('view-scorecard').classList.remove('hidden');
            renderScorecard(subject);
        }
        else if (['formulae', 'definitions', 'tips'].includes(context)) {
            // Show the specific container, e.g., 'view-formulae-business'
            // You will need to wrap your existing HTML content in specific subject divs
            const viewId = `view-${context}`;
            document.getElementById(viewId).classList.remove('hidden');
            
            // Simple filter logic: Hide all subject sections, show specific one
            document.querySelectorAll(`.${context}-section`).forEach(el => el.classList.add('hidden'));
            document.querySelectorAll(`.${context}-section.${subject}`).forEach(el => el.classList.remove('hidden'));
        }
    }
};