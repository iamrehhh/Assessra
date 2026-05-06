'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10 rounded-xl bg-bg-card border border-border-main animate-pulse"></div>;
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`
                relative flex items-center justify-center w-10 h-10 rounded-xl
                transition-all duration-300 ease-in-out
                bg-bg-card hover:bg-black/5 dark:hover:bg-white/5
                border border-border-main shadow-sm
                overflow-hidden group
            `}
            aria-label="Toggle Theme"
        >
            <div className={`
                absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 
                transition-opacity duration-300
            `}></div>

            <div className={`
                relative flex items-center justify-center w-full h-full
                transition-transform duration-500 transform
                ${isDark ? 'rotate-180' : 'rotate-0'}
            `}>
                {isDark ? (
                    <span className="material-symbols-outlined text-text-main group-hover:text-primary transition-colors text-[20px] fill-1">
                        dark_mode
                    </span>
                ) : (
                    <span className="material-symbols-outlined text-text-main group-hover:text-primary transition-colors text-[20px] fill-1">
                        light_mode
                    </span>
                )}
            </div>
        </button>
    );
}
