import specDiffer from '../../../lib/openapi-diff/spec-differ';
import {
    Diff, OpenAPI3Spec,
    ParsedSpec, Swagger2Spec
} from '../../../lib/openapi-diff/types';

const buildSimpleSwaggerSpecWithVersion = (version: string): Swagger2Spec => {
    const spec = {
        info: {
            title: 'spec title',
            version: 'version'
        },
        swagger: version
    };
    return spec;
};

const buildSimpleOpenApiSpecWithVersion = (version: string): OpenAPI3Spec => {
    const spec = {
        info: {
            title: 'spec title',
            version: 'version'
        },
        openapi: version
    };
    return spec;
};

const buildSimpleParsedSpecWithVersion = (version: string): ParsedSpec => {
    const spec = {
        info: {
            title: 'spec title',
            version: 'version'
        },
        openapi: version
    };
    return spec;
};

describe('specDiffer', () => {

    describe('when there is a change in the openapi property', () => {

        describe('generically', () => {

            it('should classify the change as non-breaking', () => {
                const oldSpec: Swagger2Spec = buildSimpleSwaggerSpecWithVersion('2.0');
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('2.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('2.1');

                const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
                expect(result.breakingChanges.length).toEqual(0);
                expect(result.unclassifiedChanges.length).toEqual(0);
                expect(result.nonBreakingChanges.length).toBe(1);
                expect(result.nonBreakingChanges[0].type).toEqual('non-breaking');
            });

            it('should populate the taxonomy of the change as an edition', () => {
                const oldSpec: Swagger2Spec = buildSimpleSwaggerSpecWithVersion('2.0');
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('2.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('2.1');

                const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
                expect(result.nonBreakingChanges[0].taxonomy).toEqual('openapi.property.edit');
            });

            it('should copy the rest of the individual diff attributes across', () => {
                const oldSpec: Swagger2Spec = buildSimpleSwaggerSpecWithVersion('2.0');
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('2.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('2.1');

                const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
                expect(result.nonBreakingChanges[0].lhs).toEqual('2.0');
                expect(result.nonBreakingChanges[0].rhs).toEqual('2.1');
                expect(result.nonBreakingChanges[0].index).toBeNull();
                expect(result.nonBreakingChanges[0].item).toBeNull();
            });
        });

        describe('from a Swagger 2.0 spec', () => {

            it('should populate the paths of the change with the original swagger path and the diff one', () => {
                const oldSpec: Swagger2Spec = buildSimpleSwaggerSpecWithVersion('2.0');
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('2.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('2.1');

                const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
                expect(result.nonBreakingChanges[0].path[0]).toEqual('openapi');
                expect(result.nonBreakingChanges[0].printablePath[0]).toEqual('swagger');
            });
        });

        describe('from an OpenApi 3.0 spec', () => {

            it('should populate the paths of the change with the original swagger path and the diff one', () => {
                const oldSpec: OpenAPI3Spec = buildSimpleOpenApiSpecWithVersion('3.0.0');
                const oldParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('3.0.0');
                const newParsedSpec: ParsedSpec = buildSimpleParsedSpecWithVersion('3.0.1');

                const result: Diff = specDiffer.diff(oldSpec, oldParsedSpec, newParsedSpec);
                expect(result.nonBreakingChanges[0].path[0]).toEqual('openapi');
                expect(result.nonBreakingChanges[0].printablePath[0]).toEqual('openapi');
            });
        });
    });
});
