import React, { useState } from 'react';
import { CategoryConfig, AgentConfig } from '@repo/core/types';
import { SUPPORTED_LANGUAGES } from '@repo/core/translationService';

interface SidebarProps {
    categories: CategoryConfig[];
    agents: AgentConfig[];
    onSelectAgent: (agentId: string) => void;
    /** App language; when not English, the language bot (translation) is active for that language only. */
    userLanguage?: string;
    onLanguageChange?: (code: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, agents, onSelectAgent, userLanguage = 'en', onLanguageChange }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 calm:bg-calm-surface fun:bg-fun-surface h-full flex flex-col`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 calm:border-calm-primary/10 fun:border-fun-primary/10 flex items-center justify-between">
                {!isCollapsed && <span className="font-bold text-slate-800 dark:text-slate-200 calm:text-calm-text fun:text-fun-text">Agent Fleet</span>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                >
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {categories.map((category) => (
                    <div key={category.id} className="space-y-1">
                        <button
                            onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${expandedCategory === category.id ? 'bg-brand-50 dark:bg-slate-800 calm:bg-white fun:bg-white text-brand-700 dark:text-neon-blue calm:text-calm-primary fun:text-fun-primary shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 calm:hover:bg-white/30 fun:hover:bg-white/30 text-slate-600 dark:text-slate-400 calm:text-calm-text/60 fun:text-fun-text/60'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full bg-${category.color || 'brand'}-500 dark:shadow-[0_0_8px_currentColor]`} />
                            {!isCollapsed && <span className="flex-1 text-left font-medium">{category.name}</span>}
                            {!isCollapsed && <span>{expandedCategory === category.id ? '▾' : '▸'}</span>}
                        </button>

                        {expandedCategory === category.id && !isCollapsed && (
                            <div className="ml-4 pl-4 border-l border-slate-100 space-y-1 animate-in slide-in-from-top-2">
                                {agents
                                    .filter((a) => a.categoryId === category.id)
                                    .map((agent) => (
                                        <button
                                            key={agent.id}
                                            onClick={() => onSelectAgent(agent.id)}
                                            className="w-full text-left p-2 text-sm text-slate-500 hover:text-brand-600 hover:bg-brand-50/50 rounded-md transition-all"
                                        >
                                            {agent.name}
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {!isCollapsed && onLanguageChange && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">App language</label>
                    <select
                        value={userLanguage}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 dark:focus:ring-neon-blue outline-none"
                    >
                        {SUPPORTED_LANGUAGES.map(({ code, name }) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                    {userLanguage !== 'en' && (
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Translation on for this language</p>
                    )}
                </div>
            )}
        </aside>
    );
};