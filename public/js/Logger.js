export class Logger {
    constructor() {
        this.logQueue = [];
        this.isProcessing = false;
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
                await this.sendLogs(batch);
            }
        } finally {
            this.isProcessing = false;
        }
    }

    async sendLogs(logs) {
        try {
            const response = await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logs)
            });

            if (!response.ok) {
                console.error('Failed to send logs to server');
            }
        } catch (error) {
            console.error('Error sending logs:', error);
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