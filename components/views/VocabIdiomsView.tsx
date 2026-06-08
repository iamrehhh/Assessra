'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { vocabData, idiomsData } from '@/data/vocabIdioms';

export default function VocabIdiomsView() {
    const { data: session } = useSession();

    const [activeTab, setActiveTab] = useState('vocab'); // 'vocab', 'idioms', 'saved'
    const [practiceState, setPracticeState] = useState('idle'); // 'idle', 'practicing', 'error-practice', 'results'

    // Practice Session State
    const [currentSet, setCurrentSet] = useState([]); // Array of 5 items
    const [currentIndex, setCurrentIndex] = useState(0);

    // MCQ State
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Mistake & Score Tracking
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState([]); // Items they got wrong

    // AI Enhancement State
    const [aiData, setAiData] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);

    // Error Practice (Sentence Making) State
    const [currentMistakeIndex, setCurrentMistakeIndex] = useState(0);
    const [userSentence, setUserSentence] = useState('');
    const [evaluationData, setEvaluationData] = useState(null);
    const [evaluating, setEvaluating] = useState(false);

    // Saved Sets
    const [savedSets, setSavedSets] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [viewingSet, setViewingSet] = useState(null);

    const loadSavedSets = async () => {
        try {
            const res = await fetch('/api/user/saved-practices');
            if (res.ok) {
                const data = await res.json();
                const vocabIdiomSets = data.savedPractices.filter(set => set.subject === 'vocab' || set.subject === 'idioms');
                setSavedSets(vocabIdiomSets);
            }
        } catch (error) {
            console.error('Failed to load saved sets', error);
        }
    };

    useEffect(() => {
        if (session?.user) {
            loadSavedSets();
        }
    }, [session]);

    // Helper to shuffle an array
    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const getSourceData = () => activeTab === 'vocab' ? vocabData : idiomsData;

    const generateOptions = (currentItem) => {
        const allData = getSourceData();
        const correct = currentItem.meaning;
        const distractors = shuffle(allData.filter(d => d.meaning !== correct)).slice(0, 3).map(d => d.meaning);
        return shuffle([correct, ...distractors]);
    };

    const startPractice = () => {
        const sourceData = getSourceData();
        const shuffled = shuffle(sourceData);
        const selected = shuffled.slice(0, Math.min(5, shuffled.length));

        setCurrentSet(selected);
        setCurrentIndex(0);
        setOptions(generateOptions(selected[0]));
        setSelectedOption(null);
        setIsAnswered(false);
        setAiData(null);
        setScore(0);
        setMistakes([]);
        setPracticeState('practicing');
    };

    const handleOptionClick = async (option) => {
        if (isAnswered) return;

        setSelectedOption(option);
        setIsAnswered(true);
        setLoadingAi(true);
        setAiData(null);

        const currentItem = currentSet[currentIndex];
        const isCorrect = option === currentItem.meaning;

        if (isCorrect) {
            setScore(prev => prev + 1);
        } else {
            setMistakes(prev => [...prev, currentItem]);
        }

        setCurrentSet(prev => {
            const newSet = [...prev];
            newSet[currentIndex] = {
                ...newSet[currentIndex],
                userAnswer: option,
                isCorrect
            };
            return newSet;
        });

        const term = activeTab === 'vocab' ? currentItem.word : currentItem.idiom;
        const meaning = currentItem.meaning;

        try {
            const res = await fetch('/api/vocab-idiom-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ term, type: activeTab, meaning })
            });

            if (res.ok) {
                const data = await res.json();
                setAiData(data);

                setCurrentSet(prev => {
                    const newSet = [...prev];
                    newSet[currentIndex] = { ...newSet[currentIndex], aiData: data };
                    return newSet;
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAi(false);
        }
    };

    const nextItem = () => {
        if (currentIndex < currentSet.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setOptions(generateOptions(currentSet[nextIdx]));
            setSelectedOption(null);
            setIsAnswered(false);
            setAiData(null);
        } else {
            // Reached end of 5 items
            finishPracticeSet();
        }
    };

    const finishPracticeSet = () => {
        // Derive score and mistakes from currentSet state to avoid stale closure values.
        // By the time this runs, handleOptionClick has already stamped isCorrect on every item.
        const finalScore = currentSet.filter(item => item.isCorrect === true).length;

        if (finalScore > 0) {
            fetch('/api/scores/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paperId: `vocab_idioms_${Date.now()}`,
                    paperTitle: `Review - ${activeTab === 'vocab' ? 'Vocabulary' : 'Idioms'}`,
                    subject: activeTab,
                    questionNumber: 'all',
                    score: finalScore,
                    maxMarks: currentSet.length
                })
            }).catch(() => { });
        }

        // Build mistake list purely from state — no stale `mistakes` or `isAnswered` vars
        const allMistakes = currentSet.filter(item => item.isCorrect === false);

        if (allMistakes.length > 0) {
            setMistakes(allMistakes);
            setCurrentMistakeIndex(0);
            setUserSentence('');
            setEvaluationData(null);
            setPracticeState('error-practice');
            return;
        }

        setPracticeState('results');
    };

    // Evaluate user sentence
    const submitSentence = async () => {
        if (!userSentence.trim()) return;
        setEvaluating(true);
        setEvaluationData(null);

        const currentMistake = mistakes[currentMistakeIndex];
        const term = activeTab === 'vocab' ? currentMistake.word : currentMistake.idiom;

        try {
            const res = await fetch('/api/evaluate-sentence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sentence: userSentence,
                    term: term,
                    meaning: currentMistake.meaning
                })
            });

            if (res.ok) {
                const data = await res.json();
                setEvaluationData(data);

                setCurrentSet(prev => {
                    const newSet = [...prev];
                    const itemIndex = newSet.findIndex(item =>
                        (activeTab === 'vocab' ? item.word === currentMistake.word : item.idiom === currentMistake.idiom)
                    );
                    if (itemIndex !== -1) {
                        newSet[itemIndex] = {
                            ...newSet[itemIndex],
                            userSentence: userSentence,
                            sentenceEvaluation: data
                        };
                    }
                    return newSet;
                });
            }
        } catch (error) {
            console.error("Sentence evaluation failed", error);
        } finally {
            setEvaluating(false);
        }
    };

    const nextMistake = () => {
        if (currentMistakeIndex < mistakes.length - 1) {
            setCurrentMistakeIndex(prev => prev + 1);
            setUserSentence('');
            setEvaluationData(null);
        } else {
            setPracticeState('results');
        }
    };

    const saveCurrentSet = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/saved-practices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: activeTab,
                    topic: 'Practice Set',
                    is_mcq: true,
                    score: score,
                    max_marks: currentSet.length,
                    practice_data: currentSet
                })
            });
            if (res.ok) {
                loadSavedSets();
            }
        } catch (error) {
            console.error('Failed to save set', error);
        } finally {
            setTimeout(() => setIsSaving(false), 800);
        }
    };

    const renderTabs = () => (
        <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl w-full max-w-lg mx-auto mb-8">
            <button
                onClick={() => setActiveTab('vocab')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'vocab' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
                Vocabulary
            </button>
            <button
                onClick={() => setActiveTab('idioms')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'idioms' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
                Idioms
            </button>
            <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-sm">bookmark</span>
                Saved
            </button>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────
    // IDLE STATE (Landing / Saved Sets)
    // ─────────────────────────────────────────────────────────────────
    if (practiceState === 'idle') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 view-transition-in pb-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight">Vocabulary & Idioms</h1>
                        <p className="text-text-muted mt-2">Master confusing words and expressions with AI context.</p>
                    </div>
                </div>

                {viewingSet ? (
                    <div className="space-y-6 view-transition-in relative">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => setViewingSet(null)}
                                className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-medium text-sm bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back to Saved Sets
                            </button>
                            <div className="text-sm font-bold text-text-main tracking-widest uppercase">
                                {viewingSet.score}/{viewingSet.max_marks} Score
                            </div>
                        </div>

                        {viewingSet.practice_data && viewingSet.practice_data.map((item, idx) => {
                            const term = item.word || item.idiom;
                            // For backward compatibility on old sets:
                            const isCorrect = item.isCorrect !== undefined ? item.isCorrect : true;

                            return (
                                <div key={idx} className={`glass p-6 sm:p-8 rounded-[2rem] border-2 shadow-sm ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                    <div className="flex justify-between items-start gap-4 mb-6">
                                        <h3 className="text-2xl font-black text-text-main font-serif italic">&quot;{term}&quot;</h3>
                                        {item.isCorrect !== undefined && (
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${isCorrect ? 'bg-green-500 shadow-sm shadow-green-500/30' : 'bg-red-500 shadow-sm shadow-red-500/30'}`}>
                                                <span className="material-symbols-outlined text-sm">{isCorrect ? 'check' : 'close'}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Meaning</span>
                                            <p className="text-text-main font-medium">{item.meaning}</p>
                                        </div>

                                        {item.userAnswer && (
                                            <div>
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Your Answer</span>
                                                <p className={`font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{item.userAnswer}</p>
                                            </div>
                                        )}

                                        {item.aiData && (
                                            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-5 space-y-4">
                                                <div>
                                                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">format_quote</span>
                                                        Example
                                                    </span>
                                                    <p className="text-text-main italic">&quot;{item.aiData.example}&quot;</p>
                                                </div>
                                                {item.aiData.synonyms && (
                                                    <div>
                                                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-xs">link</span>
                                                            Synonyms
                                                        </span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.aiData.synonyms.map((syn, synIdx) => (
                                                                <span key={synIdx} className="px-3 py-1 bg-white/50 dark:bg-black/20 border border-border-main rounded-lg text-xs font-semibold text-text-main shadow-sm">
                                                                    {syn}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {item.userSentence && (
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 space-y-3">
                                                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">edit_note</span>
                                                    Your Practice Sentence
                                                </span>
                                                <p className="text-text-main italic">&quot;{item.userSentence}&quot;</p>

                                                {item.sentenceEvaluation && (
                                                    <div className={`mt-3 pt-3 border-t border-amber-500/20 flex items-start gap-2 ${item.sentenceEvaluation.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                        <span className="material-symbols-outlined text-sm mt-0.5">{item.sentenceEvaluation.correct ? 'check_circle' : 'cancel'}</span>
                                                        <p className="text-sm font-medium">{item.sentenceEvaluation.feedback}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        {renderTabs()}

                        {activeTab === 'saved' ? (
                            <div className="space-y-4">
                                {savedSets.length === 0 ? (
                                    <div className="glass p-10 rounded-3xl border border-border-main text-center">
                                        <p className="text-text-muted font-medium">No saved sets yet.</p>
                                        <p className="text-text-muted text-sm mt-1">Complete a practice session and click &quot;Save Set&quot; to see it here.</p>
                                    </div>
                                ) : (
                                    savedSets.map(set => (
                                        <div key={set.id} className="glass p-6 rounded-2xl border border-border-main flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase tracking-wider">{set.subject}</span>
                                                    <span className="text-text-muted text-sm">{new Date(set.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="font-bold text-text-main line-clamp-2 pr-4">
                                                    {set.practice_data && set.practice_data.map ? set.practice_data.map(i => i.word || i.idiom).join(', ') : 'Practice Set'}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-xl font-black text-text-main">{set.score}/{set.max_marks}</div>
                                                <div className="flex gap-2 items-center justify-end mt-2">
                                                    <button
                                                        onClick={() => setViewingSet(set)}
                                                        className="px-4 py-1.5 bg-text-main text-bg-base text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="glass p-10 rounded-3xl border border-border-main text-center shadow-sm">
                                <div className="w-20 h-20 bg-primary/10 text-primary mx-auto rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                                    <span className="material-symbols-outlined text-4xl">
                                        {activeTab === 'vocab' ? 'spellcheck' : 'forum'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-text-main mb-3">
                                    {activeTab === 'vocab' ? 'Vocabulary Practice' : 'Idioms Practice'}
                                </h2>
                                <ul className="text-text-muted max-w-lg mx-auto mb-8 leading-relaxed list-disc text-left pl-10 space-y-2">
                                    <li>5 Multiple Choice Questions.</li>
                                    <li>AI generates examples and synonyms for every word.</li>
                                    <li>If you make a mistake, you&apos;ll need to construct a sentence using the word to reinforce learning.</li>
                                </ul>
                                <button
                                    onClick={startPractice}
                                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_25px_rgba(34,197,94,0.4)] hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
                                >
                                    <span>Start Practice</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────
    // ERROR PRACTICE STATE (Sentence Construction)
    // ─────────────────────────────────────────────────────────────────
    if (practiceState === 'error-practice') {
        const currentMistake = mistakes[currentMistakeIndex];
        const term = activeTab === 'vocab' ? currentMistake.word : currentMistake.idiom;
        const progressPercent = ((currentMistakeIndex) / mistakes.length) * 100;

        return (
            <div className="max-w-3xl mx-auto view-transition-in py-8 pt-2">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-text-main mb-2">Let&apos;s Fix Those Mistakes!</h2>
                    <p className="text-text-muted">Construct a sentence applying the correct meaning.</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-text-muted tracking-widest uppercase">
                        Review {currentMistakeIndex + 1} of {mistakes.length}
                    </span>
                </div>

                <div className="h-2 w-full bg-border-main rounded-full overflow-hidden mb-10">
                    <div className="h-full bg-amber-500 transition-all duration-500 ease-out" style={{ width: `${Math.max(5, progressPercent)}%` }}></div>
                </div>

                <div className="glass p-8 md:p-10 rounded-[2rem] border border-border-main shadow-lg">
                    <div className="mb-6 bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl">
                        <h3 className="text-2xl font-black text-text-main mb-2 font-serif italic text-amber-600 dark:text-amber-400">&quot;{term}&quot;</h3>
                        <p className="text-text-main font-medium">{currentMistake.meaning}</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-text-muted uppercase tracking-wider">Write a sentence using this {activeTab === 'vocab' ? 'word' : 'idiom'}</label>
                        <textarea
                            value={userSentence}
                            onChange={e => setUserSentence(e.target.value)}
                            placeholder="Type your sentence here..."
                            rows={3}
                            disabled={evaluationData !== null}
                            className="w-full bg-black/5 dark:bg-white/5 border border-border-main rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                        />

                        {!evaluationData ? (
                            <button
                                onClick={submitSentence}
                                disabled={evaluating || !userSentence.trim()}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {evaluating ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Evaluating...</>
                                ) : (
                                    <><span className="material-symbols-outlined">gavel</span> Grade Sentence</>
                                )}
                            </button>
                        ) : (
                            <div className={`p-6 sm:p-8 rounded-[2rem] border-2 shadow-sm view-transition-in ${evaluationData.correct ? 'bg-green-500/5 border-green-500/30 shadow-green-500/5' : 'bg-red-500/5 border-red-500/30 shadow-red-500/5'} `}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${evaluationData.correct ? 'bg-green-500 shadow-md shadow-green-500/30' : 'bg-red-500 shadow-md shadow-red-500/30'}`}>
                                        <span className="material-symbols-outlined text-lg">
                                            {evaluationData.correct ? 'check' : 'close'}
                                        </span>
                                    </span>
                                    <span className={`font-black tracking-tight text-xl ${evaluationData.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} `}>
                                        {evaluationData.correct ? 'Well used!' : 'Needs improvement'}
                                    </span>
                                </div>
                                <p className="text-text-main text-base sm:text-lg leading-relaxed">{evaluationData.feedback}</p>

                                <button
                                    onClick={nextMistake}
                                    className={`mt-8 w-full py-4 text-white font-bold rounded-2xl shadow-md hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${evaluationData.correct ? 'bg-green-600 hover:bg-green-500 shadow-green-600/30' : 'bg-red-600 hover:bg-red-500 shadow-red-600/30'}`}
                                >
                                    <span>{currentMistakeIndex === mistakes.length - 1 ? 'Finish Review' : 'Next Item'}</span>
                                    <span className="material-symbols-outlined text-sm">{currentMistakeIndex === mistakes.length - 1 ? 'done_all' : 'arrow_forward'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────
    // RESULTS STATE
    // ─────────────────────────────────────────────────────────────────
    if (practiceState === 'results') {
        const finalScore = mistakes.length > 0 ? currentSet.length - mistakes.length : currentSet.length;

        return (
            <div className="max-w-4xl mx-auto space-y-8 view-transition-in text-center py-10">
                <div className="text-7xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-4xl font-black text-text-main mb-2">Session Complete!</h2>
                <div className="text-6xl font-black text-primary mb-6">{finalScore}/{currentSet.length}</div>
                <p className="text-text-muted text-lg max-w-md mx-auto mb-10">
                    {finalScore === currentSet.length ? 'Perfect score! You mastered all the words perfectly.' : 'Great effort! You reviewed your mistakes to build stronger memory hooks.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => setPracticeState('idle')}
                        className="w-full sm:w-auto px-8 py-4 bg-black/5 dark:bg-white/5 text-text-main font-bold rounded-2xl border border-border-main hover:bg-black/10 transition-colors"
                    >
                        Return Home
                    </button>
                    <button
                        onClick={saveCurrentSet}
                        disabled={isSaving}
                        className="w-full sm:w-auto px-8 py-4 bg-blue-500 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 justify-center disabled:opacity-70"
                    >
                        <span className="material-symbols-outlined text-sm">{isSaving ? 'check' : 'bookmark_add'}</span>
                        <span>{isSaving ? 'Saved!' : 'Save This Set'}</span>
                    </button>
                    <button
                        onClick={startPractice}
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 justify-center"
                    >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        <span>Practice Again</span>
                    </button>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────
    // PRACTICING STATE (MCQ)
    // ─────────────────────────────────────────────────────────────────
    const currentItem = currentSet[currentIndex];
    const term = activeTab === 'vocab' ? currentItem.word : currentItem.idiom;
    const progressPercent = ((currentIndex) / currentSet.length) * 100;

    return (
        <div className="max-w-3xl mx-auto view-transition-in py-8 pt-2">

            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => setPracticeState('idle')}
                    className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-medium text-sm bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Quit Session
                </button>
                <div className="text-sm font-bold text-text-muted tracking-widest uppercase">
                    Question {currentIndex + 1} of {currentSet.length}
                </div>
            </div>

            <div className="h-2 w-full bg-border-main rounded-full overflow-hidden mb-8">
                <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${Math.max(5, progressPercent)}%` }}></div>
            </div>

            <div className="glass p-6 md:p-10 rounded-[2rem] border border-border-main shadow-lg relative overflow-hidden transition-all duration-300">
                <h2 className="text-3xl md:text-5xl font-black text-text-main text-center mb-8 relative z-10 font-serif italic">
                    &quot;{term}&quot;
                </h2>

                <div className="space-y-3">
                    {options.map((opt, idx) => {
                        let btnStyle = 'bg-black/5 dark:bg-white/5 border-border-main text-text-main hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-sm';

                        if (isAnswered) {
                            if (opt === currentItem.meaning) {
                                btnStyle = 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300';
                            } else if (opt === selectedOption) {
                                btnStyle = 'bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300';
                            } else {
                                btnStyle = 'bg-black/5 border-border-main text-text-muted opacity-50';
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(opt)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 font-medium flex items-center gap-4 ${btnStyle}`}
                            >
                                <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isAnswered && opt === currentItem.meaning ? 'border-green-500 bg-green-500 text-white' : isAnswered && opt === selectedOption ? 'border-red-500 bg-red-500 text-white' : 'border-border-main bg-white dark:bg-black shadow-sm'}`}>
                                    {isAnswered && opt === currentItem.meaning ? '✓' : isAnswered && opt === selectedOption ? '✕' : String.fromCharCode(65 + idx)}
                                </span>
                                <span className="leading-relaxed text-sm sm:text-base">{opt}</span>
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-8 pt-8 border-t border-border-main view-transition-in space-y-6">
                        {loadingAi ? (
                            <div className="bg-primary/5 p-6 rounded-2xl flex flex-col items-center justify-center gap-3">
                                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-sm text-primary font-medium animate-pulse">Fetching AI context...</p>
                            </div>
                        ) : aiData ? (
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-5 shadow-inner">
                                <div>
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">format_quote</span>
                                        Example
                                    </span>
                                    <p className="text-text-main text-lg italic bg-white/50 dark:bg-black/20 p-4 rounded-xl shadow-sm">
                                        &quot;{aiData.example}&quot;
                                    </p>
                                </div>
                                {aiData.synonyms && (
                                    <div>
                                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">link</span>
                                            Synonyms
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {aiData.synonyms.map((syn, synIdx) => (
                                                <span key={synIdx} className="px-3 py-1 bg-white/60 dark:bg-white/10 border border-border-main rounded-lg text-sm font-semibold text-text-main shadow-sm">
                                                    {syn}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={nextItem}
                                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
                            >
                                <span>{currentIndex === currentSet.length - 1 ? 'Finish Set' : 'Next Question'}</span>
                                <span className="material-symbols-outlined text-sm">
                                    {currentIndex === currentSet.length - 1 ? 'done_all' : 'arrow_forward'}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
