// ==========================================
// ECONOMICS PAPER 3 (MCQ) STORAGE & ENGINE
// ==========================================

const econP3Data = {
    // --- 2025 OCT / NOV SERIES (Variant 31) ---
    "2025_on_31": [
        { 
            "q": "What is likely to lead to the principal-agent problem?", 
            "options": { 
                "A": "a manager of a business makes decisions on behalf of the owner", 
                "B": "music festival tickets are purchased by a person who intends to sell them at a large profit", 
                "C": "the government is the only buyer of a pharmaceutical product", 
                "D": "there is only one firm that manufactures the product" 
            }, 
            "correct": "A" 
        },
        { 
            "q": "A small European airline currently produces at point X on its long-run average cost curve (LRAC). It wants a bigger share of the European airline market and proposes to merge with another small European airline. The newly merged firm would produce at point Y on the long-run average cost curve. Why might the newly merged firm be able to produce at point Y? [Refer to PDF Diagram]", 
            "options": { 
                "A": "The new airline can negotiate discounts when buying fuel.", 
                "B": "The new airline has many layers of management.", 
                "C": "The new airline is unable to hire enough pilots.", 
                "D": "The workforce of the new airline lacks morale and is demotivated." 
            }, 
            "correct": "A" 
        },
        { 
            "q": "The diagram shows that a producer increases output from Q1 to Q2. What will be the result? [Refer to PDF Diagram]", 
            "options": { 
                "A": "total revenue increased, total profit increased", 
                "B": "total revenue reduced, total profit increased", 
                "C": "total revenue increased, total profit reduced", 
                "D": "total revenue reduced, total profit reduced" 
            }, 
            "correct": "C" 
        }
        // ---> Add questions 4 to 30 for Paper 31 here!
    ],

    // --- 2025 OCT / NOV SERIES (Variant 32) ---
    "2025_on_32": [
        { 
            "q": "What is the definition of moral hazard?", 
            "options": { 
                "A": "An increase in the likelihood of taking risks because another party is paying for these risks.", 
                "B": "The loss of social welfare arising from the consumption of a good.", 
                "C": "When buyers and sellers have different amounts of information regarding product quality.", 
                "D": "When costs and benefits are taken into account when a decision is being made." 
            }, 
            "correct": "A" 
        },
        { 
            "q": "The diagram shows a consumer's budget line. What determines the slope of the budget line? [Refer to PDF Diagram]", 
            "options": { 
                "A": "the marginal rate of substitution of good X for good Y", 
                "B": "the price of good X multiplied by the price of good Y", 
                "C": "the ratio of the price of good X to the income of the consumer", 
                "D": "the ratio of the price of good X to the price of good Y" 
            }, 
            "correct": "D" 
        },
        { 
            "q": "The diagram shows the marginal costs and marginal benefits of producing a good in a free market. What is the marginal external cost when the free market is in equilibrium? [Refer to PDF Diagram]", 
            "options": { 
                "A": "VW", 
                "B": "UX", 
                "C": "VX", 
                "D": "UW" 
            }, 
            "correct": "C" 
        }
        // ---> Add questions 4 to 30 for Paper 32 here!
    ],

    // --- 2025 OCT / NOV SERIES (Variant 33) ---
    "2025_on_33": [
        { 
            "q": "Why would an economy wish to achieve economic efficiency?", 
            "options": { 
                "A": "to achieve an equal distribution of income", 
                "B": "to achieve full employment", 
                "C": "to ensure resources are not wasted", 
                "D": "to ensure international competitiveness" 
            }, 
            "correct": "C" 
        },
        { 
            "q": "A firm has set a low price in the short run to act as a barrier to entry for new firms entering the market. This is an example of which pricing strategy?", 
            "options": { 
                "A": "limit pricing", 
                "B": "predatory pricing", 
                "C": "price discrimination", 
                "D": "price leadership" 
            }, 
            "correct": "A" 
        },
        { 
            "q": "A dentist is found to have charged patients for treatment they did not need. What is the likely cause of this market failure?", 
            "options": { 
                "A": "a minimum price", 
                "B": "asymmetric information", 
                "C": "non-excludability", 
                "D": "productive inefficiency" 
            }, 
            "correct": "B" 
        }
        // ---> Add questions 4 to 30 for Paper 33 here!
    ],

    // --- 2025 OCT / NOV SERIES (Variant 34) ---
    "2025_on_34": [
        { 
            "q": "What will act as a barrier to collusion between firms?", 
            "options": { 
                "A": "an ability to detect price cuts by rivals", 
                "B": "the abolition of anti-trust measures", 
                "C": "the existence of a small number of firms in the industry", 
                "D": "unstable demand conditions for products" 
            }, 
            "correct": "D" 
        },
        { 
            "q": "The diagram shows two indifference curves. What do indifference curves indicate? [Refer to PDF Diagram]", 
            "options": { 
                "A": "Consumers get more satisfaction on curve I1 from consuming more of X and less of Y.", 
                "B": "Consumers get more satisfaction on curve I2 from consuming less of X and more of Y.", 
                "C": "Each point on the curve represents the marginal rate of substitution of good X for good Y.", 
                "D": "Movement from I1 to I2 cannot be made unless the indifference curves cross." 
            }, 
            "correct": "C" 
        },
        { 
            "q": "What is an example of forward vertical integration?", 
            "options": { 
                "A": "A firm manufacturing computers merges with a firm that manufactures furniture.", 
                "B": "A firm manufacturing computers merges with a firm that manufactures silicon chips for computers.", 
                "C": "A firm manufacturing computers merges with a retail outlet that sells computers.", 
                "D": "A firm manufacturing computers merges with another firm that also manufactures computers." 
            }, 
            "correct": "C" 
        }
        // ---> Add questions 4 to 30 for Paper 34 here!
    ]
};

