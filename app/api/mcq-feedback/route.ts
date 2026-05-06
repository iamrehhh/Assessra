
// app/api/mcq-feedback/route.js
//
// Strategy: render the PDF page(s) containing the question as PNG images,
// send them to GPT-4o vision. No text extraction — it doesn't work for
// Cambridge papers which are image-based with diagrams and tables.
//
// Requires: npm install pdf2pic sharp
// pdf2pic uses GraphicsMagick/ImageMagick under the hood.
// On Vercel: add `imagemagick` to your system dependencies or use the
// approach below which uses pdftoppm via child_process if available,
// falling back to a pure-JS approach.

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import OpenAI from 'openai';

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';

export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Render a PDF page to base64 PNG ─────────────────────────────────────────
// Tries multiple approaches in order of reliability
async function renderPageToBase64(pdfPath: string, pageNumber: number): Promise<string | null> {

    // Approach 1: pdftoppm (available on Linux/Vercel, most reliable)
    try {
        const tmpDir = os.tmpdir();
        const outPrefix = path.join(tmpDir, `mcq_page_${Date.now()}`);
        // pdftoppm is 1-indexed
        execSync(
            `pdftoppm -png -r 150 -f ${pageNumber} -l ${pageNumber} "${pdfPath}" "${outPrefix}"`,
            { timeout: 15000, stdio: 'pipe' }
        );
        // pdftoppm outputs outPrefix-000001.png (zero-padded)
        const files = fs.readdirSync(tmpDir)
            .filter(f => f.startsWith(path.basename(outPrefix)) && f.endsWith('.png'))
            .sort();
        if (files.length > 0) {
            const imgPath = path.join(tmpDir, files[0]);
            const base64 = fs.readFileSync(imgPath).toString('base64');
            // cleanup
            files.forEach(f => { try { fs.unlinkSync(path.join(tmpDir, f)); } catch { } });
            console.log('[MCQ] Page rendered via pdftoppm');
            return base64;
        }
    } catch (e) {
        console.warn('[MCQ] pdftoppm failed:', e.message);
    }

    // Approach 2: pdf2pic (npm package, uses GraphicsMagick)
    try {
        const { fromPath } = await import('pdf2pic');
        const tmpDir = os.tmpdir();
        const convert = fromPath(pdfPath, {
            density: 150,
            saveFilename: `mcq_${Date.now()}`,
            savePath: tmpDir,
            format: 'png',
            width: 1400,
            height: 2000,
        });
        const result = await convert(pageNumber);
        if (result?.path && fs.existsSync(result.path)) {
            const base64 = fs.readFileSync(result.path).toString('base64');
            try { fs.unlinkSync(result.path); } catch { }
            console.log('[MCQ] Page rendered via pdf2pic');
            return base64;
        }
    } catch (e) {
        console.warn('[MCQ] pdf2pic failed:', e.message);
    }

    // Approach 3: pdfjs-dist + canvas (pure JS, slowest but no system deps)
    try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
        const { createCanvas } = await import('canvas');
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const doc = await pdfjs.getDocument({ data }).promise;
        const page = await doc.getPage(Math.min(pageNumber, doc.numPages));
        const viewport = page.getViewport({ scale: 1.8 });
        const canvas = createCanvas(viewport.width, viewport.height);
        await page.render({ canvasContext: canvas.getContext('2d') as any, viewport }).promise;
        const base64 = canvas.toBuffer('image/png').toString('base64');
        console.log('[MCQ] Page rendered via pdfjs+canvas');
        return base64;
    } catch (e) {
        console.warn('[MCQ] pdfjs+canvas failed:', e.message);
    }

    return null; // All approaches failed
}

