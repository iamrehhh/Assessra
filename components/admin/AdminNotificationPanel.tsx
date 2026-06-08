import React from 'react';

interface AdminNotificationPanelProps {
    notificationMessage: string;
    setNotificationMessage: (msg: string) => void;
    notificationActive: boolean;
    setNotificationActive: (active: boolean) => void;
    saveNotification: () => void;
}

export default function AdminNotificationPanel({
    notificationMessage,
    setNotificationMessage,
    notificationActive,
    setNotificationActive,
    saveNotification
}: AdminNotificationPanelProps) {
    return (
        <div className="glass rounded-2xl p-6 md:p-8 border border-border-main shadow-sm mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                        <span className="text-xl">📢</span> Global Notification
                    </h2>
                    <p className="text-sm text-text-muted mt-1">Broadcast a message to all users on the dashboard.</p>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <input
                    type="text"
                    value={notificationMessage}
                    onChange={e => setNotificationMessage(e.target.value)}
                    placeholder="Enter notification message..."
                    className="flex-1 w-full bg-bg-base/50 border-2 border-border-main rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                />
                
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-border-main bg-bg-base/50 cursor-pointer hover:bg-bg-base transition-colors shrink-0">
                    <input
                        type="checkbox"
                        checked={notificationActive}
                        onChange={e => setNotificationActive(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-border-main text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-sm font-bold text-text-main">Active Status</span>
                </label>
                
                <button
                    onClick={saveNotification}
                    className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-primary text-white shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform shrink-0"
                >
                    Publish Update
                </button>
            </div>
        </div>
    );
}
