import { NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';

export async function POST(req) {
    try {
        const { chapterTitle, chapterContent, essayText } = await req.json();
        if (!chapterTitle || !essayText) {
            return NextResponse.json({ error: 'Missing chapterTitle or essayText' }, { status: 400 });
        }

        // Truncate chapter content for context
        const truncatedContent = chapterContent && chapterContent.length > 10000
            ? chapterContent.slice(0, 10000) + '\n\n[Content truncated]'
            : (chapterContent || '');

        const systemPrompt = `You are a thoughtful literary and academic feedback coach. A student has just finished reading a chapter from a book and written a short reflection essay (~150 words) about what they learned.

Your job is to provide constructive, encouraging feedback on their reflection. Evaluate:
1. **Accuracy** — Are the student's claims about the chapter content correct?
2. **Insight quality** — Has the student identified meaningful themes, arguments, or ideas?
3. **Missed interpretations** — What important ideas or nuances from the chapter did the student overlook that would deepen their understanding?

Guidelines:
- Be warm and encouraging, but honest.
- Keep feedback concise (150-250 words).
- Use the chapter content provided as your sole source of truth — do NOT bring in outside knowledge.
- Structure your response with clear sections using bold headers.
- End with one key takeaway the student should remember.`;

        const userPrompt = `Chapter: "${chapterTitle}"

Chapter Content (for reference):
${truncatedContent}

Student's Reflection Essay:
"${essayText}"

Please provide feedback on this reflection.`;

        const feedback = await callLLM(userPrompt, null, 1500, systemPrompt, 'gpt-4o-mini');

        return NextResponse.json({ feedback });
    } catch (err) {
        console.error('API /book-essay-feedback error:', err);
        return NextResponse.json({ error: 'Failed to evaluate essay. Please try again.' }, { status: 500 });
    }
}
