import {specParser} from '../../../../lib/openapi-diff/spec-parser';
import {ParsedSpec, Swagger2} from '../../../../lib/openapi-diff/types';
import {parsedSpecBuilder} from '../../support/builders/parsed-spec-builder';
import {swagger2SpecBuilder} from '../../support/builders/swagger-2-spec-builder';

describe('specParser, with regards to the swagger object,', () => {
    const whenSpecIsParsed = (spec: Swagger2): ParsedSpec => specParser.parse(spec);

    it('should generate a parsed spec copying across the swagger property and its value', () => {
        const originalSpec = swagger2SpecBuilder.build();

        const actualResult = whenSpecIsParsed(originalSpec);

        const expectedResult = parsedSpecBuilder.withSwagger2().build();
        expect(actualResult.openapi).toEqual(expectedResult.openapi);
    });
});
