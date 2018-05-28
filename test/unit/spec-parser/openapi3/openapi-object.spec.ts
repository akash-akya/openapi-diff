import {specParser} from '../../../../lib/openapi-diff/spec-parser';
import {OpenApi3, ParsedSpec} from '../../../../lib/openapi-diff/types';
import {openApi3SpecBuilder} from '../../support/builders/openapi-3-spec-builder';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';

describe('specParser, with regards to the openapi object,', () => {
    const whenSpecIsParsed = (spec: OpenApi3): ParsedSpec => specParser.parse(spec);

    it('should generate a parsed spec copying across the openapi property and its value', () => {
        const originalSpec = openApi3SpecBuilder.build();

        const actualResult = whenSpecIsParsed(originalSpec);

        const expectedResult = parsedSpecBuilder.withOpenApi3().build();
        expect(actualResult.openapi).toEqual(expectedResult.openapi);
    });
});
