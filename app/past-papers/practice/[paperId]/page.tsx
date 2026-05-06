
'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { allMCQData } from '@/data/index';

const PracticeSplitScreen = dynamic(
    () => import('@/components/past-papers/PracticeSplitScreen'),
    { ssr: false }
);

const MCQView = dynamic(
    () => import('@/components/MCQView'),
    { ssr: false }
);

// Infer the back URL from the paperId so we can return to the right subject
function getBackHash(paperId: string) {
    const decoded = decodeURIComponent(paperId);
    // paperId format: "subject_season_year_variant"  e.g. "business_s24_qp_41"
    // or "general_paper_s24_qp_11"
    let subject = '';
    if (decoded.startsWith('general_paper') || decoded.startsWith('gp_')) subject = 'general_paper';
    else if (decoded.startsWith('economics')) subject = 'economics';
    else if (decoded.startsWith('business')) subject = 'business';

    if (subject) return `#pastpapers/alevel/${subject}`;
    return '#pastpapers';
}

export default function PastPaperPracticePage() {
    const params = useParams();
    const router = useRouter();

    if (!params.paperId) return null;

    const paperId = decodeURIComponent(params.paperId as string);
    const backHash = getBackHash(params.paperId as string);

    if (allMCQData[paperId]) {
        return <MCQView paperId={paperId} paperData={allMCQData} onBack={() => router.push('/' + backHash)} />;
    }

    return <PracticeSplitScreen paperId={params.paperId as string} backHash={backHash} />;
}
