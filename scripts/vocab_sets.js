// ==========================================
// VOCABULARY MONTHLY SETS QUIZ SYSTEM
// ==========================================
// Organizes vocab into monthly sets (5 questions each)
// After 5 questions, user can optionally create a sentence

// NOTE: Expanding to 1800+ questions. Currently 50 AI-generated questions.

// Vocabulary Questions Pool - Will be expanded to 1800+
const vocabQuestionsPool = [
    // Batch 1: 50 AI-Generated Questions (User Provided)
    {
        "word": "Chicanery",
        "options": ["Financial stability", "Political diplomacy", "Sincere negotiation", "Clever deception"],
        "correct": 3,
        "category": "Deception"
    },
    {
        "word": "Mendacity",
        "options": ["Untruthfulness", "Aggressive behavior", "Mental fortitude", "Charitable giving"],
        "correct": 0,
        "category": "Deception"
    },
    {
        "word": "Specious",
        "options": ["Widely accepted", "Thoroughly researched", "Deceptively attractive", "Intentionally vague"],
        "correct": 2,
        "category": "Deception"
    },
    {
        "word": "Equivocate",
        "options": ["To balance exactly", "To speak ambiguously", "To surrender openly", "To promise sincerely"],
        "correct": 1,
        "category": "Deception"
    },
    {
        "word": "Prevaricate",
        "options": ["To deviate from the truth", "To prepare in advance", "To act impulsively", "To state clearly"],
        "correct": 0,
        "category": "Deception"
    },
    {
        "word": "Surreptitious",
        "options": ["Overly confident", "Highly suspicious", "Kept secret", "Aggressively overt"],
        "correct": 2,
        "category": "Deception"
    },
    {
        "word": "Perfidious",
        "options": ["Extremely accurate", "Easily influenced", "Highly respected", "Deliberately disloyal"],
        "correct": 3,
        "category": "Deception"
    },
    {
        "word": "Erudite",
        "options": ["Socially awkward", "Showing great knowledge", "Easily confused", "Speaking softly"],
        "correct": 1,
        "category": "Intelligence"
    },
    {
        "word": "Perspicacious",
        "options": ["Having ready insight", "Lacking clear vision", "Overly complex", "Stubbornly ignorant"],
        "correct": 0,
        "category": "Intelligence"
    },
    {
        "word": "Pedantic",
        "options": ["Teaching effectively", "Lacking formal education", "Overly concerned with rules", "Walking extensively"],
        "correct": 2,
        "category": "Intelligence"
    },
    {
        "word": "Recondite",
        "options": ["Widely celebrated", "Obscure and profound", "Recently discovered", "Easily accessible"],
        "correct": 1,
        "category": "Intelligence"
    },
    {
        "word": "Esoteric",
        "options": ["Universally appealing", "Overly simplified", "Outwardly focused", "Understood by few"],
        "correct": 3,
        "category": "Intelligence"
    },
    {
        "word": "Sagacious",
        "options": ["Having good judgment", "Lacking basic sense", "Acting impulsively", "Speaking loudly"],
        "correct": 0,
        "category": "Intelligence"
    },
    {
        "word": "Acumen",
        "options": ["Financial deficit", "Mathematical error", "Keen business insight", "Corporate restructuring"],
        "correct": 2,
        "category": "Business"
    },
    {
        "word": "Sycophant",
        "options": ["A visionary leader", "An independent thinker", "A harsh critic", "A flattering yes-man"],
        "correct": 3,
        "category": "Business"
    },
    {
        "word": "Fiduciary",
        "options": ["Relating to physical assets", "Involving financial trust", "Lacking legal standing", "Concerning corporate governance"],
        "correct": 1,
        "category": "Business"
    },
    {
        "word": "Pecuniary",
        "options": ["Relating to money", "Unique in nature", "Involving property", "Relating to contracts"],
        "correct": 0,
        "category": "Business"
    },
    {
        "word": "Remuneration",
        "options": ["Job termination", "Performance review", "Financial compensation", "Task delegation"],
        "correct": 2,
        "category": "Business"
    },
    {
        "word": "Lucrative",
        "options": ["Highly risky", "Producing great profit", "Failing consistently", "Requiring immense effort"],
        "correct": 1,
        "category": "Business"
    },
    {
        "word": "Fungible",
        "options": ["Easily broken", "Rapidly growing", "Unique and irreplaceable", "Mutually interchangeable"],
        "correct": 3,
        "category": "Business"
    },
    {
        "word": "Profligate",
        "options": ["Recklessly extravagant", "Highly profitable", "Carefully invested", "Financially secure"],
        "correct": 0,
        "category": "Business"
    },
    {
        "word": "Insolvent",
        "options": ["Highly liquid", "Chemically unstable", "Unable to pay debts", "Earning compound interest"],
        "correct": 2,
        "category": "Business"
    },
    {
        "word": "Obsequious",
        "options": ["Rude and dismissive", "Excessively submissive", "Quietly observant", "Loudly argumentative"],
        "correct": 1,
        "category": "Behavior"
    },
    {
        "word": "Recalcitrant",
        "options": ["Eager to please", "Quick to forgive", "Easily persuaded", "Stubbornly uncooperative"],
        "correct": 3,
        "category": "Behavior"
    },
    {
        "word": "Intransigent",
        "options": ["Unwilling to compromise", "Moving between places", "Acting transparently", "Changing frequently"],
        "correct": 0,
        "category": "Behavior"
    },
    {
        "word": "Capricious",
        "options": ["Steadfast and reliable", "Carefully planned", "Given to sudden mood changes", "Governed by strict logic"],
        "correct": 2,
        "category": "Behavior"
    },
    {
        "word": "Fastidious",
        "options": ["Working very quickly", "Very attentive to detail", "Ignoring basic rules", "Eating indiscriminately"],
        "correct": 1,
        "category": "Behavior"
    },
    {
        "word": "Magnanimous",
        "options": ["Physically imposing", "Highly intelligent", "Extremely wealthy", "Generous and forgiving"],
        "correct": 3,
        "category": "Behavior"
    },
    {
        "word": "Pusillanimous",
        "options": ["Showing a lack of courage", "Demonstrating great strength", "Acting aggressively", "Speaking eloquently"],
        "correct": 0,
        "category": "Behavior"
    },
    {
        "word": "Truculent",
        "options": ["Peaceful and calm", "Highly honest", "Eager or quick to argue", "Easily deceived"],
        "correct": 2,
        "category": "Behavior"
    },
    {
        "word": "Loquacious",
        "options": ["Quiet and reserved", "Tending to talk profusely", "Speaking very softly", "Using complex words"],
        "correct": 1,
        "category": "Communication"
    },
    {
        "word": "Taciturn",
        "options": ["Always complaining", "Speaking rapidly", "Highly expressive", "Uncommunicative in speech"],
        "correct": 3,
        "category": "Communication"
    },
    {
        "word": "Garrulous",
        "options": ["Excessively talkative", "Physically aggressive", "Highly secretive", "Carefully spoken"],
        "correct": 0,
        "category": "Communication"
    },
    {
        "word": "Grandiloquent",
        "options": ["Speaking plainly", "Using vulgar language", "Pompous or extravagant in language", "Whispering quietly"],
        "correct": 2,
        "category": "Communication"
    },
    {
        "word": "Vituperate",
        "options": ["To praise highly", "To blame or insult with strong language", "To speak clearly", "To summarize effectively"],
        "correct": 1,
        "category": "Communication"
    },
    {
        "word": "Polemic",
        "options": ["A brief summary", "A neutral observation", "A poetic verse", "A strong verbal or written attack"],
        "correct": 3,
        "category": "Communication"
    },
    {
        "word": "Platitude",
        "options": ["A remark with empty meaning", "A profound realization", "A complex argument", "A unique perspective"],
        "correct": 0,
        "category": "Communication"
    },
    {
        "word": "Inscrutable",
        "options": ["Easily deciphered", "Thoroughly analyzed", "Impossible to understand", "Carefully organized"],
        "correct": 2,
        "category": "Complexity"
    },
    {
        "word": "Labyrinthine",
        "options": ["Straight and narrow", "Highly intricate and twisting", "Simple and clear", "Short and direct"],
        "correct": 1,
        "category": "Complexity"
    },
    {
        "word": "Convoluted",
        "options": ["Logically sound", "Easily explained", "Highly controversial", "Extremely complex and difficult to follow"],
        "correct": 3,
        "category": "Complexity"
    },
    {
        "word": "Enigmatic",
        "options": ["Mysterious and difficult to interpret", "Clear and obvious", "Scientifically proven", "Historically accurate"],
        "correct": 0,
        "category": "Complexity"
    },
    {
        "word": "Intractable",
        "options": ["Easily managed", "Physically broken", "Hard to control or deal with", "Quickly repaired"],
        "correct": 2,
        "category": "Complexity"
    },
    {
        "word": "Quagmire",
        "options": ["A solid foundation", "A hazardous or complex situation", "A clear pathway", "A sudden realization"],
        "correct": 1,
        "category": "Complexity"
    },
    {
        "word": "Ephemeral",
        "options": ["Lasting forever", "Occurring monthly", "Highly predictable", "Lasting for a very short time"],
        "correct": 3,
        "category": "Time and Change"
    },
    {
        "word": "Evanescent",
        "options": ["Quickly fading from sight or memory", "Growing continually", "Remaining permanently", "Changing periodically"],
        "correct": 0,
        "category": "Time and Change"
    },
    {
        "word": "Mitigate",
        "options": ["To increase in size", "To initiate a process", "To make less severe or painful", "To completely destroy"],
        "correct": 2,
        "category": "Time and Change"
    },
    {
        "word": "Exacerbate",
        "options": ["To heal completely", "To make a problem or bad situation worse", "To ignore entirely", "To solve efficiently"],
        "correct": 1,
        "category": "Time and Change"
    },
    {
        "word": "Ameliorate",
        "options": ["To cause deliberate harm", "To mix thoroughly", "To break apart", "To make something bad better"],
        "correct": 3,
        "category": "Time and Change"
    },
    {
        "word": "Inexorable",
        "options": ["Impossible to stop or prevent", "Easily persuaded", "Highly flexible", "Changing frequently"],
        "correct": 0,
        "category": "Time and Change"
    },
    {
        "word": "Anachronistic",
        "options": ["Perfectly timed", "Chronologically ordered", "Belonging to a period other than that portrayed", "Occurring simultaneously"],
        "correct": 2,
        "category": "Time and Change"
    }
    // TODO: Add more batches to reach 1800+ questions
];

