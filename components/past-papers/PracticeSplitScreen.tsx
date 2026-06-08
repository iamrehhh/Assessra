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

// ── Performance Optimized Block Component ──────────────────────────
// This prevents the entire PDF viewer and split screen from re-rendering on every keystroke
function QuestionBlock({ block, updateBlock, removeBlock, canRemove, handleSubmit }) {
    const [localAnswer, setLocalAnswer] = useState(block.answer);
    
    // Sync external changes (like initial load)
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    useEffect(() => {
        setLocalAnswer(block.answer);
    }, [block.id]); // Only run when ID changes, preventing loops

    // Debounce pushing up to parent
    const debounceTimeout = useRef(null);
    const handleAnswerChange = (e) => {
        const val = e.target.value;
        setLocalAnswer(val);
        
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            updateBlock(block.id, 'answer', val);
        }, 500);
    };

    return (
        <div className="bg-bg-card rounded-[2rem] p-6 md:p-8 border border-border-main shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl space-y-8 relative overflow-hidden transition-all duration-300 hover:border-primary/30 group">
            
            {/* Elegant Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/80 to-primary/20 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Question</span>
                        {block.prefilled ? (
                            <h3 className="text-3xl font-black text-text-main leading-none">{block.label}</h3>
                        ) : (
                            <input
                                type="text"
                                value={block.label}
                                onChange={(e) => updateBlock(block.id, 'label', e.target.value)}
                                className="bg-transparent focus:outline-none w-24 text-3xl font-black text-text-main placeholder-slate-600/50 leading-none"
                                placeholder="1a"
                            />
                        )}
                    </div>

                    <div className="h-8 w-px bg-border-main mx-2"></div>

                    <div className="flex items-center justify-center bg-black/5 dark:bg-[#0f172a] border border-border-main rounded-xl px-4 py-2 gap-1.5">
                        {block.prefilled ? (
                            <span className="text-sm font-black text-primary">{block.marks}</span>
                        ) : (
                            <input
                                type="number"
                                value={block.marks || ''}
                                onChange={(e) => updateBlock(block.id, 'marks', parseInt(e.target.value) || 0)}
                                className="bg-transparent text-sm font-black text-primary text-center focus:outline-none w-6"
                                placeholder="0"
                            />
                        )}
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Marks</span>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    {!block.prefilled && canRemove && (
                        <button onClick={() => removeBlock(block.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors">
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    )}
                </div>
            </div>

            <div className={`rounded-2xl p-5 min-h-[60px] ${block.prefilled ? 'bg-black/[0.02] dark:bg-white/[0.02] border border-border-main/50' : 'border border-border-main focus-within:border-primary/50 focus-within:bg-black/[0.02] dark:focus-within:bg-white/[0.02] transition-colors'}`}>
                {block.prefilled ? (
                    <p className="text-text-main font-bold leading-relaxed text-sm md:text-base">
                        {block.questionText}
                    </p>
                ) : (
                    <textarea
                        value={block.questionText}
                        onChange={(e) => updateBlock(block.id, 'questionText', e.target.value)}
                        rows={3}
                        placeholder="Paste or type the exact question text here..."
                        className="w-full bg-transparent text-text-main font-bold placeholder-text-muted/40 focus:outline-none resize-y leading-relaxed text-sm md:text-base"
                    />
                )}
            </div>

            <div className="relative rounded-2xl overflow-hidden group/textarea">
                {/* Premium glowing border on focus */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent opacity-0 group-focus-within/textarea:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm -z-10"></div>
                
                <div className="relative bg-bg-card border border-border-main rounded-2xl overflow-hidden z-10 transition-colors duration-300 group-focus-within/textarea:border-primary/50 group-focus-within/textarea:shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <div className="bg-black/5 dark:bg-[#0f172a] border-b border-border-main px-5 py-2.5 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">edit_note</span> Your Answer
                        </span>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded border border-border-main">
                            {localAnswer.trim().split(/\s+/).filter(w => w.length > 0).length} words
                        </div>
                    </div>
                    
                    <textarea
                        value={localAnswer}
                        onChange={handleAnswerChange}
                        rows={10}
                        placeholder={`Start writing your brilliant answer for ${block.label || '1'} here...`}
                        className="w-full bg-transparent px-6 py-5 text-text-main placeholder-slate-500/50 focus:outline-none resize-y min-h-[250px] leading-relaxed"
                        disabled={block.status === 'evaluating' || block.status === 'done'}
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-2">
                {block.status !== 'done' && (
                    <button
                        onClick={() => handleSubmit(block.id, localAnswer)}
                        disabled={block.status === 'evaluating' || !localAnswer.trim()}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.25rem] font-black uppercase tracking-wider text-xs transition-all duration-300 shadow-sm ${block.status === 'evaluating' || !localAnswer.trim()
                            ? 'bg-black/5 dark:bg-white/5 text-text-muted cursor-not-allowed border border-border-main'
                            : 'bg-primary text-background-dark hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(34,197,94,0.3)]'
                            }`}
                    >
                        {block.status === 'evaluating' ? (
                            <><div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" /> Marking in progress...</>
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
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.25rem] font-black uppercase tracking-wider text-xs border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-[1.02]"
                    >
                        <span className="material-symbols-outlined text-base">bar_chart</span>
                        View Detailed Feedback
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Main Layout ──────────────────────────────────────────────────
export default function PracticeSplitScreen({ paperId, backPath }) {
    const router = useRouter();
    const filename = decodeURIComponent(paperId);
    const exitPath = backPath || '/pastpapers';

    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [showInsert, setShowInsert] = useState(false);
    const [insertFilename, setInsertFilename] = useState(null);

    const [blocks, setBlocks] = useState([
        { id: Date.now().toString(), label: 'Q1', questionText: '', marks: 0, answer: '', status: 'idle', feedback: null, prefilled: false }
    ]);
    const [blocksInitialized, setBlocksInitialized] = useState(false);
    const [paperMeta, setPaperMeta] = useState(null);

    // Timer State
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
                    if (data.insertFilename) setInsertFilename(data.insertFilename);
                    if (data.meta) {
                        setPaperMeta(data.meta);
                        const dur = getTimerDuration(filename, data.meta);
                        if (dur) {
                            setTimerDuration(dur);
                            setTimerSeconds(dur);
                        }
                    }

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
                        } catch (err) { console.error('Failed to parse saved progress', err); }
                    }

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
                }
            } catch (e) {
                console.error('Error fetching paper info:', e);
            }

            setBlocksInitialized(true);
            setLoading(false);
        };
        init();
    }, [filename]);

    useEffect(() => {
        if (!blocksInitialized || loading) return;
        if (blocks.length > 0) {
            localStorage.setItem(`assessra_paper_blocks_${filename}`, JSON.stringify(blocks));
            
            const subjectStr = paperMeta?.subject || 'Paper';
            const levelStr = paperMeta?.level || '';
            const yearStr = paperMeta?.year || '';
            let title = `${subjectStr.charAt(0).toUpperCase() + subjectStr.slice(1)} ${levelStr.toUpperCase()} Practice`;
            if (yearStr) title += ` ${yearStr}`;
            
            localStorage.setItem('assessra_recent_activity', JSON.stringify({
                type: 'pastpaper',
                url: `/past-papers/practice/${filename}`,
                title: title,
                subject: subjectStr,
                updatedAt: Date.now()
            }));
        }
    }, [blocks, filename, blocksInitialized, loading, paperMeta]);

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
    }, [timerRunning, timerSeconds]);

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

    const updateBlock = useCallback((id, field, value) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    }, []);

    const removeBlock = useCallback((id) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
    }, []);

    const handleSubmit = async (id, finalAnswer) => {
        const block = blocks.find(b => b.id === id);
        if (!block || !finalAnswer.trim()) return;

        // Make sure we save the very latest answer before submitting
        updateBlock(id, 'answer', finalAnswer);
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
                    studentAnswer: finalAnswer
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

    const timerUrgent = timerDuration && timerSeconds < timerDuration * 0.1;
    const timerWarning = timerDuration && timerSeconds < timerDuration * 0.25;
    const isFullWidthMode = filename.includes('general_paper') || filename.startsWith('gp_');

    if (loading) {
        return (
            <div className="flex h-screen bg-bg-base overflow-hidden">
                <div className="w-1/2 h-full border-r border-border-main flex flex-col p-4 space-y-4">
                    <div className="h-12 w-32 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
                    <div className="flex-1 bg-black/5 dark:bg-white/5 rounded-3xl animate-pulse" />
                </div>
                <div className="w-1/2 h-full flex flex-col p-8 space-y-8">
                    <div className="h-12 w-64 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
                    <div className="h-64 rounded-[2rem] bg-black/5 dark:bg-white/5 animate-pulse" />
                    <div className="h-64 rounded-[2rem] bg-black/5 dark:bg-white/5 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-bg-base text-text-main font-display overflow-hidden selection:bg-primary/30 selection:text-text-main">
            
            {/* Elegant Floating Timer Widget */}
            {timerDuration && timerVisible && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-down">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                        timerSeconds === 0 ? 'bg-red-500/20 border-red-500/30' :
                        timerUrgent ? 'bg-red-500/10 border-red-500/30 animate-pulse' :
                        timerWarning ? 'bg-amber-500/10 border-amber-500/20' :
                        'bg-bg-card/80 border-border-main'
                    }`}>
                        <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/5 flex items-center justify-center border border-border-main">
                            <span className={`material-symbols-outlined text-sm ${timerSeconds === 0 || timerUrgent ? 'text-red-400' : 'text-text-main'}`}>timer</span>
                        </div>
                        <span className={`text-xl font-black tracking-wider w-[90px] text-center font-mono ${
                            timerSeconds === 0 || timerUrgent ? 'text-red-400' :
                            timerWarning ? 'text-amber-400' : 'text-text-main'
                        }`}>
                            {formatTime(timerSeconds)}
                        </span>
                        
                        <div className="w-px h-6 bg-border-main mx-1"></div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleTimer}
                                disabled={timerSeconds === 0}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                                    timerSeconds === 0 ? 'text-slate-600 cursor-not-allowed' : 
                                    timerRunning ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 
                                    'bg-primary/20 text-primary hover:bg-primary/30'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">{timerRunning ? 'pause' : 'play_arrow'}</span>
                            </button>
                            <button onClick={resetTimer} className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-sm">restart_alt</span>
                            </button>
                            <button onClick={() => { setTimerVisible(false); setTimerRunning(false); clearInterval(timerRef.current); }} className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex w-full h-full">

                {/* Left Panel: PDF Viewer */}
                {!isFullWidthMode && (
                    <div className="w-1/2 h-full flex flex-col border-r border-border-main bg-bg-card relative z-10 shadow-[10px_0_30px_rgba(0,0,0,0.05)]">
                        <div className="h-16 px-6 flex items-center justify-between shrink-0 bg-transparent relative z-20">
                            <button onClick={() => router.push(exitPath)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border-main text-text-muted hover:text-text-main transition-colors text-[11px] font-black uppercase tracking-wider shadow-sm">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Exit
                            </button>

                            {insertFilename && (
                                <div className="flex bg-black/5 dark:bg-[#0f172a] rounded-xl p-1 border border-border-main">
                                    <button
                                        onClick={() => setShowInsert(false)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${!showInsert ? 'bg-primary text-background-dark shadow-md' : 'text-text-muted hover:text-text-main'}`}
                                    >
                                        Source Paper
                                    </button>
                                    <button
                                        onClick={() => setShowInsert(true)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${showInsert ? 'bg-primary text-background-dark shadow-md' : 'text-text-muted hover:text-text-main'}`}
                                    >
                                        Insert
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 w-full bg-[#1e1e1e] rounded-tr-[2rem] overflow-hidden shadow-inner relative">
                            <iframe
                                src={(showInsert && insertFilename ? pdfUrl.replace(filename, insertFilename) : pdfUrl) + '#toolbar=0&navpanes=0&scrollbar=0'}
                                className="absolute inset-0 w-full h-full border-none"
                                title="PDF Viewer"
                            />
                        </div>
                    </div>
                )}

                {/* Right Panel: Workspace */}
                <div className={`${isFullWidthMode ? 'w-full max-w-5xl mx-auto border-x border-border-main' : 'w-1/2'} h-full flex flex-col overflow-y-auto bg-bg-base relative z-0 custom-scrollbar`}>
                    
                    <div className="sticky top-0 bg-gradient-to-b from-bg-base via-bg-base to-transparent h-24 z-20 pointer-events-none"></div>

                    <div className="px-6 md:px-10 -mt-16 relative z-10 flex items-center justify-between shrink-0 mb-8">
                        <div className="flex items-center gap-4">
                            {isFullWidthMode && (
                                <button onClick={() => router.push(exitPath)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border-main text-text-muted hover:text-text-main transition-colors text-[11px] font-black uppercase tracking-wider shadow-sm">
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    Exit
                                </button>
                            )}
                            <h2 className="text-2xl font-black text-text-main flex items-center gap-3 tracking-tight">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <span className="text-primary material-symbols-outlined">edit_square</span>
                                </div>
                                Practice Workspace
                            </h2>
                        </div>

                        {timerDuration && !timerVisible && (
                            <button
                                onClick={() => setTimerVisible(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border-main text-text-muted hover:text-text-main hover:border-primary/50 transition-all text-[11px] font-black uppercase tracking-wider shadow-sm group"
                            >
                                <span className="material-symbols-outlined text-sm group-hover:text-primary transition-colors">timer</span>
                                Timer
                            </button>
                        )}
                    </div>

                    <div className="px-6 md:px-10 space-y-10 pb-40 relative z-10">
                        {blocks.map((block) => (
                            <QuestionBlock
                                key={block.id}
                                block={block}
                                updateBlock={updateBlock}
                                removeBlock={removeBlock}
                                canRemove={blocks.length > 1}
                                handleSubmit={handleSubmit}
                            />
                        ))}

                        <button
                            onClick={addBlock}
                            className="w-full py-6 rounded-[2rem] border-2 border-dashed border-border-main text-text-muted hover:text-primary hover:border-primary/50 bg-black/5 dark:bg-white/[0.02] hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-3 font-bold group shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-border-main group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">add</span>
                            </div>
                            <span className="uppercase tracking-wider text-xs font-black">Add Empty Answer Block</span>
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-fade-in">
            <div className="bg-bg-card w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col border border-border-main animate-slide-up relative">

                {/* Ambient background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="px-8 py-6 border-b border-border-main flex items-center justify-between shrink-0 bg-black/5 dark:bg-white/5 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-black text-text-main">{block.label} Feedback</h2>
                            <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-primary text-background-dark shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                Score: {feedback.score}
                            </span>
                        </div>
                        <p className="text-text-muted text-sm font-medium">Detailed AI analysis and examiner notes.</p>
                    </div>
                    <button onClick={() => setBlock(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 border border-border-main text-text-muted hover:text-text-main hover:bg-black/10 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 relative z-10 custom-scrollbar">
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">fact_check</span> Requirements Analysis
                        </h3>
                        <div className="bg-black/5 dark:bg-[#0f172a] border border-border-main rounded-2xl p-6 text-text-main text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-inner">
                            {feedback.breakdown || "No breakdown provided."}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">campaign</span> Examiner Feedback
                        </h3>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-amber-700 dark:text-amber-200/90 text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-inner">
                            {feedback.feedback || "No feedback provided."}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">workspace_premium</span> Model Answer
                        </h3>
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 text-text-main text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-inner">
                            {feedback.modelAnswer || "No model answer provided."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
