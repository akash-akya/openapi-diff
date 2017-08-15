import specParser from '../../../lib/openapi-diff/spec-parser';
import { openApi3SpecBuilder } from '../support/openapi3-spec-builder';
import { parsedSpecBuilder, parsedSpecInfoBuilder } from '../support/parsed-spec-builder';
import { genericSpecInfoBuilder, swagger2SpecBuilder } from '../support/swagger2-spec-builder';

describe('specParser, with regards to the info object,', () => {

    describe('when the input spec is in Swagger 2.0 format', () => {

        describe('and the info object is minimal', () => {

            it('should generate a parsed spec copying across the info object properties and their values', () => {

                const originalSpec = swagger2SpecBuilder
                    .withInfoObject(genericSpecInfoBuilder
                        .withTitle('spec title')
                        .withVersion('spec version'))
                    .build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder
                    .withInfoObject(parsedSpecInfoBuilder
                        .withTitle('spec title')
                        .withVersion('spec version'))
                    .build();
                expect(actualResult.info).toEqual(expectedResult.info);
            });
        });
    });

    describe('when the input spec is in OpenApi 3.0.0 format', () => {

        describe('and the info object is minimal', () => {

            it('should generate a parsed spec copying across the info object properties and their values', () => {

                const originalSpec = openApi3SpecBuilder
                    .withInfoObject(genericSpecInfoBuilder
                        .withTitle('spec title')
                        .withVersion('spec version'))
                    .build();

                const actualResult = specParser.parse(originalSpec);

                const expectedResult = parsedSpecBuilder
                    .withOpenApi3()
                    .withInfoObject(parsedSpecInfoBuilder
                        .withTitle('spec title')
                        .withVersion('spec version'))
                    .build();
                expect(actualResult.info).toEqual(expectedResult.info);
            });
        });
    });

    describe('when the original spec has an x-property included in the info object', () => {

        it('should generate a parsed spec copying accross the x-property and its value', () => {

            const originalSpec = openApi3SpecBuilder
                .withInfoObject(genericSpecInfoBuilder
                    .withXProperty('x-external-id', 'some id'))
                .build();

            const actualResult = specParser.parse(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty('x-external-id', 'some id'))
                .build();
            expect(actualResult.info).toEqual(expectedResult.info);
        });
    });
});
