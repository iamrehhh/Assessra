import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

export async function POST(request) {
    try {
        const { term, type, meaning } = await request.json();

        if (!term || !type || !meaning) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const prompt = `
            You are an expert English language tutor. Your task is to provide exactly 1 contextual example sentence and exactly 2 or 3 common synonyms for the given ${type}.
            
            Term (${type}): "${term}"
            Meaning: "${meaning}"
            
            Return ONLY a valid JSON object in the following format:
            {
                "example": "A clear, natural sentence demonstrating how the term is used in everyday context.",
                "synonyms": ["synonym1", "synonym2"]
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
        console.error("Error generating vocab/idiom context:", error);
        return NextResponse.json({ error: "Failed to generate context" }, { status: 500 });
    }
}
