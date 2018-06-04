import {ValidationOutcome} from '../api-types';
import {ConsoleLogger} from './result-reporter/console-logger';

export class ResultReporter {
    private static outcomeToString(outcome: ValidationOutcome): string {
        return JSON.stringify(outcome, null, 4);
    }

    public constructor(private readonly consoleLogger: ConsoleLogger) {}

    public reportSuccessWithOutcome(outcome: ValidationOutcome): void {
        this.consoleLogger.info(
            `Non breaking changes found between the two specifications:\n${ResultReporter.outcomeToString(outcome)}`
        );
    }

    public reportNoChangesFound(): void {
        this.consoleLogger.info('No changes found between the two specifications');
    }

    public reportError(error: Error): void {
        this.consoleLogger.error(error);
    }

    public reportFailureWithOutcome(outcome: ValidationOutcome): void {
        this.consoleLogger.info(
            `Breaking changes found between the two specifications:\n${ResultReporter.outcomeToString(outcome)}`
        );
    }
}
