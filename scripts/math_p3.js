// ==========================================
// MATHEMATICS PAPER 3 (PURE MATH 3) ENGINE
// ==========================================

// Prefix: 'math_'
const mathPaperDatabase = {
    // Placeholder for future uploads
    // "math_2025_mj_31": {
    //     pdf: "papers/9709_s25_qp_31.pdf",
    //     answers: [...]
    // }
};

let currentMathPaperID = "";
let mathTimerInterval;
let mathTimeRemaining = 110 * 60; // 1 hour 50 minutes for Math P3
let mathTestSubmitted = false;

function loadMathPapers() {
    const container = document.getElementById('container-math-p3');
    if (!container) return;

    document.body.style.overflow = 'auto';

    container.innerHTML = `
        <div style="text-align:center; margin-bottom:30px;">
            <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">📐 Mathematics: Paper 3 (Pure Math 3)</h2>
            <p style="color:#666;">Interactive Test Interface</p>
        </div>
        
        <div style="text-align:center; padding: 40px; background: #f9f9f9; border-radius: 12px; border: 2px dashed #ddd; margin: 20px auto; max-width: 600px;">
            <div style="font-size: 3rem; margin-bottom: 20px;">🚧</div>
            <h3 style="color: #555; margin-bottom: 10px;">Papers Coming Soon</h3>
            <p style="color: #888;">Content for Mathematics Paper 3 is currently being uploaded. Please check back later.</p>
            <button onclick="closeAllPanels(); setView('home');" style="margin-top: 20px; padding: 10px 20px; background: var(--lime-primary); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">← Back to Home</button>
        </div>
    `;
}

async function startMathTest(paperID) {
    currentMathPaperID = paperID;
    mathTestSubmitted = false;
    const paperInfo = mathPaperDatabase[paperID];

    if (!paperInfo) {
        // fallback generic message if ID exists but data is missing
        alert("Paper data not found!");
        return;
    }

    document.body.style.overflow = 'hidden';

    let html = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: white; display: flex; flex-direction: column;">
            <div id="math-header" style="flex-shrink: 0; background: white; padding: 15px 30px; border-bottom: 2px solid var(--lime-primary); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <div style="display:flex; align-items:center; gap:20px;">
                    <button onclick="exitMathTest()" style="background: #eee; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight:bold;">Exit</button>
                    <h3 style="margin:0; color:var(--lime-dark);">9709 Mathematics / P3</h3>
                </div>
                <div id="math-timer-display" style="font-size: 1.5rem; font-weight: bold; color: #dc2626; font-family: monospace;">01:50:00</div>
            </div>

            <div style="flex-grow: 1; display: flex; overflow: hidden; background: #f5f5f5;">
                <div style="flex: 1; height: 100%; display:flex; justify-content:center; align-items:center;">
                   <h3>PDF Viewer Placeholder</h3>
                </div>
            </div>
        </div>`;

    document.getElementById('container-math-p3').innerHTML = html;
    startMathTimer();
}

function startMathTimer() {
    mathTimeRemaining = 110 * 60; // 1h 50m
    clearInterval(mathTimerInterval);
    mathTimerInterval = setInterval(() => {
        if (mathTestSubmitted) return;
        mathTimeRemaining--;
        let h = Math.floor(mathTimeRemaining / 3600);
        let m = Math.floor((mathTimeRemaining % 3600) / 60);
        let s = mathTimeRemaining % 60;
        const timerEl = document.getElementById('math-timer-display');
        if (timerEl) timerEl.innerText = String(h).padStart(2, '0') + ":" + String(m).padStart(2, '0') + ":" + String(s).padStart(2, '0');

        if (mathTimeRemaining <= 0) {
            clearInterval(mathTimerInterval);
            alert("Time is up!");
        }
    }, 1000);
}

function exitMathTest() {
    document.body.style.overflow = 'auto';
    loadMathPapers();
}

// Ensure global access
window.startMathTest = startMathTest;
window.exitMathTest = exitMathTest;
window.loadMathPapers = loadMathPapers;

document.addEventListener("DOMContentLoaded", loadMathPapers);
