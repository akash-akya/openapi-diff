import {specParser} from '../../../../lib/openapi-diff/spec-parser';
import {OpenApi3, ParsedSpec} from '../../../../lib/openapi-diff/types';
import {openApi3SpecBuilder} from '../../support/builders/openapi-3-spec-builder';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';

describe('specParser, with regards to the top level object,', () => {
    const whenSpecIsParsed = (spec: OpenApi3): ParsedSpec => specParser.parse(spec);

    describe('x-properties', () => {
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

            const actualResult = whenSpecIsParsed(originalSpec);

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
            expect(actualResult.xProperties).toEqual(expectedResult.xProperties);
        });
    });

    describe('host', () => {
        it('should generate a parsed spec with undefined value for the host property ', () => {
            const originalSpec = openApi3SpecBuilder.build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withNoHost()
                .build();
            expect(actualResult.host).toEqual(expectedResult.host);
        });
    });

    describe('basePath', () => {
        it('should generate a parsed spec with undefined value for the basePath property ', () => {
            const originalSpec = openApi3SpecBuilder.build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withNoBasePath()
                .build();
            expect(actualResult.basePath).toEqual(expectedResult.basePath);
        });
    });

    describe('schems', () => {
        it('should generate a parsed spec with a parsed schemes array property and undefined value', () => {
            const originalSpec = openApi3SpecBuilder
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withNoSchemes()
                .build();
            expect(actualResult.schemes).toEqual(expectedResult.schemes);
        });
    });
});
