
// GET /api/mcq-attempts?paperId=xxx
// Returns existing MCQ attempt for the current user + paperId from the scores table

import supabase from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const paperId = searchParams.get('paperId');

        if (!paperId) {
            return Response.json({ error: 'paperId required' }, { status: 400 });
        }

        // Try fetching with user_answers column first
        let { data, error }: { data: any, error: any } = await supabase
            .from('scores')
            .select('score, max_marks, percentage, submitted_at, user_answers')
            .eq('username', session.user.email)
            .eq('paper_id', paperId)
            .order('submitted_at', { ascending: false })
            .limit(1);

        // If user_answers column doesn't exist, retry without it
        if (error && error.message && error.message.includes('user_answers')) {
            const retryResult = await supabase
                .from('scores')
                .select('score, max_marks, percentage, submitted_at')
                .eq('username', session.user.email)
                .eq('paper_id', paperId)
                .order('submitted_at', { ascending: false })
                .limit(1);
            data = retryResult.data;
            error = retryResult.error;
        }

        if (error) {
            console.error('MCQ attempt fetch error:', error);
            return Response.json({ error: 'Failed to fetch attempt' }, { status: 500 });
        }

        if (data && data.length > 0) {
            return Response.json({
                found: true,
                score: data[0].score,
                maxMarks: data[0].max_marks,
                percentage: data[0].percentage,
                submittedAt: data[0].submitted_at,
                userAnswers: data[0].user_answers || null,
            });
        }

        return Response.json({ found: false });
    } catch (err) {
        console.error('MCQ attempt error:', err);
        return Response.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const paperId = searchParams.get('paperId');

        if (!paperId) {
            return Response.json({ error: 'paperId required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('scores')
            .delete()
            .eq('username', session.user.email)
            .eq('paper_id', paperId);

        if (error) {
            console.error('MCQ attempt delete error:', error);
            return Response.json({ error: 'Failed to delete attempt' }, { status: 500 });
        }

        return Response.json({ success: true });
    } catch (err) {
        console.error('MCQ attempt delete error:', err);
        return Response.json({ error: 'Internal error' }, { status: 500 });
    }
}
