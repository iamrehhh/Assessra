
// Admin scores API — GET all scores, DELETE scores for a user
// Only accessible by the admin email

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

// GET /api/admin/scores — all scores with user info
export async function GET() {
    const session = await verifyAdmin();
    if (!session) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: scores, error } = await supabase
        .from('scores')
        .select('*')
        .order('submitted_at', { ascending: false });

    if (error) {
        console.error('Admin scores fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch scores.' }, { status: 500 });
    }

    // Enrich with user nicknames
    const emails = [...new Set((scores || []).map(s => s.username))];
    let userLookup = {};
    if (emails.length > 0) {
        const { data: users } = await supabase
            .from('users')
            .select('email, nickname, name')
            .in('email', emails);
        for (const u of (users || [])) {
            userLookup[u.email] = u;
        }
    }

    const mapped = (scores || []).map(s => ({
        ...s,
        paperId: s.paper_id,
        paperTitle: s.paper_title,
        questionNumber: s.question_number,
        maxMarks: s.max_marks,
        submittedAt: s.submitted_at,
        userNickname: userLookup[s.username]?.nickname || '',
        userName: userLookup[s.username]?.name || '',
    }));

    return NextResponse.json({ scores: mapped });
}

// DELETE /api/admin/scores?username=<email> — reset all scores for a user
export async function DELETE(req: Request) {
    const session = await verifyAdmin();
    if (!session) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username (email) required.' }, { status: 400 });
    }

    const { error } = await supabase.from('scores').delete().eq('username', username);

    if (error) {
        console.error('Admin reset scores error:', error);
        return NextResponse.json({ error: 'Failed to reset scores.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
