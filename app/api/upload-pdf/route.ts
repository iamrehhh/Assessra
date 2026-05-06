import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request) {
    try {
        const adminSecret = request.headers.get('x-admin-secret');
        if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized. Invalid or missing ADMIN_SECRET.' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'Missing file.' },
                { status: 400 }
            );
        }

        const buffer = await file.arrayBuffer();

        // Overwrite if it exists
        const { data, error } = await supabase.storage
            .from('past_papers')
            .upload(file.name, buffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from('past_papers')
            .getPublicUrl(file.name);

        return NextResponse.json({
            success: true,
            path: data.path,
            publicUrl: publicUrlData.publicUrl
        });
    } catch (err) {
        console.error('Upload API error:', err);
        return NextResponse.json(
            { error: 'PDF storage upload failed.', detail: err.message },
            { status: 500 }
        );
    }
}
