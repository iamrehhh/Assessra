import { NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';

export async function POST(req) {
    try {
        const { chapterTitle, chapterContent } = await req.json();
        if (!chapterTitle || !chapterContent) {
            return NextResponse.json({ error: 'Missing chapterTitle or chapterContent' }, { status: 400 });
        }

        // Truncate content to ~12000 chars to stay within token limits while keeping enough context
        const truncatedContent = chapterContent.length > 12000
            ? chapterContent.slice(0, 12000) + '\n\n[Content truncated for brevity]'
            : chapterContent;

        const systemPrompt = `You are a precise academic quiz generator. You will receive the full text of a book chapter. Your job is to create exactly 10 multiple-choice questions that test deep comprehension of the chapter's key ideas, arguments, examples, and nuances. 

Rules:
- Questions must be directly answerable from the chapter content provided — do NOT use outside knowledge.
- Cover a range of topics from across the entire chapter (beginning, middle, end).
- Each question should have exactly 4 options labeled A, B, C, D.
- Exactly one option must be correct.
- Make distractors plausible but clearly wrong based on the chapter.
- Vary difficulty: include some factual recall, some inference, and some analytical questions.
- Do NOT ask trivial questions like "What is the chapter title?"

You MUST respond with ONLY valid JSON in this exact format, no markdown fences, no extra text:
{"questions":[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correctAnswer":"A"}]}

The correctAnswer field must be just the letter: A, B, C, or D.`;

        const userPrompt = `Chapter: "${chapterTitle}"

Content:
${truncatedContent}

Generate exactly 10 MCQ questions based on this chapter.`;

        const raw = await callLLM(userPrompt, null, 4000, systemPrompt, 'gpt-4o-mini');

        // Parse the JSON response — strip markdown fences if LLM wraps them
        let cleaned = raw.trim();
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
        }

        const parsed = JSON.parse(cleaned);

        if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
            return NextResponse.json({ error: 'AI returned invalid quiz format.' }, { status: 500 });
        }

        return NextResponse.json({ questions: parsed.questions });
    } catch (err) {
        console.error('API /book-quiz error:', err);
        return NextResponse.json({ error: 'Failed to generate quiz. Please try again.' }, { status: 500 });
    }
}
