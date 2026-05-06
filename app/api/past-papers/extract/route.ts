import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import OpenAI from 'openai';

export async function POST(request) {
    try {
        const { filename } = await request.json();

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        // 1. Fetch the document chunks from Supabase
        const { data: chunks, error } = await supabase
            .from('document_chunks')
            .select('content')
            .eq('filename', filename)
            .order('id', { ascending: true }); // Assuming 'id' usually respects insertion order

        if (error) {
            console.error('Error fetching chunks for extraction:', error);
            return NextResponse.json({ error: 'Failed to fetch document text.' }, { status: 500 });
        }

        if (!chunks || chunks.length === 0) {
            return NextResponse.json({ error: 'No text extracted for this paper.' }, { status: 404 });
        }

        // Combine chunks into a single document text (limit to mostly questions)
        const documentText = chunks.map(chunk => chunk.content).join('\n\n');

        // 2. Use OpenAI to extract questions
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.1,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are an expert OCR parser for Cambridge Past Papers. 
Your task is to extract all the specific examination questions that a student needs to answer from the provided text.
Ignore general instructions, cover page fluff, or source material texts unless the question directly asks to read it.
Only extract the actual prompts (e.g., "(a) Explain what is meant by absolute poverty.")

Output STRICTLY in the following JSON format:
{
  "questions": [
    {
      "label": "1a",
      "text": "Explain what is meant by absolute poverty.",
      "marks": 2
    }
  ]
}

- "label": The question number or letter (e.g., "1", "1a", "2(b)(i)"). Be precise.
- "text": The exact text of the question prompt.
- "marks": The integer number of marks awarded for the question (usually found at the end of the question like "[2]" or "(5)"). Ensure this is an integer. If no marks are found, put 0.`
                },
                {
                    role: "user",
                    content: `Here is the text of the examination paper:\n\n${documentText.substring(0, 15000)}`
                    // Limiting to 15k chars to ensure we don't blow up the context aggressively, though gpt-4o-mini can handle 128k
                }
            ]
        });

        const extractionResult = JSON.parse(response.choices[0].message.content);

        return NextResponse.json({
            questions: extractionResult.questions || []
        });

    } catch (err) {
        console.error('API /past-papers/extract error:', err);
        return NextResponse.json({ error: 'Failed to extract questions' }, { status: 500 });
    }
}
