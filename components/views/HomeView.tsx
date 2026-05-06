'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import bookData from '@/data/book/nexus.json';

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

    // Book Reader State
    const [bookChapterIndex, setBookChapterIndex] = useState(0);
    const [bookLoading, setBookLoading] = useState(true);
    const [bookModalOpen, setBookModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [wordPopup, setWordPopup] = useState(null); // { word, definition, contextMeaning, x, y }
    const [wordLoading, setWordLoading] = useState(false);
    const [completingChapter, setCompletingChapter] = useState(false);
    const [bookCompleted, setBookCompleted] = useState(false);
    const readerRef = useRef(null);
    const PAGE_SIZE = 2200; // characters per page

    const user = session?.user?.name || 'Student';
    const firstName = user.split(' ')[0] || 'Student';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userEmail = session?.user?.email;
                if (!userEmail) return;

                // Fetch user scores
                const scoresRes = await fetch(`/api/scores/user?username=${encodeURIComponent(userEmail)}`);
                const scoresData = await scoresRes.json();

                // Fetch leaderboard for rank
                const lbRes = await fetch('/api/leaderboard');
                const lbData = await lbRes.json();

                let totalS = 0;
                let todayS = 0;
                let totalMax = 0;
                let completed = 0;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (scoresData.attempts && scoresData.attempts.length > 0) {
                    completed = scoresData.attempts.length;
                    scoresData.attempts.forEach(s => {
                        totalS += s.score;
                        totalMax += s.maxMarks;

                        const attemptDate = new Date(s.submittedAt);
                        attemptDate.setHours(0, 0, 0, 0);
                        if (attemptDate.getTime() === today.getTime()) {
                            todayS += s.score;
                        }
                    });
                } else if (scoresData.scores && scoresData.scores.length > 0) {
                    // Fallback in case of old API return format
                    completed = scoresData.scores.length;
                    scoresData.scores.forEach(s => {
                        totalS += s.score;
                        totalMax += s.maxMarks;

                        const attemptDate = new Date(s.submittedAt || s.submitted_at);
                        attemptDate.setHours(0, 0, 0, 0);
                        if (attemptDate.getTime() === today.getTime()) {
                            todayS += s.score;
                        }
                    });
                }

                const avg = totalMax > 0 ? Math.round((totalS / totalMax) * 100 * 10) / 10 : 0;

                // Find rank in leaderboard
                let currentRank = '-';
                if (lbData.leaderboard && userEmail) {
                    const idx = lbData.leaderboard.findIndex(u => u.username === userEmail);
                    if (idx !== -1) currentRank = idx + 1;
                }

                // Calculate streak
                let calculatedStreak = 0;
                const allRecords = scoresData.attempts || scoresData.scores || [];
                if (allRecords.length > 0) {
                    const scoresByDate = {};
                    allRecords.forEach(r => {
                        const dateStr = new Date(r.submittedAt || r.submitted_at).toLocaleDateString();
                        scoresByDate[dateStr] = (scoresByDate[dateStr] || 0) + r.score;
                    });
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

        const fetchQuote = async () => {
            try {
                const res = await fetch('/api/quote');
                if (res.ok) {
                    const data = await res.json();
                    if (data.quote) setQuote(data.quote);
                }
            } catch (err) {
                console.error('Failed to load quote:', err);
            }
        };

        const fetchBookProgress = async () => {
            try {
                const email = session?.user?.email;
                if (!email) return;
                const res = await fetch(`/api/book-progress?email=${encodeURIComponent(email)}`);
                if (res.ok) {
                    const data = await res.json();
                    setBookChapterIndex(data.chapterIndex ?? 0);
                    if (data.chapterIndex >= bookData.totalChapters) setBookCompleted(true);
                }
            } catch (err) {
                console.error('Failed to load book progress:', err);
            } finally {
                setBookLoading(false);
            }
        };

        if (session?.user) {
            fetchDashboardData();
            fetchQuote();
            fetchBookProgress();
        }
    }, [session]);

    // Active Users Heartbeat
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

                    {/* Book Reader Widget */}
                    <BookReaderCard
                        bookData={bookData}
                        chapterIndex={bookChapterIndex}
                        loading={bookLoading}
                        completed={bookCompleted}
                        onOpen={() => { setBookModalOpen(true); setCurrentPage(0); setWordPopup(null); }}
                    />

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

            {/* Book Reader Modal */}
            {bookModalOpen && !bookLoading && (
                <BookReaderModal
                    key={bookChapterIndex}
                    bookData={bookData}
                    chapterIndex={bookChapterIndex}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={PAGE_SIZE}
                    wordPopup={wordPopup}
                    setWordPopup={setWordPopup}
                    wordLoading={wordLoading}
                    setWordLoading={setWordLoading}
                    completingChapter={completingChapter}
                    bookCompleted={bookCompleted}
                    onClose={() => { setBookModalOpen(false); setWordPopup(null); }}
                    onCompleteChapter={async () => {
                        setCompletingChapter(true);
                        try {
                            const res = await fetch('/api/book-progress', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: session?.user?.email,
                                    chapterIndex: bookChapterIndex,
                                    totalChapters: bookData.totalChapters,
                                    bookTitle: bookData.bookTitle,
                                }),
                            });
                            if (res.ok) {
                                const data = await res.json();
                                if (data.bookCompleted) {
                                    setBookCompleted(true);
                                } else {
                                    setBookChapterIndex(data.newChapterIndex);
                                    setCurrentPage(0);
                                }
                                // Close modal so user returns to homepage with updated chapter card
                                setBookModalOpen(false);
                                setWordPopup(null);
                            }
                        } catch (err) {
                            console.error('Failed to complete chapter:', err);
                        } finally {
                            setCompletingChapter(false);
                        }
                    }}
                    readerRef={readerRef}
                />
            )}

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

