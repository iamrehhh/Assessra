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

    // Release the body scroll just in case we are exiting a test
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

// Inside economics_p3.js

function startMCQTest(paperID) {
    currentPaperID = paperID;
    testSubmitted = false;
    const paperInfo = paperDatabase[paperID];
    
    // 1. LOAD PREVIOUS STATE
    const savedState = StorageManager.getMCQState(paperID);
    const savedAnswers = savedState ? savedState.answers : new Array(30).fill(null);
    testSubmitted = savedState ? savedState.submitted : false;

    // ... [Keep your existing HTML generation code] ...

    // 2. INJECT SAVED ANSWERS INTO HTML
    // Inside your loop where you generate bubbles:
    paperInfo.answers.forEach((correctLetter, index) => {
        // ... html generation ...
        ['A', 'B', 'C', 'D'].forEach(letter => {
            const isChecked = savedAnswers[index] === letter ? 'checked' : '';
            const bgStyle = savedAnswers[index] === letter ? 'background:var(--lime-primary); border-color:var(--lime-primary); color:white;' : '';
            
            html += `
                <label id="label-q${index}-${letter}" style="${bgStyle} ...other styles...">
                    <input type="radio" name="q${index}" value="${letter}" ${isChecked} onchange="handleMCQSelection(${index}, '${letter}')">
                    <span>${letter}</span>
                </label>
            `;
        });
    });

    // 3. IF SUBMITTED, SHOW GRADES IMMEDIATELY
    if (testSubmitted) {
        setTimeout(gradeMCQ, 500); // Trigger grading logic to show red/green
    }
}

// NEW HANDLER TO SAVE ON EVERY CLICK
function handleMCQSelection(index, letter) {
    if(testSubmitted) return;
    
    // UI Update (Your existing updateBubble logic)
    updateBubble(null, index, letter); 

    // Save to Storage
    let currentAnswers = StorageManager.getMCQState(currentPaperID)?.answers || new Array(30).fill(null);
    currentAnswers[index] = letter;
    StorageManager.saveMCQState(currentPaperID, currentAnswers, false, 0);
}

// Visual effect for clicking a bubble
window.updateBubble = function(input, qIndex, letter) {
    if(testSubmitted) return;
    
    // Reset all bubbles for this question
    ['A', 'B', 'C', 'D'].forEach(l => {
        let label = document.getElementById(`label-q${qIndex}-${l}`);
        label.style.background = 'white';
        label.style.borderColor = '#ccc';
        label.style.color = '#555';
    });

    // Highlight selected
    let selectedLabel = document.getElementById(`label-q${qIndex}-${letter}`);
    selectedLabel.style.background = 'var(--lime-primary)';
    selectedLabel.style.borderColor = 'var(--lime-primary)';
    selectedLabel.style.color = 'white';
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
        
        document.getElementById('timer-display').innerText = displayH + ":" + displayM + ":" + displayS;

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

function gradeMCQ() {
    if(testSubmitted) return;
    testSubmitted = true;
    clearInterval(timerInterval);
    
    const answers = paperDatabase[currentPaperID].answers;
    let score = 0;
    
    answers.forEach((correctLetter, index) => {
        const selectedInput = document.querySelector(`input[name="q${index}"]:checked`);
        const userChoice = selectedInput ? selectedInput.value : null;

        // Reset text colors
        ['A', 'B', 'C', 'D'].forEach(l => {
            document.getElementById(`label-q${index}-${l}`).style.color = '#555';
        });

        // Highlight Logic
        if (userChoice === correctLetter) {
            score++;
            let correctLabel = document.getElementById(`label-q${index}-${correctLetter}`);
            correctLabel.style.backgroundColor = "#22c55e"; // Green
            correctLabel.style.borderColor = "#22c55e";
            correctLabel.style.color = "white";
            document.getElementById(`block-q${index}`).style.borderLeft = "6px solid #22c55e";
        } else {
            let correctLabel = document.getElementById(`label-q${index}-${correctLetter}`);
            correctLabel.style.backgroundColor = "#22c55e";
            correctLabel.style.borderColor = "#22c55e";
            correctLabel.style.color = "white";
            
            if (userChoice) {
                let userLabel = document.getElementById(`label-q${index}-${userChoice}`);
                userLabel.style.backgroundColor = "#ef4444"; // Red
                userLabel.style.borderColor = "#ef4444";
                userLabel.style.color = "white";
            }
            document.getElementById(`block-q${index}`).style.borderLeft = "6px solid #ef4444";
        }
    });

    const percent = Math.round((score / answers.length) * 100);
    
    // Show Results - NOW WITH WORKING NUMBERS
    const resultBox = document.getElementById('mcq-result-box');
    resultBox.style.display = "block";
    resultBox.innerHTML = `
        <h1 style="font-size:3.5rem; color:var(--lime-dark); margin:0;">${percent}%</h1>
        <h2 style="font-size:1.8rem; color:#333; margin:10px 0;">Final Score: ${score} / ${answers.length}</h2>
        <p style="font-size:1rem; color:#666; margin-top: 10px;">Your errors are highlighted in <span style="color:#ef4444; font-weight:bold;">Red</span>. The correct answers are <span style="color:#22c55e; font-weight:bold;">Green</span>.</p>
    `;

    document.getElementById('submit-btn').style.display = "none";
    document.getElementById('timer-display').innerText = "TEST COMPLETE";
    
    // Smoothly scroll the answer sheet back to the top to see the score
    document.getElementById('answer-sheet-container').scrollTo({ top: 0, behavior: 'smooth' });
}

function exitMCQTest() {
    document.body.style.overflow = 'auto'; // Restore normal scrolling
    loadMCQPapers(); // Reload the cards
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadMCQPapers);