import {ResultReporter} from '../../../lib/openapi-diff/result-reporter';
import {validationOutcomeBuilder} from '../support/builders/validation-outcome-builder';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {createMockConsoleLogger, MockConsoleLogger} from '../support/mocks/mock-console-logger';

describe('openapi-diff/result-reporter', () => {
    let reporter: ResultReporter;
    let mockWrappedConsole: MockConsoleLogger;

    beforeEach(() => {
        mockWrappedConsole = createMockConsoleLogger();
        reporter = new ResultReporter(mockWrappedConsole);
    });

    it('should report a success message when no breaking or unclassified changes are found', async () => {
        const outcome = validationOutcomeBuilder
            .withBreakingDifferences([])
            .withUnclassifiedDifferences([])
            .withNonBreakingDifferences([validationResultBuilder.withEntity('oad.host')])
            .withSuccess(true)
            .build();

        reporter.reportSuccessWithOutcome(outcome);

        expect(mockWrappedConsole.info).toHaveBeenCalledWith(
            jasmine.stringMatching('Non breaking changes found between the two specifications')
        );
        expect(mockWrappedConsole.info).toHaveBeenCalledWith(jasmine.stringMatching('oad.host'));
    });

    it('should report a success message when diff is successful with differences', async () => {
        reporter.reportNoChangesFound();

        expect(mockWrappedConsole.info).toHaveBeenCalledWith('No changes found between the two specifications');
    });

    it('should report errors', async () => {
        reporter.reportError(new Error('some error'));

        expect(mockWrappedConsole.error).toHaveBeenCalledWith(new Error('some error'));
    });

    it('should report a failure when differences were found', async () => {
        const outcome = validationOutcomeBuilder
            .withBreakingDifferences([validationResultBuilder.withEntity('oad.host')])
            .withSuccess(false)
            .build();

        reporter.reportFailureWithOutcome(outcome);

        expect(mockWrappedConsole.info).toHaveBeenCalledWith(
            jasmine.stringMatching('Breaking changes found between the two specifications')
        );
        expect(mockWrappedConsole.info).toHaveBeenCalledWith(jasmine.stringMatching('oad.host'));
    });
});
