import {specParser} from '../../../../lib/openapi-diff/spec-parser';
import {ParsedSpec, Swagger2} from '../../../../lib/openapi-diff/types';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';
import {swagger2SpecBuilder} from '../../support/builders/swagger-2-spec-builder';

describe('specParser, with regards to the top level object,', () => {
    const whenSpecIsParsed = (spec: Swagger2): ParsedSpec => specParser.parse(spec);

    describe('x-properties', () => {
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

            const actualResult = whenSpecIsParsed(originalSpec);

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
            expect(actualResult.xProperties).toEqual(expectedResult.xProperties);
        });
    });

    describe('host', () => {
        it('should generate a parsed spec copying across the host property and its value when present', () => {
            const originalSpec = swagger2SpecBuilder
                .withHost('some host url')
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withHost('some host url')
                .build();
            expect(actualResult.host).toEqual(expectedResult.host);
        });

        it('should generate a parsed spec with undefined value for host property when not present', () => {
            const originalSpec = swagger2SpecBuilder
                .withNoHost()
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withNoHost()
                .build();
            expect(actualResult.host).toEqual(expectedResult.host);
        });
    });

    describe('basePath', () => {
        it('should generate a parsed spec copying across the basePath property and value when present', () => {
            const originalSpec = swagger2SpecBuilder
                .withBasePath('some basePath info')
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withBasePath('some basePath info')
                .build();
            expect(actualResult.basePath).toEqual(expectedResult.basePath);
        });

        it('should generate a parsed spec with undefined value for basePath property when not present', () => {
            const originalSpec = swagger2SpecBuilder
                .withNoBasePath()
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withNoBasePath()
                .build();
            expect(actualResult.basePath).toEqual(expectedResult.basePath);
        });
    });

    describe('schemes', () => {
        describe('when the schemes property doesn\'t exist in the original spec', () => {
            it('should generate a parsed spec with a parsed schemes array property and undefined value', () => {
                const originalSpec = swagger2SpecBuilder
                    .withNoSchemes()
                    .build();

                const actualResult = whenSpecIsParsed(originalSpec);

                const expectedResult = parsedSpecBuilder
                    .withNoSchemes()
                    .build();
                expect(actualResult.schemes).toEqual(expectedResult.schemes);
            });
        });

        describe('when the schemes property exists in the original spec', () => {
            describe('but it is empty', () => {
                it('should generate a parsed spec with an empty schemes array property', () => {
                    const originalSpec = swagger2SpecBuilder
                        .withEmptySchemes()
                        .build();

                    const actualResult = whenSpecIsParsed(originalSpec);

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

                    const actualResult = whenSpecIsParsed(originalSpec);

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

                    const actualResult = whenSpecIsParsed(originalSpec);

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
});
