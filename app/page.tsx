'use client';

import { useSession } from 'next-auth/react';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-bg-base flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {/* Logo with glow */}
          <div className="relative">
            <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-primary/30 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border-main shadow-2xl">
              <img src="/logo.jpg" alt="Assessra" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Brand */}
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-text-main">Assessra</h1>
          {/* Shimmer bar */}
          <div className="w-48 h-1 rounded-full bg-border-main overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return <Dashboard />;
}
