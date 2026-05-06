
import { NextResponse } from 'next/server';
import { allPaperData, allMCQData, allGeneralPaperData } from '@/data/index';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        // "filename" here is actually "paperId" because of the way we changed the routing
        const paperId = searchParams.get('filename');

        if (!paperId) {
            return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
        }

        // 1. Find the paper in our static data dictionaries
        const paperData = allPaperData[paperId] || allMCQData[paperId] || allGeneralPaperData[paperId];

        if (!paperData) {
            return NextResponse.json({ error: 'Paper not found in local data.' }, { status: 404 });
        }

        // 2. Construct the local public pdf URLs
        // We will host them in public/past_papers/papers/ (or /inserts/ etc based on the pdf string)
        // Usually, `paperData.pdf` looks like "papers/8021_m25_qp_12.pdf"

        const finalPdfUrl = paperData.pdf.startsWith('past_papers/')
            ? `/${paperData.pdf}`
            : `/past_papers/${paperData.pdf}`;
        const finalInsertUrl = paperData.insert
            ? (paperData.insert.startsWith('past_papers/') ? `/${paperData.insert}` : `/past_papers/${paperData.insert}`)
            : null;

        // Let's deduce subject, level, year from our structures
        // Our IDs look like: gp_2025_mj_12, econ_2024_w_42, etc.
        const idParts = paperId.split('_');
        let subject = 'unknown';
        if (paperId.startsWith('gp_')) subject = 'general_paper';
        else if (paperId.startsWith('bus_')) subject = 'business';
        else if (paperId.startsWith('econ_')) subject = 'economics';

        let year = '2025';
        if (idParts.length >= 2 && !isNaN(Number(idParts[1]))) {
            year = idParts[1];
        }

        return NextResponse.json({
            pdfUrl: finalPdfUrl,
            insertFilename: paperData.insert ? path.basename(paperData.insert) : null,
            insertUrl: finalInsertUrl,
            questions: paperData.questions || [],
            meta: {
                title: paperData.title,
                subject,
                level: 'alevel',
                year
            }
        });

    } catch (err) {
        console.error('API /past-papers/info error:', err);
        return NextResponse.json({ error: 'Failed to fetch paper info' }, { status: 500 });
    }
}
