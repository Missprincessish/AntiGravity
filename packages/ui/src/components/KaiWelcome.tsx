import React, { useState } from 'react';
import { CategoryConfig, AgentConfig } from '@repo/core/types';

interface KaiWelcomeProps {
    categories: CategoryConfig[];
    agents: AgentConfig[];
    onActivateAgent: (agent: AgentConfig) => void;
}

export const KaiWelcome: React.FC<KaiWelcomeProps> = ({ categories, agents, onActivateAgent }) => {
    const [step, setStep] = useState<'categories' | 'agents'>('categories');
    const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);

    const handleCategoryClick = (category: CategoryConfig) => {
        setSelectedCategory(category);
        setStep('agents');
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 relative z-[2]">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 glass-button rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg dark:shadow-neon-blue">
                    K
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Hello, I'm Kai.</h2>
                    <p className="text-slate-200/80">
                        {step === 'categories'
                            ? "What can I help you with today? Choose a category to get started."
                            : `Great! Which ${selectedCategory?.name} tool do you need?`}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {step === 'categories' ? (
                    categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat)}
                            className="group p-6 glass-panel rounded-2xl text-left border border-white/25 hover:border-white/45 hover:shadow-xl dark:hover:shadow-neon-pink transition-all"
                        >
                            <div className={`w-10 h-10 mb-4 rounded-lg glass-pill flex items-center justify-center text-white group-hover:scale-105 transition-all`}>
                                {cat.name[0]}
                            </div>
                            <h3 className="font-bold text-white">{cat.name}</h3>
                            <p className="text-sm text-slate-200/75 mt-1">{cat.description}</p>
                        </button>
                    ))
                ) : (
                    <>
                        <button
                            onClick={() => setStep('categories')}
                            className="col-span-full text-sm text-slate-100 font-medium hover:underline mb-2"
                        >
                            ← Back to all categories
                        </button>
                        {agents.filter(a => a.categoryId === selectedCategory?.id).map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => onActivateAgent(agent)}
                                className="p-4 glass-subtle border border-white/25 rounded-xl text-left hover:border-white/40 transition-colors"
                            >
                                <h4 className="font-semibold text-slate-100">{agent.name}</h4>
                                <p className="text-xs text-slate-300/80 mt-1 line-clamp-2">{agent.description || 'Activate this tool'}</p>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};