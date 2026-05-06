
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/supabase';

// Get total active users (last 15 minutes)
export async function GET() {
    try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const { count, error } = await supabase
            .from('active_users')
            .select('*', { count: 'exact', head: true })
            .gte('last_seen', fifteenMinutesAgo);

        if (error) {
            console.error('Failed to fetch active users count:', error);
            // Return 1 as fallback (at least the current user is active)
            return NextResponse.json({ activeUsers: 1 });
        }

        return NextResponse.json({ activeUsers: count || 1 });
    } catch (err) {
        console.error('Active users GET API error:', err);
        return NextResponse.json({ activeUsers: 1 });
    }
}

// Update last_seen heartbeat
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const urlParams = new URL(req.url);
        const currentPage = body?.page || urlParams.searchParams.get('page') || 'home';

        // Upsert user into active_users table
        const { error } = await supabase
            .from('active_users')
            .upsert({
                email: session.user.email,
                name: session.user.name || (session.user as any).nickname || 'Student',
                last_seen: new Date().toISOString(),
                current_page: currentPage
            });

        if (error) {
            console.error('Failed to set active user heartbeat:', error);
            return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Active users POST API error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
