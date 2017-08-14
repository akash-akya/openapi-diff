import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {parsedSpecBuilder, parsedSpecInfoBuilder} from '../support/parsed-spec-builder';

describe('specDiffer', () => {

    let results: any[];

    describe('when there is a change in an ^x- property at the top level object', () => {
        beforeEach(() => {
            const oldParsedSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'x value'
                })
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withTopLevelXProperty({
                    name: 'x-external-id',
                    originalPath: ['x-external-id'],
                    value: 'NEW x value'
                })
                .build();
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify the change in the x-property as unclassified', () => {
            expect(results.length).toEqual(1);
            expect(results[0].severity).toEqual('unclassified');
        });

        it('should mark the scope of the changes as unclassified', () => {
            expect(results[0].scope).toEqual('unclassified.change');
        });

        it('should populate the taxonomy and type of the change at the top level object as unclassified edit', () => {
            expect(results[0].taxonomy).toEqual('unclassified.change');
            expect(results[0].type).toEqual('edit');
        });

        it('should populate the path of a single change in the info object correctly', () => {
            expect(results[0].path[0]).toEqual('x-external-id');
            expect(results[0].printablePath[0]).toEqual('x-external-id');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toEqual('x value');
            expect(results[0].rhs).toEqual('NEW x value');
            expect(results[0].index).toBeUndefined();
            expect(results[0].item).toBeUndefined();
            expect(results[0].kind).toEqual('E');
        });
    });

    describe('when there is a change in an ^x- property in the info object', () => {
        beforeEach(() => {
            const oldParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder.withXProperty('x-external-id', 'x value'))
                .build();
            const newParsedSpec = parsedSpecBuilder
                .withInfoObject(parsedSpecInfoBuilder.withXProperty('x-external-id', 'NEW x value'))
                .build();
            results = specDiffer.diff(oldParsedSpec, newParsedSpec);
        });

        it('should classify a change in an x-property in the info object as unclassified', () => {
            expect(results.length).toEqual(1);
            expect(results[0].severity).toEqual('unclassified');
        });

        it('should mark the scope of the changes as unclassified', () => {
            expect(results[0].scope).toEqual('unclassified.change');
        });

        it('should populate the taxonomy and type of a single change in the info object as unclassified edit', () => {
            expect(results[0].taxonomy).toEqual('unclassified.change');
            expect(results[0].type).toEqual('edit');
        });

        it('should populate the paths of a single change in the info object correctly', () => {
            expect(results[0].path[0]).toEqual('info');
            expect(results[0].path[1]).toEqual('x-external-id');
            expect(results[0].printablePath[0]).toEqual('info');
            expect(results[0].printablePath[1]).toEqual('x-external-id');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(results[0].lhs).toEqual('x value');
            expect(results[0].rhs).toEqual('NEW x value');
            expect(results[0].index).toBeUndefined();
            expect(results[0].item).toBeUndefined();
            expect(results[0].kind).toEqual('E');
        });
    });
});
