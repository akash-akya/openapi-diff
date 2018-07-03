import {OpenApiDiffErrorImpl} from '../../lib/common/open-api-diff-error-impl';
import {customMatchers} from '../unit/support/custom-matchers/custom-matchers';

const openApiDiffErrorEqualityTester = (actual: any, expected: any): boolean | void => {
    if (expected instanceof OpenApiDiffErrorImpl) {
        return actual instanceof OpenApiDiffErrorImpl
            && actual.code === expected.code
            && actual.message === expected.message;
    }
};

beforeAll(() => {
    jasmine.addCustomEqualityTester(openApiDiffErrorEqualityTester);
    jasmine.addMatchers(customMatchers);
});
