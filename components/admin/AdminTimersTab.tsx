import { useState, useEffect } from 'react';

interface TimerTabProps {
    showAlert: (title: string, message: string) => void;
}

export default function AdminTimersTab({ showAlert }: TimerTabProps) {
    const [loading, setLoading] = useState(true);
    const [timers, setTimers] = useState<Record<string, number>>({});
    const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
    const [savingSubject, setSavingSubject] = useState<string | null>(null);
    const [openLevel, setOpenLevel] = useState<string | null>(null);

    // Form states for each subject are stored locally here
    const [inputValues, setInputValues] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const subRes = await fetch('/api/past-papers/available');
                const subData = await subRes.json();
                
                const timerRes = await fetch('/api/mcq-timers');
                const timerData = await timerRes.json();

                if (timerData.success) {
                    setTimers(timerData.timers || {});
                }

                if (subData.success && subData.documents) {
                    const mcqSubjects = [
                        { id: 'biology-p2', name: 'Biology (Paper 2)', level: 'igcse' },
                        { id: 'physics-p2', name: 'Physics (Paper 2)', level: 'igcse' },
                        { id: 'economics-p3', name: 'Economics (Paper 3)', level: 'alevel' }
                    ];
                    
                    setAvailableSubjects(mcqSubjects);
                    
                    const initialInputs: Record<string, string> = {};
                    mcqSubjects.forEach(sub => {
                        initialInputs[sub.id] = timerData.timers[sub.id]?.toString() || '75';
                    });
                    setInputValues(initialInputs);
                }
            } catch (err) {
                console.error("Failed to load timer data", err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSave = async (subjectId: string) => {
        const val = parseInt(inputValues[subjectId], 10);
        if (isNaN(val) || val < 1 || val > 300) {
            showAlert('Invalid Duration', 'Please enter a valid time between 1 and 300 minutes.');
            return;
        }

        setSavingSubject(subjectId);
        try {
            const res = await fetch('/api/admin/timers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject_id: subjectId, duration_minutes: val })
            });

            const data = await res.json();
            if (res.ok) {
                setTimers(prev => ({ ...prev, [subjectId]: val }));
                showAlert('Success', `Timer for ${subjectId} updated to ${val} minutes!`);
            } else {
                showAlert('Error', data.error || 'Failed to update timer.');
            }
        } catch (err) {
            showAlert('Error', 'Network error while saving.');
        }
        setSavingSubject(null);
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-20 bg-border-main/50 rounded-xl w-full"></div>
                <div className="h-20 bg-border-main/50 rounded-xl w-full"></div>
            </div>
        );
    }

    const levelConfig: Record<string, any> = {
        igcse: { emoji: '🏫', label: 'IGCSE', gradient: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30', activeBg: 'bg-blue-500/10', activeText: 'text-blue-400', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]' },
        alevel: { emoji: '🎓', label: 'A Level', gradient: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30', activeBg: 'bg-purple-500/10', activeText: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' }
    };

    const levels = ['igcse', 'alevel'];

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-text-main mb-2">MCQ Timer Settings</h2>
                <p className="text-text-muted text-sm">
                    Configure the default time limit (in minutes) for practice mode on specific MCQ papers.
                </p>
            </div>

            <div className="space-y-5">
                {levels.map(level => {
                    const config = levelConfig[level];
                    const isOpen = openLevel === level;
                    const subjects = availableSubjects.filter(s => s.level === level);
                    const activeCount = subjects.filter(s => timers[s.id]).length;

                    return (
                        <div key={level} className={`rounded-2xl border transition-all duration-500 overflow-hidden ${isOpen ? `${config.border} ${config.glow}` : 'border-border-main'}`}>
                            {/* Toggle Header */}
                            <button
                                onClick={() => setOpenLevel(isOpen ? null : level)}
                                className={`w-full flex items-center justify-between px-6 py-5 group transition-all duration-300 ${isOpen ? `bg-gradient-to-r ${config.gradient}` : 'bg-bg-card hover:bg-black/5 dark:hover:bg-white/[0.02]'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border ${isOpen ? `${config.activeBg} ${config.border}` : 'bg-black/5 dark:bg-white/5 border-border-main'}`}>
                                        <span className="text-xl">{config.emoji}</span>
                                    </div>
                                    <div className="text-left">
                                        <h3 className={`text-xl font-black tracking-tight transition-colors ${isOpen ? config.activeText : 'text-text-main'}`}>{config.label}</h3>
                                        <p className="text-text-muted text-xs font-medium mt-0.5">
                                            {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
                                            {activeCount > 0 && <span className="text-green-500 ml-2">• {activeCount} custom timer{activeCount !== 1 ? 's' : ''} active</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-500 ${isOpen ? `${config.activeBg} ${config.border}` : 'bg-black/5 dark:bg-white/5 border-border-main'}`}>
                                    <span className={`material-symbols-outlined text-xl transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'} ${isOpen ? config.activeText : 'text-text-muted'}`}>
                                        expand_more
                                    </span>
                                </div>
                            </button>

                            {/* Collapsible Content */}
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-6 pb-6 pt-2">
                                    {subjects.length === 0 ? (
                                        <div className="text-center py-8 text-text-muted">
                                            <span className="material-symbols-outlined text-3xl mb-2 opacity-30 block">timer_off</span>
                                            <p className="font-bold text-sm">No MCQ subjects for this level.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                            {subjects.map(sub => (
                                                <div key={sub.id} className="glass p-5 rounded-xl border border-border-main flex flex-col gap-3 relative overflow-hidden group hover:border-primary/30 transition-all duration-300 bg-bg-card">
                                                    {/* Status glow */}
                                                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl -mr-8 -mt-8 transition-colors ${timers[sub.id] ? 'bg-primary/10' : 'bg-black/5'}`}></div>
                                                    
                                                    <div className="flex justify-between items-start z-10">
                                                        <div>
                                                            <h3 className="font-bold text-text-main text-base mb-1 flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-primary text-lg">timer</span>
                                                                {sub.name}
                                                            </h3>
                                                            <p className="text-[10px] text-text-muted font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded inline-block">ID: {sub.id}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-end gap-3 z-10 mt-1">
                                                        <div className="flex-1">
                                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                                                                Duration (Minutes)
                                                            </label>
                                                            <div className="relative">
                                                                <input 
                                                                    type="number" 
                                                                    min="1"
                                                                    max="300"
                                                                    value={inputValues[sub.id] || ''} 
                                                                    onChange={e => setInputValues(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                                                    className="w-full bg-bg-base/80 border-2 border-border-main rounded-xl px-4 py-2.5 text-sm font-bold text-text-main focus:outline-none focus:border-primary transition-colors"
                                                                />
                                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold pointer-events-none">MINS</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <button 
                                                            onClick={() => handleSave(sub.id)}
                                                            disabled={savingSubject === sub.id || inputValues[sub.id] === timers[sub.id]?.toString()}
                                                            className="h-[42px] px-5 rounded-xl font-bold text-sm bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shrink-0"
                                                        >
                                                            {savingSubject === sub.id ? (
                                                                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                                            ) : (
                                                                <span className="material-symbols-outlined text-sm">save</span>
                                                            )}
                                                            Save
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Info banner */}
                                                    {timers[sub.id] ? (
                                                        <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[12px]">check_circle</span> Custom timer active
                                                        </div>
                                                    ) : (
                                                        <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[12px]">info</span> Using default 75 mins
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
