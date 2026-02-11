/**
 * Defines the alerting infrastructure for Guru Kai.
 * This service notifies administrators of tool failures without blocking the main thread.
 */

export type AlertSeverity = 'WARNING' | 'CRITICAL' | 'INFO';

export interface AlertPayload {
    toolId?: string;
    toolName?: string;
    error?: Error;
    details?: string;
    timestamp: Date;
}

/**
 * An interface for any notification channel (e.g., console, email, Slack).
 */
export interface NotificationChannel {
    send(severity: AlertSeverity, message: string, payload: AlertPayload): Promise<void>;
}

/**
 * A simple channel that logs alerts to the console. Perfect for development and testing.
 */
export class ConsoleNotificationChannel implements NotificationChannel {
    async send(severity: AlertSeverity, message: string, payload: AlertPayload): Promise<void> {
        const log = severity === 'CRITICAL' ? console.error : (severity === 'WARNING' ? console.warn : console.log);
        const icon = severity === 'CRITICAL' ? '🚨' : (severity === 'WARNING' ? '⚠️' : 'ℹ️');
        log(`\n${icon} [GURU KAI ALERT] ${icon}`);
        log(`- Severity: ${severity}`);
        log(`- Message: ${message}`);
        if (payload.error) {
            log(`- Error Details: ${payload.error.message}`);
        }
        if (payload.details) {
            log(`- Details: ${payload.details}`);
        }
        log(`- Timestamp: ${payload.timestamp.toISOString()}`);
    }
}

export class AlertService {
    private channels: NotificationChannel[];

    constructor(channels: NotificationChannel[]) {
        this.channels = channels;
    }

    /**
     * Dispatches a notification to all registered channels. This is a "fire-and-forget"
     * call to avoid blocking the user-facing process.
     */
    public notify(severity: AlertSeverity, message: string, payload: AlertPayload): void {
        this.channels.forEach(channel => channel.send(severity, message, payload));
    }
}