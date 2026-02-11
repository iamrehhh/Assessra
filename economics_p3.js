// ==========================================
// ECONOMICS PAPER 3 (MCQ) ENGINE & GRADER
// ==========================================

// I have extracted the EXACT correct answers from your 4 Mark Schemes!
// The engine will now automatically generate 30 questions for each paper.
const answerKeys = {
    "2025_on_31": ['A', 'A', 'C', 'A', 'D', 'A', 'D', 'D', 'B', 'B', 'C', 'A', 'D', 'B', 'A', 'D', 'D', 'B', 'C', 'C', 'C', 'A', 'D', 'B', 'A', 'B', 'A', 'D', 'A', 'C'],
    "2025_on_32": ['A', 'D', 'C', 'C', 'C', 'A', 'D', 'B', 'D', 'B', 'B', 'D', 'B', 'B', 'B', 'A', 'D', 'D', 'B', 'C', 'C', 'B', 'A', 'D', 'B', 'A', 'C', 'B', 'A', 'D'],
    "2025_on_33": ['C', 'A', 'B', 'D', 'D', 'C', 'C', 'B', 'D', 'D', 'A', 'D', 'B', 'A', 'B', 'D', 'A', 'A', 'D', 'C', 'B', 'C', 'A', 'D', 'C', 'B', 'A', 'B', 'D', 'A'],
    "2025_on_34": ['D', 'C', 'C', 'B', 'C', 'D', 'D', 'A', 'B', 'D', 'D', 'A', 'C', 'D', 'A', 'B', 'D', 'D', 'B', 'B', 'C', 'C', 'A', 'D', 'B', 'A', 'C', 'B', 'B', 'C']
};

let currentPaperID = "";
let timerInterval;
let timeRemaining = 75 * 60; // 75 minutes
let testSubmitted = false;

function loadMCQPapers() {
    const container = document.getElementById('container-econ-p3');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">📈 Economics: Paper 3 (MCQ)</h2>
            <p style="color:#666;">Digital Answer Sheet & Grader (75 Minutes)</p>
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
    const answers = answerKeys[paperID];
    
    if(!answers) { 
        alert("Mark scheme not found for this paper!"); 
        return; 
    }

    let html = '<div id="mcq-header" style="position: sticky; top: 0; background: white; padding: 15px; border-bottom: 2px solid var(--lime-primary); z-index: 100; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">';
    html += '<h3 style="margin:0; color:var(--lime-dark);">9708 Economics / ' + paperID.replace('_', ' ') + '</h3>';
    html += '<div id="timer-display" style="font-size: 1.5rem; font-weight: bold; color: #dc2626; font-family: monospace;">01:15:00</div>';
    html += '</div><div style="padding: 20px; max-width: 800px; margin: 0 auto;">';
    
    // Result box (hidden initially)
    html += '<div id="mcq-result-box" style="display:none; text-align:center; padding:30px; margin-bottom: 30px; background: #f0fdf4; border: 2px solid var(--lime-primary); border-radius: 12px;"></div>';

    // Generate exactly 30 questions based on the answer key array length
    answers.forEach((correctLetter, index) => {
        let qNum = index + 1;
        html += '<div class="mcq-block" id="block-q' + index + '" style="margin-bottom:25px; background:white; padding:20px; border-radius:12px; border: 1px solid #eee; box-shadow:0 4px 15px rgba(0,0,0,0.05); transition: 0.3s;">';
        html += '<p style="font-size:1.1rem; line-height:1.6; color:#444;"><strong>Question ' + qNum + ':</strong> Please refer to Question ' + qNum + ' in the provided PDF paper.</p>';
        html += '<div class="options-grid" style="margin-top:15px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';
        
        ['A', 'B', 'C', 'D'].forEach(letter => {
            html += '<label id="label-q' + index + '-' + letter + '" style="display:flex; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 8px; cursor:pointer; transition: 0.2s;">';
            html += '<input type="radio" name="q' + index + '" value="' + letter + '" style="width: 18px; height: 18px; margin-right:15px;">';
            html += '<span style="font-weight:bold; font-size:1.1rem;">Option ' + letter + '</span>';
            html += '</label>';
        });
        html += '</div></div>';
    });

    html += '<button id="submit-btn" onclick="confirmSubmission()" class="nav-btn" style="background:var(--lime-primary); width:100%; padding:20px; font-size:1.4rem; margin-top:10px; color:white; border-radius: 12px; cursor: pointer; border: none; font-weight: bold;">Submit & Grade Test</button>';
    html += '<button onclick="loadMCQPapers()" class="nav-btn" style="background:#eee; width:100%; padding:15px; font-size:1.1rem; margin-top:15px; color:#333; border-radius: 12px; cursor: pointer; border: none; font-weight: bold;">Exit Test</button>';
    html += '<div style="height: 100px;"></div></div>';
    
    document.getElementById('container-econ-p3').innerHTML = html;
    startTimer();
    window.scrollTo(0,0);
}

function startTimer() {
    timeRemaining = 75 * 60; 
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if(testSubmitted) return; // Stop counting if submitted

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
    
    const answers = answerKeys[currentPaperID];
    let score = 0;
    
    answers.forEach((correctLetter, index) => {
        // Find what the user selected
        const selectedInput = document.querySelector('input[name="q' + index + '"]:checked');
        const userChoice = selectedInput ? selectedInput.value : null;

        // Disable all inputs so answers can't be changed
        document.querySelectorAll('input[name="q' + index + '"]').forEach(input => {
            input.disabled = true;
        });

        // Highlight Logic
        if (userChoice === correctLetter) {
            // Correct Answer! Make the selected box green
            score++;
            document.getElementById('label-q' + index + '-' + correctLetter).style.backgroundColor = "#dcfce7";
            document.getElementById('label-q' + index + '-' + correctLetter).style.borderColor = "#22c55e";
            document.getElementById('block-q' + index).style.borderLeft = "6px solid #22c55e";
        } else {
            // Wrong Answer! Make the correct box green, and if they guessed, make their guess red
            document.getElementById('label-q' + index + '-' + correctLetter).style.backgroundColor = "#dcfce7";
            document.getElementById('label-q' + index + '-' + correctLetter).style.borderColor = "#22c55e";
            
            if (userChoice) {
                document.getElementById('label-q' + index + '-' + userChoice).style.backgroundColor = "#fee2e2";
                document.getElementById('label-q' + index + '-' + userChoice).style.borderColor = "#ef4444";
            }
            document.getElementById('block-q' + index).style.borderLeft = "6px solid #ef4444";
        }
    });

    const percent = Math.round((score / answers.length) * 100);
    
    // Show the results at the TOP of the screen (instead of replacing the questions)
    const resultBox = document.getElementById('mcq-result-box');
    resultBox.style.display = "block";
    resultBox.innerHTML = `
        <h1 style="font-size:3.5rem; color:var(--lime-dark); margin:0;">\${percent}%</h1>
        <h2 style="font-size:1.8rem; color:#333; margin:10px 0;">Final Score: \${score} / \${answers.length}</h2>
        <p style="font-size:1.1rem; color:#666; margin-top: 10px;">Scroll down to review your incorrect answers highlighted in red. The correct answers are highlighted in green.</p>
    `;

    // Hide the submit button and stop the timer display
    document.getElementById('submit-btn').style.display = "none";
    document.getElementById('timer-display').innerText = "TEST COMPLETE";
    document.getElementById('timer-display').style.color = "var(--lime-primary)";
    
    // Scroll back to the top so they see their score immediately
    window.scrollTo(0,0);
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadMCQPapers);