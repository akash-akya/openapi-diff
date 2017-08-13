import specDiffer from '../../../lib/openapi-diff/spec-differ';
import parsedSpecBuilder from '../support/parsed-spec-builder';

describe('specDiffer', () => {

    describe('when there is a single edition in the schemes property content', () => {
        it('should classify the changes as a breaking deletion and a non-breaking addition in schemes', () => {
            const oldParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'schema'}]).build();
            const newParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'secure schema'}]).build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual({
                newValue: 'secure schema',
                oldValue: undefined,
                printablePath: ['schemes', '0'],
                scope: 'schemes.property',
                severity: 'non-breaking',
                taxonomy: 'schemes.property.arrayContent.add',
                type: 'arrayContent.add'
            });
            expect(result[1]).toEqual({
                newValue: undefined,
                oldValue: 'schema',
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
                .withSchemes([{originalPath: ['schemes', '0'], value: 'schema'}])
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: 'schema',
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
                .withSchemes([{originalPath: ['schemes', '0'], value: 'schema'}])
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withEmptySchemes()
                .build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue: 'schema',
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
                {originalPath: ['schemes', '0'], value: 'NEW schema'}]).build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: [{ originalPath: [ 'schemes', '0' ], value: 'NEW schema' }],
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
                {originalPath: ['schemes', '0'], value: 'schema'}]).build();
            const newParsedSpec = parsedSpecBuilder.withNoSchemes().build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual({
                newValue: undefined,
                oldValue:  [{ originalPath: [ 'schemes', '0' ], value: 'schema' }],
                printablePath: ['schemes'],
                scope: 'schemes.property',
                severity: 'breaking',
                taxonomy: 'schemes.property.delete',
                type: 'delete'
            });
        });
    });

    describe('when there are multiple changes in the schemes property content', () => {
        it('should detect three non-breaking additions and two breaking deletions in schemes', () => {
            const oldParsedSpec = parsedSpecBuilder.withSchemes([
                {originalPath: ['schemes', '0'], value: 'schema one'},
                {originalPath: ['schemes', '1'], value: 'schema two'},
                {originalPath: ['schemes', '2'], value: 'schema three'}
            ]).build();
            const newParsedSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'schema one'},
                    {originalPath: ['schemes', '1'], value: 'three'},
                    {originalPath: ['schemes', '2'], value: 'schema four'},
                    {originalPath: ['schemes', '3'], value: 'schema five'}
                ]).build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(5);
            expect(result[0]).toEqual({
                newValue: 'three',
                oldValue: undefined,
                printablePath: ['schemes', '1'],
                scope: 'schemes.property',
                severity: 'non-breaking',
                taxonomy: 'schemes.property.arrayContent.add',
                type: 'arrayContent.add'
            });
            expect(result[1]).toEqual({
                newValue: 'schema four',
                oldValue: undefined,
                printablePath: ['schemes', '2'],
                scope: 'schemes.property',
                severity: 'non-breaking',
                taxonomy: 'schemes.property.arrayContent.add',
                type: 'arrayContent.add'
            });
            expect(result[2]).toEqual({
                newValue: 'schema five',
                oldValue: undefined,
                printablePath: ['schemes', '3'],
                scope: 'schemes.property',
                severity: 'non-breaking',
                taxonomy: 'schemes.property.arrayContent.add',
                type: 'arrayContent.add'
            });
            expect(result[3]).toEqual({
                newValue: undefined,
                oldValue: 'schema two',
                printablePath: ['schemes', '1'],
                scope: 'schemes.property',
                severity: 'breaking',
                taxonomy: 'schemes.property.arrayContent.delete',
                type: 'arrayContent.delete'
            });
            expect(result[4]).toEqual({
                newValue: undefined,
                oldValue: 'schema three',
                printablePath: ['schemes', '2'],
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
                {originalPath: ['schemes', '0'], value: 'schema one'},
                {originalPath: ['schemes', '1'], value: 'schema two'},
                {originalPath: ['schemes', '2'], value: 'schema three'}
            ]).build();
            const newParsedSpec = parsedSpecBuilder
                .withSchemes([
                    {originalPath: ['schemes', '0'], value: 'schema two'},
                    {originalPath: ['schemes', '1'], value: 'schema three'},
                    {originalPath: ['schemes', '2'], value: 'schema one'}
                ]).build();

            const result = specDiffer.diff(oldParsedSpec, newParsedSpec);

            expect(result.length).toEqual(0);
        });
    });
});
