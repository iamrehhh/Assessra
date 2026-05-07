'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export default function HomeView({ setView, setSelectedSubject }) {
    const { data: session } = useSession();
    const [quote, setQuote] = useState("Keep up the momentum! You're making great progress.");
    const [stats, setStats] = useState({
        rank: '-',
        avgScore: 0,
        totalScore: 0,
        todayScore: 0,
        leaderboardTop3: [],
        completedModules: 0,
        streak: 0,
    });
    const [activeUsers, setActiveUsers] = useState(1);

    // Resume State
    const [recentActivity, setRecentActivity] = useState(null);

    const user = session?.user?.name || 'Student';
    const firstName = user.split(' ')[0] || 'Student';

    useEffect(() => {
        if (!session?.user?.email) return;

        const userEmail = session.user.email;

        const fetchData = async () => {
            try {
                // Fetch in parallel
                const [scoresRes, lbRes, quoteRes] = await Promise.all([
                    fetch(`/api/scores/user?username=${encodeURIComponent(userEmail)}`),
                    fetch('/api/leaderboard'),
                    fetch('/api/quote')
                ]);

                // Parse in parallel
                const [scoresData, lbData, quoteData] = await Promise.all([
                    scoresRes.json(),
                    lbRes.json(),
                    quoteRes.ok ? quoteRes.json() : Promise.resolve({})
                ]);

                if (quoteData.quote) setQuote(quoteData.quote);

                let totalS = 0;
                let todayS = 0;
                let totalMax = 0;
                let completed = 0;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const allRecords = scoresData.attempts || scoresData.scores || [];
                completed = allRecords.length;

                const scoresByDate = {};
                
                allRecords.forEach(s => {
                    totalS += s.score;
                    totalMax += s.maxMarks;

                    const attemptDate = new Date(s.submittedAt || s.submitted_at);
                    const dateStr = attemptDate.toLocaleDateString();
                    scoresByDate[dateStr] = (scoresByDate[dateStr] || 0) + s.score;

                    attemptDate.setHours(0, 0, 0, 0);
                    if (attemptDate.getTime() === today.getTime()) {
                        todayS += s.score;
                    }
                });

                const avg = totalMax > 0 ? Math.round((totalS / totalMax) * 100 * 10) / 10 : 0;

                // Find rank in leaderboard
                let currentRank = '-';
                if (lbData.leaderboard) {
                    const idx = lbData.leaderboard.findIndex(u => u.username === userEmail);
                    if (idx !== -1) currentRank = idx + 1;
                }

                // Calculate streak
                let calculatedStreak = 0;
                if (allRecords.length > 0) {
                    let checkDate = new Date();
                    const todayStr = checkDate.toLocaleDateString();
                    if ((scoresByDate[todayStr] || 0) >= 50) calculatedStreak++;
                    
                    checkDate.setDate(checkDate.getDate() - 1);
                    while (true) {
                        const prevStr = checkDate.toLocaleDateString();
                        if ((scoresByDate[prevStr] || 0) >= 50) {
                            calculatedStreak++;
                            checkDate.setDate(checkDate.getDate() - 1);
                        } else break;
                    }
                }

                setStats({
                    rank: currentRank,
                    avgScore: avg,
                    totalScore: totalS,
                    todayScore: todayS,
                    leaderboardTop3: lbData.leaderboard ? lbData.leaderboard.slice(0, 3) : [],
                    completedModules: completed,
                    streak: calculatedStreak,
                });

            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            }
        };

        fetchData();
    }, [session]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('assessra_recent_activity');
            if (saved) {
                try {
                    setRecentActivity(JSON.parse(saved));
                } catch (e) {}
            }
        }
    }, []);
    useEffect(() => {
        if (!session?.user?.email) return;

        const pingActive = async () => {
            try {
                // Ping to update our own status
                await fetch('/api/active-users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page: 'home' })
                });

                // Fetch total active
                const res = await fetch('/api/active-users');
                if (res.ok) {
                    const data = await res.json();
                    setActiveUsers(data.activeUsers || 1);
                }
            } catch (err) {
                console.error('Failed active users heartbeat:', err);
            }
        };

        pingActive(); // initial ping
        const interval = setInterval(pingActive, 60000); // exactly every 1 minute
        return () => clearInterval(interval);
    }, [session]);

    const navigateToPaper = (subject) => {
        setSelectedSubject(subject);
        setView('papers');
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2 text-text-main">
                        Welcome back, <span className="text-primary italic">{firstName}</span>
                    </h2>
                    <div className="mt-2">
                        <p className="text-text-muted italic text-lg opacity-90 leading-snug">
                            "{quote.split(' — ')[0]}"
                        </p>
                        {quote.includes(' — ') && (
                            <p className="text-primary/80 font-medium text-sm mt-1 uppercase tracking-widest">
                                — {quote.split(' — ')[1]}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 shrink-0">
                    <div className="glass p-4 rounded-2xl min-w-[180px] border border-border-main flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <span className="material-symbols-outlined text-primary text-2xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted font-medium mb-0.5 uppercase tracking-wider">Daily Streak</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-primary">{stats.streak}</span>
                                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Users Widget */}
                    <div className="glass p-4 rounded-2xl min-w-[170px] border border-border-main flex items-center gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
                        <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0 relative z-10">
                            <span className="relative flex h-3 w-3 absolute top-1 right-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="material-symbols-outlined text-green-500 text-2xl absolute">group</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs text-text-muted font-medium mb-0.5 uppercase tracking-wider">Active Users</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-green-400">{activeUsers}</span>
                                <span className="text-[10px] text-green-500/80 uppercase font-bold tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* Main Left Column */}
                <div className="col-span-12 lg:col-span-8 space-y-6 flex flex-col">

                    {/* Resume Activity Widget */}
                    <ResumeActivityCard activity={recentActivity} />

                    {/* Progress Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">

                        {/* Daily Progress Widget */}
                        <div className="glass p-6 rounded-3xl space-y-4 flex flex-col justify-center border border-border-main">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-text-main">Daily Progress</h4>
                                <span className="text-xs font-bold text-primary">{Math.min(100, Math.round((stats.todayScore / 50) * 100))}% of Goal</span>
                            </div>
                            <div className="h-3 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="bg-primary h-full shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (stats.todayScore / 50) * 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-text-muted font-medium">
                                <span>{stats.todayScore} Points Done</span>
                                <span>Goal: 50</span>
                            </div>
                        </div>

                        {/* Total Expertise Widget */}
                        <div className="glass p-6 rounded-3xl flex items-center justify-between gap-5 border border-border-main h-full">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                    <span className="material-symbols-outlined text-primary text-3xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">Total Expertise</p>
                                    <p className="text-2xl font-black text-text-main">{stats.totalScore} <span className="text-sm font-medium text-text-muted">XP</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    {/* Cumulative Score */}
                    <div className="glass p-6 rounded-3xl border border-border-main">
                        <div className="flex justify-between items-start mb-6">
                            <h4 className="font-bold text-lg text-text-main">Cumulative Score</h4>
                            <span className="material-symbols-outlined text-text-muted">more_horiz</span>
                        </div>

                        <div className="flex justify-center py-4">
                            <div className="relative flex items-center justify-center">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle className="text-black/5 dark:text-white/5" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                                    <circle
                                        className="text-primary transition-all duration-1000 ease-out"
                                        cx="64" cy="64" fill="transparent" r="58" stroke="currentColor"
                                        strokeDasharray="364.4"
                                        strokeDashoffset={364.4 - (364.4 * Math.min(100, (stats.totalScore / 5000) * 100)) / 100}
                                        strokeWidth="8"
                                    ></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-text-main">{stats.totalScore}</span>
                                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Points</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-6">
                            <div className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border-main">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-sm text-primary fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>trip_origin</span>
                                    <span className="text-sm font-medium text-text-muted">Level Target</span>
                                </div>
                                <span className="text-sm font-bold text-text-main">5000 XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Preview */}
                    <div className="glass p-6 rounded-3xl border border-border-main">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-text-main">Top Performers</h4>
                            <button onClick={() => setView('leaderboard')} className="text-primary text-xs font-bold hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {stats.leaderboardTop3.length > 0 ? stats.leaderboardTop3.map((lbUser, index) => (
                                <div key={lbUser.username} className={`flex items-center justify-between p-2 rounded-xl ${lbUser.username === session?.user?.email ? 'bg-primary/10 border border-primary/20 -mx-2 px-4' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold w-4 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-text-muted' : index === 2 ? 'text-amber-600' : 'text-text-muted'}`}>
                                            {index + 1}
                                        </span>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 dark:bg-slate-800 text-primary dark:text-white text-xs font-bold ring-1 ring-primary/20 dark:ring-white/10 shrink-0">
                                            {lbUser.nickname ? lbUser.nickname.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <span className="text-sm font-bold text-text-main truncate max-w-[100px]" title={lbUser.nickname}>
                                            {lbUser.nickname || 'Student'} {lbUser.username === session?.user?.email && '(You)'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-black text-primary shrink-0">{lbUser.totalScore} XP</span>
                                </div>
                            )) : (
                                <p className="text-sm text-text-muted text-center py-4">No scores yet.</p>
                            )}
                        </div>
                    </div>



                </div>
            </div>


            {/* Subjects Quick Links Removed per user request */}
        </div>
    );
}

