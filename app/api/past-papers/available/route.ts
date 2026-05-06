import { NextResponse } from 'next/server';
import { paperListings } from '@/data/index'; // Import local papers

export async function GET() {
    try {
        // We are moving to a fully structured, static setup for certain subjects.
        // We will mock the "document" structure expected by the frontend.
        const documents = [];

        // Helper to convert our local paper listings into the expected "document" format
        const processListings = (listingsArray, subject, level) => {
            listingsArray.forEach(paper => {
                // The expected structure by PastPapersView is:
                // { filename, subject, level, year, type }

                // Extract season (e.g. 'Oct / Nov Series' -> 'Oct-Nov')
                let seasonPrefix = 's'; // default May/June
                if (paper.series.includes('Oct')) seasonPrefix = 'w';
                else if (paper.series.includes('Feb')) seasonPrefix = 'm';

                // Extract paper number prefix (e.g., "8021/12" -> "12")
                const codeParts = paper.code.split('/');
                const variant = codeParts.length > 1 ? codeParts[1] : '1';

                // Construct a mock filename that matches the Cambridge convention the UI expects
                // e.g., 9708_s25_qp_32.pdf
                // The exact prefix doesn't matter much as long as it parses correctly in the UI
                const mockFilename = `${subject}_${seasonPrefix}${paper.year.slice(-2) || '25'}_qp_${variant}.pdf`;

                documents.push({
                    filename: mockFilename, // UI uses this to parse year/season/paper Num
                    originalId: paper.id, // We'll pass this via routing later
                    subject,
                    level,
                    year: paper.year || '2025',
                    type: 'paper'
                });
            });
        };

        // Populate our documents
        processListings(paperListings['business-p3'] || [], 'business', 'alevel');
        processListings(paperListings['business-p4'] || [], 'business', 'alevel');
        processListings(paperListings['economics-p3'] || [], 'economics', 'alevel');
        processListings(paperListings['economics-p4'] || [], 'economics', 'alevel');
        processListings(paperListings['general-p1'] || [], 'general_paper', 'alevel');

        return NextResponse.json({
            success: true,
            levels: ['alevel'], // Hardcoded to A Level for now
            subjectsByLevel: {
                'alevel': ['business', 'economics', 'general_paper']
            },
            documents
        });

    } catch (err) {
        console.error('Error fetching available past papers:', err);
        return NextResponse.json({ error: 'Failed to fetch available past papers' }, { status: 500 });
    }
}
