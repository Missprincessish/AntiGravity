import { BaseTool } from './base';
import { AlertService } from './alertService';

/**
 * A simple test tool that echoes back its input.
 * Used for validating the core tool architecture and registry.
 */
export class EchoTool extends BaseTool {
    constructor(alertService: AlertService) {
        super(
            'echo-tool-01',
            'Echo Tool',
            'A simple diagnostic tool that returns whatever input it receives.',
            alertService
        );
    }

    /**
     * The core logic for the EchoTool is to simply return the input.
     * We wrap it in a Promise to conform to the async nature of executeInternal.
     */
    protected async executeInternal(input: any): Promise<any> {
        console.log(`[${this.id}] Echoing input:`, input);
        return input;
    }
}