// ─── Figure out which PDF page a question is on ───────────────────────────────
// Cambridge MCQ papers typically have 4 questions per page after the cover.
// Adjust QUESTIONS_PER_PAGE if your papers are different.
function estimatePageNumber(questionNumber: number) {
    const QUESTIONS_PER_PAGE = 4;
    const COVER_PAGES = 1; // pages before questions start
    return COVER_PAGES + Math.ceil(questionNumber / QUESTIONS_PER_PAGE);
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const {
            pdfPath,
            questionNumber,
            userAnswer,
            correctAnswer,
            questionText,   // from paper.questions[i].t if you have it
            options,        // from paper.questions[i].options if you have it
        } = await req.json();

        if (!pdfPath || questionNumber === undefined || !userAnswer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const decodedPath = decodeURIComponent(pdfPath);
        const safePath = path.join(process.cwd(), 'public', decodedPath);
        if (!fs.existsSync(safePath)) {
            return NextResponse.json({ error: `PDF not found: ${decodedPath}` }, { status: 404 });
        }

        // 1. Render the PDF page containing this question as an image
        const pageNum = estimatePageNumber(questionNumber);
        const pageBase64 = await renderPageToBase64(safePath, pageNum);

        // Also render the next page in case question spans two pages
        // (e.g. question is at bottom of page N, options on page N+1)
        let nextPageBase64 = null;
        if (pageBase64) {
            nextPageBase64 = await renderPageToBase64(safePath, pageNum + 1);
        }

        let ragContext = '';

        // 3. Build vision message content
        const imageBlocks = [];
        if (pageBase64) {
            imageBlocks.push({
                type: 'image_url',
                image_url: { url: `data:image/png;base64,${pageBase64}`, detail: 'high' }
            });
        }
        if (nextPageBase64) {
            imageBlocks.push({
                type: 'image_url',
                image_url: { url: `data:image/png;base64,${nextPageBase64}`, detail: 'high' }
            });
        }

        const isWrong = correctAnswer && userAnswer !== correctAnswer;

        // 4. Build the text prompt — clean and specific
        let optionsStr = '';
        if (options?.length) {
            optionsStr = `\nOptions:\n${options.map((o, i) => `${String.fromCharCode(65 + i)}: ${o}`).join('\n')}`;
        }

        const textPrompt = `
You are a highly capable Cambridge peer/tutor debriefing a student on Question ${questionNumber} from an Economics MCQ paper.

${imageBlocks.length > 0
                ? `The image(s) above show the PDF page(s) containing Question ${questionNumber}. Find it carefully — it is labelled with the number ${questionNumber}.`
                : 'No image could be rendered for this question.'
            }

${questionText ? `Question text (if visible in image): "${questionText}"` : ''}
${optionsStr}

OFFICIAL CORRECT ANSWER: **${correctAnswer}**
STUDENT ANSWERED: **${userAnswer}** — ${isWrong ? '✗ Wrong' : '✓ Correct'}

${ragContext ? `Relevant textbook context:\n${ragContext.substring(0, 1500)}\n` : ''}

YOUR TASK:
1. Look at the image and find Question ${questionNumber} specifically. Read its text and all 4 options carefully.
2. If it has a diagram (like a cost/revenue graph), describe what it shows and use it in your explanation.
3. Keep your explanation UNDER 150 WORDS. Be punchy, conversational, and direct. Like a smart friend explaining it after the exam.
4. NO HOLLOW OPENERS like "Great question!" or "Certainly!".
5. First: Acknowledge what they chose (${userAnswer}). If they were wrong (${isWrong}), explain *why* it's a common misconception or a tempting trap (e.g., "You went with B, which is super common because people confuse X with Y..."). If they were right, validate the tricky part they got past.
6. Second: Explain clearly why **${correctAnswer}** is the actual correct answer using precise economics logic.
7. Third: End with one **📝 Exam Tip** for this type of question.

RULES:
- Be specific to Question ${questionNumber} only — do not explain other questions
- If you cannot find Question ${questionNumber} in the image, say so clearly — do NOT explain a different question
- Use markdown formatting
- No LaTeX, use plain text for math
`.trim();

        // 5. Call GPT-4o (not mini — we need strong vision for diagrams)
        const messageContent = imageBlocks.length > 0
            ? [...imageBlocks, { type: 'text', text: textPrompt }]
            : textPrompt;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',  // Must be gpt-4o for reliable vision, not gpt-4o-mini
            max_tokens: 500,
            messages: [
                {
                    role: 'system',
                    content: `You are a Cambridge A-Level Economics examiner. 
The official correct answer provided is ALWAYS right — it comes from Cambridge's mark scheme. 
Your job is only to explain WHY it is correct, never to question it.
Always look at the image carefully before responding. Be specific to the exact question asked.`
                },
                { role: 'user', content: messageContent }
            ]
        });

        const feedback = response.choices[0]?.message?.content;
        if (!feedback) throw new Error('Empty response');

        return NextResponse.json({ feedback });

    } catch (e) {
        console.error('MCQ Feedback Error:', e);
        return NextResponse.json({ error: e.message || 'Failed to generate feedback' }, { status: 500 });
    }
}
