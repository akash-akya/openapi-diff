import specParser from '../../../lib/openapi-diff/spec-parser';
import {OpenAPI3Spec, ParsedSpec, Swagger2Spec} from '../../../lib/openapi-diff/types';

describe('specParser, with regards to the top level object,', () => {

    describe('when the original spec has x-properties at the top level', () => {

        it('should generate a parsed spec copying across the x-property and its value', () => {

            const originalSpec: OpenAPI3Spec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                openapi: '3.0.0',
                'x-external-id': 'some id',
                'x-internal-id': 'some other id'
            };
            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec['x-external-id']).toBe('some id');
            expect(resultingSpec['x-internal-id']).toBe('some other id');
        });
    });

    describe('when the original spec is in Swagger 2 format', () => {

        describe('with regards to the host property', () => {

            let originalSpec: Swagger2Spec;

            beforeEach(() => {
                originalSpec = {
                    host: 'some host url',
                    info: {
                        title: 'spec title',
                        version: 'version'
                    },
                    swagger: '2.0'
                };
            });

            it('should generate a parsed spec copying across the host property and its value when present', () => {
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.host).toBe('some host url');
            });

            it('should generate a parsed spec without host property when not present', () => {
                delete(originalSpec.host);
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.host).not.toBeDefined();
            });
        });

        describe('with regards to the basePath property', () => {

            let originalSpec: Swagger2Spec;

            beforeEach(() => {
                originalSpec = {
                    basePath: 'some basePath info',
                    info: {
                        title: 'spec title',
                        version: 'version'
                    },
                    swagger: '2.0'
                };
            });

            it('should generate a parsed spec copying across the basePath property and its value', () => {
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.basePath).toBe('some basePath info');
            });

            it('should generate a parsed spec without basePath property when not present', () => {
                delete(originalSpec.basePath);
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.basePath).not.toBeDefined();
            });
        });

        describe('with regards to the schemes property', () => {

            let originalSpec: Swagger2Spec;

            beforeEach(() => {
               originalSpec = {
                   info: {
                       title: 'spec title',
                       version: 'version'
                   },
                   schemes: ['http', 'https'],
                   swagger: '2.0'
               };
            });

            it('should generate a parsed spec copying across the basePath property and its value', () => {
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.schemes).toEqual(['http', 'https']);
            });

            it('should generate a parsed spec with schemes property even if it was empty in the first place', () => {
                originalSpec.schemes = [];
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                if (resultingSpec.schemes) {
                    expect(resultingSpec.schemes.length).toEqual(0);
                } else {
                    fail('schemes property was not defined when it should');
                }
            });

            it('should generate a parsed spec without schemes property when not present', () => {
                delete(originalSpec.schemes);
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.schemes).not.toBeDefined();
            });

            it('should generate a parsed spec with an ordered schemes property to simplify diffing', () => {
                originalSpec.schemes = ['https', 'http'];
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.schemes).toEqual(['http', 'https']);
            });
        });
    });
});
