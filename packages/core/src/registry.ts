import { CategoryRegistry, AgentConfig } from './types';
import { BaseTool } from './base';
import { AlertService, ConsoleNotificationChannel } from './alertService';

// FIXME: In a real app, you would not hardcode this.
// You would use a secret management system.
const API_KEY = (globalThis as any)?.process?.env?.GEMINI_API_KEY;
if (!API_KEY) {
    console.warn('[Core] GEMINI_API_KEY is not set. AI-backed tools will return fallback responses until a key is configured.');
}

export async function getGenAI() {
    if (!API_KEY) return null;
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    return new GoogleGenerativeAI(API_KEY);
}

export const CATEGORIES: CategoryRegistry = {
    stability: {
        id: 'stability',
        name: 'Money & Home',
        description: 'Help with money, ID cards, and finding a place to live.',
        systemPrompt: 'You are a helpful coach. Help people find a home and fix their ID cards.',
        model: 'gemini-flash',
        color: 'indigo',
    },
    growth: {
        id: 'growth',
        name: 'Jobs & School',
        description: 'Find a job, learn new things, and make more money.',
        systemPrompt: 'You are a friendly teacher. Help people find work and learn new skills.',
        model: 'gemini-flash',
        color: 'pink',
    },
    wellness: {
        id: 'wellness',
        name: 'Food & Health',
        description: 'Get help with food, doctors, and feeling better.',
        systemPrompt: 'You are a kind helper. Help people find food and stay healthy.',
        model: 'gemini-pro',
        color: 'emerald',
    },
    protection: {
        id: 'protection',
        name: 'Safety & Laws',
        description: 'Help with court, lawyers, and staying safe.',
        systemPrompt: 'You are a safety guide. Help people with legal rules and staying safe.',
        model: 'gemini-pro',
        color: 'amber',
    },
    family: {
        id: 'family',
        name: 'Family & Fun',
        description: 'Help with kids, childcare, and free things to do.',
        systemPrompt: 'You are a family friend. Help parents find things for their kids.',
        model: 'gemini-pro',
        color: 'cyan',
    },
};

