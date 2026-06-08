'use client';

import { useState, useEffect, useCallback } from 'react';
import { ADMIN_EMAILS } from '@/lib/admin';

// Import sub-components
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminScoresTab from '@/components/admin/AdminScoresTab';
import AdminActiveTab from '@/components/admin/AdminActiveTab';
import AdminReportsTab from '@/components/admin/AdminReportsTab';
import AdminBookClubTab from '@/components/admin/AdminBookClubTab';
import AdminNotificationPanel from '@/components/admin/AdminNotificationPanel';

const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4 pt-4">
        <div className="h-10 bg-border-main/50 rounded-xl w-full"></div>
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-border-main/20 rounded-xl w-full"></div>
        ))}
    </div>
);

export default function AdminView() {
    const [tab, setTab] = useState('users');
    const [scoreTab, setScoreTab] = useState('pyp'); // 'pyp' | 'vocab'
    const [users, setUsers] = useState<any[]>([]);
    const [scores, setScores] = useState<any[]>([]);

    const [activeUsersList, setActiveUsersList] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [bookCompletions, setBookCompletions] = useState<any[]>([]);
    
    // Loading States
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

    async function fetchUsers() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data.users || []);
        } catch { setUsers([]); }
        setLoading(false);
    }

    async function fetchScores() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/scores');
            const data = await res.json();
            setScores(data.scores || []);
        } catch { setScores([]); }
        setLoading(false);
    }

    async function fetchActiveUsers() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/active-users');
            const data = await res.json();
            setActiveUsersList(data.activeUsers || []);
        } catch { setActiveUsersList([]); }
        setLoading(false);
    }

    async function fetchReports() {
        setLoading(true);
        try {
            const res = await fetch('/api/reports');
            const data = await res.json();
            setReports(data.reports || []);
        } catch { setReports([]); }
        setLoading(false);
    }

    async function fetchBookCompletions() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/book-completions');
            const data = await res.json();
            setBookCompletions(data.completions || []);
        } catch { setBookCompletions([]); }
        setLoading(false);
    }

    // Background poll for active users
    useEffect(() => {
        const fetchActiveUsersSilent = async () => {
            try {
                const res = await fetch('/api/admin/active-users');
                const data = await res.json();
                setActiveUsersList(data.activeUsers || []);
            } catch { }
        };
        fetchActiveUsersSilent();
        const interval = setInterval(fetchActiveUsersSilent, 30000);
        return () => clearInterval(interval);
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    useEffect(() => {
        if (tab === 'users') fetchUsers();
        else if (tab === 'scores') { fetchScores(); }
        else if (tab === 'active') fetchActiveUsers();
        else if (tab === 'reports') fetchReports();
        else if (tab === 'book') fetchBookCompletions();
        fetchNotification();
    }, [tab]);

    // Admin Handlers
    const updateReport = async () => {
        if (!selectedReport) return;
        setSavingReport(true);
        try {
            const res = await fetch('/api/reports', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedReport.id, status: reportStatus, new_message: reportReply })
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



    return (
        <div className="max-w-[1100px] mx-auto pb-20 pt-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 flex-wrap">
                <h1 className="text-3xl font-extrabold text-text-main tracking-tight">Admin Panel</h1>
                <span className="bg-gradient-to-br from-red-600 to-red-800 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                    Admin Access
                </span>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Total Users</p>
                    <p className="text-4xl font-extrabold text-text-main">{users.length}</p>
                </div>
                <div className="glass rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Total Score Entries</p>
                    <p className="text-4xl font-extrabold text-text-main">{scores.length}</p>
                </div>
                <div className="glass rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse-slow"></span> Active Now
                    </p>
                    <p className="text-4xl font-extrabold text-text-main">{activeUsersList.length}</p>
                </div>
            </div>

            {/* Notification Panel */}
            <AdminNotificationPanel 
                notificationMessage={notificationMessage}
                setNotificationMessage={setNotificationMessage}
                notificationActive={notificationActive}
                setNotificationActive={setNotificationActive}
                saveNotification={saveNotification}
            />

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
                {[
                    { id: 'users', icon: '👥', label: 'Users' },
                    { id: 'scores', icon: '📊', label: 'Scores' },
                    { id: 'active', icon: '🟢', label: 'Active' },
                    { id: 'reports', icon: '🚨', label: 'Reports' },
                    { id: 'book', icon: '📖', label: 'Book Club' },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => { setTab(t.id); setSearchTerm(''); }}
                        className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                            tab === t.id 
                                ? 'bg-text-main text-bg-base shadow-md scale-[1.02]' 
                                : 'glass text-text-muted hover:text-text-main hover:bg-bg-base/50'
                        }`}
                    >
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted material-symbols-outlined">search</span>
                <input
                    type="text"
                    className="w-full bg-bg-base/50 border-2 border-border-main rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium text-text-main placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                    placeholder={tab === 'users' ? 'Search by name, email, or nickname...' : 'Search by email or nickname...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tab Content Rendering with Suspense/Skeleton */}
            {loading ? (
                <SkeletonLoader />
            ) : (
                <div className="view-transition-in">
                    {tab === 'users' && (
                        <AdminUsersTab 
                            users={users} 
                            searchTerm={searchTerm} 
                            actionLoading={actionLoading}
                            onEditUser={(id, nickname) => setEditUserModal({ open: true, userId: id, nickname })}
                            onResetPassword={(id, email) => setResetPasswordModal({ open: true, userId: id, email, password: '' })}
                            onMessageUser={(id, name) => setMessageUserModal({ open: true, userId: id, name, message: '' })}
                            onDeleteUser={deleteUser}
                        />
                    )}
                    {tab === 'scores' && (
                        <AdminScoresTab 
                            scores={scores} 
                            scoreTab={scoreTab} 
                            setScoreTab={setScoreTab} 
                            searchTerm={searchTerm} 
                            actionLoading={actionLoading}
                            onViewLogs={(entry) => { setSelectedUserScores(entry); setScoreModalOpen(true); }}
                            onResetScores={resetScores}
                        />
                    )}
                    {tab === 'active' && (
                        <AdminActiveTab activeUsersList={activeUsersList} searchTerm={searchTerm} />
                    )}
                    {tab === 'reports' && (
                        <AdminReportsTab 
                            reports={reports} 
                            searchTerm={searchTerm} 
                            reportSubTab={reportSubTab} 
                            setReportSubTab={setReportSubTab} 
                            onViewReport={(r) => {
                                setSelectedReport(r);
                                setReportReply('');
                                setReportStatus(r.status || 'open');
                            }}
                            onDeleteReport={deleteReport}
                            deletingReport={deletingReport}
                        />
                    )}
                    {tab === 'book' && (
                        <AdminBookClubTab bookCompletions={bookCompletions} searchTerm={searchTerm} />
                    )}
                </div>
            )}

            {/* Modal Components */}
            
            {/* General Alert / Confirm Modal */}
            {modal.open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in p-4">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden view-transition-in border border-white/10">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2">{modal.title}</h3>
                            <p className="text-sm text-slate-300 mb-6">{modal.message}</p>
                            <div className="flex justify-end gap-3">
                                {modal.type === 'confirm' && (
                                    <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                                        Cancel
                                    </button>
                                )}
                                <button 
                                    onClick={() => {
                                        if (modal.type === 'confirm' && modal.onConfirm) modal.onConfirm();
                                        else closeModal();
                                    }} 
                                    className={`px-5 py-2 rounded-xl text-sm font-bold text-white transition-transform hover:scale-[1.02] ${modal.type === 'confirm' ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-primary shadow-lg shadow-primary/20'}`}
                                >
                                    {modal.type === 'confirm' ? 'Confirm' : 'OK'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Score History Modal */}
            {scoreModalOpen && selectedUserScores && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in p-4">
                    <div className="bg-[#1e293b] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden view-transition-in border border-white/10 flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="text-xl">📈</span> {selectedUserScores.name || selectedUserScores.email}&apos;s Logs
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">Total Score: {selectedUserScores.totalScore} / {selectedUserScores.totalMax}</p>
                            </div>
                            <button onClick={() => setScoreModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-0 overflow-y-auto flex-1">
                            {selectedUserScores.logs.length === 0 ? (
                                <div className="p-10 text-center text-slate-400">No detailed logs found.</div>
                            ) : (
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-black/40 text-slate-400 uppercase text-[10px] font-bold tracking-wider sticky top-0 backdrop-blur-md">
                                        <tr>
                                            <th className="p-4">Subject</th>
                                            <th className="p-4">Score</th>
                                            <th className="p-4">Time Taken</th>
                                            <th className="p-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {selectedUserScores.logs.map((log: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white/10 border border-white/10">{log.subject}</span>
                                                    {log.paper_id && <div className="text-[10px] text-slate-500 mt-1.5">{log.paper_id}</div>}
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-bold text-white">{log.score}</span> / {log.maxMarks}
                                                </td>
                                                <td className="p-4">{log.timeTaken ? `${Math.round(log.timeTaken / 60)} min` : '—'}</td>
                                                <td className="p-4 text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in p-4">
                    <div className="bg-[#1e293b] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden view-transition-in border border-white/10">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">Manage Report</h3>
                            <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Issue Description</p>
                                <p className="text-sm text-white">{selectedReport.error_message || 'N/A'}</p>
                            </div>

                            {selectedReport.route && (
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Route / Component</p>
                                    <p className="text-sm font-mono bg-black/40 text-blue-300 px-3 py-1.5 rounded-lg inline-block border border-blue-500/20">{selectedReport.route}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Update Status</label>
                                    <select 
                                        value={reportStatus} 
                                        onChange={e => setReportStatus(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                    >
                                        <option value="open">🔴 Open</option>
                                        <option value="in_progress">🟡 In Progress</option>
                                        <option value="resolved">🟢 Resolved</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Message User</label>
                                    <input 
                                        type="text" 
                                        placeholder="Optional reply..." 
                                        value={reportReply} 
                                        onChange={e => setReportReply(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                            <button onClick={() => setSelectedReport(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                            <button onClick={updateReport} disabled={savingReport} className="px-6 py-2 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
                                {savingReport ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editUserModal.open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in p-4">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden view-transition-in border border-white/10">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">Edit Nickname</h3>
                            <button onClick={() => setEditUserModal({ open: false, userId: null, nickname: '' })} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <input 
                                type="text" 
                                placeholder="Enter nickname" 
                                value={editUserModal.nickname} 
                                onChange={e => setEditUserModal(prev => ({ ...prev, nickname: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                            <button onClick={() => setEditUserModal({ open: false, userId: null, nickname: '' })} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleEditUser} disabled={savingReport} className="px-6 py-2 rounded-xl text-sm font-bold bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
                                {savingReport ? 'Saving...' : 'Save Nickname'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message User Modal */}
            {messageUserModal.open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in p-4">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden view-transition-in border border-white/10">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">Message {messageUserModal.name}</h3>
                            <button onClick={() => setMessageUserModal({ open: false, userId: null, name: '', message: '' })} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <textarea 
                                placeholder="Type your message here..." 
                                value={messageUserModal.message} 
                                onChange={e => setMessageUserModal(prev => ({ ...prev, message: e.target.value }))}
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                            ></textarea>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                            <button onClick={() => setMessageUserModal({ open: false, userId: null, name: '', message: '' })} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleMessageUser} disabled={savingReport} className="px-6 py-2 rounded-xl text-sm font-bold bg-purple-500 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
                                {savingReport ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {resetPasswordModal.open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in p-4">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden view-transition-in border border-white/10">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">Reset Password</h3>
                            <button onClick={() => setResetPasswordModal({ open: false, userId: null, email: '', password: '' })} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-400 mb-4">Resetting password for: <strong className="text-white">{resetPasswordModal.email}</strong></p>
                            <input 
                                type="password" 
                                placeholder="Enter new password" 
                                value={resetPasswordModal.password} 
                                onChange={e => setResetPasswordModal(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                            <button onClick={() => setResetPasswordModal({ open: false, userId: null, email: '', password: '' })} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleResetPassword} disabled={savingReport || !resetPasswordModal.password} className="px-6 py-2 rounded-xl text-sm font-bold bg-red-500 text-white shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
                                {savingReport ? 'Resetting...' : 'Confirm Reset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
