import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    logoText?: string;
    sidebarContent?: React.ReactNode;
    theme: ThemeType;
}

export type ThemeType = 'light' | 'dark' | 'deepdark' | 'neon' | 'sunset' | 'ocean';

export const MainLayout: React.FC<MainLayoutProps> = ({ children, logoText = "KaiOS", sidebarContent, theme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const themeClasses = {
        light: 'bg-white text-black',
        dark: 'dark bg-slate-900 text-slate-100',
        deepdark: 'dark bg-[#05070d] text-slate-100',
        neon: 'dark bg-[#090613] text-neon-teal',
        sunset: 'bg-sunset-bg text-sunset-text',
        ocean: 'bg-ocean-bg text-ocean-text',
    };

    return (
        <div className={`${theme} ${theme === 'dark' || theme === 'deepdark' || theme === 'neon' ? 'dark' : ''} ${themeClasses[theme]} liquid-app min-h-screen flex flex-col overflow-hidden transition-colors duration-500`}>
            <div className="liquid-metal-layer" />
            <header className="sticky top-0 z-50 border-b border-white/20 glass-panel transition-all">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className={`flex items-center gap-2 font-bold text-xl cursor-pointer transition-all ${theme === 'neon' ? 'text-neon-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.7)]' :
                        theme === 'sunset' ? 'text-sunset-primary' :
                            theme === 'ocean' ? 'text-ocean-primary' :
                                theme === 'light' ? 'text-black' : 'text-white'
                        }`}>
                        <div className={`w-8 h-8 rounded-lg transition-all ${theme === 'neon' ? 'bg-neon-green shadow-neon-purple' :
                            theme === 'sunset' ? 'bg-sunset-primary shadow-sunset-glow' :
                                theme === 'ocean' ? 'bg-ocean-primary shadow-ocean-soft' :
                                    theme === 'light' ? 'bg-brand-600 shadow-sm' : 'bg-slate-600 shadow-sm'
                            }`} />
                        <span>{logoText}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className={`hidden md:block px-4 py-2 text-sm font-medium rounded-lg ${theme === 'light' ? 'text-black bg-white shadow-sm border border-slate-200' : 'text-white glass-button'}`}>
                            New Action
                        </button>

                        <button
                            className="md:hidden p-2 text-slate-200 glass-subtle rounded-lg"
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
                    <div className="md:hidden border-t border-white/20 glass-subtle p-4 space-y-4">
                        <button className="block w-full text-left text-base font-medium text-slate-100">Dashboard</button>
                        <button className="block w-full text-left text-base font-medium text-slate-100">Projects</button>
                        <button className="block w-full text-left text-base font-medium text-slate-100">Settings</button>
                    </div>
                )}
            </header>

            <div className="flex flex-1 overflow-hidden depth-focus">
                {sidebarContent}
                <main className="flex-1 overflow-y-auto relative z-[2]">
                    {children}
                </main>
            </div>
        </div>
    );
};