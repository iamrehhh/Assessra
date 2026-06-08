import React from 'react';

interface AdminBookClubTabProps {
    bookCompletions: any[];
    searchTerm: string;
}

export default function AdminBookClubTab({ bookCompletions, searchTerm }: AdminBookClubTabProps) {
    const filteredCompletions = bookCompletions.filter(c =>
        (c.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.book_title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredCompletions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                <span className="text-4xl mb-4">📖</span>
                <p className="font-semibold text-lg">No book completions found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto glass rounded-2xl shadow-sm border border-border-main animate-fade-in">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-bg-base/50 border-b border-border-main">
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">User Email</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Book Title</th>
                        <th className="py-4 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Completed At</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                    {filteredCompletions.map(c => (
                        <tr key={c.id} className="hover:bg-bg-base/40 transition-colors">
                            <td className="py-3 px-5 text-sm font-semibold text-text-main">{c.user_email}</td>
                            <td className="py-3 px-5 text-sm text-text-muted">{c.book_title || <span className="text-text-muted/50">—</span>}</td>
                            <td className="py-3 px-5 text-xs text-text-muted">
                                {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
