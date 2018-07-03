import {DiffResult, DiffResultType} from '../../../../lib/api-types';
import {compare as toContainDifferencesCompare} from './diff-custom-matcher';

export const customMatchers = {
    toContainDifferences: (): jasmine.CustomMatcher => ({
        compare: toContainDifferencesCompare
    })
};

export interface CustomMatchers<T> extends jasmine.Matchers<T> {
    toContainDifferences(expected: Array<DiffResult<DiffResultType>>): boolean;
}
