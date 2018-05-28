import {specParser} from '../../../../lib/openapi-diff/spec-parser';
import {OpenApi3, ParsedSpec} from '../../../../lib/openapi-diff/types';
import {openApi3SpecBuilder, openApi3SpecInfoBuilder} from '../../support/builders/openapi-3-spec-builder';
import {parsedSpecBuilder, parsedSpecInfoBuilder} from '../../support/builders/parsed-spec-builder';

describe('specParser, with regards to the info object,', () => {
    const whenSpecIsParsed = (spec: OpenApi3): ParsedSpec => specParser.parse(spec);

    describe('and the info object is minimal', () => {
        it('should generate a parsed spec copying across the info object properties and their values', () => {
            const originalSpec = openApi3SpecBuilder
                .withInfoObject(openApi3SpecInfoBuilder
                    .withTitle('spec title')
                    .withVersion('spec version'))
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withInfoObject(parsedSpecInfoBuilder
                    .withTitle('spec title')
                    .withVersion('spec version'))
                .build();
            expect(actualResult.info).toEqual(expectedResult.info);
        });
    });

    describe('and the info object is complete at the primitive level', () => {

        it('should generate a parsed spec copying across the info object properties and their values', () => {
            const originalSpec = openApi3SpecBuilder
                .withInfoObject(openApi3SpecInfoBuilder
                    .withDescription('spec description')
                    .withTermsOfService('spec terms'))
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withInfoObject(parsedSpecInfoBuilder
                    .withDescription('spec description')
                    .withTermsOfService('spec terms'))
                .build();
            expect(actualResult.info).toEqual(expectedResult.info);
        });
    });

    describe('and the info object is complete at the object level', () => {
        it('should generate a parsed spec copying across the info object properties and their values', () => {
            const originalSpec = openApi3SpecBuilder
                .withInfoObject(openApi3SpecInfoBuilder
                    .withContact('contact email', 'contact name', 'contact url')
                    .withLicense('license name', 'license url'))
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withInfoObject(parsedSpecInfoBuilder
                    .withContact({
                        name: 'email',
                        originalPath: ['info', 'contact', 'email'],
                        value: 'contact email'
                    }, {
                        name: 'name',
                        originalPath: ['info', 'contact', 'name'],
                        value: 'contact name'
                    }, {
                        name: 'url',
                        originalPath: ['info', 'contact', 'url'],
                        value: 'contact url'
                    })
                    .withLicense({
                        name: 'name',
                        originalPath: ['info', 'license', 'name'],
                        value: 'license name'
                    }, {
                        name: 'url',
                        originalPath: ['info', 'license', 'url'],
                        value: 'license url'
                    }))
                .build();
            expect(actualResult.info).toEqual(expectedResult.info);
        });
    });

    describe('when the original spec has an x-property included in the info object', () => {
        it('should generate a parsed spec copying across the x-property and its value', () => {
            const originalSpec = openApi3SpecBuilder
                .withInfoObject(openApi3SpecInfoBuilder
                    .withXProperty('external-id', 'some id'))
                .build();

            const actualResult = whenSpecIsParsed(originalSpec);

            const expectedResult = parsedSpecBuilder
                .withOpenApi3()
                .withInfoObject(parsedSpecInfoBuilder
                    .withXProperty({
                        name: 'x-external-id',
                        originalPath: ['info', 'x-external-id'],
                        value: 'some id'
                    }))
                .build();
            expect(actualResult.info).toEqual(expectedResult.info);
        });
    });
});
