// ==========================================
// VOCABULARY MONTHLY SETS QUIZ SYSTEM
// ==========================================
// Organizes vocab into monthly sets (5 questions each)
// After 5 questions, user can optionally create a sentence

// NOTE: Will be expanded to 1800+ questions. Currently using existing 208 questions with recycling.

// Import existing vocab questions from vocab_quiz.js
// For now, we'll define a subset here and expand later
const vocabQuestionsPool = [
    // This will be populated with 1800+ questions
    // Current: 208 questions from vocab_quiz.js (will be copied and expanded)
];

// Month configuration (days per month for 2026)
const MONTHS_CONFIG = {
    'January': 31,
    'February': 28, // 2026 is not a leap year
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

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Current state
let currentMonth = 'January';
let currentSetNumber = null;
let currentSetQuestions = [];
let currentQuestion = 0;
let setScore = 0;
let wordsForSentence = []; // Words from correct answers

// Global progress data structure
let vocabSetsProgress = {
    // Structure: { 'January': { 'set_1': {completed: true, score: 5, words: ['word1', 'word2']}, ... }, ... }
};

// ==========================================
// INITIALIZATION & LOADING
// ==========================================

async function initVocabSets() {
    // TODO: Populate vocabQuestionsPool with 1800+ questions
    // For now, will be done in phases

    await loadVocabSetsProgress();
    renderMonthSelection();
}

async function loadVocabSetsProgress() {
    // Load from localStorage first
    const localData = localStorage.getItem('vocab_sets_progress');
    if (localData) {
        try {
            vocabSetsProgress = JSON.parse(localData);
        } catch (e) {
            console.error('Error parsing local vocab sets progress:', e);
            vocabSetsProgress = {};
        }
    }

    // Sync with cloud
    try {
        const response = await fetch('/load_vocab_sets_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: 'default_user' })
        });
        const data = await response.json();

        if (data.progress) {
            vocabSetsProgress = data.progress;
            // Save to localStorage
            localStorage.setItem('vocab_sets_progress', JSON.stringify(vocabSetsProgress));
        }
    } catch (e) {
        console.error('Failed to load vocab sets progress from cloud:', e);
    }
}

async function saveVocabSetsProgress() {
    // Save to localStorage immediately
    localStorage.setItem('vocab_sets_progress', JSON.stringify(vocabSetsProgress));

    // Save to cloud
    try {
        await fetch('/save_vocab_sets_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                progress: vocabSetsProgress
            })
        });
    } catch (e) {
        console.error('Failed to save vocab sets progress to cloud:', e);
    }
}

// ==========================================
// RENDERING FUNCTIONS
// ==========================================

function renderMonthSelection() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    const html = `
        <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 50px;">
                <h1 style="color: var(--lime-dark); font-size: 3rem; margin-bottom: 15px; font-weight: 800;">📚 Vocabulary Practice Sets</h1>
                <p style="color: #666; font-size: 1.2rem;">Choose a month and complete daily sets (5 questions each)</p>
            </div>

            <!-- Month Selector -->
            <div style="text-align: center; margin-bottom: 40px;">
                <label style="font-size: 1.2rem; font-weight: 600; color: #333; margin-right: 15px;">Select Month:</label>
                <select id="month-selector" onchange="selectMonth(this.value)" style="
                    padding: 12px 20px;
                    font-size: 1.1rem;
                    border: 2px solid var(--lime-primary);
                    border-radius: 10px;
                    background: white;
                    cursor: pointer;
                    font-weight: 600;
                    color: var(--lime-dark);
                ">
                    ${MONTH_NAMES.map(month => `
                        <option value="${month}" ${month === currentMonth ? 'selected' : ''}>${month} 2026</option>
                    `).join('')}
                </select>
            </div>

            <!-- Sets Grid Container -->
            <div id="sets-grid-container"></div>
        </div>
    `;

    container.innerHTML = html;
    renderSetsGrid(currentMonth);
}

