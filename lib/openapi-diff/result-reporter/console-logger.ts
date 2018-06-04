export class ConsoleLogger {
    public info(message: string): void {
        console.log(message);
    }

    public error(error: Error): void {
        console.error(error);
    }
}
