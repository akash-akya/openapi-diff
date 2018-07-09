import {unclassifiedDiffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {openApi3SpecBuilder} from '../../support/builders/openapi3-spec-builder';
import {CustomMatchers} from '../support/custom-matchers/custom-matchers';
import {whenSpecsAreDiffed} from '../support/when-specs-are-diffed';

declare function expect<T>(actual: T): CustomMatchers<T>;

describe('spec-differ/diff-finder/top level ^x- properties', () => {
    const xPropertyDiffResultBuilder = unclassifiedDiffResultBuilder
        .withSource('openapi-diff')
        .withEntity('unclassified');

    it('should not detect differences in ^x-properties with the same value', async () => {
        const aSpec = openApi3SpecBuilder
            .withTopLevelXProperty('x-external-id', {
                originalPath: ['x-external-id'],
                value: {
                    some: 'value'
                }
            });

        const outcome = await whenSpecsAreDiffed(aSpec, aSpec);

        expect(outcome).toContainDifferences([]);
    });

    it('should return an unclassified add difference, when a new property is added', async () => {

        const sourceSpec = openApi3SpecBuilder
            .withNoTopLevelXProperties();
        const destinationSpec = openApi3SpecBuilder
            .withTopLevelXProperty('x-external-id', 'NEW x value');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const expectedDiffResult = xPropertyDiffResultBuilder
            .withAction('add')
            .withCode('unclassified.add')
            .withSourceSpecEntityDetails([])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation('x-external-id')
                    .withValue('NEW x value')
            ])
            .build();

        expect(outcome).toContainDifferences([expectedDiffResult]);
    });

    it('should return an unclassified remove difference, when a property is removed', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withTopLevelXProperty('x-external-id', 'x value');
        const destinationSpec = openApi3SpecBuilder
            .withNoTopLevelXProperties();

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const expectedDiffResult = xPropertyDiffResultBuilder
            .withAction('remove')
            .withCode('unclassified.remove')
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation('x-external-id')
                    .withValue('x value')
            ])
            .withDestinationSpecEntityDetails([])
            .build();

        expect(outcome).toContainDifferences([expectedDiffResult]);
    });

    it('should return unclassified add and remove differences, when a property is changed', async () => {
        const sourceSpec = openApi3SpecBuilder
            .withTopLevelXProperty('x-external-id', 'x value');
        const destinationSpec = openApi3SpecBuilder
            .withTopLevelXProperty('x-external-id', 'NEW x value');

        const outcome = await whenSpecsAreDiffed(sourceSpec, destinationSpec);

        const baseDiffResult = xPropertyDiffResultBuilder
            .withSourceSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation('x-external-id')
                    .withValue('x value')
            ])
            .withDestinationSpecEntityDetails([
                specEntityDetailsBuilder
                    .withLocation('x-external-id')
                    .withValue('NEW x value')
            ]);

        expect(outcome).toContainDifferences([
            baseDiffResult.withAction('add').withCode('unclassified.add').build(),
            baseDiffResult.withAction('remove').withCode('unclassified.remove').build()
        ]);
    });
});
