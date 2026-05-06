import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
    try {
        const { questionType, questionText, options, answer, userAnswer, explanation } = await request.json();

        const isCorrect = userAnswer === answer;

        const prompt = `
You are an expert English grammar and tense tutor. A student just answered a question on English tenses.

Question type: ${questionType}
Question: ${questionText}
Options presented:
A) ${options.A}
B) ${options.B}
C) ${options.C}
D) ${options.D}
Correct answer: ${answer}
Student's answer: ${userAnswer}
Result: The student answered ${isCorrect ? 'CORRECTLY' : 'INCORRECTLY'}.
Built-in explanation: ${explanation}

Using the built-in explanation as a foundation, provide a rich, enriched explanation (4-6 sentences) that:
1. States the grammar/tense rule being tested (name it clearly)
2. Explains WHY the correct answer (${answer}) is right
3. ${!isCorrect ? `Explains why "${userAnswer}" is incorrect` : 'Reinforces what makes this rule important'}
4. Gives a quick tip, formula, or mnemonic to remember this rule for exams like JIPMAT

Return ONLY valid JSON:
{
    "explanation": "Your detailed explanation here."
}
        `;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const data = JSON.parse(completion.choices[0].message.content);
        return NextResponse.json(data);

    } catch (error) {
        console.error('Tenses generate error:', error);
        return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
    }
}
