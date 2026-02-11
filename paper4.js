// ==========================================
// PAPER 4 STORAGE & GENERATOR
// ==========================================

// 1. The HTML structure for your Paper 4 Cards
const paper4CardsHTML = `
    <div class="series-header"><div class="year-big">2024</div><div class="series-name">May / June Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('2024_mj_41')">
            <span class="paper-tag">9609/41</span>
            <h3>Global Logistics (GL)</h3>
            <p>Paper 4 • Business Strategy</p>
        </div>
        </div>
`;

// 2. Inject the cards into index.html automatically when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const p4Container = document.getElementById('paper4-container');
    if (p4Container) {
        p4Container.innerHTML = paper4CardsHTML;
    }
});

// 3. Store your massive Paper 4 Case Studies and Questions here!
// (This keeps your main HTML file completely clutter-free)
const paper4Database = {
    "2024_mj_41": {
        title: "Global Logistics (GL)",
        time: 120, // 2 hours
        caseStudy: "Insert your massive 3-page case study text here...",
        questions: [
            "Evaluate the strategic options for GL's expansion.",
            "Recommend a new organizational structure for GL."
        ]
    }
    // You can keep adding more papers to this database as you go!
};