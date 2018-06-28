import {OpenApiDiffErrorImpl} from '../../lib/common/open-api-diff-error-impl';

const openApiDiffErrorEqualityTester = (actual: any, expected: any): boolean | void => {
    if (expected instanceof OpenApiDiffErrorImpl) {
        return actual instanceof OpenApiDiffErrorImpl
            && actual.code === expected.code
            && actual.message === expected.message;
    }
};

beforeAll(() => {
    jasmine.addCustomEqualityTester(openApiDiffErrorEqualityTester);
});
