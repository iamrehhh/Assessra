
// /api/mark/route.js
// Direct OpenAI GPT-4o-mini marking — mirrors the logic from the original app.py

import { callLLM } from '@/lib/llm';
import { BUSINESS_P3_RUBRIC } from './businessP3Rubric';
import { IGCSE_HISTORY_RUBRIC } from './igcseHistoryRubric';


function getSubject(pdf, paperTitle) {
    const p = (pdf || '').toLowerCase();
    const t = (paperTitle || '').toLowerCase();
    if (t.includes('math') || p.includes('9709') || p.includes('0580')) return 'maths';
    if (t.includes('english') || p.includes('9093') || p.includes('0500')) return 'english';
    if (t.includes('general paper') || p.includes('8021')) return 'general_paper';
    if (t.includes('science') || t.includes('physics') || t.includes('chemistry') || t.includes('biology') || p.includes('9700') || p.includes('9701') || p.includes('9702') || p.includes('0610') || p.includes('0620') || p.includes('0625')) return 'sciences';
    if (t.includes('economic') || p.includes('9708') || p.includes('0455')) return 'economics';
    if (t.includes('business') || p.includes('9609') || p.includes('0450')) return 'business';
    if (t.includes('history') || p.includes('9489') || p.includes('0470')) return 'history';
    return null;
}

// ─── Build system prompt based on paper type ────────────────────────────────

function buildSystemPrompt(pdf, marks) {
    const isBusinessP3 = pdf && pdf.includes('9609') && (pdf.includes('in_3') || /[3][123]\.pdf/.test(pdf));
    const isBusinessP4 = pdf && pdf.includes('9609') && (pdf.includes('qp_4') || /[4][123]\.pdf/.test(pdf));
    const isEconomicsP4 = pdf && pdf.includes('9708') && pdf.includes('qp_4');
    const isGeneralPaper = pdf && pdf.includes('8021');
    const isIgcseHistory = pdf && pdf.includes('0470');

    if (isBusinessP3 || isBusinessP4) {
        return `You are a Cambridge International A-Level Business (9609) Examiner. 
Mark the following answer strictly according to the provided Global Marking Commands.
Do not be artificially strict or lenient. Follow the rubric instructions precisely.

CRITICAL FOR CALCULATION QUESTIONS:
If the question involves any numerical calculation (e.g., ARR, payback period, NPV, PED, profit margins, ratios, moving averages, seasonal variations, labour productivity, etc.):
1. You MUST extract the relevant data from the case study text provided and calculate it yourself first.
2. Apply the correct Cambridge formula.
3. Compare the student's answer to the CORRECT calculated answer.
4. Award marks based on whether the student's calculation matches the correct answer.

CRITICAL FOR ESSAY/STRATEGY QUESTIONS:
Cross-reference the student's answer with the rubric to award Knowledge (AO1), Application (AO2), Analysis (AO3), and Evaluation (AO4) marks accordingly.`;
    }

    if (isEconomicsP4) {
        return `You are an experienced Cambridge International A Level Economics examiner marking Paper 4 (9708). 
Apply the marking criteria precisely and consistently. Always award whole marks only. 
Mark positively — reward what is correct, never deduct for errors or omissions.

CRITICAL FOR CALCULATION OR DATA RESPONSE QUESTIONS:
If the question involves any numerical calculation (e.g., Elasticity (PED/XED/YED), Opportunity Cost, GDP, Growth Rates, Inflation, Profit/Revenue):
1. You MUST extract the relevant data from the case study/extract text provided and calculate it yourself first.
2. Apply the correct Cambridge formula.
3. Compare the student's answer to the CORRECT calculated answer.
4. Award marks based on whether the student's calculation matches the correct answer.`;
    }

    if (isGeneralPaper) {
        return `You are a Cambridge International AS Level English General Paper (8021) Examiner.
Mark the following answer strictly according to the provided marking rubric.

CRITICAL INSTRUCTION FOR NUANCED ARGUMENTS:
1. Do NOT rigidly penalize the student if they present an argument outside the marking scheme, PROVIDED it shows deep analytical maturity.
2. REWARD CREATIVITY AND EXTERNAL KNOWLEDGE: If the student provides a factually accurate, highly relevant argument, give it full credit.
3. DO NOT give away marks freely — the student must still demonstrate linguistic clarity and logical cohesion to score high bands.`;
    }

    if (isIgcseHistory) {
        return `You are a strict Cambridge IGCSE History examiner marking Paper 1 (0470). You follow Cambridge's Generic Marking Principles exactly: award marks positively only for correct relevant content, never deduct marks for errors or omissions, never award half marks, treat the mark scheme as indicative not exhaustive, and do not penalise spelling or grammar unless meaning is unclear. Use the full mark range within each level. The critical distinction: IDENTIFICATION = states a fact. EXPLANATION = shows causation with a causal link (because / this meant that / as a result / therefore). Do not award explanation marks for identification alone. For part (b) use Table A (4 levels, max 6 marks). For part (c) use Table B (5 levels, max 10 marks).`;
    }

    return `You are a Cambridge International A-Level Examiner. Mark the following answer strictly according to Cambridge conventions.`;
}

