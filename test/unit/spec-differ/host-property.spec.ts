import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('specDiffer/host property', () => {
    const hostValidationResultBuilder = validationResultBuilder
        .withSource('openapi-diff')
        .withEntity('oad.host');

    describe('when there is an edition in the host property', () => {

        it('should return an edit difference of type error', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withHost('host info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withHost('NEW host info')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = hostValidationResultBuilder
                .withAction('edit')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue('host info'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue('NEW host info'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when the host property is added in the new spec', () => {

        it('should return an add difference of type error', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoHost()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withHost('NEW host info')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = hostValidationResultBuilder
                .withAction('add')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue('NEW host info'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when the host property is deleted in the new spec', () => {

        it('should return a delete difference of type error', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withHost('OLD host info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoHost()
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = hostValidationResultBuilder
                .withAction('delete')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue('OLD host info'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('host')
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });
});
