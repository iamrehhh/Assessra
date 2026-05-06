import { NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';

export async function POST(req) {
    try {
        const { word, context } = await req.json();
        if (!word) return NextResponse.json({ error: 'Missing word' }, { status: 400 });

        const systemPrompt = `You are a concise English dictionary and literary context assistant. When given a word and a passage of text, provide:
1. A brief dictionary definition (1-2 sentences)
2. The specific meaning of the word in the given context (1-2 sentences)

Respond ONLY with valid JSON. No markdown, no code fences. Use this format:
{
  "definition": "General dictionary definition of the word",
  "contextMeaning": "What the word means specifically in this passage"
}`;

        const userPrompt = `Word: "${word}"

Context passage:
"${context}"

Provide the definition and contextual meaning.`;

        const raw = await callLLM(userPrompt, null, 500, systemPrompt, 'gpt-4o-mini');
        const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
        const result = JSON.parse(cleaned);

        return NextResponse.json({
            word,
            definition: result.definition || 'No definition available.',
            contextMeaning: result.contextMeaning || 'No contextual meaning available.',
        });
    } catch (err) {
        console.error('API /define-word error:', err);
        return NextResponse.json({
            word: '',
            definition: 'Could not fetch definition.',
            contextMeaning: '',
        }, { status: 500 });
    }
}
