import specParser from '../../../lib/openapi-diff/spec-parser';
import openApi3SpecBuilder from '../support/openapi3-spec-builder';
import {parsedSpecBuilder, parsedSpecInfoBuilder} from '../support/parsed-spec-builder';
import swagger2SpecBuilder from '../support/swagger2-spec-builder';

import {OpenAPIObject as OpenApi3} from 'openapi3-ts';

describe('specParser, with regards to the info object,', () => {

    describe('when the input spec is in Swagger 2.0 format', () => {

        describe('and the info object is minimal', () => {

            it('should generate a parsed spec copying across the info object properties and their values', () => {

                const originalSpec = swagger2SpecBuilder.build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder.build();
                expect(actualResult).toEqual(expectedResult);
            });
        });
    });

    describe('when the input spec is in OpenApi 3.0.0 format', () => {

        describe('and the info object is minimal', () => {

            it('should generate a parsed spec copying across the info object properties and their values', () => {

                const originalSpec = openApi3SpecBuilder.build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder
                    .withOpenApi3()
                    .build();
                expect(actualResult).toEqual(expectedResult);
            });
        });
    });

    const buildSimpleOpenApi3Spec = (): OpenApi3 => {
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

    describe('when the original spec has an x-property included in the info object', () => {

        it('should generate a parsed spec copying accross the x-property and its value', () => {

            const originalSpec = buildSimpleOpenApi3Spec();
            originalSpec.info['x-external-id'] = 'some id';

            const actualResult = specParser.parse(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withInfoObject(parsedSpecInfoBuilder.withXProperty('x-external-id', 'some id'))
                .build();
            expect(actualResult).toEqual(expectedResult);
        });
    });
});
