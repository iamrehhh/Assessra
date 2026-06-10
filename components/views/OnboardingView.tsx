'use client';

import { useState, useEffect } from 'react';

export default function OnboardingView({ onComplete, userEmail }) {
    const [nickname, setNickname] = useState('');
    const [level, setLevel] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nickname.trim()) {
            setError('Please choose a nickname.');
            return;
        }
        if (!level) {
            setError('Please select what you are appearing for.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nickname: nickname.trim(),
                    level,
                    isOnboarded: true
                }),
            });

            if (!res.ok) throw new Error('Failed to save profile');

            const data = await res.json();
            if (onComplete) onComplete(data.user);
        } catch (err) {
            console.error('Onboarding error:', err);
            setError('Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Elegant Dark Backdrop */}
            <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md transition-opacity duration-1000" />

            {/* Animated Ambient Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                <div className="absolute w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000 translate-x-20" />
                <div className="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000 -translate-x-20 translate-y-20" />
            </div>

            {/* Premium Glass Card */}
            <div className="relative w-full max-w-xl animate-fade-in-up">
                <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
                    
                    {/* Subtle Noise Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                    {/* Header */}
                    <div className="relative z-10 text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] shadow-inner mb-6">
                            <img src="/sidebar-icon.png" alt="Assessra" className="w-8 h-8 object-contain drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-tight leading-tight mb-4">
                            Welcome to <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Assessra</span>
                        </h1>
                        <p className="text-white/50 text-lg font-light leading-relaxed max-w-sm mx-auto">
                            Design your academic identity and unlock a personalized learning experience.
                        </p>
                    </div>

                    {error && (
                        <div className="relative z-10 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 text-sm font-medium flex items-center gap-3 animate-shake">
                            <span className="material-symbols-outlined text-lg">error_outline</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2 group/input">
                            <label className="text-[11px] font-semibold text-white/40 group-focus-within/input:text-emerald-400 transition-colors uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                Account Email
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    disabled
                                    value={userEmail || ''}
                                    className="w-full p-4 pl-12 rounded-2xl border border-white/[0.05] bg-black/40 text-white/50 font-medium shadow-inner cursor-not-allowed"
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[20px]">lock</span>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Nickname Field */}
                        <div className="space-y-2 group/input">
                            <label className="text-[11px] font-semibold text-white/40 group-focus-within/input:text-emerald-400 transition-colors uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                Alias / Nickname
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="What should we call you?"
                                    maxLength={20}
                                    className="w-full p-4 pl-12 rounded-2xl border border-white/10 bg-white/[0.02] text-white font-medium focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner placeholder:text-white/20"
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-[20px] group-focus-within/input:text-emerald-400 transition-colors">badge</span>
                            </div>
                        </div>

                        {/* Level Field */}
                        <div className="space-y-2 group/input mb-10">
                            <label className="text-[11px] font-semibold text-white/40 group-focus-within/input:text-emerald-400 transition-colors uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                Academic Focus
                            </label>
                            <div className="relative">
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full p-4 pl-12 pr-12 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md text-white font-medium focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner appearance-none cursor-pointer"
                                >
                                    <option value="" disabled className="bg-[#111] text-white/50">Select your examination level...</option>
                                    <option value="IGCSE" className="bg-[#111] text-white">IGCSE</option>
                                    <option value="AS Level" className="bg-[#111] text-white">AS Level</option>
                                    <option value="A Level" className="bg-[#111] text-white">A Level</option>
                                </select>
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-[20px] group-focus-within/input:text-emerald-400 transition-colors">school</span>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <span className="material-symbols-outlined text-white/40 text-[20px]">unfold_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex items-center justify-center gap-3 py-4 sm:py-5 rounded-2xl font-bold uppercase tracking-[0.15em] text-sm transition-all duration-500 ${
                                    isSubmitting 
                                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' 
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1'
                                }`}
                            >
                                {isSubmitting ? (
                                    <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Finalizing...</>
                                ) : (
                                    <>Enter Assessra <span className="material-symbols-outlined text-[18px]">east</span></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

