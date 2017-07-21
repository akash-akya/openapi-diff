import specParser from '../../../lib/openapi-diff/spec-parser';
import {OpenAPI3Spec, ParsedSpec} from '../../../lib/openapi-diff/types';

describe('specParser, with regards to the top level object,', () => {

    describe('when the original spec has x-properties at the top level', () => {

        it('should generate a parsed spec copying across the x-property and its value', () => {

            const originalSpec: OpenAPI3Spec = {
                info: {
                    title: 'spec title',
                    version: 'version'
                },
                openapi: '3.0.0',
                'x-external-id': 'some id',
                'x-internal-id': 'some other id'
            };
            const resultingSpec: ParsedSpec = specParser.parse(originalSpec);
            expect(resultingSpec['x-external-id']).toBe('some id');
            expect(resultingSpec['x-internal-id']).toBe('some other id');
        });

    });
});