// ─── Build rubric based on subject and marks ────────────────────────────────

function buildRubric(pdf, marks) {
    const isBusinessP3 = pdf && pdf.includes('9609') && (pdf.includes('in_3') || /[3][123]\.pdf/.test(pdf));
    const isBusinessP4 = pdf && pdf.includes('9609') && pdf.includes('qp_4');
    const isEconomicsP4 = pdf && pdf.includes('9708') && pdf.includes('qp_4');
    const isGeneralPaper = pdf && pdf.includes('8021');
    const isIgcseHistory = pdf && pdf.includes('0470');

    if (isBusinessP3) {
        return BUSINESS_P3_RUBRIC;
    }

    if (isBusinessP4) return `STRATEGY RUBRIC (20 MARKS) — AO1(3) + AO2(2) + AO3(8) + AO4(7):
AO1 – KNOWLEDGE (3): L2(2-3) developed strategic knowledge; L1(1) limited.
AO2 – APPLICATION (2): L2(2) consistent case facts; L1(1) superficial.
AO3 – ANALYSIS (8): L3(7-8) integrated strategic analysis; L2(4-6) several effects; L1(1-3) simple links.
AO4 – EVALUATION (7): L3(6-7) developed, contextualised judgement; L2(3-5) balanced; L1(1-2) weak.
Award whole marks only. Mark using best-fit.`;

    if (isEconomicsP4) {
        if (marks <= 10) return `SECTION A DATA RESPONSE RUBRIC (${marks} MARKS):
Award marks for correct, clearly relevant economic points only.
A key term alone is insufficient — candidate must demonstrate understanding.
Do not penalise for spelling/grammar unless meaning is ambiguous. Only award marks, never deduct.
Each valid, developed point (identification + explanation + consequence) earns up to 3 marks.`;

        return `SECTION B ESSAY RUBRIC (20 MARKS) — AO1+AO2 (14) + AO3 (6):
TABLE A — AO1+AO2 (14):
  Level 3 (11-14): Detailed knowledge, addresses question fully, developed analysis, accurate diagrams explained.
  Level 2 (6-10): Some knowledge, limited development, partially accurate diagrams.
  Level 1 (1-5): Weak, significant errors, mostly descriptive.
  ⚠ If question requires diagram and none provided: CAPPED at Level 2 max (10/14).
TABLE B — AO3 Evaluation (6):
  Level 2 (4-6): Justified conclusion directly addressing question, developed evaluative comments.
  Level 1 (1-3): Vague or general conclusion, asserted not argued.`;
    }

    if (isGeneralPaper) return `GENERAL PAPER RUBRIC — Max 30 marks (AO1+AO2+AO3, each out of 10):
Level 5 (25-30): Wide range of relevant examples; sophisticated, well-evaluated arguments; consistently controlled, accurate language.
Level 4 (19-24): Relevant examples; begins to evaluate arguments; appropriate vocabulary.
Level 3 (13-18): Some relevant examples; logical arguments; clear overall but inconsistent.
Level 2 (7-12): Limited information; partial understanding; frequent errors.
Level 1 (1-6): Very limited; weak argument; unclear.
Each AO scored out of 10. Total = AO1+AO2+AO3 (max 30).`;

    if (isIgcseHistory) {
        return IGCSE_HISTORY_RUBRIC;
    }

    if (marks <= 4) return `CALCULATION RUBRIC (${marks} MARKS): Full marks for correct answer. 1 mark for correct method with arithmetic error. 0 for wrong method and wrong answer.`;

    return `Mark strictly according to Cambridge conventions for ${marks} marks. Award whole marks only.`;
}