// Import existing vocab questions from vocab_quiz.js
// For now, we'll define a subset here and expand later
// Generate unique questions for each set (NO REPEATS)
function generateSetQuestions(month, setNumber) {
    // Calculate global set index across all months
    const monthIndex = MONTH_NAMES.indexOf(month);
    let totalSetsBefore = 0;
    for (let i = 0; i < monthIndex; i++) {
        totalSetsBefore += MONTHS_CONFIG[MONTH_NAMES[i]];
    }
    const globalSetIndex = totalSetsBefore + (setNumber - 1);

    // Calculate question indices for this set (5 questions per set)
    const startQuestionIndex = globalSetIndex * 5;
    const endQuestionIndex = startQuestionIndex + 5;

    // Check if we have enough questions
    if (startQuestionIndex >= vocabQuestionsPool.length) {
        return null; // Not enough questions - will show "Coming Soon"
    }

    // Get 5 unique questions for this set
    const setQuestions = [];
    for (let i = startQuestionIndex; i < endQuestionIndex && i < vocabQuestionsPool.length; i++) {
        // Use modulo when we run out to recycle, but still maintain uniqueness within set
        setQuestions.push({ ...vocabQuestionsPool[i % vocabQuestionsPool.length] });
    }

    // If less than 5 questions available, return null (Coming Soon)
    if (setQuestions.length < 5) {
        return null;
    }

    return setQuestions;
}

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
let currentMonthVocab = 'January';
let currentSetNumberVocab = null;
let currentSetQuestionsVocab = [];
let currentQuestionVocab = 0;
let setScoreVocab = 0;
let currentAttemptsVocab = []; // NEW: Track full attempt details