function renderSetsGrid(month) {
    const container = document.getElementById('sets-grid-container');
    if (!container) return;

    const daysInMonth = MONTHS_CONFIG[month];
    const monthProgress = vocabSetsProgress[month] || {};

    // Calculate statistics
    const completedSets = Object.keys(monthProgress).filter(key => monthProgress[key].completed).length;
    const totalScore = Object.values(monthProgress).reduce((sum, set) => sum + (set.score || 0), 0);
    const totalAttempted = Object.keys(monthProgress).length;

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

        if (setData) {
            if (setData.completed) {
                status = 'completed';
                statusIcon = '✅';
                statusColor = '#22c55e';
                textColor = '#16a34a';
            } else {
                status = 'in-progress';
                statusIcon = '🔄';
                statusColor = '#fbbf24';
                textColor = '#d97706';
            }
        }

        return `
                    <button onclick="startSet('${month}', ${setNum})" style="
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

function selectMonth(month) {
    currentMonth = month;
    renderSetsGrid(month);
}

// ==========================================
// SET EXECUTION
// ==========================================

function startSet(month, setNumber) {
    currentMonth = month;
    currentSetNumber = setNumber;
    currentQuestion = 0;
    setScore = 0;
    wordsForSentence = [];

    // Generate 5 unique questions for this set
    // TODO: When we have 1800+ questions, we'll use proper set allocation
    // For now, we'll use the recycling approach
    currentSetQuestions = generateSetQuestions(month, setNumber);

    renderSetQuestion();
}

function generateSetQuestions(month, setNumber) {
    // TODO: Implement proper allocation when we have 1800+ questions
    // For now, return placeholder structure
    // This will be replaced once we populate vocabQuestionsPool

    const placeholderQuestions = [
        { word: "Mendacious", options: ["Truthful", "Deceitful", "Brave", "Silent"], correct: 1, category: "Deception" },
        { word: "Perspicacious", options: ["Dull", "Perceptive", "Brave", "Quiet"], correct: 1, category: "Intelligence" },
        { word: "Avarice", options: ["Extreme greed", "Generosity", "Charity", "Kindness"], correct: 0, category: "Greed" },
        { word: "Ephemeral", options: ["Lasting very briefly", "Permanent", "Eternal", "Enduring"], correct: 0, category: "Temporary" },
        { word: "Laconic", options: ["Verbose", "Brief in speech", "Cowardly", "Greedy"], correct: 1, category: "Silence" }
    ];

    return placeholderQuestions;
}

function renderSetQuestion() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    if (currentQuestion >= 5) {
        // All 5 questions answered, show sentence creation prompt
        renderSentenceCreation();
        return;
    }

    const q = currentSetQuestions[currentQuestion];
    const progress = Math.round(((currentQuestion) / 5) * 100);

    const html = `
        <div style="max-width: 900px; margin: 40px auto; padding: 30px;">
            <!-- Header with Back Button -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button onclick="backToMonthView()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
                    ← Back to ${currentMonth}
                </button>
                <h1 style="color: var(--lime-dark); font-size: 2rem; margin: 0;">Set ${currentSetNumber} - Question ${currentQuestion + 1}/5</h1>
                <div style="width: 120px;"></div>
            </div>

            <!-- Progress Bar -->
            <div style="background: #e5e7eb; border-radius: 10px; height: 12px; margin-bottom: 30px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--lime-primary) 0%, #16a34a 100%); height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
            </div>

            <!-- Question Card -->
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-bottom: 30px;">
                <div style="font-size: 1rem; color: #888; margin-bottom: 15px; font-weight: 600;">📚 Category: ${q.category}</div>
                <h2 style="font-size: 2rem; color: var(--lime-dark); margin-bottom: 30px;">What does "<strong>${q.word}</strong>" mean?</h2>

                <!-- Options -->
                <div id="vocab-set-options" style="display: flex; flex-direction: column; gap: 15px;">
                    ${q.options.map((opt, idx) => `
                        <button class="vocab-set-option" data-index="${idx}" onclick="selectSetAnswer(${idx})" style="
                            padding: 20px 25px;
                            border: 3px solid #e5e7eb;
                            border-radius: 12px;
                            background: white;
                            text-align: left;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 1.1rem;
                            font-weight: 500;
                        " onmouseover="if(!this.disabled) { this.style.borderColor='var(--lime-primary)'; this.style.background='#f0fdf4'; }" onmouseout="if(!this.disabled) { this.style.borderColor='#e5e7eb'; this.style.background='white'; }">
                            <span style="display: inline-block; width: 30px; height: 30px; background: #f0f0f0; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 15px; font-weight: 700;">${String.fromCharCode(65 + idx)}</span>
                            ${opt}
                        </button>
                    `).join('')}
                </div>

                <!-- Feedback Area -->
                <div id="vocab-set-feedback" style="display: none; margin-top: 30px; padding: 20px; border-radius: 12px;"></div>

                <!-- Next Button -->
                <button id="next-set-question-btn" onclick="nextSetQuestion()" style="
                    display: none;
                    width: 100%;
                    padding: 16px;
                    margin-top: 20px;
                    background: var(--lime-primary);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.15rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#84cc16'" onmouseout="this.style.background='var(--lime-primary)'">Next Question →</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function selectSetAnswer(selectedIdx) {
    const q = currentSetQuestions[currentQuestion];
    const isCorrect = selectedIdx === q.correct;

    // Disable all options
    document.querySelectorAll('.vocab-set-option').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    // Highlight correct and incorrect
    const options = document.querySelectorAll('.vocab-set-option');
    options[q.correct].style.background = '#22c55e';
    options[q.correct].style.borderColor = '#22c55e';
    options[q.correct].style.color = 'white';

    if (!isCorrect) {
        options[selectedIdx].style.background = '#ef4444';
        options[selectedIdx].style.borderColor = '#ef4444';
        options[selectedIdx].style.color = 'white';
    } else {
        // Track word for sentence creation
        wordsForSentence.push({ word: q.word, definition: q.options[q.correct] });
        setScore++;
    }

    // Show feedback
    const feedback = document.getElementById('vocab-set-feedback');
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

    document.getElementById('next-set-question-btn').style.display = 'block';
}

