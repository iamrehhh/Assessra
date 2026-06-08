
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const CATEGORIES = [
    { value: 'bug', label: 'Bug / Crash', icon: 'bug_report' },
    { value: 'wrong_answer', label: 'Wrong AI Answer', icon: 'error' },
    { value: 'missing_content', label: 'Missing Content', icon: 'help' },
    { value: 'ui_issue', label: 'UI / Design Issue', icon: 'palette' },
    { value: 'other', label: 'Other', icon: 'more_horiz' },
];

const STATUS_COLORS = {
    open: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20', label: 'Open' },
    in_progress: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20', label: 'In Progress' },
    resolved: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Resolved' },
};

export default function ReportErrorModal({ currentView }: { currentView: string }) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState('new'); // 'new' or 'history'

    // Form state
    const [category, setCategory] = useState('bug');
    const [page, setPage] = useState('');
    const [description, setDescription] = useState('');
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // History state
    const [myReports, setMyReports] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [hasUnreadReply, setHasUnreadReply] = useState(false);

    // Reply state
    const [activeReportId, setActiveReportId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    // Listen for open event
    useEffect(() => {
        const handleOpen = () => setOpen(true);
        window.addEventListener('open-report-modal', handleOpen);
        return () => window.removeEventListener('open-report-modal', handleOpen);
    }, []);

    // Auto-populate page when opening
    useEffect(() => {
        if (open) {
            setPage(currentView || 'home');
            setSubmitted(false);
            fetchMyReports();
            if (hasUnreadReply) {
                setTab('history');
            }
        }
    }, [open, currentView]);

    // Check for unread replies periodically
    useEffect(() => {
        const checkReplies = async () => {
            try {
                const res = await fetch('/api/reports?mine=true');
                if (res.ok) {
                    const data = await res.json();
                    const seen = JSON.parse(localStorage.getItem('assessra_seen_replies') || '[]');
                    const hasNew = (data.reports || []).some(r => r.admin_reply && !seen.includes(r.id));
                    setHasUnreadReply(hasNew);
                }
            } catch (e) { /* silent */ }
        };
        checkReplies();
        const interval = setInterval(checkReplies, 60000); // check every minute
        return () => clearInterval(interval);
    }, []);

    const fetchMyReports = async () => {
        setLoadingHistory(true);
        try {
            const res = await fetch('/api/reports?mine=true');
            if (res.ok) {
                const data = await res.json();
                setMyReports(data.reports || []);
                // Mark replied ones as seen
                const seen = JSON.parse(localStorage.getItem('assessra_seen_replies') || '[]');
                const newSeen = [...new Set([...seen, ...(data.reports || []).filter(r => r.admin_reply).map(r => r.id)])];
                localStorage.setItem('assessra_seen_replies', JSON.stringify(newSeen));
                setHasUnreadReply(false);
                window.dispatchEvent(new CustomEvent('report-replies-read'));
            }
        } catch (e) { console.error('Failed to fetch reports', e); }
        setLoadingHistory(false);
    };

    const handleFileSelect = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Image must be less than 5MB');
            return;
        }

        setScreenshotFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setScreenshotPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const clearScreenshot = () => {
        setScreenshotFile(null);
        setScreenshotPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!description.trim()) return;
        setSubmitting(true);
        try {
            let screenshot_url = null;

            // Upload screenshot if present
            if (screenshotFile) {
                const formData = new FormData();
                formData.append('file', screenshotFile);

                const uploadRes = await fetch('/api/upload-screenshot', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    screenshot_url = uploadData.url;
                } else {
                    const errorText = await uploadRes.text();
                    console.error('Failed to upload screenshot', errorText);
                    alert(`Screenshot upload failed: ${errorText}. Please share this exact error message with the AI assistant.`);
                    setSubmitting(false);
                    return;
                }
            }

            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, page, description, screenshot_url }),
            });

            if (res.ok) {
                setSubmitted(true);
                setDescription('');
                setCategory('bug');
                clearScreenshot();
                fetchMyReports();
            }
        } catch (e) {
            console.error('Report submit error', e);
            alert('Failed to submit report. Please try again.');
        }
        setSubmitting(false);
    };

    const handleSendReply = async (reportId) => {
        if (!replyText.trim()) return;
        setSendingReply(true);
        try {
            const res = await fetch('/api/reports', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: reportId,
                    new_message: replyText
                })
            });

            if (res.ok) {
                setReplyText('');
                // Update local state by refetching
                fetchMyReports();
            } else {
                alert('Failed to send reply. Please try again.');
            }
        } catch (e) {
            console.error('Reply submit error', e);
            alert('Network error while sending reply.');
        }
        setSendingReply(false);
    };

    const toggleThread = (reportId) => {
        if (activeReportId === reportId) {
            setActiveReportId(null);
        } else {
            setActiveReportId(reportId);
            setReplyText('');
        }
    };

    const close = () => {
        setOpen(false);
        setTab('new');
        setSubmitted(false);
        setActiveReportId(null);
    };

    if (!open) {
        if (typeof window !== 'undefined') {
            (window as any).__reportHasUnread = hasUnreadReply;
        }
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={close}>
            <div
                className="glass bg-bg-card w-full max-w-lg max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-border-main"
                style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-main flex items-center justify-between shrink-0 bg-black/5 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center border border-red-500/20">
                            <span className="material-symbols-outlined text-red-400 text-lg">bug_report</span>
                        </div>
                        <h2 className="text-lg font-black text-text-main">Report an Issue</h2>
                    </div>
                    <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="px-6 pt-4 flex gap-1 bg-black/5 dark:bg-white/5 shrink-0">
                    <button
                        onClick={() => setTab('new')}
                        className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${tab === 'new' ? 'bg-black/10 dark:bg-white/10 text-text-main border-b-2 border-primary' : 'text-text-muted/70 hover:text-text-main'}`}
                    >
                        New Report
                    </button>
                    <button
                        onClick={() => { setTab('history'); fetchMyReports(); }}
                        className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 ${tab === 'history' ? 'bg-black/10 dark:bg-white/10 text-text-main border-b-2 border-primary' : 'text-text-muted/70 hover:text-text-main'}`}
                    >
                        My Reports
                        {myReports.length > 0 && (
                            <span className="bg-black/10 dark:bg-white/10 text-text-muted text-[10px] font-bold px-1.5 py-0.5 rounded-full">{myReports.length}</span>
                        )}
                        {hasUnreadReply && (
                            <span className="relative flex h-2.5 w-2.5 ml-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        )}
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {tab === 'new' ? (
                        submitted ? (
                            /* Success State */
                            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
                                </div>
                                <h3 className="text-lg font-bold text-text-main">Report Submitted!</h3>
                                <p className="text-sm text-text-muted max-w-xs">
                                    Thank you for helping us improve. We'll review your report and get back to you.
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setSubmitted(false)} className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border-main text-text-main text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                                        Submit Another
                                    </button>
                                    <button onClick={close} className="px-4 py-2 rounded-xl bg-primary/15 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/25 transition-all">
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Report Form */
                            <>
                                {/* Category Select */}
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Category</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat.value}
                                                onClick={() => setCategory(cat.value)}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${category === cat.value
                                                    ? 'bg-primary/15 border-primary/30 text-primary shadow-sm'
                                                    : 'bg-black/5 dark:bg-white/5 border-border-main text-text-muted hover:border-black/20 dark:hover:border-white/20 hover:text-text-main'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Page */}
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Page / Section</label>
                                    <input
                                        type="text"
                                        value={page}
                                        onChange={e => setPage(e.target.value)}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-border-main rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/40 transition-colors"
                                        placeholder="e.g. Past Papers, Leaderboard"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-border-main rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/40 transition-colors resize-y min-h-[100px]"
                                        placeholder="Describe the issue in detail... What happened? What did you expect?"
                                    />
                                </div>

                                {/* Screenshot Upload */}
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Screenshot (Optional)</label>

                                    {!screenshotPreview ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-black/5 dark:bg-white/5 border border-border-main border-dashed rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors text-text-muted">
                                                <span className="material-symbols-outlined">add_photo_alternate</span>
                                            </div>
                                            <p className="text-sm font-medium text-text-main">Click to upload screenshot</p>
                                            <p className="text-xs text-text-muted/70">Max 5MB (PNG, JPG)</p>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileSelect}
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl border border-border-main overflow-hidden bg-black/5 dark:bg-white/5 group">
                                            <img src={screenshotPreview} alt="Screenshot preview" className="w-full max-h-48 object-contain" />
                                            <div className="absolute inset-0 bg-bg-card/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={clearScreenshot}
                                                    className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors backdrop-blur-sm"
                                                >
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !description.trim()}
                                    className={`w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl font-bold text-sm transition-all ${submitting || !description.trim()
                                        ? 'bg-black/5 dark:bg-white/5 text-text-muted/50 cursor-not-allowed border border-border-main'
                                        : 'bg-red-500 text-white hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_25px_rgba(239,68,68,0.4)]'
                                        }`}
                                >
                                    {submitting ? (
                                        <><div className="w-4 h-4 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" /> Submitting...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-base">send</span> Submit Report</>
                                    )}
                                </button>
                            </>
                        )
                    ) : (
                        /* History Tab */
                        loadingHistory ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-border-main border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : myReports.length === 0 ? (
                            <div className="text-center py-8 space-y-3">
                                <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined text-text-muted/70 text-2xl">inbox</span>
                                </div>
                                <p className="text-sm text-text-muted font-medium">No reports yet</p>
                                <p className="text-xs text-text-muted/50">Submit a report and it will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myReports.map(report => {
                                    const st = STATUS_COLORS[report.status] || STATUS_COLORS.open;
                                    const seen = JSON.parse(localStorage.getItem('assessra_seen_replies') || '[]');
                                    const isNewReply = report.admin_reply && !seen.includes(report.id);
                                    const messages = report.messages && report.messages.length > 0 ? report.messages : [
                                        { sender: 'user', text: report.description, created_at: report.created_at },
                                        ...(report.admin_reply ? [{ sender: 'admin', text: report.admin_reply, created_at: report.updated_at || report.created_at }] : [])
                                    ];
                                    const isActive = activeReportId === report.id;

                                    return (
                                        <div key={report.id} className={`bg-black/5 dark:bg-white/5 border rounded-2xl overflow-hidden transition-all ${isNewReply ? 'border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.15)]' : isActive ? 'border-primary/30' : 'border-border-main'}`}>
                                            {/* Header row (clickable to expand) */}
                                            <div
                                                className="p-4 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-between"
                                                onClick={() => toggleThread(report.id)}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                                                            {st.label}
                                                        </span>
                                                        <span className="text-[10px] text-text-muted/70 uppercase font-bold">{report.category?.replace('_', ' ')}</span>
                                                        {report.screenshot_url && (
                                                            <span className="material-symbols-outlined text-text-muted/70 text-xs" title="Has Screenshot">image</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-text-main font-medium truncate max-w-[280px]">
                                                        {report.description}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {isNewReply && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                                                            NEW REPLY
                                                        </span>
                                                    )}
                                                    <span className="material-symbols-outlined text-text-muted/70 transition-transform duration-300" style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0)' }}>
                                                        expand_more
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Expanded Thread */}
                                            {isActive && (
                                                <div className="border-t border-border-main bg-black/10 dark:bg-white/5 p-4">
                                                    {/* Screenshot if available */}
                                                    {report.screenshot_url && (
                                                        <div className="mb-4 rounded-xl overflow-hidden border border-border-main max-w-sm">
                                                            <a href={report.screenshot_url} target="_blank" rel="noopener noreferrer" className="block relative group">
                                                                <img src={report.screenshot_url} alt="Attached screenshot" className="w-full h-auto object-cover" />
                                                                <div className="absolute inset-0 bg-bg-card/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                    <span className="text-white text-xs font-bold px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-sm">open_in_new</span> Expand
                                                                    </span>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Messages List */}
                                                    <div className="space-y-3 mb-4">
                                                        {messages.map((msg, idx) => {
                                                            const isUser = msg.sender === 'user';
                                                            return (
                                                                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                                    <div className={`max-w-[85%] rounded-2xl p-3 ${isUser ? 'bg-black/10 dark:bg-white/10 text-text-main rounded-tr-sm' : 'bg-primary/20 border border-primary/20 text-text-main rounded-tl-sm'}`}>
                                                                        {!isUser && (
                                                                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                                                                <span className="material-symbols-outlined text-xs">support_agent</span>
                                                                                Admin Support
                                                                            </p>
                                                                        )}
                                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                                        <div className={`text-[9px] mt-1.5 opacity-60 flex items-center gap-1 text-text-muted ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                                            {msg.created_at && new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Reply Input */}
                                                    {report.status !== 'resolved' && (
                                                        <div className="flex items-end gap-2 mt-2">
                                                            <div className="flex-1 bg-black/5 dark:bg-white/5 border border-border-main rounded-xl overflow-hidden focus-within:border-primary/40 focus-within:bg-black/10 dark:focus-within:bg-white/10 transition-colors">
                                                                <textarea
                                                                    value={replyText}
                                                                    onChange={e => setReplyText(e.target.value)}
                                                                    placeholder="Reply to admin..."
                                                                    className="w-full bg-transparent p-3 text-sm text-text-main placeholder-text-muted/50 outline-none resize-none max-h-32 min-h-[44px]"
                                                                    rows={1}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                                            e.preventDefault();
                                                                            handleSendReply(report.id);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => handleSendReply(report.id)}
                                                                disabled={!replyText.trim() || sendingReply}
                                                                className={`p-3 rounded-xl flex items-center justify-center transition-colors shrink-0 ${!replyText.trim() || sendingReply ? 'bg-black/5 dark:bg-white/5 text-text-muted/50 cursor-not-allowed' : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20'}`}
                                                            >
                                                                {sendingReply ? (
                                                                    <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-xl leading-none">send</span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                    {report.status === 'resolved' && (
                                                        <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                            <p className="text-xs text-emerald-400 font-medium">This issue is marked as resolved.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
