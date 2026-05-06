'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = 'info', duration = 4000) => {
        const id = idCounter++;
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`animate-slide-up glass pointer-events-auto rounded-xl shadow-2xl border p-4 flex items-start gap-3 transform transition-all duration-300
                            ${t.type === 'success' ? 'border-green-500/20 bg-green-500/5' :
                                t.type === 'error' ? 'border-red-500/20 bg-red-500/5' :
                                    'border-white/10 bg-white/5'}`}
                    >
                        <span className={`material-symbols-outlined shrink-0
                            ${t.type === 'success' ? 'text-green-400' :
                                t.type === 'error' ? 'text-red-400' :
                                    'text-blue-400'}`}>
                            {t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info'}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-200 text-sm font-medium leading-snug">{t.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                ))}
            </div>

            <style jsx global>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
}
