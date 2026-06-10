'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
    OAuthSignin: 'Could not start Google sign-in. Check server configuration.',
    OAuthCallback: 'Google sign-in failed. Check redirect URI in Google Console.',
    OAuthCreateAccount: 'Could not create account. Check database connection.',
    Callback: 'Authentication callback error.',
    Default: 'Sign-in failed. Please try again.',
    Configuration: 'Server misconfigured — missing environment variables.',
    AccessDenied: 'Access denied.',
    CredentialsSignin: 'Invalid email or password.',
};

const FEATURES = [
    {
        icon: 'auto_stories',
        title: 'Past Paper Practice',
        description: 'Access a comprehensive library of Cambridge IGCSE, AS & A Level past papers with structured question blocks.',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        iconColor: 'text-emerald-400',
    },
    {
        icon: 'psychology',
        title: 'AI-Powered Grading',
        description: 'Get instant, intelligent feedback on your answers using GPT-4o with mark scheme context.',
        gradient: 'from-violet-500/20 to-purple-500/20',
        iconColor: 'text-violet-400',
    },
    {
        icon: 'leaderboard',
        title: 'Compete & Track',
        description: 'Climb the leaderboard, earn XP, track your streak, and see how you rank against other students.',
        gradient: 'from-amber-500/20 to-orange-500/20',
        iconColor: 'text-amber-400',
    },
    {
        icon: 'menu_book',
        title: 'Study Resources',
        description: 'Vocabulary builders, idiom practice, tense drills, formulae sheets, and key definitions — all in one place.',
        gradient: 'from-sky-500/20 to-blue-500/20',
        iconColor: 'text-sky-400',
    },
    {
        icon: 'timer',
        title: 'Timed Practice',
        description: 'Simulate real exam conditions with subject-specific timers and automatic progress tracking.',
        gradient: 'from-rose-500/20 to-pink-500/20',
        iconColor: 'text-rose-400',
    },
    {
        icon: 'analytics',
        title: 'Performance Analytics',
        description: 'Monitor your daily progress, cumulative scores, and get personalized study recommendations.',
        gradient: 'from-cyan-500/20 to-teal-500/20',
        iconColor: 'text-cyan-400',
    },
];

const STEPS = [
    {
        number: '01',
        title: 'Create Your Account',
        description: 'Sign up in seconds with email or Google. Complete a quick onboarding to personalize your experience.',
        icon: 'person_add',
    },
    {
        number: '02',
        title: 'Choose Your Subject',
        description: 'Pick from Business, Economics, or General Paper. Access past papers sorted by year and series.',
        icon: 'school',
    },
    {
        number: '03',
        title: 'Practice & Improve',
        description: 'Answer questions, get AI-graded feedback with model answers, and watch your scores climb.',
        icon: 'trending_up',
    },
];

const SUBJECTS = [
    { name: 'Business', code: '9609', papers: 'Papers 3 & 4', level: 'A Level', color: 'from-emerald-600 to-green-500' },
    { name: 'Economics', code: '9708', papers: 'Papers 3 & 4', level: 'A Level', color: 'from-blue-600 to-cyan-500' },
    { name: 'General Paper', code: '8021', papers: 'Papers 1 & 2', level: 'AS Level', color: 'from-purple-600 to-violet-500' },
    { name: 'Biology', code: '0610', papers: 'Paper 2', level: 'IGCSE', color: 'from-teal-600 to-emerald-500' },
    { name: 'Physics', code: '0625', papers: 'Paper 2', level: 'IGCSE', color: 'from-orange-600 to-amber-500' },
    { name: 'History', code: '0470', papers: 'Papers 1 & 4', level: 'IGCSE', color: 'from-rose-600 to-red-500' },
];

// ─── Animated Counter Hook ───
function useCounter(target: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        let rafId: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.round(eased * target));
            if (progress < 1) rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [target, duration, start]);
    return count;
}

