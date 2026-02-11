import { AgentConfig } from './types';

/**
 * Validates if a given URL is allowed based on the agent's restrictions.
 *
 * @param url The URL to validate.
 * @param config The agent's configuration.
 * @returns True if the URL is allowed, false otherwise.
 */
export const validateAccess = (url: string, config: AgentConfig): boolean => {
    const normalized = url.toLowerCase();
    const allowedDomain = config.restrictions.allowedDomains.some(domain => normalized.includes(domain.toLowerCase()));
    const isWhitelisted = config.restrictions.whitelistedPages.some(page => normalized.includes(page.toLowerCase()));

    return allowedDomain || isWhitelisted;
};

/**
 * Validates if the number of tokens in a query is within the agent's limits.
 *
 * @param query The user's query.
 * @param config The agent's configuration.
 * @returns True if the token count is within the limit, false otherwise.
 */
export const validateTokens = (query: string, config: AgentConfig): boolean => {
    const userWordCount = query.trim().split(/\s+/).filter(Boolean).length;
    const tokenEstimate = Math.ceil(userWordCount * 1.3);
    return tokenEstimate <= config.restrictions.maxTokens;
};
