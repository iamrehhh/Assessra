
// POST /api/scores/save
// Saves a paper attempt score to Supabase

import supabase from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { paperId, paperTitle, subject, questionNumber, score, maxMarks, userAnswers } = body;
        const username = session.user.email; // Force use of authenticated email

        if (!paperId || score === undefined || !maxMarks) {
            return Response.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        const insertData: Record<string, any> = {
            username,
            paper_id: paperId,
            paper_title: paperTitle || paperId,
            subject: subject || 'unknown',
            question_number: questionNumber || 'all',
            score: Number(score),
            max_marks: Number(maxMarks),
            percentage: Math.round((score / maxMarks) * 100),
        };

        // Include user answers if provided (requires user_answers column in scores table)
        if (userAnswers) {
            insertData.user_answers = userAnswers;
        }

        let { error } = await supabase.from('scores').insert(insertData);

        // If user_answers column doesn't exist, retry without it
        if (error && error.message && error.message.includes('user_answers')) {
            console.warn('user_answers column not found, saving without answers');
            delete insertData.user_answers;
            const retryResult = await supabase.from('scores').insert(insertData);
            error = retryResult.error;
        }

        if (error) {
            console.error('Score insert error:', error);
            return Response.json({ error: 'Failed to save score.' }, { status: 500 });
        }

        return Response.json({ success: true });
    } catch (err) {
        console.error('Score save error:', err);
        return Response.json({ error: 'Failed to save score.' }, { status: 500 });
    }
}
