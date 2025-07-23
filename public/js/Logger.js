export class Logger {
    constructor() {
        this.logQueue = [];
        this.isProcessing = false;
        this.failedLogs = [];
        this.maxRetries = 3;
        this.apiToken = typeof window !== 'undefined' ? window.VITE_API_TOKEN || '' : '';
    }

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    async log(level, message, error = null) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : null
        };

        this.logQueue.push(logEntry);
        await this.processQueue();
    }

    async processQueue() {
        if (this.isProcessing || this.logQueue.length === 0) return;

        this.isProcessing = true;
        try {
            while (this.logQueue.length > 0) {
                const batch = this.logQueue.splice(0, 10);
                try {
                    await this.sendLogs(batch);
                } catch (error) {
                    this.failedLogs.push(...batch);
                    console.error('Failed to send logs:', error);
                }
            }
        } finally {
            this.isProcessing = false;
        }
    }

    async sendLogs(logs) {
        let lastError;
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const baseUrl = window.location.origin;
                const response = await fetch(`${baseUrl}/api/logs`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiToken}`
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(logs)
                });

                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Failed to send logs to server' }));
                    throw new Error(error.message || `HTTP error! status: ${response.status}`);
                }
                return;
            } catch (error) {
                lastError = error;
                if (attempt < this.maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    continue;
                }
                throw error;
            }
        }
    }

    async retryFailedLogs() {
        if (this.failedLogs.length === 0) return;

        const logsToRetry = [...this.failedLogs];
        this.failedLogs = [];

        try {
            await this.sendLogs(logsToRetry);
            console.log('Successfully resent failed logs');
        } catch (error) {
            this.failedLogs.push(...logsToRetry);
            console.error('Failed to resend logs:', error);
        }
    }

    async error(message, error = null) {
        await this.log('ERROR', message, error);
    }

    async warn(message) {
        await this.log('WARN', message);
    }

    async info(message) {
        await this.log('INFO', message);
    }

    async debug(message) {
        await this.log('DEBUG', message);
    }
}