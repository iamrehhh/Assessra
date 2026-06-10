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

        const { subject_id, duration_minutes } = await req.json();

        if (!subject_id || typeof duration_minutes !== 'number') {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        const { error } = await supabase
            .from('mcq_timers')
            .upsert({ 
                subject_id, 
                duration_minutes,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Admin MCQ timer upsert error:', error);
            // Ignore missing table error for now so we don't crash the UI if not created yet
            if (error.code === 'PGRST205') {
                return NextResponse.json({ error: 'Database table not created yet. Please run the migration script.' }, { status: 400 });
            }
            return NextResponse.json({ error: 'Failed to update timer.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Timer updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating MCQ timer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
