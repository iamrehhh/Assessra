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
    const [isLoaded, setIsLoaded] = useState(false);

    // Resume State
    const [recentActivity, setRecentActivity] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('assessra_recent_activity');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {}
            }
        }
        return null;
    });

    const user = session?.user?.name || 'Student';
    const firstName = user.split(' ')[0] || 'Student';

    useEffect(() => {
        if (!session?.user?.email) return;

        const userEmail = session.user.email;

        const fetchData = async () => {
            try {
                // Fetch core stats in parallel
                const [scoresRes, lbRes] = await Promise.all([
                    fetch(`/api/scores/user?username=${encodeURIComponent(userEmail)}`),
                    fetch('/api/leaderboard')
                ]);

                // Parse in parallel
                const [scoresData, lbData] = await Promise.all([
                    scoresRes.json(),
                    lbRes.json()
                ]);

                // Fetch quote asynchronously so it doesn't block the dashboard loading
                fetch('/api/quote')
                    .then(res => res.json())
                    .then(data => {
                        if (data.quote) setQuote(data.quote);
                    })
                    .catch(err => console.error('Quote fetch error:', err));

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
            } finally {
                // Fetch complete
            }
        };

        fetchData();
    }, [session]);

    // Trigger entry animations immediately, independent of slow data fetching
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
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

    return (
        <div className={`space-y-8 pb-10 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Premium Welcome Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 relative">
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-text-main to-text-main/60">
                        Welcome back, <span className="text-primary italic">{firstName}</span>
                    </h2>
                    <div className="max-w-2xl">
                        <p className="text-text-muted italic text-lg leading-relaxed border-l-4 border-primary/40 pl-4 py-1">
                            &quot;{quote.split(' — ')[0]}&quot;
                            {quote.includes(' — ') && (
                                <span className="block text-primary/80 font-bold text-xs mt-2 uppercase tracking-[0.2em]">
                                    — {quote.split(' — ')[1]}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 shrink-0 relative z-10 mt-4 xl:mt-0">
                    {/* Streak Widget */}
                    <div className="glass px-5 py-4 rounded-2xl min-w-[180px] border border-border-main flex items-center gap-4 hover:border-primary/30 transition-colors shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/10 flex items-center justify-center border border-orange-500/20 shrink-0 shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
                            <span className="material-symbols-outlined text-orange-500 text-2xl fill-1 relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.15em] mb-0.5">Daily Streak</p>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-500">{stats.streak}</span>
                                <span className="text-[10px] text-orange-500/80 uppercase font-bold tracking-wider">Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Users Widget */}
                    <div className="glass px-5 py-4 rounded-2xl min-w-[180px] border border-border-main flex items-center gap-4 hover:border-green-500/30 transition-colors shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-green-500/10 transition-colors"></div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center border border-green-500/20 shrink-0 relative z-10">
                            <span className="relative flex h-3.5 w-3.5 absolute top-1.5 right-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-[#1e293b]"></span>
                            </span>
                            <span className="material-symbols-outlined text-green-500 text-2xl absolute">group</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.15em] mb-0.5">Community</p>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-500">{activeUsers}</span>
                                <span className="text-[10px] text-green-500/80 uppercase font-bold tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-12 gap-6 pt-4">
                {/* Main Left Column */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                    {/* Hero Resume Activity Widget */}
                    <div className={`transform transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <ResumeActivityCard activity={recentActivity} />
                    </div>

                    {/* Progress Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
                        
                        {/* Daily Progress Widget */}
                        <div className={`glass p-6 rounded-3xl flex flex-col justify-center border border-border-main relative overflow-hidden group hover:border-primary/30 transition-colors transform duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
                            
                            <div className="flex justify-between items-center mb-5 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <span className="material-symbols-outlined text-primary text-[18px]">target</span>
                                    </div>
                                    <h4 className="font-bold text-text-main tracking-wide">Daily Goal</h4>
                                </div>
                                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                                    {Math.min(100, Math.round((stats.todayScore / 50) * 100))}%
                                </span>
                            </div>
                            
                            <div className="relative z-10 mt-auto">
                                <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                                    <span>{stats.todayScore} XP Earned</span>
                                    <span>50 XP Target</span>
                                </div>
                                <div className="h-4 bg-black/20 dark:bg-[#0f172a] rounded-full overflow-hidden border border-border-main p-0.5">
                                    <div
                                        className="bg-gradient-to-r from-primary/80 to-primary h-full rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-1000 ease-out relative overflow-hidden"
                                        style={{ width: `${Math.min(100, (stats.todayScore / 50) * 100)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Expertise Widget */}
                        <div className={`glass p-6 rounded-3xl flex items-center justify-between gap-5 border border-border-main relative overflow-hidden group hover:border-primary/30 transition-colors transform duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
                            
                            <div className="flex items-center gap-5 relative z-10 w-full">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shrink-0 shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]">
                                    <span className="material-symbols-outlined text-primary text-3xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.15em] mb-1">Total Expertise</p>
                                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary/80 to-primary mb-1 leading-none">{stats.totalScore}</p>
                                    <p className="text-[11px] font-bold text-text-muted">Mastery Points</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

                    {/* Premium Cumulative Score Ring */}
                    <div className={`glass p-6 rounded-3xl border border-border-main relative overflow-hidden group transform duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
                        
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <h4 className="font-bold text-lg text-text-main tracking-wide">Level Progress</h4>
                            <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/5 flex items-center justify-center text-text-muted">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                            </div>
                        </div>

                        <div className="flex justify-center py-6 relative z-10">
                            <div className="relative flex items-center justify-center">
                                {/* Ambient glow behind the ring */}
                                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <svg className="w-40 h-40 transform -rotate-90 drop-shadow-xl relative z-10">
                                    {/* Track */}
                                    <circle className="text-black/5 dark:text-white/5" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12" strokeLinecap="round"></circle>
                                    {/* Progress */}
                                    <circle
                                        className="text-primary transition-all duration-1500 ease-out"
                                        cx="80" cy="80" fill="transparent" r="70" stroke="url(#gradient)"
                                        strokeDasharray="439.8"
                                        strokeDashoffset={439.8 - (439.8 * Math.min(100, (stats.totalScore / 5000) * 100)) / 100}
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                        style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.4))' }}
                                    ></circle>
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4ade80" />
                                            <stop offset="100%" stopColor="#22c55e" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                    <span className="text-4xl font-black text-text-main tracking-tight">{stats.totalScore}</span>
                                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-[0.2em] mt-1">XP</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-2">
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-black/10 to-black/5 dark:from-white/5 dark:to-transparent rounded-2xl border border-border-main backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm text-primary fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Next Milestone</p>
                                        <p className="text-sm font-bold text-text-main">5,000 XP</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                                    {Math.max(0, 5000 - stats.totalScore)} to go
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Preview */}
                    <div className={`glass p-6 rounded-3xl border border-border-main flex-grow transform duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-text-main tracking-wide flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-500 text-[20px]">emoji_events</span>
                                Top Performers
                            </h4>
                            <button onClick={() => setView('leaderboard')} className="text-text-muted hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-primary/10">View All</button>
                        </div>

                        <div className="space-y-3">
                            {stats.leaderboardTop3.length > 0 ? stats.leaderboardTop3.map((lbUser, index) => (
                                <div key={lbUser.username} className={`flex items-center justify-between p-3 rounded-2xl transition-all ${lbUser.username === session?.user?.email ? 'bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 flex justify-center text-xs font-black ${index === 0 ? 'text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)] text-sm' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-600' : 'text-text-muted'}`}>
                                            #{index + 1}
                                        </div>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-card border border-border-main text-text-main text-sm font-bold shadow-sm">
                                            {lbUser.nickname ? lbUser.nickname.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-text-main truncate max-w-[120px] block" title={lbUser.nickname}>
                                                {lbUser.nickname || 'Student'}
                                            </span>
                                            {lbUser.username === session?.user?.email && (
                                                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">You</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-black text-text-main">{lbUser.totalScore}</span>
                                        <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest">XP</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-center p-4">
                                    <span className="material-symbols-outlined text-4xl text-text-muted/30 mb-2">leaderboard</span>
                                    <p className="text-sm font-bold text-text-muted">No scores recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// ── Premium Resume Activity Card ──────────────────────────
function ResumeActivityCard({ activity }) {
    if (!activity) {
        return (
            <div className="relative group overflow-hidden rounded-[2.5rem] p-1 border border-border-main flex-shrink-0 bg-bg-card">
                <div className="relative h-[280px] md:h-[340px] rounded-[2.3rem] bg-gradient-to-br from-slate-800 to-[#0f172a] flex flex-col items-center justify-center p-8 text-center gap-5 border border-white/5">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
                        <span className="material-symbols-outlined text-4xl text-slate-400">history</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Ready to begin?</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">Your recent practice sessions will appear here so you can seamlessly jump right back in.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <a href={activity.url} className="relative group overflow-hidden rounded-[2.5rem] p-1 border border-border-main flex-shrink-0 cursor-pointer transition-all duration-500 hover:shadow-[0_10px_40px_rgba(16,185,129,0.2)] hover:border-emerald-500/50 block bg-bg-card">
            <div className="relative h-[280px] md:h-[340px] overflow-hidden rounded-[2.3rem] flex flex-col justify-between p-8 md:p-10 border border-white/5">
                
                {/* Dynamic Backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#064e3b] to-[#0f172a] z-0"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0"></div>
                
                {/* Glowing Orbs */}
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/20 blur-[80px] z-0 group-hover:bg-emerald-400/30 transition-colors duration-700"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/20 blur-[60px] z-0 group-hover:bg-teal-400/30 transition-colors duration-700"></div>

                {/* Top Row */}
                <div className="flex justify-between items-start relative z-10">
                    <div className="backdrop-blur-xl bg-white/5 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2.5 shadow-lg">
                        <span className="material-symbols-outlined text-[16px] text-emerald-400">play_circle</span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-300">Resume Session</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-xl">
                        <span className="material-symbols-outlined text-white text-xl">arrow_forward</span>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="inline-block mb-3 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md">
                        <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em]">{activity.type === 'pastpaper' ? 'Past Paper Practice' : 'Module Practice'}</p>
                    </div>
                    
                    <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3 drop-shadow-md">
                        {activity.title}
                    </h3>
                    
                    <div className="flex items-center gap-4">
                        <p className="text-slate-300 font-medium text-base flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg opacity-70">subject</span>
                            {activity.subject}
                        </p>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                        <p className="text-slate-400 text-sm font-medium">
                            {new Date(activity.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <div className="h-1 w-12 bg-emerald-500 rounded-full group-hover:w-20 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500 delay-100">Jump In</span>
                    </div>
                </div>
            </div>
        </a>
    );
}