// ─── IntersectionObserver reveal hook ───
function useReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return { ref, visible };
}

// ─── Floating Particles Background ───
function ParticlesBackground() {
    return (
        <div className="landing-particles" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="landing-particle"
                    style={{
                        left: `${(i * 5.26) % 100}%`,
                        top: `${(i * 7.37 + 10) % 100}%`,
                        animationDelay: `${(i * 0.7) % 8}s`,
                        animationDuration: `${6 + (i % 5) * 2}s`,
                        width: `${3 + (i % 4) * 2}px`,
                        height: `${3 + (i % 4) * 2}px`,
                        opacity: 0.15 + (i % 5) * 0.08,
                    }}
                />
            ))}
        </div>
    );
}

// ─── Auth Form (inline in landing) ───
function AuthForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const errorType = searchParams.get('error');
    const urlError = errorType ? (errorMessages[errorType] || errorMessages.Default) : null;

    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }
        if (isSignUp && !name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        setLoading(true);

        if (isSignUp) {
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
                });
                const data = await res.json();
                if (!res.ok) { setLoading(false); setError(data.error || 'Registration failed.'); return; }

                const result = await signIn('credentials', { email: email.trim(), password, redirect: false });
                setLoading(false);
                if (result?.error) {
                    setError('Account created but auto sign-in failed. Please sign in manually.');
                    setIsSignUp(false);
                } else if (result?.ok) {
                    router.refresh();
                }
            } catch {
                setLoading(false);
                setError('Network error. Please try again.');
            }
        } else {
            const result = await signIn('credentials', { email: email.trim(), password, redirect: false });
            setLoading(false);
            if (result?.error) {
                setError('Invalid email or password.');
            } else if (result?.ok) {
                router.refresh();
            }
        }
    };

    const displayError = error || urlError;

    return (
        <div className="landing-auth-card">
            <h3 className="text-2xl font-black text-white mb-1 tracking-tight">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h3>
            <p className="text-white/50 text-sm mb-6">
                {isSignUp ? 'Join thousands of students preparing smarter.' : 'Sign in to continue your prep.'}
            </p>

            {displayError && (
                <div className="landing-auth-error">⚠️ {displayError}</div>
            )}
            {success && (
                <div className="landing-auth-success">✅ {success}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                {isSignUp && (
                    <input
                        type="text"
                        className="landing-auth-input"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        disabled={loading}
                    />
                )}
                <input
                    type="email"
                    className="landing-auth-input"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                />
                <input
                    type="password"
                    className="landing-auth-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="landing-auth-submit"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="landing-auth-spinner" />
                            {isSignUp ? 'Creating account...' : 'Signing in...'}
                        </span>
                    ) : (
                        isSignUp ? 'Create Account' : 'Sign In'
                    )}
                </button>
            </form>

            <div className="text-center text-sm text-white/40 mt-4">
                {isSignUp ? (
                    <>Already have an account?{' '}
                        <button onClick={() => { setIsSignUp(false); setError(null); setSuccess(null); }} className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                            Sign In
                        </button>
                    </>
                ) : (
                    <>Don&apos;t have an account?{' '}
                        <button onClick={() => { setIsSignUp(true); setError(null); setSuccess(null); }} className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                            Create one
                        </button>
                    </>
                )}
            </div>

            <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10" />
            </div>

            <button className="landing-google-btn" onClick={() => signIn('google')}>
                <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.14 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Continue with Google
            </button>
        </div>
    );
}

