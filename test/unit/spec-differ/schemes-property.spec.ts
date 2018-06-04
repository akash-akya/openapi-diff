import {specFinder} from '../../../lib/openapi-diff/spec-finder';
import {diffResultBuilder} from '../support/builders/diff-result-builder';
import {specEntityDetailsBuilder} from '../support/builders/diff-result-spec-entity-details-builder';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specFinder/schemes', () => {
    const schemesDiffResultBuilder = diffResultBuilder
        .withSource('openapi-diff');

    describe('when there is a single edition in an item in the schemes property array', () => {

        it('should return a non-breaking item.add difference and a breaking item remove difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'https'}])
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult1 = schemesDiffResultBuilder
                .withEntity('schemes.item')
                .withAction('add')
                .withCode('schemes.item.add')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.0')
                    .withValue('https'))
                .build();
            const expectedDiffResult2 = schemesDiffResultBuilder
                .withEntity('schemes.item')
                .withAction('remove')
                .withCode('schemes.item.remove')
                .withType('breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.0')
                    .withValue('http'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedDiffResult1, expectedDiffResult2]);
        });
    });

    describe('when there is an addition in the schemes property content', () => {

        it('should return a non-breaking item add difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withEmptySchemes()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([{originalPath: ['schemes', '0'], value: 'http'}])
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = schemesDiffResultBuilder
                .withEntity('schemes.item')
                .withAction('add')
                .withCode('schemes.item.add')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.0')
                    .withValue('http'))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when there is a deletion in the schemes property content', () => {

        it('should return a breaking item remove difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([{originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withEmptySchemes()
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = schemesDiffResultBuilder
                .withEntity('schemes.item')
                .withAction('remove')
                .withCode('schemes.item.remove')
                .withType('breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.0')
                    .withValue('http'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when there are multiple changes in the schemes property content', () => {

        it('should return two non-breaking add differences and one breaking remove difference', async () => {

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

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult1 = schemesDiffResultBuilder
                .withEntity('schemes.item')
                .withAction('add')
                .withCode('schemes.item.add')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.1')
                    .withValue('ws'))
                .build();
            const expectedDiffResult2 = schemesDiffResultBuilder
                .withEntity('schemes.item')
                .withAction('add')
                .withCode('schemes.item.add')
                .withType('non-breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.2')
                    .withValue('wss'))
                .build();
            const expectedDiffResult3 = schemesDiffResultBuilder
                .withEntity('schemes.item')
                .withAction('remove')
                .withCode('schemes.item.remove')
                .withType('breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes.1')
                    .withValue('https'))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation(undefined)
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedDiffResult1, expectedDiffResult2, expectedDiffResult3]);
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

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            expect(result.length).toEqual(0);
        });
    });

    describe('when the schemes property is added altogether', () => {

        it('should return a breaking add difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoSchemes()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'https'}])
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = schemesDiffResultBuilder
                .withAction('add')
                .withEntity('schemes')
                .withCode('schemes.add')
                .withType('breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes')
                    .withValue(undefined))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes')
                    .withValue([{originalPath: ['schemes', '0'], value: 'https'}]))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });

    describe('when the schemes property is removed altogether', () => {

        it('should return a breaking remove difference', async () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoSchemes()
                .build();

            const result = await specFinder.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffResult = schemesDiffResultBuilder
                .withAction('remove')
                .withEntity('schemes')
                .withCode('schemes.remove')
                .withType('breaking')
                .withSourceSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes')
                    .withValue([{originalPath: ['schemes', '0'], value: 'http'}]))
                .withDestinationSpecEntityDetails(specEntityDetailsBuilder
                    .withLocation('schemes')
                    .withValue(undefined))
                .build();
            expect(result).toEqual([expectedDiffResult]);
        });
    });
});
