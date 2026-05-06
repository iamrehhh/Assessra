
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { ADMIN_EMAILS } from '@/lib/admin';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { userId, newPassword } = body;

        if (!userId || !newPassword) {
            return NextResponse.json({ error: 'Missing userId or newPassword' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { data: updated, error } = await supabase
            .from('users')
            .update({
                password: hashedPassword,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error resetting user password:', error);
            return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (e) {
        console.error('Admin password reset error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
