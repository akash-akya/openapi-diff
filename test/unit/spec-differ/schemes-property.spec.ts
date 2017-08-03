import specDiffer from '../../../lib/openapi-diff/spec-differ';

import {
    DiffChange,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

let results: DiffChange[];

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

    describe('when there is a single edition in the schemes property content', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = ['schema'];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = ['secure schema'];
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the edition of an element in the schemes property content as breaking', () => {
            expect(results.length).toEqual(1);
            expect(results[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(results[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as an edition', () => {
            expect(results[0].taxonomy).toEqual('schemes.property.edit');
            expect(results[0].type).toEqual('edit');
        });

        it('should populate the paths of an added schemes property correctly', () => {
            expect(results[0].path[0]).toEqual('schemes');
            expect(results[0].path[1].toString()).toEqual('0');
            expect(results[0].printablePath[0]).toEqual('schemes');
            expect(results[0].printablePath[1].toString()).toEqual('0');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toBe('schema');
            expect(results[0].rhs).toEqual('secure schema');
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
            expect(results[0].kind).toEqual('E');
        });
    });

    describe('when there is an addition in the schemes property content', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = [];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = ['schema'];
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the addition of an element in the schemes property content as non-breaking', () => {
            expect(results.length).toEqual(1);
            expect(results[0].severity).toEqual('non-breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(results[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as an addition', () => {
            expect(results[0].taxonomy).toEqual('schemes.property.arrayContent.add');
            expect(results[0].type).toEqual('arrayContent.add');
        });

        it('should populate the paths of an added schemes property correctly', () => {
            expect(results[0].path[0]).toEqual('schemes');
            expect(results[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toBeNull();
            expect(results[0].rhs).toEqual('schema');
            expect(results[0].index).toEqual(0);
            expect(results[0].item).toEqual(jasmine.objectContaining({ kind: 'N' }));
            expect(results[0].item).toEqual(jasmine.objectContaining({ rhs: 'schema' }));
            expect(results[0].kind).toEqual('A');
        });
    });

    describe('when there is an deletion in the schemes property content', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = ['schema'];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = [];
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the deletion of an element in the schemes property content as breaking', () => {
            expect(results.length).toEqual(1);
            expect(results[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(results[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as a deletion', () => {
            expect(results[0].taxonomy).toEqual('schemes.property.arrayContent.delete');
            expect(results[0].type).toEqual('arrayContent.delete');
        });

        it('should populate the paths of an added schemes property correctly', () => {
            expect(results[0].path[0]).toEqual('schemes');
            expect(results[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toEqual('schema');
            expect(results[0].rhs).toBeNull();
            expect(results[0].index).toEqual(0);
            expect(results[0].item).toEqual(jasmine.objectContaining({ kind: 'D' }));
            expect(results[0].item).toEqual(jasmine.objectContaining({ lhs: 'schema' }));
            expect(results[0].kind).toEqual('A');
        });
    });

    describe('when the schemes property is added altogether', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = ['NEW schema'];
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the addition of the schemes property as breaking', () => {
            expect(results.length).toEqual(1);
            expect(results[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(results[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as an addition', () => {
            expect(results[0].taxonomy).toEqual('schemes.property.add');
            expect(results[0].type).toEqual('add');
        });

        it('should populate the paths of an added schemes property correctly', () => {
            expect(results[0].path[0]).toEqual('schemes');
            expect(results[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toBeNull();
            expect(results[0].rhs).toEqual(['NEW schema']);
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
            expect(results[0].kind).toEqual('N');
        });
    });

    describe('when the schemes property is removed altogether', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = ['schema'];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the removal of the schemes property as breaking', () => {
            expect(results.length).toEqual(1);
            expect(results[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the schemes property', () => {
            expect(results[0].scope).toEqual('schemes.property');
        });

        it('should populate the taxonomy and type of a new schemes property as an deletion', () => {
            expect(results[0].taxonomy).toEqual('schemes.property.delete');
            expect(results[0].type).toEqual('delete');
        });

        it('should populate the paths of a deleted schemes property correctly', () => {
            expect(results[0].path[0]).toEqual('schemes');
            expect(results[0].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toEqual(['schema']);
            expect(results[0].rhs).toBeNull();
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
            expect(results[0].kind).toEqual('D');
        });
    });

    describe('when there are multiple changes in the schemes property content', () => {
        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutSchemesProperty();
            oldParsedSpec.schemes = ['schema one', 'schema two', 'schema three'];
            const newParsedSpec = buildParsedSpecWithoutSchemesProperty();
            newParsedSpec.schemes = ['schema one', 'three', 'schema four', 'schema five'];
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should detect the right amount of changes', () => {
            expect(results.length).toEqual(3);
        });

        it('should classify the first change (edition of schemes member) as breaking', () => {
            expect(results[0].severity).toEqual('breaking');
        });

        it('should populate the taxonomy and type of the change (edition of schemes member) as an edition', () => {
            expect(results[0].taxonomy).toEqual('schemes.property.edit');
            expect(results[0].type).toEqual('edit');
        });

        it('should populate the paths of the change (edition of schemes member) correctly', () => {
            expect(results[0].path[0]).toEqual('schemes');
            expect(results[0].path[1].toString()).toEqual('1');
            expect(results[0].printablePath[0]).toEqual('schemes');
            expect(results[0].printablePath[1].toString()).toEqual('1');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toBe('schema two');
            expect(results[0].rhs).toEqual('three');
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
            expect(results[0].kind).toEqual('E');
        });

        it('should classify the second change (edition of schemes member) as breaking', () => {
            expect(results[1].severity).toEqual('breaking');
        });

        it('should populate the taxonomy and type of the change (edition of schemes member) as an edition', () => {
            expect(results[1].taxonomy).toEqual('schemes.property.edit');
            expect(results[1].type).toEqual('edit');
        });

        it('should populate the paths of the change (edition of schemes member) correctly', () => {
            expect(results[1].path[0]).toEqual('schemes');
            expect(results[1].path[1].toString()).toEqual('2');
            expect(results[1].printablePath[0]).toEqual('schemes');
            expect(results[1].printablePath[1].toString()).toEqual('2');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[1].lhs).toBe('schema three');
            expect(results[1].rhs).toEqual('schema four');
            expect(results[1].index).toBeNull();
            expect(results[1].item).toBeNull();
            expect(results[1].kind).toEqual('E');
        });

        it('should classify the third change (new schemes member) as non-breaking', () => {
            expect(results[2].severity).toEqual('non-breaking');
        });

        it('should populate the taxonomy and type of the change (new schemes member) as an addition', () => {
            expect(results[2].taxonomy).toEqual('schemes.property.arrayContent.add');
            expect(results[2].type).toEqual('arrayContent.add');
        });

        it('should populate the paths of the change (new schemes member) correctly', () => {
            expect(results[2].path[0]).toEqual('schemes');
            expect(results[2].printablePath[0]).toEqual('schemes');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[2].lhs).toBeNull();
            expect(results[2].rhs).toEqual('schema five');
            expect(results[2].index).toEqual(3);
            expect(results[2].item).toEqual(jasmine.objectContaining({ kind: 'N' }));
            expect(results[2].item).toEqual(jasmine.objectContaining({ rhs: 'schema five' }));
            expect(results[2].kind).toEqual('A');
        });

        it('should locate the scope of all the changes in the schemes property', () => {
            expect(results[0].scope).toEqual('schemes.property');
            expect(results[1].scope).toEqual('schemes.property');
            expect(results[2].scope).toEqual('schemes.property');
        });
    });
});
