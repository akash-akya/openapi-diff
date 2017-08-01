import specDiffer from '../../../lib/openapi-diff/spec-differ';

import {
    DiffChange,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

let result: DiffChange[];

describe('specDiffer', () => {

    const buildParsedSpecWithoutBasePathProperty = (): ParsedSpec => {
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

    describe('when there is an edition in the basePath property', () => {

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutBasePathProperty();
            oldParsedSpec.basePath = 'basePath info';
            const newParsedSpec = buildParsedSpecWithoutBasePathProperty();
            newParsedSpec.basePath = 'NEW basePath info';
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the edition in the basePath property as breaking', () => {
            expect(result.length).toEqual(1);
            expect(result[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the basePath property', () => {
            expect(result[0].scope).toEqual('basePath.property');
        });

        it('should populate the taxonomy and type of a change in the basePath property as an edition in it', () => {
            expect(result[0].taxonomy).toEqual('basePath.property.edit');
            expect(result[0].type).toEqual('edit');
        });

        it('should populate the paths of a single change in the basePath property correctly', () => {
            expect(result[0].path[0]).toEqual('basePath');
            expect(result[0].printablePath[0]).toEqual('basePath');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result[0].lhs).toEqual('basePath info');
            expect(result[0].rhs).toEqual('NEW basePath info');
            expect(result[0].index).toBeNull();
            expect(result[0].item).toBeNull();
        });
    });

    describe('when the basePath property is added in the new spec', () => {

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutBasePathProperty();
            const newParsedSpec = buildParsedSpecWithoutBasePathProperty();
            newParsedSpec.basePath = 'NEW basePath info';
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the addition of the basePath property as breaking', () => {
            expect(result.length).toEqual(1);
            expect(result[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the basePath property', () => {
            expect(result[0].scope).toEqual('basePath.property');
        });

        it('should populate the taxonomy and type of a new basePath property as an addition', () => {
            expect(result[0].taxonomy).toEqual('basePath.property.add');
            expect(result[0].type).toEqual('add');
        });

        it('should populate the paths of an added basePath property correctly', () => {
            expect(result[0].path[0]).toEqual('basePath');
            expect(result[0].printablePath[0]).toEqual('basePath');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result[0].lhs).toBeNull();
            expect(result[0].rhs).toEqual('NEW basePath info');
            expect(result[0].index).toBeNull();
            expect(result[0].item).toBeNull();
        });
    });

    describe('when the basePath property is deleted in the new spec', () => {

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutBasePathProperty();
            oldParsedSpec.basePath = 'OLD basePath info';
            const newParsedSpec = buildParsedSpecWithoutBasePathProperty();
            result = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the addition of the basePath property as breaking', () => {
            expect(result.length).toEqual(1);
            expect(result[0].severity).toEqual('breaking');
        });

        it('should locate the scope of the change in the basePath property', () => {
            expect(result[0].scope).toEqual('basePath.property');
        });

        it('should populate the taxonomy and type of a new basePath property as a deletion', () => {
            expect(result[0].taxonomy).toEqual('basePath.property.delete');
            expect(result[0].type).toEqual('delete');
        });

        it('should populate the paths of an added basePath property correctly', () => {
            expect(result[0].path[0]).toEqual('basePath');
            expect(result[0].printablePath[0]).toEqual('basePath');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result[0].lhs).toEqual('OLD basePath info');
            expect(result[0].rhs).toBeNull();
            expect(result[0].index).toBeNull();
            expect(result[0].item).toBeNull();
        });
    });
});