// ── Book Reader Card (Homepage Widget) ──────────────────────────
function BookReaderCard({ bookData, chapterIndex, loading, completed, onOpen }) {
    const chapter = bookData.chapters[chapterIndex];
    const progress = Math.round(((chapterIndex) / bookData.totalChapters) * 100);

    return (
        <div
            onClick={() => !loading && !completed && onOpen()}
            className="relative group overflow-hidden rounded-[2rem] glass p-1 border border-border-main flex-shrink-0 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-border-main"
        >
            <div className="relative h-[240px] md:h-[300px] overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-emerald-900 via-slate-800 to-slate-900 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-3 border-border-main border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-text-muted">Loading your book...</p>
                    </div>
                ) : completed ? (
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4">
                        <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                        <h3 className="text-2xl font-black text-white">Book Completed!</h3>
                        <p className="text-text-muted text-sm max-w-md">You've finished reading <span className="text-white font-bold">{bookData.bookTitle}</span>. A new book will be available soon.</p>
                    </div>
                ) : chapter ? (
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                        {/* Top Row */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 bg-emerald-500/10">
                                    <span className="material-symbols-outlined text-sm text-emerald-400">auto_stories</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">Book Club</span>
                                </div>
                                <div className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                                        {chapterIndex + 1} / {bookData.totalChapters}
                                    </span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="material-symbols-outlined text-white text-xl">open_in_full</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-emerald-400/60 text-[11px] font-bold uppercase tracking-[0.15em]">{bookData.bookTitle}</p>
                            {chapter.part && (
                                <p className="text-emerald-400/80 text-xs font-bold uppercase tracking-widest">{chapter.part}</p>
                            )}
                            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight font-serif italic">
                                {chapter.title}
                            </h3>
                            <p className="text-slate-400 font-medium text-sm">
                                by <span className="text-white">{bookData.author}</span>
                                <span className="text-slate-500 mx-2">•</span>
                                <span className="text-slate-500">{bookData.year}</span>
                            </p>

                            {/* Progress Bar */}
                            <div className="flex items-center gap-3 pt-1">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-emerald-400">{progress}%</span>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Continue Reading</span>
                                <span className="material-symbols-outlined text-sm text-emerald-400 transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

// ── Utility: split chapter content into pages ───────────────────
function splitIntoPages(content, pageSize) {
    if (!content) return [''];
    const pages = [];
    let remaining = content;

    while (remaining.length > 0) {
        if (remaining.length <= pageSize) {
            pages.push(remaining.trim());
            break;
        }
        // Find best breakpoint near pageSize (paragraph break, sentence end, or word boundary)
        let breakAt = pageSize;
        const paragraphBreak = remaining.lastIndexOf('\n\n', pageSize);
        if (paragraphBreak > pageSize * 0.6) {
            breakAt = paragraphBreak;
        } else {
            const sentenceEnd = remaining.lastIndexOf('. ', pageSize);
            if (sentenceEnd > pageSize * 0.6) {
                breakAt = sentenceEnd + 1;
            } else {
                const wordBoundary = remaining.lastIndexOf(' ', pageSize);
                if (wordBoundary > pageSize * 0.5) breakAt = wordBoundary;
            }
        }
        pages.push(remaining.slice(0, breakAt).trim());
        remaining = remaining.slice(breakAt).trim();
    }

    return pages.length > 0 ? pages : [''];
}

// ── Book Reader Modal (Full Reading Experience) ─────────────────
function BookReaderModal({
    bookData, chapterIndex, currentPage, setCurrentPage, pageSize,
    wordPopup, setWordPopup, wordLoading, setWordLoading,
    completingChapter, bookCompleted, onClose, onCompleteChapter, readerRef,
}) {
    const chapter = bookData.chapters[chapterIndex];
    if (!chapter) return null;

    const pages = splitIntoPages(chapter.content, pageSize);
    const totalPages = pages.length;
    const isLastPage = currentPage >= totalPages - 1;
    const pageText = pages[currentPage] || '';

    // ── Phase management: reading → quiz → essay → done ──
    const [phase, setPhase] = useState('reading');

    // Quiz state
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(null);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState(null);

    // Essay state
    const [essayText, setEssayText] = useState('');
    const [essayFeedback, setEssayFeedback] = useState(null);
    const [essayLoading, setEssayLoading] = useState(false);
    const WORD_LIMIT = 150;

    const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

    // ── Fetch quiz when entering quiz phase ──
    const startQuiz = async () => {
        setPhase('quiz');
        setQuizLoading(true);
        setQuizError(null);
        try {
            const res = await fetch('/api/book-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chapterTitle: chapter.title,
                    chapterContent: chapter.content,
                }),
            });
            const data = await res.json();
            if (data.questions && data.questions.length > 0) {
                setQuizQuestions(data.questions);
            } else {
                setQuizError(data.error || 'Failed to generate quiz.');
            }
        } catch (err) {
            console.error('Quiz fetch error:', err);
            setQuizError('Connection error. Please try again.');
        } finally {
            setQuizLoading(false);
        }
    };

    const handleQuizSubmit = () => {
        let correct = 0;
        quizQuestions.forEach((q, i) => {
            if (quizAnswers[i] === q.correctAnswer) correct++;
        });
        setQuizScore(correct);
        setQuizSubmitted(true);
    };

    const handleEssaySubmit = async () => {
        setEssayLoading(true);
        try {
            const res = await fetch('/api/book-essay-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chapterTitle: chapter.title,
                    chapterContent: chapter.content,
                    essayText: essayText.trim(),
                }),
            });
            const data = await res.json();
            if (data.feedback) {
                setEssayFeedback(data.feedback);
            } else {
                setEssayFeedback('⚠️ ' + (data.error || 'Could not evaluate essay.'));
            }
        } catch {
            setEssayFeedback('⚠️ Connection error. Please try again.');
        } finally {
            setEssayLoading(false);
        }
    };

    // Handle word click
    const handleWordClick = async (word, e) => {
        const cleanWord = word.replace(/[^a-zA-Z'-]/g, '');
        if (!cleanWord || cleanWord.length < 2) return;

        // Get surrounding context (nearby text)
        const contentWords = pageText.split(/\s+/);
        const wordIdx = contentWords.findIndex(w => w.includes(cleanWord));
        const contextStart = Math.max(0, wordIdx - 15);
        const contextEnd = Math.min(contentWords.length, wordIdx + 15);
        const context = contentWords.slice(contextStart, contextEnd).join(' ');

        // Position the popup
        const rect = e.target.getBoundingClientRect();
        const modalRect = readerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        const x = rect.left - modalRect.left + rect.width / 2;
        const y = rect.top - modalRect.top;

        setWordPopup({ word: cleanWord, definition: null, contextMeaning: null, x, y, loading: true });
        setWordLoading(true);

        try {
            const res = await fetch('/api/define-word', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word: cleanWord, context }),
            });
            if (res.ok) {
                const data = await res.json();
                setWordPopup(prev => prev?.word === cleanWord ? { ...prev, ...data, loading: false } : prev);
            } else {
                setWordPopup(prev => prev?.word === cleanWord ? { ...prev, definition: 'Could not fetch definition.', loading: false } : prev);
            }
        } catch {
            setWordPopup(prev => prev?.word === cleanWord ? { ...prev, definition: 'Network error.', loading: false } : prev);
        } finally {
            setWordLoading(false);
        }
    };

    // Render text with clickable words
    const renderText = (text) => {
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
        return paragraphs.map((para, pi) => (
            <p key={pi} className="text-text-muted text-[16px] md:text-[17px] leading-[1.95] mb-5 font-[400] select-text" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                {para.split(/(\s+)/).map((token, ti) => {
                    if (/^\s+$/.test(token)) return token;
                    return (
                        <span
                            key={ti}
                            onClick={(e) => { e.stopPropagation(); handleWordClick(token, e); }}
                            className="cursor-pointer hover:bg-emerald-500/15 hover:text-emerald-300 rounded px-[1px] transition-colors duration-150"
                        >
                            {token}
                        </span>
                    );
                })}
            </p>
        ));
    };

    // ═══════════════════════════════════════════════════════════════
    //  QUIZ PHASE
    // ═══════════════════════════════════════════════════════════════
    if (phase === 'quiz') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/95 backdrop-blur-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="relative max-w-3xl w-full bg-bg-card dark:bg-slate-900 border border-border-main rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="p-6 md:p-8 pb-4 shrink-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <div className="px-3 py-1.5 rounded-full border border-border-main flex items-center gap-2 bg-amber-500/10">
                                <span className="material-symbols-outlined text-sm text-amber-400">quiz</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Chapter Quiz</span>
                            </div>
                            {!quizSubmitted && quizQuestions.length > 0 && (
                                <div className="px-3 py-1.5 rounded-full border border-border-main bg-black/5 dark:bg-white/5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                        {Object.keys(quizAnswers).length} / {quizQuestions.length} Answered
                                    </span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl lg:text-2xl font-black text-text-main dark:text-white leading-tight mb-1">
                            {chapter.title} — Comprehension Quiz
                        </h2>
                        <p className="text-text-muted text-sm">Test your understanding of this chapter with 10 questions.</p>
                        <div className="h-px w-full bg-black/5 dark:bg-white/5 mt-4"></div>
                    </div>

                    {/* Quiz Body */}
                    <div className="p-6 md:p-8 pt-2 overflow-y-auto flex-1 custom-scrollbar">
                        {quizLoading && (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <div className="w-10 h-10 border-4 border-border-main border-t-amber-400 rounded-full animate-spin"></div>
                                <p className="text-text-muted text-sm font-medium">Generating your chapter quiz…</p>
                                <p className="text-text-muted/60 text-xs">This may take a few seconds</p>
                            </div>
                        )}

                        {quizError && (
                            <div className="text-center py-12">
                                <p className="text-red-400 mb-4">{quizError}</p>
                                <button onClick={startQuiz} className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors cursor-pointer">
                                    Retry
                                </button>
                            </div>
                        )}

                        {!quizLoading && !quizError && quizQuestions.length > 0 && (
                            <div className="flex flex-col gap-5">
                                {quizQuestions.map((q, i) => {
                                    const userAns = quizAnswers[i];
                                    const isCorrect = quizSubmitted && userAns === q.correctAnswer;
                                    const isWrong = quizSubmitted && userAns && userAns !== q.correctAnswer;
                                    return (
                                        <div key={i} className={`p-4 rounded-xl border transition-all ${quizSubmitted
                                            ? isCorrect ? 'border-green-500/40 bg-green-500/5' : isWrong ? 'border-red-500/40 bg-red-500/5' : 'border-border-main bg-black/5 dark:bg-white/5'
                                            : 'border-border-main bg-black/5 dark:bg-white/5'
                                            }`}>
                                            <p className="font-bold text-text-main text-sm mb-3">
                                                <span className="text-amber-400 mr-2">Q{i + 1}.</span>
                                                {q.question}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {q.options.map((opt, oi) => {
                                                    const letter = opt.charAt(0);
                                                    let btnCls = 'border-border-main bg-black/5 dark:bg-white/5 text-text-muted hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer';
                                                    if (!quizSubmitted && userAns === letter) btnCls = 'border-amber-500 bg-amber-500/15 text-amber-300 cursor-pointer';
                                                    if (quizSubmitted && letter === q.correctAnswer) btnCls = 'border-green-500 bg-green-500/15 text-green-300';
                                                    if (quizSubmitted && userAns === letter && letter !== q.correctAnswer) btnCls = 'border-red-500 bg-red-500/15 text-red-300';
                                                    return (
                                                        <button
                                                            key={oi}
                                                            onClick={() => { if (!quizSubmitted) setQuizAnswers(prev => ({ ...prev, [i]: letter })); }}
                                                            className={`text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${btnCls} ${quizSubmitted ? 'cursor-default' : ''}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Score Banner */}
                        {quizSubmitted && quizScore !== null && (
                            <div className="mt-6 text-center p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                                <div className="text-4xl font-black text-emerald-400 mb-1">
                                    {Math.round((quizScore / quizQuestions.length) * 100)}%
                                </div>
                                <div className="text-lg text-text-muted font-bold">Score: {quizScore} / {quizQuestions.length}</div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 md:p-6 pt-0 shrink-0">
                        <div className="h-px bg-black/5 dark:bg-white/5 mb-4"></div>
                        <div className="flex justify-end gap-3">
                            {!quizSubmitted ? (
                                <button
                                    onClick={handleQuizSubmit}
                                    disabled={Object.keys(quizAnswers).length < quizQuestions.length || quizLoading}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-base">grading</span>
                                    Submit Quiz ({Object.keys(quizAnswers).length}/{quizQuestions.length})
                                </button>
                            ) : (
                                <button
                                    onClick={() => setPhase('essay')}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                    Continue
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════
    //  ESSAY PHASE
    // ═══════════════════════════════════════════════════════════════
    if (phase === 'essay') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/95 backdrop-blur-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="relative max-w-3xl w-full bg-bg-card dark:bg-slate-900 border border-border-main rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="p-6 md:p-8 pb-4 shrink-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <div className="px-3 py-1.5 rounded-full border border-border-main flex items-center gap-2 bg-purple-500/10">
                                <span className="material-symbols-outlined text-sm text-purple-400">edit_note</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Chapter Reflection</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full border border-border-main bg-black/5 dark:bg-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Optional</span>
                            </div>
                        </div>
                        <h2 className="text-xl lg:text-2xl font-black text-text-main dark:text-white leading-tight mb-1">
                            Reflect on: {chapter.title}
                        </h2>
                        <p className="text-text-muted text-sm">Write a short reflection (~150 words) about what you learned in this chapter. This is optional — feel free to skip.</p>
                        <div className="h-px w-full bg-black/5 dark:bg-white/5 mt-4"></div>
                    </div>

                    {/* Essay Body */}
                    <div className="p-6 md:p-8 pt-2 overflow-y-auto flex-1 custom-scrollbar">
                        {!essayFeedback ? (
                            <div className="space-y-4">
                                <textarea
                                    value={essayText}
                                    onChange={(e) => setEssayText(e.target.value)}
                                    placeholder="Write your reflection here... What were the key ideas? What did you find most interesting or surprising?"
                                    className="w-full h-48 p-4 bg-black/5 dark:bg-white/5 border border-border-main rounded-2xl text-text-main text-sm leading-relaxed resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-text-muted/50"
                                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                                    disabled={essayLoading}
                                />
                                <div className="flex items-center justify-between">
                                    <div className={`text-xs font-bold ${wordCount > WORD_LIMIT ? 'text-red-400' : wordCount > WORD_LIMIT * 0.8 ? 'text-amber-400' : 'text-text-muted'}`}>
                                        <span className="material-symbols-outlined text-sm align-middle mr-1">text_fields</span>
                                        {wordCount} / {WORD_LIMIT} words
                                        {wordCount > WORD_LIMIT && <span className="ml-2 text-red-400">— Please keep to ~{WORD_LIMIT} words</span>}
                                    </div>
                                    {essayLoading && (
                                        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                                            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                                            Evaluating…
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Student's essay */}
                                <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-border-main">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-2">Your Reflection</p>
                                    <p className="text-text-muted text-sm leading-relaxed italic" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                                        "{essayText}"
                                    </p>
                                </div>
                                {/* AI feedback */}
                                <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="material-symbols-outlined text-purple-400 text-base">auto_awesome</span>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-purple-400">AI Feedback</p>
                                    </div>
                                    <div className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                                        {essayFeedback}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 md:p-6 pt-0 shrink-0">
                        <div className="h-px bg-black/5 dark:bg-white/5 mb-4"></div>
                        <div className="flex justify-between gap-3">
                            {!essayFeedback ? (
                                <>
                                    <button
                                        onClick={() => setPhase('done')}
                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-base">skip_next</span>
                                        Skip
                                    </button>
                                    <button
                                        onClick={handleEssaySubmit}
                                        disabled={wordCount < 10 || wordCount > WORD_LIMIT + 20 || essayLoading}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-500 text-white hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-base">send</span>
                                        Submit Reflection
                                    </button>
                                </>
                            ) : (
                                <div className="flex justify-end w-full">
                                    <button
                                        onClick={() => setPhase('done')}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                                        Continue
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════
    //  DONE PHASE — Summary before advancing
    // ═══════════════════════════════════════════════════════════════
    if (phase === 'done') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/95 backdrop-blur-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="relative max-w-lg w-full bg-bg-card dark:bg-slate-900 border border-border-main rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col">
                    <div className="p-8 text-center space-y-5">
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <h2 className="text-2xl font-black text-text-main dark:text-white">Chapter Complete!</h2>
                        <p className="text-text-muted text-sm max-w-sm mx-auto">
                            You've finished <span className="font-bold text-text-main">"{chapter.title}"</span>.
                            {quizScore !== null && (
                                <span> Quiz score: <span className="font-bold text-emerald-400">{quizScore}/{quizQuestions.length}</span>.</span>
                            )}
                            {essayFeedback && <span> Reflection submitted ✓</span>}
                        </p>
                        <button
                            onClick={(e) => { e.stopPropagation(); onCompleteChapter(); }}
                            disabled={completingChapter}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 cursor-pointer"
                        >
                            {completingChapter ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                                    {chapterIndex < bookData.totalChapters - 1 ? 'Continue to Next Chapter' : 'Finish Book'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════
    //  READING PHASE (original)
    // ═══════════════════════════════════════════════════════════════
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/95 backdrop-blur-xl animate-fade-in"
            onClick={() => { setWordPopup(null); onClose(); }}
        >
            <div
                ref={readerRef}
                className="relative max-w-3xl w-full bg-bg-card dark:bg-slate-900 border border-border-main rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
                onClick={e => { e.stopPropagation(); setWordPopup(null); }}
            >
                {/* Header */}
                <div className="p-6 md:p-8 pb-0 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-border-main flex items-center justify-center text-text-muted hover:text-text-main hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <div className="px-3 py-1.5 rounded-full border border-border-main flex items-center gap-2 bg-emerald-500/10">
                            <span className="material-symbols-outlined text-sm text-emerald-400">auto_stories</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Book Club</span>
                        </div>
                        {chapter.part && (
                            <div className="px-3 py-1.5 rounded-full border border-border-main bg-black/5 dark:bg-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{chapter.part}</span>
                            </div>
                        )}
                        <div className="px-3 py-1.5 rounded-full border border-border-main bg-black/5 dark:bg-white/5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                Chapter {chapterIndex + 1} of {bookData.totalChapters}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-black text-text-main dark:text-white leading-tight font-serif italic mb-1 pr-12">
                        {chapter.title}
                    </h2>
                    <p className="text-text-muted font-medium text-sm">
                        by <span className="text-text-main">{bookData.author}</span>
                    </p>

                    <div className="h-px w-full bg-black/5 dark:bg-white/5 mt-4"></div>
                </div>

                {/* Reading Body */}
                <div className="p-6 md:p-8 pt-4 overflow-y-auto flex-1 custom-scrollbar relative" onClick={(e) => e.stopPropagation()}>
                    {/* Tip banner — only on first page of first chapter */}
                    {currentPage === 0 && chapterIndex === 0 && (
                        <div className="mb-5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-400 text-base">touch_app</span>
                            <p className="text-xs text-emerald-400 font-medium">Tap any word to see its definition and meaning in context</p>
                        </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                        {renderText(pageText)}
                    </div>

                    {/* Word Definition Popup */}
                    {wordPopup && (() => {
                        const popupWidth = 288; // w-72 = 18rem = 288px
                        const containerWidth = readerRef.current?.clientWidth || 600;
                        const padding = 16; // px padding of reading body
                        const maxLeft = containerWidth - popupWidth - padding;
                        const popupLeft = Math.min(Math.max(wordPopup.x - popupWidth / 2, padding), maxLeft);
                        // Arrow position: where the word is relative to popup left
                        const arrowLeft = Math.min(Math.max(wordPopup.x - popupLeft, 16), popupWidth - 16);

                        return (
                            <div
                                className="absolute z-50 w-72 bg-bg-card dark:bg-slate-800 border border-border-main rounded-2xl shadow-2xl p-4 animate-fade-in"
                                style={{
                                    left: popupLeft,
                                    top: Math.max(wordPopup.y - 10, 8),
                                    transform: 'translateY(-100%)',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-black text-text-main text-base capitalize">{wordPopup.word}</h4>
                                    <button onClick={() => setWordPopup(null)} className="text-text-muted hover:text-text-main">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                                {wordPopup.loading ? (
                                    <div className="flex items-center gap-2 py-2">
                                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs text-text-muted">Looking up definition...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-0.5">Definition</p>
                                            <p className="text-sm text-text-muted leading-relaxed">{wordPopup.definition}</p>
                                        </div>
                                        {wordPopup.contextMeaning && (
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-0.5">In this context</p>
                                                <p className="text-sm text-text-muted leading-relaxed italic">{wordPopup.contextMeaning}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Arrow pointing down — dynamically positioned to point at the clicked word */}
                                <div
                                    className="absolute -bottom-1.5 w-3 h-3 bg-bg-card dark:bg-slate-800 border-r border-b border-border-main rotate-45"
                                    style={{ left: arrowLeft, transform: 'translateX(-50%) rotate(45deg)' }}
                                ></div>
                            </div>
                        );
                    })()}
                </div>

                {/* Footer: Pagination + Complete */}
                <div className="p-4 md:p-6 pt-0 shrink-0">
                    <div className="h-px bg-black/5 dark:bg-white/5 mb-4"></div>
                    <div className="flex items-center justify-between gap-3">
                        {/* Prev */}
                        <button
                            onClick={() => { setCurrentPage(p => Math.max(0, p - 1)); setWordPopup(null); }}
                            disabled={currentPage === 0}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${currentPage === 0
                                ? 'text-text-muted/40 cursor-not-allowed'
                                : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                            Prev
                        </button>

                        {/* Page indicator */}
                        <span className="text-xs font-bold text-text-muted">
                            Page {currentPage + 1} of {totalPages}
                        </span>

                        {/* Next or Complete */}
                        {isLastPage ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); startQuiz(); }}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25"
                            >
                                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                Complete Chapter
                            </button>
                        ) : (
                            <button
                                onClick={() => { setCurrentPage(p => Math.min(totalPages - 1, p + 1)); setWordPopup(null); }}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all"
                            >
                                Next
                                <span className="material-symbols-outlined text-base">chevron_right</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
