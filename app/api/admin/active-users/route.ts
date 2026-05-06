
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

        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

        const { data: activeUsers, error } = await supabase
            .from('active_users')
            .select('*')
            .gte('last_seen', fifteenMinutesAgo)
            .order('last_seen', { ascending: false });

        if (error) {
            console.error('Admin active users fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch active users.' }, { status: 500 });
        }

        return NextResponse.json({ activeUsers: activeUsers || [] });
    } catch (err) {
        console.error('Admin active users API error:', err);
        return NextResponse.json({ error: 'Failed to fetch logs.' }, { status: 500 });
    }
}
