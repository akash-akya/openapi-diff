import specParser from '../../../lib/openapi-diff/spec-parser';
import { openApi3SpecBuilder } from '../support/openapi3-spec-builder';
import { parsedSpecBuilder } from '../support/parsed-spec-builder';
import { swagger2SpecBuilder } from '../support/swagger2-spec-builder';

describe('specParser, with regards to the swagger/openapi object,', () => {

    describe('when the input spec is in Swagger 2.0 format', () => {

        it('should generate a parsed spec copying across the swagger property and its value', () => {

            const originalSpec = swagger2SpecBuilder
                .build();

            const actualResult = specParser.parse(originalSpec);

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

            const actualResult = specParser.parse(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .build();
            expect(actualResult.openapi).toEqual(expectedResult.openapi);
        });
    });
});
