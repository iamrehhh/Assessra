'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function GeneralPaperView({ paperId, paperData, onBack }) {
    const paper = paperData[paperId];
    const { data: session } = useSession();
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState({});
    const [results, setResults] = useState({});
    const [submitted, setSubmitted] = useState({});

    if (!paper) return (
        <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
            <p>Paper not found.</p>
            <button onClick={onBack} style={{ padding: '10px 30px', borderRadius: '8px', border: 'none', background: 'var(--lime-primary)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Go Back</button>
        </div>
    );

    async function handleSubmit(q) {
        const answer = answers[q.n];
        if (!answer?.trim()) return;
        setLoading(prev => ({ ...prev, [q.n]: true }));
        try {
            const res = await fetch('/api/mark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: q.t,
                    marks: q.m,
                    answer: answer.trim(),
                    paperTitle: paper.title,
                    pdf: paper.pdf,
                }),
            });
            const data = await res.json();
            setResults(prev => ({ ...prev, [q.n]: data }));
            setSubmitted(prev => ({ ...prev, [q.n]: true }));

            // Silently save score
            if (data.score !== undefined && session?.user?.name) {
                fetch('/api/scores/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: session.user.name, paperId, paperTitle: paper.title, subject: 'general-p1', questionNumber: q.n, score: data.score, maxMarks: q.m }),
                }).catch(() => { });
            }
        } catch {
            setResults(prev => ({ ...prev, [q.n]: { error: 'Failed to connect to AI server.' } }));
        } finally {
            setLoading(prev => ({ ...prev, [q.n]: false }));
        }
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'white', display: 'flex', flexDirection: 'column', zIndex: 9999 }}>
            {/* Header */}
            <div style={{ flexShrink: 0, padding: '12px 25px', borderBottom: '2px solid var(--lime-primary)', display: 'flex', alignItems: 'center', gap: '20px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.08)' }}>
                <button onClick={onBack} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 700 }}>← Back to Papers</button>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-playfair)', color: 'var(--lime-dark)' }}>{paper.title}</h3>
            </div>

            {/* Split screen */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f5f5f5' }}>
                {/* PDF */}
                <div style={{ flex: 6, height: '100%', borderRight: '1px solid #ddd' }}>
                    <iframe src={`/${paper.pdf}#toolbar=0&navpanes=0&scrollbar=0`} style={{ width: '100%', height: '100%', border: 'none' }} title="General Paper PDF" />
                </div>

                {/* Questions */}
                <div style={{ flex: 4, height: '100%', overflowY: 'auto', padding: '20px', background: 'white' }}>
                    <h4 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--lime-dark)', marginTop: 0, marginBottom: '20px' }}>
                        Essay Questions — Choose any one
                    </h4>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.6 }}>
                        Write your essay (600–700 words) then submit for AI marking out of 30.
                    </p>

                    {paper.questions.map(q => (
                        <div key={q.n} style={{ background: '#fafafa', borderRadius: '12px', padding: '18px', marginBottom: '15px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 800, color: 'var(--lime-dark)' }}>Q{q.n}</span>
                                <span style={{ background: 'var(--lime-light)', color: 'var(--lime-dark)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                                    [30 marks]
                                </span>
                            </div>
                            <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>{q.t}</p>

                            {!submitted[q.n] ? (
                                <>
                                    <textarea
                                        rows={8}
                                        placeholder="Write your essay here... (600–700 words)"
                                        value={answers[q.n] || ''}
                                        onChange={e => setAnswers(prev => ({ ...prev, [q.n]: e.target.value }))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', marginBottom: '10px' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#aaa' }}>
                                            {(answers[q.n] || '').split(' ').filter(Boolean).length} words
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleSubmit(q)}
                                        disabled={loading[q.n]}
                                        style={{ background: loading[q.n] ? '#ccc' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: loading[q.n] ? 'not-allowed' : 'pointer', fontWeight: 700, width: '100%' }}
                                    >
                                        {loading[q.n] ? 'AI is marking...' : '🤖 Submit for AI Marking'}
                                    </button>
                                </>
                            ) : (
                                <FeedbackPanel result={results[q.n]} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeedbackPanel({ result }) {
    const [showModel, setShowModel] = useState(false);
    if (!result) return null;
    if (result.error) return <p style={{ color: 'red', fontSize: '0.9rem' }}>{result.error}</p>;

    return (
        <div>
            <div style={{ background: 'var(--lime-light)', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, color: 'var(--lime-dark)', fontSize: '1.1rem' }}>Score: {result.score ?? '?'} / 30</span>
            </div>
            {result.feedback && (
                <div style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '12px' }}>
                    {result.feedback}
                </div>
            )}
            {result.modelAnswer && (
                <>
                    <button onClick={() => setShowModel(v => !v)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 700, width: '100%', marginBottom: '8px' }}>
                        {showModel ? '▲ Hide Model Answer' : '▼ Show Model Answer'}
                    </button>
                    {showModel && (
                        <div style={{ fontSize: '0.87rem', color: '#334155', lineHeight: 1.8, background: '#f8fafc', borderRadius: '8px', padding: '14px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap' }}>
                            {result.modelAnswer}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
