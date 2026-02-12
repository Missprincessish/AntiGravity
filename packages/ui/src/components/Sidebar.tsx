import React, { useState } from 'react';
import { CategoryConfig, AgentConfig } from '@repo/core/types';
import { SUPPORTED_LANGUAGES } from '@repo/core/translationService';

type ThemeType = 'light' | 'dark' | 'deepdark' | 'neon' | 'sunset' | 'ocean';

interface SidebarProps {
    categories: CategoryConfig[];
    agents: AgentConfig[];
    onSelectAgent: (agentId: string) => void;
    userLanguage?: string;
    onLanguageChange?: (code: string) => void;
    theme?: ThemeType;
    onThemeChange?: (theme: ThemeType) => void;
}

const THEME_OPTIONS: Array<{ key: ThemeType; label: string }> = [
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
    { key: 'deepdark', label: 'Deep' },
    { key: 'neon', label: 'Neon' },
    { key: 'sunset', label: 'Sunset' },
    { key: 'ocean', label: 'Ocean' },
];

export const Sidebar: React.FC<SidebarProps> = ({
    categories,
    agents,
    onSelectAgent,
    userLanguage = 'en',
    onLanguageChange,
    theme = 'neon',
    onThemeChange,
}) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<'menu' | 'settings'>('menu');

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 border-r border-white/20 glass-panel h-full flex flex-col`}>
            <div className="p-4 border-b border-white/15 flex items-center justify-between">
                {!isCollapsed && <span className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} font-bold`}>Agent Fleet</span>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`p-2 glass-subtle rounded-lg ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}
                >
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {activeTab === 'menu' && (
                    <>
                        {categories.map((category) => (
                            <div key={category.id} className="space-y-1">
                                <button
                                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${expandedCategory === category.id ? 'glass-subtle shadow-sm' : 'hover:glass-subtle'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full bg-${category.color || 'brand'}-500 dark:shadow-[0_0_8px_currentColor]`} />
                                    {!isCollapsed && <span className={`flex-1 text-left font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{category.name}</span>}
                                    {!isCollapsed && <span>{expandedCategory === category.id ? '▾' : '▸'}</span>}
                                </button>

                                {expandedCategory === category.id && !isCollapsed && (
                                    <div className="ml-4 pl-4 border-l border-white/20 space-y-1 animate-in slide-in-from-top-2">
                                        {agents
                                            .filter((a) => a.categoryId === category.id)
                                            .map((agent) => (
                                                <button
                                                    key={agent.id}
                                                    onClick={() => onSelectAgent(agent.id)}
                                                    className={`w-full text-left p-2 text-sm glass-subtle rounded-md transition-all ${theme === 'light' ? 'text-slate-700 hover:text-slate-900' : 'text-slate-200/80 hover:text-white'}`}
                                                >
                                                    {agent.name}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'settings' && !isCollapsed && (
                    <div className="p-3 glass-subtle rounded-xl border border-white/20 space-y-3">
                        <div>
                            <p className="block text-xs font-medium text-slate-200/85 mb-1.5">Theme</p>
                            <div className="grid grid-cols-3 gap-1 glass-subtle rounded-lg p-1 border border-white/15">
                                {THEME_OPTIONS.map((t) => (
                                    <button
                                        key={t.key}
                                        onClick={() => onThemeChange?.(t.key)}
                                        className={`rounded-md py-1 text-[10px] transition-all ${theme === t.key ? 'glass-pill text-white' : 'text-slate-300/80 hover:text-white'}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="block text-xs font-medium text-slate-200/85 mb-1.5">App language</label>
                        {onLanguageChange ? (
                            <>
                                <select
                                    value={userLanguage}
                                    onChange={(e) => onLanguageChange(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg glass-input text-slate-100 focus:ring-2 focus:ring-brand-500 dark:focus:ring-neon-blue outline-none"
                                >
                                    {SUPPORTED_LANGUAGES.map(({ code, name }) => (
                                        <option key={code} value={code}>{name}</option>
                                    ))}
                                </select>

                                <p className="mt-2 text-xs text-slate-300/75">Selected 15 languages:</p>
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                    {SUPPORTED_LANGUAGES.slice(0, 15).map(({ code, name }) => (
                                        <span key={code} className="text-[10px] px-2 py-1 rounded-md glass-pill text-slate-100/90">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-slate-300/70">Settings coming soon.</p>
                        )}

                        <div className="pt-2 border-t border-white/15">
                            <p className="text-xs font-medium text-slate-200/85 mb-1.5">Forms</p>
                            <div className="glass-input rounded-lg px-3 py-2 text-xs text-slate-200/80">No forms yet.</div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-200/85 mb-1.5">My Copies</p>
                            <div className="glass-input rounded-lg px-3 py-2 text-xs text-slate-200/80">No saved copies yet.</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-white/20">
                <div className="grid grid-cols-2 gap-2 glass-subtle rounded-xl p-1 border border-white/15">
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${activeTab === 'menu' ? 'glass-pill text-white' : 'text-slate-300/80 hover:text-white'}`}
                    >
                        Menu
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${activeTab === 'settings' ? 'glass-pill text-white' : 'text-slate-300/80 hover:text-white'}`}
                    >
                        Settings
                    </button>
                </div>
            </div>
        </aside>
    );
};
