// ==========================================
// ECONOMICS PAPER 3 (MCQ) STORAGE & ENGINE
// ==========================================

const econP3Data = {
    "2024_mj_31": [
        {
            q: "Which statement identifies the condition necessary to achieve Pareto optimality?",
            options: {
                A: "All consumers maximise their utility subject to their available income.",
                B: "It is not possible to produce greater output with the resources available.",
                C: "It is not possible to reallocate resources to make someone better off without someone else becoming worse off.",
                D: "Potential losers from any reallocation of resources cannot be compensated by those who gain."
            ,
            correct: "C"
        },
        // You can add all 30 questions here following this format
    ]
};

let currentPaperID = "";

function loadMCQPapers() {
    const container = document.getElementById('container-econ-p3');
    if (!container) return;

    // First, show a selection menu of years/series
    container.innerHTML = `
        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">📈 Economics: Paper 3 (MCQ)</h2>
            <p style="color:#666;">Select a paper to start the test</p>
        </div>
        <div class="papers-grid">
            <div class="paper-card" onclick="startMCQTest('2024_mj_31')">
                <span class="paper-tag">9708/31</span>
                <h3>May / June 2024</h3>
                <p style="color:#888; margin-top:5px;">30 Questions • 1h 15m</p>
            </div>
        </div>
    `;
}

function startMCQTest(paperID) {
    currentPaperID = paperID;
    const questions = econP3Data[paperID];
    let html = `<h2 style="margin-bottom:20px;">Paper ${paperID.replace('_', ' ')}</h2>`;
    
    questions.forEach((item, index) => {
        html += `
            <div class="mcq-block" style="margin-bottom:25px; background:white; padding:20px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                <p><strong>Q${index + 1}:</strong> ${item.q}</p>
                <div class="options-grid" style="margin-top:10px;">
                    ${Object.entries(item.options).map(([letter, text]) => `
                        <label style="display:block; margin:8px 0; cursor:pointer;">
                            <input type="radio" name="q${index}" value="${letter}" style="margin-right:10px;">
                            ${letter}: ${text}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    });

    html += `<button onclick="gradeMCQ()" class="nav-btn" style="background:var(--lime-primary); width:100%; padding:15px; font-size:1.2rem; margin-top:20px;">Submit Test</button>`;
    
    document.getElementById('container-econ-p3').innerHTML = html;
}

function gradeMCQ() {
    const questions = econP3Data[currentPaperID];
    let score = 0;

    questions.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value === item.correct) {
            score++;
        }
    });

    alert(`Test Submitted! \nYour Score: ${score} out of ${questions.length}`);
    // You can also expand this to show which ones were wrong
}

// Inject on load
loadMCQPapers();