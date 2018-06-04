import {Difference} from '../../../../lib/api-types';
import {DiffFinder} from '../../../../lib/openapi-diff/spec-differ/diff-finder';
import {ParsedSpec} from '../../../../lib/openapi-diff/types';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {differenceBuilder} from '../../support/builders/difference-builder';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';

describe('spec-differ/diff-finder/basePath property', () => {
    const basePathDifferenceBuilder = differenceBuilder
        .withSource('openapi-diff')
        .withEntity('basePath');

    const invokeDiffFinder = (sourceSpec: ParsedSpec, destinationSpec: ParsedSpec): Promise<Difference[]> =>
        DiffFinder.findDifferences({sourceSpec, destinationSpec});

    describe('when there is an edition in the basePath property', () => {

        it('should return breaking add and remove differences', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = await invokeDiffFinder(parsedSourceSpec, parsedDestinationSpec);

            const baseDiffResult = basePathDifferenceBuilder
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue('basePath info'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue('NEW basePath info'));

            expect(result).toEqual([
                baseDiffResult.withAction('add').withCode('basePath.add').build(),
                baseDiffResult.withAction('remove').withCode('basePath.remove').build()
            ]);
        });
    });

    describe('when the basePath property is added in the new spec', () => {

        it('should return and add difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = await invokeDiffFinder(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = basePathDifferenceBuilder
                .withAction('add')
                .withCode('basePath.add')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue('NEW basePath info'))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when the basePath property is removed in the new spec', () => {

        it('should return a remove difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('OLD basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();

            const result = await invokeDiffFinder(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = basePathDifferenceBuilder
                .withAction('remove')
                .withCode('basePath.remove')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue('OLD basePath info'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue(undefined))
                .build();

            expect(result).toEqual([expectedDiffResult]);
        });
    });
});
