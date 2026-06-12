import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const notesDir = path.join(process.cwd(), 'data', 'notes');
        
        if (!fs.existsSync(notesDir)) {
            return NextResponse.json({ tree: {} });
        }

        const tree: Record<string, Record<string, string[]>> = {};
        
        const levels = fs.readdirSync(notesDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const level of levels) {
            tree[level] = {};
            const levelDir = path.join(notesDir, level);
            const subjects = fs.readdirSync(levelDir, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            for (const subject of subjects) {
                const subjectDir = path.join(levelDir, subject);
                const files = fs.readdirSync(subjectDir, { withFileTypes: true })
                    .filter(dirent => dirent.isFile())
                    .map(dirent => dirent.name);
                
                // Remove extensions for the frontend
                tree[level][subject] = files.map(file => file.replace(/\.[^/.]+$/, ""));
            }
        }

        return NextResponse.json({ tree });
    } catch (error) {
        console.error('Notes tree error:', error);
        return NextResponse.json({ error: 'Failed to fetch notes tree' }, { status: 500 });
    }
}
