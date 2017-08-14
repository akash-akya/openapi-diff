import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder} from '../support/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is a single edition in the schemes property content', () => {

        it('should classify the changes as a breaking deletion and a non-breaking addition in schemes', () => {

            const oldParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'http'}]).build();
            const newParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'https'}]).build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual({
                newValue: 'https',
                oldValue: undefined,
                printablePath: ['schemes', '0'],
                scope: 'schemes.property',
                severity: 'non-breaking',
                taxonomy: 'schemes.property.arrayContent.add',
                type: 'arrayContent.add'
            });
            expect(result[1]).toEqual({
                newValue: undefined,
                oldValue: 'http',
                printablePath: ['schemes', '0'],
                scope: 'schemes.property',
                severity: 'breaking',
                taxonomy: 'schemes.property.arrayContent.delete',
                type: 'arrayContent.delete'
            });
        });
    });

    describe('when there is an addition in the schemes property content', () => {

        it('should classify the change as a non-breaking addition in the schemes property content', () => {

            const oldParsedSpec = parsedSpecBuilder.withEmptySchemes().build();
            const newParsedSpec = parsedSpecBuilder
                .withSchemes([{originalPath: ['schemes', '0'], value: 'http'}])
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'http',
                oldValue: undefined,
                printablePath: ['schemes', '0'],
                scope: 'schemes.property',
                severity: 'non-breaking',
                taxonomy: 'schemes.property.arrayContent.add',
                type: 'arrayContent.add'
            });
        });
    });

    describe('when there is a deletion in the schemes property content', () => {

        it('should classify the change as a breaking deletion of the schemes property content', () => {

            const oldParsedSpec = parsedSpecBuilder
                .withSchemes([{originalPath: ['schemes', '0'], value: 'http'}])
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withEmptySchemes()
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue: 'http',
                printablePath: ['schemes', '0'],
                scope: 'schemes.property',
                severity: 'breaking',
                taxonomy: 'schemes.property.arrayContent.delete',
                type: 'arrayContent.delete'
            });
        });
    });

    describe('when the schemes property is added altogether', () => {

        it('should classify the change as a breaking addition of the schemes property', () => {

            const oldParsedSpec = parsedSpecBuilder.withNoSchemes().build();
            const newParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'https'}]).build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: [{originalPath: ['schemes', '0'], value: 'https'}],
                oldValue: undefined,
                printablePath: ['schemes'],
                scope: 'schemes.property',
                severity: 'breaking',
                taxonomy: 'schemes.property.add',
                type: 'add'
            });
        });
    });

    describe('when the schemes property is removed altogether', () => {

        it('should classify the change as a breaking deletion of the schemes property', () => {

            const oldParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'http'}]).build();
            const newParsedSpec = parsedSpecBuilder.withNoSchemes().build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue: [{originalPath: ['schemes', '0'], value: 'http'}],
                printablePath: ['schemes'],
                scope: 'schemes.property',
                severity: 'breaking',
                taxonomy: 'schemes.property.delete',
                type: 'delete'
            });
        });
    });

    describe('when there are multiple changes in the schemes property content', () => {

        it('should detect two non-breaking additions and one breaking deletion in schemes', () => {

            const oldParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'http'},
                {originalPath: ['schemes', '1'], value: 'https'}
            ]).build();
            const newParsedSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'http'},
                    {originalPath: ['schemes', '1'], value: 'ws'},
                    {originalPath: ['schemes', '2'], value: 'wss'}
                ]).build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(3);
            expect(result[0]).toEqual({
                newValue: 'ws',
                oldValue: undefined,
                printablePath: ['schemes', '1'],
                scope: 'schemes.property',
                severity: 'non-breaking',
                taxonomy: 'schemes.property.arrayContent.add',
                type: 'arrayContent.add'
            });
            expect(result[1]).toEqual({
                newValue: 'wss',
                oldValue: undefined,
                printablePath: ['schemes', '2'],
                scope: 'schemes.property',
                severity: 'non-breaking',
                taxonomy: 'schemes.property.arrayContent.add',
                type: 'arrayContent.add'
            });
            expect(result[2]).toEqual({
                newValue: undefined,
                oldValue: 'https',
                printablePath: ['schemes', '1'],
                scope: 'schemes.property',
                severity: 'breaking',
                taxonomy: 'schemes.property.arrayContent.delete',
                type: 'arrayContent.delete'
            });
        });
    });

    describe('when the schemes content is shuffled but the elements are the same', () => {

        it('should detect no changes', () => {

            const oldParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'http'},
                {originalPath: ['schemes', '1'], value: 'https'},
                {originalPath: ['schemes', '2'], value: 'ws'}
            ]).build();
            const newParsedSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'https'},
                    {originalPath: ['schemes', '1'], value: 'ws'},
                    {originalPath: ['schemes', '2'], value: 'http'}
                ]).build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(0);
        });
    });
});
