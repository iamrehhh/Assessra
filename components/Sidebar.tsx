'use client';

import { ADMIN_EMAILS } from '@/lib/admin';

const navItems = [
    { id: 'home', icon: 'grid_view', label: 'Overview' },
    { id: 'pastpapers', icon: 'auto_stories', label: 'Past Papers' },
    { id: 'notes', icon: 'sticky_note_2', label: 'Study Notes' },
    { id: 'vocab-idioms', icon: 'menu_book', label: 'Vocab & Idioms' },
    { id: 'leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
];

export default function Sidebar({ view, setView, userEmail, isMobileOpen, setIsMobileOpen }) {
    const isAdmin = ADMIN_EMAILS.includes(userEmail);

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border-main flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: 'var(--sidebar-bg)' }}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
                        <div className="w-9 h-9 flex items-center justify-center">
                            <img src="/sidebar-icon.png" alt="Assessra Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter uppercase italic text-text-main m-0 leading-none">Assessra</h1>
                    </div>
                    <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-text-muted hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {navItems.map(item => {
                        const isActive = view === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-main border border-transparent"
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}

                    {isAdmin && (
                        <button
                            onClick={() => setView('admin')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-4 ${view === 'admin'
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : "text-red-400/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-red-400 border border-transparent"
                                }`}
                        >
                            <span className="material-symbols-outlined">admin_panel_settings</span>
                            <span className="font-medium uppercase tracking-wide text-sm font-bold">Admin</span>
                        </button>
                    )}
                </nav>
            </aside>
        </>
    );
}