// Global progress data structure - ENHANCED
let vocabSetsProgress = {
    // Structure: { 
    //   'January': { 
    //     'set_1': {
    //       completed: true, 
    //       score: 4,
    //       timestamp: '2026-02-15T09:30:00',
    //       attempts: [
    //         { question: {...}, userAnswer: 2, isCorrect: true },
    //         ...
    //       ],
    //       userSentence: 'My example sentence here'
    //     }, 
    //     ... 
    //   }, 
    //   ... 
    // }
};

// ==========================================
// INITIALIZATION & LOADING
// ==========================================

async function initVocabSets() {
    // TODO: Populate vocabQuestionsPool with 1800+ questions
    // For now, will be done in phases

    try {
        await loadVocabSetsProgress();
        renderMonthSelection();
    } catch (e) {
        console.error("Error in initVocabSets:", e);
    }
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
                        <option value="${month}" ${month === currentMonthVocab ? 'selected' : ''}>${month} 2026</option>
                    `).join('')}
                </select>
            </div>

            <!-- Sets Grid Container -->
            <div id="sets-grid-container"></div>
        </div>
    `;

    container.innerHTML = html;
    renderSetsGrid(currentMonthVocab);
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

        // Check if set has questions available
        const setQuestions = generateSetQuestions(month, setNum);
        const hasQuestions = setQuestions !== null;

        let status = 'not-started';
        let statusIcon = '⭕';
        let statusColor = '#e5e7eb';
        let textColor = '#9ca3af';
        let clickHandler = '';

        if (!hasQuestions) {
            // No questions available for this set yet
            status = 'coming-soon';
            statusIcon = '🔒';
            statusColor = '#d1d5db';
            textColor = '#9ca3af';
        } else if (setData) {
            if (setData.completed) {
                status = 'completed';
                statusIcon = '✅';
                statusColor = '#22c55e';
                textColor = '#16a34a';
                clickHandler = `onclick="reviewSet('${month}', ${setNum})"`;
            } else {
                status = 'in-progress';
                statusIcon = '🔄';
                statusColor = '#fbbf24';
                textColor = '#d97706';
                clickHandler = `onclick="startSet('${month}', ${setNum})"`;
            }
        } else if (hasQuestions) {
            clickHandler = `onclick="startSet('${month}', ${setNum})"`;
        }

        return `
                    <button ${clickHandler} style="
                        background: ${status === 'completed' ? '#f0fdf4' : status === 'in-progress' ? '#fffbeb' : status === 'coming-soon' ? '#f9fafb' : 'white'};
                        border: 3px solid ${statusColor};
                        border-radius: 12px;
                        padding: 20px 15px;
                        cursor: ${status === 'coming-soon' ? 'not-allowed' : 'pointer'};
                        transition: all 0.2s;
                        text-align: center;
                    " ${status !== 'coming-soon' ? `onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"` : ''}>
                        <div style="font-size: 2rem; margin-bottom: 8px;">${statusIcon}</div>
                        <div style="font-weight: 700; font-size: 1.05rem; color: ${textColor};">Set ${setNum}</div>
                        ${setData ? `<div style="font-size: 0.85rem; color: #888; margin-top: 5px;">${setData.score || 0}/5</div>` : ''}
                        ${status === 'coming-soon' ? `<div style="font-size: 0.75rem; color: #999; margin-top: 5px;">Coming Soon</div>` : ''}
                    </button>
                `;
    }).join('')}
        </div>
    `;

    container.innerHTML = html;
}

