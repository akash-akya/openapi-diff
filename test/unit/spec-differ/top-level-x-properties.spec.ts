import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('specDiffer/top level ^x- properties', () => {
    const xPropertyValidationResultBuilder = validationResultBuilder
        .withSource('openapi-diff')
        .withEntity('oad.unclassified');

    describe('when there is an edit in an ^x- property at the top level object', () => {

        it('should return an edit difference of type warning', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = xPropertyValidationResultBuilder
                .withAction('edit')
                .withType('warning')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-external-id')
                        .withValue('x value'))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-external-id')
                        .withValue('NEW x value'))
                .build();

            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when there is an addition of an ^x- property at the top level object', () => {

        it('should return an add difference of type warning', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoTopLevelXProperties()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = xPropertyValidationResultBuilder
                .withAction('add')
                .withType('warning')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-external-id')
                        .withValue('NEW x value'))
                .build();

            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when there is a deletion of an ^x- property at the top level object', () => {

        it('should return a delete difference of type warning', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoTopLevelXProperties()
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = xPropertyValidationResultBuilder
                .withAction('delete')
                .withType('warning')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-external-id')
                        .withValue('x value'))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined))
                .build();

            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when there are multiple changes on ^x- properties at the top level object', () => {

        it('should detect and classify ^x- property additions, deletions and editions', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-deleted-prop',
                    originalPath: ['x-deleted-prop'],
                    value: 'x deleted value'
                })
                .withTopLevelXProperty({
                    name: 'x-edited-prop',
                    originalPath: ['x-edited-prop'],
                    value: 'x edited old value'
                })
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-added-prop',
                    originalPath: ['x-added-prop'],
                    value: 'x added value'
                })
                .withTopLevelXProperty({
                    name: 'x-edited-prop',
                    originalPath: ['x-edited-prop'],
                    value: 'x edited NEW value'
                })
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDeletionResult = xPropertyValidationResultBuilder
                .withAction('delete')
                .withType('warning')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-deleted-prop')
                        .withValue('x deleted value'))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined))
                .build();

            const expectedEditionResult = xPropertyValidationResultBuilder
                .withAction('edit')
                .withType('warning')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-edited-prop')
                        .withValue('x edited old value'))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-edited-prop')
                        .withValue('x edited NEW value'))
                .build();

            const expectedAdditionResult = xPropertyValidationResultBuilder
                .withAction('add')
                .withType('warning')
                .withSourceSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation(undefined)
                        .withValue(undefined))
                .withDestinationSpecEntityDetails(
                    specEntityDetailsBuilder
                        .withLocation('x-added-prop')
                        .withValue('x added value'))
                .build();

            expect(result).toEqual([expectedDeletionResult, expectedEditionResult, expectedAdditionResult]);
        });
    });
});
