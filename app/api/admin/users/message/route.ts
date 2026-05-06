
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/supabase';

import { ADMIN_EMAILS } from '@/lib/admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { userId, message } = body;

        if (!userId) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        const { error } = await supabase
            .from('users')
            .update({ admin_message: message || null, updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) {
            console.error('Error setting admin message:', error);
            return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (e) {
        console.error('Admin user message error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
