import specParser from '../../../lib/openapi-diff/spec-parser';
import openApi3SpecBuilder from '../support/openapi3-spec-builder';
import {parsedSpecBuilder} from '../support/parsed-spec-builder';
import swagger2SpecBuilder from '../support/swagger2-spec-builder';

describe('specParser, with regards to the top level object,', () => {

    describe('when the original spec has x-properties at the top level', () => {

        describe('when the original spec is in Swagger 2 format', () => {

            it('should generate a parsed spec copying across the x-property and its value', () => {

                const originalSpec = swagger2SpecBuilder
                    .withTopLevelXProperty({
                        key: 'x-external-id',
                        value: 'some external id'
                    })
                    .withTopLevelXProperty({
                        key: 'x-internal-id',
                        value: 'some internal id'
                    })
                    .build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder
                    .withTopLevelXProperty({
                        name: 'x-external-id',
                        originalPath: ['x-external-id'],
                        value: 'some external id'
                    })
                    .withTopLevelXProperty({
                        name: 'x-internal-id',
                        originalPath: ['x-internal-id'],
                        value: 'some internal id'
                    })
                    .build();
                expect(actualResult).toEqual(expectedResult);
            });
        });

        describe('when the original spec is in OpenApi 3 format', () => {

            it('should generate a parsed spec copying across the x-property and its value', () => {

                const originalSpec = openApi3SpecBuilder
                    .withTopLevelXProperty({
                        key: 'x-external-id',
                        value: 'some external id'
                    })
                    .withTopLevelXProperty({
                        key: 'x-internal-id',
                        value: 'some internal id'
                    })
                    .build();
                const expectedResult = parsedSpecBuilder
                    .withOpenApi3()
                    .withTopLevelXProperty({
                        name: 'x-external-id',
                        originalPath: ['x-external-id'],
                        value: 'some external id'
                    })
                    .withTopLevelXProperty({
                        name: 'x-internal-id',
                        originalPath: ['x-internal-id'],
                        value: 'some internal id'
                    })
                    .build();
                const actualResult = specParser.parse(originalSpec);
                expect(actualResult).toEqual(expectedResult);
            });
        });
    });

    describe('with regards to the host property', () => {

        describe('when the original spec is in Swagger 2 format', () => {

            it('should generate a parsed spec copying across the host property and its value when present', () => {

                const originalSpec = swagger2SpecBuilder.withHost('some host url').build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder.withHost('some host url').build();
                expect(actualResult).toEqual(expectedResult);
            });

            it('should generate a parsed spec with undefined value for host property when not present', () => {

                const originalSpec = swagger2SpecBuilder.build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder.withNoHost().build();
                expect(actualResult).toEqual(expectedResult);
            });
        });

        describe('when the original spec is in OpenApi 3 format', () => {

            it('should generate a parsed spec with undefined value for the host property ', () => {

                const originalSpec = openApi3SpecBuilder.build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder.withOpenApi3().build();
                expect(actualResult).toEqual(expectedResult);
            });
        });
    });

    describe('with regards to the basePath property', () => {

        describe('when the original spec is in Swagger 2 format', () => {

            it('should generate a parsed spec copying across the basePath property and value when present', () => {

                const originalSpec = swagger2SpecBuilder.withBasePath('some basePath info').build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder.withBasePath('some basePath info').build();
                expect(actualResult).toEqual(expectedResult);
            });

            it('should generate a parsed spec with undefined value for basePath property when not present', () => {
                const originalSpec = swagger2SpecBuilder.build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder.withNoBasePath().build();
                expect(actualResult).toEqual(expectedResult);
            });
        });

        describe('when the original spec is in OpenApi 3 format', () => {

            it('should generate a parsed spec with undefined value for the basePath property ', () => {

                const originalSpec = openApi3SpecBuilder.build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder.withOpenApi3().build();
                expect(actualResult).toEqual(expectedResult);
            });
        });
    });
});
