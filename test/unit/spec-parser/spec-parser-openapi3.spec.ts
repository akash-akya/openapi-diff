import {specParser} from '../../../lib/openapi-diff/spec-parser';
import {OpenApi3, ParsedSpec} from '../../../lib/openapi-diff/types';
import {openApi3SpecBuilder} from '../../support/builders/openapi-3-spec-builder';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';

describe('openapi3 specParser', () => {
    const whenSpecIsParsed = (spec: OpenApi3): Promise<ParsedSpec> =>
        specParser.parse(spec, 'default-location');

    describe('x-properties', () => {
        it('should generate a parsed spec copying across the x-property and its value', async () => {
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
        it('should generate a parsed spec with undefined value for the basePath property ', async () => {
            const originalSpec = openApi3SpecBuilder.build();

            const actualResult = await whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withNoBasePath()
                .build();
            expect(actualResult.basePath).toEqual(expectedResult.basePath);
        });
    });

    describe('schemes', () => {
        it('should generate a parsed spec with a parsed schemes array property and undefined value', async () => {
            const originalSpec = openApi3SpecBuilder
                .build();

            const actualResult = await whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withNoSchemes()
                .build();
            expect(actualResult.schemes).toEqual(expectedResult.schemes);
        });
    });
});