// ─── Build model answer instruction ─────────────────────────────────────────

function buildModelAnswerInstruction(pdf, marks) {
    const noCommentary = `CRITICAL: The MODEL ANSWER must contain ONLY the perfect candidate response — exactly as a top-scoring student would write it in an exam. Do NOT include any commentary, annotations, explanations of why it scores well, meta-analysis, mark breakdowns, or examiner notes. Just the pure answer text.`;

    const isBusinessP3 = pdf && pdf.includes('9609') && pdf.includes('in_');
    const isBusinessP4 = pdf && pdf.includes('9609') && pdf.includes('qp_4');

    if (isBusinessP3) {
        if (marks <= 4) return `Produce a perfect step-by-step calculation answer:
1. EXTRACT DATA from the case study (list each number with label)
2. STATE FORMULA clearly (Cambridge-accepted formula)
3. SUBSTITUTE numbers into the formula
4. CALCULATE step-by-step showing intermediate results
5. STATE FINAL ANSWER with correct units (%, $, weeks, ratio, etc.)
Plain text only. No bullet points in final answer.
${noCommentary}`;

        if (marks === 8) return `Write an A* 8-mark analysis answer (PEEL structure, 150-225 words):
- Point: State business concept/term
- Evidence: Apply to this specific business context
- Explain: Analyse the impact with a chain of reasoning
- Link: Connect back to the question
Two developed PEEL paragraphs. No bullet points.
${noCommentary}`;

        return `Write an A* ${marks}-mark evaluative answer (250-350 words):
Paragraph 1: Define key concept(s), apply to business context.
Paragraph 2: Analyse first argument — cause, impact, consequence.
Paragraph 3: Analyse counter-argument with case application.
Paragraph 4: Evaluative conclusion with justified judgement contextualised to the business.
No bullet points. Continuous prose.
${noCommentary}`;
    }

    if (isBusinessP4) return `Write an A* 20-mark strategy essay (EXACTLY 7 paragraphs, 400-600 words):
Para 1 – Introduction: Define key concept(s), introduce business context.
Para 2-5 – Body: Four distinct strategic factors, each with application + analysis + counter-point.
Para 6 – Wider considerations: Conditions/context affecting outcome.
Para 7 – Conclusion: Clear justified judgement. No bullet points.
${noCommentary}`;

    const isIgcseHistory = pdf && pdf.includes('0470');
    if (isIgcseHistory) {
        if (marks === 4) return `Mark this part (a) answer out of 4. Award 1 mark per distinct, correct, relevant point (max 4). Do not require explanation. Respond using these exact headers: WHAT YOU DID WELL, WHERE MARKS WERE LOST (or WHAT WAS MISSED OR WEAK), IMPROVEMENT TASK, and MARKS AWARDED: X (where X is the score). End with MODEL ANSWER: and provide a perfect candidate response. ${noCommentary}`;
        if (marks === 6) return `Mark this part (b) answer using Cambridge Table A (max 6 marks). Respond using these exact headers: WHAT YOU DID WELL, WHERE MARKS WERE LOST, IMPROVEMENT TASK, and MARKS AWARDED: X (where X is the score, also state the LEVEL). End with MODEL ANSWER: and provide a perfect candidate response. ${noCommentary}`;
        if (marks === 10) return `Mark this part (c) answer using Cambridge Table B (max 10 marks). Respond using these exact headers: WHAT YOU DID WELL, SIDE-BY-SIDE ANALYSIS, JUDGEMENT ANALYSIS, WHERE MARKS WERE LOST, IMPROVEMENT TASK, and MARKS AWARDED: X (where X is the score, also state the LEVEL). End with MODEL ANSWER: and provide a perfect candidate response. ${noCommentary}`;
        if (marks === 20) return `Mark the following Cambridge IGCSE History Paper 1 answer (full 20 marks). Apply all three marking rubrics in sequence. For each part, output feedback using the headers: WHAT YOU DID WELL, WHERE MARKS WERE LOST, IMPROVEMENT TASK, and MARKS AWARDED: X. End with one overall comment, then MODEL ANSWER: and provide a perfect candidate response for all parts. ${noCommentary}`;
    }

    return `Write a model answer targeting full marks for this ${marks}-mark question. ${noCommentary}`;
}

