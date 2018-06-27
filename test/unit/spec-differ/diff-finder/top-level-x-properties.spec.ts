import {Difference} from '../../../../lib/api-types';
import {DiffFinder} from '../../../../lib/openapi-diff/spec-differ/diff-finder';
import {ParsedSpec} from '../../../../lib/openapi-diff/spec-parser-types';
import {specEntityDetailsBuilder} from '../../../support/builders/diff-result-spec-entity-details-builder';
import {differenceBuilder} from '../../../support/builders/difference-builder';
import {parsedSpecBuilder} from '../../../support/builders/parsed-spec-builder';

describe('spec-differ/diff-finder/top level ^x- properties', () => {
    const xPropertyDiffResultBuilder = differenceBuilder
        .withSource('openapi-diff')
        .withEntity('unclassified');

    const invokeDiffFinder = (sourceSpec: ParsedSpec, destinationSpec: ParsedSpec): Promise<Difference[]> =>
        DiffFinder.findDifferences({sourceSpec, destinationSpec});

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

        const result = await invokeDiffFinder(parsedSourceSpec, parsedDestinationSpec);

        expect(result).toEqual([]);
    });

    it('should return an unclassified add difference, when a new property is added', async () => {

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

        const result = await invokeDiffFinder(parsedSourceSpec, parsedDestinationSpec);

        const expectedDiffResult = xPropertyDiffResultBuilder
            .withAction('add')
            .withCode('unclassified.add')
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

    it('should return an unclassified remove difference, when a property is removed', async () => {
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

        const result = await invokeDiffFinder(parsedSourceSpec, parsedDestinationSpec);

        const expectedDiffResult = xPropertyDiffResultBuilder
            .withAction('remove')
            .withCode('unclassified.remove')
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

    it('should return unclassified add and remove differences, when a property is changed', async () => {

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

        const result = await invokeDiffFinder(parsedSourceSpec, parsedDestinationSpec);

        const baseDiffResult = xPropertyDiffResultBuilder
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
