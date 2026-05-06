
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { callLLM } from '@/lib/llm';
import { unstable_cache } from 'next/cache';

// Unstable cache allows us to cache the result of this function globally on Vercel
// for 24 hours (86400 seconds), ensuring one quote per day across all users.
const getDailyQuote = unstable_cache(
    async () => {
        if (!process.env.OPENAI_API_KEY && process.env.LLM_PROVIDER !== 'claude') {
            return "Knowledge is power. — Francis Bacon";
        }

        const themes = [
            'Deep philosophical',
            'Slightly humorous but wise',
            'Intensely motivating',
            'Poetic and romanticized learning',
            'Existential and thought-provoking',
        ];

        const authors = [
            'William Shakespeare',
            'Rumi',
            'Fyodor Dostoevsky',
            'Friedrich Nietzsche',
            'Albert Camus',
            'Marcus Aurelius',
            'Socrates',
            'Oscar Wilde'
        ];

        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

        const promptText = `
Generate a single, short, impactful quote (1-2 sentences max) to display on the dashboard of an academic learning platform called Assessra.
The user is a student. 
The tone of the quote must be: ${randomTheme}.
Make sure it is heavily inclined towards academics, studying, intellectual growth, or the pursuit of truth.
The quote MUST sound like it was written by or attributed to a renowned author like ${randomAuthor} (or you can use a real quote from them if it fits perfectly).

FORMAT REQUIREMENT:
You must return the text in exactly this format:
Quote text goes here without quotation marks. — Author Name

Do not include any other text, just the quote and the author separated by " — ".
`;

        const systemPrompt = 'You are a highly sophisticated literary AI selecting or composing the quote of the day.';
        const responseText = await callLLM(promptText, null, 60, systemPrompt);

        return responseText.trim().replace(/^"|"$/g, '');
    },
    ['daily-assessra-quote-v1'], // Cache key
    { revalidate: 86400 } // 24 hours in seconds
);

// GET /api/quote
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // We still check auth to prevent unauthenticated API abuse,
        // but the actual quote generation is heavily cached.
        const quoteText = await getDailyQuote();

        return NextResponse.json({ quote: quoteText }, { status: 200 });

    } catch (e) {
        console.error('AI Quote API Error:', e);
        return NextResponse.json({ quote: "Knowledge is power, but imagination is everything. — Albert Einstein" }, { status: 200 });
    }
}
