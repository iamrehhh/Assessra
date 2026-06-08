import React from 'react';
import { ADMIN_EMAILS } from '@/lib/admin';

interface AdminUsersTabProps {
    users: any[];
    searchTerm: string;
    actionLoading: string | null;
    onEditUser: (id: string, nickname: string) => void;
    onResetPassword: (id: string, email: string) => void;
    onMessageUser: (id: string, name: string) => void;
    onDeleteUser: (id: string, email: string) => void;
}

export default function AdminUsersTab({
    users,
    searchTerm,
    actionLoading,
    onEditUser,
    onResetPassword,
    onMessageUser,
    onDeleteUser
}: AdminUsersTabProps) {
    const filteredUsers = users.filter(u =>
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.nickname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredUsers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                <span className="text-4xl mb-4">👥</span>
                <p className="font-semibold text-lg">No users found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto glass rounded-2xl shadow-sm border border-border-main">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-bg-base/50 border-b border-border-main">
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Email</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Nickname</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Level</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Provider</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Joined</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-bg-base/40 transition-colors group">
                            <td className="py-3 px-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm"
                                        style={user.image ? { backgroundImage: `url(${user.image})`, backgroundSize: 'cover' } : {}}
                                    >
                                        {!user.image && (user.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-text-main group-hover:text-primary transition-colors">{user.name || '—'}</span>
                                </div>
                            </td>
                            <td className="py-3 px-5 text-sm text-text-muted">{user.email}</td>
                            <td className="py-3 px-5 text-sm">{user.nickname || <span className="text-text-muted/50">—</span>}</td>
                            <td className="py-3 px-5">
                                {user.level ? (
                                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                        {user.level}
                                    </span>
                                ) : <span className="text-text-muted/50">—</span>}
                            </td>
                            <td className="py-3 px-5">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${user.provider === 'google' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'}`}>
                                    {user.provider || 'google'}
                                </span>
                            </td>
                            <td className="py-3 px-5 text-xs text-text-muted">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </td>
                            <td className="py-3 px-5">
                                {!ADMIN_EMAILS.includes(user.email) ? (
                                    <div className="flex flex-wrap gap-2">

                                        <button
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                                            onClick={() => onMessageUser(user.id, user.name || user.email)}
                                        >
                                            Message
                                        </button>
                                        <button
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                                            disabled={actionLoading === user.id}
                                            onClick={() => onDeleteUser(user.id, user.email)}
                                        >
                                            {actionLoading === user.id ? 'Removing...' : 'Remove'}
                                        </button>
                                    </div>
                                ) : (
                                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">Admin</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
