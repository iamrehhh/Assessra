// ==========================================
// VOCABULARY MCQ QUIZ
// ==========================================

const vocabQuestions = [
    // Deception/Dishonesty (5 words)
    { word: "Mendacious", options: ["Truthful", "Deceitful", "Brave", "Silent"], correct: 1, category: "Deception" },
    { word: "Perfidious", options: ["Loyal", "Treacherous", "Wise", "Generous"], correct: 1, category: "Deception" },
    { word: "Duplicity", options: ["Honesty", "Intelligence", "Deceitfulness", "Courage"], correct: 2, category: "Deception" },
    { word: "Chicanery", options: ["Straightforwardness", "Bravery", "Trickery", "Kindness"], correct: 2, category: "Deception" },
    { word: "Disingenuous", options: ["Sincere", "Clever", "Insincere", "Stubborn"], correct: 2, category: "Deception" },

    // Pride/Arrogance (5 words)
    { word: "Supercilious", options: ["Humble", "Arrogant", "Foolish", "Quiet"], correct: 1, category: "Pride" },
    { word: "Hubris", options: ["Modesty", "Excessive pride", "Fear", "Wisdom"], correct: 1, category: "Pride" },
    { word: "Imperious", options: ["Submissive", "Domineering", "Intelligent", "Generous"], correct: 1, category: "Pride" },
    { word: "Bumptious", options: ["Reserved", "Self-important", "Cowardly", "Flexible"], correct: 1, category: "Pride" },
    { word: "Grandiloquent", options: ["Simple", "Pompous in speech", "Brief", "Honest"], correct: 1, category: "Pride" },

    // Courage/Cowardice (4 words)
    { word: "Pusillanimous", options: ["Brave", "Timid", "Wise", "Talkative"], correct: 1, category: "Courage" },
    { word: "Intrepid", options: ["Fearful", "Fearless", "Foolish", "Silent"], correct: 1, category: "Courage" },
    { word: "Dauntless", options: ["Discouraged", "Bold", "Weak", "Greedy"], correct: 1, category: "Courage" },
    { word: "Craven", options: ["Heroic", "Cowardly", "Intelligent", "Generous"], correct: 1, category: "Courage" },

    // Intelligence (4 words)
    { word: "Perspicacious", options: ["Dull", "Perceptive", "Brave", "Quiet"], correct: 1, category: "Intelligence" },
    { word: "Sagacious", options: ["Foolish", "Wise", "Angry", "Brief"], correct: 1, category: "Intelligence" },
    { word: "Astute", options: ["Naive", "Shrewd", "Cowardly", "Verbose"], correct: 1, category: "Intelligence" },
    { word: "Perspicacity", options: ["Stupidity", "Keen insight", "Arrogance", "Silence"], correct: 1, category: "Intelligence" },

    // Stupidity (4 words)
    { word: "Fatuous", options: ["Intelligent", "Silly", "Brave", "Honest"], correct: 1, category: "Stupidity" },
    { word: "Obtuse", options: ["Sharp", "Slow to understand", "Generous", "Brief"], correct: 1, category: "Stupidity" },
    { word: "Vacuous", options: ["Thoughtful", "Empty-headed", "Courageous", "Flexible"], correct: 1, category: "Stupidity" },
    { word: "Inane", options: ["Meaningful", "Senseless", "Honest", "Generous"], correct: 1, category: "Stupidity" },

    // Stubbornness (4 words)
    { word: "Recalcitrant", options: ["Compliant", "Uncooperative", "Wise", "Brief"], correct: 1, category: "Stubbornness" },
    { word: "Obstinate", options: ["Flexible", "Stubborn", "Intelligent", "Generous"], correct: 1, category: "Stubbornness" },
    { word: "Intransigent", options: ["Compromising", "Inflexible", "Foolish", "Silent"], correct: 1, category: "Stubbornness" },
    { word: "Contumacious", options: ["Obedient", "Rebellious", "Wise", "Brief"], correct: 1, category: "Stubbornness" },

    // Talkativeness (4 words)
    { word: "Loquacious", options: ["Quiet", "Talkative", "Brave", "Wise"], correct: 1, category: "Talkativeness" },
    { word: "Garrulous", options: ["Reserved", "Excessively talkative", "Intelligent", "Honest"], correct: 1, category: "Talkativeness" },
    { word: "Prolix", options: ["Concise", "Wordy", "Generous", "Brave"], correct: 1, category: "Talkativeness" },
    { word: "Logorrhea", options: ["Silence", "Excessive talkativeness", "Wisdom", "Courage"], correct: 1, category: "Talkativeness" },

    // Silence (3 words)
    { word: "Taciturn", options: ["Chatty", "Reserved in speech", "Foolish", "Generous"], correct: 1, category: "Silence" },
    { word: "Reticent", options: ["Outspoken", "Reluctant to speak", "Brave", "Wise"], correct: 1, category: "Silence" },
    { word: "Laconic", options: ["Verbose", "Brief in speech", "Cowardly", "Greedy"], correct: 1, category: "Silence" },

    // Criticism (4 words)
    { word: "Vituperative", options: ["Praising", "Harshly critical", "Silent", "Generous"], correct: 1, category: "Criticism" },
    { word: "Excoriate", options: ["Praise", "Criticize severely", "Ignore", "Admire"], correct: 1, category: "Criticism" },
    { word: "Objurgate", options: ["Compliment", "Scold harshly", "Encourage", "Forgive"], correct: 1, category: "Criticism" },
    { word: "Castigate", options: ["Reward", "Reprimand severely", "Support", "Appreciate"], correct: 1, category: "Criticism" },

    // Praise (4 words)
    { word: "Extol", options: ["Criticize", "Praise highly", "Ignore", "Condemn"], correct: 1, category: "Praise" },
    { word: "Laud", options: ["Denounce", "Commend", "Question", "Attack"], correct: 1, category: "Praise" },
    { word: "Panegyric", options: ["Criticism", "Formal praise", "Silence", "Insult"], correct: 1, category: "Praise" },
    { word: "Eulogize", options: ["Defame", "Praise formally", "Ignore", "Criticize"], correct: 1, category: "Praise" },

    // === SECOND SET ===

    // Anger/Hostility (5 words) - Switching to answer C
    { word: "Bellicose", options: ["Peaceful", "Friendly", "Aggressive", "Silent"], correct: 2, category: "Anger" },
    { word: "Belligerent", options: ["Calm", "Gentle", "Hostile", "Wise"], correct: 2, category: "Anger" },
    { word: "Acerbic", options: ["Sweet", "Kind", "Harsh", "Generous"], correct: 2, category: "Anger" },
    { word: "Caustic", options: ["Mild", "Pleasant", "Biting", "Foolish"], correct: 2, category: "Anger" },
    { word: "Truculent", options: ["Peaceful", "Cooperative", "Aggressively defiant", "Silent"], correct: 2, category: "Anger" },

    // Approval/Praise (4 words) - Answer C
    { word: "Approbation", options: ["Disapproval", "Criticism", "Official approval", "Silence"], correct: 2, category: "Approval" },
    { word: "Adulation", options: ["Hatred", "Indifference", "Excessive admiration", "Fear"], correct: 2, category: "Approval" },
    { word: "Commend", options: ["Criticize", "Ignore", "Praise", "Reject"], correct: 2, category: "Approval" },
    { word: "Laud", options: ["Condemn", "Neglect", "Praise enthusiastically", "Question"], correct: 2, category: "Approval" },

    // Disapproval/Criticism (4 words) - Answer C
    { word: "Deprecate", options: ["Approve", "Support", "Express disapproval", "Admire"], correct: 2, category: "Disapproval" },
    { word: "Disparage", options: ["Praise", "Respect", "Belittle", "Encourage"], correct: 2, category: "Disapproval" },
    { word: "Deride", options: ["Admire", "Support", "Mock", "Respect"], correct: 2, category: "Disapproval" },
    { word: "Censure", options: ["Approve", "Reward", "Criticize formally", "Forgive"], correct: 2, category: "Disapproval" },

    // Honesty/Integrity (4 words) - Answer C
    { word: "Forthright", options: ["Deceitful", "Evasive", "Direct and honest", "Silent"], correct: 2, category: "Honesty" },
    { word: "Candid", options: ["Dishonest", "Secretive", "Frank", "Deceptive"], correct: 2, category: "Honesty" },
    { word: "Veracious", options: ["False", "Lying", "Truthful", "Misleading"], correct: 2, category: "Honesty" },
    { word: "Scrupulous", options: ["Careless", "Dishonest", "Morally principled", "Reckless"], correct: 2, category: "Honesty" },

    // Deception (duplicates) (4 words) - Answer D
    { word: "Charlatan", options: ["Expert", "Professional", "Scholar", "Fraud"], correct: 3, category: "Deception" },
    { word: "Duplicitous", options: ["Honest", "Sincere", "Straightforward", "Deceitful"], correct: 3, category: "Deception" },
    { word: "Dissemble", options: ["Reveal", "Confess", "Admit", "Conceal one's true motives"], correct: 3, category: "Deception" },
    { word: "Prevaricate", options: ["Tell truth", "Speak clearly", "Be direct", "Avoid truth"], correct: 3, category: "Deception" },

    // Courage (duplicates) (4 words) - Answer D
    { word: "Audacity", options: ["Timidity", "Fear", "Caution", "Boldness"], correct: 3, category: "Courage" },
    { word: "Intrepid", options: ["Cowardly", "Fearful", "Hesitant", "Fearless"], correct: 3, category: "Courage" },
    { word: "Valiant", options: ["Weak", "Timid", "Afraid", "Brave"], correct: 3, category: "Courage" },
    { word: "Dauntless", options: ["Discouraged", "Fearful", "Worried", "Undeterred by danger"], correct: 3, category: "Courage" },

    // Cowardice (4 words) - Answer D
    { word: "Craven", options: ["Brave", "Bold", "Courageous", "Cowardly"], correct: 3, category: "Cowardice" },
    { word: "Pusillanimous", options: ["Heroic", "Daring", "Valiant", "Lacking courage"], correct: 3, category: "Cowardice" },
    { word: "Timorous", options: ["Bold", "Confident", "Brave", "Fearful"], correct: 3, category: "Cowardice" },
    { word: "Poltroon", options: ["Hero", "Champion", "Warrior", "Coward"], correct: 3, category: "Cowardice" },

    // Intelligence (duplicates) (4 words) - Answer A
    { word: "Erudite", options: ["Scholarly", "Ignorant", "Foolish", "Simple"], correct: 0, category: "Intelligence" },
    { word: "Sagacious", options: ["Having wisdom", "Foolish", "Naive", "Reckless"], correct: 0, category: "Intelligence" },
    { word: "Perspicacious", options: ["Having keen insight", "Dull", "Obtuse", "Slow"], correct: 0, category: "Intelligence" },
    { word: "Astute", options: ["Shrewd", "Naive", "Gullible", "Simple"], correct: 0, category: "Intelligence" },

    // Foolishness (4 words) - Answer A
    { word: "Fatuous", options: ["Silly and pointless", "Intelligent", "Wise", "Thoughtful"], correct: 0, category: "Foolishness" },
    { word: "Inane", options: ["Lacking sense", "Meaningful", "Profound", "Wise"], correct: 0, category: "Foolishness" },
    { word: "Asinine", options: ["Extremely stupid", "Smart", "Clever", "Wise"], correct: 0, category: "Foolishness" },
    { word: "Obtuse", options: ["Slow to understand", "Quick", "Sharp", "Bright"], correct: 0, category: "Foolishness" },

    // Stubbornness (duplicates) (4 words) - Answer A
    { word: "Obstinate", options: ["Stubbornly refusing to change", "Flexible", "Adaptable", "Yielding"], correct: 0, category: "Stubbornness" },
    { word: "Recalcitrant", options: ["Stubbornly defiant", "Obedient", "Compliant", "Cooperative"], correct: 0, category: "Stubbornness" },
    { word: "Intransigent", options: ["Unwilling to compromise", "Flexible", "Agreeable", "Yielding"], correct: 0, category: "Stubbornness" },
    { word: "Obdurate", options: ["Stubbornly persistent", "Yielding", "Soft", "Flexible"], correct: 0, category: "Stubbornness" },

    // Flexibility (4 words) - Answer A
    { word: "Pliable", options: ["Easily bent or influenced", "Rigid", "Inflexible", "Stubborn"], correct: 0, category: "Flexibility" },
    { word: "Malleable", options: ["Easily shaped", "Fixed", "Rigid", "Unyielding"], correct: 0, category: "Flexibility" },
    { word: "Amenable", options: ["Open to suggestion", "Resistant", "Defiant", "Stubborn"], correct: 0, category: "Flexibility" },
    { word: "Tractable", options: ["Easily managed", "Difficult", "Stubborn", "Rebellious"], correct: 0, category: "Flexibility" },

    // Greed (4 words) - Answer A
    { word: "Avarice", options: ["Extreme greed", "Generosity", "Charity", "Kindness"], correct: 0, category: "Greed" },
    { word: "Rapacious", options: ["Aggressively greedy", "Generous", "Kind", "Selfless"], correct: 0, category: "Greed" },
    { word: "Avaricious", options: ["Extremely greedy", "Charitable", "Giving", "Generous"], correct: 0, category: "Greed" },
    { word: "Covetous", options: ["Enviously desiring", "Content", "Satisfied", "Grateful"], correct: 0, category: "Greed" },

    // Generosity (4 words) - Answer A
    { word: "Beneficent", options: ["Generous and kind", "Selfish", "Greedy", "Mean"], correct: 0, category: "Generosity" },
    { word: "Munificent", options: ["Very generous", "Stingy", "Cheap", "Greedy"], correct: 0, category: "Generosity" },
    { word: "Magnanimous", options: ["Generous in forgiving", "Petty", "Vengeful", "Spiteful"], correct: 0, category: "Generosity" },
    { word: "Altruistic", options: ["Selflessly concerned for others", "Selfish", "Greedy", "Self-centered"], correct: 0, category: "Generosity" },

    // Brevity (4 words) - Answer A
    { word: "Laconic", options: ["Using few words", "Verbose", "Wordy", "Long-winded"], correct: 0, category: "Brevity" },
    { word: "Terse", options: ["Brief and to the point", "Lengthy", "Elaborate", "Detailed"], correct: 0, category: "Brevity" },
    { word: "Succinct", options: ["Briefly expressed", "Rambling", "Verbose", "Long"], correct: 0, category: "Brevity" },
    { word: "Pithy", options: ["Concise and meaningful", "Wordy", "Empty", "Lengthy"], correct: 0, category: "Brevity" },

    // Wordiness (4 words) - Answer A
    { word: "Prolix", options: ["Using too many words", "Brief", "Concise", "Short"], correct: 0, category: "Wordiness" },
    { word: "Verbose", options: ["Using more words than needed", "Concise", "Brief", "Terse"], correct: 0, category: "Wordiness" },
    { word: "Loquacious", options: ["Very talkative", "Silent", "Reserved", "Quiet"], correct: 0, category: "Wordiness" },
    { word: "Garrulous", options: ["Excessively talkative", "Quiet", "Silent", "Reserved"], correct: 0, category: "Wordiness" },

    // Temporary (4 words) - Answer A
    { word: "Ephemeral", options: ["Lasting very briefly", "Permanent", "Eternal", "Enduring"], correct: 0, category: "Temporary" },
    { word: "Transient", options: ["Lasting only briefly", "Permanent", "Fixed", "Eternal"], correct: 0, category: "Temporary" },
    { word: "Fleeting", options: ["Passing quickly", "Lasting", "Permanent", "Enduring"], correct: 0, category: "Temporary" },
    { word: "Evanescent", options: ["Quickly fading", "Permanent", "Lasting", "Eternal"], correct: 0, category: "Temporary" },

    // Permanent (3 words) - Answer A
    { word: "Immutable", options: ["Unchangeable", "Changeable", "Flexible", "Variable"], correct: 0, category: "Permanent" },
    { word: "Indelible", options: ["Cannot be removed", "Temporary", "Erasable", "Fleeting"], correct: 0, category: "Permanent" },
    { word: "Perpetual", options: ["Never ending", "Temporary", "Brief", "Short-lived"], correct: 0, category: "Permanent" }
];

