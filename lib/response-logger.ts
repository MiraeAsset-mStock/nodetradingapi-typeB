import * as fs from 'fs';
import * as path from 'path';

/**
 * ResponseLogger class for logging API responses to a file.
 * 
 * This class handles the creation and management of a log file
 * for recording API responses with timestamps in IST.
 */
export class ResponseLogger {
    private logFile: string;

    constructor(logFileName: string = 'api-responses.log') {
        this.logFile = path.join(process.cwd(), logFileName);
        this.initLog();
    }

    private initLog() {
        const initEntry = `=== API Response Log Started at ${this.getISTTime()} ===\n\n`;
        fs.writeFileSync(this.logFile, initEntry);
    }

    public logResponse(operation: string, response: any) {
        const timestamp = this.getISTTime();
        const logEntry = `[${timestamp}] ${operation}:\n${JSON.stringify(response, null, 2)}\n\n`;
        
        try {
            fs.appendFileSync(this.logFile, logEntry);
        } catch (error) {
            console.error('Failed to write response log:', error);
        }
    }

    private getISTTime(): string {
        const options = { timeZone: 'Asia/Kolkata', hour12: false };
        return new Date().toLocaleString('en-IN', options);
    }

    public getLogPath(): string {
        return this.logFile;
    }
}
