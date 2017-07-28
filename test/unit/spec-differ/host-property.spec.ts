import specDiffer from '../../../lib/openapi-diff/spec-differ';

import {
    DiffChange,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

let results: DiffChange[];

describe('specDiffer', () => {

    const buildParsedSpecWithoutHostProperty = (): ParsedSpec => {
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

    describe('when there is an edition in the host property', () => {

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutHostProperty();
            oldParsedSpec.host = 'host info';
            const newParsedSpec = buildParsedSpecWithoutHostProperty();
            newParsedSpec.host = 'NEW host info';
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the edition in the host property as breaking', () => {
            expect(results.length).toEqual(1);
            expect(results[0].changeClass).toEqual('breaking');
        });

        it('should locate the scope of the change in the host property', () => {
            expect(results[0].scope).toEqual('host.property');
        });

        it('should populate the taxonomy and type of a change in the host property as an edition in it', () => {
            expect(results[0].taxonomy).toEqual('host.property.edit');
            expect(results[0].type).toEqual('edit');
        });

        it('should populate the paths of a single change in the host property correctly', () => {
            expect(results[0].path[0]).toEqual('host');
            expect(results[0].printablePath[0]).toEqual('host');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toEqual('host info');
            expect(results[0].rhs).toEqual('NEW host info');
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
        });
    });

    describe('when the host property is added in the new spec', () => {

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutHostProperty();
            const newParsedSpec = buildParsedSpecWithoutHostProperty();
            newParsedSpec.host = 'NEW host info';
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the addition of the host property as breaking', () => {
            expect(results.length).toEqual(1);
            expect(results[0].changeClass).toEqual('breaking');
        });

        it('should locate the scope of the change in the host property', () => {
            expect(results[0].scope).toEqual('host.property');
        });

        it('should populate the taxonomy and type of a new host property as an addition', () => {
            expect(results[0].taxonomy).toEqual('host.property.add');
            expect(results[0].type).toEqual('add');
        });

        it('should populate the paths of an added host property correctly', () => {
            expect(results[0].path[0]).toEqual('host');
            expect(results[0].printablePath[0]).toEqual('host');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toBeUndefined();
            expect(results[0].rhs).toEqual('NEW host info');
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
        });
    });

    describe('when the host property is deleted in the new spec', () => {

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithoutHostProperty();
            oldParsedSpec.host = 'OLD host info';
            const newParsedSpec = buildParsedSpecWithoutHostProperty();
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the addition of the host property as breaking', () => {
            expect(results.length).toEqual(1);
            expect(results[0].changeClass).toEqual('breaking');
        });

        it('should locate the scope of the change in the host property', () => {
            expect(results[0].scope).toEqual('host.property');
        });

        it('should populate the taxonomy and type of a new host property as a deletion', () => {
            expect(results[0].taxonomy).toEqual('host.property.delete');
            expect(results[0].type).toEqual('delete');
        });

        it('should populate the paths of an added host property correctly', () => {
            expect(results[0].path[0]).toEqual('host');
            expect(results[0].printablePath[0]).toEqual('host');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toEqual('OLD host info');
            expect(results[0].rhs).toBeUndefined();
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
        });
    });
});
