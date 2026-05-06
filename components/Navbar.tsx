import { signOut } from 'next-auth/react';

import { ADMIN_EMAILS } from '@/lib/admin';

export default function Navbar({ setView, userProfile, userEmail }) {
    // Get initials fallback
    const getInitials = (nameStr) => {
        if (!nameStr) return '?';
        return nameStr.charAt(0).toUpperCase();
    };

    return (
        <div className="app-header">
            <div className="header-left">
                <img
                    src="/logo.jpg"
                    alt="Assessra"
                    className="app-logo"
                    onClick={() => setView('home')}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div className="nav">
                <button className="nav-btn" onClick={() => setView('home')}>Subjects</button>
                <button className="nav-btn" onClick={() => setView('leaderboard')}>Leaderboard</button>
                <button className="nav-btn" onClick={() => setView('formulae')}>Formulae</button>
                <button className="nav-btn" onClick={() => setView('definitions')}>Definitions</button>
                <button className="nav-btn" onClick={() => setView('tips')}>Tips & Hacks</button>
                <button className="nav-btn" onClick={() => setView('vocab')}>Vocab</button>
                {ADMIN_EMAILS.includes(userEmail) && (
                    <button className="nav-btn" onClick={() => setView('admin')} style={{ color: '#dc2626', fontWeight: 700 }}>
                        🛡️ Admin
                    </button>
                )}
                <button className="nav-btn" onClick={() => setView('profile')} style={{ padding: '0 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: userProfile?.image ? `url(${userProfile.image}) center/cover` : 'var(--lime-primary)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px',
                        border: '2px solid white'
                    }}>
                        {!userProfile?.image && getInitials(userProfile?.nickname || userProfile?.name)}
                    </div>
                    Profile
                </button>
                <button className="nav-btn" onClick={() => signOut()}>Logout</button>
            </div>
        </div>
    );
}
