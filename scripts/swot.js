
// scripts/swot.js

const SWOTManager = {
    // === CONFIGURATION ===
    DAILY_LIMIT: 2,

    // === STATE ===
    currentSubject: null,
    currentPaper: null,

    // === INITIALIZATION ===
    init: () => {
        // Any setup if needed
    },

    // === USAGE LIMIT LOGIC ===
    checkLimit: () => {
        const today = new Date().toDateString();
        const key = `swot_usage_${today}`;
        const count = parseInt(localStorage.getItem(key) || '0');
        return count < SWOTManager.DAILY_LIMIT;
    },

    incrementLimit: () => {
        const today = new Date().toDateString();
        const key = `swot_usage_${today}`;
        const count = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, count + 1);
    },

    getRemaining: () => {
        const today = new Date().toDateString();
        const key = `swot_usage_${today}`;
        const count = parseInt(localStorage.getItem(key) || '0');
        return Math.max(0, SWOTManager.DAILY_LIMIT - count);
    },

    // === UI FLOW ===
    openModal: () => {
        const overlay = document.getElementById('swot-overlay');
        const modal = document.getElementById('swot-modal');

        if (!overlay || !modal) return;

        // Reset State
        document.getElementById('swot-stage-subjects').classList.remove('hidden');
        document.getElementById('swot-stage-papers').classList.add('hidden');
        document.getElementById('swot-stage-result').classList.add('hidden');
        document.getElementById('swot-stage-loading').classList.add('hidden');

        overlay.classList.add('active');
        modal.classList.add('active');

        // Update Usage Display
        document.getElementById('swot-usage-counter').innerText = `${SWOTManager.getRemaining()} uses left today`;
    },

    closeModal: () => {
        const overlay = document.getElementById('swot-overlay');
        const modal = document.getElementById('swot-modal');
        if (overlay) overlay.classList.remove('active');
        if (modal) modal.classList.remove('active');
    },

    selectSubject: (subject) => {
        SWOTManager.currentSubject = subject;

        // Transition UI
        document.getElementById('swot-stage-subjects').classList.add('hidden');
        document.getElementById('swot-stage-papers').classList.remove('hidden');

        // Render Paper Options based on Subject
        const paperContainer = document.getElementById('swot-paper-options');
        paperContainer.innerHTML = '';

        let papers = [];
        if (subject === 'business') papers = ['Paper 3', 'Paper 4'];
        else if (subject === 'economics') papers = ['Paper 3', 'Paper 4']; // Add P3/P4 for Econ
        else if (subject === 'general') papers = ['Paper 1', 'Paper 2'];

        papers.forEach(p => {
            const btn = document.createElement('div');
            btn.className = 'liquid-bubble';
            btn.innerHTML = `<span>${p}</span>`;
            btn.onclick = () => SWOTManager.selectPaper(p);
            paperContainer.appendChild(btn);
        });
    },

    selectPaper: async (paper) => {
        if (!SWOTManager.checkLimit()) {
            showToast("Daily SWOT limit reached! Come back tomorrow.");
            return;
        }

        SWOTManager.currentPaper = paper;

        // Show Loading
        document.getElementById('swot-stage-papers').classList.add('hidden');
        document.getElementById('swot-stage-loading').classList.remove('hidden');

        try {
            // Aggregate Data
            const data = SWOTManager.aggregateData(SWOTManager.currentSubject, paper);

            // Call API
            const response = await fetch('/swot-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: SWOTManager.currentSubject,
                    paper: paper,
                    performance_data: data
                })
            });

            const result = await response.json();

            if (result.error) throw new Error(result.error);

            // Render Result
            SWOTManager.renderResult(result);
            SWOTManager.incrementLimit();

        } catch (e) {
            showToast("Analysis failed: " + e.message);
            SWOTManager.closeModal();
        }
    },

    // === DATA AGGREGATION ===
    aggregateData: (subject, paperName) => {
        if (!window.StorageManager) return {};

        // Identify Paper ID (e.g., 'p3' from 'Paper 3')
        const pTag = paperName.toLowerCase().replace(' ', '').replace('paper', 'p'); // p3

        const user = window.StorageManager.getUser();
        const allData = window.StorageManager.getData(user);
        const essays = allData.essays || {};

        let relevantPapers = [];
        let totalScore = 0;
        let count = 0;

        Object.keys(essays).forEach(paperId => {
            // Check if paperId matches Subject
            let isMatch = false;
            if (subject === 'business' && paperId.includes('9609')) isMatch = true;
            if (subject === 'economics' && paperId.includes('9708')) isMatch = true;
            if (subject === 'general' && (paperId.includes('8021') || paperId.includes('general'))) isMatch = true;

            // Check if paperId matches Paper Number (e.g. _31, _32, _33 for p3)
            let isPaperMatch = false;
            if (pTag === 'p3' && (paperId.includes('_3') || paperId.includes('31') || paperId.includes('32') || paperId.includes('33'))) isPaperMatch = true;
            if (pTag === 'p4' && (paperId.includes('_4') || paperId.includes('41') || paperId.includes('42') || paperId.includes('43'))) isPaperMatch = true;
            if (pTag === 'p1' && paperId.includes('_1')) isPaperMatch = true;
            if (pTag === 'p2' && paperId.includes('_2')) isPaperMatch = true;

            if (isMatch && isPaperMatch) {
                const paperQuestions = essays[paperId];
                let paperCritiques = [];
                let paperScores = [];
                Object.values(paperQuestions).forEach(q => {
                    if (q.detailed_critique) {
                        paperCritiques.push(q.detailed_critique.substring(0, 500)); // Truncate
                    }
                    if (q.score) {
                        paperScores.push(q.score);
                        totalScore += q.score;
                        count++;
                    }
                });
                
                if (paperCritiques.length > 0) {
                    relevantPapers.push({
                        paper_id: paperId,
                        critiques: paperCritiques,
                        scores: paperScores
                    });
                }
            }
        });

        // To avoid overflowing API context, limit to last 5 papers if many.
        const recentPapers = relevantPapers.slice(-5);

        // Calculate Averages
        const avgScore = count > 0 ? (totalScore / count).toFixed(1) : 0;

        let recentCritiques = [];
        let scoresTrend = [];
        
        recentPapers.forEach(p => {
            recentCritiques = recentCritiques.concat(p.critiques);
            scoresTrend = scoresTrend.concat(p.scores);
        });

        return {
            total_questions_attempted: count,
            papers_analyzed: recentPapers.length,
            total_papers_attempted: relevantPapers.length,
            average_score: avgScore,
            recent_critiques: recentCritiques,
            scores_trend: scoresTrend
        };
    },

    // === RENDER ===
    renderResult: (data) => {
        document.getElementById('swot-stage-loading').classList.add('hidden');
        document.getElementById('swot-stage-result').classList.remove('hidden');

        const populateList = (id, items) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = items.map(i => `<li>${i}</li>`).join('');
        };

        populateList('swot-strengths-list', data.strengths || []);
        populateList('swot-weaknesses-list', data.weaknesses || []);
        populateList('swot-opportunities-list', data.opportunities || []);
        populateList('swot-threats-list', data.threats || []);
    }
};

window.SWOTManager = SWOTManager;
