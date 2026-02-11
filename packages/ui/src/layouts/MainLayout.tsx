import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    logoText?: string;
    sidebarContent?: React.ReactNode;
}

export type ThemeType = 'light' | 'dark' | 'neon' | 'calm' | 'fun';

export const MainLayout: React.FC<MainLayoutProps> = ({ children, logoText = "KaiOS", sidebarContent }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState<ThemeType>('neon');

    const themeClasses = {
        light: 'bg-surface-50 text-slate-900',
        dark: 'dark bg-slate-950 text-slate-100',
        neon: 'dark bg-slate-950 text-neon-blue',
        calm: 'bg-calm-bg text-calm-text',
        fun: 'bg-fun-bg text-fun-text',
    };

    return (
        <div className={`${theme} ${theme === 'dark' || theme === 'neon' ? 'dark' : ''} ${themeClasses[theme]} min-h-screen flex flex-col overflow-hidden transition-colors duration-500`}>
            <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className={`flex items-center gap-2 font-bold text-xl cursor-pointer transition-all ${theme === 'neon' ? 'text-neon-blue drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]' :
                        theme === 'calm' ? 'text-calm-primary' :
                            theme === 'fun' ? 'text-fun-primary' : 'text-brand-900 dark:text-white'
                        }`}>
                        <div className={`w-8 h-8 rounded-lg transition-all ${theme === 'neon' ? 'bg-neon-blue shadow-neon-blue' :
                            theme === 'calm' ? 'bg-calm-primary shadow-calm-soft' :
                                theme === 'fun' ? 'bg-fun-primary shadow-fun-glow' : 'bg-brand-600'
                            }`} />
                        <span>{logoText}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        {(['light', 'dark', 'neon', 'calm', 'fun'] as ThemeType[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${theme === t
                                    ? 'bg-white dark:bg-slate-700 shadow-sm scale-105'
                                    : 'opacity-50 hover:opacity-100'
                                    }`}
                            >
                                {t === 'light' && '☀️'}
                                {t === 'dark' && '🌙'}
                                {t === 'neon' && '⚡'}
                                {t === 'calm' && '🌿'}
                                {t === 'fun' && '🎈'}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-brand-600 dark:bg-slate-800 dark:border dark:border-slate-700 rounded-lg hover:opacity-90 transition-all">
                            New Action
                        </button>

                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t bg-white p-4 space-y-4">
                        <button className="block w-full text-left text-base font-medium text-slate-600">Dashboard</button>
                        <button className="block w-full text-left text-base font-medium text-slate-600">Projects</button>
                        <button className="block w-full text-left text-base font-medium text-slate-600">Settings</button>
                    </div>
                )}
            </header>

            <div className="flex flex-1 overflow-hidden">
                {sidebarContent}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};