function nextSetQuestion() {
    currentQuestion++;
    renderSetQuestion();
}

function backToMonthView() {
    renderMonthSelection();
}

// ==========================================
// SENTENCE CREATION
// ==========================================

function renderSentenceCreation() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    // Only show words from correct answers
    const wordsToDisplay = wordsForSentence.length > 0 ? wordsForSentence :
        [{ word: "No words", definition: "You didn't answer any questions correctly" }];

    const html = `
        <div style="max-width: 800px; margin: 60px auto; padding: 40px;">
            <!-- Completion Message -->
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
                <h1 style="color: var(--lime-dark); font-size: 2.5rem; margin-bottom: 15px;">Set ${currentSetNumber} Complete!</h1>
                <div style="font-size: 2rem; font-weight: 800; color: #16a34a; margin-bottom: 10px;">${setScore}/5 Correct</div>
                <p style="color: #666; font-size: 1.1rem;">Great job! ${wordsForSentence.length > 0 ? 'Now practice these words by creating sentences.' : ''}</p>
            </div>

            ${wordsForSentence.length > 0 ? `
                <!-- Sentence Creation (Optional) -->
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 16px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #f59e0b;">
                    <h2 style="color: #b45309; margin: 0 0 20px 0; font-size: 1.6rem;">✍️ Create Sentences (Optional)</h2>
                    <p style="color: #78350f; margin-bottom: 20px;">Write sentences using the words you got correct to reinforce your learning:</p>
                    
                    <!-- Words List -->
                    <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px;">
                        <strong style="color: #b45309;">Your Words:</strong>
                        ${wordsForSentence.map(item => `<span style="display: inline-block; margin: 5px 10px 5px 0; padding: 5px 12px; background: #fef3c7; border-radius: 6px; font-weight: 600;">${item.word}</span>`).join('')}
                    </div>

                    <!-- Sentence Input -->
                    <textarea id="user-sentence-set" placeholder="Write a sentence using one or more of these words..." style="width: 100%; padding: 15px; border: 2px solid #fbbf24; border-radius: 10px; font-size: 1.05rem; min-height: 100px; resize: vertical; margin-bottom: 15px;"></textarea>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 15px;">
                        <button onclick="saveSentenceAndComplete()" style="flex: 1; padding: 15px; background: #f59e0b; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#d97706'" onmouseout="this.style.background='#f59e0b'">
                            💾 Save Sentence & Complete
                        </button>
                        <button onclick="skipSentenceAndComplete()" style="flex: 1; padding: 15px; background: #6b7280; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
                            ⏭️ Skip & Complete
                        </button>
                    </div>
                    <div id="sentence-save-feedback" style="margin-top: 15px; display: none;"></div>
                </div>
            ` : `
                <!-- No Correct Answers -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <button onclick="completeSet()" style="padding: 15px 40px; background: var(--lime-primary); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#84cc16'" onmouseout="this.style.background='var(--lime-primary)'">
                        Continue to ${currentMonth}
                    </button>
                </div>
            `}
        </div>
    `;

    container.innerHTML = html;
}

async function saveSentenceAndComplete() {
    const sentenceInput = document.getElementById('user-sentence-set');
    const sentence = sentenceInput.value.trim();
    const feedbackDiv = document.getElementById('sentence-save-feedback');

    if (!sentence) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">⚠️ Please enter a sentence first!</p>';
        return;
    }

    // Save sentence to backend
    try {
        for (const item of wordsForSentence) {
            await fetch('/save_sentence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'default_user',
                    sentence_data: {
                        type: 'vocab',
                        word: item.word,
                        definition: item.definition,
                        userSentence: sentence
                    }
                })
            });
        }

        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #16a34a; font-weight: 600;">✅ Sentence saved successfully!</p>';

        setTimeout(() => {
            completeSet();
        }, 1000);
    } catch (e) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">❌ Failed to save. Please try again.</p>';
        console.error('Failed to save sentence:', e);
    }
}

function skipSentenceAndComplete() {
    completeSet();
}

function completeSet() {
    // Mark set as completed
    if (!vocabSetsProgress[currentMonth]) {
        vocabSetsProgress[currentMonth] = {};
    }

    vocabSetsProgress[currentMonth][`set_${currentSetNumber}`] = {
        completed: true,
        score: setScore,
        words: wordsForSentence.map(item => item.word)
    };

    saveVocabSetsProgress();

    // Return to month view
    renderMonthSelection();
}

// ==========================================
// EXPOSE FUNCTIONS TO WINDOW
// ==========================================

window.initVocabSets = initVocabSets;
window.selectMonth = selectMonth;
window.startSet = startSet;
window.selectSetAnswer = selectSetAnswer;
window.nextSetQuestion = nextSetQuestion;
window.backToMonthView = backToMonthView;
window.saveSentenceAndComplete = saveSentenceAndComplete;
window.skipSentenceAndComplete = skipSentenceAndComplete;
window.completeSet = completeSet;
