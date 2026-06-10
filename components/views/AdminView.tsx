'use client';

import { useState, useEffect, useCallback } from 'react';
import { ADMIN_EMAILS } from '@/lib/admin';
import { useToast } from '@/components/ToastContext';
import { useConfirm } from '@/components/ConfirmContext';

// Import sub-components
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminScoresTab from '@/components/admin/AdminScoresTab';
import AdminActiveTab from '@/components/admin/AdminActiveTab';
import AdminReportsTab from '@/components/admin/AdminReportsTab';

import AdminNotificationPanel from '@/components/admin/AdminNotificationPanel';
import AdminTimersTab from '@/components/admin/AdminTimersTab';
import SidePanel from '@/components/ui/SidePanel';

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
    const [scoreModalOpen, setScoreModalOpen] = useState(false);
    const [selectedUserScores, setSelectedUserScores] = useState<any>(null);
    const [editUserModal, setEditUserModal] = useState({ open: false, userId: null as string | null, nickname: '' });
    const [messageUserModal, setMessageUserModal] = useState({ open: false, userId: null as string | null, name: '', message: '' });
    const [resetPasswordModal, setResetPasswordModal] = useState({ open: false, userId: null as string | null, email: '', password: '' });

    const toast = useToast();
    const showConfirm = useConfirm();

    const showAlert = useCallback((title: string, message: string) => {
        // Map common titles to toast types
        const type = title.toLowerCase().includes('error') ? 'error' : 'success';
        toast(message, type);
    }, [toast]);

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
        const confirmed = await showConfirm('Delete Report', 'Permanently delete this error report? This action cannot be undone.');
        if (!confirmed) return;
        
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
    };

    const deleteUser = async (id: string, email: string) => {
        const confirmed = await showConfirm('Delete User', `Permanently delete user "${email}" and all their scores?`);
        if (!confirmed) return;

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
    };

    const resetScores = async (email: string) => {
        const confirmed = await showConfirm('Reset Scores', `Reset ALL scores for "${email}"? This cannot be undone.`);
        if (!confirmed) return;

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

                    { id: 'timers', icon: '⏱️', label: 'Timers' },
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

                    {tab === 'timers' && (
                        <AdminTimersTab showAlert={showAlert} />
                    )}
                </div>
            )}

            {/* Modal Components */}
            
            {/* Score History Side Panel */}
            <SidePanel 
                isOpen={scoreModalOpen && !!selectedUserScores} 
                onClose={() => setScoreModalOpen(false)}
                title={
                    <span className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                            <span className="material-symbols-outlined text-xl">analytics</span>
                        </div>
                        {selectedUserScores?.name || selectedUserScores?.email}&apos;s Logs
                    </span>
                }
                subtitle={`Total Score: ${selectedUserScores?.totalScore} / ${selectedUserScores?.totalMax}`}
                width="2xl"
            >
                {selectedUserScores && (
                    <div className="space-y-4">
                        {selectedUserScores.logs.length === 0 ? (
                            <div className="p-12 glass rounded-[2rem] border border-border-main text-center flex flex-col items-center justify-center">
                                <span className="material-symbols-outlined text-5xl text-text-muted opacity-30 mb-4">history</span>
                                <p className="text-text-main font-bold">No detailed logs found.</p>
                                <p className="text-sm text-text-muted mt-1">This user hasn&apos;t completed any practice sessions yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {selectedUserScores.logs.map((log: any, idx: number) => {
                                    const percentage = log.maxMarks > 0 ? Math.round((log.score / log.maxMarks) * 100) : 0;
                                    const isGood = percentage >= 70;
                                    const isOk = percentage >= 40 && percentage < 70;
                                    
                                    return (
                                        <div key={idx} className="glass p-5 rounded-2xl border border-border-main hover:border-primary/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-black/5 dark:bg-white/5 border border-border-main text-text-main uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className={`material-symbols-outlined text-[14px] ${log.subject === 'vocab' || log.subject === 'idioms' ? 'text-blue-500' : 'text-primary'}`}>
                                                            {log.subject === 'vocab' ? 'spellcheck' : log.subject === 'idioms' ? 'forum' : 'library_books'}
                                                        </span>
                                                        {log.subject}
                                                    </span>
                                                    <span className="text-xs font-bold text-text-muted flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                        {log.submittedAt ? new Date(log.submittedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown Date'}
                                                    </span>
                                                </div>
                                                <p className="font-bold text-text-main text-sm truncate group-hover:text-primary transition-colors">
                                                    {log.paperTitle || log.paperId || log.paper_id || 'Practice Session'}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-6 sm:border-l border-border-main sm:pl-6">
                                                {log.timeTaken && (
                                                    <div className="text-center">
                                                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Time</div>
                                                        <div className="text-sm font-bold text-text-main">{Math.round(log.timeTaken / 60)}m</div>
                                                    </div>
                                                )}
                                                <div className="text-center min-w-[60px]">
                                                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Score</div>
                                                    <div className="text-lg font-black flex items-baseline justify-center gap-1">
                                                        <span className={isGood ? 'text-green-500' : isOk ? 'text-amber-500' : 'text-red-500'}>{log.score}</span>
                                                        <span className="text-xs text-text-muted font-bold">/{log.maxMarks}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </SidePanel>

            {/* Report Side Panel */}
            <SidePanel 
                isOpen={!!selectedReport} 
                onClose={() => setSelectedReport(null)}
                title="Manage Report"
                width="md"
                footer={
                    <>
                        <button onClick={() => setSelectedReport(null)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button onClick={updateReport} disabled={savingReport} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
                            {savingReport ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            >
                {selectedReport && (
                    <div className="space-y-6">
                        <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Issue Description</p>
                            <p className="text-sm text-white leading-relaxed">{selectedReport.error_message || 'N/A'}</p>
                        </div>

                        {selectedReport.route && (
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Route / Component</p>
                                <p className="text-xs font-mono bg-black/40 text-blue-300 px-3 py-2 rounded-xl inline-block border border-blue-500/20">{selectedReport.route}</p>
                            </div>
                        )}

                        <div className="space-y-5 pt-2">
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Update Status</label>
                                <div className="relative">
                                    <select 
                                        value={reportStatus} 
                                        onChange={e => setReportStatus(e.target.value)}
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="open">🔴 Open</option>
                                        <option value="in_progress">🟡 In Progress</option>
                                        <option value="resolved">🟢 Resolved</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Message User</label>
                                <textarea 
                                    placeholder="Add an optional reply to the user..." 
                                    value={reportReply} 
                                    onChange={e => setReportReply(e.target.value)}
                                    rows={3}
                                    className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder-slate-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </SidePanel>

            {/* Edit User Side Panel */}
            <SidePanel 
                isOpen={editUserModal.open} 
                onClose={() => setEditUserModal({ open: false, userId: null, nickname: '' })}
                title="Edit Nickname"
                width="md"
                footer={
                    <>
                        <button onClick={() => setEditUserModal({ open: false, userId: null, nickname: '' })} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleEditUser} disabled={savingReport} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
                            {savingReport ? 'Saving...' : 'Save Nickname'}
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">User Nickname</label>
                    <input 
                        type="text" 
                        placeholder="Enter nickname" 
                        value={editUserModal.nickname} 
                        onChange={e => setEditUserModal(prev => ({ ...prev, nickname: e.target.value }))}
                        className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-amber-500 transition-colors placeholder-slate-500"
                    />
                </div>
            </SidePanel>

            {/* Message User Side Panel */}
            <SidePanel 
                isOpen={messageUserModal.open} 
                onClose={() => setMessageUserModal({ open: false, userId: null, name: '', message: '' })}
                title={`Message ${messageUserModal.name}`}
                width="md"
                footer={
                    <>
                        <button onClick={() => setMessageUserModal({ open: false, userId: null, name: '', message: '' })} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleMessageUser} disabled={savingReport} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-purple-500 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
                            {savingReport ? 'Sending...' : 'Send Message'}
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Custom Message</label>
                    <textarea 
                        placeholder="Type your message here..." 
                        value={messageUserModal.message} 
                        onChange={e => setMessageUserModal(prev => ({ ...prev, message: e.target.value }))}
                        rows={6}
                        className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-slate-500"
                    ></textarea>
                </div>
            </SidePanel>

            {/* Reset Password Side Panel */}
            <SidePanel 
                isOpen={resetPasswordModal.open} 
                onClose={() => setResetPasswordModal({ open: false, userId: null, email: '', password: '' })}
                title="Reset Password"
                width="md"
                footer={
                    <>
                        <button onClick={() => setResetPasswordModal({ open: false, userId: null, email: '', password: '' })} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleResetPassword} disabled={savingReport || !resetPasswordModal.password} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50">
                            {savingReport ? 'Resetting...' : 'Confirm Reset'}
                        </button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                        <p className="text-sm text-red-200">Resetting password for:<br/><strong className="text-red-100 mt-1 block break-all">{resetPasswordModal.email}</strong></p>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">New Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter new password" 
                            value={resetPasswordModal.password} 
                            onChange={e => setResetPasswordModal(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-red-500 transition-colors placeholder-slate-500"
                        />
                    </div>
                </div>
            </SidePanel>
        </div>
    );
}
