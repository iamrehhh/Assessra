'use client';

import { useState, useEffect, useRef } from 'react';
import { useConfirm } from '@/components/ConfirmContext';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';

const ANSWERS_KEY = (id) => `mcq_answers_${id}`;
const MARKED_KEY = (id) => `mcq_marked_${id}`;

export default function MCQView({ paperId, paperData, onBack }) {
    const confirmDialog = useConfirm();
    const paper = paperData[paperId];
    const { data: session, status: sessionStatus } = useSession();

    const savedAnswers = (() => {
        if (typeof window === 'undefined') return {};
        try {
            const raw = localStorage.getItem(ANSWERS_KEY(paperId));
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    })();

    const savedMarked = (() => {
        if (typeof window === 'undefined') return {};
        try {
            const raw = localStorage.getItem(MARKED_KEY(paperId));
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    })();

    const [answers, setAnswers] = useState(savedAnswers);
    const [markedForReview, setMarkedForReview] = useState(savedMarked);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [timeLeft, setTimeLeft] = useState(75 * 60);
    const [loadingAttempt, setLoadingAttempt] = useState(true);
    const timerRef = useRef(null);

    // Fetch existing attempt
    useEffect(() => {
        if (sessionStatus !== 'authenticated' || !session?.user?.email) {
            setLoadingAttempt(false);
            return;
        }
        fetch(`/api/mcq-attempts?paperId=${encodeURIComponent(paperId)}`)
            .then(r => r.json())
            .then(data => {
                if (data.found) {
                    if (data.userAnswers && typeof data.userAnswers === 'object') setAnswers(data.userAnswers);
                    setSubmitted(true);
                    setScore(data.score);
                    setTimeLeft(0);
                }
            })
            .catch(err => console.error('Failed to load MCQ attempt:', err))
            .finally(() => setLoadingAttempt(false));
    }, [paperId, sessionStatus]);

    // Timer — only starts AFTER loading is complete and not already submitted
    // Using a separate effect with loadingAttempt as dependency prevents the race condition
    useEffect(() => {
        // Do not start timer until loading is done
        if (loadingAttempt) return;
        // Do not start if already submitted
        if (submitted) {
            clearInterval(timerRef.current);
            return;
        }

        // Clear any existing timer before starting a fresh one
        clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [submitted, loadingAttempt]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loadingAttempt) return (
        <div className="flex items-center justify-center h-screen flex-col gap-4 text-text-muted">
            <div className="w-8 h-8 border-4 border-border-main border-t-primary rounded-full animate-spin" />
            <p>Loading your attempt...</p>
        </div>
    );

    if (!paper) return (
        <div className="flex items-center justify-center h-screen flex-col gap-4">
            <p className="text-text-muted">Paper not found.</p>
            <button onClick={onBack} className="px-6 py-2 bg-primary text-white rounded-lg font-bold">Go Back</button>
        </div>
    );

    function handleAnswer(qIdx, letter) {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qIdx]: letter }));
    }

    const handleToggleMark = (qIdx) => {
        if (submitted) return;
        setMarkedForReview(prev => {
            const next = { ...prev };
            if (next[qIdx]) delete next[qIdx];
            else next[qIdx] = true;
            try { localStorage.setItem(MARKED_KEY(paperId), JSON.stringify(next)); } catch { }
            return next;
        });
    };

    const handleSubmit = async (auto = false) => {
        if (submitted) return;
        if (!auto) {
            const ok = await confirmDialog('Submit Answers', 'Are you ready to submit your answers for grading?');
            if (!ok) return;
        }
        clearInterval(timerRef.current);
        const ansList = paper.answers || [];
        const totalQ = ansList.length || (paper.questions?.length ?? 0);
        let correct = null;
        if (ansList.length > 0) {
            correct = 0;
            ansList.forEach((ans, i) => { if (answers[i] === ans) correct++; });
            setScore(correct);
        }
        setSubmitted(true);
        try { localStorage.setItem(ANSWERS_KEY(paperId), JSON.stringify(answers)); } catch { }
        if (session?.user?.email) {
            fetch('/api/scores/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: session.user.email,
                    paperId,
                    paperTitle: `Economics MCQ — ${paperId}`,
                    subject: 'economics-p3',
                    questionNumber: 'all',
                    score: correct ?? 0,
                    maxMarks: Math.max(1, totalQ),
                    userAnswers: answers,
                }),
            }).catch(err => console.error('Score save error:', err));
        }
    };

    const handleReset = async () => {
        const ok = await confirmDialog('Reset Attempt', 'Reset? Your score and answers will be erased.');
        if (!ok) return;
        try { localStorage.removeItem(ANSWERS_KEY(paperId)); } catch { }
        try { localStorage.removeItem(MARKED_KEY(paperId)); } catch { }
        try { await fetch(`/api/mcq-attempts?paperId=${encodeURIComponent(paperId)}`, { method: 'DELETE' }); } catch { }
        setAnswers({});
        setMarkedForReview({});
        setSubmitted(false);
        setScore(null);
        setTimeLeft(75 * 60);
    };

    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    const timerStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const ansList = paper.answers || [];
    const items = paper.questions || ansList.map((_, idx) => ({ n: idx + 1, t: null }));
    const totalQ = items.length;
    const attemptedCount = Object.keys(answers).length;

    return (
        <div className="flex flex-col h-screen bg-bg-base text-text-main font-display overflow-hidden fixed inset-0 z-[9999]">
            {/* Header */}
            <div className="h-14 bg-bg-base border-b border-border-main flex items-center justify-between px-6 shrink-0 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-text-main text-sm font-bold bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-border-main hover:bg-black/10 cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span> Exit
                    </button>
                    <h3 className="m-0 font-bold text-primary text-lg flex items-center gap-3">
                        {paper.title || 'Economics P3 — MCQ'}
                        {!submitted && totalQ > 0 && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">checklist</span>
                                {attemptedCount} / {totalQ} Attempted
                            </span>
                        )}
                    </h3>
                </div>
                <div className={`flex items-center gap-2 text-xl font-bold font-mono ${submitted ? 'text-green-500' : timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-text-main'}`}>
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {submitted
                        ? ansList.length > 0 ? `✓ ${score}/${ansList.length}` : '✓ Finished'
                        : timerStr}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left: PDF viewer */}
                <div className="flex-[5.5] h-full border-r border-border-main bg-[#323639]">
                    <iframe
                        src={encodeURI(`/${paper.pdf}#toolbar=0&navpanes=0&scrollbar=0`)}
                        className="w-full h-full border-none"
                        title="PDF Viewer"
                    />
                </div>

                {/* Right: Answer sheet */}
                <div className="flex-[4.5] h-full overflow-y-auto p-6 bg-bg-card dark:bg-[#1e1e1e]">

                    {/* Score banner */}
                    {submitted && score !== null && (
                        <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-2xl mb-6">
                            <div className="text-4xl font-black text-green-400 mb-1">
                                {Math.round((score / Math.max(1, ansList.length)) * 100)}%
                            </div>
                            <div className="text-lg text-text-muted font-bold">Score: {score} / {ansList.length}</div>
                            <button onClick={handleReset} className="mt-4 px-5 py-2 text-sm font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-xl hover:bg-orange-500/20 cursor-pointer flex items-center gap-2 mx-auto transition-colors">
                                <span className="material-symbols-outlined text-base">restart_alt</span>
                                Reset & Re-attempt
                            </button>
                        </div>
                    )}

                    {submitted && !ansList.length && (
                        <div className="text-center p-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl mb-6">
                            <div className="text-2xl font-black text-purple-400 mb-2">Practice Submitted</div>
                            <div className="text-sm text-purple-400/80">No official marking scheme available.</div>
                            <button onClick={handleReset} className="mt-4 px-5 py-2 text-sm font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-xl hover:bg-orange-500/20 cursor-pointer flex items-center gap-2 mx-auto transition-colors">
                                <span className="material-symbols-outlined text-base">restart_alt</span>
                                Reset & Re-attempt
                            </button>
                        </div>
                    )}

                    <h4 className="font-bold text-text-main border-b border-border-main pb-3 mt-0 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">checklist</span> Answer Sheet
                    </h4>

                    <div className="flex flex-col gap-3">
                        {items.map((qItem, i) => {
                            const correctAns = ansList[i];
                            const userAns = answers[i];
                            const isCorrect = correctAns ? userAns === correctAns : false;
                            const isMarked = !submitted && markedForReview[i];

                            return (
                                <div key={i} className={`flex flex-col p-4 rounded-xl border transition-all duration-300 ${submitted && correctAns
                                    ? isCorrect
                                        ? 'border-green-500/40 bg-green-500/5'
                                        : 'border-red-500/40 bg-red-500/5'
                                    : isMarked
                                        ? 'border-orange-500/50 bg-orange-500/5'
                                        : 'border-border-main bg-black/5 dark:bg-white/5'
                                    }`}>
                                    {/* Question text (if stored) */}
                                    {qItem.t && (
                                        <div className="text-text-main mb-3 text-sm leading-relaxed border-b border-border-main pb-3 flex justify-between items-start gap-3">
                                            <div>
                                                <span className="font-bold text-primary mr-2">Q{qItem.n || i + 1}.</span>
                                                {qItem.t}
                                            </div>
                                            {!submitted && (
                                                <button onClick={(e) => { e.stopPropagation(); handleToggleMark(i); }} className={`shrink-0 hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center ${isMarked ? 'text-orange-500' : 'text-text-muted hover:text-text-main'}`} title="Mark for review">
                                                    <span className="material-symbols-outlined text-xl">{isMarked ? 'bookmark' : 'bookmark_border'}</span>
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap">
                                        {!qItem.t && (
                                            <div className="w-12 flex flex-col items-center justify-center gap-2 shrink-0 border-r border-border-main/50 pr-2 mr-1">
                                                <div className="font-bold text-text-muted text-sm">
                                                    Q{qItem.n || i + 1}
                                                </div>
                                                {!submitted && (
                                                    <button onClick={(e) => { e.stopPropagation(); handleToggleMark(i); }} className={`hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center ${isMarked ? 'text-orange-500' : 'text-text-muted hover:text-text-main'}`} title="Mark for review">
                                                        <span className="material-symbols-outlined text-lg">{isMarked ? 'bookmark' : 'bookmark_border'}</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* A B C D buttons */}
                                        <div className="flex gap-2 flex-1 justify-around">
                                            {['A', 'B', 'C', 'D'].map(letter => {
                                                let cls = 'bg-black/5 dark:bg-white/5 border-border-main text-text-muted hover:border-primary/50 hover:bg-black/10';
                                                if (!submitted && userAns === letter) cls = 'bg-primary border-primary text-white';
                                                if (submitted && correctAns && letter === correctAns) cls = 'bg-green-500 border-green-500 text-white';
                                                if (submitted && correctAns && userAns === letter && userAns !== correctAns && letter !== correctAns) cls = 'bg-red-500 border-red-500 text-white';
                                                if (submitted && !correctAns && userAns === letter) cls = 'bg-primary/50 border-primary/50 text-white';
                                                return (
                                                    <button key={letter} onClick={() => handleAnswer(i, letter)}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold transition-all text-sm ${cls} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}>
                                                        {letter}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    {!submitted && (
                        <button onClick={() => handleSubmit()} className="mt-8 w-full p-4 bg-primary hover:bg-primary/90 text-white border-none rounded-xl font-black text-base cursor-pointer transition-colors shadow-lg mb-10 flex justify-center items-center gap-2">
                            <span className="material-symbols-outlined">send</span> Submit & Grade Test
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
