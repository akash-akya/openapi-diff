import {OpenApiDiffErrorImpl} from '../../../lib/common/open-api-diff-error-impl';
import {specParser} from '../../../lib/openapi-diff/spec-parser';
import {ParsedSpec} from '../../../lib/openapi-diff/types';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';
import {swagger2SpecBuilder} from '../../support/builders/swagger-2-spec-builder';
import {expectToFail} from '../../support/expect-to-fail';

describe('swagger2 specParser', () => {
    const whenSpecIsParsed = (spec: object): Promise<ParsedSpec> =>
        whenSpecInLocationIsParsed(spec, 'default-location');
    const whenSpecInLocationIsParsed = (spec: object, location: string): Promise<ParsedSpec> =>
        specParser.parse(spec, location);

    describe('spec validation', () => {
        it('should return the error when the swagger file is not valid', async () => {
            const error = await expectToFail(whenSpecInLocationIsParsed({swagger: '2.0'}, 'spec.json'));

            expect(error as any).toEqual(new OpenApiDiffErrorImpl(
                'OPENAPI_DIFF_VALIDATE_SWAGGER_2_ERROR',
                'Validation errors in spec.json',
                new Error('[object Object] is not a valid Swagger API definition')
            ));
        });
    });

    describe('x-properties', () => {
        it('should generate a parsed spec copying across the x-property and its value', async () => {
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

            const actualResult = await whenSpecIsParsed(originalSpec);

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

    describe('basePath', () => {
        it('should generate a parsed spec copying across the basePath property and value when present', async () => {
            const originalSpec = swagger2SpecBuilder
                .withBasePath('/basePath')
                .build();

            const actualResult = await whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withBasePath('/basePath')
                .build();
            expect(actualResult.basePath).toEqual(expectedResult.basePath);
        });

        it('should generate a parsed spec with undefined value for basePath property when not present', async () => {
            const originalSpec = swagger2SpecBuilder
                .withNoBasePath()
                .build();

            const actualResult = await whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withNoBasePath()
                .build();
            expect(actualResult.basePath).toEqual(expectedResult.basePath);
        });
    });

    describe('schemes', () => {
        describe('when the schemes property doesn\'t exist in the original spec', () => {
            it('should generate a parsed spec with a parsed schemes array property and undefined value', async () => {
                const originalSpec = swagger2SpecBuilder
                    .withNoSchemes()
                    .build();

                const actualResult = await whenSpecIsParsed(originalSpec);

                const expectedResult = parsedSpecBuilder
                    .withNoSchemes()
                    .build();
                expect(actualResult.schemes).toEqual(expectedResult.schemes);
            });
        });

        describe('when the schemes property exists in the original spec', () => {
            describe('but it is empty', () => {
                it('should generate a parsed spec with an empty schemes array property', async () => {
                    const originalSpec = swagger2SpecBuilder
                        .withEmptySchemes()
                        .build();

                    const actualResult = await whenSpecIsParsed(originalSpec);

                    const expectedResult = parsedSpecBuilder
                        .withEmptySchemes()
                        .build();
                    expect(actualResult.schemes).toEqual(expectedResult.schemes);
                });
            });
        });

        describe('and the schemes property exists in the original spec', () => {
            describe('with a single value', () => {
                it('should generate parsed spec with a schemes property and a populated value on index 0', async () => {
                    const originalSpec = swagger2SpecBuilder
                        .withSchemes(['http'])
                        .build();

                    const actualResult = await whenSpecIsParsed(originalSpec);

                    const expectedResult = parsedSpecBuilder
                        .withSchemes([{
                            originalPath: ['schemes', '0'],
                            value: 'http'
                        }]).build();

                    expect(actualResult.schemes).toEqual(expectedResult.schemes);
                });
            });

            describe('with multiple values', () => {
                it('should generate parsed spec with schemes property and the expected populated values', async () => {
                    const originalSpec = swagger2SpecBuilder
                        .withSchemes(['http', 'https', 'ws', 'wss'])
                        .build();

                    const actualResult = await whenSpecIsParsed(originalSpec);

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
