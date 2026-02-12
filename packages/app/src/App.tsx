import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { MainLayout } from '@repo/ui/layouts/MainLayout';
import { Sidebar } from '@repo/ui/components/Sidebar';
import { KaiWelcome } from '@repo/ui/components/KaiWelcome';
import { ChatInterface } from '@repo/ui/components/ChatInterface';
import { CATEGORIES, AGENTS } from '@repo/core';
import { AgentConfig } from '@repo/core/types';
import Analytics from './pages/Analytics';

const LANGUAGE_STORAGE_KEY = 'kai_app_language';

function ChatView() {
    const [activeAgent, setActiveAgent] = useState<AgentConfig | null>(() => {
        const savedAgent = localStorage.getItem('activeAgent');
        if (savedAgent) {
            const agent = AGENTS.find(a => a.id === JSON.parse(savedAgent).id);
            return agent || null;
        }
        return null;
    });

    const [userLanguage, setUserLanguage] = useState<string>(() => {
        return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
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

    const categoriesArray = Object.values(CATEGORIES);

    const handleSetAgent = (agent: AgentConfig | null) => {
        setActiveAgent(agent);
    };

    return (
        <MainLayout
            logoText="KaiOS"
            sidebarContent={
                <>
                    <Sidebar
                        categories={categoriesArray}
                        agents={AGENTS}
                        onSelectAgent={(id) => {
                            const agent = AGENTS.find(a => a.id === id);
                            if (agent) handleSetAgent(agent);
                        }}
                        userLanguage={userLanguage}
                        onLanguageChange={setUserLanguage}
                    />
                    <div className="p-4">
                        <Link to="/analytics" className="text-blue-500 hover:underline">Analytics Dashboard</Link>
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
