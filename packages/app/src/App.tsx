import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { MainLayout } from '@repo/ui/layouts/MainLayout';
import { Sidebar } from '@repo/ui/components/Sidebar';
import { KaiWelcome } from '@repo/ui/components/KaiWelcome';
import { ChatInterface } from '@repo/ui/components/ChatInterface';
import { CATEGORIES, AGENTS } from '@repo/core/registry';
import { AgentConfig } from '@repo/core/types';
import Analytics from './pages/Analytics';

const LANGUAGE_STORAGE_KEY = 'kai_app_language';
const THEME_STORAGE_KEY = 'kai_app_theme';
type ThemeType = 'light' | 'dark' | 'deepdark' | 'neon' | 'sunset' | 'ocean';

function ChatView() {
    const [activeAgent, setActiveAgent] = useState<AgentConfig | null>(() => {
        const savedAgent = localStorage.getItem('activeAgent');
        if (savedAgent) {
            try {
                const parsed = JSON.parse(savedAgent);
                const agent = AGENTS.find(a => a.id === parsed?.id);
                return agent || null;
            } catch {
                localStorage.removeItem('activeAgent');
                return null;
            }
        }
        return null;
    });

    const [userLanguage, setUserLanguage] = useState<string>(() => {
        return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
    });

    const [theme, setTheme] = useState<ThemeType>(() => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null;
        return saved || 'neon';
    });

    useEffect(() => {
        if (activeAgent) {
            localStorage.setItem('activeAgent', JSON.stringify(activeAgent));
        } else {
            localStorage.removeItem('activeAgent');
        }
    }, [activeAgent]);

    useEffect(() => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, userLanguage);
    }, [userLanguage]);

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const categoriesArray = Object.values(CATEGORIES);

    const handleSetAgent = (agent: AgentConfig | null) => {
        setActiveAgent(agent);
    };

    return (
        <MainLayout
            logoText="KaiOS"
            theme={theme}
            sidebarContent={
                <>
                    <Sidebar
                        categories={categoriesArray}
                        agents={AGENTS}
                        onSelectAgent={(id) => {
                            const agent = AGENTS.find(a => a.id === id);
                            if (agent) handleSetAgent(agent);
                        }}
                        theme={theme}
                        onThemeChange={setTheme}
                        userLanguage={userLanguage}
                        onLanguageChange={setUserLanguage}
                    />
                    <div className="p-4">
                        <Link to="/analytics" className="inline-block glass-button rounded-xl px-4 py-2 text-slate-100 hover:underline">Analytics Dashboard</Link>
                    </div>
                </>
            }
        >
            {activeAgent ? (
                <ChatInterface
                    agent={activeAgent}
                    categories={CATEGORIES}
                    agents={AGENTS}
                    userLanguage={userLanguage}
                    onAgentChange={(nextAgent) => handleSetAgent(nextAgent)}
                    onBack={() => handleSetAgent(null)}
                />
            ) : (
                <KaiWelcome
                    categories={categoriesArray}
                    agents={AGENTS}
                    onActivateAgent={(agent) => handleSetAgent(agent)}
                />
            )}
        </MainLayout>
    );
}


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChatView />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </BrowserRouter>
    );
}
