import {Difference, DiffResult} from '../../../lib/api-types';
import {DiffClassifier} from '../../../lib/openapi-diff/spec-differ/diff-classifier';
import {ClassifiedDiffResults} from '../../../lib/openapi-diff/types';
import {diffResultBuilder} from '../support/builders/diff-result-builder';
import {differenceBuilder} from '../support/builders/difference-builder';

describe('spec-differ/diff-classifier', () => {

    const whenDiffClassifierIsInvokedWithDifference = (difference: Difference): ClassifiedDiffResults =>
        DiffClassifier.classifyDifferences([difference]);

    describe('basePath', () => {
        const basePathDifference = differenceBuilder.withEntity('basePath');

        it('should classify a basePath addition as breaking change', () => {
            const difference = basePathDifference.withAction('add');
            const classifiedDifferences = whenDiffClassifierIsInvokedWithDifference(difference.build());

            const expectedDiffResult: DiffResult = diffResultBuilder
                .withDifference(difference)
                .withType('breaking')
                .build();
            expect(classifiedDifferences).toEqual({
                breakingDifferences: [expectedDiffResult],
                nonBreakingDifferences: [],
                unclassifiedDifferences: []
            });
        });

        it('should classify a basePath deletion as breaking change', () => {
            const difference = basePathDifference.withAction('remove');
            const classifiedDifferences = whenDiffClassifierIsInvokedWithDifference(difference.build());

            const expectedDiffResult: DiffResult = diffResultBuilder
                .withDifference(difference)
                .withType('breaking')
                .build();
            expect(classifiedDifferences).toEqual({
                breakingDifferences: [expectedDiffResult],
                nonBreakingDifferences: [],
                unclassifiedDifferences: []
            });
        });
    });
});
