
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import HomeView from './views/HomeView';

import LeaderboardView from './views/LeaderboardView';
import FormulaeView from './views/FormulaeView';
import DefinitionsView from './views/DefinitionsView';
import TipsView from './views/TipsView';
import OnboardingView from './views/OnboardingView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';

import PastPapersView from './views/PastPapersView';
import VocabIdiomsView from './views/VocabIdiomsView';
import ReportErrorModal from './ReportErrorModal';

const VALID_VIEWS = ['home', 'pastpapers', 'leaderboard', 'formulae', 'definitions', 'vocab-idioms', 'tips', 'profile', 'admin'];

// Parse the current URL into { view, params }
// Supports path-based (/leaderboard) AND legacy hash-based (#leaderboard)
function parsePath() {
    if (typeof window === 'undefined') return { view: 'home', params: [] };

    // Path-based (new) e.g. /pastpapers/alevel/economics
    const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (pathname) {
        const parts = pathname.split('/');
        const baseView = parts[0];
        if (VALID_VIEWS.includes(baseView)) {
            return { view: baseView, params: parts.slice(1) };
        }
    }

    // Hash-based fallback (legacy) e.g. #pastpapers/alevel/economics
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const parts = hash.split('/');
        const baseView = parts[0];
        if (VALID_VIEWS.includes(baseView)) {
            return { view: baseView, params: parts.slice(1) };
        }
    }

    return { view: 'home', params: [] };
}

// Deterministic widths for skeleton items
const SKELETON_NAV_WIDTHS = [67, 74, 81, 60, 88, 72];

// Content skeleton shown inside the persistent shell while profile loads
function ContentSkeleton() {
    return (
        <div className="flex-1 p-4 md:p-8 space-y-6">
            <div className="space-y-3">
                <div className="h-8 w-64 rounded-lg skeleton-pulse" />
                <div className="h-4 w-48 rounded-md skeleton-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-32 rounded-2xl skeleton-pulse" />
                ))}
            </div>
            <div className="space-y-3 mt-4">
                <div className="h-6 w-40 rounded-md skeleton-pulse" />
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-xl skeleton-pulse" />
                ))}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { data: session } = useSession();
    const [view, setViewState] = useState<string>(() => parsePath().view);
    const [urlParams, setUrlParams] = useState<string[]>(() => parsePath().params);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
    const profileIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Track view changes for transition animation
    const [viewKey, setViewKey] = useState(0);
    const prevViewRef = useRef(view);

    // Navigate — writes a clean path URL so refresh lands on the right view
    const setView = useCallback((newView: string) => {
        const parts = newView.split('/');
        const baseView = parts[0];
        const params = parts.slice(1);
        setViewState(baseView);
        setUrlParams(params);
        setViewKey(k => k + 1);
        const path = (!baseView || baseView === 'home') ? '/' : '/' + newView;
        window.history.pushState(null, '', path);
    }, []);

    // Browser back / forward
    useEffect(() => {
        const onPopState = () => {
            const { view: v, params: p } = parsePath();
            setViewState(v);
            setUrlParams(p);
            setViewKey(k => k + 1);
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    // On first load, silently migrate any legacy hash URL to a path URL
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const parts = hash.split('/');
            const baseView = parts[0];
            if (VALID_VIEWS.includes(baseView)) {
                const path = baseView === 'home' ? '/' : '/' + hash;
                window.history.replaceState(null, '', path);
                setViewState(baseView);
                setUrlParams(parts.slice(1));
            }
        }
    }, []);

    // Fetch user profile with stable interval (no stacking)
    useEffect(() => {
        if (!session?.user) {
            setIsLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    setUserProfile(data.user);
                }
            } catch (err) {
                console.error('Failed to load user profile:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
        if (profileIntervalRef.current) clearInterval(profileIntervalRef.current);
        profileIntervalRef.current = setInterval(fetchProfile, 45000);

        return () => {
            if (profileIntervalRef.current) {
                clearInterval(profileIntervalRef.current);
                profileIntervalRef.current = null;
            }
        };
    }, [session]);

    // If not onboarded, show onboarding
    if (!isLoading && userProfile && !userProfile.isOnboarded) {
        return <OnboardingView
            userEmail={session?.user?.email}
            onComplete={(updatedProfile) => setUserProfile(updatedProfile)}
        />;
    }

    // Error state: profile fetch failed
    if (!isLoading && !userProfile) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', textAlign: 'center' }}>
                <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>Failed to load profile</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>There was an error communicating with the server.</p>
                <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Retry
                </button>
            </div>
        );
    }

    const renderContent = () => {
        switch (view) {
            case 'home':
                return <HomeView setView={setView} setSelectedSubject={setSelectedSubject} />;

            case 'leaderboard':
                return <LeaderboardView />;
            case 'formulae':
                return <FormulaeView />;
            case 'definitions':
                return <DefinitionsView />;

            case 'pastpapers':
                return <PastPapersView
                    initialLevel={urlParams[0] || null}
                    initialSubject={urlParams[1] || null}
                    setView={setView}
                />;

            case 'vocab-idioms':
                return <VocabIdiomsView />;

            case 'tips':
                return <TipsView />;
            case 'profile':
                return <ProfileView userProfile={userProfile} onProfileUpdate={setUserProfile} />;
            case 'admin':
                return <AdminView />;
            default:
                return <HomeView setView={setView} setSelectedSubject={setSelectedSubject} />;
        }
    };

    // Persistent shell: sidebar + header always render, only content area changes.
    // During profile loading, show skeleton content inside the shell.
    return (
        <div className="flex h-screen overflow-hidden bg-bg-base text-text-main font-display">
            {/* Sidebar: show skeleton version while loading, real version when ready */}
            {isLoading ? (
                <aside className="hidden lg:flex w-64 border-r border-border-main flex-col shrink-0" style={{ background: 'var(--sidebar-bg, var(--bg-base))' }}>
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl skeleton-pulse" />
                        <div className="h-5 w-24 rounded-md skeleton-pulse" />
                    </div>
                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        {SKELETON_NAV_WIDTHS.map((w, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl">
                                <div className="w-6 h-6 rounded skeleton-pulse" />
                                <div className="h-4 rounded-md skeleton-pulse" style={{ width: `${w}%` }} />
                            </div>
                        ))}
                    </nav>
                </aside>
            ) : (
                <Sidebar view={view} setView={setView} userEmail={session?.user?.email} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            )}

            <main className="flex-1 flex flex-col w-full h-full overflow-hidden">
                {/* Header: show skeleton version while loading, real version when ready */}
                {isLoading ? (
                    <header className="h-20 border-b border-border-main flex items-center justify-between px-8 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-96 rounded-xl skeleton-pulse hidden md:block" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full skeleton-pulse" />
                            <div className="w-8 h-8 rounded-full skeleton-pulse" />
                            <div className="w-10 h-10 rounded-full skeleton-pulse" />
                        </div>
                    </header>
                ) : (
                    <TopHeader setView={setView} userProfile={userProfile} setIsMobileOpen={setIsMobileOpen} />
                )}

                {/* Content: skeleton during load, animated view transitions after */}
                {isLoading ? (
                    <ContentSkeleton />
                ) : (
                    <div key={viewKey} className="flex-1 p-4 md:p-8 space-y-8 pb-10 view-transition-in overflow-y-auto">
                        {renderContent()}
                    </div>
                )}


            </main>
            {!isLoading && <ReportErrorModal currentView={view} />}
        </div>
    );
}
