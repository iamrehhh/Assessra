import React from 'react';

interface AdminActiveTabProps {
    activeUsersList: any[];
    searchTerm: string;
}

export default function AdminActiveTab({ activeUsersList, searchTerm }: AdminActiveTabProps) {
    const filteredActiveUsers = activeUsersList.filter(u =>
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredActiveUsers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                <span className="text-4xl mb-4">🟢</span>
                <p className="font-semibold text-lg">No users currently active</p>
                <p className="text-sm mt-2">Active users will appear here automatically.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto glass rounded-2xl shadow-sm border border-border-main animate-fade-in">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-bg-base/50 border-b border-border-main">
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Current Page</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Last Seen</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                    {filteredActiveUsers.map(user => (
                        <tr key={user.email} className="hover:bg-bg-base/40 transition-colors group">
                            <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm"
                                            style={user.image ? { backgroundImage: `url(${user.image})`, backgroundSize: 'cover' } : {}}
                                        >
                                            {!user.image && (user.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full animate-pulse-slow"></span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-text-main group-hover:text-primary transition-colors">{user.name || 'Student'}</div>
                                        <div className="text-xs text-text-muted mt-0.5">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-5">
                                <span className="px-3 py-1 rounded-md text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                    {user.current_page || 'home'}
                                </span>
                            </td>
                            <td className="py-4 px-5 text-sm text-text-muted font-medium">
                                {(() => {
                                    const date = new Date(user.last_seen);
                                    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000 / 60);
                                    if (diff === 0) return <span className="text-primary font-bold">Just now</span>;
                                    return `${diff} min ago`;
                                })()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