// ─── Main POST handler ───────────────────────────────────────────────────────

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { question, marks, answer, paperTitle, pdf, caseStudy } = body;

        if (!process.env.OPENAI_API_KEY && process.env.LLM_PROVIDER !== 'claude') {
            return Response.json({ error: 'LLM API key is not configured on the server.' }, { status: 503 });
        }

        const marksInt = parseInt(marks, 10) || 12;
        const subject = getSubject(pdf, paperTitle);
        const systemPrompt = buildSystemPrompt(pdf, marksInt);
        const rubric = buildRubric(pdf, marksInt);
        const modelAnswerInstruction = buildModelAnswerInstruction(pdf, marksInt);

        const ragSection = '';

        const userPrompt = `
QUESTION: ${question}
MARKS AVAILABLE: ${marksInt}
PAPER CONTEXT: ${paperTitle || 'Cambridge A Level'}
${caseStudy ? `\nCASE STUDY / INSERT TEXT:\n${caseStudy}\n` : ''}

STUDENT'S ANSWER:
${answer}

---
MARKING RUBRIC:
${rubric}
${ragSection}

---
MODEL ANSWER INSTRUCTION (generate after marking):
${modelAnswerInstruction}

Use the textbook reference material and marking scheme excerpts above (if available) to provide more accurate marking and a stronger model answer grounded in real subject content.

---
ADDITIONAL CONTEXT:
${systemPrompt}
`;

        // ─── Dynamic Model Routing for Economics Calculations ────────────────
        let modelToUse = null; // null defaults to standard gpt-4o-mini / claude-haiku
        if (subject === 'economics') {
            const lowerQ = (question || '').toLowerCase();
            const calcKeywords = ['calculate', 'ped', 'xed', 'yed', 'elasticity', 'opportunity cost', 'gdp', 'profit', 'revenue', '%', 'percentage'];
            const isCalcQuestion = calcKeywords.some(kw => lowerQ.includes(kw));
            if (isCalcQuestion) {
                // Route to a more capable reasoning model for math accuracy
                modelToUse = 'gpt-4o'; // or 'o1-mini' depending on configured keys
                console.log(`[Mark API] Detected Economics calculation question. Routing to: ${modelToUse}`);
            }
        }

        const raw = await callLLM(userPrompt, subject, 16384, null, modelToUse);

        let score = marksInt; // Fallback
        const scoreMatch = raw.match(/MARKS AWARDED:\s*(\d+(\.\d+)?)/i);
        if (scoreMatch) {
            score = parseFloat(scoreMatch[1]);
        }

        let feedback = raw;
        let modelAnswer = "See feedback for full details.";

        const modelAnswerSplit = raw.split(/MODEL ANSWER:/i);
        if (modelAnswerSplit.length > 1) {
            feedback = modelAnswerSplit[0].trim();
            modelAnswer = modelAnswerSplit[1].trim();
        }

        const result = {
            score,
            feedback,
            modelAnswer
        };

        return Response.json(result);
    } catch (err) {
        console.error('Marking API error:', err);
        return Response.json(
            { error: 'AI marking failed. Please try again.', detail: err.message },
            { status: 500 }
        );
    }
}
