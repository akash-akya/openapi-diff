import {Difference, DiffResult} from '../../../lib/api-types';
import {ClassifiedDiffResults, DiffClassifier} from '../../../lib/openapi-diff/spec-differ/diff-classifier';
import {diffResultBuilder} from '../../support/builders/diff-result-builder';
import {differenceBuilder} from '../../support/builders/difference-builder';

describe('spec-differ/diff-classifier', () => {

    const whenDiffClassifierIsInvokedWithDifference = (difference: Difference): ClassifiedDiffResults =>
        DiffClassifier.classifyDifferences([difference]);

    describe('unclassified', () => {
        const xPropertyDifference = differenceBuilder.withEntity('unclassified');

        it('should classify an unclassified addition as unclassified change', () => {
            const difference = xPropertyDifference.withCode('unclassified.add').withAction('add');
            const classifiedDifferences = whenDiffClassifierIsInvokedWithDifference(difference.build());

            const expectedDiffResult: DiffResult = diffResultBuilder
                .withDifference(difference)
                .withType('unclassified')
                .build();
            expect(classifiedDifferences).toEqual({
                breakingDifferences: [],
                nonBreakingDifferences: [],
                unclassifiedDifferences: [expectedDiffResult]
            });
        });

        it('should classify an unclassified deletion as unclassified change', () => {
            const difference = xPropertyDifference.withCode('unclassified.remove').withAction('remove');
            const classifiedDifferences = whenDiffClassifierIsInvokedWithDifference(difference.build());

            const expectedDiffResult: DiffResult = diffResultBuilder
                .withDifference(difference)
                .withType('unclassified')
                .build();
            expect(classifiedDifferences).toEqual({
                breakingDifferences: [],
                nonBreakingDifferences: [],
                unclassifiedDifferences: [expectedDiffResult]
            });
        });
    });

    describe('path', () => {
        const pathDifference = differenceBuilder.withEntity('path');

        it('should classify a path addition as non-breaking change', () => {
            const difference = pathDifference.withCode('path.add').withAction('add');
            const classifiedDifferences = whenDiffClassifierIsInvokedWithDifference(difference.build());

            const expectedDiffResult: DiffResult = diffResultBuilder
                .withDifference(difference)
                .withType('non-breaking')
                .build();
            expect(classifiedDifferences).toEqual({
                breakingDifferences: [],
                nonBreakingDifferences: [expectedDiffResult],
                unclassifiedDifferences: []
            });
        });

        it('should classify a path deletion as breaking change', () => {
            const difference = pathDifference.withCode('path.remove').withAction('remove');
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