let currentQuestion = 0;
let vocabScore = 0;
let vocabAnswered = 0;

// LOAD VOCAB QUIZ
function loadVocabQuiz() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    currentQuestion = 0;
    vocabScore = 0;
    vocabAnswered = 0;

    renderVocabQuestion();
}

function renderVocabQuestion() {
    const container = document.getElementById('container-vocab');
    if (!container || currentQuestion >= vocabQuestions.length) {
        showVocabResults();
        return;
    }

    const q = vocabQuestions[currentQuestion];
    const qNum = currentQuestion + 1;
    const percentage = vocabAnswered > 0 ? Math.round((vocabScore / vocabAnswered) * 100) : 0;

    const html = `
        <div style="display: flex; gap: 30px; padding: 30px; max-width: 1400px; margin: 0 auto;">
            <!-- Left: Scorecard Panel -->
            <div style="flex: 0 0 300px; background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); height: fit-content; position: sticky; top: 20px;">
                <h3 style="color: var(--lime-dark); margin-top: 0; margin-bottom: 20px; font-size: 1.3rem; border-bottom: 2px solid var(--lime-primary); padding-bottom: 10px;">📊 Scorecard</h3>
                
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 3rem; font-weight: bold; color: var(--lime-dark); text-align: center;">${percentage}%</div>
                    <div style="text-align: center; color: #666; margin-top: 5px;">${vocabScore} / ${vocabAnswered} Correct</div>
                </div>

                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Questions Answered:</span>
                        <strong>${vocabAnswered}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Current Question:</span>
                        <strong>${qNum} / ${vocabQuestions.length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">Remaining:</span>
                        <strong>${vocabQuestions.length - qNum}</strong>
                    </div>
                </div>

                <div style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; background: var(--lime-primary); width: ${(qNum / vocabQuestions.length) * 100}%; transition: width 0.3s;"></div>
                </div>
                <div style="text-align: center; color: #888; font-size: 0.85rem; margin-top: 5px;">
                    ${Math.round((qNum / vocabQuestions.length) * 100)}% Complete
                </div>
            </div>

            <!-- Right: Question Area -->
            <div style="flex: 1;">
                <h2 style="color: var(--lime-dark); margin-top: 0; margin-bottom: 30px;">Vocabulary Quiz</h2>

                <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 10px; color: #666; font-size: 0.9rem;">Category: ${q.category}</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 30px; color: #333;">What does "<strong>${q.word}</strong>" mean?</h3>

                    <div id="vocab-options" style="display: flex; flex-direction: column; gap: 15px;">
                        ${q.options.map((opt, idx) => `
                            <button class="vocab-option" data-index="${idx}" onclick="selectVocabAnswer(${idx})" style="
                                padding: 15px 20px;
                                border: 2px solid #ddd;
                                border-radius: 8px;
                                background: white;
                                text-align: left;
                                font-size: 1.1rem;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">
                                <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}
                            </button>
                        `).join('')}
                    </div>

                    <div id="vocab-feedback" style="display: none; margin-top: 30px; padding: 20px; border-radius: 8px;"></div>

                    <button id="next-vocab-btn" onclick="nextVocabQuestion()" style="
                        display: none;
                        width: 100%;
                        padding: 15px;
                        margin-top: 20px;
                        background: var(--lime-primary);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        cursor: pointer;
                    ">Next Question →</button>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

async function selectVocabAnswer(selectedIdx) {
    const q = vocabQuestions[currentQuestion];
    const isCorrect = selectedIdx === q.correct;

    // Disable all options
    document.querySelectorAll('.vocab-option').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    // Highlight correct and incorrect
    const options = document.querySelectorAll('.vocab-option');
    options[q.correct].style.background = '#22c55e';
    options[q.correct].style.borderColor = '#22c55e';
    options[q.correct].style.color = 'white';

    if (!isCorrect) {
        options[selectedIdx].style.background = '#ef4444';
        options[selectedIdx].style.borderColor = '#ef4444';
        options[selectedIdx].style.color = 'white';
    }

    vocabAnswered++;
    if (isCorrect) vocabScore++;

    // Fetch AI example
    const feedback = document.getElementById('vocab-feedback');
    feedback.style.display = 'block';
    feedback.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px;">
                ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p style="font-size: 1.1rem; margin-bottom: 15px;">
                <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
            </p>
            <div style="text-align: center; color: #666;">⏳ Loading example...</div>
        </div>
    `;

    // Fetch AI example
    try {
        const example = await getAIExample(q.word);
        feedback.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px;">
                    ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </h3>
                <p style="font-size: 1.1rem; margin-bottom: 15px;">
                    <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
                </p>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid var(--lime-primary);">
                    <strong style="color: var(--lime-dark);">Example:</strong><br>
                    <span style="font-style: italic; color: #333;">${example}</span>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Failed to fetch example:', e);
    }

    document.getElementById('next-vocab-btn').style.display = 'block';
}

