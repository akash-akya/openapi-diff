import specDiffer from '../../../lib/openapi-diff/spec-differ';

import {
    DiffChange,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

let result: DiffChange[];

describe('specDiffer', () => {

    const buildParsedSpecWithoutSchemesProperty = (): ParsedSpec => {
        const spec = {
            info: {
                title: 'spec title',
                version: 'version'
            },
            openapi: {
                originalPath: ['swagger'],
                parsedValue: '2.0'
            }
        };
        return spec;
    };

    describe('when there is an edition in the schemes property content', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = ['schema'];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = ['secure schema'];
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the edition of an element in the schemes property content as breaking', () => {
            expect(result.length).toEqual(1);
            expect(result[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(result[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as an edition', () => {
            expect(result[0].taxonomy).toEqual('schemes.property.edit');
            expect(result[0].type).toEqual('edit');
        });

        it('should populate the paths of an added schemes property correctly', () => {
            expect(result[0].path[0]).toEqual('schemes');
            expect(result[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result[0].lhs).toBe('schema');
            expect(result[0].rhs).toEqual('secure schema');
            expect(result[0].index).toBeNull();
            expect(result[0].item).toBeNull();
            expect(result[0].kind).toEqual('E');
        });
    });

    describe('when there is an addition in the schemes property content', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = [];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = ['schema'];
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the addition of an element in the schemes property content as non-breaking', () => {
            expect(result.length).toEqual(1);
            expect(result[0].severity).toEqual('non-breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(result[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as an addition', () => {
            expect(result[0].taxonomy).toEqual('schemes.property.arrayContent.add');
            expect(result[0].type).toEqual('arrayContent.add');
        });

        it('should populate the paths of an added schemes property correctly', () => {
            expect(result[0].path[0]).toEqual('schemes');
            expect(result[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result[0].lhs).toBeNull();
            expect(result[0].rhs).toEqual('schema');
            expect(result[0].index).toEqual(0);
            expect(result[0].item).toEqual(jasmine.objectContaining({ kind: 'N' }));
            expect(result[0].item).toEqual(jasmine.objectContaining({ rhs: 'schema' }));
            expect(result[0].kind).toEqual('A');
        });
    });

    describe('when there is an deletion in the schemes property content', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = ['schema'];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = [];
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the deletion of an element in the schemes property content as breaking', () => {
            expect(result.length).toEqual(1);
            expect(result[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(result[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as a deletion', () => {
            expect(result[0].taxonomy).toEqual('schemes.property.arrayContent.delete');
            expect(result[0].type).toEqual('arrayContent.delete');
        });

        it('should populate the paths of an added schemes property correctly', () => {
            expect(result[0].path[0]).toEqual('schemes');
            expect(result[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result[0].lhs).toEqual('schema');
            expect(result[0].rhs).toBeNull();
            expect(result[0].index).toEqual(0);
            expect(result[0].item).toEqual(jasmine.objectContaining({ kind: 'D' }));
            expect(result[0].item).toEqual(jasmine.objectContaining({ lhs: 'schema' }));
            expect(result[0].kind).toEqual('A');
        });
    });

    describe('when the schemes property is added altogether', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = ['NEW schema'];
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the addition of the schemes property as breaking', () => {
            expect(result.length).toEqual(1);
            expect(result[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(result[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as an addition', () => {
            expect(result[0].taxonomy).toEqual('schemes.property.add');
            expect(result[0].type).toEqual('add');
        });

        it('should populate the paths of an added schemes property correctly', () => {
            expect(result[0].path[0]).toEqual('schemes');
            expect(result[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result[0].lhs).toBeNull();
            expect(result[0].rhs).toEqual(['NEW schema']);
            expect(result[0].index).toBeNull();
            expect(result[0].item).toBeNull();
            expect(result[0].kind).toEqual('N');
        });
    });

    describe('when the schemes property is removed altogether', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = ['schema'];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the removal of the schemes property as breaking', () => {
            expect(result.length).toEqual(1);
            expect(result[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(result[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as an deletion', () => {
            expect(result[0].taxonomy).toEqual('schemes.property.delete');
            expect(result[0].type).toEqual('delete');
        });

        it('should populate the paths of a deleted schemes property correctly', () => {
            expect(result[0].path[0]).toEqual('schemes');
            expect(result[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result[0].lhs).toEqual(['schema']);
            expect(result[0].rhs).toBeNull();
            expect(result[0].index).toBeNull();
            expect(result[0].item).toBeNull();
            expect(result[0].kind).toEqual('D');
        });
    });
});
