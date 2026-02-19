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
    },
    // VECTORS (Added via Script)
    {
        id: "vec_256",
        topic: "vectors",
        question: "The line l has equation $r=i+2j+3k+\\mu(2i-j-2k).$<br><br><b>(i)</b> The point P has position vector $4i+2j-3k$. Find the length of the perpendicular from P to l. <i>(5 marks)</i><br><br><b>(ii)</b> It is given that l lies in the plane with equation $ax+by+2z=13$, where a and b are constants. Find the values of a and b. <i>(6 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_257",
        topic: "vectors",
        question: "Two lines l and m have equations $r=ai+2j+3k+\\lambda(i-2j+3k)$ and $r=2i+j+2k+\\mu(2i-j+k)$ respectively, where a is a constant. It is given that the lines intersect.<br><br><b>(i)</b> Find the value of a. <i>(4 marks)</i><br><br><b>(ii)</b> When a has this value, find the equation of the plane containing l and m. <i>(5 marks)</i><br><br>",
        image: "",
        marks: 9,
        marking_scheme: ""
    },
    {
        id: "vec_258",
        topic: "vectors",
        question: "The plane m has equation $x+4y-8z=2$. The plane n is parallel to m and passes through the point P with coordinates (5, 2, -2).<br><br><b>(i)</b> Find the equation of n, giving your answer in the form $ax+by+cz=d$. <i>(2 marks)</i><br><br><b>(ii)</b> Calculate the perpendicular distance between m and n. <i>(3 marks)</i><br><br><b>(iii)</b> The line l lies in the plane n, passes through the point P and is perpendicular to OP, where O is the origin. Find a vector equation for l. <i>(4 marks)</i><br><br>",
        image: "",
        marks: 9,
        marking_scheme: ""
    },
    {
        id: "vec_259",
        topic: "vectors",
        question: "The line l has equation $r=4i+3j-k+\\mu(i+2j-2k).$ The plane p has equation $2x-3y-z=4$.<br><br><b>(i)</b> Find the position vector of the point of intersection of l and p. <i>(3 marks)</i><br><br><b>(ii)</b> Find the acute angle between l and p. <i>(3 marks)</i><br><br><b>(iii)</b> A second plane q is parallel to l, perpendicular to p and contains the point with position vector 4j-k. Find the equation of q, giving your answer in the form $ax+by+cz=d.$ <i>(5 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_260",
        topic: "vectors",
        question: "The point P has position vector $3i-2j+k$. The line l has equation $r=4i+2j+5k+\\mu(i+2j+3k)$.<br><br><b>(i)</b> Find the length of the perpendicular from P to l, giving your answer correct to 3 significant figures. <i>(5 marks)</i><br><br><b>(ii)</b> Find the equation of the plane containing l and P, giving your answer in the form ax + by + cz = d. <i>(5 marks)</i><br><br>",
        image: "",
        marks: 10,
        marking_scheme: ""
    },
    {
        id: "vec_261",
        topic: "vectors",
        question: "Two lines l and m have equations $r=2i-j+k+s(2i+3j-k)$ and $r=i+3j+4k+t(i+2j+k)$ respectively. A plane p is parallel to the lines l and m.<br><br><b>(i)</b> Show that the lines are skew. <i>(4 marks)</i><br><br><b>(ii)</b> Find a vector that is normal to p. <i>(3 marks)</i><br><br><b>(iii)</b> Given that p is equidistant from the lines l and m, find the equation of p. Give your answer in the form $ax+by+cz=d$. <i>(3 marks)</i><br><br>",
        image: "",
        marks: 10,
        marking_scheme: ""
    },
    {
        id: "vec_262",
        topic: "vectors",
        question: "The points A and B have position vectors $2i+j+3k$ and $4i+j+k$ respectively. The line l has equation $r=4i+6j+\\mu(i+2j-2k).$<br><br><b>(i)</b> Show that l does not intersect the line passing through A and B. <i>(5 marks)</i><br><br><b>(ii)</b> The point P, with parameter t, lies on l and is such that angle PAB is equal to 120°. Show that $3t^{2}+8t+4=0.$ Hence find the position vector of P. <i>(6 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_263",
        topic: "vectors",
        question: "The planes m and n have equations $3x+y-2z=10$ and $x-2y+2z=5$ respectively. The line l has equation $r=4i+2j+k+\\lambda(i+j+2k).$<br><br><b>(i)</b> Show that l is parallel to m. <i>(3 marks)</i><br><br><b>(ii)</b> Calculate the acute angle between the planes m and n. <i>(3 marks)</i><br><br><b>(iii)</b> A point P lies on the line l. The perpendicular distance of P from the plane n is equal to 2. Find the position vectors of the two possible positions of P. <i>(4 marks)</i><br><br>",
        image: "",
        marks: 10,
        marking_scheme: ""
    },
    {
        id: "vec_264",
        topic: "vectors",
        question: "The line l has equation $r=5i-3j-k+\\lambda(i-2j+k).$ The plane p has equation $(r-i-2j).(3i+j+k)=0$. The line l intersects the plane p at the point A.<br><br><b>(i)</b> Find the position vector of A. <i>(3 marks)</i><br><br><b>(ii)</b> Calculate the acute angle between l and p. <i>(4 marks)</i><br><br><b>(iii)</b> Find the equation of the line which lies in p and intersects l at right angles. <i>(4 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_265",
        topic: "vectors",
        question: "The line l has equation $r=i+2j-3k+\\lambda(2i-j+k)$. The plane p has equation $3x+y-5z=20$<br><br><b>(i)</b> Show that the line l lies in the plane p. <i>(3 marks)</i><br><br><b>(ii)</b> A second plane is parallel to l, perpendicular to p and contains the point with position vector $3i-j+2k$. Find the equation of this plane, giving your answer in the form $ax+by+cz=d.$ <i>(5 marks)</i><br><br>",
        image: "",
        marks: 8,
        marking_scheme: ""
    },
    {
        id: "vec_266",
        topic: "vectors",
        question: "The plane with equation $2x+2y-z=5$ is denoted by m. Relative to the origin O, the points A and B have coordinates (3, 4, 0) and (-1,0,2) respectively.<br><br><b>(i)</b> Show that the plane m bisects AB at right angles. <i>(5 marks)</i><br><br><b>(ii)</b> A second plane p is parallel to m and nearer to O. The perpendicular distance between the planes is 1. Find the equation of p, giving your answer in the form $ax+by+cz=d.$ <i>(3 marks)</i><br><br>",
        image: "",
        marks: 8,
        marking_scheme: ""
    },
    {
        id: "vec_267",
        topic: "vectors",
        question: "Relative to the origin O, the point A has position vector given by $\\vec{OA}=i+2j+4k.$ The line l has equation $r=9i-j+8k+\\mu(3i-j+2k).$<br><br><b>(i)</b> Find the position vector of the foot of the perpendicular from A to l. Hence find the position vector of the reflection of A in l. <i>(5 marks)</i><br><br><b>(ii)</b> Find the equation of the plane through the origin which contains l. Give your answer in the form $ax+by+cz=d.$ <i>(3 marks)</i><br><br><b>(iii)</b> Find the exact value of the perpendicular distance of A from this plane. <i>(3 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_268",
        topic: "vectors",
        question: "The points A and B have position vectors given by $\\vec{OA}=i-2j+2k$ and $\\vec{OB}=3i+j+k$. The line l has equation $r=2i+j+mk+\\mu(i-2j-4k),$ where m is a constant.<br><br><b>(i)</b> Given that the line l intersects the line passing through A and B, find the value of m. <i>(5 marks)</i><br><br><b>(ii)</b> Find the equation of the plane which is parallel to i-2j-4k and contains the points A and B. Give your answer in the form $ax+by+cz=d.$ <i>(5 marks)</i><br><br>",
        image: "",
        marks: 10,
        marking_scheme: ""
    },
    {
        id: "vec_269",
        topic: "vectors",
        question: "The equations of two lines l and m are $r=3i-j-2k+\\lambda(-i+j+4k)$ and $r=4i+4j-3k+\\mu(2i+j-2k)$ respectively.<br><br><b>(i)</b> Show that the lines do not intersect. <i>(3 marks)</i><br><br><b>(ii)</b> Calculate the acute angle between the directions of the lines. <i>(3 marks)</i><br><br><b>(iii)</b> Find the equation of the plane which passes through the point $(3,-2,-1)$ and which is parallel to both l and m. Give your answer in the form $ax+by+cz=d.$ <i>(5 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_270",
        topic: "vectors",
        question: "Two planes p and q have equations $x+y+3z=8$ and $2x-2y+z=3$ respectively.<br><br><b>(i)</b> Calculate the acute angle between the planes p and q. <i>(4 marks)</i><br><br><b>(ii)</b> The point A on the line of intersection of p and q has y-coordinate equal to 2. Find the equation of the plane which contains the point A and is perpendicular to both the planes p and q. Give your answer in the form $ax+by+cz=d$. <i>(7 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_271",
        topic: "vectors",
        question: "The line l has equation $r=\\left(\\begin{matrix}1\\\\ 2\\\\ -1\\end{matrix}\\right)+\\lambda\\left(\\begin{matrix}2\\\\ 1\\\\ 3\\end{matrix}\\right).$ The plane p has equation $r\\cdot\\left(\\begin{matrix}2\\\\ -1\\\\ -1\\end{matrix}\\right)=6.$<br><br><b>(i)</b> Show that l is parallel to p. <i>(3 marks)</i><br><br><b>(ii)</b> A line m lies in the plane p and is perpendicular to l. The line m passes through the point with coordinates (5, 3, 1). Find a vector equation for m. <i>(6 marks)</i><br><br>",
        image: "",
        marks: 9,
        marking_scheme: ""
    },
    {
        id: "vec_272",
        topic: "vectors",
        question: "With respect to the origin O, the points A, B, C, D have position vectors given by $\\vec{OA}=i+3j+2k$, $\\vec{OB}=2i+j-k,$ $\\vec{OC}=2i+4j+k,$ $\\vec{OD}=-3i+j+2k.$<br><br><b>(i)</b> Find the equation of the plane containing A, B and C, giving your answer in the form $ax+by+cz=d$ <i>(6 marks)</i><br><br><b>(ii)</b> The line through D parallel to OA meets the plane with equation $x+2y-z=7$ at the point P. Find the position vector of P and show that the length of DP is $2\\sqrt{14}$. <i>(5 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_273",
        topic: "vectors",
        question: "The points A, B and C have position vectors, relative to the origin O, given by $\\vec{OA}=i+2j+3k,$ $\\vec{OB}=4j+k$ and $\\vec{OC}=2i+5j-k$ A fourth point D is such that the quadrilateral ABCD is a parallelogram.<br><br><b>(i)</b> Find the position vector of D and verify that the parallelogram is a rhombus. <i>(5 marks)</i><br><br><b>(ii)</b> The plane p is parallel to OA and the line BC lies in p. Find the equation of p, giving your answer in the form $ax+by+cz=d$ <i>(5 marks)</i><br><br>",
        image: "",
        marks: 10,
        marking_scheme: ""
    },
    {
        id: "vec_274",
        topic: "vectors",
        question: "The points A and B have position vectors, relative to the origin $O,$ given by $\\vec{OA}=i+j+k$ and $\\vec{OB}=2i+3k.$ The line l has vector equation $r=2i-2j-k+\\mu(-i+2j+k)$.<br><br><b>(i)</b> Show that the line passing through A and B does not intersect l. <i>(4 marks)</i><br><br><b>(ii)</b> Show that the length of the perpendicular from A to l is $\\frac{1}{\\sqrt{2}}$ <i>(5 marks)</i><br><br>",
        image: "",
        marks: 9,
        marking_scheme: ""
    },
    {
        id: "vec_275",
        topic: "vectors",
        question: "Two planes have equations $3x+y-z=2$ and $x-y+2z=3.$<br><br><b>(i)</b> Show that the planes are perpendicular. <i>(3 marks)</i><br><br><b>(ii)</b> Find a vector equation for the line of intersection of the two planes. <i>(6 marks)</i><br><br>",
        image: "",
        marks: 9,
        marking_scheme: ""
    },
    {
        id: "vec_276",
        topic: "vectors",
        question: "The line l has vector equation $r=i+2j+k+\\lambda(2i-j+k).$<br><br><b>(i)</b> Find the position vectors of the two points on the line whose distance from the origin is $\\sqrt{10}.$ <i>(5 marks)</i><br><br><b>(ii)</b> The plane p has equation $ax+y+z=5$ where a is a constant. The acute angle between the line l and the plane p is equal to $\\sin^{-1}(\\frac{2}{3})$. Find the possible values of a. <i>(5 marks)</i><br><br>",
        image: "",
        marks: 10,
        marking_scheme: ""
    },
    {
        id: "vec_277",
        topic: "vectors",
        question: "The straight line $l_{1}$ passes through the points (0, 1, 5) and (2, -2, 1). The straight line $l_{2}$ has equation $r=7i+j+k+\\mu(i+2j+5k)$.<br><br><b>(i)</b> Show that the lines $l_{1}$ and $l_{2}$ are skew. <i>(6 marks)</i><br><br><b>(ii)</b> Find the acute angle between the direction of the line $l_{2}$ and the direction of the x-axis. <i>(3 marks)</i><br><br>",
        image: "",
        marks: 9,
        marking_scheme: ""
    },
    {
        id: "vec_278",
        topic: "vectors",
        question: "The points A and B have position vectors given by $\\vec{OA}=2i-j+3k$ and $\\vec{OB}=i+j+5k$ The line l has equation $r=i+j+2k+\\mu(3i+j-k)$<br><br><b>(i)</b> Show that l does not intersect the line passing through A and B. <i>(5 marks)</i><br><br><b>(ii)</b> Find the equation of the plane containing the line l and the point A. Give your answer in the form $ax+by+cz=d$ <i>(6 marks)</i><br><br>",
        image: "",
        marks: 11,
        marking_scheme: ""
    },
    {
        id: "vec_279",
        topic: "vectors",
        question: "Two planes have equations $x+3y-2z=4$ and $2x+y+3z=5$ The planes intersect in the straight line l.<br><br><b>(i)</b> Calculate the acute angle between the two planes. <i>(4 marks)</i><br><br><b>(ii)</b> Find a vector equation for the line l. <i>(6 marks)</i><br><br>",
        image: "",
        marks: 10,
        marking_scheme: ""
    },
    {
        id: "vec_280",
        topic: "vectors",
        question: "The points A, B and C have position vectors, relative to the origin O, given by $\\vec{OA}=\\left(\\begin{matrix}1\\\\ 2\\\\ 0\\end{matrix}\\right)$ , $\\vec{OB}=\\left(\\begin{matrix}3\\\\ 0\\\\ 1\\end{matrix}\\right)$ and $\\vec{OC}=\\left(\\begin{matrix}1\\\\ 1\\\\ 4\\end{matrix}\\right).$ The plane m is perpendicular to AB and contains the point C.<br><br><b>(i)</b> Find a vector equation for the line passing through A and B. <i>(2 marks)</i><br><br><b>(ii)</b> Obtain the equation of the plane m, giving your answer in the form $ax+by+cz=d$. <i>(2 marks)</i><br><br><b>(iii)</b> The line through A and B intersects the plane m at the point N. Find the position vector of N and show that $CN=\\sqrt{13}$ <i>(5 marks)</i><br><br>",
        image: "",
        marks: 9,
        marking_scheme: ""
    },
    {
        id: "vec_281",
        topic: "vectors",
        question: "A plane has equation $4x-y+5z=39$ A straight line is parallel to the vector $i-3j+4k$ and passes through the point $A(0,2,-8)$ The line meets the plane at the point B.<br><br><b>(i)</b> Find the coordinates of B. <i>(3 marks)</i><br><br><b>(ii)</b> Find the acute angle between the line and the plane. <i>(4 marks)</i><br><br><b>(iii)</b> The point C lies on the line and is such that the distance between C and B is twice the distance between A and B. Find the coordinates of each of the possible positions of the point C. <i>(3 marks)</i><br><br>",
        image: "",
        marks: 10,
        marking_scheme: ""
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
                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-weight:600; color:#374151; margin-bottom:5px;">Final Answer:</label>
                        <input type="text" id="math-user-answer" placeholder="e.g. x = 5, y = -2/3" style="width:100%; padding:12px; border:2px solid #e5e7eb; border-radius:8px; font-size:1.1rem; outline:none; transition:border-color 0.2s;">
                        <p style="color:#6b7280; font-size:0.9rem; margin-top:5px;">
                            ℹ️ <b>Exact answers</b> (e.g. $\\sqrt{2}, \\frac{4}{6}$) are preferred.<br>
                            ℹ️ <b>Non-exact?</b> Use <b>3 s.f.</b> (e.g. 5.12) or <b>1 d.p.</b> for angles (e.g. 35.4°).
                        </p>
                    </div>
                    
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

    // Render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
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
            answer: userAnswer,
            marks: currentQuestion.marks,
            marking_scheme: currentQuestion.marking_scheme,
            rubric: "STRICT FINAL ANSWER GRADING. 1. If final answer is CORRECT -> Award FULL MARKS. 2. If WRONG -> Award 0. 3. Accept exact unsimplified fractions. 4. Reject non-exact answers if not 3 s.f. (or 1 d.p. for angles).",
            system_prompt: `You are a strict Cambridge A-Level Math Examiner.
            
            **Input:** Student has provided a FINAL ANSWER only.
            **Task:**
            1. CHECK if the Final Answer is correct based on the Question and Marking Scheme.
            2. APPLY Atomic Grading:
               - **CORRECT**: Award ${currentQuestion.marks}/${currentQuestion.marks}.
               - **WRONG**: Award 0/${currentQuestion.marks}.
            3. RULES:
               - Accept unsimplified EXACT forms (e.g., 4/6, sqrt(8)).
               - For NON-EXACT decimals, REQUIRE 3 significant figures (or 1 d.p. for angles in degrees).
            4. OUTPUT:
               - Start with "**STATUS: CORRECT**" or "**STATUS: WRONG**".
               - Then "**Marks: X/${currentQuestion.marks}**".
               - Then "**Step-by-Step Solution:**" (Provide the full working for the student to learn).`
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

        // Render MathJax in explanation
        if (window.MathJax) {
            MathJax.typesetPromise();
        }

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
