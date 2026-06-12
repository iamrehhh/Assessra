import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const level = searchParams.get('level');
        const subject = searchParams.get('subject');
        const type = searchParams.get('type');

        if (!level || !subject || !type) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // Prevent directory traversal
        if (level.includes('..') || subject.includes('..') || type.includes('..')) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
        }

        const notesDir = path.join(process.cwd(), 'data', 'notes');
        const targetDir = path.join(notesDir, level, subject);
        
        let content = '';
        let fileType = '';

        // Try .md first, then .json
        const mdPath = path.join(targetDir, `${type}.md`);
        const jsonPath = path.join(targetDir, `${type}.json`);

        if (fs.existsSync(mdPath)) {
            content = fs.readFileSync(mdPath, 'utf8');
            fileType = 'markdown';
        } else if (fs.existsSync(jsonPath)) {
            content = fs.readFileSync(jsonPath, 'utf8');
            fileType = 'json';
        } else {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        return NextResponse.json({ content, fileType });
    } catch (error) {
        console.error('Notes content error:', error);
        return NextResponse.json({ error: 'Failed to fetch notes content' }, { status: 500 });
    }
}
