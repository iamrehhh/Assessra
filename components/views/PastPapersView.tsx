'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PastPapersView({ initialLevel, initialSubject, setView }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ levels: [], subjectsByLevel: {}, documents: [] });
    const [error, setError] = useState('');
    const [solvedPaperIds, setSolvedPaperIds] = useState(new Set());
    const [isLoaded, setIsLoaded] = useState(false); // For entrance animations

    // Selection State
    const [selectedLevel, setSelectedLevel] = useState(initialLevel || null);
    const [selectedSubject, setSelectedSubject] = useState(initialSubject || null);
    const [selectedPaperTab, setSelectedPaperTab] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/past-papers/available');
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || 'Failed to fetch available past papers.');
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setTimeout(() => setIsLoaded(true), 100);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/scores/user?username=${encodeURIComponent(session?.user?.email)}`)
                .then(r => r.json())
                .then(d => {
                    if (d.attempts) {
                        const solvedIds = new Set(d.attempts.map(a => a.paperId));
                        setSolvedPaperIds(solvedIds);
                    }
                })
                .catch(err => console.error("Failed to fetch user scores", err));
        }
    }, [session?.user?.email]);

    useEffect(() => {
        setSelectedLevel(initialLevel || null);
        setSelectedSubject(initialSubject || null);
    }, [initialLevel, initialSubject]);

    const navigate = (level?: string | null, subject?: string | null, extra?: string | null) => {
        setIsLoaded(false); // Trigger exit animation
        setTimeout(() => {
            const parts = ['pastpapers'];
            if (level) parts.push(level);
            if (subject) parts.push(subject);
            if (extra) parts.push(extra);
            setView(parts.join('/'));
            setIsLoaded(true); // Trigger enter animation
        }, 300); // Wait for fade out
    };

    const formatLabel = (str) => {
        if (!str) return '';
        if (str === 'alevel') return 'A Level';
        if (str === 'igcse') return 'IGCSE';
        return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    if (loading) {
        return (
            <div className="space-y-10 max-w-4xl mx-auto pt-10">
                <div className="text-center space-y-4 mb-12">
                    <div className="h-12 w-72 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse mx-auto border border-border-main" />
                    <div className="h-5 w-96 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse mx-auto border border-border-main" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-[300px] rounded-[2.5rem] bg-black/5 dark:bg-white/5 animate-pulse border border-border-main" />
                    <div className="h-[300px] rounded-[2.5rem] bg-black/5 dark:bg-white/5 animate-pulse border border-border-main" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
                <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-[2rem] p-10 text-center max-w-md shadow-[0_0_40px_rgba(239,68,68,0.1)] backdrop-blur-xl">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                        <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                    </div>
                    <h3 className="text-2xl font-black text-text-main mb-3">Could not load papers</h3>
                    <p className="text-sm text-text-muted font-medium mb-8 leading-relaxed">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 py-3 px-8 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ── Step 1: Select Level ────────────────────────────────────────────────
    if (!selectedLevel) {
        const sortedLevels = [...data.levels].sort((a, b) => a === 'igcse' ? -1 : 1);

        return (
            <div className={`space-y-8 max-w-4xl mx-auto pt-4 transition-all duration-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center space-y-3 mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-4 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                        <span className="text-primary text-3xl">📚</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-main">
                        Past Paper Practice
                    </h2>
                    <p className="text-text-muted text-lg max-w-xl mx-auto">Select your education level to access a comprehensive library of past papers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {['igcse', 'alevel'].map((cat, idx) => {
                        const isAvailable = data.levels.includes(cat);
                        const delay = isLoaded ? `delay-[${idx * 150}ms]` : '';

                        return (
                            <button
                                key={cat}
                                onClick={() => isAvailable && navigate(cat)}
                                disabled={!isAvailable}
                                className={`relative group overflow-hidden rounded-[2.5rem] p-1 border flex-shrink-0 cursor-pointer transition-all duration-500 ${isAvailable ? 'border-border-main hover:border-primary/50 hover:shadow-[0_20px_60px_rgba(34,197,94,0.15)] hover:-translate-y-2' : 'border-border-main/50 opacity-60 cursor-not-allowed'} transform transition-all ${delay}`}
                            >
                                <div className="relative h-full bg-bg-card rounded-[2.3rem] flex flex-col items-center justify-center p-12 text-center border border-white/5 overflow-hidden">
                                    
                                    {isAvailable && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    )}

                                    <div className={`w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center transition-all duration-500 relative ${isAvailable ? 'bg-primary/10 text-primary group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-black/5 dark:bg-white/5 text-text-muted'}`}>
                                        <span className="material-symbols-outlined text-5xl relative z-10">
                                            {cat === 'igcse' ? 'school' : 'history_edu'}
                                        </span>
                                        {isAvailable && <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>}
                                    </div>
                                    
                                    <h3 className="text-3xl font-black text-text-main mb-3 drop-shadow-sm">{formatLabel(cat)}</h3>
                                    
                                    {isAvailable ? (
                                        <p className="text-text-muted font-bold text-sm tracking-wide bg-black/5 dark:bg-white/5 px-4 py-1.5 rounded-full border border-border-main">
                                            {data.subjectsByLevel[cat]?.length || 0} Subjects Available
                                        </p>
                                    ) : (
                                        <span className="inline-block px-4 py-1.5 bg-black/10 dark:bg-white/10 rounded-full text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Coming Soon</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ── Step 2: Select Subject ────────────────────────────────────────────────
    if (!selectedSubject) {
        const subjects = data.subjectsByLevel[selectedLevel] || [];

        return (
            <div className={`space-y-8 max-w-5xl mx-auto pt-4 transition-all duration-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Navigation Breadcrumb */}
                <div className="flex items-center gap-3 text-text-muted font-bold text-xs mb-8 bg-bg-card border border-border-main w-fit rounded-full p-1.5 px-4 shadow-sm">
                    <button onClick={() => navigate(null)} className="hover:text-primary flex items-center transition-colors uppercase tracking-wider">
                        Levels
                    </button>
                    <span className="material-symbols-outlined text-[14px] opacity-50">chevron_right</span>
                    <span className="text-text-main uppercase tracking-wider">{formatLabel(selectedLevel)}</span>
                </div>

                <div className="mb-12">
                    <h2 className="text-4xl font-black tracking-tight text-text-main flex items-center gap-4">
                        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center text-3xl border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            {selectedLevel === 'igcse' ? '🏫' : '🎓'}
                        </span>
                        {formatLabel(selectedLevel)} Subjects
                    </h2>
                    <p className="text-text-muted mt-3 ml-[72px] text-lg">Choose a subject to explore its paper library.</p>
                </div>

                {subjects.length === 0 ? (
                    <div className="text-center p-16 glass border border-border-main rounded-[2.5rem] text-text-muted">
                        <span className="material-symbols-outlined text-6xl mb-6 opacity-30">folder_off</span>
                        <h3 className="text-2xl font-black text-text-main mb-3">No subjects found</h3>
                        <p className="text-lg">There are no uploaded papers for this level yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject, idx) => {
                            const paperCount = data.documents.filter(d => d.subject === subject && d.level === selectedLevel && d.type === 'paper').length;
                            return (
                                <button
                                    key={subject}
                                    onClick={() => navigate(selectedLevel, subject)}
                                    className="glass p-8 rounded-[2rem] border border-border-main hover:border-primary/40 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] group relative overflow-hidden bg-bg-card"
                                >
                                    {/* Hover Glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-500"></div>
                                    
                                    <h3 className="text-2xl font-black text-text-main mb-4 group-hover:text-primary transition-colors drop-shadow-sm relative z-10">{formatLabel(subject)}</h3>
                                    
                                    <div className="flex justify-between items-end relative z-10">
                                        <div className="flex items-center gap-2 text-sm text-text-muted font-bold bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-border-main">
                                            <span className="material-symbols-outlined text-base text-primary/70">description</span>
                                            {paperCount} Papers
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // ── Step 3: Select Paper ────────────────────────────────────────────────
    const papers = data.documents.filter(d => d.level === selectedLevel && d.subject === selectedSubject && d.type === 'paper');

    const groupedPapers = {};
    papers.forEach(paper => {
        const rawFilename = paper.filename.replace('.pdf', '');
        const prefix = selectedSubject + '_';
        const suffix = rawFilename.startsWith(prefix) ? rawFilename.substring(prefix.length) : rawFilename;
        const parts = suffix.split('_');

        let paperNum = 'Other';
        let season = 'Unknown Season';
        let year = paper.year ? paper.year.toString() : 'Unknown Year';

        if (parts.length >= 3) {
            const seasonCode = parts[0][0].toLowerCase();
            if (seasonCode === 's') season = 'May-June';
            else if (seasonCode === 'w') season = 'Oct-Nov';
            else if (seasonCode === 'm') season = 'Feb-March';

            const paperCode = parts[2];
            if (paperCode && paperCode.length > 0 && !isNaN(paperCode[0])) {
                paperNum = `Paper ${paperCode[0]}`;
            }
        }

        if (!groupedPapers[paperNum]) groupedPapers[paperNum] = {};
        if (!groupedPapers[paperNum][year]) groupedPapers[paperNum][year] = {};
        if (!groupedPapers[paperNum][year][season]) groupedPapers[paperNum][year][season] = [];

        groupedPapers[paperNum][year][season].push(paper);
    });

    const sortedPaperNums = Object.keys(groupedPapers).sort();
    const activeTab = (selectedPaperTab && sortedPaperNums.includes(selectedPaperTab)) ? selectedPaperTab : sortedPaperNums[0];

    const handlePaperClick = (filename) => {
        router.push(`/past-papers/practice/${encodeURIComponent(filename)}?level=${encodeURIComponent(selectedLevel)}&subject=${encodeURIComponent(selectedSubject)}`);
    };

    return (
        <div className={`space-y-8 max-w-5xl mx-auto pt-4 transition-all duration-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Premium Breadcrumb Navigation */}
            <div className="flex items-center gap-3 text-text-muted font-bold text-[11px] uppercase tracking-widest mb-8 bg-bg-card border border-border-main w-fit rounded-xl p-1.5 px-4 shadow-sm">
                <button onClick={() => navigate(null)} className="hover:text-text-main flex items-center transition-colors">
                    Levels
                </button>
                <span className="material-symbols-outlined text-[14px] opacity-40">chevron_right</span>
                <button onClick={() => navigate(selectedLevel)} className="hover:text-text-main flex items-center transition-colors">
                    {formatLabel(selectedLevel)}
                </button>
                <span className="material-symbols-outlined text-[14px] opacity-40">chevron_right</span>
                <span className="text-primary">{formatLabel(selectedSubject)}</span>
            </div>

            <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-main mb-3 text-transparent bg-clip-text bg-gradient-to-r from-text-main to-text-main/70">
                    Library Overview
                </h2>
                <p className="text-text-muted text-lg">Select a paper variant to begin your focused practice session.</p>
            </div>

            {papers.length === 0 ? (
                <div className="text-center p-16 glass border border-border-main rounded-[2.5rem] text-text-muted">
                    <span className="material-symbols-outlined text-6xl mb-6 opacity-30">folder_off</span>
                    <h3 className="text-2xl font-black text-text-main mb-3">No papers found</h3>
                    <p className="text-lg">There are no uploaded past papers for {formatLabel(selectedSubject)} yet.</p>
                </div>
            ) : (
                <div className="bg-bg-card rounded-[2.5rem] border border-border-main p-4 md:p-8 shadow-sm">
                    {/* Paper Categories Tabs (Sleek Pills) */}
                    <div className="flex flex-wrap items-center gap-3 mb-10 p-2 bg-black/5 dark:bg-[#0f172a] rounded-2xl border border-border-main/50 w-fit">
                        {sortedPaperNums.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedPaperTab(tab)}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === tab ? 'bg-primary text-background-dark shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-105' : 'text-text-muted hover:bg-black/10 dark:hover:bg-white/5 hover:text-text-main'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">folder</span>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-12">
                        {activeTab && groupedPapers[activeTab] && (
                            <div className="animate-fade-in">
                                <h3 className="text-2xl font-black text-text-main mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                    </div>
                                    {activeTab} Papers
                                </h3>

                                <div className="space-y-10 pl-6 border-l-2 border-border-main/50 ml-5 relative">
                                    {Object.keys(groupedPapers[activeTab]).sort((a, b) => b.localeCompare(a)).map((year, yIndex) => {
                                        const seasonsObj = groupedPapers[activeTab][year];
                                        const sortedSeasons = Object.keys(seasonsObj).sort();

                                        return (
                                            <div key={year} className="relative">
                                                {/* Year Indicator Node */}
                                                <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-bg-card border-4 border-primary z-10 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                                                
                                                <h4 className="text-2xl font-black text-text-main mb-6 -mt-1 tracking-tight">
                                                    {year}
                                                </h4>

                                                <div className="space-y-8">
                                                    {sortedSeasons.map(season => (
                                                        <div key={season} className="space-y-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-[1px] w-8 bg-border-main"></div>
                                                                <h5 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-md border border-border-main">
                                                                    <span className="material-symbols-outlined text-xs text-primary/70">{season.includes('May') ? 'wb_sunny' : season.includes('Oct') ? 'ac_unit' : 'local_florist'}</span>
                                                                    {season}
                                                                </h5>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 pl-11">
                                                                {seasonsObj[season].sort((a, b) => a.filename.localeCompare(b.filename)).map((paper, idx) => {
                                                                    const isSolved = solvedPaperIds.has(paper.originalId);
                                                                    return (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={() => handlePaperClick(paper.originalId)}
                                                                            className={`relative glass p-5 rounded-2xl border ${isSolved ? 'border-primary/40 hover:border-primary border-t-primary/60 bg-gradient-to-br from-primary/5 to-transparent' : 'border-border-main hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5'} text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-start gap-4 group overflow-hidden`}
                                                                        >
                                                                            {/* Background Glow */}
                                                                            <div className="absolute -inset-2 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none"></div>

                                                                            {/* Solved Badge */}
                                                                            {isSolved && (
                                                                                <div className="absolute top-0 right-0 bg-primary text-background-dark px-3 py-1 rounded-bl-2xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(34,197,94,0.3)] z-10">
                                                                                    <span className="material-symbols-outlined text-[14px]">task_alt</span>
                                                                                    Completed
                                                                                </div>
                                                                            )}

                                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 relative z-10 ${isSolved ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-black/5 dark:bg-[#0f172a] border border-border-main text-text-muted group-hover:text-primary group-hover:border-primary/30'}`}>
                                                                                <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                                                                            </div>
                                                                            
                                                                            <div className="flex-1 min-w-0 relative z-10 pt-1">
                                                                                <h4 className="text-base font-bold text-text-main truncate mb-1 group-hover:text-primary transition-colors">
                                                                                    {paper.filename.replace('.pdf', '')}
                                                                                </h4>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                                                                        Variant {paper.filename.split('_').pop()?.replace('.pdf', '') || '1'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div className="shrink-0 flex items-center h-12 relative z-10">
                                                                                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-border-main opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                                                    <span className="material-symbols-outlined text-sm text-text-main">arrow_forward</span>
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
