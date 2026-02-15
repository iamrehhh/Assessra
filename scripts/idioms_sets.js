// ==========================================
// IDIOMS MONTHLY SETS QUIZ SYSTEM
// ==========================================
// Organizes idioms into monthly sets (5 questions each)
// After 5 questions, user can optionally create a sentence

// NOTE: Will be expanded to 1800+ questions. Currently using existing 305 idioms with recycling.

//Import existing idioms from idioms_quiz.js
const idiomsPool = [];

// Month configuration (days per month for 2026)
const MONTHS_CONFIG_IDIOMS = {
    'January': 31,
    'February': 28,
    'March': 31,
    'April': 30,
    'May': 31,
    'June': 30,
    'July': 31,
    'August': 31,
    'September': 30,
    'October': 31,
    'November': 30,
    'December': 31
};

const MONTH_NAMES_IDIOMS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Current state
let currentMonthIdioms = 'January';
let currentSetNumberIdioms = null;
let currentSetQuestionsIdioms = [];
let currentQuestionIdioms = 0;
let setScoreIdioms = 0;
let idiomsForSentence = [];
let currentAttemptsIdioms = []; // Track full attempt details

// Global progress
let idiomsSetsProgress = {};

// ==========================================
// INITIALIZATION & LOADING
// ==========================================

async function initIdiomsSets() {
    await loadIdiomsSetsProgress();
    renderMonthSelectionIdioms();
}

async function loadIdiomsSetsProgress() {
    const localData = localStorage.getItem('idioms_sets_progress');
    if (localData) {
        try {
            idiomsSetsProgress = JSON.parse(localData);
        } catch (e) {
            console.error('Error parsing local idioms sets progress:', e);
            idiomsSetsProgress = {};
        }
    }

    try {
        const response = await fetch('/load_idioms_sets_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: window.StorageManager ? window.StorageManager.getUser() : 'default_user' })
        });
        const data = await response.json();

        if (data.progress) {
            idiomsSetsProgress = data.progress;
            localStorage.setItem('idioms_sets_progress', JSON.stringify(idiomsSetsProgress));
        }
    } catch (e) {
        console.error('Failed to load idioms sets progress from cloud:', e);
    }
}

async function saveIdiomsSetsProgress() {
    localStorage.setItem('idioms_sets_progress', JSON.stringify(idiomsSetsProgress));

    try {
        await fetch('/save_idioms_sets_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: window.StorageManager ? window.StorageManager.getUser() : 'default_user',
                progress: idiomsSetsProgress
            })
        });
    } catch (e) {
        console.error('Failed to save idioms sets progress to cloud:', e);
    }
}

// ==========================================
// RENDERING FUNCTIONS
// ==========================================

function renderMonthSelectionIdioms() {
    const container = document.getElementById('container-idioms');
    if (!container) return;

    const html = `
        <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 50px;">
                <h1 style="color: var(--lime-dark); font-size: 3rem; margin-bottom: 15px; font-weight: 800;">💬 Idioms Practice Sets</h1>
                <p style="color: #666; font-size: 1.2rem;">Choose a month and complete daily sets (5 idioms each)</p>
            </div>

            <!-- Month Selector -->
            <div style="text-align: center; margin-bottom: 40px;">
                <label style="font-size: 1.2rem; font-weight: 600; color: #333; margin-right: 15px;">Select Month:</label>
                <select id="month-selector-idioms" onchange="selectMonthIdioms(this.value)" style="
                    padding: 12px 20px;
                    font-size: 1.1rem;
                    border: 2px solid var(--lime-primary);
                    border-radius: 10px;
                    background: white;
                    cursor: pointer;
                    font-weight: 600;
                    color: var(--lime-dark);
                ">
                    ${MONTH_NAMES_IDIOMS.map(month => `
                        <option value="${month}" ${month === currentMonthIdioms ? 'selected' : ''}>${month} 2026</option>
                    `).join('')}
                </select>
            </div>

            <!-- Sets Grid Container -->
            <div id="sets-grid-container-idioms"></div>
        </div>
    `;

    container.innerHTML = html;
    renderSetsGridIdioms(currentMonthIdioms);
}

