import specParser from '../../../lib/openapi-diff/spec-parser';

import {
    OpenAPI3Spec,
    ParsedSpec,
    Swagger2Spec
} from '../../../lib/openapi-diff/types';

let resultingSpec: ParsedSpec;

describe('specParser, with regards to the swagger/openapi object,', () => {

    const buildSimpleSwagger2Spec = (): Swagger2Spec => {
        const spec = {
            info: {
                title: 'spec title',
                version: 'spec version'
            },
            swagger: '2.0'
        };
        return spec;
    };

    const buildSimpleOpenApi3Spec = (): OpenAPI3Spec => {
        const spec = {
            info: {
                title: 'spec title',
                version: 'spec version'
            },
            openapi: '3.0.0'
        };
        return spec;
    };

    describe('when the input spec is in Swagger 2.0 format', () => {

        beforeEach(() => {
            const originalSpec = buildSimpleSwagger2Spec();
            resultingSpec = specParser.parse(originalSpec);
        });

        it('should generate a parsed spec with an openapi object', () => {
            expect(resultingSpec.openapi).toBeDefined();
        });

        it('should generate a parsed spec copying across the value of the swagger property', () => {
            expect(resultingSpec.openapi.parsedValue).toEqual('2.0');
        });

        it('should generate a parsed spec preserving the original path of the swagger property', () => {
            expect(resultingSpec.openapi.originalPath).toEqual(['swagger']);
        });
    });

    describe('when the input spec is in OpenApi 3.0 format', () => {

        beforeEach(() => {
            const originalSpec = buildSimpleOpenApi3Spec();
            resultingSpec = specParser.parse(originalSpec);
        });

        it('should generate a parsed spec with an openapi object', () => {
            expect(resultingSpec.openapi).toBeDefined();
        });

        it('should generate a parsed spec copying across the value of the openapi property', () => {
            expect(resultingSpec.openapi.parsedValue).toEqual('3.0.0');
        });

        it('should generate a parsed spec preserving the original path of the openapi property', () => {
            expect(resultingSpec.openapi.originalPath).toEqual(['openapi']);
        });
    });
});
