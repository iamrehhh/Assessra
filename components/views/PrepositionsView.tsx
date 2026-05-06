'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { prepositionsData } from '@/data/prepositions';

export default function PrepositionsView() {
    const { data: session } = useSession();

    const [activeTab, setActiveTab] = useState('practice'); // 'practice', 'saved'
    const [practiceState, setPracticeState] = useState('idle'); // 'idle', 'practicing', 'results'

    // Practice Session State
    const [currentSet, setCurrentSet] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // MCQ State
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Score Tracking
    const [score, setScore] = useState(0);

    // AI Enhancement State
    const [aiData, setAiData] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);

    // Saved Sets
    const [savedSets, setSavedSets] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [viewingSet, setViewingSet] = useState(null);

    // Collect all unique prepositions for generating MCQ distractors
    const allPrepositions = [...new Set(
        prepositionsData
            .map(q => q.answer)
            .filter(a => !a.includes('(')) // Filter out the special Q31 answer
    )];

    const loadSavedSets = async () => {
        try {
            const res = await fetch('/api/user/saved-practices');
            if (res.ok) {
                const data = await res.json();
                const prepSets = data.savedPractices.filter(set => set.subject === 'prepositions');
                setSavedSets(prepSets);
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

    const generateOptions = (currentItem) => {
        // Odd One Out: options are pre-built A/B/C/D — return as ordered array of values
        if (currentItem.type === 'oddone') {
            return ['A', 'B', 'C', 'D'].map(k => currentItem.options[k]);
        }
        const correct = currentItem.answer;
        // If the answer contains '(' it's a special explanatory answer, use common prepositions
        if (correct.includes('(')) {
            return shuffle(['of', 'to', 'with', 'in']);
        }
        const distractors = shuffle(allPrepositions.filter(p => p !== correct)).slice(0, 3);
        return shuffle([correct, ...distractors]);
    };

    const startPractice = () => {
        // Include oddone questions; exclude only meta-explanatory answers like Q100
        const usableQuestions = prepositionsData.filter(q => q.type === 'oddone' || !q.answer.includes('('));
        const shuffled = shuffle(usableQuestions);
        const selected = shuffled.slice(0, 5);

        setCurrentSet(selected);
        setCurrentIndex(0);
        setOptions(generateOptions(selected[0]));
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
        // For oddone: option is the option VALUE but answer is the KEY (A/B/C/D)
        // Resolve the correct value from the options map
        const correctValue = currentItem.type === 'oddone'
            ? currentItem.options[currentItem.answer]
            : currentItem.answer;
        const isCorrect = option === correctValue;

        if (isCorrect) {
            setScore(prev => prev + 1);
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

        try {
            const res = await fetch('/api/preposition-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentItem.question,
                    answer: currentItem.answer,
                    userAnswer: option
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
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setOptions(generateOptions(currentSet[nextIdx]));
            setSelectedOption(null);
            setIsAnswered(false);
            setAiData(null);
        } else {
            finishPracticeSet();
        }
    };

    const finishPracticeSet = () => {
        // Save score
        const finalScore = score + (isAnswered && selectedOption === currentSet[currentIndex].answer ? 1 : 0);
        if (finalScore > 0) {
            fetch('/api/scores/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paperId: `prepositions_${Date.now()}`,
                    paperTitle: 'Review - Prepositions',
                    subject: 'prepositions',
                    questionNumber: 'all',
                    score: finalScore,
                    maxMarks: currentSet.length
                })
            }).catch(() => { });
        }

        setPracticeState('results');
    };

    const saveCurrentSet = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/saved-practices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: 'prepositions',
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
                onClick={() => setActiveTab('practice')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'practice' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
                Practice
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
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight">Prepositions</h1>
                        <p className="text-text-muted mt-2">Master tricky preposition usage with AI-powered explanations.</p>
                    </div>
                </div>

                {viewingSet ? (
                    <div className="space-y-6 animate-fade-in relative">
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
                            const isCorrect = item.isCorrect !== undefined ? item.isCorrect : true;

                            return (
                                <div key={idx} className={`glass p-6 sm:p-8 rounded-[2rem] border-2 shadow-sm ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                    <div className="flex justify-between items-start gap-4 mb-6">
                                        <h3 className="text-lg font-bold text-text-main leading-relaxed">
                                            {(() => {
                                                const parts = item.question.split('___');
                                                return <>{parts[0]}<span className="text-primary font-black">{item.answer}</span>{parts[1]}</>;
                                            })()}
                                        </h3>
                                        {item.isCorrect !== undefined && (
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${isCorrect ? 'bg-green-500 shadow-sm shadow-green-500/30' : 'bg-red-500 shadow-sm shadow-red-500/30'}`}>
                                                <span className="material-symbols-outlined text-sm">{isCorrect ? 'check' : 'close'}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Correct Answer</span>
                                            <p className="text-primary font-bold text-lg">{item.answer}</p>
                                        </div>

                                        {item.userAnswer && (
                                            <div>
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Your Answer</span>
                                                <p className={`font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{item.userAnswer}</p>
                                            </div>
                                        )}

                                        <div>
                                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Section</span>
                                            <p className="text-text-muted text-sm">{item.section}</p>
                                        </div>

                                        {item.aiData && (
                                            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-5">
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">lightbulb</span>
                                                    Explanation
                                                </span>
                                                <p className="text-text-main text-sm leading-relaxed">{item.aiData.explanation}</p>
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
                                                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase tracking-wider">prepositions</span>
                                                    <span className="text-text-muted text-sm">{new Date(set.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="font-bold text-text-main line-clamp-2 pr-4">
                                                    {set.practice_data && set.practice_data.map ? set.practice_data.map(i => i.answer).join(', ') : 'Practice Set'}
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
                                        text_select_move_forward_word
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-text-main mb-3">
                                    Prepositions Practice
                                </h2>
                                <ul className="text-text-muted max-w-lg mx-auto mb-8 leading-relaxed list-disc text-left pl-10 space-y-2">
                                    <li>5 Multiple Choice Questions from a bank of <strong>200 questions</strong>.</li>
                                    <li>AI generates a grammar explanation for every question.</li>
                                    <li>Questions drawn from 26+ preposition categories.</li>
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
    // RESULTS STATE
    // ─────────────────────────────────────────────────────────────────
    if (practiceState === 'results') {
        const finalScore = currentSet.filter(item => item.isCorrect).length;

        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-center py-10">
                <div className="text-7xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-4xl font-black text-text-main mb-2">Session Complete!</h2>
                <div className="text-6xl font-black text-primary mb-6">{finalScore}/{currentSet.length}</div>
                <p className="text-text-muted text-lg max-w-md mx-auto mb-10">
                    {finalScore === currentSet.length ? 'Perfect score! You nailed every preposition.' : 'Good effort! Review the explanations to strengthen your preposition skills.'}
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
    const progressPercent = ((currentIndex) / currentSet.length) * 100;

    // For fill-in-blank: split on the blank; for oddone: show plain question
    const isOddOne = currentItem.type === 'oddone';
    const questionParts = isOddOne ? [] : currentItem.question.split('___');
    const correctValue = isOddOne ? currentItem.options[currentItem.answer] : currentItem.answer;

    return (
        <div className="max-w-3xl mx-auto animate-fade-in py-8 pt-2">

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
                {/* Section badge */}
                <div className="mb-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-black/5 dark:bg-white/5 px-3 py-1 rounded-lg">
                        {currentItem.section}
                    </span>
                    {isOddOne && <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-lg">Odd One Out</span>}
                </div>

                {/* Question — blank-fill OR odd-one-out plain text */}
                {isOddOne ? (
                    <h2 className="text-base md:text-lg font-bold text-text-main text-center mb-8 relative z-10 leading-relaxed">
                        {currentItem.question}
                    </h2>
                ) : (
                    <h2 className="text-xl md:text-2xl font-bold text-text-main text-center mb-8 relative z-10 leading-relaxed">
                        {questionParts[0]}
                        <span className="inline-block mx-1 px-4 py-1 bg-primary/10 border-2 border-primary/30 rounded-xl text-primary font-black min-w-[60px] text-center">
                            {isAnswered ? correctValue : '?'}
                        </span>
                        {questionParts[1]}
                    </h2>
                )}

                <div className="space-y-3">
                    {options.map((opt, idx) => {
                        const isCorrectOpt = opt === correctValue;
                        let btnStyle = 'bg-black/5 dark:bg-white/5 border-border-main text-text-main hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-sm';

                        if (isAnswered) {
                            if (isCorrectOpt) {
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
                                <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isAnswered && isCorrectOpt ? 'border-green-500 bg-green-500 text-white' : isAnswered && opt === selectedOption ? 'border-red-500 bg-red-500 text-white' : 'border-border-main bg-white dark:bg-black shadow-sm'}`}>
                                    {isAnswered && isCorrectOpt ? '✓' : isAnswered && opt === selectedOption ? '✕' : String.fromCharCode(65 + idx)}
                                </span>
                                <span className="leading-relaxed text-base font-semibold">{opt}</span>
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-8 pt-8 border-t border-border-main animate-fade-in space-y-6">
                        {loadingAi ? (
                            <div className="bg-primary/5 p-6 rounded-2xl flex flex-col items-center justify-center gap-3">
                                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-sm text-primary font-medium animate-pulse">Generating explanation...</p>
                            </div>
                        ) : (aiData || currentItem.explanation) ? (
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-3 shadow-inner">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">lightbulb</span>
                                    Explanation
                                </span>
                                <p className="text-text-main text-base leading-relaxed">
                                    {aiData ? aiData.explanation : currentItem.explanation}
                                </p>
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
