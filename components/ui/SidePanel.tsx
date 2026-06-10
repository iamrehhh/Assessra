'use client';

import React, { useEffect, useState } from 'react';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: 'md' | 'lg' | 'xl' | '2xl'; // Different width options
}

export default function SidePanel({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    width = 'md'
}: SidePanelProps) {
    const [renderState, setRenderState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');

    useEffect(() => {
        if (isOpen) {
            setRenderState('opening');
            // Give a tiny frame for opening state to apply, then switch to open
            requestAnimationFrame(() => requestAnimationFrame(() => setRenderState('open')));
        } else if (renderState === 'open' || renderState === 'opening') {
            setRenderState('closing');
            // Wait for animation to finish before unmounting
            setTimeout(() => setRenderState('closed'), 300); // 300ms matches transition duration
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (renderState === 'closed') return null;

    const widthClasses = {
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    const isVisible = renderState === 'open' || renderState === 'opening';

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out
                ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div 
                className={`fixed top-0 right-0 bottom-0 z-[9999] w-full ${widthClasses[width]} 
                bg-[#1e293b]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col
                transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-start bg-black/20 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-white transition-colors p-2 -mr-2 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label="Close panel"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth hide-scrollbar relative">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-5 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
}
