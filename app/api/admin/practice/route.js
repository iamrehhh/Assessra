// app/api/admin/practice/route.js
// GET endpoint to fetch AI practice logs for the admin panel

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/supabase';

import { ADMIN_EMAILS } from '@/lib/admin';

async function verifyAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
        return null;
    }
    return session;
}

export async function GET() {
    try {
        const session = await verifyAdmin();
        if (!session) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // We now fetch from the 'scores' table where paper_id starts with 'ai_practice_'
        // instead of the raw practice_logs because PracticeView now saves to the scores table
        const { data: practiceScores, error } = await supabase
            .from('scores')
            .select('*')
            .ilike('paper_id', 'ai_practice_%')
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('Admin practice scores fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch practice scores.' }, { status: 500 });
        }

        // Map the structure of 'scores' to match the expected AdminView practice logging structure
        const mappedLogs = (practiceScores || []).map(score => ({
            id: score.id,
            user_email: score.username,
            user_name: score.username || '',
            subject: score.subject,
            level: 'A Level', // Default fallback
            topic: score.paper_title || 'Mixed AI Practice',
            question_type: score.paper_id.includes('mcq') ? 'multiple_choice' : 'structured',
            score: score.score,
            marks: score.max_marks,
            created_at: score.submitted_at
        }));

        return NextResponse.json({ practiceScores: mappedLogs });
    } catch (err) {
        console.error('Admin practice logs API error:', err);
        return NextResponse.json({ error: 'Failed to fetch logs.' }, { status: 500 });
    }
}
