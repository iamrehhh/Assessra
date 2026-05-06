'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function PaperView({ paperId, paperData, onBack }) {
    const paper = paperData[paperId];
    const { data: session } = useSession();
    const [submitted, setSubmitted] = useState({});
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState({});
    const [results, setResults] = useState({});

    if (!paper) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
                <p>Paper not found.</p>
                <button className="submit-btn" style={{ width: 'auto', padding: '10px 30px' }} onClick={onBack}>Go Back</button>
            </div>
        );
    }

    async function handleSubmit(q) {
        const answer = answers[q.n];
        if (!answer || !answer.trim()) return;

        setLoading((prev) => ({ ...prev, [q.n]: true }));

        try {
            const res = await fetch('/api/mark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: q.t,
                    marks: q.m,
                    answer: answer.trim(),
                    paperTitle: paper.title,
                }),
            });
            const data = await res.json();
            setResults((prev) => ({ ...prev, [q.n]: data }));
            setSubmitted((prev) => ({ ...prev, [q.n]: true }));
            // Silently save score to MongoDB
            if (data.score !== undefined && session?.user?.name) {
                const subjectGuess = paperId.includes('econ') ? 'economics-p4' : paperId.includes('_4') ? 'business-p4' : 'business-p3';
                fetch('/api/scores/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: session.user.name, paperId, paperTitle: paper.title, subject: subjectGuess, questionNumber: q.n, score: data.score, maxMarks: q.m }),
                }).catch(() => { });
            }
        } catch {
            setResults((prev) => ({ ...prev, [q.n]: { error: 'Failed to connect to server.' } }));
        } finally {
            setLoading((prev) => ({ ...prev, [q.n]: false }));
        }
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'white',
            display: 'flex', flexDirection: 'column', zIndex: 9999,
        }}>
            {/* Header */}
            <div style={{
                flexShrink: 0, padding: '12px 25px',
                borderBottom: '2px solid var(--lime-primary)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.08)', background: 'white',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={onBack}
                        style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 700 }}
                    >
                        ← Back to Papers
                    </button>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-playfair)', color: 'var(--lime-dark)' }}>
                        {paper.title}
                    </h3>
                </div>
            </div>

            {/* Body: split screen */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f5f5f5' }}>
                {/* Left: PDF */}
                <div style={{ flex: 6, height: '100%', position: 'relative', borderRight: '1px solid #ddd' }}>
                    <iframe
                        src={`/${paper.pdf}#toolbar=0&navpanes=0&scrollbar=0`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Paper PDF"
                    />
                </div>

                {/* Right: Questions */}
                <div style={{ flex: 4, height: '100%', overflowY: 'auto', padding: '20px', background: 'white' }}>
                    <h4 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--lime-dark)', marginBottom: '20px' }}>
                        Questions
                    </h4>

                    {paper.questions.map((q) => (
                        <QuestionCard
                            key={q.n}
                            q={q}
                            answer={answers[q.n] || ''}
                            onAnswerChange={(val) => setAnswers((prev) => ({ ...prev, [q.n]: val }))}
                            onSubmit={() => handleSubmit(q)}
                            isLoading={loading[q.n]}
                            isSubmitted={submitted[q.n]}
                            result={results[q.n]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function QuestionCard({ q, answer, onAnswerChange, onSubmit, isLoading, isSubmitted, result }) {
    const isCalc = q.m <= 4 && !q.l;

    return (
        <div style={{
            background: '#fafafa', borderRadius: '12px', padding: '18px',
            marginBottom: '15px', border: '1px solid #eee',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, color: 'var(--lime-dark)' }}>Q{q.n}</span>
                <span style={{
                    background: 'var(--lime-light)', color: 'var(--lime-dark)',
                    padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                }}>
                    [{q.m} marks]
                </span>
            </div>

            <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>{q.t}</p>

            {q.l && (
                <p style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '8px' }}>
                    Suggested length: {q.l} words
                </p>
            )}

            {!isSubmitted ? (
                <>
                    {isCalc ? (
                        <input
                            type="text"
                            placeholder="Enter your answer..."
                            value={answer}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', fontFamily: 'inherit', marginBottom: '10px' }}
                        />
                    ) : (
                        <textarea
                            rows={5}
                            placeholder={`Write your answer here... (${q.l || ''} words)`}
                            value={answer}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', marginBottom: '10px' }}
                        />
                    )}
                    <button
                        onClick={onSubmit}
                        disabled={isLoading}
                        style={{
                            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                            color: 'white', border: 'none', padding: '10px 20px',
                            borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: 700, width: '100%',
                        }}
                    >
                        {isLoading ? 'AI is marking...' : '🤖 Submit for AI Marking'}
                    </button>
                </>
            ) : (
                <FeedbackPanel result={result} q={q} />
            )}
        </div>
    );
}

function FeedbackPanel({ result, q }) {
    if (!result) return null;
    if (result.error) return <p style={{ color: 'red', fontSize: '0.9rem' }}>{result.error}</p>;

    return (
        <div style={{ marginTop: '8px' }}>
            <div style={{
                background: 'var(--lime-light)', borderRadius: '8px', padding: '12px',
                marginBottom: '10px', display: 'flex', gap: '15px', fontWeight: 700,
            }}>
                <span style={{ color: 'var(--lime-dark)' }}>
                    Score: {result.score ?? '?'} / {q.m}
                </span>
            </div>
            {result.feedback && (
                <div style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {result.feedback}
                </div>
            )}
        </div>
    );
}
