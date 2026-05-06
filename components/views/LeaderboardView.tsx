'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const medals = ['🥇', '🥈', '🥉'];

const subjectLabels = {
    'business-p3': 'Biz P3',
    'business-p4': 'Biz P4',
    'economics-p4': 'Econ P4',
    'economics-p3': 'Econ P3',
    'general-p1': 'GP1',
};

export default function LeaderboardView() {
    const { data: session } = useSession();
    const currentUser = session?.user?.email;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => { setError('Failed to load leaderboard.'); setLoading(false); });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>⏳ Loading leaderboard...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>;
    if (!data?.leaderboard?.length) return (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
            <p style={{ fontSize: '1.3rem' }}>📭 No scores yet — be the first on the board!</p>
        </div>
    );

    const board = data.leaderboard;

    return (
        <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-text-main flex items-center justify-center gap-3">
                    <span className="text-primary text-5xl">🏆</span> Leaderboard
                </h2>
                <p className="text-text-muted text-lg">Top students ranked by total marks earned</p>
            </div>

            {/* Top 3 podium cards */}
            {board.length >= 3 && (
                <div className="flex justify-center items-end gap-4 h-[280px]">
                    {[board[1], board[0], board[2]].map((player, i) => {
                        if (!player) return null;
                        const realRank = i === 0 ? 1 : i === 1 ? 0 : 2;
                        const heights = ['h-[180px]', 'h-[220px]', 'h-[160px]'];
                        const isMe = player._id === currentUser;

                        const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
                        const displayName = player.nickname || player.name || player._id.split('@')[0];

                        return (
                            <div key={player._id} className="flex flex-col items-center w-[120px] group">
                                {/* Avatar Bubble */}
                                <div className={`
                                    flex items-center justify-center rounded-full mb-3 shadow-xl transition-transform duration-500 group-hover:-translate-y-2 relative z-10
                                    ${realRank === 0 ? 'w-20 h-20 text-3xl border-4 border-amber-500 ring-4 ring-amber-500/20' : 'w-16 h-16 text-2xl border-4'}
                                    ${realRank === 1 ? 'border-slate-300 ring-4 ring-slate-300/20' : ''}
                                    ${realRank === 2 ? 'border-amber-700 ring-4 ring-amber-700/20' : ''}
                                `} style={{
                                        background: player.image ? `url(${player.image}) center/cover` : '#22c55e',
                                        color: 'white', fontWeight: 800
                                    }}>
                                    {!player.image && getInitials(displayName)}
                                    {isMe && (
                                        <div className="absolute -bottom-2 bg-primary text-background-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border-2 border-background-dark">You</div>
                                    )}
                                </div>

                                <div className="text-sm font-bold text-text-main mb-2 text-center w-full truncate px-1">
                                    {displayName}
                                </div>

                                {/* Podium Bar */}
                                <div className={`
                                    w-full ${heights[i]} rounded-t-3xl flex flex-col items-center pt-5 shadow-[0_-10px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)] relative overflow-hidden border-t border-x border-border-main
                                    ${isMe ? 'bg-gradient-to-t from-primary/40 to-primary/20' : 'bg-gradient-to-t from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/10'}
                                `}>
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/30 to-transparent"></div>
                                    <div className="text-3xl mb-1">{medals[realRank]}</div>
                                    <div className="text-2xl font-black text-text-main">{player.totalScore}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Full rankings table */}
            <div className="glass rounded-3xl overflow-hidden border border-border-main shadow-2xl">
                {/* Table header */}
                <div className="grid grid-cols-[60px_1fr_120px_90px_90px] p-4 bg-black/5 dark:bg-white/5 border-b border-border-main text-xs font-bold text-text-muted uppercase tracking-widest">
                    <span className="text-center">Rank</span>
                    <span>Student</span>
                    <span className="text-right">Total Marks</span>
                    <span className="text-right">Avg %</span>
                    <span className="text-right">Attempts</span>
                </div>

                <div className="divide-y divide-border-main">
                    {board.map((player, idx) => {
                        const isMe = player._id === currentUser;
                        const rank = idx + 1;
                        return (
                            <div key={player._id} className={`
                                grid grid-cols-[60px_1fr_120px_90px_90px] p-4 items-center transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5
                                ${isMe ? 'bg-primary/5' : ''}
                            `}>
                                <span className={`text-center font-black ${rank <= 3 ? 'text-xl' : 'text-text-muted'}`}>
                                    {rank <= 3 ? medals[rank - 1] : rank}
                                </span>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-text-muted border border-border-main"
                                        style={{ background: player.image ? `url(${player.image}) center/cover` : 'rgba(255,255,255,0.05)' }}>
                                        {!player.image && (player.nickname ? player.nickname.charAt(0).toUpperCase() : player._id.charAt(0).toUpperCase())}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`font-bold ${isMe ? 'text-primary' : 'text-text-main'}`}>
                                            {player.nickname || player.name || player._id.split('@')[0]}
                                        </div>
                                        {player.level && <span className="text-[10px] bg-black/10 dark:bg-white/10 text-text-muted px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-border-main">{player.level}</span>}
                                    </div>
                                </div>

                                <span className="text-right font-black text-xl text-primary">{player.totalScore}</span>

                                <div className="flex justify-end">
                                    <span className={`
                                        text-xs font-bold px-3 py-1 rounded-full border
                                        ${player.percentage >= 70 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            player.percentage >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'}
                                    `}>
                                        {player.percentage}%
                                    </span>
                                </div>

                                <span className="text-right text-text-muted font-medium">{player.totalAttempts}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
