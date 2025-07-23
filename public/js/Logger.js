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

    async log(level, message) {
        // verify log level
        const allowedLevels = ['info', 'warn', 'error', 'debug'];
        const validLevel = allowedLevels.includes(level) ? level : 'info';
        
        // limit message length to 1000 characters
        const truncatedMessage = message.length > 1000 ? message.substring(0, 900) + '...' : message;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: validLevel,
            message: truncatedMessage
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

    async sendLogs(batch) {
        let lastError;
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const baseUrl = window.location.origin;
                    console.log('Sending log batch:', batch);
                const response = await fetch(`${baseUrl}/api/logs`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || ''
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(batch)
                });

                if (!response.ok) {
                    const responseText = await response.text();
                    let error;
                    try {
                        error = JSON.parse(responseText);
                    } catch {
                        error = { error: responseText };
                    }
                    throw new Error(`${error.error || `HTTP error! status: ${response.status}`}\nResponse: ${responseText.substring(0, 200)}`);
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