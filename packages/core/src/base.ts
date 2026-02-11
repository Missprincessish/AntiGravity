import { AlertService, AlertSeverity } from './alertService';

export enum ToolStatus {
    ACTIVE = 'ACTIVE',
    KILLED_MANUAL = 'KILLED_MANUAL',
    KILLED_ERROR = 'KILLED_ERROR',
}

export interface ToolResult {
    success: boolean;
    data?: any;
    error?: string;
}

export abstract class BaseTool {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;

    protected status: ToolStatus = ToolStatus.ACTIVE;
    private failureCount: number = 0;
    private readonly MAX_FAILURES = 3;
    private alertService: AlertService;

    constructor(id: string, name: string, description: string, alertService: AlertService) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.alertService = alertService;
    }

    protected abstract executeInternal(input: any): Promise<any>;

    public async execute(input: any): Promise<ToolResult> {
        if (this.status !== ToolStatus.ACTIVE) {
            return { success: false, error: `Tool '${this.name}' is currently offline.` };
        }

        try {
            const resultData = await this.executeInternal(input);
            this.failureCount = 0;
            return { success: true, data: resultData };
        } catch (err: any) {
            this.failureCount++;
            let severity: AlertSeverity = 'WARNING';

            if (this.failureCount >= this.MAX_FAILURES) {
                this.status = ToolStatus.KILLED_ERROR;
                severity = 'CRITICAL';
                const message = `Tool '${this.name}' was auto-killed due to repeated failures.`;
                this.alertService.notify(severity, message, {
                    toolId: this.id,
                    toolName: this.name,
                    error: err,
                    timestamp: new Date(),
                });
            }

            return { success: false, error: `An internal error occurred in the '${this.name}' tool.` };
        }
    }

    public getStatus = (): ToolStatus => this.status;
    public kill = (): void => { this.status = ToolStatus.KILLED_MANUAL; };
    public revive = (): void => { this.status = ToolStatus.ACTIVE; this.failureCount = 0; };

    /**
     * Executes the internal logic of the tool within a try/catch block to check
     * if it's operational, without affecting its status or failure count.
     * @returns {Promise<boolean>} True if the tool executes successfully, false otherwise.
     */
    public async runHealthCheck(): Promise<boolean> {
        try {
            await this.executeInternal({ healthCheck: true });
            return true;
        } catch (error) {
            return false;
        }
    }
}