// ==========================================
// MATHEMATICS PAPER 3 (TOPICAL Q&A ENGINE)
// ==========================================

const mathTopics = {
    "algebra": { id: "algebra", title: "Algebra", icon: "📐", color: "from-blue-100 to-blue-200" },
    "logarithms": { id: "logarithms", title: "Logarithms & Exponentials", icon: "📈", color: "from-green-100 to-green-200" },
    "trigonometry": { id: "trigonometry", title: "Trigonometry", icon: "🔺", color: "from-purple-100 to-purple-200" },
    "differentiation": { id: "differentiation", title: "Differentiation", icon: "∂", color: "from-orange-100 to-orange-200" },
    "integration": { id: "integration", title: "Integration", icon: "∫", color: "from-pink-100 to-pink-200" },
    "numerical_methods": { id: "numerical_methods", title: "Numerical Methods", icon: "🔢", color: "from-teal-100 to-teal-200" },
    "vectors": { id: "vectors", title: "Vectors", icon: "↗️", color: "from-indigo-100 to-indigo-200" },
    "complex_numbers": { id: "complex_numbers", title: "Complex Numbers", icon: "ℂ", color: "from-yellow-100 to-yellow-200" },
    "differential_equations": { id: "differential_equations", title: "Differential Equations", icon: "dy/dx", color: "from-red-100 to-red-200" }
};

// Placeholder Data - Will be replaced by JSON Upload
let mathQuestionBank = [
    {
        id: "alg_001",
        topic: "algebra",
        question: "Solve the equation: \\( 2^{2x} - 5(2^x) + 4 = 0 \\).",
        image: "",
        marks: 4,
        marking_scheme: "Let u = 2^x. u^2 - 5u + 4 = 0. (u-4)(u-1)=0. u=4 or u=1. 2^x=4 => x=2. 2^x=1 => x=0."
    },
    {
        id: "trig_001",
        topic: "trigonometry",
        question: "Prove the identity: \\( \\frac{1 + \\sin x}{\\cos x} + \\frac{\\cos x}{1 + \\sin x} = 2 \\sec x \\).",
        image: "",
        marks: 5,
        marking_scheme: "LHS = (1+sin x)^2 + cos^2 x / cos x(1+sin x). = 1 + 2sin x + sin^2 x + cos^2 x / ... = 2 + 2sin x / ... = 2(1+sin x) / cos x(1+sin x) = 2/cos x = 2 sec x."
    },
    {
        id: "diff_001",
        topic: "differentiation",
        question: "Find the gradient of the curve \\( y = x^2 \\ln x \\) at the point where \\( x = e \\).",
        image: "",
        marks: 4,
        marking_scheme: "dy/dx = 2x ln x + x^2(1/x) = 2x ln x + x. At x=e: 2e(1) + e = 3e."
    },
    {
        id: "complex_001",
        topic: "complex_numbers",
        question: "Given \\( z = 1 + i\\sqrt{3} \\), find the modulus and argument of \\( z \\).",
        image: "",
        marks: 3,
        marking_scheme: "|z| = sqrt(1+3) = 2. arg z = arctan(sqrt(3)/1) = pi/3."
    }
];

let currentTopicQuestions = [];
let currentQuestionIndex = 0;
let currentQuestion = null;

function loadMathPapers() {
    const container = document.getElementById('container-math-p3');
    if (!container) return;

    // Reset View
    document.body.style.overflow = 'auto';

    let html = `
        <div style="text-align:center; margin-bottom:40px;">
            <h2 style="font-size:2.5rem; color:var(--lime-dark); font-family:'Playfair Display', serif; margin-bottom:10px;">📐 Mathematics: Paper 3</h2>
            <p style="color:#666; font-size:1.1rem;">Topical Practice & AI Explanations</p>
        </div>

        <div class="math-topics-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 0 20px; max-width: 1200px; margin: 0 auto;">`;

    // Render Topic Cards
    Object.values(mathTopics).forEach(topic => {
        html += `
            <div class="math-topic-card" onclick="startMathTopic('${topic.id}')" style="cursor: pointer; background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; border: 1px solid #eee; display:flex; align-items:center; gap:15px; overflow:hidden; position:relative;">
                <div style="font-size: 2.5rem; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); width: 60px; height: 60px; display:flex; align-items:center; justify-content:center; border-radius: 12px;">${topic.icon}</div>
                <div>
                    <h3 style="margin:0; color:#333; font-size:1.2rem;">${topic.title}</h3>
                    <p style="margin:5px 0 0; color:#888; font-size:0.9rem;">Start Practice →</p>
                </div>
            </div>
        `;
    });

    html += `</div>
    
    <div style="text-align:center; margin-top:50px; padding:30px; background:#f9fafb; border-radius:12px; max-width:800px; margin-left:auto; margin-right:auto;">
        <h3 style="color:#4b5563;">📊 Your Progress</h3>
        <p style="color:#6b7280; margin-bottom:20px;">Review your answering history and explanations.</p>
        <button onclick="showMathProgress()" style="background:var(--lime-dark); color:white; padding:10px 25px; border-radius:8px; border:none; cursor:pointer; font-weight:bold;">View Progress Logs</button>
    </div>`;

    container.innerHTML = html;
}

