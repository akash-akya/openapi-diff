import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('specDiffer/openapi', () => {
    const openapiValidationResultBuilder = validationResultBuilder
        .withSource('openapi-diff')
        .withEntity('oad.openapi');

    describe('when there is a change in the openapi property', () => {

        describe('from a Swagger 2.0 spec', () => {

            it('should return an edit difference of type info', () => {
                const parsedSourceSpec = parsedSpecBuilder
                    .withSwagger2()
                    .build();
                const parsedDestinationSpec = parsedSpecBuilder
                    .withOpenApi(['swagger'], '2.1')
                    .build();

                const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

                const expectedValidationResult = openapiValidationResultBuilder
                    .withAction('edit')
                    .withType('info')
                    .withSourceSpecEntityDetails(specEntityDetailsBuilder
                        .withLocation('swagger')
                        .withValue('2.0'))
                    .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                        .withLocation('swagger')
                        .withValue('2.1'))
                    .build();
                expect(result).toEqual([expectedValidationResult]);
            });
        });

        describe('from a OpenApi 3.0 spec', () => {

            it('should return an edit difference of type info', () => {
                const parsedSourceSpec = parsedSpecBuilder
                    .withOpenApi3()
                    .build();
                const parsedDestinationSpec = parsedSpecBuilder
                    .withOpenApi(['openapi'], '3.0.1')
                    .build();

                const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

                const expectedValidationResult = openapiValidationResultBuilder
                    .withAction('edit')
                    .withType('info')
                    .withSourceSpecEntityDetails(specEntityDetailsBuilder
                        .withLocation('openapi')
                        .withValue('3.0.0'))
                    .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                        .withLocation('openapi')
                        .withValue('3.0.1'))
                    .build();
                expect(result).toEqual([expectedValidationResult]);
            });
        });
    });
});
