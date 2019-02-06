import CustomMatcherResult = jasmine.CustomMatcherResult;
import {DiffOutcome, DiffResult, DiffResultType} from '../../../../lib/api-types';
import {diffOutcomeFailureBuilder} from '../../../support/builders/diff-outcome-failure-builder';
import {diffOutcomeSuccessBuilder} from '../../../support/builders/diff-outcome-success-builder';
import {
    breakingDiffResultBuilder,
    nonBreakingDiffResultBuilder, unclassifiedDiffResultBuilder
} from '../../../support/builders/diff-result-builder';
import {customMatchers} from './custom-matchers';

describe('toContainDifferences', () => {

    const whenToContainDifferencesIsCalledWith = (actualDiffResult: DiffOutcome,
                                                  expectedDifferences: Array<DiffResult<DiffResultType>>
    ): CustomMatcherResult => {
        const matcher = customMatchers.toContainDifferences(jasmine.matchersUtil);
        return matcher.compare(actualDiffResult, expectedDifferences);
    };

    describe('actual and expected differences', () => {
        it('should pass when the actual diff result has no differences, and no differences are expected', () => {
           const actualDiffOutcome = diffOutcomeSuccessBuilder.build();
           const expectedDifferences: Array<DiffResult<DiffResultType>> = [];

           const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, expectedDifferences);

           expect(result.pass).toBe(true, 'matcher result');
        });

        it('should pass when there are differences and actual and expected differences match', () => {
            const actualDiffOutcome = diffOutcomeSuccessBuilder
                .withNonBreakingDifferences([nonBreakingDiffResultBuilder])
                .build();
            const expectedDifference = nonBreakingDiffResultBuilder.build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, [expectedDifference]);

            expect(result.pass).toBe(true);
        });

        it('should fail when there are more actual differences than expected', () => {
            const actualDiffOutcome = diffOutcomeSuccessBuilder
                .withNonBreakingDifferences([nonBreakingDiffResultBuilder]).build();
            const expectedDifferences: Array<DiffResult<DiffResultType>> = [];

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, expectedDifferences);

            expect(result.pass).toBe(false, 'matcher result');
        });

        it('should fail when there are more expected differences than actual', () => {
            const actualDiffOutcome = diffOutcomeSuccessBuilder.build();
            const expectedDifferences = [breakingDiffResultBuilder.build()];

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, expectedDifferences);

            expect(result.pass).toBe(false, 'matcher result');
        });

        it('should pass when the actual differences in the diff result match the expected,' +
            'but differences are in a different order', () => {
            const difference1 = nonBreakingDiffResultBuilder.withAction('add');
            const difference2 = nonBreakingDiffResultBuilder.withAction('remove');
            const actualDiffOutcome = diffOutcomeSuccessBuilder
                .withNonBreakingDifferences([difference1, difference2])
                .build();
            const expectedDifferences = [difference2.build(), difference1.build()];

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, expectedDifferences);

            expect(result.pass).toBe(true, 'matcher result');
        });

        it('should pass when the actual diff outcome contains all types of differences', async () => {
            const nonBreakingDifference = nonBreakingDiffResultBuilder;
            const breakingDifference = breakingDiffResultBuilder;
            const unclassifiedDifference = unclassifiedDiffResultBuilder;
            const actualDiffOutcome = diffOutcomeFailureBuilder
                .withNonBreakingDifferences([nonBreakingDifference])
                .withBreakingDifferences([breakingDifference])
                .withUnclassifiedDifferences([unclassifiedDifference])
                .build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, [
                nonBreakingDifference.build(), breakingDifference.build(), unclassifiedDifference.build()
            ]);

            expect(result.pass).toBe(true, 'matcher result');
        });

        it('should support jasmine\'s equality matchers', async () => {
            const actualDiffOutcome = diffOutcomeSuccessBuilder
                .withNonBreakingDifferences([nonBreakingDiffResultBuilder.withDetails({foo: true})])
                .build();
            const expectedDifference = nonBreakingDiffResultBuilder.withDetails(jasmine.any(Object)).build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, [expectedDifference]);

            expect(result.pass).toBe(true, 'matcher result');
        });
    });

    describe('actual and expected difference properties', () => {

        it('should fail when actual and expected difference of the same type are not equal', () => {
            const actualNonBreakingDifference = nonBreakingDiffResultBuilder.withAction('add');
            const actualDiffOutcome = diffOutcomeSuccessBuilder
                .withNonBreakingDifferences([actualNonBreakingDifference])
                .build();

            const expectedNonBreakingDifference = nonBreakingDiffResultBuilder.withAction('remove').build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, [expectedNonBreakingDifference]);

            expect(result.pass).toBe(false, 'matcher result');

        });

        it('should fail when actual breakingDifferencesFound is true and no differences are expected', () => {
            const actualDiffOutcome = diffOutcomeFailureBuilder.build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, []);

            expect(result.pass).toBe(false, 'matcher result');
        });
    });

    describe('actual and expected differences message', () => {
        const unmatchedActualDifferencesTitle = 'Unmatched actual differences:';
        const unmatchedExpectedDifferencesTitle = 'Unmatched expected differences:';

        it('should contain a message with formatted difference when matching fails', () => {
            const actualDifference = nonBreakingDiffResultBuilder
                .withAction('add');

            const expectedDifference = nonBreakingDiffResultBuilder
                .withAction('remove')
                .build();

            const actualDiffOutcome = diffOutcomeSuccessBuilder.withNonBreakingDifferences([actualDifference]).build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, [expectedDifference]);

            expect(result.message).toContain(unmatchedActualDifferencesTitle);
            expect(result.message).toContain('"action": "add"');
            expect(result.message).toContain(unmatchedExpectedDifferencesTitle);
            expect(result.message).toContain('"action": "remove"');
        });

        it('should include only unmatched actual differences if all expected differences were matched', () => {
            const matchedExpectedDifference = nonBreakingDiffResultBuilder
                .withEntity('method');

            const matchedActualDifference = nonBreakingDiffResultBuilder
                .withEntity('method');

            const unmatchedActualDifference = nonBreakingDiffResultBuilder
                .withEntity('unclassified');

            const actualDiffOutcome = diffOutcomeSuccessBuilder
                .withNonBreakingDifferences([matchedActualDifference, unmatchedActualDifference]).build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, [matchedExpectedDifference.build()]);

            expect(result.message).toContain(unmatchedActualDifferencesTitle);
            expect(result.message).toContain('unclassified');
            expect(result.message).not.toContain(unmatchedExpectedDifferencesTitle);
            expect(result.message).not.toContain('method');
        });

        it('should include only unmatched expected differences if all actual differences were matched', () => {
            const matchedExpectedDifference = nonBreakingDiffResultBuilder
                .withEntity('method').build();
            const unmatchedExpectedDifference = nonBreakingDiffResultBuilder
                .withEntity('unclassified').build();

            const matchedActualDifference = nonBreakingDiffResultBuilder
                .withEntity('method');

            const actualDiffOutcome = diffOutcomeSuccessBuilder
                .withNonBreakingDifferences([matchedActualDifference]).build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, [
                matchedExpectedDifference,
                unmatchedExpectedDifference
            ]);

            expect(result.message).not.toContain(unmatchedActualDifferencesTitle);
            expect(result.message).not.toContain('method');
            expect(result.message).toContain(unmatchedExpectedDifferencesTitle);
            expect(result.message).toContain('unclassified');
        });

        it('should report message if expected breakingDifferencesFound flag is not the expected', () => {
            const actualDiffOutcome = diffOutcomeFailureBuilder.build();

            const result = whenToContainDifferencesIsCalledWith(actualDiffOutcome, []);

            expect(result.message).toContain('Expected breakingDifferencesFound to be false but it was true');
        });
    });
});
