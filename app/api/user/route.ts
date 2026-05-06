
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import supabase from '@/lib/supabase';

// Map snake_case Supabase fields to camelCase for frontend
function mapUser(u: any) {
    if (!u) return u;
    return {
        ...u,
        isOnboarded: u.is_onboarded,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
    };
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

        if (error && error.code === 'PGRST116') {
            // User not found — create one (Google OAuth users land here on first login)
            const newUser = {
                name: session.user.name || '',
                email: session.user.email,
                image: session.user.image || '',
                nickname: '',
                level: '',
                is_onboarded: false,
                provider: 'google',
            };

            const { data: created, error: insertErr } = await supabase
                .from('users')
                .insert(newUser)
                .select()
                .single();

            if (insertErr) {
                console.error('User insert error:', insertErr);
                return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
            }

            return NextResponse.json({ user: mapUser(created) });
        }

        if (error) {
            console.error('User fetch error:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        return NextResponse.json({ user: mapUser(user) });
    } catch (error) {
        console.error('API /api/user GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // We only allow updating nickname, level, image, and is_onboarded
        const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
        if (data.nickname !== undefined) updateData.nickname = data.nickname;
        if (data.level !== undefined) updateData.level = data.level;
        if (data.image !== undefined) updateData.image = data.image;
        if (data.isOnboarded !== undefined) updateData.is_onboarded = data.isOnboarded;

        const { data: updated, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('email', session.user.email)
            .select()
            .single();

        if (error) {
            console.error('User update error:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: mapUser(updated) });
    } catch (error) {
        console.error('API /api/user POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