function SubjectCard({ icon, title, desc, onClick }) {
    return (
        <div
            onClick={onClick}
            className="glass p-5 rounded-3xl hover:border-primary/50 transition-all cursor-pointer group text-center border border-border-main flex flex-col items-center justify-center min-h-[120px]"
        >
            <span className="material-symbols-outlined text-3xl mb-3 text-primary group-hover:scale-110 group-hover:-translate-y-1 transition-transform block">
                {icon}
            </span>
            <p className="font-bold text-sm text-text-main">{title}</p>
            <p className="text-[10px] text-text-muted uppercase font-bold mt-1 tracking-wider">{desc}</p>
        </div>
    );
}

// ── Resume Activity Card (Homepage Widget) ──────────────────────────
function ResumeActivityCard({ activity }) {
    if (!activity) {
        return (
            <div className="relative overflow-hidden rounded-[2rem] glass p-1 border border-border-main flex-shrink-0">
                <div className="relative h-[240px] md:h-[300px] rounded-[1.8rem] bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-8 text-center gap-4">
                    <span className="material-symbols-outlined text-4xl text-slate-500">history</span>
                    <h3 className="text-xl font-black text-white">No Recent Activity</h3>
                    <p className="text-slate-400 text-sm max-w-sm">When you start practicing a paper or module, you can quickly resume it from here.</p>
                </div>
            </div>
        );
    }

    return (
        <a href={activity.url} className="relative group overflow-hidden rounded-[2rem] glass p-1 border border-border-main flex-shrink-0 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/50 block">
            <div className="relative h-[240px] md:h-[300px] overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 dark:from-blue-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between p-6 md:p-8">
                {/* Top Row */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 bg-blue-500/20">
                            <span className="material-symbols-outlined text-sm text-blue-400">play_circle</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300">Resume</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="material-symbols-outlined text-white text-xl">arrow_forward</span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-blue-400/80 text-[11px] font-bold uppercase tracking-[0.15em]">{activity.type === 'pastpaper' ? 'Past Paper' : 'Practice Module'}</p>
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                        {activity.title}
                    </h3>
                    <p className="text-slate-400 font-medium text-sm">
                        {activity.subject}
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Continue Practice</span>
                        <span className="material-symbols-outlined text-sm text-blue-400 transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </div>
                </div>
            </div>
        </a>
    );
}
