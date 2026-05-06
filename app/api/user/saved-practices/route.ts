
import supabase from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all saved practices for the authenticated user
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('saved_practices')
            .select('*')
            .eq('user_email', session.user.email)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return Response.json({ savedPractices: data });
    } catch (err) {
        console.error('Fetch saved practices error:', err);
        return Response.json({ error: 'Failed to fetch saved practices' }, { status: 500 });
    }
}

// POST a new saved practice
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { subject, topic, is_mcq, score, max_marks, practice_data } = body;

        if (!subject || !topic || score === undefined || max_marks === undefined || !practice_data) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('saved_practices')
            .insert({
                user_email: session.user.email,
                subject,
                topic,
                is_mcq: !!is_mcq,
                score,
                max_marks,
                practice_data
            })
            .select()
            .single();

        if (error) throw error;

        return Response.json({ success: true, savedPractice: data });
    } catch (err) {
        console.error('Save practice error:', err);
        return Response.json({ error: 'Failed to save practice set' }, { status: 500 });
    }
}

// DELETE a saved practice by ID
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return Response.json({ error: 'Missing practice ID' }, { status: 400 });
        }

        // Verify ownership before deleting
        const { error } = await supabase
            .from('saved_practices')
            .delete()
            .match({ id, user_email: session.user.email });

        if (error) throw error;

        return Response.json({ success: true });
    } catch (err) {
        console.error('Delete saved practice error:', err);
        return Response.json({ error: 'Failed to delete saved practice' }, { status: 500 });
    }
}
