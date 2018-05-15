import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {DiffEntry} from '../../../lib/openapi-diff/types';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is a change in the openapi property', () => {

        describe('from a Swagger 2.0 spec', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSwagger2()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withOpenApi(['swagger'], '2.1')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            it('should classify the change as a non-breaking edition in the openapi property', () => {
                const expectedDiffEntry: DiffEntry = {
                    destinationValue: '2.1',
                    printablePath: ['swagger'],
                    scope: 'openapi',
                    severity: 'non-breaking',
                    sourceValue: '2.0',
                    taxonomy: 'openapi.edit',
                    type: 'edit'
                };
                expect(result).toEqual([expectedDiffEntry]);
            });
        });

        describe('from a OpenApi 3.0 spec', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withOpenApi3()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withOpenApi(['openapi'], '3.0.1')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            it('should classify the change as a non-breaking edition in the openapi property', () => {
                const expectedDiffEntry: DiffEntry = {
                    destinationValue: '3.0.1',
                    printablePath: ['openapi'],
                    scope: 'openapi',
                    severity: 'non-breaking',
                    sourceValue: '3.0.0',
                    taxonomy: 'openapi.edit',
                    type: 'edit'
                };
                expect(result).toEqual([expectedDiffEntry]);
            });
        });
    });
});
