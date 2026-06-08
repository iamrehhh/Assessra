import React, { useState } from 'react';

interface AdminReportsTabProps {
    reports: any[];
    searchTerm: string;
    reportSubTab: string;
    setReportSubTab: (tab: string) => void;
    onViewReport: (report: any) => void;
    onDeleteReport: (id: string) => void;
    deletingReport: boolean;
}

export default function AdminReportsTab({
    reports,
    searchTerm,
    reportSubTab,
    setReportSubTab,
    onViewReport,
    onDeleteReport,
    deletingReport
}: AdminReportsTabProps) {
    const filteredReports = reports.filter(r =>
        (r.status || 'open') === reportSubTab &&
        ((r.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
         (r.error_message || '').toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const subTabs = [
        { key: 'open', label: '🔴 Open', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
        { key: 'in_progress', label: '🟡 In Progress', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
        { key: 'resolved', label: '🟢 Resolved', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Sub-tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {subTabs.map(st => {
                    const count = reports.filter(r => (r.status || 'open') === st.key).length;
                    return (
                        <button
                            key={st.key}
                            onClick={() => setReportSubTab(st.key)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                                reportSubTab === st.key 
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
                                    : 'glass text-text-muted hover:text-text-main hover:bg-bg-base/50'
                            }`}
                        >
                            {st.label}
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${reportSubTab === st.key ? 'bg-white/20 border-white/30 text-white' : st.color}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                    <span className="text-4xl mb-4">🚨</span>
                    <p className="font-semibold text-lg">No {reportSubTab.replace('_', ' ')} reports</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports.map(r => (
                        <div key={r.id} className="glass rounded-2xl p-6 border border-border-main hover:border-primary/50 transition-colors flex flex-col group shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                                    r.type === 'bug' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                                    r.type === 'content' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                                    'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                }`}>
                                    {r.type || 'bug'}
                                </span>
                                <span className="text-xs text-text-muted font-medium">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-text-main text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {r.error_message || 'No description'}
                            </h3>
                            
                            <div className="text-sm text-text-muted mb-6 flex-1 break-all">
                                <strong>User:</strong> {r.user_email || 'Anonymous'}
                            </div>

                            <div className="flex gap-3 mt-auto pt-4 border-t border-border-main">
                                <button
                                    className="flex-1 py-2 rounded-xl text-sm font-bold bg-primary text-white shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
                                    onClick={() => onViewReport(r)}
                                >
                                    Manage Report
                                </button>
                                <button
                                    className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                    disabled={deletingReport}
                                    onClick={() => onDeleteReport(r.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
