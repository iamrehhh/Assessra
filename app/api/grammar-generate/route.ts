import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

export async function POST(request) {
    try {
        const { parts, answer, userAnswer, explanation, type, question } = await request.json();

        if (!parts || !answer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const isCorrect = userAnswer === answer;

        let questionContext;
        let questionTypeLabel;

        if (type === 'mcq') {
            // New vocabulary/grammar MCQ format
            questionTypeLabel = 'Grammar/Vocabulary MCQ';
            questionContext = `Question: ${question || 'N/A'}\nOptions — A) ${parts.A}  B) ${parts.B}  C) ${parts.C}  D) ${parts.D}`;
        } else if (type === 'passage') {
            questionTypeLabel = 'Error Detection (passage)';
            questionContext = `Passage parts:\n${Object.values(parts).map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
        } else if (type === 'correct') {
            questionTypeLabel = 'Pick the Correct Sentence';
            questionContext = `Options — A) ${parts.A}  B) ${parts.B}  C) ${parts.C}  D) ${parts.D}`;
        } else {
            // standard error detection
            questionTypeLabel = 'Error Detection (standard)';
            questionContext = `Sentence: A) ${parts.A}  B) ${parts.B}  C) ${parts.C}  D) ${parts.D}`;
        }

        const prompt = `
            You are an expert English grammar and vocabulary tutor. A student just answered a question.

            Question type: ${questionTypeLabel}
            ${questionContext}
            Correct answer: ${answer}
            Built-in explanation: ${explanation}
            Student's answer: ${userAnswer || 'N/A'}
            The student answered ${isCorrect ? 'correctly' : 'incorrectly'}.

            Using the built-in explanation as a starting point, provide a clear, enriched explanation (3-5 sentences) that:
            1. States the exact rule, concept, or definition being tested
            2. Explains WHY the correct answer (${answer}) is right
            3. If the student was wrong, explains the specific error in their choice
            4. Gives a memorable tip or mnemonic to help retain this rule

            Return ONLY a valid JSON object:
            {
                "explanation": "Your enriched explanation here."
            }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const responseText = completion.choices[0].message.content;
        const parsedData = JSON.parse(responseText);

        return NextResponse.json(parsedData);

    } catch (error) {
        console.error("Error generating grammar explanation:", error);
        return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
    }
}
