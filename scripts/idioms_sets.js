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
        <div class="practice-container">
            <!-- Header -->
            <div class="practice-header">
                <h1 class="practice-title">💬 Idioms Practice</h1>
                <p class="practice-subtitle">Master expressions with daily 5-question sets</p>
            </div>

            <!-- Month Selector -->
            <div class="month-selector-container">
                <label class="month-label">Select Month:</label>
                <select id="month-selector-idioms" onchange="selectMonthIdioms(this.value)" class="month-select">
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
        <div class="stats-card">
            <h2 class="stats-title">${month} 2026 Progress</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${completedSets}/${daysInMonth}</div>
                    <div class="stat-label">Sets Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${totalScore}</div>
                    <div class="stat-label">Total Correct</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round((completedSets / daysInMonth) * 100)}%</div>
                    <div class="stat-label">Month Complete</div>
                </div>
            </div>
        </div>

        <!-- Sets Grid -->
        <div class="sets-grid">
            ${Array.from({ length: daysInMonth }, (_, i) => {
        const setNum = i + 1;
        const setKey = `set_${setNum}`;
        const setData = monthProgress[setKey];

        let status = 'not-started';
        let statusIcon = '⭕';
        let clickHandler = `onclick="startSetIdioms('${month}', ${setNum})"`;

        // Check if we can generate questions (should be always yes for idioms now)
        // But let's check just in case
        const hasQuestions = true;

        if (setData) {
            if (setData.completed) {
                status = 'completed';
                statusIcon = '✅';
                clickHandler = `onclick="reviewSetIdioms('${month}', ${setNum})"`;
            } else {
                status = 'in-progress';
                statusIcon = '🔄';
            }
        }

        return `
                    <div class="set-card ${status}" ${clickHandler}>
                        <div class="set-icon">${statusIcon}</div>
                        <div class="set-number">Set ${setNum}</div>
                        ${setData ? `<div class="set-score">${setData.score || 0}/5 Correct</div>` : ''}
                    </div>
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
    // ---- 7-SET DAILY LIMIT ----
    const today = new Date().toISOString().split('T')[0];
    const limitKey = 'idioms_sets_daily_' + today;
    const dailyCount = parseInt(localStorage.getItem(limitKey) || '0', 10);
    if (dailyCount >= 7) {
        showToast('⚠️ You\'ve reached your daily limit of 7 idiom sets. Come back tomorrow!');
        return;
    }
    // Increment daily counter
    localStorage.setItem(limitKey, String(dailyCount + 1));
    // ----------------------------

    currentMonthIdioms = month;
    currentSetNumberIdioms = setNumber;
    currentQuestionIdioms = 0;
    setScoreIdioms = 0;
    idiomsForSentence = [];
    currentAttemptsIdioms = []; // Reset attempts

    currentSetQuestionsIdioms = generateSetQuestionsIdioms(month, setNumber);

    // Safety check
    if (currentSetQuestionsIdioms.length === 0) {
        showToast("Could not load questions. Please try refreshing the page.");
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
        <div class="question-container">
            <!-- Header -->
            <div class="question-header">
                <button onclick="backToMonthViewIdioms()" class="back-btn">
                    <span>←</span> Back
                </button>
                <div style="color: #64748b; font-weight: 600;">Question ${currentQuestionIdioms + 1}/5</div>
            </div>

            <!-- Progress Bar -->
            <div class="question-progress-track">
                <div class="question-progress-fill" style="width: ${progress}%;"></div>
            </div>

            <!-- Question Content -->
            <div style="text-align: center;">
                <h2 class="question-text">What does "<strong>${q.idiom}</strong>" mean?</h2>

                <!-- Options -->
                <div class="options-grid" id="idioms-set-options">
                    ${q.options.map((opt, idx) => `
                        <button class="option-card" onclick="selectSetAnswerIdioms(${idx})">
                            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                            ${opt}
                        </button>
                    `).join('')}
                </div>

                <!-- Feedback Area -->
                <div id="idioms-set-feedback"></div>

                <!-- Next Button -->
                <button id="next-set-question-btn-idioms" onclick="nextSetQuestionIdioms()" class="next-btn">Next Question →</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

async function selectSetAnswerIdioms(selectedIdx) {
    const q = currentSetQuestionsIdioms[currentQuestionIdioms];
    const isCorrect = selectedIdx === q.correct;

    // Track attempt
    currentAttemptsIdioms.push({
        question: { ...q },
        userAnswer: selectedIdx,
        isCorrect: isCorrect
    });

    document.querySelectorAll('#idioms-set-options .option-card').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    const options = document.querySelectorAll('#idioms-set-options .option-card');
    options[q.correct].style.background = '#22c55e';
    options[q.correct].style.borderColor = '#22c55e';
    options[q.correct].style.color = 'white';

    if (!isCorrect) {
        options[selectedIdx].style.background = '#ef4444';
        options[selectedIdx].style.borderColor = '#ef4444';
        options[selectedIdx].style.color = 'white';
        // Collect wrong idioms for sentence practice
        idiomsForSentence.push({ idiom: q.idiom, meaning: q.options[q.correct] });
    } else {
        setScoreIdioms++;
        // Add to Daily Target
        if (window.StorageManager) {
            window.StorageManager.addDailyPoints('idioms', 1);
        }
    }

    // Show loading feedback
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
        <div style="text-align: center; color: #666; margin-top: 10px;">⏳ Loading AI insights...</div>
    `;

    // Fetch AI example + similar idioms
    try {
        const response = await fetch('/vocab-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word: q.idiom, type: 'idiom' })
        });
        const aiData = await response.json();

        const synonymsHtml = aiData.synonyms && aiData.synonyms.length > 0
            ? `<div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); padding: 16px 20px; border-radius: 10px; border-left: 5px solid #8b5cf6; margin-top: 12px;">
                    <strong style="color: #7c3aed; font-size: 1rem;">🔗 Similar Idioms:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                        ${aiData.synonyms.map(s => `<span style="background: white; color: #7c3aed; padding: 6px 14px; border-radius: 20px; font-size: 0.95rem; font-weight: 600; border: 1.5px solid #c4b5fd;">${s}</span>`).join('')}
                    </div>
               </div>` : '';

        feedback.innerHTML = `
            <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px; font-size: 1.4rem;">
                ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p style="font-size: 1.15rem; color: #333;">
                <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
            </p>
            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f0fdf4 100%); padding: 20px; border-radius: 10px; border-left: 5px solid var(--lime-primary); margin-top: 12px;">
                <strong style="color: var(--lime-dark); font-size: 1.1rem;">📝 Example Sentence:</strong><br>
                <span style="font-style: italic; color: #333; font-size: 1.05rem; line-height: 1.6;">${aiData.example || 'Example unavailable.'}</span>
            </div>
            ${synonymsHtml}
        `;
    } catch (e) {
        console.error('Failed to fetch AI data for idiom set:', e);
    }

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
                <p style="color: #666; font-size: 1.1rem;">${idiomsForSentence.length > 0 ? 'Practice the idioms you missed by writing sentences.' : 'Perfect score! 🎯'}</p>
            </div>

            ${idiomsForSentence.length > 0 ? `
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 16px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #f59e0b;">
                    <h2 style="color: #b45309; margin: 0 0 20px 0; font-size: 1.6rem;">✍️ Practice Missed Idioms (Optional)</h2>
                    <p style="color: #78350f; margin-bottom: 20px;">Write sentences using the idioms you got wrong to reinforce your learning:</p>
                    
                    <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px;">
                        <strong style="color: #b45309;">Idioms to Practice:</strong>
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
        showToast("No attempt data found for this set!");
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
