
'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

const VALID_VIEWS = [
    'home', 'pastpapers', 'scorecard',
    'leaderboard', 'formulae', 'definitions', 'vocab', 'vocab-idioms',
    'prepositions', 'grammar-errors', 'tenses', 'tips', 'profile', 'admin'
];

function SubViewContent() {
    const { data: session, status } = useSession();
    const params = useParams();
    const view = params?.view as string;

    if (!VALID_VIEWS.includes(view)) return null;

    if (status === 'loading') {
        return (
            <div className="flex h-screen overflow-hidden bg-bg-base text-text-main font-display">
                <main className="flex-1 flex flex-col w-full h-full overflow-hidden">
                    <header className="h-20 border-b border-border-main flex items-center justify-between px-8 shrink-0">
                        <div className="h-10 w-96 rounded-xl skeleton-pulse hidden md:block" />
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full skeleton-pulse" />
                            <div className="w-10 h-10 rounded-full skeleton-pulse" />
                        </div>
                    </header>
                    <div className="flex-1 p-4 md:p-8 space-y-6">
                        <div className="h-8 w-64 rounded-lg skeleton-pulse" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="h-32 rounded-2xl skeleton-pulse" />
                            <div className="h-32 rounded-2xl skeleton-pulse" />
                            <div className="h-32 rounded-2xl skeleton-pulse" />
                        </div>
                    </div>
                </main>
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
