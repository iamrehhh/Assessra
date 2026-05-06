
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import supabase from '@/lib/supabase';

import { ADMIN_EMAILS } from '@/lib/admin';

// GET — fetch reports (admin: all, user: own)
export async function GET(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const isAdmin = ADMIN_EMAILS.includes(session.user.email);
        const userOnly = searchParams.get('mine') === 'true';

        let query = supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });

        // Non-admins can only see their own reports
        if (!isAdmin || userOnly) {
            query = query.eq('user_email', session.user.email);
        }

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json({ reports: data || [] });
    } catch (err) {
        console.error('GET /api/reports error:', err);
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}

// POST — create a new report
export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { category, page, description, screenshot_url } = body;

        if (!description || !description.trim()) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        const initialMessage = {
            sender: 'user',
            text: description.trim(),
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('reports')
            .insert({
                user_email: session.user.email,
                user_name: session.user.name || session.user.email,
                category: category || 'other',
                page: page || 'unknown',
                description: description.trim(), // keeping for compatibility, but mainly use messages array now
                messages: [initialMessage],
                screenshot_url: screenshot_url || null,
                status: 'open',
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ report: data });
    } catch (err) {
        console.error('POST /api/reports error:', err);
        return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
    }
}

// PATCH — update report status/reply
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = ADMIN_EMAILS.includes(session.user.email);
        const body = await req.json();
        const { id, status, new_message } = body;

        if (!id) {
            return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
        }

        // Fetch current report to append messages
        const { data: currentReport, error: fetchError } = await supabase
            .from('reports')
            .select('messages, user_email')
            .eq('id', id)
            .single();

        if (fetchError || !currentReport) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        // Ensure users can only reply to their own reports
        if (!isAdmin && currentReport.user_email !== session.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updates: Record<string, any> = {};

        // Only admins can change status
        if (isAdmin && status) {
            updates.status = status;
        }

        if (new_message && new_message.trim()) {
            const messages = currentReport.messages || [];
            messages.push({
                sender: isAdmin ? 'admin' : 'user',
                text: new_message.trim(),
                created_at: new Date().toISOString()
            });
            updates.messages = messages;

            // Legacy field for easy unread check in TopHeader.js
            if (isAdmin) {
                updates.admin_reply = new_message.trim();
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('reports')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ report: data });
    } catch (err) {
        console.error('PATCH /api/reports error:', err);
        return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
    }
}

// DELETE — completely remove a report (admin only)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const reportId = searchParams.get('id');

        if (!reportId) {
            return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', reportId);

        if (error) throw error;

        return NextResponse.json({ success: true, id: reportId });

    } catch (err) {
        console.error('DELETE /api/reports error:', err);
        return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
    }
}
