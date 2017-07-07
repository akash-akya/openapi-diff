import specParser from '../../../lib/openapi-diff/spec-parser';
import {OpenAPISpec, ParsedSpec} from '../../../lib/openapi-diff/types';

describe('specParser, with regards to the info object,', () => {

    describe('when the original spec has all the default fields populated', () => {

        it('should generate a parsed spec with an info object', () => {

            const originalSpec: OpenAPISpec = {
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
                }
            };

            const resultingSpec: OpenAPISpec = specParser.parse(originalSpec);
            expect(resultingSpec.info).not.toBe(undefined);
        });

        it('should generate a parsed spec copying across all the default fields to the info object', () => {

            const originalSpec: OpenAPISpec = {
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
                }
            };
            const resultingSpec: OpenAPISpec = specParser.parse(originalSpec);
            expect(resultingSpec.info.title).toBe('spec title');
            expect(resultingSpec.info.description).toBe('spec description');
            expect(resultingSpec.info.termsOfService).toBe('terms of service');
            expect(resultingSpec.info.contact.name).toBe('contact name');
            expect(resultingSpec.info.contact.url).toBe('contact url');
            expect(resultingSpec.info.contact.email).toBe('contact email');
            expect(resultingSpec.info.licence.name).toBe('licence name');
            expect(resultingSpec.info.licence.url).toBe('licence url');
            expect(resultingSpec.info.version).toBe('version');
        });
    });

    describe('when the original spec has only the required fields populated', () => {

        it('should generate a parsed spec with an info object', () => {

            const originalSpec: OpenAPISpec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                }
            };

            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec.info).not.toBe(undefined);
        });

        it('should generate a parsed spec copying across only the required fields to the info object', () => {

            const originalSpec: OpenAPISpec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                }
            };
            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec.info.title).toBe('spec title');
            expect(resultingSpec.info.version).toBe('version');
        });
    });

    describe('when the original spec has an x-property included in the info object', () => {

        it('should generate a parsed spec with an info object', () => {

            const originalSpec: OpenAPISpec = {
                info: {
                    title: 'spec title',
                    version: 'version',
                    'x-external-id': 'some id'
                }
            };
            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec.info).not.toBe(undefined);
        });

        it('should generate a parsed spec copying across the x-property and its value', () => {

            const originalSpec: OpenAPISpec = {
                info: {
                    title: 'spec title',
                    version: 'version',
                    'x-external-id': 'some id'
                }
            };
            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec.info['x-external-id']).toBe('some id');
        });
    });

    describe('when the original spec has an x-property at the top level', () => {

        it('should generate a parsed spec copying across the x-property and its value', () => {

            const originalSpec: OpenAPISpec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                'x-external-id': 'some id'
            };
            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec['x-external-id']).toBe('some id');
        });

    });
});
