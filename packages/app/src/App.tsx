import React, { useState } from 'react';
import { MainLayout } from '@repo/ui/layouts/MainLayout';
import { Sidebar } from '@repo/ui/components/Sidebar';
import { KaiWelcome } from '@repo/ui/components/KaiWelcome';
import { ChatInterface } from '@repo/ui/components/ChatInterface';
import { CATEGORIES, AGENTS } from '@repo/core/registry';
import { AgentConfig } from '@repo/core/types';

export default function App() {
    const [activeAgent, setActiveAgent] = useState<AgentConfig | null>(null);

    const categoriesArray = Object.values(CATEGORIES);

    return (
        <MainLayout
            logoText="KaiOS"
            sidebarContent={
                <Sidebar
                    categories={categoriesArray}
                    agents={AGENTS}
                    onSelectAgent={(id) => {
                        const agent = AGENTS.find(a => a.id === id);
                        if (agent) setActiveAgent(agent);
                    }}
                />
            }
        >
            {activeAgent ? (
                <ChatInterface
                    agent={activeAgent}
                    categories={CATEGORIES}
                    agents={AGENTS}
                    onAgentChange={(nextAgent) => setActiveAgent(nextAgent)}
                    onBack={() => setActiveAgent(null)}
                />
            ) : (
                <KaiWelcome
                    categories={categoriesArray}
                    agents={AGENTS}
                    onActivateAgent={(agent) => setActiveAgent(agent)}
                />
            )}
        </MainLayout>
    );
}
