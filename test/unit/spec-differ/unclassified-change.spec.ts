import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {
    DiffChange,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

describe('specDiffer', () => {

    let results: DiffChange[];

    describe('when there is a change in an ^x- property at the top level object', () => {

        const buildSimpleParsedSpecWithTopLevelXProperty = (): ParsedSpec => {
            const spec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                openapi: {
                    originalPath: ['openapi'],
                    parsedValue: '3.0.0'
                },
                'x-external-id': 'x value'
            };
            return spec;
        };

        beforeEach(() => {
            const oldParsedSpec = buildSimpleParsedSpecWithTopLevelXProperty();
            const newParsedSpec = buildSimpleParsedSpecWithTopLevelXProperty();
            newParsedSpec['x-external-id'] = 'NEW x value';
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
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
        });
    });

    describe('when there is a change in an ^x- property in the info object', () => {

        const buildParsedSpecWithInfoLevelXProperty = (): ParsedSpec => {
            const spec = {
                info: {
                    contact: {
                        email: 'contact email',
                        name: 'contact name',
                        url: 'contact url'
                    },
                    description: 'spec description',
                    licence: {
                        name: 'licence name',
                        url: 'licence url'
                    },
                    termsOfService: 'terms of service',
                    title: 'spec title',
                    version: 'version',
                    'x-external-id': 'x value'
                },
                openapi: {
                    originalPath: ['openapi'],
                    parsedValue: '3.0.0'
                }
            };
            return spec;
        };

        beforeEach(() => {
            const oldParsedSpec = buildParsedSpecWithInfoLevelXProperty();
            const newParsedSpec = buildParsedSpecWithInfoLevelXProperty();
            newParsedSpec.info['x-external-id'] = 'NEW x value';
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
            expect(results[0].index).toBeNull();
            expect(results[0].item).toBeNull();
        });
    });
});
