import {specFinder} from '../../../lib/openapi-diff/spec-finder';
import {diffResultBuilder} from '../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/diff-result-spec-entity-details-builder';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specFinder/host property', () => {
    const hostDiffResultBuilder = diffResultBuilder
        .withSource('openapi-diff')
        .withEntity('host');

    describe('when the host property is added in the new spec', () => {

        it('should return a breaking add difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoHost()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withHost('NEW host info')
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = hostDiffResultBuilder
                .withAction('add')
                .withCode('host.add')
                .withType('breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue('NEW host info'))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when the host property is removed in the new spec', () => {

        it('should return a breaking remove difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withHost('OLD host info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoHost()
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = hostDiffResultBuilder
                .withAction('remove')
                .withCode('host.remove')
                .withType('breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue('OLD host info'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when there is an edition in the host property', () => {

        it('should return breaking add and remove differences', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withHost('host info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withHost('NEW host info')
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const baseDiffResult = hostDiffResultBuilder
                .withType('breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue('host info'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue('NEW host info'));

            expect(result).toEqual([
                baseDiffResult.withAction('add').withCode('host.add').build(),
                baseDiffResult.withAction('remove').withCode('host.remove').build()
            ]);
        });
    });
});
