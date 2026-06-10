'use client';

import { useState, useRef, useEffect } from 'react';

export default function ProfileView({ userProfile, onProfileUpdate }: { userProfile: any, onProfileUpdate: (user: any) => void }) {
    const [nickname, setNickname] = useState(userProfile?.nickname || '');
    const [level, setLevel] = useState(userProfile?.level || 'AS Level');
    const [imagePreview, setImagePreview] = useState<string | null>(userProfile?.image || null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoaded, setIsLoaded] = useState(false);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsLoaded(true), 50);
    }, []);

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
            setMessage({ type: 'error', text: 'Please upload an image file (JPEG, PNG, WEBP)' });
            return;
        }

        // 500kb limit for Base64 MongoDB storage
        if (file.size > 500 * 1024) {
            setMessage({ type: 'error', text: 'Image must be less than 500KB. Please compress it first.' });
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

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Please fill in all password fields.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }

        setIsChangingPassword(true);
        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password.' });
            } else {
                setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
            }
        } catch (err) {
            setPasswordMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className={`max-w-4xl mx-auto pt-4 pb-20 space-y-8 transition-all duration-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-main mb-3 flex items-center justify-center md:justify-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                        <span className="material-symbols-outlined text-primary text-3xl">manage_accounts</span>
                    </div>
                    My Profile
                </h2>
                <p className="text-text-muted text-lg md:ml-[68px]">Manage your personal details, avatar, and leaderboard appearance.</p>
            </div>

            <div className="bg-bg-card rounded-[2.5rem] p-8 md:p-12 border border-border-main shadow-sm relative overflow-hidden group">
                
                {/* Ambient background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-12 relative z-10">
                    <div className="relative group/avatar cursor-pointer" onClick={handleImageClick}>
                        {/* Glowing ring behind avatar */}
                        <div className="absolute -inset-2 bg-gradient-to-tr from-primary/40 to-primary/0 rounded-full blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500"></div>
                        
                        <div
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-4xl md:text-5xl font-black text-white overflow-hidden relative z-10 border-4 border-bg-card shadow-xl transition-transform duration-300 group-hover/avatar:scale-105 bg-black/5 dark:bg-white/5"
                            style={{
                                background: imagePreview ? `url(${imagePreview}) center/cover no-repeat` : undefined
                            }}
                        >
                            {!imagePreview && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                                    {getInitials(nickname || userProfile?.name)}
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-white text-3xl mb-1">photo_camera</span>
                                <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
                            </div>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg, image/png, image/webp"
                        className="hidden"
                    />
                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-6 bg-black/5 dark:bg-white/5 px-4 py-1.5 rounded-full border border-border-main">
                        Max Size: 500KB
                    </p>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-2xl mb-8 font-bold text-sm flex items-center justify-center gap-2 relative z-10 animate-fade-in ${
                        message.type === 'success' 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                        <span className="material-symbols-outlined text-xl">
                            {message.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        {message.text}
                    </div>
                )}

                {/* Form fields */}
                <form onSubmit={handleSave} className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Email (Disabled) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">mail</span>
                                Email Address
                            </label>
                            <input
                                type="email"
                                disabled
                                value={userProfile?.email || ''}
                                className="w-full p-4 rounded-xl border border-border-main bg-black/5 dark:bg-white/5 text-text-muted font-medium cursor-not-allowed"
                            />
                            <p className="text-[10px] text-text-muted/60 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[12px]">lock</span> Email cannot be changed
                            </p>
                        </div>

                        {/* Full Name (Disabled) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">badge</span>
                                Full Name
                            </label>
                            <input
                                type="text"
                                disabled
                                value={userProfile?.name || ''}
                                className="w-full p-4 rounded-xl border border-border-main bg-black/5 dark:bg-white/5 text-text-muted font-medium cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Nickname */}
                        <div className="space-y-2 group/input">
                            <label className="text-xs font-bold text-text-main group-focus-within/input:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">military_tech</span>
                                Leaderboard Nickname
                            </label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                maxLength={20}
                                placeholder="Enter a cool nickname"
                                className="w-full p-4 rounded-xl border border-border-main bg-transparent text-text-main font-bold focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all shadow-sm"
                            />
                        </div>

                        {/* Level */}
                        <div className="space-y-2 group/input">
                            <label className="text-xs font-bold text-text-main group-focus-within/input:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">school</span>
                                Academic Level
                            </label>
                            <div className="relative">
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full p-4 pr-12 rounded-xl border border-border-main bg-transparent text-text-main font-bold focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all shadow-sm appearance-none cursor-pointer"
                                >
                                    <option value="IGCSE" className="bg-bg-card text-text-main">IGCSE</option>
                                    <option value="AS Level" className="bg-bg-card text-text-main">AS Level</option>
                                    <option value="A Level" className="bg-bg-card text-text-main">A Level</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                    expand_more
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border-main pt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all duration-300 ${
                                isSaving 
                                    ? 'bg-black/10 dark:bg-white/10 text-text-muted cursor-not-allowed' 
                                    : 'bg-primary text-background-dark hover:scale-105 hover:shadow-[0_10px_30px_rgba(34,197,94,0.3)]'
                            }`}
                        >
                            {isSaving ? (
                                <><div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" /> Saving Changes...</>
                            ) : (
                                <><span className="material-symbols-outlined text-lg">save</span> Save Profile</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Change Section (Only for Credentials Users) */}
            {userProfile?.provider === 'credentials' && (
                <div className="bg-bg-card rounded-[2.5rem] p-8 md:p-12 border border-border-main shadow-sm relative overflow-hidden group mt-8">
                    <div className="mb-8 relative z-10">
                        <h3 className="text-2xl font-black text-text-main flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-500">lock_reset</span>
                            Change Password
                        </h3>
                        <p className="text-text-muted mt-2">Update your account password securely.</p>
                    </div>

                    {passwordMessage.text && (
                        <div className={`p-4 rounded-2xl mb-8 font-bold text-sm flex items-center justify-center gap-2 relative z-10 animate-fade-in ${
                            passwordMessage.type === 'success' 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                            <span className="material-symbols-outlined text-xl">
                                {passwordMessage.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            {passwordMessage.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="relative z-10">
                        <div className="space-y-6 mb-8">
                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold text-text-main group-focus-within/input:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full p-4 rounded-xl border border-border-main bg-transparent text-text-main font-bold focus:outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all shadow-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 group/input">
                                    <label className="text-xs font-bold text-text-main group-focus-within/input:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        className="w-full p-4 rounded-xl border border-border-main bg-transparent text-text-main font-bold focus:outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2 group/input">
                                    <label className="text-xs font-bold text-text-main group-focus-within/input:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full p-4 rounded-xl border border-border-main bg-transparent text-text-main font-bold focus:outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border-main pt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all duration-300 ${
                                    isChangingPassword 
                                        ? 'bg-black/10 dark:bg-white/10 text-text-muted cursor-not-allowed' 
                                        : 'bg-red-500 text-white hover:scale-105 hover:shadow-[0_10px_30px_rgba(239,68,68,0.3)]'
                                }`}
                            >
                                {isChangingPassword ? (
                                    <><div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" /> Updating...</>
                                ) : (
                                    <><span className="material-symbols-outlined text-lg">key</span> Update Password</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
