'use client';

import { useState, useEffect, useMemo } from 'react';
import { useConfirm } from '@/components/ConfirmContext';

/* ── Question pool (copied from original vocab_quiz.js) ── */
const vocabQuestionsBank = [
    { word: "Mendacious", options: ["Truthful", "Deceitful", "Brave", "Silent"], correct: 1, category: "Deception" },
    { word: "Perfidious", options: ["Loyal", "Treacherous", "Wise", "Generous"], correct: 1, category: "Deception" },
    { word: "Duplicity", options: ["Honesty", "Intelligence", "Deceitfulness", "Courage"], correct: 2, category: "Deception" },
    { word: "Chicanery", options: ["Straightforwardness", "Bravery", "Trickery", "Kindness"], correct: 2, category: "Deception" },
    { word: "Disingenuous", options: ["Sincere", "Clever", "Insincere", "Stubborn"], correct: 2, category: "Deception" },
    { word: "Supercilious", options: ["Humble", "Arrogant", "Foolish", "Quiet"], correct: 1, category: "Pride" },
    { word: "Hubris", options: ["Modesty", "Excessive pride", "Fear", "Wisdom"], correct: 1, category: "Pride" },
    { word: "Imperious", options: ["Submissive", "Domineering", "Intelligent", "Generous"], correct: 1, category: "Pride" },
    { word: "Bumptious", options: ["Reserved", "Self-important", "Cowardly", "Flexible"], correct: 1, category: "Pride" },
    { word: "Grandiloquent", options: ["Simple", "Pompous in speech", "Brief", "Honest"], correct: 1, category: "Pride" },
    { word: "Pusillanimous", options: ["Brave", "Timid", "Wise", "Talkative"], correct: 1, category: "Courage" },
    { word: "Intrepid", options: ["Fearful", "Fearless", "Foolish", "Silent"], correct: 1, category: "Courage" },
    { word: "Dauntless", options: ["Discouraged", "Bold", "Weak", "Greedy"], correct: 1, category: "Courage" },
    { word: "Craven", options: ["Heroic", "Cowardly", "Intelligent", "Generous"], correct: 1, category: "Courage" },
    { word: "Perspicacious", options: ["Dull", "Perceptive", "Brave", "Quiet"], correct: 1, category: "Intelligence" },
    { word: "Sagacious", options: ["Foolish", "Wise", "Angry", "Brief"], correct: 1, category: "Intelligence" },
    { word: "Astute", options: ["Naive", "Shrewd", "Cowardly", "Verbose"], correct: 1, category: "Intelligence" },
    { word: "Perspicacity", options: ["Stupidity", "Keen insight", "Arrogance", "Silence"], correct: 1, category: "Intelligence" },
    { word: "Fatuous", options: ["Intelligent", "Silly", "Brave", "Honest"], correct: 1, category: "Stupidity" },
    { word: "Obtuse", options: ["Sharp", "Slow to understand", "Generous", "Brief"], correct: 1, category: "Stupidity" },
    { word: "Vacuous", options: ["Thoughtful", "Empty-headed", "Courageous", "Flexible"], correct: 1, category: "Stupidity" },
    { word: "Inane", options: ["Meaningful", "Senseless", "Honest", "Generous"], correct: 1, category: "Stupidity" },
    { word: "Recalcitrant", options: ["Compliant", "Uncooperative", "Wise", "Brief"], correct: 1, category: "Stubbornness" },
    { word: "Obstinate", options: ["Flexible", "Stubborn", "Intelligent", "Generous"], correct: 1, category: "Stubbornness" },
    { word: "Intransigent", options: ["Compromising", "Inflexible", "Foolish", "Silent"], correct: 1, category: "Stubbornness" },
    { word: "Contumacious", options: ["Obedient", "Rebellious", "Wise", "Brief"], correct: 1, category: "Stubbornness" },
    { word: "Loquacious", options: ["Quiet", "Talkative", "Brave", "Wise"], correct: 1, category: "Talkativeness" },
    { word: "Garrulous", options: ["Reserved", "Excessively talkative", "Intelligent", "Honest"], correct: 1, category: "Talkativeness" },
    { word: "Prolix", options: ["Concise", "Wordy", "Generous", "Brave"], correct: 1, category: "Talkativeness" },
    { word: "Logorrhea", options: ["Silence", "Excessive talkativeness", "Wisdom", "Courage"], correct: 1, category: "Talkativeness" },
    { word: "Taciturn", options: ["Chatty", "Reserved in speech", "Foolish", "Generous"], correct: 1, category: "Silence" },
    { word: "Reticent", options: ["Outspoken", "Reluctant to speak", "Brave", "Wise"], correct: 1, category: "Silence" },
    { word: "Laconic", options: ["Verbose", "Brief in speech", "Cowardly", "Greedy"], correct: 1, category: "Silence" },
    { word: "Vituperative", options: ["Praising", "Harshly critical", "Silent", "Generous"], correct: 1, category: "Criticism" },
    { word: "Excoriate", options: ["Praise", "Criticize severely", "Ignore", "Admire"], correct: 1, category: "Criticism" },
    { word: "Objurgate", options: ["Compliment", "Scold harshly", "Encourage", "Forgive"], correct: 1, category: "Criticism" },
    { word: "Castigate", options: ["Reward", "Reprimand severely", "Support", "Appreciate"], correct: 1, category: "Criticism" },
    { word: "Extol", options: ["Criticize", "Praise highly", "Ignore", "Condemn"], correct: 1, category: "Praise" },
    { word: "Laud", options: ["Denounce", "Commend", "Question", "Attack"], correct: 1, category: "Praise" },
    { word: "Panegyric", options: ["Criticism", "Formal praise", "Silence", "Insult"], correct: 1, category: "Praise" },
    { word: "Eulogize", options: ["Defame", "Praise formally", "Ignore", "Criticize"], correct: 1, category: "Praise" },
    { word: "Bellicose", options: ["Peaceful", "Friendly", "Aggressive", "Silent"], correct: 2, category: "Anger" },
    { word: "Belligerent", options: ["Calm", "Gentle", "Hostile", "Wise"], correct: 2, category: "Anger" },
    { word: "Acerbic", options: ["Sweet", "Kind", "Harsh", "Generous"], correct: 2, category: "Anger" },
    { word: "Caustic", options: ["Mild", "Pleasant", "Biting", "Foolish"], correct: 2, category: "Anger" },
    { word: "Truculent", options: ["Peaceful", "Cooperative", "Aggressively defiant", "Silent"], correct: 2, category: "Anger" },
    { word: "Approbation", options: ["Disapproval", "Criticism", "Official approval", "Silence"], correct: 2, category: "Approval" },
    { word: "Adulation", options: ["Hatred", "Indifference", "Excessive admiration", "Fear"], correct: 2, category: "Approval" },
    { word: "Commend", options: ["Criticize", "Ignore", "Praise", "Reject"], correct: 2, category: "Approval" },
    { word: "Deprecate", options: ["Approve", "Support", "Express disapproval", "Admire"], correct: 2, category: "Disapproval" },
    { word: "Disparage", options: ["Praise", "Respect", "Belittle", "Encourage"], correct: 2, category: "Disapproval" },
    { word: "Deride", options: ["Admire", "Support", "Mock", "Respect"], correct: 2, category: "Disapproval" },
    { word: "Censure", options: ["Approve", "Reward", "Criticize formally", "Forgive"], correct: 2, category: "Disapproval" },
    { word: "Forthright", options: ["Deceitful", "Evasive", "Direct and honest", "Silent"], correct: 2, category: "Honesty" },
    { word: "Candid", options: ["Dishonest", "Secretive", "Frank", "Deceptive"], correct: 2, category: "Honesty" },
    { word: "Veracious", options: ["False", "Lying", "Truthful", "Misleading"], correct: 2, category: "Honesty" },
    { word: "Scrupulous", options: ["Careless", "Dishonest", "Morally principled", "Reckless"], correct: 2, category: "Honesty" },
    { word: "Charlatan", options: ["Expert", "Professional", "Scholar", "Fraud"], correct: 3, category: "Deception" },
    { word: "Duplicitous", options: ["Honest", "Sincere", "Straightforward", "Deceitful"], correct: 3, category: "Deception" },
    { word: "Dissemble", options: ["Reveal", "Confess", "Admit", "Conceal motives"], correct: 3, category: "Deception" },
    { word: "Prevaricate", options: ["Tell truth", "Speak clearly", "Be direct", "Avoid truth"], correct: 3, category: "Deception" },
    { word: "Audacity", options: ["Timidity", "Fear", "Caution", "Boldness"], correct: 3, category: "Courage" },
    { word: "Valiant", options: ["Weak", "Timid", "Afraid", "Brave"], correct: 3, category: "Courage" },
    { word: "Timorous", options: ["Bold", "Confident", "Brave", "Fearful"], correct: 3, category: "Cowardice" },
    { word: "Poltroon", options: ["Hero", "Champion", "Warrior", "Coward"], correct: 3, category: "Cowardice" },
    { word: "Erudite", options: ["Scholarly", "Ignorant", "Foolish", "Simple"], correct: 0, category: "Intelligence" },
    { word: "Asinine", options: ["Extremely stupid", "Smart", "Clever", "Wise"], correct: 0, category: "Foolishness" },
    { word: "Obdurate", options: ["Stubbornly persistent", "Yielding", "Soft", "Flexible"], correct: 0, category: "Stubbornness" },
    { word: "Pliable", options: ["Easily bent", "Rigid", "Inflexible", "Stubborn"], correct: 0, category: "Flexibility" },
    { word: "Malleable", options: ["Easily shaped", "Fixed", "Rigid", "Unyielding"], correct: 0, category: "Flexibility" },
    { word: "Amenable", options: ["Open to suggestion", "Resistant", "Defiant", "Stubborn"], correct: 0, category: "Flexibility" },
    { word: "Tractable", options: ["Easily managed", "Difficult", "Stubborn", "Rebellious"], correct: 0, category: "Flexibility" },
    { word: "Avarice", options: ["Extreme greed", "Generosity", "Charity", "Kindness"], correct: 0, category: "Greed" },
    { word: "Rapacious", options: ["Aggressively greedy", "Generous", "Kind", "Selfless"], correct: 0, category: "Greed" },
    { word: "Avaricious", options: ["Extremely greedy", "Charitable", "Giving", "Generous"], correct: 0, category: "Greed" },
    { word: "Covetous", options: ["Enviously desiring", "Content", "Satisfied", "Grateful"], correct: 0, category: "Greed" },
    { word: "Beneficent", options: ["Generous and kind", "Selfish", "Greedy", "Mean"], correct: 0, category: "Generosity" },
    { word: "Munificent", options: ["Very generous", "Stingy", "Cheap", "Greedy"], correct: 0, category: "Generosity" },
    { word: "Magnanimous", options: ["Generous in forgiving", "Petty", "Vengeful", "Spiteful"], correct: 0, category: "Generosity" },
    { word: "Altruistic", options: ["Selflessly concerned", "Selfish", "Greedy", "Self-centered"], correct: 0, category: "Generosity" },
    { word: "Terse", options: ["Brief and to the point", "Lengthy", "Elaborate", "Detailed"], correct: 0, category: "Brevity" },
    { word: "Succinct", options: ["Briefly expressed", "Rambling", "Verbose", "Long"], correct: 0, category: "Brevity" },
    { word: "Pithy", options: ["Concise and meaningful", "Wordy", "Empty", "Lengthy"], correct: 0, category: "Brevity" },
    { word: "Verbose", options: ["Using more words than needed", "Concise", "Brief", "Terse"], correct: 0, category: "Wordiness" },
    { word: "Ephemeral", options: ["Lasting very briefly", "Permanent", "Eternal", "Enduring"], correct: 0, category: "Temporary" },
    { word: "Transient", options: ["Lasting only briefly", "Permanent", "Fixed", "Eternal"], correct: 0, category: "Temporary" },
    { word: "Fleeting", options: ["Passing quickly", "Lasting", "Permanent", "Enduring"], correct: 0, category: "Temporary" },
    { word: "Evanescent", options: ["Quickly fading", "Permanent", "Lasting", "Eternal"], correct: 0, category: "Temporary" },
    { word: "Immutable", options: ["Unchangeable", "Changeable", "Flexible", "Variable"], correct: 0, category: "Permanent" },
    { word: "Indelible", options: ["Cannot be removed", "Temporary", "Erasable", "Fleeting"], correct: 0, category: "Permanent" },
    { word: "Perpetual", options: ["Never ending", "Temporary", "Brief", "Short-lived"], correct: 0, category: "Permanent" },
    { word: "Abeyance", options: ["Active use", "Progression", "Temporary suspension", "Celebration"], correct: 2, category: "State" },
    { word: "Abstemious", options: ["Indulgent", "Gluttonous", "Moderate", "Wasteful"], correct: 2, category: "Temperance" },
    { word: "Alacrity", options: ["Slowness", "Reluctance", "Cheerful readiness", "Laziness"], correct: 2, category: "Enthusiasm" },
    { word: "Apotheosis", options: ["Decline", "Downfall", "Highest point", "Beginning"], correct: 2, category: "Peak" },
    { word: "Aspersion", options: ["Praise", "Compliment", "Slanderous attack", "Support"], correct: 2, category: "Defamation" },
    { word: "Baleful", options: ["Beneficial", "Helpful", "Threatening harm", "Kind"], correct: 2, category: "Menace" },
    { word: "Bombast", options: ["Simplicity", "Clarity", "Pompous language", "Brevity"], correct: 2, category: "Speech" },
    { word: "Calumny", options: ["Truth", "Honesty", "False defamation", "Praise"], correct: 2, category: "Slander" },
    { word: "Chimera", options: ["Reality", "Fact", "Impossible illusion", "Truth"], correct: 2, category: "Fantasy" },
    { word: "Churlish", options: ["Polite", "Kind", "Rudely surly", "Gentle"], correct: 2, category: "Rudeness" },
    { word: "Circuitous", options: ["Direct", "Straight", "Roundabout", "Simple"], correct: 2, category: "Indirect" },
    { word: "Demagogue", options: ["Honest leader", "Servant", "Manipulative leader", "Follower"], correct: 2, category: "Politics" },
    { word: "Desultory", options: ["Focused", "Planned", "Random and unfocused", "Systematic"], correct: 2, category: "Aimlessness" },
    { word: "Dichotomy", options: ["Unity", "Wholeness", "Division into two", "Combination"], correct: 2, category: "Division" },
    { word: "Diffidence", options: ["Confidence", "Arrogance", "Shyness", "Boldness"], correct: 2, category: "Modesty" },
    { word: "Dilettante", options: ["Expert", "Professional", "Amateur dabbler", "Master"], correct: 2, category: "Commitment" },
    { word: "Edify", options: ["Corrupt", "Degrade", "Improve morally", "Destroy"], correct: 2, category: "Improvement" },
    { word: "Effrontery", options: ["Respect", "Humility", "Insolent audacity", "Politeness"], correct: 2, category: "Impudence" },
    { word: "Egregious", options: ["Good", "Acceptable", "Outstandingly bad", "Excellent"], correct: 2, category: "Extreme" },
    { word: "Ennui", options: ["Excitement", "Interest", "Boredom", "Enthusiasm"], correct: 2, category: "Dissatisfaction" },
    { word: "Epicurean", options: ["Ascetic", "Austere", "Devoted to pleasure", "Frugal"], correct: 2, category: "Pleasure" },
    { word: "Feckless", options: ["Responsible", "Effective", "Lacking initiative", "Competent"], correct: 2, category: "Ineffectiveness" },
    { word: "Fecundity", options: ["Barrenness", "Sterility", "Fertility", "Infertility"], correct: 2, category: "Productivity" },
];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function VocabView() {
    const questions = useMemo(() => shuffle(vocabQuestionsBank), []);
    const confirmDialog = useConfirm();

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);

    /* Load progress from localStorage */
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('assessra_vocab_progress'));
            if (saved) {
                setCurrent(saved.current || 0);
                setScore(saved.score || 0);
                setAnswered(saved.answered || 0);
            }
        } catch { }
    }, []);

    function saveProgress(c, s, a) {
        localStorage.setItem('assessra_vocab_progress', JSON.stringify({ current: c, score: s, answered: a }));
    }

    function handleAnswer(idx) {
        if (selected !== null) return;
        const isCorrect = idx === questions[current].correct;
        setSelected(idx);
        const newScore = isCorrect ? score + 1 : score;
        const newAnswered = answered + 1;
        setScore(newScore);
        setAnswered(newAnswered);
        saveProgress(current, newScore, newAnswered);
    }

    function nextQuestion() {
        const next = current + 1;
        if (next >= questions.length) {
            setShowResult(true);
            return;
        }
        setCurrent(next);
        setSelected(null);
        saveProgress(next, score, answered);
    }

    const handleResetAll = async () => {
        const isConfirmed = await confirmDialog('Reset Progress', 'Are you sure you want to reset all vocabulary progress? This action cannot be undone.');
        if (!isConfirmed) return;
        setCurrent(0);
        setScore(0);
        setAnswered(0);
        setSelected(null);
        setShowResult(false);
        localStorage.removeItem('assessra_vocab_progress');
    };

    if (showResult || current >= questions.length) {
        const pct = answered > 0 ? Math.round((score / answered) * 100) : 0;
        return (
            <div style={{ maxWidth: 700, margin: '0 auto', padding: 50, textAlign: 'center' }}>
                <h1 style={{ color: 'var(--lime-dark)', fontSize: '3.5rem', marginBottom: 30, fontWeight: 800 }}>🎉 Quiz Complete!</h1>
                <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '3px solid var(--lime-primary)', borderRadius: 16, padding: 40, marginBottom: 30 }}>
                    <h2 style={{ fontSize: '5rem', background: 'linear-gradient(135deg, var(--lime-primary), #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, fontWeight: 800 }}>{pct}%</h2>
                    <p style={{ fontSize: '1.8rem', color: '#666', marginTop: 15, fontWeight: 600 }}>{score} / {answered} Correct</p>
                </div>
                <button className="nav-btn" onClick={handleResetAll} style={{ background: 'var(--lime-primary)', color: 'white', padding: '18px 40px', fontSize: '1.2rem', fontWeight: 700, borderRadius: 10, boxShadow: '0 4px 12px rgba(132,204,22,0.3)' }}>🔄 Restart Quiz</button>
            </div>
        );
    }

    const q = questions[current];
    const pct = answered > 0 ? Math.round((score / answered) * 100) : 0;

    return (
        <div style={{ display: 'flex', gap: 30, padding: '30px 0', maxWidth: 1400, margin: '0 auto' }}>
            {/* Scorecard panel */}
            <div style={{ flex: '0 0 300px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 16, padding: 30, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', height: 'fit-content', position: 'sticky', top: 20, border: '1px solid rgba(132,204,22,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 25, paddingBottom: 15, borderBottom: '2px solid var(--lime-primary)' }}>
                    <span style={{ fontSize: '1.8rem' }}>📊</span>
                    <h3 style={{ color: 'var(--lime-dark)', margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Scorecard</h3>
                </div>
                <div style={{ background: 'white', borderRadius: 12, padding: 25, marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--lime-primary), #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', lineHeight: 1 }}>{pct}%</div>
                    <div style={{ textAlign: 'center', color: '#666', marginTop: 10, fontWeight: 500 }}>{score} / {answered} Correct</div>
                </div>
                <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span style={{ color: '#666' }}>Current:</span><strong style={{ color: 'var(--lime-dark)' }}>{current + 1} of {questions.length}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Remaining:</span><strong style={{ color: 'var(--lime-dark)' }}>{questions.length - current - 1}</strong></div>
                </div>
                <div style={{ position: 'relative', height: 12, background: '#e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', height: '100%', background: 'linear-gradient(90deg, var(--lime-primary), #16a34a)', width: `${((current + 1) / questions.length) * 100}%`, borderRadius: 6, transition: 'width 0.5s' }} />
                </div>
                <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: 8 }}>{Math.round(((current + 1) / questions.length) * 100)}% Complete</div>
                <button onClick={handleResetAll} style={{ width: '100%', marginTop: 20, padding: 12, background: 'white', border: '2px solid var(--lime-primary)', color: 'var(--lime-dark)', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>🔄 Reset Progress</button>
            </div>

            {/* Question area */}
            <div style={{ flex: 1 }}>
                <h2 style={{ color: 'var(--lime-dark)', marginTop: 0, marginBottom: 30, fontSize: '2rem', fontWeight: 700 }}>Vocabulary Quiz</h2>
                <div style={{ background: 'white', borderRadius: 12, padding: 30, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: 10, color: '#666', fontSize: '0.95rem', fontWeight: 500 }}>📚 Category: {q.category}</div>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: 30, color: '#333', fontWeight: 600 }}>
                        What does &ldquo;<strong style={{ color: 'var(--lime-dark)' }}>{q.word}</strong>&rdquo; mean?
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {q.options.map((opt, idx) => {
                            let bg = 'white', border = '#e0e0e0', color = '#333';
                            if (selected !== null) {
                                if (idx === q.correct) { bg = '#22c55e'; border = '#22c55e'; color = 'white'; }
                                else if (idx === selected && idx !== q.correct) { bg = '#ef4444'; border = '#ef4444'; color = 'white'; }
                            }
                            return (
                                <button key={idx} disabled={selected !== null} onClick={() => handleAnswer(idx)}
                                    style={{ padding: '18px 24px', border: `2px solid ${border}`, borderRadius: 10, background: bg, color, textAlign: 'left', fontSize: '1.1rem', cursor: selected !== null ? 'not-allowed' : 'pointer', fontWeight: 500, transition: 'all 0.2s' }}>
                                    <strong style={{ color: selected !== null ? color : 'var(--lime-dark)' }}>{String.fromCharCode(65 + idx)}.</strong> {opt}
                                </button>
                            );
                        })}
                    </div>
                    {selected !== null && (
                        <div style={{ marginTop: 30, padding: 20, borderRadius: 8, background: selected === q.correct ? '#f0fdf4' : '#fef2f2', textAlign: 'center' }}>
                            <h3 style={{ color: selected === q.correct ? '#22c55e' : '#ef4444', marginBottom: 10, fontSize: '1.4rem' }}>
                                {selected === q.correct ? '✅ Correct!' : '❌ Incorrect'}
                            </h3>
                            <p style={{ fontSize: '1.1rem' }}><strong>Answer:</strong> {String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}</p>
                        </div>
                    )}
                    {selected !== null && (
                        <button onClick={nextQuestion} style={{ width: '100%', padding: 16, marginTop: 20, background: 'var(--lime-primary)', color: 'white', border: 'none', borderRadius: 10, fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(132,204,22,0.3)' }}>Next Question →</button>
                    )}
                </div>
            </div>
        </div>
    );
}
