import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import supabase from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
        }

        // Generate a unique filename
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const buffer = await file.arrayBuffer();

        // Upload to the 'report_screenshots' bucket
        const { data, error } = await supabase.storage
            .from('report_screenshots')
            .upload(fileName, buffer, {
                contentType: file.type || 'image/png',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
            .from('report_screenshots')
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl
        });

    } catch (err) {
        console.error('Upload Screenshot API error:', err);
        return NextResponse.json(
            { error: 'Screenshot upload failed.', detail: err.message },
            { status: 500 }
        );
    }
}
