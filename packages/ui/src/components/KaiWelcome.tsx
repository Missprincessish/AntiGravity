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
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-600 dark:bg-neon-blue calm:bg-calm-primary fun:bg-fun-primary rounded-2xl flex items-center justify-center text-white dark:text-slate-900 text-2xl shadow-lg dark:shadow-neon-blue calm:shadow-calm-soft fun:shadow-fun-glow">
                    K
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white calm:text-calm-text fun:text-fun-text">Hello, I'm Kai.</h2>
                    <p className="text-slate-500 dark:text-slate-400 calm:text-calm-text/70 fun:text-fun-text/70">
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
                            className="group p-6 bg-white dark:bg-slate-900 calm:bg-white/50 fun:bg-white/50 border border-slate-200 dark:border-slate-800 calm:border-calm-primary/20 fun:border-fun-primary/20 rounded-2xl text-left hover:border-brand-500 dark:hover:border-neon-pink calm:hover:border-calm-primary fun:hover:border-fun-primary hover:shadow-xl dark:hover:shadow-neon-pink calm:hover:shadow-calm-soft fun:hover:shadow-fun-glow transition-all"
                        >
                            <div className={`w-10 h-10 mb-4 rounded-lg bg-brand-50 dark:bg-slate-800 calm:bg-calm-surface fun:bg-fun-surface flex items-center justify-center text-brand-600 dark:text-neon-pink calm:text-calm-primary fun:text-fun-primary group-hover:bg-brand-600 dark:group-hover:bg-neon-pink calm:group-hover:bg-calm-primary fun:group-hover:bg-fun-primary group-hover:text-white dark:group-hover:text-slate-900 transition-colors`}>
                                {cat.name[0]}
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 calm:text-calm-text fun:text-fun-text">{cat.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 calm:text-calm-text/60 fun:text-fun-text/60 mt-1">{cat.description}</p>
                        </button>
                    ))
                ) : (
                    <>
                        <button
                            onClick={() => setStep('categories')}
                            className="col-span-full text-sm text-brand-600 font-medium hover:underline mb-2"
                        >
                            ← Back to all categories
                        </button>
                        {agents.filter(a => a.categoryId === selectedCategory?.id).map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => onActivateAgent(agent)}
                                className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:bg-brand-50 transition-colors"
                            >
                                <h4 className="font-semibold text-slate-800">{agent.name}</h4>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{agent.description || 'Activate this tool'}</p>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};