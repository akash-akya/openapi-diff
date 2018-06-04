import {specFinder} from '../../../lib/openapi-diff/spec-finder';
import {diffResultBuilder} from '../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/diff-result-spec-entity-details-builder';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specFinder/openapi', () => {
    const openapiDiffResultBuilder = diffResultBuilder
        .withSource('openapi-diff')
        .withEntity('openapi');

    describe('when there is a change in the openapi property', () => {

        describe('from a Swagger 2.0 spec', () => {

            it('should return non-breaking add and remove differences', async () => {
                const parsedSourceSpec = parsedSpecBuilder
                    .withSwagger2()
                    .build();
                const parsedDestinationSpec = parsedSpecBuilder
                    .withOpenApi(['swagger'], '2.1')
                    .build();

                const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

                const baseDiffResult = openapiDiffResultBuilder
                    .withType('non-breaking')
                    .withSourceSpecEntityDetails(specEntityDetailsBuilder
                        .withLocation('swagger')
                        .withValue('2.0'))
                    .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                        .withLocation('swagger')
                        .withValue('2.1'));

                expect(result).toEqual([
                    baseDiffResult.withAction('add').withCode('openapi.add').build(),
                    baseDiffResult.withAction('remove').withCode('openapi.remove').build()
                ]);
            });
        });

        describe('from a OpenApi 3.0 spec', () => {

            it('should return non-breaking add and remove differences', async () => {
                const parsedSourceSpec = parsedSpecBuilder
                    .withOpenApi3()
                    .build();
                const parsedDestinationSpec = parsedSpecBuilder
                    .withOpenApi(['openapi'], '3.0.1')
                    .build();

                const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

                const baseDiffResult = openapiDiffResultBuilder
                    .withType('non-breaking')
                    .withSourceSpecEntityDetails(specEntityDetailsBuilder
                        .withLocation('openapi')
                        .withValue('3.0.0'))
                    .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                        .withLocation('openapi')
                        .withValue('3.0.1'));

                expect(result).toEqual([
                    baseDiffResult.withAction('add').withCode('openapi.add').build(),
                    baseDiffResult.withAction('remove').withCode('openapi.remove').build()
                ]);
            });
        });
    });
});
