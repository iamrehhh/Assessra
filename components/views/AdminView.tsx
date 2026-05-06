
'use client';

import { useState, useEffect, useCallback } from 'react';

import { ADMIN_EMAILS } from '@/lib/admin';

export default function AdminView() {
    const [tab, setTab] = useState('users');
    const [scoreTab, setScoreTab] = useState('pyp'); // 'pyp' | 'vocab'
    const [users, setUsers] = useState<any[]>([]);
    const [scores, setScores] = useState<any[]>([]);

    const [activeUsersList, setActiveUsersList] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [bookCompletions, setBookCompletions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Reports modal state
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [reportReply, setReportReply] = useState('');
    const [reportStatus, setReportStatus] = useState('open');
    const [savingReport, setSavingReport] = useState(false);
    const [deletingReport, setDeletingReport] = useState(false);
    const [reportSubTab, setReportSubTab] = useState('open'); // 'open' | 'in_progress' | 'resolved'

    // Notification State
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationActive, setNotificationActive] = useState(false);

    useEffect(() => {
        if (tab === 'users') fetchUsers();
        else if (tab === 'scores') { fetchScores(); }
        else if (tab === 'active') fetchActiveUsers();
        else if (tab === 'reports') fetchReports();
        else if (tab === 'book') fetchBookCompletions();
        fetchNotification();
    }, [tab]);

    // Background poll for active users so the stat card is always up to date
    useEffect(() => {
        const fetchActiveUsersSilent = async () => {
            try {
                const res = await fetch('/api/admin/active-users');
                const data = await res.json();
                setActiveUsersList(data.activeUsers || []);
            } catch { }
        };
        fetchActiveUsersSilent();
        const interval = setInterval(fetchActiveUsersSilent, 30000); // every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchNotification = async () => {
        try {
            const res = await fetch('/api/notification');
            const data = await res.json();
            setNotificationMessage(data.message || '');
            setNotificationActive(data.active || false);
        } catch (err) { console.error('Failed to fetch notification', err); }
    };

    // Modal State
    const [modal, setModal] = useState({ open: false, type: 'alert', title: '', message: '', onConfirm: null as any });

    const [scoreModalOpen, setScoreModalOpen] = useState(false);
    const [selectedUserScores, setSelectedUserScores] = useState<any>(null);

    const [editUserModal, setEditUserModal] = useState({ open: false, userId: null as string | null, nickname: '' });
    const [messageUserModal, setMessageUserModal] = useState({ open: false, userId: null as string | null, name: '', message: '' });
    const [resetPasswordModal, setResetPasswordModal] = useState({ open: false, userId: null as string | null, email: '', password: '' });

    const showAlert = useCallback((title: string, message: string) => {
        setModal({ open: true, type: 'alert', title, message, onConfirm: null });
    }, []);

    const showConfirm = useCallback((title: string, message: string, onConfirm: any) => {
        setModal({ open: true, type: 'confirm', title, message, onConfirm });
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, open: false }));
    }, []);

    const saveNotification = async () => {
        try {
            const res = await fetch('/api/admin/notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: notificationMessage, active: notificationActive })
            });
            if (res.ok) showAlert('Success', 'Notification updated successfully!');
            else showAlert('Error', 'Failed to update notification.');
        } catch (err) { showAlert('Error', 'Network error.'); }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data.users || []);
        } catch { setUsers([]); }
        setLoading(false);
    };

    const fetchScores = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/scores');
            const data = await res.json();
            setScores(data.scores || []);
        } catch { setScores([]); }
        setLoading(false);
    };



    const fetchActiveUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/active-users');
            const data = await res.json();
            setActiveUsersList(data.activeUsers || []);
        } catch { setActiveUsersList([]); }
        setLoading(false);
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reports');
            const data = await res.json();
            setReports(data.reports || []);
        } catch { setReports([]); }
        setLoading(false);
    };

    const fetchBookCompletions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/book-completions');
            const data = await res.json();
            setBookCompletions(data.completions || []);
        } catch { setBookCompletions([]); }
        setLoading(false);
    };

    const updateReport = async () => {
        if (!selectedReport) return;
        setSavingReport(true);
        try {
            const res = await fetch('/api/reports', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedReport.id,
                    status: reportStatus,
                    new_message: reportReply
                })
            });
            if (res.ok) {
                showAlert('Success', 'Report updated!');
                setSelectedReport(null);
                fetchReports();
            } else {
                showAlert('Error', 'Failed to update report.');
            }
        } catch { showAlert('Error', 'Network error.'); }
        setSavingReport(false);
    };

    const handleEditUser = async () => {
        if (!editUserModal.userId) return;
        setSavingReport(true);
        try {
            const res = await fetch('/api/admin/users/edit', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: editUserModal.userId, nickname: editUserModal.nickname })
            });
            if (res.ok) {
                showAlert('Success', 'User nickname updated!');
                setEditUserModal({ open: false, userId: null, nickname: '' });
                fetchUsers();
            } else {
                showAlert('Error', 'Failed to update nickname.');
            }
        } catch { showAlert('Error', 'Network error.'); }
        setSavingReport(false);
    };

    const handleMessageUser = async () => {
        if (!messageUserModal.userId) return;
        setSavingReport(true);
        try {
            const res = await fetch('/api/admin/users/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: messageUserModal.userId, message: messageUserModal.message })
            });
            if (res.ok) {
                showAlert('Success', 'Message sent to user!');
                setMessageUserModal({ open: false, userId: null, name: '', message: '' });
            } else {
                showAlert('Error', 'Failed to send message.');
            }
        } catch { showAlert('Error', 'Network error.'); }
        setSavingReport(false);
    };

    const handleResetPassword = async () => {
        if (!resetPasswordModal.userId || !resetPasswordModal.password) return;
        setSavingReport(true);
        try {
            const res = await fetch('/api/admin/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: resetPasswordModal.userId, newPassword: resetPasswordModal.password })
            });
            if (res.ok) {
                showAlert('Success', 'User password reset successfully!');
                setResetPasswordModal({ open: false, userId: null, email: '', password: '' });
            } else {
                const data = await res.json();
                showAlert('Error', data.error || 'Failed to reset password.');
            }
        } catch { showAlert('Error', 'Network error.'); }
        setSavingReport(false);
    };

    const deleteReport = async (id: string) => {
        showConfirm('Delete Report', 'Permanently delete this error report? This action cannot be undone.', async () => {
            closeModal();
            setDeletingReport(true);
            try {
                const res = await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setReports(prev => prev.filter(r => r.id !== id));
                    setSelectedReport(null);
                    showAlert('Success', 'Report deleted successfully.');
                } else {
                    const d = await res.json();
                    showAlert('Error', d.error || 'Failed to delete report.');
                }
            } catch { showAlert('Error', 'Network error.'); }
            setDeletingReport(false);
        });
    };

    const deleteUser = async (id: string, email: string) => {
        showConfirm('Delete User', `Permanently delete user "${email}" and all their scores?`, async () => {
            closeModal();
            setActionLoading(id);
            try {
                const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setUsers(prev => prev.filter(u => u.id !== id));
                    setScores(prev => prev.filter(s => s.username !== email));
                } else {
                    const d = await res.json();
                    showAlert('Error', d.error || 'Failed to delete user.');
                }
            } catch { showAlert('Error', 'Network error.'); }
            setActionLoading(null);
        });
    };

    const resetScores = async (email: string) => {
        showConfirm('Reset Scores', `Reset ALL scores for "${email}"? This cannot be undone.`, async () => {
            closeModal();
            setActionLoading(email);
            try {
                const res = await fetch(`/api/admin/scores?username=${encodeURIComponent(email)}`, { method: 'DELETE' });
                if (res.ok) {
                    setScores(prev => prev.filter(s => s.username !== email));
                } else {
                    const d = await res.json();
                    showAlert('Error', d.error || 'Failed to reset scores.');
                }
            } catch { showAlert('Error', 'Network error.'); }
            setActionLoading(null);
        });
    };

    const filteredUsers = users.filter(u =>
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.nickname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aggregate scores by user based on sub-tab
    const scoresByUser: Record<string, any> = {};
    const relevantScores = scores.filter(s => {
        const isVocab = s.subject === 'vocab' || s.subject === 'idioms' || (s.paper_id && s.paper_id.startsWith('vocab_idioms'));
        return scoreTab === 'vocab' ? isVocab : !isVocab;
    });

    for (const s of relevantScores) {
        if (!scoresByUser[s.username]) {
            scoresByUser[s.username] = { email: s.username, nickname: s.userNickname, name: s.userName, totalScore: 0, totalMax: 0, attempts: 0, subjects: new Set(), logs: [] };
        }
        const u = scoresByUser[s.username];
        u.totalScore += s.score;
        u.totalMax += s.maxMarks;
        u.attempts += 1;
        u.subjects.add(s.subject);
        u.logs.push(s);
    }
    let scoreAggregated = Object.values(scoresByUser).map(u => ({
        ...u,
        subjects: Array.from(u.subjects),
        percentage: u.totalMax > 0 ? Math.round((u.totalScore / u.totalMax) * 100) : 0,
    })).sort((a, b) => b.totalScore - a.totalScore);

    const filteredScores = scoreAggregated.filter(u =>
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.nickname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );



    const filteredActiveUsers = activeUsersList.filter(u =>
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const styles: any = {
        container: { maxWidth: '1100px', margin: '0 auto' },
        header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' },
        title: { fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.5px' },
        badge: { background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' },
        tabs: { display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' },
        tab: (active) => ({ padding: '10px 24px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', background: active ? 'white' : 'transparent', color: active ? '#1e293b' : '#64748b', boxShadow: active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }),
        searchBar: { width: '100%', padding: '12px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', marginBottom: '20px', outline: 'none', transition: 'border 0.2s', background: '#fafafa', color: '#1e293b' },
        table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
        th: { padding: '14px 18px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #f1f5f9', background: '#fafbfc' },
        td: { padding: '14px 18px', fontSize: '0.9rem', color: '#334155', borderBottom: '1px solid #f1f5f9' },
        avatar: (img) => ({ width: '36px', height: '36px', borderRadius: '50%', background: img ? `url(${img}) center/cover` : 'linear-gradient(135deg, #3b9c5a, #2d7a46)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0 }),
        pill: (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, background: color === 'green' ? '#dcfce7' : color === 'orange' ? '#fff7ed' : '#f1f5f9', color: color === 'green' ? '#166534' : color === 'orange' ? '#9a3412' : '#475569' }),
        dangerBtn: { padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' },
        statsRow: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
        statCard: { flex: 1, minWidth: '160px', background: 'white', borderRadius: '14px', padding: '18px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' },
        statNumber: { fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0 },
        statLabel: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' },
        emptyState: { textAlign: 'center', padding: '60px 20px', color: '#94a3b8' },

        // Modal Styles
        modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
        modalContent: { background: '#1e293b', width: '90%', maxWidth: '420px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', paddingBottom: '4px' },
        modalHeader: { padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        modalTitle: { margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' },
        modalClose: { background: 'none', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' },
        modalBody: { padding: '24px' },
        modalText: { margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' },
        modalFooter: { padding: '16px 24px', display: 'flex', gap: '12px', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' },
        modalCancel: { padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
        modalDanger: { padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#e11d48', color: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(225,29,72,0.3)' },
        modalPrimary: { padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--lime-primary)', color: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Admin Panel</h1>
                <span style={styles.badge}>Admin Access</span>
            </div>

            {/* Stats */}
            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Total Users</p>
                    <p style={styles.statNumber}>{users.length}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statLabel}>Total Score Entries</p>
                    <p style={styles.statNumber}>{scores.length}</p>
                </div>

                <div style={styles.statCard}>
                    <p style={styles.statLabel}><span style={{ color: '#22c55e' }}>●</span> Active Now</p>
                    <p style={styles.statNumber}>{activeUsersList.length}</p>
                </div>
            </div>

            {/* Notification Control */}
            <div style={{ ...styles.statCard, marginBottom: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <p style={{ ...styles.statLabel, marginBottom: '4px' }}>Global Notification</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Broadcast a message to all users on the dashboard.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        value={notificationMessage}
                        onChange={e => setNotificationMessage(e.target.value)}
                        placeholder="Enter notification message..."
                        style={{ flex: 1, minWidth: '250px', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', transition: 'border 0.2s', fontSize: '0.95rem', color: '#1e293b', backgroundColor: 'white' }}
                        onFocus={e => e.target.style.borderColor = 'var(--lime-primary)'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e2e8f0', color: '#1e293b' }}>
                        <input
                            type="checkbox"
                            checked={notificationActive}
                            onChange={e => setNotificationActive(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--lime-primary)', cursor: 'pointer' }}
                        />
                        Active Status
                    </label>
                    <button
                        style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--lime-primary)', color: 'white', boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }}
                        onClick={saveNotification}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Publish Update
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                <button style={styles.tab(tab === 'users')} onClick={() => { setTab('users'); setSearchTerm(''); }}>
                    👥 Users
                </button>
                <button style={styles.tab(tab === 'scores')} onClick={() => { setTab('scores'); setSearchTerm(''); }}>
                    📊 Scores
                </button>

                <button style={styles.tab(tab === 'active')} onClick={() => { setTab('active'); setSearchTerm(''); }}>
                    <span style={{ color: '#22c55e' }}>●</span> Active
                </button>
                <button style={styles.tab(tab === 'reports')} onClick={() => { setTab('reports'); setSearchTerm(''); }}>
                    🚨 Reports
                </button>
                <button style={styles.tab(tab === 'book')} onClick={() => { setTab('book'); setSearchTerm(''); }}>
                    📖 Book Club
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                style={styles.searchBar}
                placeholder={tab === 'users' ? 'Search by name, email, or nickname...' : 'Search by email or nickname...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Score Sub-tabs */}
            {tab === 'scores' && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setScoreTab('pyp')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: scoreTab === 'pyp' ? '#1e293b' : '#f1f5f9',
                            color: scoreTab === 'pyp' ? 'white' : '#64748b',
                            boxShadow: scoreTab === 'pyp' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        📚 PYP
                    </button>
                    <button
                        onClick={() => setScoreTab('vocab')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: scoreTab === 'vocab' ? '#1e293b' : '#f1f5f9',
                            color: scoreTab === 'vocab' ? 'white' : '#64748b',
                            boxShadow: scoreTab === 'vocab' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        🗣️ Vocab & Idioms
                    </button>

                </div>
            )}

            {loading ? (
                <div style={styles.emptyState}>
                    <div style={{ width: '36px', height: '36px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--lime-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }} />
                    <p style={{ fontWeight: 600 }}>Loading...</p>
                </div>
            ) : tab === 'users' ? (
                /* Users Table */
                filteredUsers.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</p>
                        <p style={{ fontWeight: 600 }}>No users found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>User</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Nickname</th>
                                    <th style={styles.th}>Level</th>
                                    <th style={styles.th}>Provider</th>
                                    <th style={styles.th}>Joined</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={styles.avatar(user.image)}>
                                                    {!user.image && (user.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{user.name || '—'}</span>
                                            </div>
                                        </td>
                                        <td style={{ ...styles.td, fontSize: '0.85rem', color: '#64748b' }}>{user.email}</td>
                                        <td style={styles.td}>{user.nickname || <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                                        <td style={styles.td}>
                                            {user.level ? <span style={styles.pill('green')}>{user.level}</span> : <span style={{ color: '#cbd5e1' }}>—</span>}
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.pill(user.provider === 'google' ? 'orange' : 'gray')}>
                                                {user.provider || 'google'}
                                            </span>
                                        </td>
                                        <td style={{ ...styles.td, fontSize: '0.82rem', color: '#94a3b8' }}>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                        </td>
                                        <td style={styles.td}>
                                            {!ADMIN_EMAILS.includes(user.email) ? (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#fef3c7', color: '#d97706', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onClick={() => setEditUserModal({ open: true, userId: user.id, nickname: user.nickname || '' })}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fde68a'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fef3c7'; }}
                                                    >
                                                        Edit Nickname
                                                    </button>
                                                    <button
                                                        style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onClick={() => setResetPasswordModal({ open: true, userId: user.id, email: user.email, password: '' })}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                                                    >
                                                        Reset Pass
                                                    </button>
                                                    <button
                                                        style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#f3e8ff', color: '#9333ea', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onClick={() => setMessageUserModal({ open: true, userId: user.id, name: user.name || user.email, message: '' })}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#e9d5ff'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f3e8ff'; }}
                                                    >
                                                        Message
                                                    </button>
                                                    <button
                                                        style={{ ...styles.dangerBtn, opacity: actionLoading === user.id ? 0.5 : 1 }}
                                                        disabled={actionLoading === user.id}
                                                        onClick={() => deleteUser(user.id, user.email)}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = 'white'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                                                    >
                                                        {actionLoading === user.id ? 'Deleting...' : 'Remove'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={styles.pill('green')}>Admin</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : tab === 'scores' ? (
                /* Scores Table (PYP / Vocab) */
                filteredScores.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</p>
                        <p style={{ fontWeight: 600 }}>No scores found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>User</th>
                                    <th style={styles.th}>Nickname</th>
                                    <th style={styles.th}>Total Score</th>
                                    <th style={styles.th}>Percentage</th>
                                    <th style={styles.th}>Attempts</th>
                                    <th style={styles.th}>Subjects</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredScores.map(entry => (
                                    <tr key={entry.email} style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                        <td style={styles.td}>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{entry.name || entry.email}</div>
                                                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{entry.email}</div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>{entry.nickname || <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                                        <td style={styles.td}>
                                            <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{entry.totalScore}</span>
                                            <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}> / {entry.totalMax}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.pill(entry.percentage >= 70 ? 'green' : entry.percentage >= 40 ? 'orange' : 'gray'),
                                                fontSize: '0.85rem',
                                            }}>
                                                {entry.percentage}%
                                            </span>
                                        </td>
                                        <td style={{ ...styles.td, fontWeight: 600 }}>{entry.attempts}</td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                {entry.subjects.map(s => (
                                                    <span key={s} style={styles.pill('gray')}>{s}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#3b82f6', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onClick={() => { setSelectedUserScores(entry); setScoreModalOpen(true); }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                                                >
                                                    View Logs
                                                </button>
                                                <button
                                                    style={{ ...styles.dangerBtn, opacity: actionLoading === entry.email ? 0.5 : 1 }}
                                                    disabled={actionLoading === entry.email}
                                                    onClick={() => resetScores(entry.email)}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = 'white'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                                                >
                                                    {actionLoading === entry.email ? 'Resetting...' : 'Reset Scores'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : tab === 'active' ? (
                /* Active Users Table */
                filteredActiveUsers.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🟢</p>
                        <p style={{ fontWeight: 600 }}>No users currently active</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>User</th>
                                    <th style={styles.th}>Page</th>
                                    <th style={styles.th}>Last Seen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActiveUsers.map(user => (
                                    <tr key={user.email} style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ ...styles.avatar(user.image), position: 'relative' }}>
                                                    {!user.image && (user.name || '?').charAt(0).toUpperCase()}
                                                    <span style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, background: '#22c55e', border: '2px solid white', borderRadius: '50%' }} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{user.name || 'Student'}</div>
                                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.pill('green')}>
                                                {user.current_page || 'home'}
                                            </span>
                                        </td>
                                        <td style={{ ...styles.td, fontSize: '0.85rem', color: '#64748b' }}>
                                            {(() => {
                                                const date = new Date(user.last_seen);
                                                const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000 / 60);
                                                return diff === 0 ? 'Just now' : `${diff} min ago`;
                                            })()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : tab === 'reports' ? (
                /* Reports Table */
                <>
                    {/* Report Sub-tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        {[
                            { key: 'open', label: '🔴 Open', color: '#ef4444' },
                            { key: 'in_progress', label: '🟡 In Progress', color: '#f59e0b' },
                            { key: 'resolved', label: '🟢 Resolved', color: '#22c55e' },
                        ].map(st => {
                            const count = reports.filter(r => (r.status || 'open') === st.key).length;
                            return (
                                <button
                                    key={st.key}
                                    onClick={() => setReportSubTab(st.key)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: reportSubTab === st.key ? '#1e293b' : '#f1f5f9',
                                        color: reportSubTab === st.key ? 'white' : '#64748b',
                                        boxShadow: reportSubTab === st.key ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    {st.label}
                                    {count > 0 && (
                                        <span style={{
                                            background: reportSubTab === st.key ? 'rgba(255,255,255,0.2)' : st.color + '15',
                                            color: reportSubTab === st.key ? 'white' : st.color,
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                        }}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {(() => {
                        const filteredByStatus = reports.filter(r =>
                            (r.status || 'open') === reportSubTab &&
                            ((r.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (r.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (r.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
                        );

                        return filteredByStatus.length === 0 ? (
                            <div style={styles.emptyState}>
                                <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🚨</p>
                                <p style={{ fontWeight: 600 }}>No {reportSubTab.replace('_', ' ')} reports</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>User</th>
                                            <th style={styles.th}>Category</th>
                                            <th style={styles.th}>Page</th>
                                            <th style={styles.th}>Description</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Date</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredByStatus.map(report => (
                                            <tr key={report.id} style={{ transition: 'background 0.15s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                                <td style={styles.td}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{report.user_name || 'Unknown'}</div>
                                                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{report.user_email}</div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.pill(report.category === 'bug' ? 'orange' : 'gray')}>
                                                        {(report.category || 'other').replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td style={{ ...styles.td, fontSize: '0.85rem', color: '#64748b' }}>{report.page || '—'}</td>
                                                <td style={{ ...styles.td, maxWidth: '250px' }}>
                                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#334155' }}>
                                                        {report.description}
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.pill(
                                                            report.status === 'resolved' ? 'green' :
                                                                report.status === 'in_progress' ? 'orange' : 'gray'
                                                        ),
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {(report.status || 'open').replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td style={{ ...styles.td, fontSize: '0.82rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                                    {report.created_at ? new Date(report.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                </td>
                                                <td style={styles.td}>
                                                    <button
                                                        style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#3b82f6', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onClick={() => {
                                                            setSelectedReport(report);
                                                            setReportReply(report.admin_reply || '');
                                                            setReportStatus(report.status || 'open');
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                                                    >
                                                        {report.admin_reply ? 'View / Edit' : 'Reply'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })()}
                </>
            ) : null}

            {/* Book Completions Tab */}
            {tab === 'book' && !loading && (
                bookCompletions.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📖</p>
                        <p style={{ fontWeight: 600 }}>No one has completed the book yet</p>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>Users who finish reading the current book will appear here.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ marginBottom: '16px', padding: '16px 20px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                            <span style={{ fontWeight: 700, color: '#166534' }}>🎉 {bookCompletions.length} user{bookCompletions.length > 1 ? 's have' : ' has'} completed the book!</span>
                            <span style={{ color: '#4ade80', marginLeft: '8px', fontSize: '0.85rem' }}>You can now upload a new book for them.</span>
                        </div>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>User Email</th>
                                    <th style={styles.th}>Book</th>
                                    <th style={styles.th}>Completed At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookCompletions.map((c, i) => (
                                    <tr key={i} style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                        <td style={{ ...styles.td, fontWeight: 600 }}>{c.user_email}</td>
                                        <td style={styles.td}>
                                            <span style={styles.pill('green')}>{c.book_title || 'Nexus'}</span>
                                        </td>
                                        <td style={{ ...styles.td, fontSize: '0.85rem', color: '#64748b' }}>
                                            {c.completed_at ? new Date(c.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' at ' + new Date(c.completed_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}



            {/* Report Detail / Reply Modal */}
            {selectedReport && (
                <div style={styles.modalOverlay} onClick={() => setSelectedReport(null)}>
                    <div style={{ ...styles.modalContent, maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                        <div style={{ ...styles.modalHeader, flexShrink: 0 }}>
                            <div>
                                <h3 style={styles.modalTitle}>Report from {selectedReport.user_name}</h3>
                                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>{selectedReport.user_email}</p>
                            </div>
                            <button style={styles.modalClose} onClick={() => setSelectedReport(null)}>✕</button>
                        </div>
                        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {/* Report Info */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <span style={styles.pill(selectedReport.category === 'bug' ? 'orange' : 'gray')}>
                                    {(selectedReport.category || 'other').replace('_', ' ')}
                                </span>
                                <span style={styles.pill('gray')}>Page: {selectedReport.page || 'Unknown'}</span>
                                <span style={styles.pill('gray')}>
                                    {selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                </span>
                            </div>

                            {/* Status Select */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Status</label>
                                <select
                                    value={reportStatus}
                                    onChange={e => setReportStatus(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.95rem', color: '#1e293b', background: 'white', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            {/* Screenshot (if available) */}
                            {selectedReport.screenshot_url && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Screenshot Attachment</label>
                                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                                        <a href={selectedReport.screenshot_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', maxWidth: '100%', cursor: 'zoom-in' }}>
                                            <img
                                                src={selectedReport.screenshot_url}
                                                alt="Report attachment"
                                                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                                            />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Conversation Thread */}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                                <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Conversation</label>

                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', marginBottom: '16px', minHeight: '200px' }}>
                                    {(() => {
                                        const messages = selectedReport.messages && selectedReport.messages.length > 0 ? selectedReport.messages : [
                                            { sender: 'user', text: selectedReport.description, created_at: selectedReport.created_at },
                                            ...(selectedReport.admin_reply ? [{ sender: 'admin', text: selectedReport.admin_reply, created_at: selectedReport.updated_at || selectedReport.created_at }] : [])
                                        ];

                                        return messages.map((msg, idx) => {
                                            const isAdmin = msg.sender === 'admin';
                                            return (
                                                <div key={idx} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
                                                    <div style={{
                                                        maxWidth: '85%',
                                                        padding: '12px 16px',
                                                        borderRadius: '16px',
                                                        borderTopLeftRadius: isAdmin ? '16px' : '4px',
                                                        borderTopRightRadius: isAdmin ? '4px' : '16px',
                                                        background: isAdmin ? 'var(--lime-primary)' : 'white',
                                                        color: isAdmin ? 'white' : '#334155',
                                                        border: isAdmin ? 'none' : '1px solid #e2e8f0',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                    }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: isAdmin ? 0.9 : 0.6, marginBottom: '4px', textTransform: 'uppercase' }}>
                                                            {isAdmin ? 'You (Admin)' : selectedReport.user_name}
                                                        </div>
                                                        <div style={{ fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                            {msg.text}
                                                        </div>
                                                        <div style={{ fontSize: '0.7rem', opacity: isAdmin ? 0.8 : 0.5, marginTop: '6px', textAlign: 'right' }}>
                                                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>

                                {/* Reply Input */}
                                <div>
                                    <textarea
                                        value={reportReply}
                                        onChange={e => setReportReply(e.target.value)}
                                        rows={3}
                                        placeholder="Type your reply to the user here..."
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.95rem', color: '#1e293b', background: 'white', outline: 'none', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ ...styles.modalFooter, justifyContent: 'space-between', flexShrink: 0 }}>
                            <div>
                                <button
                                    style={{ ...styles.modalDanger, opacity: deletingReport ? 0.6 : 1 }}
                                    onClick={() => deleteReport(selectedReport.id)}
                                    disabled={deletingReport}
                                >
                                    {deletingReport ? 'Deleting...' : 'Delete Report'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={styles.modalCancel} onClick={() => setSelectedReport(null)}>Cancel</button>
                                <button
                                    style={{ ...styles.modalPrimary, opacity: savingReport ? 0.6 : 1 }}
                                    onClick={updateReport}
                                    disabled={savingReport}
                                >
                                    {savingReport ? 'Saving...' : 'Save & Send Reply'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Score Drill-down Modal (PYP / Vocab) */}
            {scoreModalOpen && selectedUserScores && (
                <div style={styles.modalOverlay} onClick={() => setScoreModalOpen(false)}>
                    <div style={{ ...styles.modalContent, maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h3 style={styles.modalTitle}>Score History: {selectedUserScores.name || selectedUserScores.email}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>{selectedUserScores.attempts} total attempts</p>
                            </div>
                            <button style={styles.modalClose} onClick={() => setScoreModalOpen(false)}>✕</button>
                        </div>
                        <div style={{ padding: '0', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
                            <table style={{ ...styles.table, borderRadius: 0, boxShadow: 'none' }}>
                                <thead style={{ position: 'sticky', top: 0, background: '#fafbfc', zIndex: 10 }}>
                                    <tr>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Subject</th>
                                        <th style={styles.th}>Paper / Identifier</th>
                                        <th style={styles.th}>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedUserScores.logs.map(log => (
                                        <tr key={log.id}>
                                            <td style={{ ...styles.td, fontSize: '0.8rem', color: '#64748b' }}>
                                                {new Date(log.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}<br />
                                                {new Date(log.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>{log.subject?.replace('-', ' ')}</div>
                                            </td>
                                            <td style={{ ...styles.td, maxWidth: '250px' }}>
                                                <div style={{ fontWeight: 500, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {log.paperTitle || log.paperId}
                                                </div>
                                                {log.questionNumber && log.questionNumber !== 'all' && (
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                                                        Question: {log.questionNumber}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{log.score}</span>
                                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}> / {log.maxMarks}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editUserModal.open && (
                <div style={styles.modalOverlay} onClick={() => setEditUserModal({ open: false, userId: null, nickname: '' })}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Edit Nickname</h3>
                            <button style={styles.modalClose} onClick={() => setEditUserModal({ open: false, userId: null, nickname: '' })}>✕</button>
                        </div>
                        <div style={styles.modalBody}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '8px' }}>User Nickname</label>
                            <input
                                type="text"
                                value={editUserModal.nickname}
                                onChange={(e) => setEditUserModal(prev => ({ ...prev, nickname: e.target.value }))}
                                placeholder="Enter a new nickname..."
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                                    border: '2px solid #e2e8f0', fontSize: '0.95rem',
                                    color: '#1e293b', background: 'white', outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ ...styles.modalFooter, justifyContent: 'flex-end' }}>
                            <button style={styles.modalCancel} onClick={() => setEditUserModal({ open: false, userId: null, nickname: '' })}>Cancel</button>
                            <button
                                style={{ ...styles.modalPrimary, opacity: savingReport ? 0.6 : 1 }}
                                onClick={handleEditUser}
                                disabled={savingReport}
                            >
                                {savingReport ? 'Saving...' : 'Save Nickname'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message User Modal */}
            {messageUserModal.open && (
                <div style={styles.modalOverlay} onClick={() => setMessageUserModal({ open: false, userId: null, name: '', message: '' })}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Message {messageUserModal.name}</h3>
                            <button style={styles.modalClose} onClick={() => setMessageUserModal({ open: false, userId: null, name: '', message: '' })}>✕</button>
                        </div>
                        <div style={styles.modalBody}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Direct Admin Message</label>
                            <textarea
                                value={messageUserModal.message}
                                onChange={(e) => setMessageUserModal(prev => ({ ...prev, message: e.target.value }))}
                                rows={4}
                                placeholder="Type a message to send directly to this user..."
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                                    border: '2px solid #e2e8f0', fontSize: '0.95rem',
                                    color: '#1e293b', background: 'white', outline: 'none',
                                    resize: 'vertical', minHeight: '80px', fontFamily: 'inherit'
                                }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                                This message will appear in the user's notification bell until they open their notifications tray.
                            </p>
                        </div>
                        <div style={{ ...styles.modalFooter, justifyContent: 'flex-end' }}>
                            <button style={styles.modalCancel} onClick={() => setMessageUserModal({ open: false, userId: null, name: '', message: '' })}>Cancel</button>
                            <button
                                style={{ ...styles.modalPrimary, opacity: savingReport ? 0.6 : 1 }}
                                onClick={handleMessageUser}
                                disabled={savingReport}
                            >
                                {savingReport ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {resetPasswordModal.open && (
                <div style={styles.modalOverlay} onClick={() => setResetPasswordModal({ open: false, userId: null, email: '', password: '' })}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Reset Password: {resetPasswordModal.email}</h3>
                            <button style={styles.modalClose} onClick={() => setResetPasswordModal({ open: false, userId: null, email: '', password: '' })}>✕</button>
                        </div>
                        <div style={styles.modalBody}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '8px' }}>New Password</label>
                            <input
                                type="text"
                                value={resetPasswordModal.password}
                                onChange={(e) => setResetPasswordModal(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Enter a new password..."
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                                    border: '2px solid #e2e8f0', fontSize: '0.95rem',
                                    color: '#1e293b', background: 'white', outline: 'none'
                                }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                                This will overwrite their current password. They will need to log in with this new password immediately.
                            </p>
                        </div>
                        <div style={{ ...styles.modalFooter, justifyContent: 'flex-end' }}>
                            <button style={styles.modalCancel} onClick={() => setResetPasswordModal({ open: false, userId: null, email: '', password: '' })}>Cancel</button>
                            <button
                                style={{ ...styles.modalDanger, opacity: savingReport ? 0.6 : 1 }}
                                onClick={handleResetPassword}
                                disabled={savingReport}
                            >
                                {savingReport ? 'Resetting...' : 'Confirm Reset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dark Modal */}
            {modal.open && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{modal.title}</h3>
                            <button style={styles.modalClose} onClick={closeModal}>✕</button>
                        </div>
                        <div style={styles.modalBody}>
                            <p style={styles.modalText}>{modal.message}</p>
                        </div>
                        <div style={styles.modalFooter}>
                            {modal.type === 'confirm' && (
                                <button style={styles.modalCancel} onClick={closeModal}>
                                    Cancel
                                </button>
                            )}
                            <button
                                style={modal.type === 'confirm' ? styles.modalDanger : styles.modalPrimary}
                                onClick={() => {
                                    if (modal.onConfirm) modal.onConfirm();
                                    else closeModal();
                                }}
                            >
                                {modal.type === 'confirm' ? 'Confirm' : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