function renderSetsGridIdioms(month) {
    const container = document.getElementById('sets-grid-container-idioms');
    if (!container) return;

    const daysInMonth = MONTHS_CONFIG_IDIOMS[month];
    const monthProgress = idiomsSetsProgress[month] || {};

    const completedSets = Object.keys(monthProgress).filter(key => monthProgress[key].completed).length;
    const totalScore = Object.values(monthProgress).reduce((sum, set) => sum + (set.score || 0), 0);

    const html = `
        <!-- Month Statistics -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 30px; margin-bottom: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <h2 style="color: var(--lime-dark); margin: 0 0 20px 0; font-size: 1.8rem;">${month} 2026 Progress</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 800; color: #16a34a;">${completedSets}/${daysInMonth}</div>
                    <div style="color: #666; font-weight: 600;">Sets Completed</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 800; color: #16a34a;">${totalScore}</div>
                    <div style="color: #666; font-weight: 600;">Total Correct</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 800; color: #16a34a;">${Math.round((completedSets / daysInMonth) * 100)}%</div>
                    <div style="color: #666; font-weight: 600;">Month Complete</div>
                </div>
            </div>
        </div>

        <!-- Sets Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px;">
            ${Array.from({ length: daysInMonth }, (_, i) => {
        const setNum = i + 1;
        const setKey = `set_${setNum}`;
        const setData = monthProgress[setKey];

        let status = 'not-started';
        let statusIcon = '⭕';
        let statusColor = '#e5e7eb';
        let textColor = '#9ca3af';
        let clickHandler = `onclick="startSetIdioms('${month}', ${setNum})"`;

        // Check if we can generate questions (should be always yes for idioms now)
        // But let's check just in case
        const hasQuestions = true;

        if (setData) {
            if (setData.completed) {
                status = 'completed';
                statusIcon = '✅';
                statusColor = '#22c55e';
                textColor = '#16a34a';
                clickHandler = `onclick="reviewSetIdioms('${month}', ${setNum})"`;
            } else {
                status = 'in-progress';
                statusIcon = '🔄';
                statusColor = '#fbbf24';
                textColor = '#d97706';
            }
        }

        return `
                    <button ${clickHandler} style="
                        background: ${status === 'completed' ? '#f0fdf4' : status === 'in-progress' ? '#fffbeb' : 'white'};
                        border: 3px solid ${statusColor};
                        border-radius: 12px;
                        padding: 20px 15px;
                        cursor: pointer;
                        transition: all 0.2s;
                        text-align: center;
                    " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        <div style="font-size: 2rem; margin-bottom: 8px;">${statusIcon}</div>
                        <div style="font-weight: 700; font-size: 1.05rem; color: ${textColor};">Set ${setNum}</div>
                        ${setData ? `<div style="font-size: 0.85rem; color: #888; margin-top: 5px;">${setData.score || 0}/5</div>` : ''}
                    </button>
                `;
    }).join('')}
        </div>
    `;

    container.innerHTML = html;
}

function selectMonthIdioms(month) {
    currentMonthIdioms = month;
    renderSetsGridIdioms(month);
}

// ==========================================
// SET EXECUTION
// ==========================================

function startSetIdioms(month, setNumber) {
    currentMonthIdioms = month;
    currentSetNumberIdioms = setNumber;
    currentQuestionIdioms = 0;
    setScoreIdioms = 0;
    idiomsForSentence = [];
    currentAttemptsIdioms = []; // Reset attempts

    currentSetQuestionsIdioms = generateSetQuestionsIdioms(month, setNumber);

    // Safety check
    if (currentSetQuestionsIdioms.length === 0) {
        alert("Could not load questions. Please try refreshing the page.");
        return;
    }

    renderSetQuestionIdioms();
}

function generateSetQuestionsIdioms(month, setNumber) {
    // Ensure data is available
    if (!window.idiomsData || window.idiomsData.length === 0) {
        console.error("Idioms data not loaded");
        return [];
    }

    const pool = window.idiomsData;
    const questionsPerSet = 5;

    // Calculate a deterministic seed/start index
    // We want the same questions for the same set every time for consistency
    const monthIndex = MONTH_NAMES_IDIOMS.indexOf(month);

    // Calculate total sets before this month
    let totalSetsBefore = 0;
    for (let i = 0; i < monthIndex; i++) {
        totalSetsBefore += MONTHS_CONFIG_IDIOMS[MONTH_NAMES_IDIOMS[i]];
    }

    const globalSetIndex = totalSetsBefore + (setNumber - 1);
    const startIdx = (globalSetIndex * questionsPerSet) % pool.length;

    const setQuestions = [];

    for (let i = 0; i < questionsPerSet; i++) {
        // Use modulo to cycle through if we exceed pool length
        const dataIndex = (startIdx + i) % pool.length;
        const item = pool[dataIndex];

        // Use the existing helper to generate options
        // Assuming generateIdiomOptions is available globally or we recreate it
        // generateIdiomOptions is in idioms_quiz.js but NOT exposed.
        // We should replicate the logic or expose it. 
        // Let's implement local logic for safety to avoid dependency hell.

        const optionsObj = generateIdiomOptionsLocal(item.meaning, item.idiom, pool);

        setQuestions.push({
            idiom: item.idiom,
            options: optionsObj.options,
            correct: optionsObj.correct,
            category: "General" // Idioms don't have categories in the main file yet
        });
    }

    return setQuestions;
}

