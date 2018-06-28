import {specFinder} from '../../../lib/openapi-diff/spec-finder';
import {diffResultBuilder} from '../../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../../support/builders/diff-result-spec-entity-details-builder';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';

describe('specFinder/basePath property', () => {
    const basePathDiffResultBuilder = diffResultBuilder
        .withSource('openapi-diff')
        .withEntity('basePath');

    describe('when the basePath property is added in the new spec', () => {

        it('should return breaking add difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = basePathDiffResultBuilder
                .withAction('add')
                .withCode('basePath.add')
                .withType('breaking')
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

        it('should return a breaking remove difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('OLD basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = basePathDiffResultBuilder
                .withAction('remove')
                .withCode('basePath.remove')
                .withType('breaking')
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

    describe('when there is an edition in the basePath property', () => {

        it('should return breaking add and remove differences', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const baseDiffResult = basePathDiffResultBuilder
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
});
