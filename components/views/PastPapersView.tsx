'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ScorecardView from './ScorecardView';

export default function PastPapersView({ initialLevel, initialSubject, initialScorecard, setView }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ levels: [], subjectsByLevel: {}, documents: [] });
    const [error, setError] = useState('');
    const [solvedPaperIds, setSolvedPaperIds] = useState(new Set());

    // Selection State — initialize from URL hash params
    const [selectedLevel, setSelectedLevel] = useState(initialLevel || null);
    const [selectedSubject, setSelectedSubject] = useState(initialSubject || null);
    const [selectedPaperTab, setSelectedPaperTab] = useState(null);
    const [showScorecard, setShowScorecard] = useState(initialScorecard || false);

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


    // Sync internal state when props change (browser back/forward)
    useEffect(() => {
        setSelectedLevel(initialLevel || null);
        setSelectedSubject(initialSubject || null);
        setShowScorecard(initialScorecard || false);
    }, [initialLevel, initialSubject, initialScorecard]);

    // Helper to navigate and update URL hash
    const navigate = (level?: string | null, subject?: string | null, extra?: string | null) => {
        const parts = ['pastpapers'];
        if (level) parts.push(level);
        if (subject) parts.push(subject);
        if (extra) parts.push(extra);
        setView(parts.join('/'));
    };

    // Helper to format strings like 'alevel' to 'A Level'
    const formatLabel = (str) => {
        if (!str) return '';
        if (str === 'alevel') return 'A Level';
        if (str === 'igcse') return 'IGCSE';
        return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted">
                <div className="w-8 h-8 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4" />
                <p className="font-bold">Loading available past papers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-md">
                    <span className="material-symbols-outlined text-4xl text-red-400 mb-2">error</span>
                    <h3 className="text-lg font-bold text-text-main mb-2">Could not load papers</h3>
                    <p className="text-sm text-text-muted font-medium">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 border border-border-main text-text-muted py-2 px-6 rounded-xl font-bold transition-all">Retry</button>
                </div>
            </div>
        );
    }

    // Step 1: Select Level
    if (!selectedLevel) {
        // Sort levels to ensure IGCSE is first if there are both
        const sortedLevels = [...data.levels].sort((a, b) => a === 'igcse' ? -1 : 1);

        return (
            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                <div className="text-center space-y-2 mb-10">
                    <h2 className="text-3xl font-black tracking-tight text-text-main">
                        <span className="text-primary">📚</span> Past Paper Practice
                    </h2>
                    <p className="text-text-muted">Select your education level to view available past papers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['igcse', 'alevel'].map(cat => {
                        const isAvailable = data.levels.includes(cat);
                        return (
                            <button
                                key={cat}
                                onClick={() => isAvailable && navigate(cat)}
                                disabled={!isAvailable}
                                className={`p-8 rounded-3xl border text-center transition-all ${isAvailable ? 'glass border-border-main hover:border-primary/50 hover:bg-black/5 dark:bg-white/5 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10' : 'bg-black/5 dark:bg-white/5 border-border-main opacity-50 cursor-not-allowed'}`}
                            >
                                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isAvailable ? 'bg-primary/20 text-primary' : 'bg-black/5 dark:bg-white/5 text-text-muted'}`}>
                                    <span className="material-symbols-outlined text-3xl">
                                        {cat === 'igcse' ? 'school' : 'history_edu'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-text-main mb-2">{formatLabel(cat)}</h3>
                                {isAvailable ? (
                                    <p className="text-text-muted font-medium text-sm">
                                        {data.subjectsByLevel[cat]?.length || 0} Subjects Available
                                    </p>
                                ) : (
                                    <span className="inline-block px-3 py-1 bg-black/10 dark:bg-white/10 rounded-full text-xs font-bold text-text-muted uppercase tracking-widest mt-2">Coming Soon</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Step 2: Select Subject
    if (!selectedSubject) {
        const subjects = data.subjectsByLevel[selectedLevel] || [];

        return (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <button onClick={() => navigate(null)} className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-medium text-sm mb-6">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Change Level
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-black tracking-tight text-text-main flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-xl">
                            {selectedLevel === 'igcse' ? '🏫' : '🎓'}
                        </span>
                        {formatLabel(selectedLevel)} Subjects
                    </h2>
                    <p className="text-text-muted mt-2 ml-14">Select a subject to view available past papers.</p>
                </div>

                {subjects.length === 0 ? (
                    <div className="text-center p-12 glass border border-border-main rounded-3xl text-text-muted">
                        <span className="material-symbols-outlined text-5xl mb-4 opacity-50">folder_off</span>
                        <h3 className="text-xl font-bold text-text-main mb-2">No subjects found</h3>
                        <p>There are no uploaded papers for this level yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {subjects.map(subject => {
                            // Count papers for this subject
                            const paperCount = data.documents.filter(d => d.subject === subject && d.level === selectedLevel && d.type === 'paper').length;

                            return (
                                <button
                                    key={subject}
                                    onClick={() => navigate(selectedLevel, subject)}
                                    className="glass p-6 rounded-2xl border border-border-main hover:border-primary/40 hover:bg-black/5 dark:bg-white/5 text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 group"
                                >
                                    <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-primary transition-colors">{formatLabel(subject)}</h3>
                                    <div className="flex items-center gap-2 text-sm text-text-muted font-medium">
                                        <span className="material-symbols-outlined text-base">description</span>
                                        {paperCount} Papers
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // Step 3: Select Paper
    const papers = data.documents.filter(d => d.level === selectedLevel && d.subject === selectedSubject && d.type === 'paper');

    const groupedPapers = {};
    papers.forEach(paper => {
        const rawFilename = paper.filename.replace('.pdf', '');

        // Strip the subject prefix to normalize parsing
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
        router.push(`/past-papers/practice/${encodeURIComponent(filename)}`);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center gap-4 text-text-muted font-medium text-sm mb-6 bg-black/5 dark:bg-white/5 border border-border-main w-fit rounded-xl p-1 px-3">
                <button onClick={() => { navigate(null); }} className="hover:text-text-main flex items-center transition-colors">
                    Levels
                </button>
                <span className="material-symbols-outlined text-sm opacity-50">chevron_right</span>
                <button onClick={() => { navigate(selectedLevel); }} className="hover:text-text-main flex items-center transition-colors">
                    {formatLabel(selectedLevel)}
                </button>
                <span className="material-symbols-outlined text-sm opacity-50">chevron_right</span>
                <span className="text-primary font-bold">{formatLabel(selectedSubject)}</span>
            </div>

            <div className="mb-4 flex flex-wrap items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-text-main">
                        Available Past Papers
                    </h2>
                    <p className="text-text-muted mt-2">Select a paper to start practicing in the split-screen view.</p>
                </div>
                <button
                    onClick={() => navigate(selectedLevel, selectedSubject, 'scorecard')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-primary text-background-dark hover:bg-white hover:-translate-y-0.5 shadow-lg shadow-primary/10 transition-all"
                >
                    <span className="material-symbols-outlined text-lg">bar_chart</span>
                    My Scorecard
                </button>
            </div>

            {papers.length === 0 ? (
                <div className="text-center p-12 glass border border-border-main rounded-3xl text-text-muted">
                    <span className="material-symbols-outlined text-5xl mb-4 opacity-50">folder_off</span>
                    <h3 className="text-xl font-bold text-text-main mb-2">No papers found</h3>
                    <p>There are no uploaded past papers for {formatLabel(selectedSubject)} yet.</p>
                </div>
            ) : (
                <>
                    {/* Paper Categories Tabs */}
                    <div className="flex flex-wrap items-center gap-3 mb-8 border-b border-border-main pb-4">
                        {sortedPaperNums.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedPaperTab(tab)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'bg-black/5 dark:bg-white/5 text-text-muted border border-border-main hover:bg-black/10 dark:bg-white/10 hover:text-text-main'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">folder_open</span>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-12">
                        {activeTab && groupedPapers[activeTab] && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-primary pb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">description</span>
                                    {activeTab} Papers
                                </h3>

                                <div className="space-y-8 pl-4 border-l border-border-main ml-3">
                                    {Object.keys(groupedPapers[activeTab]).sort((a, b) => b.localeCompare(a)).map(year => {
                                        const seasonsObj = groupedPapers[activeTab][year];
                                        const sortedSeasons = Object.keys(seasonsObj).sort();

                                        return (
                                            <div key={year} className="space-y-4">
                                                <h4 className="text-xl font-bold text-text-main flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm opacity-50">calendar_today</span>
                                                    {year}
                                                </h4>

                                                <div className="space-y-4 pl-4 border-l border-border-main ml-2">
                                                    {sortedSeasons.map(season => (
                                                        <div key={season} className="space-y-3">
                                                            <h5 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-xs">wb_sunny</span>
                                                                {season}
                                                            </h5>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {seasonsObj[season].sort((a, b) => a.filename.localeCompare(b.filename)).map((paper, idx) => {
                                                                    const isSolved = solvedPaperIds.has(paper.originalId);
                                                                    return (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={() => handlePaperClick(paper.originalId)}
                                                                            className={`glass p-5 rounded-2xl border ${isSolved ? 'border-primary/40 hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10' : 'border-border-main hover:border-primary/50 hover:bg-black/5 dark:bg-white/5'} text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 flex items-start gap-4 group relative overflow-hidden`}
                                                                        >
                                                                            {isSolved && (
                                                                                <div className="absolute top-0 right-0 bg-primary/20 text-primary px-3 py-1 rounded-bl-xl font-bold text-xs flex items-center gap-1 backdrop-blur-md border-b border-l border-primary/20">
                                                                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                                                    Solved
                                                                                </div>
                                                                            )}
                                                                            <div className={`w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border ${isSolved ? 'border-primary/30 text-primary group-hover:bg-primary/20 group-hover:border-primary/50' : 'border-border-main group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:text-primary'} flex items-center justify-center shrink-0 transition-all`}>
                                                                                <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <h4 className="text-base font-bold text-text-main truncate mb-1 group-hover:text-primary transition-colors">
                                                                                    {paper.filename.replace('.pdf', '')}
                                                                                </h4>
                                                                                <div className="flex items-center gap-3">
                                                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-wider">
                                                                                        <span className="material-symbols-outlined text-[14px]">history_edu</span>
                                                                                        {formatLabel(selectedSubject)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="shrink-0 flex items-center h-12">
                                                                                <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">arrow_forward</span>
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
                </>
            )}

            {/* In-built Scorecard Modal Wrapper */}
            {showScorecard && (
                <div className="fixed inset-0 z-[9999] bg-bg-base overflow-y-auto p-6 lg:p-12 animate-fade-in">
                    <div className="max-w-4xl mx-auto bg-[#1e1e1e] rounded-3xl p-8 border border-border-main shadow-2xl relative">
                        <button
                            onClick={() => navigate(selectedLevel, selectedSubject)}
                            className="absolute top-6 right-6 flex items-center gap-2 text-text-muted hover:text-text-main transition-colors text-sm font-bold bg-black/5 dark:bg-white/5 w-fit px-4 py-2 rounded-xl"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                            Close
                        </button>
                        <ScorecardView filterSubject={selectedSubject === 'general_paper' ? 'general' : selectedSubject} />
                    </div>
                </div>
            )}
        </div>
    );
}
