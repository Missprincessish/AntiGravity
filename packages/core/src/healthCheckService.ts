import { toolRegistry } from './registry';
import { ToolStatus } from './base';
import { AlertService } from './alertService';

/**
 * A service that periodically checks the health of tools that were
 * automatically killed and revives them if they become operational again.
 */
export class HealthCheckService {
    private intervalId: NodeJS.Timeout | null = null;
    private readonly checkIntervalMs = 5 * 60 * 1000; // 5 minutes
    private alertService: AlertService;

    constructor(alertService: AlertService) {
        this.alertService = alertService;
    }

    /**
     * Starts the periodic health check process.
     */
    public start(): void {
        if (this.intervalId) {
            console.log('[Health Check] Service is already running.');
            return;
        }
        console.log(`[Health Check] Service started. Will run every ${this.checkIntervalMs / 1000 / 60} minutes.`);
        this.intervalId = setInterval(() => this.run(), this.checkIntervalMs);
    }

    /**
     * Stops the periodic health check process, for graceful shutdown.
     */
    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('[Health Check] Service stopped.');
        }
    }

    /**
     * Scans all registered tools and attempts to revive any that are in an error state.
     */
    public async run(): Promise<void> {
        console.log('\n[Health Check] Running health checks on killed tools...');
        const tools = toolRegistry.listTools();

        for (const tool of tools) {
            if (tool.getStatus() === ToolStatus.KILLED_ERROR) {
                console.log(`[Health Check] Testing '${tool.name}'...`);
                const isHealthy = await tool.runHealthCheck();

                if (isHealthy) {
                    tool.revive();
                    const message = `Tool '${tool.name}' has recovered and is back online.`;
                    console.log(`[Health Check] SUCCESS: ${message}`);
                    this.alertService.notify('INFO', message, {
                        toolId: tool.id,
                        toolName: tool.name,
                        timestamp: new Date(),
                    });
                } else {
                    console.log(`[Health Check] FAILED: '${tool.name}' is still unhealthy.`);
                }
            }
        }
    }
}