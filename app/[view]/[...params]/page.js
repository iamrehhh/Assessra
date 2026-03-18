'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

const VALID_VIEWS = [
    'home', 'ai-tutor', 'practice', 'pastpapers', 'scorecard',
    'leaderboard', 'formulae', 'definitions', 'vocab', 'vocab-idioms',
    'prepositions', 'grammar-errors', 'tenses', 'tips', 'profile', 'admin'
];

function SubViewContent() {
    const { data: session, status } = useSession();
    const params = useParams();
    const view = params?.view;

    if (!VALID_VIEWS.includes(view)) return null;

    if (status === 'loading') {
        return (
            <div className="fixed inset-0 bg-bg-base flex items-center justify-center z-50">
                <div className="w-8 h-8 border-4 border-border-main border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) return <LoginPage />;

    return <Dashboard />;
}

export default function SubViewPage() {
    return (
        <Suspense>
            <SubViewContent />
        </Suspense>
    );
}
