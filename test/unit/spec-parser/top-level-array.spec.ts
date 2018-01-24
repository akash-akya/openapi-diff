import {specParser} from '../../../lib/openapi-diff/spec-parser';
import {openApi3SpecBuilder} from '../support/builders/openapi-3-spec-builder';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';
import {swagger2SpecBuilder} from '../support/builders/swagger-2-spec-builder';

describe('specParser, with regards to arrays in the top level object,', () => {

    describe('when the original spec is in Swagger 2 format', () => {

        describe('and the schemes property doesn\'t exist in the original spec', () => {

            it('should generate a parsed spec with a parsed schemes array property and undefined value', () => {

                const originalSpec = swagger2SpecBuilder
                    .withNoSchemes()
                    .build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder
                    .withNoSchemes()
                    .build();
                expect(actualResult.schemes).toEqual(expectedResult.schemes);
            });
        });

        describe('and the schemes property exists in the original spec', () => {

            describe('but it is empty', () => {

                it('should generate a parsed spec with an empty schemes array property', () => {
                    const originalSpec = swagger2SpecBuilder
                        .withEmptySchemes()
                        .build();

                    const actualResult = specParser.parse(originalSpec);

                    const expectedResult = parsedSpecBuilder
                        .withEmptySchemes()
                        .build();
                    expect(actualResult.schemes).toEqual(expectedResult.schemes);
                });
            });
        });

        describe('and the schemes property exists in the original spec', () => {

            describe('with a single value', () => {

                it('should generate a parsed spec with a schemes property and a populated value on index 0', () => {

                    const originalSpec = swagger2SpecBuilder
                        .withSchemes(['http'])
                        .build();

                    const actualResult = specParser.parse(originalSpec);

                    const expectedResult = parsedSpecBuilder
                        .withSchemes([{
                            originalPath: ['schemes', '0'],
                            value: 'http'
                        }]).build();

                    expect(actualResult.schemes).toEqual(expectedResult.schemes);
                });
            });

            describe('with multiple values', () => {

                it('should generate a parsed spec with a schemes property and the expected populated values', () => {

                    const originalSpec = swagger2SpecBuilder
                        .withSchemes(['http', 'https', 'ws', 'wss'])
                        .build();

                    const actualResult = specParser.parse(originalSpec);

                    const expectedResult = parsedSpecBuilder
                        .withSchemes([{
                            originalPath: ['schemes', '0'],
                            value: 'http'
                        }, {
                            originalPath: ['schemes', '1'],
                            value: 'https'
                        }, {
                            originalPath: ['schemes', '2'],
                            value: 'ws'
                        }, {
                            originalPath: ['schemes', '3'],
                            value: 'wss'
                        }])
                        .build();
                    expect(actualResult.schemes).toEqual(expectedResult.schemes);
                });
            });
        });
    });

    describe('when the original spec is in OpenApi 3 format', () => {

        it('should generate a parsed spec with a parsed schemes array property and undefined value', () => {

            const originalSpec = openApi3SpecBuilder
                .build();

            const actualResult = specParser.parse(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withNoSchemes()
                .build();
            expect(actualResult.schemes).toEqual(expectedResult.schemes);
        });
    });
});
