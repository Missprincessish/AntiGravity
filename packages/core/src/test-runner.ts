import { toolRegistry } from './registry';
import { EchoTool } from './echoTool';
import { FailingTool } from './failingTool';
import { AlertService, ConsoleNotificationChannel } from './alertService';
import { KaiCoordinator } from './kaiCoordinator';
import { HealthCheckService } from './healthCheckService';

/**
 * This script demonstrates how to register and use a tool,
 * validating the core architecture.
 */
async function main() {
    // 0. Setup shared services. Create one instance to be used by the entire application.
    const alertService = new AlertService([new ConsoleNotificationChannel()]);
    const healthCheckService = new HealthCheckService(alertService);

    try {
        console.log('--- Guru Kai Coordinator Validation ---');

        // In a real, long-running application, you would start the service like this:
        // healthCheckService.start();

        // 1. Create and register tools.
        const echoTool = new EchoTool(alertService);
        const failingTool = new FailingTool(alertService);
        toolRegistry.register(echoTool);
        toolRegistry.register(failingTool);

        // 2. Create the Coordinator
        const coordinator = new KaiCoordinator();

        // 3. Process prompts through the Coordinator
        console.log('\n--- Testing Coordinator Routing ---');

        // Test case 1: Route to EchoTool
        const echoResult = await coordinator.processPrompt('Can you echo this for me?');
        console.log('Coordinator Result:', echoResult);

        // Test case 2: Route to FailingTool
        const failResult = await coordinator.processPrompt('I need this to fail.');
        console.log('Coordinator Result:', failResult);

        // Test case 3: No tool found
        const unknownResult = await coordinator.processPrompt('What is the weather today?');
        console.log('Coordinator Result:', unknownResult);

        console.log('\n--- Testing Auto-Kill, Fix, and Revival ---');

        // Step A: Trigger the auto-kill
        console.log('\nTriggering 3 failures to auto-kill the tool...');
        for (let i = 0; i < 3; i++) {
            await coordinator.processPrompt('fail');
        }
        const fourthResult = await coordinator.processPrompt('fail');
        console.log('Result on 4th attempt:', fourthResult); // Should be blocked

        // Step B: Run health check while tool is still broken
        await healthCheckService.run();

        // Step C: "Fix" the tool and run health check again
        console.log('\nSimulating a fix for the tool...');
        (failingTool as FailingTool).fix();
        await healthCheckService.run();

        // Step D: Confirm the tool is now active
        const finalResult = await coordinator.processPrompt('fail');
        console.log('\nResult after revival:', finalResult); // Should now succeed

        console.log('\n--- Validation Complete ---');
    } finally {
        // This block ensures that background services are stopped, allowing the script to exit.
        console.log('\n[Main] Cleaning up services...');
        healthCheckService.stop();
    }
}

main();