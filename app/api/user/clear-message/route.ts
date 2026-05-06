
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Clear the user's admin_message
        const { error } = await supabase
            .from('users')
            .update({ admin_message: null })
            .eq('email', session.user.email);

        if (error) {
            console.error('Error clearing admin message:', error);
            // Non-fatal, return success anyway to not break UI
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (e) {
        console.error('Clear user message error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
