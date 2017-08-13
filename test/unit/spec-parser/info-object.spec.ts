import specParser from '../../../lib/openapi-diff/spec-parser';

import { OpenAPIObject as OpenApi3 } from 'openapi3-ts';

import { ParsedSpec } from '../../../lib/openapi-diff/types';

let resultingSpec: ParsedSpec;

describe('specParser, with regards to the info object,', () => {

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

    const buildOpenApi3SpecWithCompleteInfoObject = (): OpenApi3 => {
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
                version: 'version'
            },
            openapi: '3.0.0',
            paths: {}
        };
        return spec;
    };

    describe('when the original spec has all the default fields populated', () => {

        beforeEach(() => {
            const originalSpec = buildOpenApi3SpecWithCompleteInfoObject();
            resultingSpec = specParser.parse(originalSpec);
        });

        it('should generate a parsed spec with an info object', () => {
            expect(resultingSpec.info).toBeDefined();
        });

        it('should generate a parsed spec copying across all the default fields to the info object', () => {
            expect(resultingSpec.info.title).toBe('spec title');
            expect(resultingSpec.info.description).toBe('spec description');
            expect(resultingSpec.info.termsOfService).toBe('terms of service');

            if (resultingSpec.info.contact) {
                expect(resultingSpec.info.contact.name).toBe('contact name');
                expect(resultingSpec.info.contact.url).toBe('contact url');
                expect(resultingSpec.info.contact.email).toBe('contact email');
            } else {
                fail('info contact object was not defined when it should');
            }

            if (resultingSpec.info.licence) {
                expect(resultingSpec.info.licence.name).toBe('licence name');
                expect(resultingSpec.info.licence.url).toBe('licence url');
                expect(resultingSpec.info.version).toBe('version');
            } else {
                fail('info licence object was not defined when it should');
            }
        });
    });

    describe('when the original spec has only the required fields populated', () => {

        beforeEach(() => {
            const originalSpec = buildSimpleOpenApi3Spec();
            resultingSpec = specParser.parse(originalSpec);
        });

        it('should generate a parsed spec with an info object', () => {
            expect(resultingSpec.info).toBeDefined();
        });

        it('should generate a parsed spec copying across only the required fields to the info object', () => {
            expect(resultingSpec.info.title).toBe('spec title');
            expect(resultingSpec.info.version).toBe('spec version');
        });
    });

    describe('when the original spec has an x-property included in the info object', () => {

        beforeEach(() => {
            const originalSpec = buildSimpleOpenApi3Spec();
            originalSpec.info['x-external-id'] = 'some id';
            resultingSpec = specParser.parse(originalSpec);
        });

        it('should generate a parsed spec with an info object', () => {
            expect(resultingSpec.info).toBeDefined();
        });

        it('should generate a parsed spec copying across the x-property and its value', () => {
            expect(resultingSpec.info['x-external-id']).toBe('some id');
        });
    });
});
