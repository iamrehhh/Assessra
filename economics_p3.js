// ==========================================
// ECONOMICS PAPER 3 (MCQ) SPLIT-SCREEN ENGINE
// ==========================================

const paperDatabase = {
    "2025_on_31": { 
        pdf: "9708_w25_qp_31.pdf", 
        answers: ['A', 'A', 'C', 'A', 'D', 'A', 'D', 'D', 'B', 'B', 'C', 'A', 'D', 'B', 'A', 'D', 'D', 'B', 'C', 'C', 'C', 'A', 'D', 'B', 'A', 'B', 'A', 'D', 'A', 'C'] 
    },
    "2025_on_32": { 
        pdf: "9708_w25_qp_32.pdf", 
        answers: ['A', 'D', 'C', 'C', 'C', 'A', 'D', 'B', 'D', 'B', 'B', 'D', 'B', 'B', 'B', 'A', 'D', 'D', 'B', 'C', 'C', 'B', 'A', 'D', 'B', 'A', 'C', 'B', 'A', 'D'] 
    },
    "2025_on_33": { 
        pdf: "9708_w25_qp_33.pdf", 
        answers: ['C', 'A', 'B', 'D', 'D', 'C', 'C', 'B', 'D', 'D', 'A', 'D', 'B', 'A', 'B', 'D', 'A', 'A', 'D', 'C', 'B', 'C', 'A', 'D', 'C', 'B', 'A', 'B', 'D', 'A'] 
    },
    "2025_on_34": { 
        pdf: "9708_w25_qp_34.pdf", 
        answers: ['D', 'C', 'C', 'B', 'C', 'D', 'D', 'A', 'B', 'D', 'D', 'A', 'C', 'D', 'A', 'B', 'D', 'D', 'B', 'B', 'C', 'C', 'A', 'D', 'B', 'A', 'C', 'B', 'B', 'C'] 
    }
};

let currentPaperID = "";
let timerInterval;
let timeRemaining = 75 * 60; // 75 minutes
let testSubmitted = false;

