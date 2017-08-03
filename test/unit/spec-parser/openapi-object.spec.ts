import specParser from '../../../lib/openapi-diff/spec-parser';

import { OpenAPIObject } from 'openapi3-ts';
import { Spec } from 'swagger-schema-official';

import { ParsedSpec } from '../../../lib/openapi-diff/types';

let resultingSpec: ParsedSpec;

describe('specParser, with regards to the swagger/openapi object,', () => {

    const buildSimpleSwagger2Spec = (): Spec => {
        const spec = {
            info: {
                title: 'spec title',
                version: 'spec version'
            },
            paths: {},
            swagger: '2.0'
        };
        return spec;
    };

    const buildSimpleOpenApi3Spec = (): OpenAPIObject => {
        const spec = {
            components: {
                callbacks: {},
                examples: {},
                headers: {},
                links: {},
                parameters: {},
                paths: {},
                requestBodies: {},
                responses: {},
                schemas: {},
                securitySchemes: {}
            },
            info: {
                title: 'spec title',
                version: 'spec version'
            },
            openapi: '3.0.0',
            paths: {}
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
