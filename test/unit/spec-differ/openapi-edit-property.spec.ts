import specDiffer from '../../../lib/openapi-diff/spec-differ';
import parsedSpecBuilder from '../support/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is a change in the openapi property', () => {

        describe('from a Swagger 2.0 spec', () => {

            const oldParsedSpec = parsedSpecBuilder.withOpenApi(['swagger'], '2.0').build();
            const newParsedSpec = parsedSpecBuilder.withOpenApi(['swagger'], '2.1').build();
            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            it('should classify the change as a non-breaking edition in the openapi property', () => {
                expect(result.length).toEqual(1);
                expect(result[0]).toEqual({
                    newValue: '2.1',
                    oldValue: '2.0',
                    printablePath: ['swagger'],
                    scope: 'openapi.property',
                    severity: 'non-breaking',
                    taxonomy: 'openapi.property.edit',
                    type: 'edit'
                });
            });
        });

        describe('from a OpenApi 3.0 spec', () => {

            const oldParsedSpec = parsedSpecBuilder.withOpenApi(['openapi'], '3.0.0').build();
            const newParsedSpec = parsedSpecBuilder.withOpenApi(['openapi'], '3.0.1').build();
            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            it('should classify the change as a non-breaking edition in the openapi property', () => {
                expect(result.length).toEqual(1);
                expect(result[0]).toEqual({
                    newValue: '3.0.1',
                    oldValue: '3.0.0',
                    printablePath: ['openapi'],
                    scope: 'openapi.property',
                    severity: 'non-breaking',
                    taxonomy: 'openapi.property.edit',
                    type: 'edit'
                });
            });
        });
    });
});