// Local helper to generate options (copied from idioms_quiz.js logic)
function generateIdiomOptionsLocal(correctMeaning, correctIdiom, pool) {
    // Get other meanings ensuring they're semantically close but distinct
    const allMeanings = pool
        .filter(item => item.meaning !== correctMeaning && item.idiom !== correctIdiom)
        .map(item => item.meaning);

    // Shuffle and pick 3 distractors. 
    // We use a simple random here because distractors don't strictly need to be deterministic 
    // as long as the main question is. But deterministic is better.
    // Let's just use random for now as it's simpler and fine for distractors.
    const shuffled = allMeanings.sort(() => 0.5 - Math.random());
    const distractors = shuffled.slice(0, 3);

    // Combine with correct answer and shuffle
    const options = [correctMeaning, ...distractors];
    const shuffledOptions = options.sort(() => 0.5 - Math.random());

    // Find correct index
    const correctIndex = shuffledOptions.indexOf(correctMeaning);

    return { options: shuffledOptions, correct: correctIndex };
}

function renderSetQuestionIdioms() {
    const container = document.getElementById('container-idioms');
    if (!container) return;

    if (currentQuestionIdioms >= 5) {
        renderSentenceCreationIdioms();
        return;
    }

    const q = currentSetQuestionsIdioms[currentQuestionIdioms];
    const progress = Math.round(((currentQuestionIdioms) / 5) * 100);

    const html = `
        <div style="max-width: 900px; margin: 40px auto; padding: 30px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button onclick="backToMonthViewIdioms()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
                    ← Back to ${currentMonthIdioms}
                </button>
                <h1 style="color: var(--lime-dark); font-size: 2rem; margin: 0;">Set ${currentSetNumberIdioms} - Question ${currentQuestionIdioms + 1}/5</h1>
                <div style="width: 120px;"></div>
            </div>

            <!-- Progress Bar -->
            <div style="background: #e5e7eb; border-radius: 10px; height: 12px; margin-bottom: 30px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--lime-primary) 0%, #16a34a 100%); height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
            </div>

            <!-- Question Card -->
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <h2 style="font-size: 2rem; color: var(--lime-dark); margin-bottom: 30px;">What does "<strong>${q.idiom}</strong>" mean?</h2>

                <!-- Options -->
                <div id="idioms-set-options" style="display: flex; flex-direction: column; gap: 15px;">
                    ${q.options.map((opt, idx) => `
                        <button class="idioms-set-option" onclick="selectSetAnswerIdioms(${idx})" style="
                            padding: 20px 25px;
                            border: 3px solid #e5e7eb;
                            border-radius: 12px;
                            background: white;
                            text-align: left;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 1.1rem;
                        " onmouseover="if(!this.disabled) { this.style.borderColor='var(--lime-primary)'; this.style.background='#f0fdf4'; }" onmouseout="if(!this.disabled) { this.style.borderColor='#e5e7eb'; this.style.background='white'; }">
                            <span style="display: inline-block; width: 30px; height: 30px; background: #f0f0f0; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 15px; font-weight: 700;">${String.fromCharCode(65 + idx)}</span>
                            ${opt}
                        </button>
                    `).join('')}
                </div>

                <div id="idioms-set-feedback" style="display: none; margin-top: 30px; padding: 20px; border-radius: 12px;"></div>
                <button id="next-set-question-btn-idioms" onclick="nextSetQuestionIdioms()" style="display: none; width: 100%; padding: 16px; margin-top: 20px; background: var(--lime-primary); color: white; border: none; border-radius: 10px; font-size: 1.15rem; font-weight: 700; cursor: pointer;">Next Question →</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function selectSetAnswerIdioms(selectedIdx) {
    const q = currentSetQuestionsIdioms[currentQuestionIdioms];
    const isCorrect = selectedIdx === q.correct;

    // Track attempt
    currentAttemptsIdioms.push({
        question: { ...q },
        userAnswer: selectedIdx,
        isCorrect: isCorrect
    });

    document.querySelectorAll('.idioms-set-option').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    const options = document.querySelectorAll('.idioms-set-option');
    options[q.correct].style.background = '#22c55e';
    options[q.correct].style.borderColor = '#22c55e';
    options[q.correct].style.color = 'white';

    if (!isCorrect) {
        options[selectedIdx].style.background = '#ef4444';
        options[selectedIdx].style.borderColor = '#ef4444';
        options[selectedIdx].style.color = 'white';
    } else {
        idiomsForSentence.push({ idiom: q.idiom, meaning: q.options[q.correct] });
        setScoreIdioms++;
        // Add to Daily Target
        if (window.StorageManager) {
            window.StorageManager.addDailyPoints('idioms', 1);
        }
    }

    const feedback = document.getElementById('idioms-set-feedback');
    feedback.style.display = 'block';
    feedback.style.background = isCorrect ? '#f0fdf4' : '#fef2f2';
    feedback.innerHTML = `
        <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px; font-size: 1.4rem;">
            ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </h3>
        <p style="font-size: 1.15rem; color: #333;">
            <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
        </p>
    `;

    document.getElementById('next-set-question-btn-idioms').style.display = 'block';
}

function nextSetQuestionIdioms() {
    currentQuestionIdioms++;
    renderSetQuestionIdioms();
}

function backToMonthViewIdioms() {
    renderMonthSelectionIdioms();
}

// ==========================================
// SENTENCE CREATION
// ==========================================

function renderSentenceCreationIdioms() {
    const container = document.getElementById('container-idioms');
    if (!container) return;

    const html = `
        <div style="max-width: 800px; margin: 60px auto; padding: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
                <h1 style="color: var(--lime-dark); font-size: 2.5rem; margin-bottom: 15px;">Set ${currentSetNumberIdioms} Complete!</h1>
                <div style="font-size: 2rem; font-weight: 800; color: #16a34a; margin-bottom: 10px;">${setScoreIdioms}/5 Correct</div>
            </div>

            ${idiomsForSentence.length > 0 ? `
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 16px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #f59e0b;">
                    <h2 style="color: #b45309; margin: 0 0 20px 0; font-size: 1.6rem;">✍️ Create Sentences (Optional)</h2>
                    <p style="color: #78350f; margin-bottom: 20px;">Write sentences using the idioms you got correct:</p>
                    
                    <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px;">
                        <strong style="color: #b45309;">Your Idioms:</strong>
                        ${idiomsForSentence.map(item => `<span style="display: inline-block; margin: 5px 10px 5px 0; padding: 5px 12px; background: #fef3c7; border-radius: 6px; font-weight: 600;">${item.idiom}</span>`).join('')}
                    </div>

                    <textarea id="user-sentence-set-idioms" placeholder="Write a sentence using one or more of these idioms..." style="width: 100%; padding: 15px; border: 2px solid #fbbf24; border-radius: 10px; font-size: 1.05rem; min-height: 100px; margin-bottom: 15px;"></textarea>

                    <div style="display: flex; gap: 15px;">
                        <button onclick="saveSentenceAndCompleteIdioms()" style="flex: 1; padding: 15px; background: #f59e0b; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;" onmouseover="this.style.background='#d97706'" onmouseout="this.style.background='#f59e0b'">
                            💾 Save Sentence & Complete
                        </button>
                        <button onclick="skipSentenceAndCompleteIdioms()" style="flex: 1; padding: 15px; background: #6b7280; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
                            ⏭️ Skip & Complete
                        </button>
                    </div>
                    <div id="sentence-save-feedback-idioms" style="margin-top: 15px; display: none;"></div>
                </div>
            ` : `
                <div style="text-align: center;">
                    <button onclick="completeSetIdioms()" style="padding: 15px 40px; background: var(--lime-primary); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">
                        Continue to ${currentMonthIdioms}
                    </button>
                </div>
            `}
        </div>
    `;

    container.innerHTML = html;
}

async function saveSentenceAndCompleteIdioms() {
    const sentenceInput = document.getElementById('user-sentence-set-idioms');
    const sentence = sentenceInput.value.trim();
    const feedbackDiv = document.getElementById('sentence-save-feedback-idioms');

    if (!sentence) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">⚠️ Please enter a sentence first!</p>';
        return;
    }

    try {
        // Save using proper endpoint
        await fetch('/save_sentence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: window.StorageManager ? window.StorageManager.getUser() : 'default_user',
                sentence_data: {
                    type: 'idiom',
                    idiom: idiomsForSentence.map(i => i.idiom).join(', '),
                    meaning: idiomsForSentence.map(i => i.meaning).join(', '),
                    userSentence: sentence
                }
            })
        });

        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #16a34a; font-weight: 600;">✅ Sentence saved!</p>';

        setTimeout(() => completeSetIdioms(sentence), 1000);
    } catch (e) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">❌ Failed to save.</p>';
        console.error(e);
    }
}

function skipSentenceAndCompleteIdioms() {
    completeSetIdioms(null);
}

function completeSetIdioms(userSentence = null) {
    if (!idiomsSetsProgress[currentMonthIdioms]) {
        idiomsSetsProgress[currentMonthIdioms] = {};
    }

    idiomsSetsProgress[currentMonthIdioms][`set_${currentSetNumberIdioms}`] = {
        completed: true,
        score: setScoreIdioms,
        timestamp: new Date().toISOString(),
        attempts: currentAttemptsIdioms,
        userSentence: userSentence
    };

    saveIdiomsSetsProgress();
    renderMonthSelectionIdioms();
}

// ==========================================
// REVIEW MODE
// ==========================================

function reviewSetIdioms(month, setNumber) {
    const setKey = `set_${setNumber}`;
    const setData = idiomsSetsProgress[month][setKey];

    if (!setData || !setData.attempts) {
        alert("No attempt data found for this set!");
        return;
    }

    const container = document.getElementById('container-idioms');
    if (!container) return;

    const html = `
        <div style="max-width: 900px; margin: 40px auto; padding: 30px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button onclick="backToMonthViewIdioms()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    ← Back to ${month}
                </button>
                <h1 style="color: var(--lime-dark); font-size: 2rem; margin: 0;">Review: Set ${setNumber}</h1>
                <button onclick="startSetIdioms('${month}', ${setNumber})" style="padding: 10px 20px; background: var(--lime-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    🔄 Re-attempt
                </button>
            </div>
            
            <!-- Score Summary -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px; text-align: center;">
                <div style="font-size: 2.5rem; font-weight: 800; color: #16a34a; margin-bottom: 10px;">${setData.score}/5 Correct</div>
                <div style="color: #666;">Completed on ${new Date(setData.timestamp).toLocaleString()}</div>
            </div>
            
            <!-- Questions Review -->
            ${setData.attempts.map((attempt, idx) => {
        const q = attempt.question;
        const isCorrect = attempt.isCorrect;
        return `
                    <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 20px; border-left: 5px solid ${isCorrect ? '#22c55e' : '#ef4444'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="color: var(--lime-dark); margin: 0;">Question ${idx + 1}: ${q.idiom}</h3>
                            <span style="font-size: 1.5rem;">${isCorrect ? '✅' : '❌'}</span>
                        </div>
                        
                        ${q.options.map((opt, optIdx) => {
            let optStyle = 'background: #f9fafb; border: 2px solid #e5e7eb;';
            if (optIdx === q.correct) {
                optStyle = 'background: #22c55e; border: 2px solid #22c55e; color: white;';
            } else if (optIdx === attempt.userAnswer && !isCorrect) {
                optStyle = 'background: #ef4444; border: 2px solid #ef4444; color: white;';
            }
            return `
                            <div style="${optStyle} padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                                <span style="font-weight: 700; margin-right: 10px;">${String.fromCharCode(65 + optIdx)}.</span>
                                ${opt}
                                ${optIdx === q.correct ? ' <span style="margin-left: 10px;">✓ Correct Answer</span>' : ''}
                                ${optIdx === attempt.userAnswer && !isCorrect ? ' <span style="margin-left: 10px;">✗ Your Answer</span>' : ''}
                            </div>
                        `;
        }).join('')}
                    </div>
                `;
    }).join('')}
            
            <!-- User Sentence -->
            ${setData.userSentence ? `
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; padding: 25px; margin-top: 30px;">
                    <h3 style="color: #b45309; margin: 0 0 15px 0;">✍️ Your Sentence</h3>
                    <p style="font-size: 1.1rem; color: #78350f; font-style: italic; margin: 0;">
                        "${setData.userSentence}"
                    </p>
                </div>
            ` : ''}
        </div>
    `;

    container.innerHTML = html;
}

// ==========================================
// EXPOSE TO WINDOW
// ==========================================

window.initIdiomsSets = initIdiomsSets;
window.selectMonthIdioms = selectMonthIdioms;
window.startSetIdioms = startSetIdioms;
window.selectSetAnswerIdioms = selectSetAnswerIdioms;
window.nextSetQuestionIdioms = nextSetQuestionIdioms;
window.backToMonthViewIdioms = backToMonthViewIdioms;
window.saveSentenceAndCompleteIdioms = saveSentenceAndCompleteIdioms;
window.skipSentenceAndCompleteIdioms = skipSentenceAndCompleteIdioms;
window.completeSetIdioms = completeSetIdioms;
window.reviewSetIdioms = reviewSetIdioms;