function loadMCQPapers() {
    const container = document.getElementById('container-econ-p3');
    if (!container) return;

    document.body.style.overflow = 'auto';

    container.innerHTML = `
        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">📈 Economics: Paper 3 (MCQ)</h2>
            <p style="color:#666;">Interactive Split-Screen Test (75 Minutes)</p>
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
    testSubmitted = false;
    const paperInfo = paperDatabase[paperID];
    
    if(!paperInfo) { alert("Paper data not found!"); return; }

    document.body.style.overflow = 'hidden';

    // 1. Build the basic HTML Structure
    let html = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: white; display: flex; flex-direction: column;">
            
            <div id="mcq-header" style="flex-shrink: 0; background: white; padding: 15px 30px; border-bottom: 2px solid var(--lime-primary); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <div style="display:flex; align-items:center; gap:20px;">
                    <button onclick="exitMCQTest()" style="background: #eee; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight:bold;">Exit</button>
                    <h3 style="margin:0; color:var(--lime-dark);">9708 Economics / ${paperID.replace('_', ' ')}</h3>
                </div>
                <div id="timer-display" style="font-size: 1.5rem; font-weight: bold; color: #dc2626; font-family: monospace;">01:15:00</div>
            </div>

            <div style="flex-grow: 1; display: flex; overflow: hidden; background: #f5f5f5;">
                <div style="flex: 6; height: 100%; border-right: 2px solid #ddd;">
                    <iframe src="${paperInfo.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH" width="100%" height="100%" style="border:none;"></iframe>
                </div>
                <div id="answer-sheet-container" style="flex: 4; height: 100%; overflow-y: auto; padding: 30px; background: white; box-sizing: border-box;">
                    <div id="mcq-result-box" style="display:none; text-align:center; padding:20px; margin-bottom: 30px; background: #f0fdf4; border: 2px solid var(--lime-primary); border-radius: 12px;"></div>
                    <h3 style="margin-top:0; border-bottom: 2px solid #eee; padding-bottom: 10px;">Answer Sheet</h3>
                    <div id="bubble-grid" style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
    `;
    
    paperInfo.answers.forEach((correctLetter, index) => {
        let qNum = index + 1;
        html += `
            <div id="block-q${index}" style="display:flex; align-items:center; padding: 10px; border-radius: 8px; border: 1px solid #eee; background: #fafafa;">
                <div style="width: 40px; font-weight: bold; font-size: 1.1rem; color: #555;">Q${qNum}</div>
                <div style="display:flex; gap: 10px; flex-grow: 1; justify-content: space-around;">
        `;
        ['A', 'B', 'C', 'D'].forEach(letter => {
            html += `
                <label id="label-q${index}-${letter}" style="display:flex; justify-content:center; align-items:center; width: 40px; height: 40px; background: white; border: 2px solid #ccc; border-radius: 50%; cursor:pointer; transition: 0.2s;">
                    <input type="radio" name="q${index}" value="${letter}" style="display:none;" onchange="updateBubble(this, ${index}, '${letter}')">
                    <span style="font-weight:bold; color:#555;">${letter}</span>
                </label>
            `;
        });
        html += `</div></div>`;
    });

    html += `
                    </div>
                    <button id="submit-btn" onclick="confirmSubmission()" class="nav-btn" style="background:var(--lime-primary); width:100%; padding:20px; font-size:1.2rem; margin-top:30px; margin-bottom:20px; color:white; border-radius: 12px; cursor: pointer; border: none; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">Submit & Grade Test</button>
                    <div style="height: 150px; width: 100%;"></div> 
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('container-econ-p3').innerHTML = html;

    // 2. RESTORE PREVIOUS ATTEMPT (If available)
    if (typeof StorageManager !== 'undefined') {
        const saved = StorageManager.getMCQState(paperID);
        if (saved && saved.answers) {
            // Restore bubbles visually
            saved.answers.forEach((ans, index) => {
                if (ans) {
                    const input = document.querySelector(`input[name="q${index}"][value="${ans}"]`);
                    if (input) {
                        input.checked = true;
                        updateBubble(null, index, ans); // Highlight it
                    }
                }
            });

            // If it was already finished, grade it immediately
            if (saved.submitted) {
                gradeMCQ(true); // 'true' means this is a restore, not a new submit
                document.getElementById('timer-display').innerText = "COMPLETE";
                return; // Stop here, don't start timer
            }
        }
    }

    startTimer();
}

// Visual effect for clicking a bubble
window.updateBubble = function(input, qIndex, letter) {
    if(testSubmitted) return;
    
    // Reset all bubbles for this question
    ['A', 'B', 'C', 'D'].forEach(l => {
        let label = document.getElementById(`label-q${qIndex}-${l}`);
        if(label) {
            label.style.background = 'white';
            label.style.borderColor = '#ccc';
            label.style.color = '#555';
        }
    });

    // Highlight selected
    let selectedLabel = document.getElementById(`label-q${qIndex}-${letter}`);
    if(selectedLabel) {
        selectedLabel.style.background = 'var(--lime-primary)';
        selectedLabel.style.borderColor = 'var(--lime-primary)';
        selectedLabel.style.color = 'white';
    }
};

function startTimer() {
    timeRemaining = 75 * 60; 
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if(testSubmitted) return; 
        timeRemaining--;
        let h = Math.floor(timeRemaining / 3600);
        let m = Math.floor((timeRemaining % 3600) / 60);
        let s = timeRemaining % 60;
        
        let displayH = String(h).padStart(2, '0');
        let displayM = String(m).padStart(2, '0');
        let displayS = String(s).padStart(2, '0');
        
        const timerEl = document.getElementById('timer-display');
        if(timerEl) timerEl.innerText = displayH + ":" + displayM + ":" + displayS;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("Time is up! Your test is being automatically submitted.");
            gradeMCQ();
        }
    }, 1000);
}

function confirmSubmission() {
    if(testSubmitted) return;
    if(confirm("Are you ready to submit your answers for grading?")) {
        gradeMCQ();
    }
}

function gradeMCQ(isRestoring = false) {
    if(testSubmitted && !isRestoring) return;
    testSubmitted = true;
    clearInterval(timerInterval);
    
    const answers = paperDatabase[currentPaperID].answers;
    let score = 0;
    let userAnswers = []; // Collect for saving
    
    answers.forEach((correctLetter, index) => {
        const selectedInput = document.querySelector(`input[name="q${index}"]:checked`);
        const userChoice = selectedInput ? selectedInput.value : null;
        userAnswers.push(userChoice);

        // Reset text colors
        ['A', 'B', 'C', 'D'].forEach(l => {
            let lbl = document.getElementById(`label-q${index}-${l}`);
            if(lbl) lbl.style.color = '#555';
        });

        // Highlight Logic
        if (userChoice === correctLetter) {
            score++;
            let correctLabel = document.getElementById(`label-q${index}-${correctLetter}`);
            if(correctLabel) {
                correctLabel.style.backgroundColor = "#22c55e"; // Green
                correctLabel.style.borderColor = "#22c55e";
                correctLabel.style.color = "white";
            }
            document.getElementById(`block-q${index}`).style.borderLeft = "6px solid #22c55e";
        } else {
            let correctLabel = document.getElementById(`label-q${index}-${correctLetter}`);
            if(correctLabel) {
                correctLabel.style.backgroundColor = "#22c55e";
                correctLabel.style.borderColor = "#22c55e";
                correctLabel.style.color = "white";
            }
            
            if (userChoice) {
                let userLabel = document.getElementById(`label-q${index}-${userChoice}`);
                if(userLabel) {
                    userLabel.style.backgroundColor = "#ef4444"; // Red
                    userLabel.style.borderColor = "#ef4444";
                    userLabel.style.color = "white";
                }
            }
            document.getElementById(`block-q${index}`).style.borderLeft = "6px solid #ef4444";
        }
    });

    const percent = Math.round((score / answers.length) * 100);
    
    // Show Results
    const resultBox = document.getElementById('mcq-result-box');
    if(resultBox) {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <h1 style="font-size:3.5rem; color:var(--lime-dark); margin:0;">${percent}%</h1>
            <h2 style="font-size:1.8rem; color:#333; margin:10px 0;">Final Score: ${score} / ${answers.length}</h2>
            <p style="font-size:1rem; color:#666; margin-top: 10px;">Your errors are highlighted in <span style="color:#ef4444; font-weight:bold;">Red</span>. The correct answers are <span style="color:#22c55e; font-weight:bold;">Green</span>.</p>
        `;
    }

    const subBtn = document.getElementById('submit-btn');
    if(subBtn) subBtn.style.display = "none";
    
    const timerEl = document.getElementById('timer-display');
    if(timerEl) timerEl.innerText = "TEST COMPLETE";
    
    // Smoothly scroll top
    const sheet = document.getElementById('answer-sheet-container');
    if(sheet) sheet.scrollTo({ top: 0, behavior: 'smooth' });

    // === SAVE TO STORAGE ===
    if (!isRestoring && typeof StorageManager !== 'undefined') {
        StorageManager.saveMCQState(currentPaperID, userAnswers, true, score);
    }
}

function exitMCQTest() {
    document.body.style.overflow = 'auto'; // Restore normal scrolling
    loadMCQPapers(); 
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadMCQPapers);