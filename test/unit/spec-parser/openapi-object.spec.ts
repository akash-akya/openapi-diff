import {specParser} from '../../../lib/openapi-diff/spec-parser';
import {OpenApi3, ParsedSpec, Swagger2} from '../../../lib/openapi-diff/types';
import {openApi3SpecBuilder} from '../support/builders/openapi-3-spec-builder';
import {parsedSpecBuilder} from '../support/builders/parsed-spec-builder';
import {swagger2SpecBuilder} from '../support/builders/swagger-2-spec-builder';

describe('specParser, with regards to the swagger/openapi object,', () => {
    const whenSpecIsParsed = (spec: Swagger2 | OpenApi3): ParsedSpec => specParser.parse(spec);

    describe('when the input spec is in Swagger 2.0 format', () => {

        it('should generate a parsed spec copying across the swagger property and its value', () => {

            const originalSpec = swagger2SpecBuilder
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withSwagger2()
                .build();
            expect(actualResult.openapi).toEqual(expectedResult.openapi);
        });
    });

    describe('when the input spec is in OpenApi 3.0 format', () => {

        it('should generate a parsed spec copying across the openapi property and its value', () => {

            const originalSpec = openApi3SpecBuilder
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .build();
            expect(actualResult.openapi).toEqual(expectedResult.openapi);
        });
    });
});
