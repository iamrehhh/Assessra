'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { grammarErrorsData } from '@/data/grammarErrors';

export default function GrammarErrorView() {
    const { data: session } = useSession();

    const [activeTab, setActiveTab] = useState('practice');
    const [practiceState, setPracticeState] = useState('idle');

    const [currentSet, setCurrentSet] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);

    const [aiData, setAiData] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);

    const [savedSets, setSavedSets] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [viewingSet, setViewingSet] = useState(null);

    const optionKeys = ['A', 'B', 'C', 'D'];

    const loadSavedSets = async () => {
        try {
            const res = await fetch('/api/user/saved-practices');
            if (res.ok) {
                const data = await res.json();
                const sets = data.savedPractices.filter(set => set.subject === 'grammar-errors');
                setSavedSets(sets);
            }
        } catch (error) {
            console.error('Failed to load saved sets', error);
        }
    };

    useEffect(() => {
        if (session?.user) loadSavedSets();
    }, [session]);

    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const startPractice = () => {
        const shuffled = shuffle(grammarErrorsData);
        const selected = shuffled.slice(0, 5);
        setCurrentSet(selected);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setAiData(null);
        setScore(0);
        setPracticeState('practicing');
    };

    const handleOptionClick = async (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        setLoadingAi(true);
        setAiData(null);

        const currentItem = currentSet[currentIndex];
        const isCorrect = option === currentItem.answer;
        if (isCorrect) setScore(prev => prev + 1);

        setCurrentSet(prev => {
            const newSet = [...prev];
            newSet[currentIndex] = { ...newSet[currentIndex], userAnswer: option, isCorrect };
            return newSet;
        });

        try {
            const partsForApi = currentItem.type === 'passage'
                ? { A: currentItem.passage[0], B: currentItem.passage[1], C: currentItem.passage[2], D: currentItem.passage[3] }
                : currentItem.parts;

            const res = await fetch('/api/grammar-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parts: partsForApi,
                    answer: currentItem.answer,
                    userAnswer: option,
                    explanation: currentItem.explanation,
                    type: currentItem.type,
                    question: currentItem.type === 'mcq' ? currentItem.question : undefined
                })
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
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setAiData(null);
        } else {
            finishPracticeSet();
        }
    };

    const finishPracticeSet = () => {
        fetch('/api/scores/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paperId: `grammar_${Date.now()}`,
                paperTitle: 'Review - Grammar Error Detection',
                subject: 'grammar-errors',
                questionNumber: 'all',
                score: currentSet.filter(i => i.isCorrect).length,
                maxMarks: currentSet.length
            })
        }).catch(() => { });
        setPracticeState('results');
    };

    const saveCurrentSet = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/saved-practices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: 'grammar-errors',
                    topic: 'Grammar Error Detection',
                    is_mcq: true,
                    score: currentSet.filter(i => i.isCorrect).length,
                    max_marks: currentSet.length,
                    practice_data: currentSet
                })
            });
            if (res.ok) loadSavedSets();
        } catch (error) {
            console.error('Failed to save set', error);
        } finally {
            setTimeout(() => setIsSaving(false), 800);
        }
    };

    // ── Helper to get the full sentence text for a question ──
    const getSentenceText = (item) => {
        if (item.type === 'passage') {
            return item.passage.join(' ');
        }
        if (item.type === 'correct') {
            return item.prompt || "Which of the following sentences is correct?";
        }
        if (item.type === 'mcq') {
            return item.question || '';
        }
        // standard: join parts A-C (D is usually "No error")
        return `${item.parts.A} ${item.parts.B} ${item.parts.C}`;
    };

    const renderTabs = () => (
        <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl w-full max-w-lg mx-auto mb-8">
            <button onClick={() => setActiveTab('practice')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'practice' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}>
                Practice
            </button>
            <button onClick={() => setActiveTab('saved')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}>
                <span className="material-symbols-outlined text-sm">bookmark</span> Saved
            </button>
        </div>
    );

    // ─── Render option button for MCQ ───
    const renderOptionButton = (key, text, currentItem, isViewMode = false) => {
        const answered = isViewMode || isAnswered;
        const selected = isViewMode ? currentItem.userAnswer : selectedOption;

        let btnStyle = 'bg-black/5 dark:bg-white/5 border-border-main text-text-main hover:bg-black/10 dark:hover:bg-white/10 hover:-translate-y-1 hover:shadow-sm';

        if (answered) {
            if (key === currentItem.answer) {
                btnStyle = 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300';
            } else if (key === selected) {
                btnStyle = 'bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300';
            } else {
                btnStyle = 'bg-black/5 border-border-main text-text-muted opacity-50';
            }
        }

        return (
            <button
                key={key}
                onClick={() => !isViewMode && handleOptionClick(key)}
                disabled={answered}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 font-medium flex items-center gap-4 ${btnStyle}`}
            >
                <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${answered && key === currentItem.answer ? 'border-green-500 bg-green-500 text-white' : answered && key === selected ? 'border-red-500 bg-red-500 text-white' : 'border-border-main bg-white dark:bg-black shadow-sm'}`}>
                    {answered && key === currentItem.answer ? '✓' : answered && key === selected ? '✕' : key}
                </span>
                <span className="leading-relaxed text-sm sm:text-base">{text}</span>
            </button>
        );
    };

    // ─── Get option text for a question ───
    const getOptionText = (item, key) => {
        if (item.type === 'passage') {
            return `Part ${optionKeys.indexOf(key) + 1}: ${item.passage[optionKeys.indexOf(key)]}`;
        }
        return item.parts[key];
    };

    // ─── For saved-set view: render MCQ question text ───
    const getMcqPrompt = (item) => item.type === 'mcq' ? item.question : null;

    // ════════════════════════════════════════════════
    // IDLE STATE
    // ════════════════════════════════════════════════
    if (practiceState === 'idle') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight">Grammar Error Detection</h1>
                        <p className="text-text-muted mt-2">Spot grammar errors with AI-powered explanations.</p>
                    </div>
                </div>

                {viewingSet ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-8">
                            <button onClick={() => setViewingSet(null)}
                                className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-medium text-sm bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl">
                                <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Saved Sets
                            </button>
                            <div className="text-sm font-bold text-text-main tracking-widest uppercase">
                                {viewingSet.score}/{viewingSet.max_marks} Score
                            </div>
                        </div>

                        {viewingSet.practice_data && viewingSet.practice_data.map((item, idx) => {
                            const isCorrect = item.isCorrect !== undefined ? item.isCorrect : true;
                            return (
                                <div key={idx} className={`glass p-6 sm:p-8 rounded-[2rem] border-2 shadow-sm ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-black/5 dark:bg-white/5 px-3 py-1 rounded-lg">{item.section}</span>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                            <span className="material-symbols-outlined text-sm">{isCorrect ? 'check' : 'close'}</span>
                                        </span>
                                    </div>

                                    {item.type === 'correct' && (
                                        <p className="text-sm font-semibold text-primary mb-4">{item.prompt}</p>
                                    )}

                                    {item.type === 'mcq' && (
                                        <p className="text-sm font-semibold text-text-main mb-4 leading-relaxed whitespace-pre-line">{item.question}</p>
                                    )}

                                    {item.type === 'passage' ? (
                                        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl mb-4 space-y-1">
                                            {item.passage.map((line, i) => (
                                                <p key={i} className={`text-sm ${optionKeys[i] === item.answer ? 'text-red-500 font-bold line-through decoration-2' : 'text-text-main'}`}>
                                                    <span className="text-text-muted font-mono mr-2">{i + 1}.</span>{line}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2 mb-4">
                                            {optionKeys.map(key => renderOptionButton(key, item.parts[key], item, true))}
                                        </div>
                                    )}

                                    <div className="space-y-4 mt-4">
                                        <div className="flex gap-6">
                                            <div><span className="text-xs font-bold text-text-muted uppercase tracking-widest block">Correct</span><p className="text-primary font-bold text-lg">{item.answer}</p></div>
                                            {item.userAnswer && <div><span className="text-xs font-bold text-text-muted uppercase tracking-widest block">You Chose</span><p className={`font-bold text-lg ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{item.userAnswer}</p></div>}
                                        </div>
                                        {(item.aiData || item.explanation) && (
                                            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-5">
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">lightbulb</span> Explanation
                                                </span>
                                                <p className="text-text-main text-sm leading-relaxed">{item.aiData ? item.aiData.explanation : item.explanation}</p>
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
                                        <p className="text-text-muted text-sm mt-1">Complete a practice session and save it to see it here.</p>
                                    </div>
                                ) : savedSets.map(set => (
                                    <div key={set.id} className="glass p-6 rounded-2xl border border-border-main flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg uppercase tracking-wider">grammar</span>
                                                <span className="text-text-muted text-sm">{new Date(set.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="font-bold text-text-main text-sm">Grammar Error Detection Set</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-xl font-black text-text-main">{set.score}/{set.max_marks}</div>
                                            <button onClick={() => setViewingSet(set)}
                                                className="mt-2 px-4 py-1.5 bg-text-main text-bg-base text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass p-10 rounded-3xl border border-border-main text-center shadow-sm">
                                <div className="w-20 h-20 bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-500/5">
                                    <span className="material-symbols-outlined text-4xl">spellcheck</span>
                                </div>
                                <h2 className="text-2xl font-bold text-text-main mb-3">Grammar Error Detection</h2>
                                <ul className="text-text-muted max-w-lg mx-auto mb-8 leading-relaxed list-disc text-left pl-10 space-y-2">
                                    <li>5 MCQs per session from a bank of <strong>250 questions</strong>.</li>
                                    <li>Covers SVA, tenses, articles, conjunctions, modifiers, reported speech, and more.</li>
                                    <li>New topics: Figures of Speech, Idioms, Synonyms/Antonyms, Para-Jumbles, One-Word Substitution, Parallelism, Determiners, and more.</li>
                                    <li>AI enriches each explanation with grammar rules and tips.</li>
                                </ul>
                                <button onClick={startPractice}
                                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_25px_rgba(34,197,94,0.4)] hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto">
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

    // ════════════════════════════════════════════════
    // RESULTS STATE
    // ════════════════════════════════════════════════
    if (practiceState === 'results') {
        const finalScore = currentSet.filter(item => item.isCorrect).length;
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-center py-10">
                <div className="text-7xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-4xl font-black text-text-main mb-2">Session Complete!</h2>
                <div className="text-6xl font-black text-primary mb-6">{finalScore}/{currentSet.length}</div>
                <p className="text-text-muted text-lg max-w-md mx-auto mb-10">
                    {finalScore === currentSet.length ? 'Perfect! You spotted every grammar error.' : 'Good effort! Review the explanations to strengthen your grammar skills.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={() => setPracticeState('idle')}
                        className="w-full sm:w-auto px-8 py-4 bg-black/5 dark:bg-white/5 text-text-main font-bold rounded-2xl border border-border-main hover:bg-black/10 transition-colors">
                        Return Home
                    </button>
                    <button onClick={saveCurrentSet} disabled={isSaving}
                        className="w-full sm:w-auto px-8 py-4 bg-blue-500 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 justify-center disabled:opacity-70">
                        <span className="material-symbols-outlined text-sm">{isSaving ? 'check' : 'bookmark_add'}</span>
                        <span>{isSaving ? 'Saved!' : 'Save This Set'}</span>
                    </button>
                    <button onClick={startPractice}
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 justify-center">
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        <span>Practice Again</span>
                    </button>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════
    // PRACTICING STATE
    // ════════════════════════════════════════════════
    const currentItem = currentSet[currentIndex];
    const progressPercent = ((currentIndex) / currentSet.length) * 100;

    return (
        <div className="max-w-3xl mx-auto animate-fade-in py-8 pt-2">
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => setPracticeState('idle')}
                    className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-medium text-sm bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl">
                    <span className="material-symbols-outlined text-sm">close</span> Quit Session
                </button>
                <div className="text-sm font-bold text-text-muted tracking-widest uppercase">
                    Question {currentIndex + 1} of {currentSet.length}
                </div>
            </div>

            <div className="h-2 w-full bg-border-main rounded-full overflow-hidden mb-8">
                <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${Math.max(5, progressPercent)}%` }}></div>
            </div>

            <div className="glass p-6 md:p-10 rounded-[2rem] border border-border-main shadow-lg relative overflow-hidden transition-all duration-300">
                <div className="mb-4">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-black/5 dark:bg-white/5 px-3 py-1 rounded-lg">
                        {currentItem.section}
                    </span>
                </div>

                {/* Question prompt */}
                {currentItem.type === 'correct' && (
                    <h2 className="text-xl md:text-2xl font-bold text-text-main text-center mb-6">{currentItem.prompt}</h2>
                )}

                {currentItem.type === 'mcq' && (
                    <div className="mb-6">
                        <div className="bg-black/5 dark:bg-white/5 p-5 rounded-xl mb-2">
                            <p className="text-base md:text-lg font-semibold text-text-main leading-relaxed whitespace-pre-line">{currentItem.question}</p>
                        </div>
                        <p className="text-xs text-text-muted text-center font-medium mt-2">Select the correct answer</p>
                    </div>
                )}

                {currentItem.type === 'passage' && (
                    <>
                        <h2 className="text-base font-semibold text-text-muted text-center mb-4">Find the part with the error:</h2>
                        <div className="bg-black/5 dark:bg-white/5 p-5 rounded-xl mb-6 space-y-2">
                            {currentItem.passage.map((line, i) => (
                                <p key={i} className={`text-base leading-relaxed ${isAnswered && optionKeys[i] === currentItem.answer ? 'text-red-500 font-bold line-through decoration-2' : 'text-text-main'}`}>
                                    <span className="text-text-muted font-mono mr-2 text-sm">{i + 1}.</span>{line}
                                </p>
                            ))}
                        </div>
                    </>
                )}

                {currentItem.type === 'standard' && (
                    <div className="mb-6">
                        <div className="bg-black/5 dark:bg-white/5 p-5 rounded-xl mb-2">
                            <p className="text-base md:text-lg font-semibold text-text-main leading-relaxed text-center">
                                {['A', 'B', 'C'].map((key, i) => (
                                    <span key={key} className={
                                        isAnswered && key === currentItem.answer
                                            ? 'text-red-500 font-bold underline decoration-red-400 decoration-2'
                                            : 'text-text-main'
                                    }>
                                        {currentItem.parts[key]}{i < 2 ? ' ' : ''}
                                    </span>
                                ))}
                            </p>
                        </div>
                        <p className="text-xs text-text-muted text-center font-medium">Select the part that contains the grammatical error, or choose D if there is no error</p>
                    </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                    {optionKeys.map(key => {
                        const text = getOptionText(currentItem, key);
                        return renderOptionButton(key, text, currentItem);
                    })}
                </div>

                {/* AI Explanation */}
                {isAnswered && (
                    <div className="mt-8 pt-8 border-t border-border-main animate-fade-in space-y-6">
                        {loadingAi ? (
                            <div className="bg-primary/5 p-6 rounded-2xl flex flex-col items-center justify-center gap-3">
                                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-sm text-primary font-medium animate-pulse">Generating explanation...</p>
                            </div>
                        ) : aiData ? (
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-3 shadow-inner">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">lightbulb</span> Explanation
                                </span>
                                <p className="text-text-main text-base leading-relaxed">{aiData.explanation}</p>
                            </div>
                        ) : null}

                        <div className="flex justify-end pt-2">
                            <button onClick={nextItem}
                                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 w-full md:w-auto justify-center">
                                <span>{currentIndex === currentSet.length - 1 ? 'Finish Set' : 'Next Question'}</span>
                                <span className="material-symbols-outlined text-sm">{currentIndex === currentSet.length - 1 ? 'done_all' : 'arrow_forward'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
