import {OpenApiDiffErrorImpl} from '../../../lib/common/open-api-diff-error-impl';

describe('spec-helper', () => {
    describe('OpenApiDiffError', () => {
        it('should find equal two OpenApiDiffError objects with same code and message', () => {
            const actual = new OpenApiDiffErrorImpl('openapi-diff.filesystem.error', 'A file system error');
            const expected = new OpenApiDiffErrorImpl('openapi-diff.filesystem.error', 'A file system error');

            expect(actual).toEqual(expected);
        });

        it('should not use the OpenApiDiffError equality tester when the expected is not a OpenApiDiffError', () => {
            const actual = new OpenApiDiffErrorImpl('openapi-diff.filesystem.error', 'A file system error');
            const expected = new Error('A file system error');

            expect(actual).toEqual(expected as OpenApiDiffErrorImpl);
        });

        it('should find not equal two objects where the actual object is not a OpenApiDiffError', () => {
            const actual = new Error('A file system error');
            const expected = new OpenApiDiffErrorImpl('openapi-diff.filesystem.error', 'A file system error');

            expect(actual).not.toEqual(expected);
        });

        it('should not find equal two objects where actual object is not OpenApiDiffError but quacks like one', () => {
            const actual = {
                code: 'openapi-diff.filesystem.error',
                message: 'A file system error'
            };
            const expected = new OpenApiDiffErrorImpl('openapi-diff.filesystem.error', 'A file system error');

            expect(actual).not.toEqual(expected);
        });

        it('should find not equal two OpenApiDiffError objects with different code', () => {
            const actual = new OpenApiDiffErrorImpl('openapi-diff.specdeserialiser.error', 'the error message');
            const expected = new OpenApiDiffErrorImpl('openapi-diff.filesystem.error', 'the error message');

            expect(actual).not.toEqual(expected);
        });

        it('should find not equal two OpenApiDiffError objects with different message', () => {
            const actual = new OpenApiDiffErrorImpl('openapi-diff.specdeserialiser.error', 'an error message');
            const expected = new OpenApiDiffErrorImpl(
                'openapi-diff.specdeserialiser.error', 'a different error message'
            );

            expect(actual).not.toEqual(expected);
        });

        it('should print OpenApiDiffErrors in a human readable format', () => {
            const error = new OpenApiDiffErrorImpl('openapi-diff.specdeserialiser.error', 'An error occurred');

            expect(error.toString())
                .toBe('OpenApiDiffError: { code: openapi-diff.specdeserialiser.error, message: An error occurred }');
        });

        it('should not break if the message contains sprintf escape sequences', () => {
            const error = new OpenApiDiffErrorImpl('openapi-diff.filesystem.error', 'A message with %some %percents');

            expect(error.message).toBe('A message with %some %percents');
        });
    });
});
