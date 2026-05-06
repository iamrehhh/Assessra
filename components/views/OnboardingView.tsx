'use client';

import { useState } from 'react';

export default function OnboardingView({ onComplete, userEmail }) {
    const [nickname, setNickname] = useState('');
    const [level, setLevel] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

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

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👋</div>
                <h1 style={{ color: 'var(--lime-dark)', fontSize: '2rem', marginBottom: '10px', fontWeight: 800 }}>Welcome to Assessra!</h1>
                <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px', lineHeight: 1.5 }}>
                    Let's get you set up. Please choose a nickname for the leaderboard and select what you are appearing for.
                </p>

                {error && (
                    <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: 600 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 600 }}>Email (Read-only)</label>
                        <input
                            type="text"
                            disabled
                            value={userEmail || ''}
                            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e5e7eb', background: '#f9fafb', color: '#888', fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 600 }}>Nickname</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="e.g. Scholar99"
                            maxLength={20}
                            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--lime-primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 600 }}>Appearing For</label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '1rem', boxSizing: 'border-box', cursor: 'pointer', backgroundColor: 'white' }}
                        >
                            <option value="" disabled>Select what you are appearing for...</option>
                            <option value="IGCSE">IGCSE</option>
                            <option value="AS Level">AS Level</option>
                            <option value="A Level">A Level</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, var(--lime-primary), #16a34a)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(132,204,22,0.3)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isSubmitting ? 'Saving...' : 'Get Started 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}
