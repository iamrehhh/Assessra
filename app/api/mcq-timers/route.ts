import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('mcq_timers')
            .select('subject_id, duration_minutes');

        if (error) {
            console.error('Failed to fetch MCQ timers:', error);
            // Non-fatal, just return empty so default is used
            return NextResponse.json({ success: true, timers: {} }, { status: 200 });
        }

        // Convert array to object mapping
        const timers = {};
        if (data) {
            data.forEach((item) => {
                timers[item.subject_id] = item.duration_minutes;
            });
        }

        return NextResponse.json({ success: true, timers }, { status: 200 });
    } catch (error) {
        console.error('API Error fetching MCQ timers:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
