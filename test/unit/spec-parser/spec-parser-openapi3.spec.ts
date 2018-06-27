import {specParser} from '../../../lib/openapi-diff/spec-parser';
import {ParsedSpec} from '../../../lib/openapi-diff/spec-parser-types';
import {openApi3PathItemBuilder} from '../../support/builders/openapi-3-path-item-builder';
import {openApi3SpecBuilder} from '../../support/builders/openapi-3-spec-builder';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';

describe('openapi3 specParser', () => {
    const whenSpecIsParsed = (spec: object): Promise<ParsedSpec> =>
        specParser.parse(spec, 'default-location');

    describe('x-properties', () => {
        it('should generate a parsed spec copying across the x-property and its value', async () => {
            const originalSpec = openApi3SpecBuilder
                .withTopLevelXProperty('x-external-id', 'some external id')
                .withTopLevelXProperty('x-internal-id', 'some internal id')
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

    describe('paths', () => {
        it('should return empty parsed paths array, if spec does not contain any paths', async () => {
            const originalSpec = openApi3SpecBuilder.withPaths({}).build();

            const parsedSpec = await whenSpecIsParsed(originalSpec);

            expect(parsedSpec.paths).toEqual([]);
        });

        it('should return a parsed path item with path name and original value for a path in the spec', async () => {
            const originalSpec = openApi3SpecBuilder
                .withPaths({'/some/id': openApi3PathItemBuilder.build()})
                .build();

            const parsedSpec = await whenSpecIsParsed(originalSpec);

            expect(parsedSpec.paths.length).toBe(1, 'parsedSpec.paths.length');
            expect(parsedSpec.paths).toContain(jasmine.objectContaining({
                originalValue: {
                    originalPath: ['paths', '/some/id'],
                    value: openApi3PathItemBuilder.build()
                },
                pathName: '/some/id'
            }));
        });

        it('should return a parsed path item for each path in the spec', async () => {
            const originalSpec = openApi3SpecBuilder
                .withPaths({
                    '/path1': openApi3PathItemBuilder.build(),
                    '/path2': openApi3PathItemBuilder.build()
                })
                .build();

            const parsedSpec = await whenSpecIsParsed(originalSpec);

            expect(parsedSpec.paths.length).toBe(2, 'parsedSpec.paths.length');
        });
    });
});
