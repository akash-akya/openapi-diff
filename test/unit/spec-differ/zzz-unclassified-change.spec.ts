// TODO: remove zzz

import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {
    Diff, OpenAPI3Spec,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

describe('specDiffer', () => {

    let result: Diff;

    describe('when there is a change in an ^x- property at the top level object', () => {

        const buildSimpleOpenApiSpecWithTopLevelXProperty = (): OpenAPI3Spec => {
            const spec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                openapi: '3.0.0',
                'x-external-id': 'x value'
            };
            return spec;
        };

        const buildSimpleParsedSpecWithTopLevelXProperty = (): ParsedSpec => {
            const spec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                openapi: '3.0.0',
                'x-external-id': 'x value'
            };
            return spec;
        };

        beforeEach(() => {
            const oldSpec = buildSimpleOpenApiSpecWithTopLevelXProperty();
            const oldParsedSpec = buildSimpleParsedSpecWithTopLevelXProperty();
            const newParsedSpec = buildSimpleParsedSpecWithTopLevelXProperty();
            newParsedSpec['x-external-id'] = 'NEW x value';
            result = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
        });

        it('should classify the change in the x-property as unclassified', () => {
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.nonBreakingChanges.length).toBe(0);
            expect(result.unclassifiedChanges.length).toEqual(1);
            expect(result.unclassifiedChanges[0].type).toEqual('unclassified');
        });

        it('should populate the taxonomy of the change at the top level object as unclassified', () => {
            expect(result.unclassifiedChanges[0].taxonomy).toEqual('zzz.unclassified.change');
        });

        it('should populate the path of a single change in the info object correctly', () => {
            expect(result.unclassifiedChanges[0].path[0]).toEqual('x-external-id');
            expect(result.unclassifiedChanges[0].printablePath[0]).toEqual('x-external-id');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result.unclassifiedChanges[0].lhs).toEqual('x value');
            expect(result.unclassifiedChanges[0].rhs).toEqual('NEW x value');
            expect(result.unclassifiedChanges[0].index).toBeNull();
            expect(result.unclassifiedChanges[0].item).toBeNull();
        });
    });

    describe('when there is a change in an ^x- property in the info object', () => {

        const buildOpenApiSpecWithInfoLevelXProperty = (): OpenAPI3Spec => {
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
                openapi: '3.0.0'
            };
            return spec;
        };

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
                openapi: '3.0.0'
            };
            return spec;
        };

        beforeEach(() => {
            const oldSpec = buildOpenApiSpecWithInfoLevelXProperty();
            const oldParsedSpec = buildParsedSpecWithInfoLevelXProperty();
            const newParsedSpec = buildParsedSpecWithInfoLevelXProperty();
            newParsedSpec.info['x-external-id'] = 'NEW x value';
            result = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
        });

        it('should classify a change in an x-property in the info object as unclassified', () => {
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.nonBreakingChanges.length).toBe(0);
            expect(result.unclassifiedChanges.length).toEqual(1);
            expect(result.unclassifiedChanges[0].type).toEqual('unclassified');
        });

        it('should populate the taxonomy of a single change in the info object as unclassified', () => {
            expect(result.unclassifiedChanges[0].taxonomy).toEqual('zzz.unclassified.change');
        });

        it('should populate the paths of a single change in the info object correctly', () => {
            expect(result.unclassifiedChanges[0].path[0]).toEqual('info');
            expect(result.unclassifiedChanges[0].path[1]).toEqual('x-external-id');
            expect(result.unclassifiedChanges[0].printablePath[0]).toEqual('info');
            expect(result.unclassifiedChanges[0].printablePath[1]).toEqual('x-external-id');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            expect(result.unclassifiedChanges[0].lhs).toEqual('x value');
            expect(result.unclassifiedChanges[0].rhs).toEqual('NEW x value');
            expect(result.unclassifiedChanges[0].index).toBeNull();
            expect(result.unclassifiedChanges[0].item).toBeNull();
        });
    });
});
