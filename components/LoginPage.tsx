'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

const errorMessages = {
    OAuthSignin: 'Could not start Google sign-in. Check server configuration.',
    OAuthCallback: 'Google sign-in failed. Check redirect URI in Google Console.',
    OAuthCreateAccount: 'Could not create account. Check database connection.',
    Callback: 'Authentication callback error.',
    Default: 'Sign-in failed. Please try again.',
    Configuration: 'Server misconfigured — missing environment variables.',
    AccessDenied: 'Access denied.',
    CredentialsSignin: 'Invalid email or password.',
};

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const errorType = searchParams.get('error');
    const urlError = errorType ? (errorMessages[errorType] || errorMessages.Default) : null;

    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
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
            // Register first, then auto sign-in
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setLoading(false);
                    setError(data.error || 'Registration failed.');
                    return;
                }

                // Auto sign-in after successful registration
                const result = await signIn('credentials', {
                    email: email.trim(),
                    password,
                    redirect: false,
                });

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
            // Sign in
            const result = await signIn('credentials', {
                email: email.trim(),
                password,
                redirect: false,
            });

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
        <div className="login-screen">
            <div className="login-card">
                <div className="login-logo-container">
                    <img src="/new-logo.png" alt="Assessra Premium Assessment Solutions" className="login-logo-img" />
                </div>

                {displayError && (
                    <div className="error-msg" style={{ marginBottom: '15px' }}>
                        ⚠️ {displayError}
                    </div>
                )}

                {success && (
                    <div style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 600, marginBottom: '15px', textAlign: 'center' }}>
                        ✅ {success}
                    </div>
                )}

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    {isSignUp && (
                        <div className="input-group">
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={loading}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading
                            ? (isSignUp ? 'Creating account...' : 'Signing in...')
                            : (isSignUp ? 'Create Account' : 'Sign In')
                        }
                    </button>
                </form>

                {/* Toggle Sign In / Sign Up */}
                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                    {isSignUp ? (
                        <>Already have an account?{' '}
                            <span
                                onClick={() => { setIsSignUp(false); setError(null); setSuccess(null); }}
                                style={{ color: 'var(--lime-primary)', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Sign In
                            </span>
                        </>
                    ) : (
                        <>Don&apos;t have an account?{' '}
                            <span
                                onClick={() => { setIsSignUp(true); setError(null); setSuccess(null); }}
                                style={{ color: 'var(--lime-primary)', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Create one
                            </span>
                        </>
                    )}
                </div>

                {/* Divider */}
                <div className="divider-container">
                    <div className="divider-line" />
                    <span className="divider-text">or</span>
                    <div className="divider-line" />
                </div>

                {/* Google Sign-In */}
                <button
                    className="google-btn"
                    onClick={() => signIn('google')}
                >
                    <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.14 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="loading-overlay">
                <div className="spinner" />
                <div className="loading-text">Loading...</div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