export const AGENTS: AgentConfig[] = [
    // --- MONEY & HOME (Stability) ---
    {
        id: 'id-checklist',
        name: 'Get a New ID',
        categoryId: 'stability',
        description: 'Follow these steps to get your ID card or birth paper.',
        systemPrompt: 'You help people get their ID cards. Use simple words to explain the steps.',
        restrictions: { maxTokens: 1000, allowedDomains: ['ssa.gov', 'vitalchek.com'], whitelistedPages: [] }
    },
    {
        id: 'social-security',
        name: 'Get Your Social Security Card',
        categoryId: 'stability',
        description: 'How to get a new Social Security card if you lost yours.',
        systemPrompt: 'Help people get a new Social Security card. Tell them what papers they need.',
        restrictions: { maxTokens: 1000, allowedDomains: ['ssa.gov'], whitelistedPages: [] }
    },
    {
        id: 'find-housing',
        name: 'Find a Place to Live',
        categoryId: 'stability',
        description: 'Look for a home or a room that you can afford.',
        systemPrompt: 'Help people find a place to live. Talk about low-cost housing and shelters.',
        restrictions: { maxTokens: 1500, allowedDomains: ['hud.gov', 'zillow.com'], whitelistedPages: [] }
    },
    {
        id: 'utility-help',
        name: 'Help with Bills',
        categoryId: 'stability',
        description: 'Get help paying for your light, water, and heat.',
        systemPrompt: 'Help people find programs that pay for light and water bills.',
        restrictions: { maxTokens: 1000, allowedDomains: ['liheap.org'], whitelistedPages: [] }
    },

    // --- JOBS & SCHOOL (Growth) ---
    {
        id: 'job-search',
        name: 'Find a Job',
        categoryId: 'growth',
        description: 'Look for work in your town that is hiring right now.',
        systemPrompt: 'Help people find jobs. Show them how to fill out a job paper.',
        restrictions: { maxTokens: 1500, allowedDomains: ['indeed.com', 'linkedin.com'], whitelistedPages: [] }
    },
    {
        id: 'finish-school',
        name: 'Finish School',
        categoryId: 'growth',
        description: 'How to get your GED or go back to school.',
        systemPrompt: 'Help people go back to school. Explain how to get a GED.',
        restrictions: { maxTokens: 1000, allowedDomains: ['ged.com'], whitelistedPages: [] }
    },
    {
        id: 'make-money-fast',
        name: 'Make Money Now',
        categoryId: 'growth',
        description: 'Find quick ways to make money today.',
        systemPrompt: 'Help people find quick jobs like day labor or gig work.',
        restrictions: { maxTokens: 1000, allowedDomains: ['taskrabbit.com'], whitelistedPages: [] }
    },

    // --- FOOD & HEALTH (Wellness) ---
    {
        id: 'food-stamps',
        name: 'Free Money for Food',
        categoryId: 'wellness',
        description: 'How to get EBT or food stamps to buy groceries.',
        systemPrompt: 'Help people sign up for food stamps. Use very simple steps.',
        restrictions: { maxTokens: 1000, allowedDomains: ['fns.usda.gov'], whitelistedPages: [] }
    },
    {
        id: 'see-a-doctor',
        name: 'See a Doctor',
        categoryId: 'wellness',
        description: 'Find a doctor or a clinic that is free or low cost.',
        systemPrompt: 'Help people find a doctor. Look for free clinics.',
        restrictions: { maxTokens: 1000, allowedDomains: ['healthcare.gov'], whitelistedPages: [] }
    },
    {
        id: 'get-clean',
        name: 'Help with Drugs or Drinking',
        categoryId: 'wellness',
        description: 'Find a group or a place to help you stop using drugs or alcohol.',
        systemPrompt: 'Be very kind. Help people find meetings or detox centers.',
        restrictions: { maxTokens: 1000, allowedDomains: ['samhsa.gov'], whitelistedPages: [] }
    },

    // --- SAFETY & LAWS (Protection) ---
    {
        id: 'legal-aid',
        name: 'Talk to a Lawyer',
        categoryId: 'protection',
        description: 'Find a lawyer who can help you for free.',
        systemPrompt: 'Help people find free legal help for court or tickets.',
        restrictions: { maxTokens: 1500, allowedDomains: ['lsc.gov'], whitelistedPages: [] }
    },
    {
        id: 'stay-safe',
        name: 'Stay Safe',
        categoryId: 'protection',
        description: 'What to do if you are in danger or need a safe place.',
        systemPrompt: 'Help people stay safe. Give them numbers for shelters and help lines.',
        restrictions: { maxTokens: 1000, allowedDomains: ['thehotline.org'], whitelistedPages: [] }
    },

    // --- FAMILY & FUN (Family) ---
    {
        id: 'child-care',
        name: 'Help with the Kids',
        categoryId: 'family',
        description: 'Find a safe place for your kids while you work.',
        systemPrompt: 'Help parents find daycare or after-school help.',
        restrictions: { maxTokens: 1000, allowedDomains: ['childcare.gov'], whitelistedPages: [] }
    }
];

class AgentTool extends BaseTool {
    private agentConfig: AgentConfig;

    constructor(agentConfig: AgentConfig, alertService: AlertService) {
        super(agentConfig.id, agentConfig.name, agentConfig.description, alertService);
        this.agentConfig = agentConfig;
    }

    protected async executeInternal(input: { prompt: string }): Promise<any> {
        console.log(`[${this.id}] Executing with input:`, input);

        const genAI = await getGenAI();
        if (!genAI) {
            return 'AI is not configured yet (missing GEMINI_API_KEY). Please set the key and try again.';
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const fullPrompt = `
${this.agentConfig.systemPrompt}

User prompt: "${input.prompt}"
`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    }
}

class ToolRegistry {
    private tools: Map<string, BaseTool> = new Map();

    public register(tool: BaseTool): void {
        if (this.tools.has(tool.id)) {
            console.warn(`Tool with ID '${tool.id}' is already registered. Overwriting.`);
        }
        this.tools.set(tool.id, tool);
    }

    public getTool(id: string): BaseTool | undefined {
        return this.tools.get(id);
    }

    public listTools(): BaseTool[] {
        return Array.from(this.tools.values());
    }
}

export const toolRegistry = new ToolRegistry();

const alertService = new AlertService([new ConsoleNotificationChannel()]);

AGENTS.forEach(agentConfig => {
    const tool = new AgentTool(agentConfig, alertService);
    toolRegistry.register(tool);
});