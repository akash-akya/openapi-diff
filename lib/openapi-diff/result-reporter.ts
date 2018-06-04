import {DiffOutcome, DiffOutcomeFailure, DiffOutcomeSuccess} from '../api-types';
import {ConsoleLogger} from './result-reporter/console-logger';

export class ResultReporter {
    private static hasDifferences(outcome: DiffOutcomeSuccess): boolean {
        return outcome.nonBreakingDifferences.length + outcome.unclassifiedDifferences.length > 0;
    }

    private static outcomeToString(outcome: DiffOutcome): string {
        return JSON.stringify(outcome, null, 4);
    }

    public constructor(private readonly consoleLogger: ConsoleLogger) {}

    public reportError(error: Error): void {
        this.consoleLogger.error(error);
    }

    public reportOutcome(outcome: DiffOutcome): void {
        if (outcome.breakingDifferencesFound) {
            this.reportFailure(outcome);
        } else if (ResultReporter.hasDifferences(outcome)) {
            this.reportSuccessWithDifferences(outcome);
        } else {
            this.reportNoChangesFound();
        }
    }

    private reportFailure(outcome: DiffOutcomeFailure): void {
        this.consoleLogger.info(
            `Breaking changes found between the two specifications:\n${ResultReporter.outcomeToString(outcome)}`
        );
    }

    private reportSuccessWithDifferences(outcome: DiffOutcomeSuccess): void {
        this.consoleLogger.info(
            `Non breaking changes found between the two specifications:\n${ResultReporter.outcomeToString(outcome)}`
        );
    }

    private reportNoChangesFound(): void {
        this.consoleLogger.info('No changes found between the two specifications');
    }
}
