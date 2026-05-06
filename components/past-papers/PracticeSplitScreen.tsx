'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── Timer durations (seconds) by subject + paper ────────────────
const TIMER_DURATIONS = {
    'economics_p3': 75 * 60,
    'economics_p4': 120 * 60,
    'business_p3': 105 * 60,
    'business_p4': 75 * 60,
    'general_paper_p1': 75 * 60,
    'general_paper_p2': 105 * 60
};

function getTimerDuration(paperId, meta) {
    const idParts = (paperId || '').split('_');
    const variant = idParts[idParts.length - 1];
    const paperNum = variant ? variant[0] : null;
    const subject = meta?.subject || '';
    if (subject && paperNum) {
        const key = `${subject}_p${paperNum}`;
        if (TIMER_DURATIONS[key]) return TIMER_DURATIONS[key];
    }
    return null;
}

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PracticeSplitScreen({ paperId, backHash }) {
    const router = useRouter();
    const filename = decodeURIComponent(paperId);
    const exitHash = backHash || '#pastpapers';

    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [showInsert, setShowInsert] = useState(false);
    const [insertFilename, setInsertFilename] = useState(null);

    const [blocks, setBlocks] = useState([
        { id: Date.now().toString(), label: 'Q1', questionText: '', marks: 0, answer: '', status: 'idle', feedback: null, prefilled: false }
    ]);

    // Track whether blocks have been initialized from API/localStorage
    // to avoid saving an empty default block over real saved progress
    const [blocksInitialized, setBlocksInitialized] = useState(false);

    const [paperMeta, setPaperMeta] = useState(null);

    const [timerDuration, setTimerDuration] = useState(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerVisible, setTimerVisible] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch(`/api/past-papers/info?filename=${filename}`);
                const data = await res.json();

                if (res.ok) {
                    setPdfUrl(data.pdfUrl || '');
                    if (data.insertFilename) {
                        setInsertFilename(data.insertFilename);
                    }
                    if (data.meta) {
                        setPaperMeta(data.meta);
                        const dur = getTimerDuration(filename, data.meta);
                        if (dur) {
                            setTimerDuration(dur);
                            setTimerSeconds(dur);
                        }
                    }

                    // Try to load from localStorage first
                    const savedProgress = localStorage.getItem(`assessra_paper_blocks_${filename}`);
                    if (savedProgress) {
                        try {
                            const parsedBlocks = JSON.parse(savedProgress);
                            if (Array.isArray(parsedBlocks) && parsedBlocks.length > 0) {
                                setBlocks(parsedBlocks);
                                setBlocksInitialized(true);
                                setLoading(false);
                                return;
                            }
                        } catch (err) {
                            console.error('Failed to parse saved progress', err);
                        }
                    }

                    // No saved progress — use API questions if available
                    if (data.questions && data.questions.length > 0) {
                        const newBlocks = data.questions.map((q, idx) => ({
                            id: Date.now().toString() + idx,
                            label: q.n || `Q${idx + 1}`,
                            questionText: q.t || '',
                            marks: q.m || 0,
                            answer: '',
                            status: 'idle',
                            feedback: null,
                            prefilled: true
                        }));
                        setBlocks(newBlocks);
                    }
                    // If no questions from API either, the default single empty block remains
                }
            } catch (e) {
                console.error('Error fetching paper info:', e);
            }

            setBlocksInitialized(true);
            setLoading(false);
        };
        init();
    }, [filename]);

    // Auto-save blocks to localStorage — but only after full initialization
    // to prevent overwriting real progress with the default empty block
    useEffect(() => {
        if (!blocksInitialized || loading) return;
        // Only save if we have meaningful content (at least one block with a label)
        if (blocks.length > 0) {
            localStorage.setItem(`assessra_paper_blocks_${filename}`, JSON.stringify(blocks));
        }
    }, [blocks, filename, blocksInitialized, loading]);

    // Timer tick effect
    useEffect(() => {
        if (timerRunning && timerSeconds > 0) {
            timerRef.current = setInterval(() => {
                setTimerSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [timerRunning]);

    const toggleTimer = useCallback(() => {
        if (timerSeconds <= 0) return;
        setTimerRunning(prev => !prev);
    }, [timerSeconds]);

    const resetTimer = useCallback(() => {
        setTimerRunning(false);
        clearInterval(timerRef.current);
        setTimerSeconds(timerDuration || 0);
    }, [timerDuration]);

    const addBlock = () => {
        const nextNum = blocks.length + 1;
        setBlocks([...blocks, { id: Date.now().toString(), label: `Q${nextNum}`, questionText: '', marks: 0, answer: '', status: 'idle', feedback: null, prefilled: false }]);
    };

    const updateBlock = (id, field, value) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const removeBlock = (id) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const handleSubmit = async (id) => {
        const block = blocks.find(b => b.id === id);
        if (!block || !block.answer.trim()) return;

        updateBlock(id, 'status', 'evaluating');

        try {
            const subject = paperMeta?.subject || 'unknown';
            const level = paperMeta?.level || 'alevel';
            const year = paperMeta?.year || '2025';

            const res = await fetch('/api/ai/grade-past-paper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    level,
                    year,
                    questionLabel: block.label,
                    questionText: block.questionText,
                    totalMarks: block.marks,
                    studentAnswer: block.answer
                })
            });

            const resultData = await res.json();
            if (!res.ok) throw new Error(resultData.error || 'Evaluation failed');

            updateBlock(id, 'feedback', resultData);
            updateBlock(id, 'status', 'done');

            let parsedScore = 0;
            if (resultData.score) {
                const match = String(resultData.score).match(/(\d+)/);
                if (match) parsedScore = parseInt(match[1]);
            }

            fetch('/api/scores/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paperId: filename,
                    paperTitle: `${subject} ${level} ${year} ${block.label}`,
                    subject: subject,
                    questionNumber: block.label,
                    score: parsedScore,
                    maxMarks: Math.max(1, block.marks),
                })
            }).catch(() => { });
        } catch (err) {
            console.error('Submit error:', err);
            updateBlock(id, 'status', 'idle');
            alert('Error evaluating answer: ' + err.message);
        }
    };

    const timerProgress = timerDuration ? (timerSeconds / timerDuration) : 0;
    const timerUrgent = timerDuration && timerSeconds < timerDuration * 0.1;
    const timerWarning = timerDuration && timerSeconds < timerDuration * 0.25;

    const isFullWidthMode = filename.includes('general_paper') || filename.startsWith('gp_');

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-base text-text-main">
                <div className="w-8 h-8 border-4 border-border-main border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-bg-base text-text-main font-display overflow-hidden">
            <div className="flex w-full h-full pb-0 pt-0">

                {/* Left Panel: PDF Viewer */}
                {!isFullWidthMode && (
                    <div className="w-1/2 h-full flex flex-col border-r border-border-main bg-bg-card dark:bg-[#1e1e1e]">
                        <div className="h-14 bg-bg-base border-b border-border-main flex items-center justify-between px-4 shrink-0">
                            <button onClick={() => {
                                window.location.hash = exitHash.replace('#', '');
                                router.push('/');
                            }} className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors text-sm font-bold">
                                <span className="material-symbols-outlined text-base">arrow_back</span>
                                Back to Papers
                            </button>

                            {insertFilename && (
                                <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1 border border-border-main">
                                    <button
                                        onClick={() => setShowInsert(false)}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!showInsert ? 'bg-primary text-background-dark shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                    >
                                        Paper
                                    </button>
                                    <button
                                        onClick={() => setShowInsert(true)}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${showInsert ? 'bg-primary text-background-dark shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                    >
                                        Insert
                                    </button>
                                </div>
                            )}
                            <div className="w-16"></div>
                        </div>

                        <div className="flex-1 w-full bg-[#323639]">
                            <iframe
                                src={(showInsert && insertFilename ? pdfUrl.replace(filename, insertFilename) : pdfUrl) + '#toolbar=0&navpanes=0&scrollbar=0'}
                                className="w-full h-full border-none"
                                title="PDF Viewer"
                            />
                        </div>
                    </div>
                )}

                {/* Right Panel: Workspace */}
                <div className={`${isFullWidthMode ? 'w-full max-w-5xl mx-auto border-x border-border-main' : 'w-1/2'} h-full flex flex-col overflow-y-auto bg-bg-base relative`}>
                    <div className="h-14 border-b border-border-main sticky top-0 bg-bg-base/80 backdrop-blur-md z-10 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-4">
                            {isFullWidthMode && (
                                <button onClick={() => {
                                    window.location.hash = exitHash.replace('#', '');
                                    router.push('/');
                                }} className="flex items-center gap-1 text-text-muted hover:text-text-main transition-colors text-sm font-bold border-r border-border-main pr-4">
                                    <span className="material-symbols-outlined text-base">arrow_back</span>
                                    Back to Papers
                                </button>
                            )}
                            <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                                <span className="text-primary material-symbols-outlined text-xl">edit_square</span>
                                Practice Workspace
                            </h2>
                        </div>

                        {/* Timer Toggle Button */}
                        {timerDuration && !timerVisible && (
                            <button
                                onClick={() => setTimerVisible(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border-main text-text-muted hover:text-text-main hover:border-border-main transition-all text-xs font-bold"
                            >
                                <span className="material-symbols-outlined text-sm">timer</span>
                                Start Timer
                            </button>
                        )}

                        {/* Active Timer Display */}
                        {timerDuration && timerVisible && (
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${timerSeconds === 0 ? 'bg-red-500/20 border-red-500/30' :
                                timerUrgent ? 'bg-red-500/10 border-red-500/30 animate-pulse' :
                                    timerWarning ? 'bg-amber-500/10 border-amber-500/20' :
                                        'bg-black/5 dark:bg-white/5 border-border-main'
                                }`}>
                                <span className={`text-sm font-mono font-black tracking-wider ${timerSeconds === 0 ? 'text-red-400' :
                                    timerUrgent ? 'text-red-400' :
                                        timerWarning ? 'text-amber-400' :
                                            'text-text-main'
                                    }`}>
                                    {formatTime(timerSeconds)}
                                </span>

                                <button
                                    onClick={toggleTimer}
                                    disabled={timerSeconds === 0}
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${timerSeconds === 0
                                        ? 'text-slate-600 cursor-not-allowed'
                                        : timerRunning
                                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                            : 'bg-primary/20 text-primary hover:bg-primary/30'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-base">
                                        {timerRunning ? 'pause' : 'play_arrow'}
                                    </span>
                                </button>

                                <button
                                    onClick={resetTimer}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text-main hover:bg-black/10 dark:bg-white/10 transition-all"
                                    title="Reset timer"
                                >
                                    <span className="material-symbols-outlined text-base">restart_alt</span>
                                </button>

                                <button
                                    onClick={() => { setTimerVisible(false); setTimerRunning(false); clearInterval(timerRef.current); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text-main hover:bg-black/10 dark:bg-white/10 transition-all"
                                    title="Hide timer"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8 space-y-8 pb-32">
                        {blocks.map((block, index) => (
                            <div key={block.id} className="bg-bg-card dark:bg-[#18181b] rounded-3xl p-6 border border-border-main shadow-[var(--shadow-elevated)] dark:shadow-2xl space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-text-main w-24">
                                        {block.prefilled ? (
                                            <span>{block.label}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                value={block.label}
                                                onChange={(e) => updateBlock(block.id, 'label', e.target.value)}
                                                className="bg-transparent focus:outline-none w-full placeholder-slate-600"
                                                placeholder="e.g. 1a"
                                            />
                                        )}
                                    </h3>

                                    <div className="flex items-center justify-center bg-primary rounded-full px-4 py-1 flex-1 max-w-fit mx-auto shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                                        {block.prefilled ? (
                                            <span className="text-xs font-bold text-background-dark px-1">{block.marks}</span>
                                        ) : (
                                            <input
                                                type="number"
                                                value={block.marks || ''}
                                                onChange={(e) => updateBlock(block.id, 'marks', parseInt(e.target.value) || 0)}
                                                className="bg-transparent text-xs font-bold text-background-dark text-center focus:outline-none w-6"
                                                placeholder="0"
                                            />
                                        )}
                                        <span className="text-xs font-bold text-background-dark pr-1">Marks</span>
                                    </div>

                                    <div className="w-24 flex justify-end">
                                        {!block.prefilled && blocks.length > 1 && (
                                            <button onClick={() => removeBlock(block.id)} className="text-text-muted hover:text-text-main transition-colors">
                                                <span className="material-symbols-outlined text-xl">close</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className={`border rounded-xl p-4 min-h-[60px] ${block.prefilled ? 'border-border-main bg-black/[0.02] dark:bg-white/[0.02]' : 'border-border-main dark:border-white/80'}`}>
                                    {block.prefilled ? (
                                        <p className="text-text-main font-bold leading-relaxed text-sm">
                                            {block.questionText}
                                        </p>
                                    ) : (
                                        <textarea
                                            value={block.questionText}
                                            onChange={(e) => updateBlock(block.id, 'questionText', e.target.value)}
                                            rows={3}
                                            placeholder="Paste or type the exact question text here..."
                                            className="w-full bg-transparent text-text-main font-bold placeholder-text-muted/50 focus:outline-none resize-y leading-relaxed"
                                        />
                                    )}
                                </div>

                                <div className="border border-primary rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all relative">
                                    <textarea
                                        value={block.answer}
                                        onChange={(e) => updateBlock(block.id, 'answer', e.target.value)}
                                        rows={8}
                                        placeholder={`Type your answer for ${block.label || '1'} here...`}
                                        className="w-full bg-transparent px-5 py-4 pb-8 text-text-main placeholder-slate-500/80 focus:outline-none resize-y min-h-[200px]"
                                        disabled={block.status === 'evaluating' || block.status === 'done'}
                                    />
                                    <div className="absolute bottom-2 right-4 text-xs font-bold text-text-muted/60 bg-bg-card/80 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
                                        {block.answer.trim().split(/\s+/).filter(w => w.length > 0).length} words
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {block.status !== 'done' && (
                                        <button
                                            onClick={() => handleSubmit(block.id)}
                                            disabled={block.status === 'evaluating' || !block.answer.trim()}
                                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${block.status === 'evaluating' || !block.answer.trim()
                                                ? 'bg-bg-base dark:bg-[#18181b] text-text-muted cursor-not-allowed border border-border-main'
                                                : 'bg-black/[0.03] dark:bg-[#27272a] text-text-muted hover:bg-black/[0.06] dark:hover:bg-[#3f3f46] hover:text-text-main border border-border-main'
                                                }`}
                                        >
                                            {block.status === 'evaluating' ? (
                                                <><div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" /> Strict Marking...</>
                                            ) : (
                                                <><span className="material-symbols-outlined text-sm">fact_check</span> Submit for Strict Marking</>
                                            )}
                                        </button>
                                    )}

                                    {block.status === 'done' && block.feedback && (
                                        <button
                                            onClick={() => {
                                                window.dispatchEvent(new CustomEvent('open-feedback-modal', { detail: block }));
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border border-primary text-primary hover:bg-primary/10 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">bar_chart</span>
                                            View AI Feedback
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addBlock}
                            className="w-full py-4 rounded-3xl border-2 border-dashed border-border-main text-text-muted hover:text-text-main hover:border-white/30 hover:bg-black/5 dark:bg-white/5 transition-all flex items-center justify-center gap-2 font-bold mb-12"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add Empty Answer Block
                        </button>
                    </div>
                </div>
            </div >

            <FeedbackModal />
        </div >
    );
}

function FeedbackModal() {
    const [block, setBlock] = useState(null);

    useEffect(() => {
        const handleOpen = (e) => setBlock(e.detail);
        window.addEventListener('open-feedback-modal', handleOpen);
        return () => window.removeEventListener('open-feedback-modal', handleOpen);
    }, []);

    if (!block || !block.feedback) return null;

    const { feedback } = block;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-bg-card dark:bg-[#1e293b] w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-border-main animate-slide-up">

                <div className="px-6 py-4 border-b border-border-main flex items-center justify-between shrink-0 bg-black/5 dark:bg-white/5">
                    <div>
                        <h2 className="text-xl font-black text-text-main">{block.label} Feedback</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">
                                Score: {feedback.score}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => setBlock(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 dark:bg-white/10 text-text-muted hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">fact_check</span> Requirements Met
                        </h3>
                        <div className="bg-black/5 dark:bg-white/5 border border-border-main rounded-2xl p-4 text-text-muted text-sm whitespace-pre-wrap leading-relaxed">
                            {feedback.breakdown || "No breakdown provided."}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">campaign</span> Examiner Feedback
                        </h3>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-amber-700 dark:text-amber-200/90 text-sm whitespace-pre-wrap leading-relaxed">
                            {feedback.feedback || "No feedback provided."}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">workspace_premium</span> Model Answer
                        </h3>
                        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-text-main text-sm whitespace-pre-wrap leading-relaxed">
                            {feedback.modelAnswer || "No model answer provided."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
