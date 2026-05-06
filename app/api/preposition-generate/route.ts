import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

export async function POST(request) {
    try {
        const { question, answer, userAnswer } = await request.json();

        if (!question || !answer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const isCorrect = userAnswer === answer;

        const prompt = `
            You are an expert English grammar tutor specialising in preposition usage. A student just answered a fill-in-the-blank preposition question.

            Sentence: "${question}"
            Correct preposition: "${answer}"
            Student's answer: "${userAnswer}"
            The student answered ${isCorrect ? 'correctly' : 'incorrectly'}.

            Provide a clear, concise explanation (2-4 sentences) of WHY "${answer}" is the correct preposition here. Reference the grammar rule or collocation pattern involved. If the student answered incorrectly, briefly explain why their chosen preposition ("${userAnswer}") does not work in this context.

            Return ONLY a valid JSON object in the following format:
            {
                "explanation": "Your explanation here."
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
        console.error("Error generating preposition explanation:", error);
        return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
    }
}
