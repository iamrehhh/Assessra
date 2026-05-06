
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/supabase';

import { ADMIN_EMAILS } from '@/lib/admin';

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { userId, nickname } = body;

        if (!userId) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        const { data: updated, error } = await supabase
            .from('users')
            .update({ nickname: nickname || '', updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating user nickname:', error);
            return NextResponse.json({ error: 'Failed to update nickname' }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: updated }, { status: 200 });

    } catch (e) {
        console.error('Admin user edit error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