// ─── Main Landing Page ───
function LandingContent() {
    const heroReveal = useReveal(0.1);
    const featuresReveal = useReveal(0.1);
    const stepsReveal = useReveal(0.1);
    const subjectsReveal = useReveal(0.1);
    const statsReveal = useReveal(0.1);
    const ctaReveal = useReveal(0.1);

    const stat1 = useCounter(3, 1500, statsReveal.visible);
    const stat2 = useCounter(500, 2000, statsReveal.visible);
    const stat3 = useCounter(50, 1800, statsReveal.visible);

    const scrollToAuth = () => {
        document.getElementById('landing-auth')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page">
            {/* ── Navbar ── */}
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <div className="flex items-center gap-3">
                        <img src="/sidebar-icon.png" alt="Assessra" className="w-9 h-9 object-contain" />
                        <span className="text-xl font-black tracking-tighter uppercase italic text-white">Assessra</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Features</a>
                        <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors font-medium">How It Works</a>
                        <a href="#subjects" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Subjects</a>
                        <button onClick={scrollToAuth} className="landing-nav-cta">
                            Get Started
                        </button>
                    </div>
                    <button onClick={scrollToAuth} className="md:hidden landing-nav-cta">
                        Sign In
                    </button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="landing-hero" ref={heroReveal.ref}>
                <ParticlesBackground />
                <div className="landing-hero-glow" aria-hidden="true" />

                <div className={`landing-hero-content ${heroReveal.visible ? 'landing-revealed' : ''}`}>
                    <div className="landing-hero-text">
                        <div className="landing-badge">
                            <span className="landing-badge-dot" />
                            AI-Powered Exam Preparation
                        </div>

                        <h1 className="landing-hero-title">
                            Master Your <br />
                            <span className="landing-gradient-text">Cambridge Exams</span>
                        </h1>

                        <p className="landing-hero-subtitle">
                            Practice with real IGCSE & A Level past papers, get instant AI grading with detailed feedback, 
                            and track your progress — all in one beautiful platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <button onClick={scrollToAuth} className="landing-cta-primary">
                                <span className="material-symbols-outlined text-xl">rocket_launch</span>
                                Start Practicing Free
                            </button>
                            <a href="#features" className="landing-cta-secondary">
                                <span className="material-symbols-outlined text-xl">arrow_downward</span>
                                Explore Features
                            </a>
                        </div>
                    </div>

                    <div className="landing-hero-visual">
                        <div className="landing-hero-card">
                            <div className="landing-hero-card-header">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <span className="text-xs text-white/40 font-mono">assessra.app</span>
                            </div>
                            <div className="landing-hero-card-body">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Score</p>
                                        <p className="text-xl font-black text-white">2,847 <span className="text-xs text-emerald-400 font-bold">XP</span></p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-white/50">Daily Goal</span>
                                        <span className="text-xs font-bold text-emerald-400">78%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full landing-progress-animate" style={{ width: '78%' }} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {['🔥 12 Day Streak', '📊 Rank #3', '✅ 45 Papers'].map((item, i) => (
                                            <div key={i} className="bg-white/5 rounded-lg p-2 text-center">
                                                <span className="text-[10px] text-white/70 font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section className="landing-stats" ref={statsReveal.ref}>
                <div className={`landing-stats-inner ${statsReveal.visible ? 'landing-revealed' : ''}`}>
                    <div className="landing-stat-item">
                        <span className="landing-stat-number">{stat1}</span>
                        <span className="landing-stat-label">Subjects Available</span>
                    </div>
                    <div className="landing-stat-divider" />
                    <div className="landing-stat-item">
                        <span className="landing-stat-number">{stat2}+</span>
                        <span className="landing-stat-label">Papers Solved</span>
                    </div>
                    <div className="landing-stat-divider" />
                    <div className="landing-stat-item">
                        <span className="landing-stat-number">{stat3}+</span>
                        <span className="landing-stat-label">Active Students</span>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="landing-section" id="features" ref={featuresReveal.ref}>
                <div className={`landing-section-inner ${featuresReveal.visible ? 'landing-revealed' : ''}`}>
                    <div className="text-center mb-16">
                        <span className="landing-section-tag">Features</span>
                        <h2 className="landing-section-title">Everything You Need to Excel</h2>
                        <p className="landing-section-subtitle">
                            Built by students, for students — with cutting-edge AI to supercharge your exam preparation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feature, i) => (
                            <div
                                key={feature.title}
                                className="landing-feature-card"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className={`landing-feature-icon bg-gradient-to-br ${feature.gradient}`}>
                                    <span className={`material-symbols-outlined text-2xl ${feature.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {feature.icon}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mt-4 mb-2">{feature.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="landing-section landing-section-alt" id="how-it-works" ref={stepsReveal.ref}>
                <div className={`landing-section-inner ${stepsReveal.visible ? 'landing-revealed' : ''}`}>
                    <div className="text-center mb-16">
                        <span className="landing-section-tag">How It Works</span>
                        <h2 className="landing-section-title">Get Started in 3 Simple Steps</h2>
                        <p className="landing-section-subtitle">
                            From sign-up to your first AI-graded paper in under 5 minutes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {STEPS.map((step, i) => (
                            <div key={step.number} className="landing-step-card" style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="landing-step-number">{step.number}</div>
                                <div className="landing-step-icon-wrap">
                                    <span className="material-symbols-outlined text-3xl text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {step.icon}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mt-5 mb-3">{step.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Subjects ── */}
            <section className="landing-section" id="subjects" ref={subjectsReveal.ref}>
                <div className={`landing-section-inner ${subjectsReveal.visible ? 'landing-revealed' : ''}`}>
                    <div className="text-center mb-16">
                        <span className="landing-section-tag">Subjects</span>
                        <h2 className="landing-section-title">Cambridge IGCSE & A Level</h2>
                        <p className="landing-section-subtitle">
                            Comprehensive past paper coverage for the subjects that matter most.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {SUBJECTS.map((subj, i) => (
                            <div key={subj.code} className="landing-subject-card" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={`landing-subject-gradient bg-gradient-to-br ${subj.color}`} />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-white/40 font-mono font-bold">{subj.code}</span>
                                        <span className="text-[10px] uppercase tracking-widest font-black text-white/60 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">{subj.level}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mt-1">{subj.name}</h3>
                                    <p className="text-white/50 text-sm mt-2">{subj.papers}</p>
                                    <div className="flex items-center gap-2 mt-4 text-emerald-400">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Available Now</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA + Auth ── */}
            <section className="landing-section landing-section-alt" id="landing-auth" ref={ctaReveal.ref}>
                <div className={`landing-section-inner ${ctaReveal.visible ? 'landing-revealed' : ''}`}>
                    <div className="landing-cta-section">
                        <div className="landing-cta-text">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                Ready to Ace Your<br />
                                <span className="landing-gradient-text">Next Exam?</span>
                            </h2>
                            <p className="text-white/50 text-lg mt-4 max-w-md leading-relaxed">
                                Join students who are already using AI-powered practice to improve their grades. 
                                Free to get started — no credit card required.
                            </p>
                            <div className="flex items-center gap-6 mt-8">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <span className="text-sm text-white/60">Free forever</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <span className="text-sm text-white/60">AI grading</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <span className="text-sm text-white/60">Instant access</span>
                                </div>
                            </div>
                        </div>
                        <Suspense fallback={<div className="landing-auth-card"><div className="h-64 skeleton-pulse rounded-2xl" /></div>}>
                            <AuthForm />
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="flex items-center gap-3">
                        <img src="/sidebar-icon.png" alt="Assessra" className="w-7 h-7 object-contain opacity-60" />
                        <span className="text-sm font-bold text-white/40 uppercase tracking-wider italic">Assessra</span>
                    </div>
                    <p className="text-xs text-white/30 flex items-center gap-2 flex-wrap justify-center">
                        © 2025 Assessra
                        <span className="text-white/15">|</span>
                        <a href="mailto:abdulrehanoffical@gmail.com" className="hover:text-white/60 transition-colors">abdulrehanoffical@gmail.com</a>
                        <span className="text-white/15">|</span>
                        <a href="https://github.com/iamrehhh/Assessra-v2" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">GitHub</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default function LandingPage() {
    return <LandingContent />;
}