function selectMonth(month) {
    currentMonthVocab = month;
    renderSetsGrid(month);
}

// ==========================================
// SET EXECUTION
// ==========================================

function startSet(month, setNumber) {
    currentMonthVocab = month;
    currentSetNumberVocab = setNumber;
    currentQuestionVocab = 0;
    setScoreVocab = 0;
    currentAttemptsVocab = []; // Reset attempts tracking

    // Generate 5 unique questions for this set
    currentSetQuestionsVocab = generateSetQuestions(month, setNumber);

    // Check if set has questions
    if (!currentSetQuestionsVocab) {
        alert("This set doesn't have questions yet. Coming soon!");
        return;
    }

    renderSetQuestion();
}



function renderSetQuestion() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    if (currentQuestionVocab >= 5) {
        // All 5 questions answered, show sentence creation prompt
        renderSentenceCreation();
        return;
    }

    const q = currentSetQuestionsVocab[currentQuestionVocab];
    const progress = Math.round(((currentQuestionVocab) / 5) * 100);

    const html = `
        <div style="max-width: 900px; margin: 40px auto; padding: 30px;">
            <!-- Header with Back Button -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button onclick="backToMonthView()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
                    ← Back to ${currentMonthVocab}
                </button>
                <h1 style="color: var(--lime-dark); font-size: 2rem; margin: 0;">Set ${currentSetNumberVocab} - Question ${currentQuestionVocab + 1}/5</h1>
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
    const q = currentSetQuestionsVocab[currentQuestionVocab];
    const isCorrect = selectedIdx === q.correct;

    // Save full attempt details for review later
    currentAttemptsVocab.push({
        question: { ...q },
        userAnswer: selectedIdx,
        isCorrect: isCorrect
    });

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
        setScoreVocab++;
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
    currentQuestionVocab++;
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

    // Extract words from correct answers (from currentAttemptsVocab)
    const correctWords = currentAttemptsVocab
        .filter(attempt => attempt.isCorrect)
        .map(attempt => ({
            word: attempt.question.word,
            definition: attempt.question.options[attempt.question.correct]
        }));

    const html = `
        <div style="max-width: 800px; margin: 60px auto; padding: 40px;">
            <!-- Completion Message -->
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
                <h1 style="color: var(--lime-dark); font-size: 2.5rem; margin-bottom: 15px;">Set ${currentSetNumberVocab} Complete!</h1>
                <div style="font-size: 2rem; font-weight: 800; color: #16a34a; margin-bottom: 10px;">${setScoreVocab}/5 Correct</div>
                <p style="color: #666; font-size: 1.1rem;">Great job! ${correctWords.length > 0 ? 'Now practice these words by creating sentences.' : ''}</p>
            </div>

            ${correctWords.length > 0 ? `
                <!-- Sentence Creation (Optional) -->
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 16px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #f59e0b;">
                    <h2 style="color: #b45309; margin: 0 0 20px 0; font-size: 1.6rem;">✍️ Create Sentences (Optional)</h2>
                    <p style="color: #78350f; margin-bottom: 20px;">Write sentences using the words you got correct to reinforce your learning:</p>
                    
                    <!-- Words List -->
                    <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px;">
                        <strong style="color: #b45309;">Your Words:</strong>
                        ${correctWords.map(item => `<span style="display: inline-block; margin: 5px 10px 5px 0; padding: 5px 12px; background: #fef3c7; border-radius: 6px; font-weight: 600;">${item.word}</span>`).join('')}
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
                    <button onclick="completeSet(null)" style="padding: 15px 40px; background: var(--lime-primary); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#84cc16'" onmouseout="this.style.background='var(--lime-primary)'">
                        Continue to ${currentMonthVocab}
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

    try {
        // Prepare words for saving
        // Get correct words from currentAttemptsVocab
        const correctWords = currentAttemptsVocab
            .filter(attempt => attempt.isCorrect)
            .map(attempt => ({
                word: attempt.question.word,
                definition: attempt.question.options[attempt.question.correct]
            }));

        // We'll save it as one entry with joined words/definitions
        // This is a design choice; alternative is saving one entry per word.
        // Given the UI allows one sentence for multiple words, saving as one entry makes sense.

        await fetch('/save_sentence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                sentence_data: {
                    type: 'vocab',
                    word: correctWords.map(w => w.word).join(', '),
                    definition: correctWords.map(w => w.definition).join(' | '),
                    userSentence: sentence
                }
            })
        });

        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #16a34a; font-weight: 600;">✅ Sentence saved!</p>';

        setTimeout(() => {
            completeSet(sentence); // Pass sentence to completeSet
        }, 500);
    } catch (e) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">❌ Failed to save.</p>';
        console.error(e);
    }
}

function skipSentenceAndComplete() {
    completeSet(null); // No sentence
}

function completeSet(userSentence = null) {
    // Mark set as completed with ENHANCED data
    if (!vocabSetsProgress[currentMonthVocab]) {
        vocabSetsProgress[currentMonthVocab] = {};
    }

    vocabSetsProgress[currentMonthVocab][`set_${currentSetNumberVocab}`] = {
        completed: true,
        score: setScoreVocab,
        timestamp: new Date().toISOString(),
        attempts: currentAttemptsVocab, // Save full attempts
        userSentence: userSentence // Save user's sentence if provided
    };

    saveVocabSetsProgress();

    // Return to month view
    renderMonthSelection();
}

// ==========================================
// REVIEW MODE
// ==========================================

function reviewSet(month, setNumber) {
    const setKey = `set_${setNumber}`;
    const setData = vocabSetsProgress[month][setKey];

    if (!setData || !setData.attempts) {
        alert("No attempt data found for this set!");
        return;
    }

    const container = document.getElementById('container-vocab');
    if (!container) return;

    const html = `
        <div style="max-width: 900px; margin: 40px auto; padding: 30px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button onclick="renderMonthSelection()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    ← Back to ${month}
                </button>
                <h1 style="color: var(--lime-dark); font-size: 2rem; margin: 0;">Review: Set ${setNumber}</h1>
                <button onclick="startSet('${month}', ${setNumber})" style="padding: 10px 20px; background: var(--lime-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
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
                            <h3 style="color: var(--lime-dark); margin: 0;">Question ${idx + 1}: ${q.word}</h3>
                            <span style="font-size: 1.5rem;">${isCorrect ? '✅' : '❌'}</span>
                        </div>
                        
                        <div style="margin-bottom: 15px; color: #666;">
                            <strong>Category:</strong> ${q.category}
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
// EXPOSE FUNCTIONS TO WINDOW
// ==========================================

window.initVocabSets = initVocabSets;
window.selectMonth = selectMonth;
window.startSet = startSet;
window.reviewSet = reviewSet;
window.selectSetAnswer = selectSetAnswer;
window.nextSetQuestion = nextSetQuestion;
window.backToMonthView = backToMonthView;
window.saveSentenceAndComplete = saveSentenceAndComplete;
window.skipSentenceAndComplete = skipSentenceAndComplete;
window.completeSet = completeSet;
