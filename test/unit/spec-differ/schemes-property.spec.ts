import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';
import {validationResultBuilder} from '../support/builders/validation-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/validation-result-spec-entity-details-builder';

describe('specDiffer/schemes', () => {
    const schemesValidationResultBuilder = validationResultBuilder
        .withSource('openapi-diff')
        .withEntity('oad.schemes');

    describe('when there is a single edition in an item in the schemes property array', () => {

        it('should return item.add difference of type info and an item.delete difference of type error', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'https'}])
                .build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult1 = schemesValidationResultBuilder
                .withAction('item.add')
                .withType('info')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.0')
                    .withValue('https'))
                .build();
            const expectedValidationResult2 = schemesValidationResultBuilder
                .withAction('item.delete')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.0')
                    .withValue('http'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedValidationResult1, expectedValidationResult2]);
        });
    });

    describe('when there is an addition in the schemes property content', () => {

        it('should return an item.add difference of type info', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withEmptySchemes()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([{originalPath: ['schemes', '0'], value: 'http'}])
                .build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = schemesValidationResultBuilder
                .withAction('item.add')
                .withType('info')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.0')
                    .withValue('http'))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when there is a deletion in the schemes property content', () => {

        it('should return an item.delete difference of type error', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([{originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withEmptySchemes()
                .build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = schemesValidationResultBuilder
                .withAction('item.delete')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.0')
                    .withValue('http'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when the schemes property is added altogether', () => {

        it('should return an add difference of type error', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoSchemes()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'https'}])
                .build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = schemesValidationResultBuilder
                .withAction('add')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes')
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes')
                    .withValue([{originalPath: ['schemes', '0'], value: 'https'}]))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when the schemes property is removed altogether', () => {

        it('should return a delete difference of type error', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoSchemes()
                .build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult = schemesValidationResultBuilder
                .withAction('delete')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes')
                    .withValue([{originalPath: ['schemes', '0'], value: 'http'}]))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes')
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedValidationResult]);
        });
    });

    describe('when there are multiple changes in the schemes property content', () => {

        it('should return two add differences of type info and one delete difference of type error', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'},
                    {originalPath: ['schemes', '1'], value: 'https'}
                ]).build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'},
                    {originalPath: ['schemes', '1'], value: 'ws'},
                    {originalPath: ['schemes', '2'], value: 'wss'}
                ]).build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedValidationResult1 = schemesValidationResultBuilder
                .withAction('item.add')
                .withType('info')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.1')
                    .withValue('ws'))
                .build();
            const expectedValidationResult2 = schemesValidationResultBuilder
                .withAction('item.add')
                .withType('info')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.2')
                    .withValue('wss'))
                .build();
            const expectedValidationResult3 = schemesValidationResultBuilder
                .withAction('item.delete')
                .withType('error')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.1')
                    .withValue('https'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedValidationResult1, expectedValidationResult2, expectedValidationResult3]);
        });
    });

    describe('when the schemes content is shuffled but the elements are the same', () => {

        it('should detect no differences', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'},
                    {originalPath: ['schemes', '1'], value: 'https'},
                    {originalPath: ['schemes', '2'], value: 'ws'}
                ]).build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'https'},
                    {originalPath: ['schemes', '1'], value: 'ws'},
                    {originalPath: ['schemes', '2'], value: 'http'}
                ]).build();

            const result = await specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            expect(result.length).toEqual(0);
        });
    });
});