let currentPaperID = "";
let timerInterval;
let timeRemaining = 75 * 60; // 75 minutes

function loadMCQPapers() {
    const container = document.getElementById('container-econ-p3');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">📈 Economics: Paper 3 (MCQ)</h2>
            <p style="color:#666;">Practice in Test Mode (75 Minutes)</p>
        </div>
        
        <div class="series-header"><div class="year-big">2025</div><div class="series-name">Oct / Nov Series</div></div>
        <div class="papers-grid">
            <div class="paper-card" onclick="startMCQTest('2025_on_31')">
                <span class="paper-tag">9708/31</span>
                <h3>Economics MCQ (Variant 1)</h3>
                <p style="color:#888; margin-top:5px;">30 Questions • 1h 15m</p>
            </div>
            <div class="paper-card" onclick="startMCQTest('2025_on_32')">
                <span class="paper-tag">9708/32</span>
                <h3>Economics MCQ (Variant 2)</h3>
                <p style="color:#888; margin-top:5px;">30 Questions • 1h 15m</p>
            </div>
            <div class="paper-card" onclick="startMCQTest('2025_on_33')">
                <span class="paper-tag">9708/33</span>
                <h3>Economics MCQ (Variant 3)</h3>
                <p style="color:#888; margin-top:5px;">30 Questions • 1h 15m</p>
            </div>
            <div class="paper-card" onclick="startMCQTest('2025_on_34')">
                <span class="paper-tag">9708/34</span>
                <h3>Economics MCQ (Variant 4)</h3>
                <p style="color:#888; margin-top:5px;">30 Questions • 1h 15m</p>
            </div>
        </div>
    `;
}

function startMCQTest(paperID) {
    currentPaperID = paperID;
    const questions = econP3Data[paperID];
    
    if(!questions || questions.length === 0) { 
        alert("Questions for this paper haven't been added yet!"); 
        return; 
    }

    let html = '<div id="mcq-header" style="position: sticky; top: 0; background: white; padding: 15px; border-bottom: 2px solid var(--lime-primary); z-index: 100; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">';
    html += '<h3 style="margin:0; color:var(--lime-dark);">9708 Economics / ' + paperID.replace('_', ' ') + '</h3>';
    html += '<div id="timer-display" style="font-size: 1.5rem; font-weight: bold; color: #dc2626; font-family: monospace;">01:15:00</div>';
    html += '</div><div style="padding: 20px; max-width: 800px; margin: 0 auto;">';
    
    questions.forEach((item, index) => {
        html += '<div class="mcq-block" style="margin-bottom:25px; background:white; padding:20px; border-radius:12px; border: 1px solid #eee; box-shadow:0 4px 15px rgba(0,0,0,0.05);">';
        html += '<p style="font-size:1.1rem; line-height:1.6;"><strong>Q' + (index + 1) + ':</strong> ' + item.q + '</p>';
        html += '<div class="options-grid" style="margin-top:15px; display: grid; gap: 10px;">';
        
        for (const [letter, text] of Object.entries(item.options)) {
            html += '<label style="display:flex; align-items: center; padding: 12px; border: 1px solid #eee; border-radius: 8px; cursor:pointer; transition: 0.2s;">';
            html += '<input type="radio" name="q' + index + '" value="' + letter + '" style="width: 20px; height: 20px; margin-right:15px;">';
            html += '<span style="font-weight:bold; margin-right:10px;">' + letter + ':</span> ' + text;
            html += '</label>';
        }
        html += '</div></div>';
    });

    html += '<button onclick="confirmSubmission()" class="nav-btn" style="background:var(--lime-primary); width:100%; padding:20px; font-size:1.4rem; margin-top:30px; color:white; border-radius: 12px; cursor: pointer; border: none; font-weight: bold;">Submit Final Test</button>';
    html += '<div style="height: 100px;"></div></div>';
    
    document.getElementById('container-econ-p3').innerHTML = html;
    startTimer();
    window.scrollTo(0,0);
}

function startTimer() {
    timeRemaining = 75 * 60; 
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        let h = Math.floor(timeRemaining / 3600);
        let m = Math.floor((timeRemaining % 3600) / 60);
        let s = timeRemaining % 60;
        
        let displayH = String(h).padStart(2, '0');
        let displayM = String(m).padStart(2, '0');
        let displayS = String(s).padStart(2, '0');
        
        document.getElementById('timer-display').innerText = displayH + ":" + displayM + ":" + displayS;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("Time is up! Your test is being submitted.");
            gradeMCQ();
        }
    }, 1000);
}

function confirmSubmission() {
    if(confirm("Are you finished? Once submitted, you cannot change your answers.")) {
        gradeMCQ();
    }
}

function gradeMCQ() {
    clearInterval(timerInterval);
    const questions = econP3Data[currentPaperID];
    let score = 0;
    
    questions.forEach((item, index) => {
        const selected = document.querySelector('input[name="q' + index + '"]:checked');
        if (selected && selected.value === item.correct) score++;
    });

    const percent = Math.round((score / questions.length) * 100);
    
    let resultHTML = '<div style="text-align:center; padding:80px 20px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 600px; margin: 40px auto;">';
    resultHTML += '<div style="font-size: 5rem; margin-bottom: 10px;">' + percent + '%</div>';
    resultHTML += '<h1 style="font-size:2.5rem; color:var(--lime-dark); margin:0;">Score: ' + score + ' / ' + questions.length + '</h1>';
    resultHTML += '<p style="font-size:1.2rem; color:#666; margin-top: 20px;">You have completed the Economics Paper 3 Practice.</p>';
    resultHTML += '<button onclick="loadMCQPapers()" class="nav-btn" style="margin-top:40px; background: var(--lime-primary); color: white; padding: 15px 40px; border-radius: 30px; border: none; font-size: 1.1rem; cursor: pointer;">Try Another Series</button>';
    resultHTML += '</div>';
    
    document.getElementById('container-econ-p3').innerHTML = resultHTML;
    window.scrollTo(0,0);
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadMCQPapers);