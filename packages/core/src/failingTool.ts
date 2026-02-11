import { BaseTool } from './base';
import { AlertService } from './alertService';

/**
 * A tool designed to fail consistently to test the auto-kill mechanism.
 * It simulates a faulty integration or a persistent bug.
 */
export class FailingTool extends BaseTool {
    private isBroken = true;

    constructor(alertService: AlertService) {
        super(
            'failing-tool-01',
            'Failing Tool',
            'A diagnostic tool that always throws an error to test system resilience.',
            alertService
        );
    }

    /**
     * This tool's core logic is to throw an error every time it's called.
     */
    protected async executeInternal(input: any): Promise<any> {
        if (this.isBroken) {
            throw new Error('This tool is designed to fail.');
        }
        return 'Tool has been fixed and is now operational.';
    }

    /**
     * A method to simulate fixing the tool's underlying issue.
     */
    public fix(): void {
        this.isBroken = false;
    }
}