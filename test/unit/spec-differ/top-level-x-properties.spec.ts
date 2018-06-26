import {specFinder} from '../../../lib/openapi-diff/spec-finder';
import {diffResultBuilder} from '../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/diff-result-spec-entity-details-builder';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specFinder/top level ^x- properties', () => {
    const xPropertyDiffResultBuilder = diffResultBuilder
        .withSource('openapi-diff')
        .withEntity('unclassified');

    it('should not detect differences in ^x-properties with the same value', async () => {
        const specWithXPropertyBuilder = parsedSpecBuilder
            .withTopLevelXProperty({
                name: 'x-external-id',
                originalPath: ['x-external-id'],
                value: {
                    some: 'value'
                }
            });
        const parsedSourceSpec = specWithXPropertyBuilder.build();
        const parsedDestinationSpec = specWithXPropertyBuilder.build();

        const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

        expect(result).toEqual([]);
    });

    describe('when there is an addition of an ^x- property at the top level object', () => {

        it('should return an unclassified add difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoTopLevelXProperties()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = xPropertyDiffResultBuilder
                .withAction('add')
                .withCode('unclassified.add')
                .withType('unclassified')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-external-id')
                        .withValue('NEW x value'))
                .build();

            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when there is a deletion of an ^x- property at the top level object', () => {

        it('should return an unclassified remove difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoTopLevelXProperties()
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = xPropertyDiffResultBuilder
                .withAction('remove')
                .withCode('unclassified.remove')
                .withType('unclassified')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-external-id')
                        .withValue('x value'))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined))
                .build();

            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when there is an edition in an ^x- property at the top level object', () => {

        it('should return unclassified add and remove differences', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const baseDiffResult = xPropertyDiffResultBuilder
                .withType('unclassified')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-external-id')
                        .withValue('x value'))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-external-id')
                        .withValue('NEW x value'));

            expect(result).toEqual([
                baseDiffResult.withAction('add').withCode('unclassified.add').build(),
                baseDiffResult.withAction('remove').withCode('unclassified.remove').build()
            ]);
        });
    });

    describe('when there are multiple changes on ^x- properties at the top level object', () => {

        it('should detect and classify ^x- property differences for each', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-removed-prop',
                    originalPath: ['x-removed-prop'],
                    value: 'x removed value'
                })
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-added-prop',
                    originalPath: ['x-added-prop'],
                    value: 'x added value'
                })
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDeletionResult = xPropertyDiffResultBuilder
                .withAction('remove')
                .withCode('unclassified.remove')
                .withType('unclassified')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-removed-prop')
                        .withValue('x removed value'))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined))
                .build();

            const expectedAdditionResult = xPropertyDiffResultBuilder
                .withAction('add')
                .withCode('unclassified.add')
                .withType('unclassified')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-added-prop')
                        .withValue('x added value'))
                .build();

            expect(result).toEqual([expectedDeletionResult, expectedAdditionResult]);
        });
    });
});
