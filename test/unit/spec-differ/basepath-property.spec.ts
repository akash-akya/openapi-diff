import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('specDiffer/basePath property', () => {
    const basePathValidationResultBuilder = validationResultBuilder
        .withSource('openapi-diff')
        .withEntity('oad.basePath');

    describe('when there is an edition in the basePath property', () => {

        it('should return a breaking edit difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = basePathValidationResultBuilder
                .withAction('edit')
                .withType('breaking')
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

        it('should return breaking add difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withBasePath('NEW basePath info')
                .build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = basePathValidationResultBuilder
                .withAction('add')
                .withType('breaking')
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

        it('should return a breaking delete difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withBasePath('OLD basePath info')
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoBasePath()
                .build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = basePathValidationResultBuilder
                .withAction('delete')
                .withType('breaking')
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
