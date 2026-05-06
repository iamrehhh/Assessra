
// Admin API routes — GET all users, DELETE a user, POST reset scores
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

// GET /api/admin/users — list all users
export async function GET() {
    const session = await verifyAdmin();
    if (!session) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, nickname, level, is_onboarded, provider, image, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Admin users fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
    }

    // Map for frontend
    const mapped = (users || []).map(u => ({
        ...u,
        isOnboarded: u.is_onboarded,
        createdAt: u.created_at,
    }));

    return NextResponse.json({ users: mapped });
}

// DELETE /api/admin/users?id=<uuid> — delete a user and their scores
export async function DELETE(req: Request) {
    const session = await verifyAdmin();
    if (!session) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required.' }, { status: 400 });
    }

    // Get user email first (to delete their scores)
    const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

    if (!user) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Prevent deleting admin
    if (ADMIN_EMAILS.includes(user.email)) {
        return NextResponse.json({ error: 'Cannot delete admin account.' }, { status: 400 });
    }

    // Delete user's scores
    await supabase.from('scores').delete().eq('username', user.email);

    // Delete user
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) {
        console.error('Admin delete user error:', error);
        return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
