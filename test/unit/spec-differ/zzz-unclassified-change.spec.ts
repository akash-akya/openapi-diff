// TODO: remove zzz

import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {
    Diff, OpenAPI3Spec,
    ParsedSpec
} from '../../../lib/openapi-diff/types';

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

describe('specDiffer', () => {

    describe('when there is a change in an ^x- property at the top level object', () => {

        let oldSpec: OpenAPI3Spec;
        let oldParsedSpec: ParsedSpec;
        let newParsedSpec: ParsedSpec;

        beforeEach(() => {
            oldSpec = buildSimpleOpenApiSpecWithTopLevelXProperty();
            oldParsedSpec = buildSimpleParsedSpecWithTopLevelXProperty();
            newParsedSpec = buildSimpleParsedSpecWithTopLevelXProperty();
            newParsedSpec['x-external-id'] = 'NEW x value';
        });

        it('should classify the change in the x-property as unclassified', () => {
            const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.nonBreakingChanges.length).toBe(0);
            expect(result.unclassifiedChanges.length).toEqual(1);
            expect(result.unclassifiedChanges[0].type).toEqual('unclassified');
        });

        it('should populate the taxonomy of the change at the top level object as unclassified', () => {
            const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
            expect(result.unclassifiedChanges[0].taxonomy).toEqual('zzz.unclassified.change');
        });

        it('should populate the path of a single change in the info object correctly', () => {
            const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
            expect(result.unclassifiedChanges[0].path[0]).toEqual('x-external-id');
            expect(result.unclassifiedChanges[0].printablePath[0]).toEqual('x-external-id');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
            expect(result.unclassifiedChanges[0].lhs).toEqual('x value');
            expect(result.unclassifiedChanges[0].rhs).toEqual('NEW x value');
            expect(result.unclassifiedChanges[0].index).toBeNull();
            expect(result.unclassifiedChanges[0].item).toBeNull();
        });
    });

    describe('when there is a change in an ^x- property in the info object', () => {

        let oldSpec: OpenAPI3Spec;
        let oldParsedSpec: ParsedSpec;
        let newParsedSpec: ParsedSpec;

        beforeEach(() => {
            oldSpec = buildOpenApiSpecWithInfoLevelXProperty();
            oldParsedSpec = buildParsedSpecWithInfoLevelXProperty();
            newParsedSpec = buildParsedSpecWithInfoLevelXProperty();
            newParsedSpec.info['x-external-id'] = 'NEW x value';
        });

        it('should classify a change in an x-property in the info object as unclassified', () => {
            const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
            expect(result.breakingChanges.length).toEqual(0);
            expect(result.nonBreakingChanges.length).toBe(0);
            expect(result.unclassifiedChanges.length).toEqual(1);
            expect(result.unclassifiedChanges[0].type).toEqual('unclassified');
        });

        it('should populate the taxonomy of a single change in the info object as unclassified', () => {
            const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
            expect(result.unclassifiedChanges[0].taxonomy).toEqual('zzz.unclassified.change');
        });

        it('should populate the paths of a single change in the info object correctly', () => {
            const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
            expect(result.unclassifiedChanges[0].path[0]).toEqual('info');
            expect(result.unclassifiedChanges[0].path[1]).toEqual('x-external-id');
            expect(result.unclassifiedChanges[0].printablePath[0]).toEqual('info');
            expect(result.unclassifiedChanges[0].printablePath[1]).toEqual('x-external-id');
        });

        it('should copy the rest of the individual diff attributes across', () => {
            const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
            expect(result.unclassifiedChanges[0].lhs).toEqual('x value');
            expect(result.unclassifiedChanges[0].rhs).toEqual('NEW x value');
            expect(result.unclassifiedChanges[0].index).toBeNull();
            expect(result.unclassifiedChanges[0].item).toBeNull();
        });
    });
});
