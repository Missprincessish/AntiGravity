import { toolRegistry, genAI } from './registry';
import { ToolResult } from './base';

/**
 * The central orchestrator for Guru Kai.
 * It understands user intent and delegates tasks to the appropriate tool.
 */
export class KaiCoordinator {
    /**
     * Analyzes a user prompt and routes it to the correct tool using the Gemini API.
     *
     * @param prompt The raw input from the user.
     * @returns The result from the executed tool, or an error message.
     */
    public async processPrompt(prompt: string): Promise<ToolResult> {
        console.log(`\n[Kai Coordinator] Received prompt: "${prompt}"`);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const toolDescriptions = toolRegistry.listTools().map(tool => {
            return `${tool.id}: ${tool.description}`;
        }).join('\n');

        const routingPrompt = `
You are the master router for a fleet of AI agents.
Your job is to determine which agent is best suited to handle the user's prompt.

Here are the available agents:
${toolDescriptions}

User prompt: "${prompt}"

Based on the user's prompt, which agent should be used?
Return only the ID of the agent (e.g., "id-checklist").
`;

        try {
            const result = await model.generateContent(routingPrompt);
            const response = await result.response;
            const toolId = response.text().trim();

            console.log(`[Kai Coordinator] Gemini selected tool: ${toolId}`);

            const tool = toolRegistry.getTool(toolId);

            if (!tool) {
                console.error(`[Kai Coordinator] Gemini recommended an invalid tool: '${toolId}'`);
                return { success: false, error: "I'm not sure how to help with that. Can you try rephrasing?" };
            }

            console.log(`[Kai Coordinator] Routing to tool: ${tool.name}`);
            return tool.execute({ prompt });

        } catch (error) {
            console.error("[Kai Coordinator] Error calling Gemini API:", error);
            return { success: false, error: "There was a problem connecting to the AI engine. Please try again later." };
        }
    }
}