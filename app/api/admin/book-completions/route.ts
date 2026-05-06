import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('book_completions')
            .select('*')
            .order('completed_at', { ascending: false });

        if (error) {
            console.error('book_completions GET error:', error);
            return NextResponse.json({ completions: [] });
        }

        return NextResponse.json({ completions: data || [] });
    } catch (err) {
        console.error('API /admin/book-completions error:', err);
        return NextResponse.json({ completions: [] }, { status: 500 });
    }
}
