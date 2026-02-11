export interface Restrictions {
    maxTokens: number;
    allowedDomains: string[];
    whitelistedPages: string[];
}

export interface AgentConfig {
    id: string;
    name: string;
    categoryId: string;
    description: string;
    systemPrompt: string;
    restrictions: Restrictions;
}

export interface CategoryConfig {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    color?: string;
}

export type CategoryRegistry = Record<string, CategoryConfig>;
