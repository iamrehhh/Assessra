
'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { allMCQData } from '@/data/index';

const PracticeSplitScreen = dynamic(
    () => import('@/components/past-papers/PracticeSplitScreen'),
    { ssr: false }
);

const MCQView = dynamic(
    () => import('@/components/MCQView'),
    { ssr: false }
);

// Build the back path from query params or by inferring from the paperId.
// Returns a path-based URL like "/pastpapers/alevel/economics".
function getBackPath(paperId: string, searchParams: URLSearchParams) {
    // Prefer explicit query params (passed by PastPapersView)
    const level = searchParams.get('level');
    const subject = searchParams.get('subject');

    if (level && subject) {
        return `/pastpapers/${level}/${subject}`;
    }

    // Fallback: infer from the paperId string
    const decoded = decodeURIComponent(paperId);
    let inferredSubject = '';
    let inferredLevel = 'alevel'; // default

    if (decoded.startsWith('general_paper') || decoded.startsWith('gp_')) {
        inferredSubject = 'general_paper';
        inferredLevel = 'alevel';
    } else if (decoded.startsWith('economics')) {
        inferredSubject = 'economics';
        inferredLevel = 'alevel';
    } else if (decoded.startsWith('business')) {
        inferredSubject = 'business';
        inferredLevel = 'alevel';
    } else if (decoded.startsWith('phys_')) {
        inferredSubject = 'physics';
        inferredLevel = 'igcse';
    } else if (decoded.startsWith('bio_')) {
        inferredSubject = 'biology';
        inferredLevel = 'igcse';
    }

    if (inferredSubject) {
        return `/pastpapers/${inferredLevel}/${inferredSubject}`;
    }

    // If we can't determine the subject at all, go to pastpapers root
    return '/pastpapers';
}

function PracticePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    if (!params.paperId) return null;

    const paperId = decodeURIComponent(params.paperId as string);
    const backPath = getBackPath(params.paperId as string, searchParams);

    if (allMCQData[paperId]) {
        return <MCQView paperId={paperId} paperData={allMCQData} onBack={() => router.push(backPath)} />;
    }

    return <PracticeSplitScreen paperId={params.paperId as string} backPath={backPath} />;
}

export default function PastPaperPracticePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-bg-base text-text-main">
                <div className="w-8 h-8 border-4 border-border-main border-t-primary rounded-full animate-spin"></div>
            </div>
        }>
            <PracticePage />
        </Suspense>
    );
}