async function getAIExample(word) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Create one example sentence using the word "${word}" that clearly demonstrates its meaning. Make it contextual and academic.`
            })
        });

        const data = await response.json();
        return data.message || "Example unavailable.";
    } catch (e) {
        return "Example unavailable.";
    }
}

function nextVocabQuestion() {
    currentQuestion++;
    renderVocabQuestion();
}

function showVocabResults() {
    const container = document.getElementById('container-vocab');
    const percentage = Math.round((vocabScore / vocabAnswered) * 100);

    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 50px; text-align: center;">
            <h1 style="color: var(--lime-dark); font-size: 3rem; margin-bottom: 20px;">🎉 Quiz Complete!</h1>
            <div style="background: #f0fdf4; border: 2px solid var(--lime-primary); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <h2 style="font-size: 4rem; color: var(--lime-dark); margin: 0;">${percentage}%</h2>
                <p style="font-size: 1.5rem; color: #666; margin-top: 10px;">
                    ${vocabScore} / ${vocabAnswered} Correct
                </p>
            </div>
            <button onclick="loadVocabQuiz()" class="nav-btn" style="background: var(--lime-primary); color: white; padding: 15px 30px; font-size: 1.1rem;">
                Restart Quiz
            </button>
        </div>
    `;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('container-vocab')) {
        loadVocabQuiz();
    }
});
