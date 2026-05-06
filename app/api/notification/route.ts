import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET /api/notification - fetch the active global notification
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', 1)
            .single();

        // PGRST116 means no rows returned (which is fine if table is empty)
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching notification:', error);
            return NextResponse.json({ active: false, message: '' }, { status: 200 });
        }

        // 48-hour expiry logic
        const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
        let isActive = data?.active || false;

        if (isActive && data?.updated_at) {
            const updatedAt = new Date(data.updated_at).getTime();
            const now = Date.now();
            if (now - updatedAt >= FORTY_EIGHT_HOURS_MS) {
                isActive = false;
            }
        }

        return NextResponse.json({
            active: isActive,
            message: data?.message || ''
        }, { status: 200 });
    } catch (e) {
        console.error('Notification API Error:', e);
        return NextResponse.json({ active: false, message: '' }, { status: 500 });
    }
}
