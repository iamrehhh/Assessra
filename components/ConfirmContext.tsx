'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        resolve: null,
    });

    // We use a ref to ensure we can reject if the user navigates away
    const resolveRef = useRef(null);

    const confirm = useCallback((title, message) => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setConfirmState({
                isOpen: true,
                title,
                message,
                resolve,
            });
        });
    }, []);

    const handleAction = (result) => {
        if (resolveRef.current) {
            resolveRef.current(result);
            resolveRef.current = null;
        }
        setConfirmState({ ...confirmState, isOpen: false });
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {confirmState.isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-fade-in">
                    <div className="glass rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-border-main transform transition-all animate-scale-up">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                                <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-main">{confirmState.title}</h3>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed mb-8">
                            {confirmState.message}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handleAction(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-text-muted hover:text-text-main hover:bg-black/5 dark:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAction(true)}
                                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-500/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes scale-up {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-up {
                    animation: scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context.confirm;
}
