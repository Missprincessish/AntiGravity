import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig, CategoryRegistry } from '@repo/core/types';
import { executeAgentQuery } from '@repo/core/engine';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    agent: AgentConfig;
    categories: CategoryRegistry;
    agents: AgentConfig[];
    onAgentChange: (agent: AgentConfig) => void;
    onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ agent, categories, agents, onAgentChange, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Hello! I am your ${agent.name} helper. I can help you with ${agent.description.toLowerCase()} How can I help you today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userInput = input.trim();
        const userMessage: Message = { role: 'user', content: userInput };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const result = await executeAgentQuery(userInput, agent, agents, categories);
            if (result.selectedAgent && result.selectedAgent.id !== agent.id) {
                onAgentChange(result.selectedAgent);
            }
            const diagnostics = `(Route confidence: ${Math.round(result.categoryDecision.confidence * 100)}% | ${result.categoryDecision.reason})`;
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `${result.reply}\n\n${diagnostics}` }
            ]);
        } catch {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: "I hit an error while routing your request. Please try again." }
            ]);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto bg-white dark:bg-slate-900 calm:bg-calm-surface fun:bg-fun-surface shadow-sm transition-all duration-500">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 calm:bg-calm-surface fun:bg-fun-surface">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-brand-600 dark:text-neon-blue calm:text-calm-primary fun:text-fun-primary font-medium hover:underline text-sm">
                        ← Back
                    </button>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100 calm:text-calm-text fun:text-fun-text">{agent.name}</h2>
                </div>
                <div className="text-xs text-slate-500 dark:text-neon-blue bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-neon-blue/30">Kai Helper</div>
            </div>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/50 calm:bg-calm-bg/50 fun:bg-fun-bg/50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm transition-all duration-300 ${m.role === 'user'
                            ? 'bg-brand-600 dark:bg-neon-purple calm:bg-calm-primary fun:bg-fun-primary text-white dark:text-slate-900 rounded-tr-none dark:shadow-neon-purple'
                            : 'bg-white dark:bg-slate-800 calm:bg-white fun:bg-white text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm'
                            }`}>
                            <p className="text-sm leading-relaxed">{m.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-left-2">
                        <div className="bg-white dark:bg-slate-800 calm:bg-white fun:bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-neon-blue calm:bg-calm-primary fun:bg-fun-primary animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-neon-blue calm:bg-calm-primary fun:bg-fun-primary animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-neon-blue calm:bg-calm-primary fun:bg-fun-primary animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 calm:bg-calm-surface fun:bg-fun-surface">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white calm:text-calm-text fun:text-fun-text outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-neon-blue transition-all text-sm"
                    />
                    <button className="bg-brand-600 dark:bg-slate-800 calm:bg-calm-primary fun:bg-fun-primary dark:border dark:border-neon-blue dark:text-neon-blue text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 dark:hover:shadow-neon-blue transition-all">
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};
