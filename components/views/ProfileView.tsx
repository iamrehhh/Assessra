
'use client';

import { useState, useRef } from 'react';

export default function ProfileView({ userProfile, onProfileUpdate }: { userProfile: any, onProfileUpdate: (user: any) => void }) {
    const [nickname, setNickname] = useState(userProfile?.nickname || '');
    const [level, setLevel] = useState(userProfile?.level || '');
    const [imagePreview, setImagePreview] = useState<string | null>(userProfile?.image || null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get initials fallback
    const getInitials = (nameStr: string) => {
        if (!nameStr) return '?';
        return nameStr.charAt(0).toUpperCase();
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please upload an image file (JPEG, PNG)' });
            return;
        }

        // 500kb limit for Base64 MongoDB storage
        if (file.size > 500 * 1024) {
            setMessage({ type: 'error', text: 'Image must be less than 500KB' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string); // Base64 string
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!nickname.trim()) {
            setMessage({ type: 'error', text: 'Nickname cannot be empty' });
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nickname: nickname.trim(),
                    level,
                    image: imagePreview
                }),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            const data = await res.json();
            if (onProfileUpdate) onProfileUpdate(data.user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Clear success message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error('Profile update error:', err);
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ color: 'var(--lime-dark)', fontSize: '2.5rem', marginBottom: '10px', fontWeight: 800 }}>My Profile</h1>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '40px' }}>Manage your personal details and leaderboard appearance.</p>

            <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>

                {/* Avatar Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                    <div
                        onClick={handleImageClick}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: imagePreview ? `url(${imagePreview}) center/cover no-repeat` : 'linear-gradient(135deg, var(--lime-primary), #16a34a)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '4px solid white'
                        }}
                    >
                        {!imagePreview && getInitials(nickname || userProfile?.name)}

                        {/* Hover Overlay */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                        >
                            📷 Change
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg, image/png, image/webp"
                        style={{ display: 'none' }}
                    />
                    <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '15px' }}>Click avatar to upload image (Max 500KB)</p>
                </div>

                {message.text && (
                    <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontWeight: 600,
                        background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: message.type === 'success' ? '#16a34a' : '#ef4444',
                        textAlign: 'center'
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Form fields */}
                <form onSubmit={handleSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 600 }}>Email Address</label>
                            <input
                                type="email"
                                disabled
                                value={userProfile?.email || ''}
                                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e5e7eb', background: '#f9fafb', color: '#888', fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '5px' }}>Email cannot be changed.</p>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 600 }}>Full Name</label>
                            <input
                                type="text"
                                disabled
                                value={userProfile?.name || ''}
                                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e5e7eb', background: '#f9fafb', color: '#888', fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '40px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 600 }}>Leaderboard Nickname</label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                maxLength={20}
                                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '1rem', color: '#111827', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--lime-primary)'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#444', fontWeight: 600 }}>Appearing For</label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '1rem', color: '#111827', boxSizing: 'border-box', cursor: 'pointer', backgroundColor: 'white' }}
                            >
                                <option value="IGCSE">IGCSE</option>
                                <option value="AS Level">AS Level</option>
                                <option value="A Level">A Level</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', borderTop: '1px solid #f3f4f6', paddingTop: '25px' }}>
                        <button
                            type="submit"
                            disabled={isSaving}
                            style={{
                                padding: '14px 40px',
                                background: isSaving ? '#9ca3af' : 'var(--lime-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                boxShadow: isSaving ? 'none' : '0 4px 12px rgba(132,204,22,0.3)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
