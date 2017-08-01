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

            const originalSpec: Swagger2Spec = {
                host: 'some host url',
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                swagger: '2.0'
            };

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

            const originalSpec: Swagger2Spec = {
                basePath: 'some basePath info',
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                swagger: '2.0'
            };

            it('should generate a parsed spec copying across the basePath property and its value', () => {
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.basePath).toBe('some basePath info');
            });

            it('should generate a parsed spec without basepath property when not present', () => {
                delete(originalSpec.basePath);
                const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
                expect(resultingSpec.basePath).not.toBeDefined();
            });
        });
    });
});