function startMathTopic(topicId) {
    // 1. Filter Questions
    currentTopicQuestions = mathQuestionBank.filter(q => q.topic === topicId);

    // 2. Shuffle Questions (Fisher-Yates)
    for (let i = currentTopicQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentTopicQuestions[i], currentTopicQuestions[j]] = [currentTopicQuestions[j], currentTopicQuestions[i]];
    }

    if (currentTopicQuestions.length === 0) {
        showToast("No questions available for this topic yet.", "info");
        // Fallback for demo if empty
        // currentTopicQuestions = [{ id: "demo_1", topic: topicId, question: "Demo Question: Solve x^2 = 4", marks: 2, marking_scheme: "x = 2, x = -2" }];
        // return; 
    }

    currentQuestionIndex = 0;
    renderMathQuestion();
}

function renderMathQuestion() {
    if (currentQuestionIndex >= currentTopicQuestions.length) {
        // Topic Completed
        document.getElementById('container-math-p3').innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h2 style="color:var(--lime-dark);">🎉 Topic Completed!</h2>
                <p>You have practiced all available questions for this topic.</p>
                <button onclick="loadMathPapers()" style="margin-top:20px; padding:12px 25px; background:var(--lime-primary); color:white; border:none; border-radius:8px; cursor:pointer; font-size:1.1rem;">Choose Another Topic</button>
            </div>
        `;
        return;
    }

    currentQuestion = currentTopicQuestions[currentQuestionIndex];
    const topicInfo = mathTopics[currentQuestion.topic] || { title: "Mathematics" };

    let html = `
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:#f3f4f6; z-index:1000; overflow-y:auto;">
            <!-- Header -->
            <div style="background:white; padding:15px 30px; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:10;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <button onclick="loadMathPapers()" style="background:#f3f4f6; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:600; color:#4b5563;">✕ Exit</button>
                    <span style="font-weight:bold; color:#111827;">${topicInfo.title}</span>
                    <span style="background:#e5e7eb; padding:2px 8px; border-radius:10px; font-size:0.8rem; color:#4b5563;">Q${currentQuestionIndex + 1}/${currentTopicQuestions.length}</span>
                </div>
            </div>

            <div style="max-width:900px; margin:30px auto; padding:0 20px; padding-bottom:100px;">
                
                <!-- Question Card -->
                <div style="background:white; border-radius:16px; padding:30px; box-shadow:0 10px 30px rgba(0,0,0,0.05); margin-bottom:30px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px; border-bottom:2px solid #f3f4f6; padding-bottom:15px;">
                        <span style="font-weight:bold; color:#2563eb; font-size:1.1rem;">Question</span>
                        <span style="background:#dbeafe; color:#1e40af; padding:4px 10px; border-radius:6px; font-weight:600; font-size:0.9rem;">${currentQuestion.marks} Marks</span>
                    </div>
                    
                    <div style="font-size:1.1rem; line-height:1.6; color:#374151; margin-bottom:20px;">
                        ${currentQuestion.question.replace(/\n/g, '<br>')}
                    </div>

                    ${currentQuestion.image ? `<img src="${currentQuestion.image}" style="max-width:100%; border-radius:8px; border:1px solid #e5e7eb; margin-bottom:20px;">` : ''}
                </div>

                <!-- Answer Section -->
                <div id="math-answer-section" style="background:white; border-radius:16px; padding:30px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                    <h3 style="margin-top:0; color:#374151;">Your Solution</h3>
                    <textarea id="math-user-answer" placeholder="Type your full solution here..." style="width:100%; height:200px; padding:15px; border:2px solid #e5e7eb; border-radius:12px; font-family:monospace; font-size:1rem; resize:vertical; outline:none; transition:border-color 0.2s; box-sizing:border-box;"></textarea>
                    
                    <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                        <button id="math-submit-btn" onclick="submitMathAnswer()" style="background:var(--lime-dark); color:white; padding:12px 30px; border-radius:10px; border:none; font-weight:bold; font-size:1rem; cursor:pointer; display:flex; align-items:center; gap:8px;">
                            <span>Submit Solution</span> 🚀
                        </button>
                    </div>
                </div>

                <!-- Explanation Section (Hidden initially) -->
                <div id="math-explanation-section" class="hidden" style="margin-top:30px; animation: fadeIn 0.5s ease;">
                    <div style="background:#f0fdf4; border-radius:16px; padding:30px; border:1px solid #bbf7d0;">
                        <h3 style="margin-top:0; color:#166534; display:flex; align-items:center; gap:10px;">
                            <span>🤖</span> AI Explanation & Marking
                        </h3>
                        <div id="math-ai-feedback" style="line-height:1.7; color:#1f2937;"></div>
                    </div>
                    
                    <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                        <button onclick="nextMathQuestion()" style="background:#2563eb; color:white; padding:15px 40px; border-radius:10px; border:none; font-weight:bold; font-size:1.1rem; cursor:pointer; box-shadow:0 4px 12px rgba(37,99,235,0.2);">
                            Next Question →
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;

    document.getElementById('container-math-p3').innerHTML = html;
}

async function submitMathAnswer() {
    const answerInput = document.getElementById('math-user-answer');
    const submitBtn = document.getElementById('math-submit-btn');
    const userAnswer = answerInput.value.trim();

    if (!userAnswer) {
        showToast("Please write your solution first.", "warning");
        return;
    }

    // Lock UI
    answerInput.disabled = true;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Generating Explanation... 🧠";

    try {
        // Prepare Payload
        const payload = {
            question: currentQuestion.question,
            // If image exists, strictly logic should handle it. Assuming backend can take image URL or description.
            // For now, passing text. 
            answer: userAnswer,
            marks: currentQuestion.marks,
            marking_scheme: currentQuestion.marking_scheme,
            rubric: "Strictly follow the marking scheme provided. Explain step-by-step where the student gained or lost marks. Use LaTeX for math symbols if possible, or clear text.",
            system_prompt: "You are an expert A-Level Math Tutor. Grade the student's answer based on the marking scheme. Provide a detailed, step-by-step explanation of the correct solution."
        };

        // Call Backend (Using /mark logic pattern)
        const res = await fetch('/mark', { // or /api/generate-feedback if available, but /mark is standard in logic.js
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("AI Service Failed");

        const data = await res.json();
        const aiFeedback = data.detailed_critique || data.feedback || "Explanation generated.";

        // Render Explanation
        const expSection = document.getElementById('math-explanation-section');
        const feedbackContent = document.getElementById('math-ai-feedback');

        // Simple formatter for newlines and maybe bolding
        let formattedFeedback = aiFeedback.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        feedbackContent.innerHTML = formattedFeedback;
        expSection.classList.remove('hidden');

        // Save Progress
        saveMathProgress(currentQuestion.id, userAnswer, aiFeedback);

    } catch (e) {
        console.error("Math Submission Error:", e);
        showToast("Error generating explanation. Please try again.", "error");
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Retry Submission";
        answerInput.disabled = false;
    }
}

function nextMathQuestion() {
    currentQuestionIndex++;
    renderMathQuestion();
}

function saveMathProgress(qid, ans, feedback) {
    const progress = JSON.parse(localStorage.getItem('math_p3_progress') || '[]');
    progress.push({
        id: qid,
        topic: currentQuestion.topic,
        question: currentQuestion.question,
        userAnswer: ans,
        explanation: feedback,
        timestamp: Date.now()
    });
    localStorage.setItem('math_p3_progress', JSON.stringify(progress));
}

function showMathProgress() {
    const progress = JSON.parse(localStorage.getItem('math_p3_progress') || '[]');
    const container = document.getElementById('container-math-p3');

    if (progress.length === 0) {
        showToast("No progress recorded yet.", "info");
        return;
    }

    let html = `
        <div style="max-width:900px; margin:40px auto; padding:0 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h2 style="margin:0; font-family:'Playfair Display', serif;">📜 Practice History</h2>
                <button onclick="loadMathPapers()" style="padding:10px 20px; border:1px solid #ccc; background:white; border-radius:8px; cursor:pointer;">← Back to Topics</button>
            </div>
    `;

    progress.reverse().forEach((p, idx) => { // Show newest first
        html += `
            <div style="background:white; padding:25px; border-radius:12px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size:0.9rem; color:#888; margin-bottom:10px;">${new Date(p.timestamp).toLocaleString()} • ${mathTopics[p.topic]?.title || 'Unknown Topic'}</div>
                <div style="font-weight:bold; margin-bottom:10px;">Q: ${p.question.substring(0, 100)}...</div>
                
                <details>
                    <summary style="cursor:pointer; color:var(--lime-dark); font-weight:600;">View Answer & Explanation</summary>
                    <div style="margin-top:15px; padding-top:15px; border-top:1px solid #eee;">
                        <p><strong>Your Answer:</strong><br>${p.userAnswer}</p>
                        <div style="background:#f0fdf4; padding:15px; border-radius:8px; margin-top:10px; color:#14532d;">
                            <strong>AI Explanation:</strong><br>${p.explanation.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                </details>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// Global Access
window.loadMathPapers = loadMathPapers;
window.startMathTopic = startMathTopic;
window.submitMathAnswer = submitMathAnswer;
window.nextMathQuestion = nextMathQuestion;
window.showMathProgress = showMathProgress;

// Load on start
document.addEventListener("DOMContentLoaded", loadMathPapers);
