
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import supabase from '@/lib/supabase';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { subject, level, year, questionLabel, questionText, totalMarks, studentAnswer } = body;

        if (!subject || !level || !questionLabel || !studentAnswer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // 1. Embed the query context to find relevant markscheme chunks
        // We include the question label AND text to help vector search find the exact markscheme entry
        let queryText = `Mark scheme for ${subject} ${level} ${year || ''} ${questionLabel}`;
        if (questionText) queryText += ` ${questionText}`;
        const queryEmbeddingRes = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: queryText,
        });
        const queryEmbedding = queryEmbeddingRes.data[0].embedding;

        // 2. Search Pinecone / Supabase for the specific markscheme
        // We use the rpc 'match_document_chunks' if it exists. 
        // If the user hasn't uploaded the markscheme, we might not find good hits.
        let markSchemeContext = '';

        const { data: chunks, error: matchError } = await supabase.rpc('match_document_chunks', {
            query_embedding: queryEmbedding,
            match_threshold: 0.70, // lower threshold to ensure we catch it
            match_count: 5,
            filter_subject: subject,
            filter_level: level,
            filter_type: 'markscheme'
        });

        if (matchError) {
            console.error('Vector search error:', matchError);
            // Fallback: Just get any markscheme chunks for this subject/level/year
            let fallbackQuery = supabase
                .from('document_chunks')
                .select('content')
                .eq('subject', subject)
                .eq('level', level)
                .eq('type', 'markscheme');

            if (year) fallbackQuery = fallbackQuery.eq('year', year);

            const { data: fallbackData } = await fallbackQuery.limit(5);
            if (fallbackData) {
                markSchemeContext = fallbackData.map(d => d.content).join('\n\n');
            }
        } else if (chunks && chunks.length > 0) {
            markSchemeContext = chunks.map(chunk => chunk.content).join('\n\n');
        }

        // 3. Evaluate using OpenAI structured output
        const systemPrompt = `You are an expert ${subject} Cambridge examiner for ${level}.
Your task is to officially mark a student's answer.

Question Reference: ${questionLabel}
${questionText ? `Question Text: ${questionText}` : ''}
${totalMarks > 0 ? `Total Marks Available: ${totalMarks}` : ''}

Context retrieved from the official Mark Scheme for this paper:
${markSchemeContext ? markSchemeContext : "No specific mark scheme found for this exact paper. Apply general Cambridge marking principles for this topic."}

Student's Answer:
${studentAnswer}

Instructions for your feedback tone:
- You are writing directly to the student. Speak like a teacher who has marked hundreds of these and genuinely wants the student to improve. 
- NEVER start with generic praise like "Great effort!" or "Good try!". Be conversational but precise.
- Use explicit Cambridge language ("evaluative point", "chain of analysis", etc.).

Format your output into the following logical sections (populate the JSON keys accordingly):

1. **"score"**: A realistic mark score. ${totalMarks > 0 ? `Must be out of ${totalMarks} (e.g., "3/${totalMarks} Marks").` : `(e.g. "3/4 Marks").`} Be strictly accurate to Cambridge standards.
2. **"breakdown"** (What you did well): Speak directly to them. Identify exact things they did right ("You nailed the definition of X here..." or "Your first point about Y was excellent because..."). 
3. **"feedback"** (What was missing): Be honest, kind, and highly specific to their answer. Diagnose the misconception. Explain exactly *why* they lost marks based on the mark scheme ("The bit that tripped you up was...").
4. **"modelAnswer"** (Model Answer): Construct a perfect candidate response that would obtain full marks. CRITICAL: Use paragraph breaks (\\n\\n). At the very end of the model answer, add one brief note explaining exactly *what* makes this specific answer score full marks.

5. FOR CALCULATIONS: If the topic involves math, evaluate step-by-step. Award partial marks for workings (Own Figure Rule). Show detailed step-by-step working clearly in the Model Answer.

Return the result STRICTLY as a JSON object with these exact keys:
- "score" (string, e.g. "3/4 Marks")
- "breakdown" (string paragraphs, use \\n\\n for breaks)
- "feedback" (string paragraphs, use \\n\\n for breaks)
- "modelAnswer" (string paragraphs, use \\n\\n for breaks)
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Please review my answer for: ${questionLabel}` }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
        });

        const resultJsonString = response.choices[0].message.content;
        const result = JSON.parse(resultJsonString);

        return NextResponse.json(result);

    } catch (err) {
        console.error('Evaluation Error:', err);
        return NextResponse.json({ error: 'Failed to evaluate answer. ' + err.message }, { status: 500 });
    }
}
