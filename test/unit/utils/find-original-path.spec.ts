import utils from '../../../lib/openapi-diff/utils';

import { ParsedSpec } from '../../../lib/openapi-diff/types';

let parsedSpec: ParsedSpec;

describe('specParser, with regards to the find original path function,', () => {

    const buildSimpleParsedSwagger2Spec = (): ParsedSpec => {
        const spec = {
            info: {
                title: 'spec title',
                version: 'spec version'
            },
            openapi: {
                originalPath: ['swagger'],
                parsedValue: '2.0'
            },
            'x-external-id': 'x value'
        };
        return spec;
    };

    beforeEach(() => {
        parsedSpec = buildSimpleParsedSwagger2Spec();
    });

    describe('when the original content has no original path', () => {

        it('should return the provided parsed path for a top level element', () => {
            const result = utils.findOriginalPath(parsedSpec, ['x-external-id']);
            expect(result).toEqual(['x-external-id']);
        });

        it('should return the provided parsed path for a nested element', () => {
            const result = utils.findOriginalPath(parsedSpec, ['info', 'title']);
            expect(result).toEqual(['info', 'title']);
        });
    });

    describe('when the original content has an originalPath property', () => {

        it('should return the original path for a top level element', () => {
            const result = utils.findOriginalPath(parsedSpec, ['openapi', 'parsedValue']);
            expect(result).toEqual(['swagger']);
        });
    });
});
