
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/supabase';

import { ADMIN_EMAILS } from '@/lib/admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, active } = await req.json();

        const { error } = await supabase
            .from('notifications')
            .upsert({ id: 1, message, active, updated_at: new Date().toISOString() });

        if (error) {
            console.error('Admin notification upsert error:', error);
            return NextResponse.json({ error: 'Failed to update notification.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Notification updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
