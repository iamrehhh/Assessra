// GET /api/scores/user?username=user@email.com
// Returns all score attempts for a specific user

import supabase from '@/lib/supabase';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        if (!username) {
            return Response.json({ error: 'username query param required.' }, { status: 400 });
        }

        const { data: attempts, error } = await supabase
            .from('scores')
            .select('*')
            .eq('username', username)
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('Scores fetch error:', error);
            return Response.json({ error: 'Failed to fetch scores.' }, { status: 500 });
        }

        // Aggregate totals per subject
        const subjectTotals = {};
        let grandTotal = 0;
        let grandMax = 0;

        for (const a of (attempts || [])) {
            const s = a.subject || 'unknown';
            if (!subjectTotals[s]) subjectTotals[s] = { score: 0, maxMarks: 0, attempts: 0 };
            subjectTotals[s].score += a.score;
            subjectTotals[s].maxMarks += a.max_marks;
            subjectTotals[s].attempts += 1;
            grandTotal += a.score;
            grandMax += a.max_marks;
        }

        // Map snake_case fields to camelCase for frontend compatibility
        const mappedAttempts = (attempts || []).map(a => ({
            ...a,
            paperId: a.paper_id,
            paperTitle: a.paper_title,
            questionNumber: a.question_number,
            maxMarks: a.max_marks,
            submittedAt: a.submitted_at,
        }));

        return Response.json({
            username,
            attempts: mappedAttempts,
            subjectTotals,
            grandTotal,
            grandMax,
            grandPercent: grandMax > 0 ? Math.round((grandTotal / grandMax) * 100) : 0,
        });
    } catch (err) {
        console.error('Scores fetch error:', err);
        return Response.json({ error: 'Failed to fetch scores.' }, { status: 500 });
    }
}
