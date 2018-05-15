import {specDiffer} from '../../../lib/openapi-diff/spec-differ';
import {DiffEntry} from '../../../lib/openapi-diff/types';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is a single edition in the schemes property content', () => {

        it('should classify the changes as a breaking deletion and a non-breaking addition in schemes', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'https'}])
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry1: DiffEntry = {
                destinationValue: 'https',
                printablePath: ['schemes', '0'],
                scope: 'schemes',
                severity: 'non-breaking',
                sourceValue: undefined,
                taxonomy: 'schemes.arrayContent.add',
                type: 'arrayContent.add'
            };
            const expectedDiffEntry2: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['schemes', '0'],
                scope: 'schemes',
                severity: 'breaking',
                sourceValue: 'http',
                taxonomy: 'schemes.arrayContent.delete',
                type: 'arrayContent.delete'
            };
            expect(result).toEqual([expectedDiffEntry1, expectedDiffEntry2]);
        });
    });

    describe('when there is an addition in the schemes property content', () => {

        it('should classify the change as a non-breaking addition in the schemes property content', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withEmptySchemes()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([{originalPath: ['schemes', '0'], value: 'http'}])
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: 'http',
                printablePath: ['schemes', '0'],
                scope: 'schemes',
                severity: 'non-breaking',
                sourceValue: undefined,
                taxonomy: 'schemes.arrayContent.add',
                type: 'arrayContent.add'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there is a deletion in the schemes property content', () => {

        it('should classify the change as a breaking deletion of the schemes property content', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([{originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withEmptySchemes()
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['schemes', '0'],
                scope: 'schemes',
                severity: 'breaking',
                sourceValue: 'http',
                taxonomy: 'schemes.arrayContent.delete',
                type: 'arrayContent.delete'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when the schemes property is added altogether', () => {

        it('should classify the change as a breaking addition of the schemes property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withNoSchemes()
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'https'}])
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: [{originalPath: ['schemes', '0'], value: 'https'}],
                printablePath: ['schemes'],
                scope: 'schemes',
                severity: 'breaking',
                sourceValue: undefined,
                taxonomy: 'schemes.add',
                type: 'add'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when the schemes property is removed altogether', () => {

        it('should classify the change as a breaking deletion of the schemes property', () => {

            const parsedSourceSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const parsedDestinationSpec = parsedSpecBuilder
                .withNoSchemes()
                .build();

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['schemes'],
                scope: 'schemes',
                severity: 'breaking',
                sourceValue: [{originalPath: ['schemes', '0'], value: 'http'}],
                taxonomy: 'schemes.delete',
                type: 'delete'
            };
            expect(result).toEqual([expectedDiffEntry]);
        });
    });

    describe('when there are multiple changes in the schemes property content', () => {

        it('should detect two non-breaking additions and one breaking deletion in schemes', () => {

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

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            const expectedDiffEntry1: DiffEntry = {
                destinationValue: 'ws',
                printablePath: ['schemes', '1'],
                scope: 'schemes',
                severity: 'non-breaking',
                sourceValue: undefined,
                taxonomy: 'schemes.arrayContent.add',
                type: 'arrayContent.add'
            };
            const expectedDiffEntry2: DiffEntry = {
                destinationValue: 'wss',
                printablePath: ['schemes', '2'],
                scope: 'schemes',
                severity: 'non-breaking',
                sourceValue: undefined,
                taxonomy: 'schemes.arrayContent.add',
                type: 'arrayContent.add'
            };
            const expectedDiffEntry3: DiffEntry = {
                destinationValue: undefined,
                printablePath: ['schemes', '1'],
                scope: 'schemes',
                severity: 'breaking',
                sourceValue: 'https',
                taxonomy: 'schemes.arrayContent.delete',
                type: 'arrayContent.delete'
            };

            expect(result).toEqual([expectedDiffEntry1, expectedDiffEntry2, expectedDiffEntry3]);
        });
    });

    describe('when the schemes content is shuffled but the elements are the same', () => {

        it('should detect no changes', () => {

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

            const result = specDiffer.diff(parsedSourceSpec, parsedDestinationSpec);

            expect(result.length).toEqual(0);
        });
    });
});
