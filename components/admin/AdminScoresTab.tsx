import React from 'react';

interface AdminScoresTabProps {
    scores: any[];
    scoreTab: string;
    setScoreTab: (tab: string) => void;
    searchTerm: string;
    actionLoading: string | null;
    onViewLogs: (entry: any) => void;
    onResetScores: (email: string) => void;
}

export default function AdminScoresTab({
    scores,
    scoreTab,
    setScoreTab,
    searchTerm,
    actionLoading,
    onViewLogs,
    onResetScores
}: AdminScoresTabProps) {

    // Aggregate scores by user based on sub-tab
    const scoresByUser: Record<string, any> = {};
    const relevantScores = scores.filter(s => {
        const isVocab = s.subject === 'vocab' || s.subject === 'idioms' || (s.paper_id && s.paper_id.startsWith('vocab_idioms'));
        return scoreTab === 'vocab' ? isVocab : !isVocab;
    });

    for (const s of relevantScores) {
        if (!scoresByUser[s.username]) {
            scoresByUser[s.username] = { email: s.username, nickname: s.userNickname, name: s.userName, totalScore: 0, totalMax: 0, attempts: 0, subjects: new Set(), logs: [] };
        }
        const u = scoresByUser[s.username];
        u.totalScore += s.score;
        u.totalMax += s.maxMarks;
        u.attempts += 1;
        u.subjects.add(s.subject);
        u.logs.push(s);
    }
    
    let scoreAggregated = Object.values(scoresByUser).map(u => ({
        ...u,
        subjects: Array.from(u.subjects),
        percentage: u.totalMax > 0 ? Math.round((u.totalScore / u.totalMax) * 100) : 0,
    })).sort((a, b) => b.totalScore - a.totalScore);

    const filteredScores = scoreAggregated.filter(u =>
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.nickname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Sub-tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setScoreTab('pyp')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
                        scoreTab === 'pyp' 
                            ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
                            : 'glass text-text-muted hover:text-text-main hover:bg-bg-base/50'
                    }`}
                >
                    <span>📚</span> PYP
                </button>
                <button
                    onClick={() => setScoreTab('vocab')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
                        scoreTab === 'vocab' 
                            ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
                            : 'glass text-text-muted hover:text-text-main hover:bg-bg-base/50'
                    }`}
                >
                    <span>🗣️</span> Vocab & Idioms
                </button>
            </div>

            {filteredScores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                    <span className="text-4xl mb-4">📊</span>
                    <p className="font-semibold text-lg">No scores found</p>
                </div>
            ) : (
                <div className="overflow-x-auto glass rounded-2xl shadow-sm border border-border-main">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-base/50 border-b border-border-main">
                                <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                                <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Nickname</th>
                                <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Total Score</th>
                                <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Percentage</th>
                                <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Attempts</th>
                                <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Subjects</th>
                                <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-main">
                            {filteredScores.map(entry => (
                                <tr key={entry.email} className="hover:bg-bg-base/40 transition-colors group">
                                    <td className="py-4 px-5">
                                        <div>
                                            <div className="font-semibold text-text-main group-hover:text-primary transition-colors">{entry.name || entry.email}</div>
                                            <div className="text-xs text-text-muted mt-0.5">{entry.email}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 text-sm">{entry.nickname || <span className="text-text-muted/50">—</span>}</td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-bold text-text-main text-base">{entry.totalScore}</span>
                                            <span className="text-xs text-text-muted">/ {entry.totalMax}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                            entry.percentage >= 70 ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 
                                            entry.percentage >= 40 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 
                                            'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                        }`}>
                                            {entry.percentage}%
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 font-semibold">{entry.attempts}</td>
                                    <td className="py-4 px-5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {entry.subjects.map((s: string) => (
                                                <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-500/10 text-text-muted border border-gray-500/20 uppercase tracking-wider">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                                                onClick={() => onViewLogs(entry)}
                                            >
                                                View Logs
                                            </button>
                                            <button
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                                disabled={actionLoading === entry.email}
                                                onClick={() => onResetScores(entry.email)}
                                            >
                                                {actionLoading === entry.email ? 'Resetting...' : 'Reset'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
