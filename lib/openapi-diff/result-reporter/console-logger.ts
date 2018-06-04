export class ConsoleLogger {
    public info(message: string): void {
        throw new Error(`Not Implemented - ConsoleLogger.info(${message})`);
    }

    public error(error: Error): void {
        throw new Error(`Not Implemented - ConsoleLogger.error(${error})`);
    }
}
