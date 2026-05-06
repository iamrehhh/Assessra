import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// GET — fetch current chapter index for a user
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

        const { data, error } = await supabase
            .from('book_progress')
            .select('chapter_index, updated_at')
            .eq('user_email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows, which is fine (new user)
            console.error('book_progress GET error:', error);
        }

        return NextResponse.json({
            chapterIndex: data?.chapter_index ?? 0,
            updatedAt: data?.updated_at ?? null,
        });
    } catch (err) {
        console.error('API /book-progress GET error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// POST — mark current chapter as complete, advance to next
export async function POST(req) {
    try {
        const { email, chapterIndex, totalChapters, bookTitle } = await req.json();
        if (!email || chapterIndex === undefined) {
            return NextResponse.json({ error: 'Missing email or chapterIndex' }, { status: 400 });
        }

        const nextIndex = chapterIndex + 1;
        const isComplete = nextIndex >= totalChapters;

        // Upsert progress
        const { error: upsertErr } = await supabase
            .from('book_progress')
            .upsert({
                user_email: email,
                chapter_index: isComplete ? chapterIndex : nextIndex,
                book_completed: isComplete,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_email' });

        if (upsertErr) {
            console.error('book_progress upsert error:', JSON.stringify(upsertErr, null, 2));
            return NextResponse.json({ error: 'Failed to update progress', details: upsertErr.message }, { status: 500 });
        }

        // If book is complete, record in completions
        if (isComplete) {
            const { error: compErr } = await supabase
                .from('book_completions')
                .insert({
                    user_email: email,
                    book_title: bookTitle || 'Nexus',
                    completed_at: new Date().toISOString(),
                });

            if (compErr) {
                console.error('book_completions insert error:', compErr);
                // Non-fatal — progress is already saved
            }
        }

        return NextResponse.json({
            success: true,
            newChapterIndex: isComplete ? chapterIndex : nextIndex,
            bookCompleted: isComplete,
        });
    } catch (err) {
        console.error('API /book-progress POST error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
