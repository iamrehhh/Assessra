
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const subjectLabels = {
    'business-p3': '💼 Business P3',
    'business-p4': '💼 Business P4',
    'economics-p4': '📈 Economics P4',
    'economics-p3': '📈 Economics P3 (MCQ)',
    'general-p1': '🌍 General Paper',
};

const subjectColors = {
    'business-p3': '#16a34a',
    'business-p4': '#15803d',
    'economics-p4': '#0ea5e9',
    'economics-p3': '#6366f1',
    'general-p1': '#f59e0b',
};

function ScoreBadge({ score, max }: { score: number, max: number }) {
    const pct = max > 0 ? Math.round((score / max) * 100) : 0;
    const color = pct >= 70 ? '#16a34a' : pct >= 50 ? '#f59e0b' : '#ef4444';
    return (
        <span style={{ background: color + '20', color, padding: '2px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
            {score}/{max} ({pct}%)
        </span>
    );
}

export default function ScorecardView({ filterSubject }: { filterSubject: string | null }) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;
    const userName = session?.user?.name || userEmail;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedPaper, setExpandedPaper] = useState<any>(null);

    useEffect(() => {
        if (!userEmail) return;
        fetch(`/api/scores/user?username=${encodeURIComponent(userEmail)}`)
            .then(r => r.json())
            .then(d => {
                if (filterSubject) {
                    const prefix = filterSubject === 'general_paper' ? 'general' : filterSubject;
                    const filteredAttempts = (d.attempts || []).filter(a => a.subject && a.subject.startsWith(prefix));

                    const subjectTotals: Record<string, { score: number, maxMarks: number, attempts: number }> = {};
                    let grandTotal = 0;
                    let grandMax = 0;

                    for (const a of filteredAttempts) {
                        const s = a.subject;
                        if (!subjectTotals[s]) subjectTotals[s] = { score: 0, maxMarks: 0, attempts: 0 };
                        subjectTotals[s].score += a.score;
                        subjectTotals[s].maxMarks += a.maxMarks;
                        subjectTotals[s].attempts += 1;
                        grandTotal += a.score;
                        grandMax += a.maxMarks;
                    }

                    setData({
                        username: d.username,
                        attempts: filteredAttempts,
                        subjectTotals,
                        grandTotal,
                        grandMax,
                        grandPercent: grandMax > 0 ? Math.round((grandTotal / grandMax) * 100) : 0,
                    });
                } else {
                    setData(d);
                }
                setLoading(false);
            })
            .catch(() => { setError('Failed to load scores.'); setLoading(false); });
    }, [userEmail, filterSubject]);

    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>⏳ Loading your scorecard...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>;
    if (!data || data.attempts?.length === 0) return (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
            <p style={{ fontSize: '1.3rem' }}>📭 No scores yet!</p>
            <p>Submit some papers for AI marking and your scores will appear here.</p>
        </div>
    );

    // Group attempts by subject
    const bySubject: Record<string, any[]> = {};
    for (const a of data.attempts) {
        if (!bySubject[a.subject]) bySubject[a.subject] = [];
        bySubject[a.subject].push(a);
    }

    return (
        <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--lime-dark)', fontFamily: 'var(--font-playfair)' }}>📊 My Scorecard</h2>
                <p style={{ color: '#666' }}>Welcome, {userName} — here's your performance overview</p>
            </div>

            {/* Grand total card */}
            <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', borderRadius: '16px', padding: '24px', marginBottom: '30px', textAlign: 'center', boxShadow: '0 4px 20px rgba(22,163,74,0.3)' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800 }}>{data.grandPercent}%</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 600, opacity: 0.9 }}>Overall Score: {data.grandTotal} / {data.grandMax}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.75, marginTop: '6px' }}>{data.attempts.length} question{data.attempts.length !== 1 ? 's' : ''} attempted</div>
            </div>

            {/* Subject breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                {Object.entries(data.subjectTotals).map(([subject, totals]: [string, any]) => {
                    const pct = totals.maxMarks > 0 ? Math.round((totals.score / totals.maxMarks) * 100) : 0;
                    const color = subjectColors[subject] || '#64748b';
                    return (
                        <div key={subject} style={{ background: 'white', border: `2px solid ${color}30`, borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ fontSize: '0.85rem', color, fontWeight: 700, marginBottom: '6px' }}>{subjectLabels[subject] || subject}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color }}>{pct}%</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{totals.score}/{totals.maxMarks} marks • {totals.attempts} attempt{totals.attempts !== 1 ? 's' : ''}</div>
                        </div>
                    );
                })}
            </div>

            {/* Detailed history by subject */}
            {Object.entries(bySubject).map(([subject, attempts]) => (
                <div key={subject} style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontFamily: 'var(--font-playfair)', color: subjectColors[subject] || 'var(--lime-dark)', marginBottom: '12px', borderBottom: `2px solid ${(subjectColors[subject] || '#16a34a')}30`, paddingBottom: '8px' }}>
                        {subjectLabels[subject] || subject}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {attempts.map((a, i) => (
                            <div key={i} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{a.paperTitle}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                                        Q{a.questionNumber} • {new Date(a.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                                <ScoreBadge score={a.score} max={a.maxMarks} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
