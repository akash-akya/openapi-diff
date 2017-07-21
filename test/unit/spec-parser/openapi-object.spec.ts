import specParser from '../../../lib/openapi-diff/spec-parser';

import {
    OpenAPI3Spec,
    ParsedSpec,
    Swagger2Spec
} from '../../../lib/openapi-diff/types';

describe('specParser, with regards to the swagger/openapi object,', () => {

    describe('when the input spec is in Swagger 2.0 format', () => {

        it('should generate a parsed spec with an openapi object', () => {

            const originalSpec: Swagger2Spec = {
                info: {
                    title: 'spec title',
                    version: 'spec version'
                },
                swagger: '2.0'
            };

            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec.openapi).toBeDefined();
        });

        it('should generate a parsed spec copying across the value of the swagger property', () => {
            const originalSpec: Swagger2Spec = {
                info: {
                    title: 'spec title',
                    version: 'spec version'
                },
                swagger: '2.0'
            };

            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec.openapi).toEqual('2.0');
        });
    });

    describe('when the input spec is in OpenApi 3.0 format', () => {

        it('should generate a parsed spec with an openapi object', () => {

            const originalSpec: OpenAPI3Spec = {
                info: {
                    title: 'spec title',
                    version: 'spec version'
                },
                openapi: '3.0.0'
            };

            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec.openapi).toBeDefined();
        });

        it('should generate a parsed spec copying across the value of the openapi property', () => {
            const originalSpec: OpenAPI3Spec = {
                info: {
                    title: 'spec title',
                    version: 'spec version'
                },
                openapi: '3.0.0'
            };

            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec.openapi).toEqual('3.0.0');
        });
    });
});
