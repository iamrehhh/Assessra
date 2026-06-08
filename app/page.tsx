'use client';

import { useSession } from 'next-auth/react';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';

// Deterministic widths for skeleton nav items to avoid Math.random() hydration mismatches
const SKELETON_NAV_WIDTHS = [67, 74, 81, 60, 88, 72];

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen overflow-hidden bg-bg-base text-text-main font-display">
        {/* Skeleton Sidebar — hidden on mobile, visible on lg */}
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

        {/* Main content area */}
        <main className="flex-1 flex flex-col w-full h-full overflow-hidden">
          {/* Skeleton Top Header */}
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

          {/* Skeleton Content */}
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
        </main>
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return <Dashboard />;
}
