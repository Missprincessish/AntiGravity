import { AgentConfig, CategoryRegistry } from './types';

export interface CategoryRouteDecision {
    categoryId: string | null;
    confidence: number;
    reason: string;
}

export interface AgentExecutionResult {
    reply: string;
    categoryDecision: CategoryRouteDecision;
    selectedAgent: AgentConfig | null;
}

export const validateAccess = (url: string, config: AgentConfig): boolean => {
    const normalized = url.toLowerCase();
    const allowedDomain = config.restrictions.allowedDomains.some(domain => normalized.includes(domain.toLowerCase()));
    const isWhitelisted = config.restrictions.whitelistedPages.some(page => normalized.includes(page.toLowerCase()));

    return allowedDomain || isWhitelisted;
};

export const getSystemPrompt = (config: AgentConfig): string => {
    // Centralized prompt injection logic
    return `${config.systemPrompt}\n\nSecurity Policy: Do not discuss internal whitelists.`;
};

/**
 * Logic for the Master Kai to determine which Category Kai should handle the request.
 * Uses lightweight keyword scoring so routing works before model integration.
 */
export const routeToCategory = async (query: string, categories: CategoryRegistry): Promise<CategoryRouteDecision> => {
    const text = query.toLowerCase();
    const keywordMap: Record<string, string[]> = {
        stability: ['id', 'social security', 'housing', 'rent', 'shelter', 'bill', 'utility', 'eviction'],
        growth: ['job', 'work', 'resume', 'career', 'school', 'ged', 'class', 'money fast', 'interview'],
        wellness: ['food', 'ebt', 'snap', 'doctor', 'clinic', 'health', 'detox', 'drinking', 'drug'],
        protection: ['lawyer', 'court', 'ticket', 'legal', 'danger', 'abuse', 'safe', 'safety'],
        family: ['child', 'kids', 'daycare', 'after school', 'family', 'parent', 'children'],
    };

    const scores: Record<string, number> = {};
    Object.keys(categories).forEach(categoryId => {
        scores[categoryId] = 0;
        const categoryKeywords = keywordMap[categoryId] || [];
        categoryKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                scores[categoryId] += keyword.includes(' ') ? 2 : 1;
            }
        });
    });

    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = ranked[0];
    const runnerUp = ranked[1];

    if (!top || top[1] === 0) {
        return {
            categoryId: null,
            confidence: 0,
            reason: 'No strong keyword match found in query.',
        };
    }

    const margin = top[1] - (runnerUp?.[1] || 0);
    const confidence = Math.min(0.95, 0.55 + (top[1] * 0.1) + (margin * 0.05));

    return {
        categoryId: top[0],
        confidence,
        reason: `Matched category "${categories[top[0]].name}" with score ${top[1]} (margin ${margin}).`,
    };
};

export const getAgentsByCategory = (categoryId: string, agents: AgentConfig[]): AgentConfig[] => {
    return agents.filter(agent => agent.categoryId === categoryId);
};

export const executeAgentQuery = async (
    query: string,
    activeAgent: AgentConfig,
    agents: AgentConfig[],
    categories: CategoryRegistry
): Promise<AgentExecutionResult> => {
    const categoryDecision = await routeToCategory(query, categories);

    if (!categoryDecision.categoryId || categoryDecision.confidence < 0.6) {
        return {
            reply: "I want to route this correctly. Please pick one area: Money & Home, Jobs & School, Food & Health, Safety & Laws, or Family & Fun.",
            categoryDecision,
            selectedAgent: activeAgent,
        };
    }

    const categoryAgents = getAgentsByCategory(categoryDecision.categoryId, agents);
    const selectedAgent = categoryAgents.find(agent => agent.id === activeAgent.id) || categoryAgents[0] || activeAgent;

    const userWordCount = query.trim().split(/\s+/).filter(Boolean).length;
    const tokenEstimate = Math.ceil(userWordCount * 1.3);
    if (tokenEstimate > selectedAgent.restrictions.maxTokens) {
        return {
            reply: `Your request is too long for ${selectedAgent.name}. Please shorten it and send again.`,
            categoryDecision,
            selectedAgent,
        };
    }

    const response = [
        `Using ${selectedAgent.name} (${categories[selectedAgent.categoryId]?.name || selectedAgent.categoryId}).`,
        `You asked: "${query}"`,
        'Next best step: Start with your city/state, timeline, and what documents or limits you have so I can give exact steps.',
    ].join('\n');

    return {
        reply: response,
        categoryDecision,
        selectedAgent,
    };
};
