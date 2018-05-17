import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('specDiffer/basePath property', () => {
    const basePathValidationResultBuilder = validationResultBuilder
        .withSource('openapi-diff')
        .withEntity('oad.basePath');

    describe('when there is an edition in the basePath property', () => {

        it('should return an edit difference of type error', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = basePathValidationResultBuilder
                .withAction('edit')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue('basePath info'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue('NEW basePath info'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when the basePath property is added in the new spec', () => {

        it('should return an add difference of type error', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = basePathValidationResultBuilder
                .withAction('add')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue('NEW basePath info'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when the basePath property is deleted in the new spec', () => {

        it('should return a delete difference of type error', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('OLD basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = basePathValidationResultBuilder
                .withAction('delete')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue('OLD basePath info'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('basePath')
                    .withValue(undefined))
                .build();

            expect(result).toEqual([expectedValidationResult]);
        });
    });
});
