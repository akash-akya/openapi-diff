import {DiffResult, DiffResultType} from '../../../../lib/api-types';
import {createDiffCustomMatcher} from './diff-custom-matcher';
import MatchersUtil = jasmine.MatchersUtil;

export const customMatchers = {
    toContainDifferences: (util: MatchersUtil): jasmine.CustomMatcher => ({
        compare: createDiffCustomMatcher(util)
    })
};

export interface CustomMatchers<T> extends jasmine.Matchers<T> {
    toContainDifferences(expected: Array<DiffResult<DiffResultType>>): boolean;
}
