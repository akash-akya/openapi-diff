import * as _ from 'lodash';
import {DiffOutcome, DiffResult, DiffResultType} from '../../../../lib/api-types';
import MatchersUtil = jasmine.MatchersUtil;
import CustomMatcherResult = jasmine.CustomMatcherResult;

type EqualityTester = (first: any, second: any) => boolean;
const isString = (target: any): target is string => typeof target === 'string';

const getActualBreakingDifferences = (actualDiffOutcome: DiffOutcome): Array<DiffResult<'breaking'>> => {
    return actualDiffOutcome.breakingDifferencesFound ? actualDiffOutcome.breakingDifferences : [];
};

const getAllActualDifferences = (actualDiffOutcome: DiffOutcome): Array<DiffResult<DiffResultType>> =>
    [
        ...actualDiffOutcome.unclassifiedDifferences,
        ...actualDiffOutcome.nonBreakingDifferences,
        ...getActualBreakingDifferences(actualDiffOutcome)
    ];

const createMessage = (unmatchedDifferences: Array<DiffResult<DiffResultType>>, headline: string) => {
    const allUnmatchedDifferences = unmatchedDifferences
        .map((difference) => JSON.stringify(difference, null, 4))
        .join('\n');
    return `${headline}:\n${allUnmatchedDifferences}`;
};

const compareExpectedToActualDifferences = (
    actualDifferences: Array<DiffResult<DiffResultType>>,
    expectedDifferences: Array<DiffResult<DiffResultType>>,
    equalityTester: EqualityTester
): jasmine.CustomMatcherResult => {
    const unmatchedExpectedDifferences = _.differenceWith(expectedDifferences, actualDifferences, equalityTester);
    return {
        message: unmatchedExpectedDifferences.length === 0
            ? undefined
            : createMessage(unmatchedExpectedDifferences, 'Unmatched expected differences'),
        pass: unmatchedExpectedDifferences.length === 0
    };
};

const compareActualToExpectedDifferences = (
    actualDifferences: Array<DiffResult<DiffResultType>>,
    expectedDifferences: Array<DiffResult<DiffResultType>>,
    equalityTester: EqualityTester
): jasmine.CustomMatcherResult => {
    const unmatchedActualDifferences = _.differenceWith(actualDifferences, expectedDifferences, equalityTester);
    return {
        message: unmatchedActualDifferences.length === 0
            ? undefined
            : createMessage(unmatchedActualDifferences, 'Unmatched actual differences'),
        pass: unmatchedActualDifferences.length === 0
    };
};

const compareBreakingDifferencesFoundFlag = (
    actualDiffOutcome: DiffOutcome, expectedDifferences: Array<DiffResult<DiffResultType>>
): jasmine.CustomMatcherResult => {
    const breakingDifferencesExpected = expectedDifferences.some((difference) => difference.type === 'breaking');
    const pass = actualDiffOutcome.breakingDifferencesFound === breakingDifferencesExpected;
    return {
        message: pass
            ? undefined
            : `Expected breakingDifferencesFound to be ${breakingDifferencesExpected}`
            + ` but it was ${actualDiffOutcome.breakingDifferencesFound}`,
        pass
    };
};

const toContainDifferencesCompare = (
    actualDiffOutcome: DiffOutcome,
    expectedDifferences: Array<DiffResult<DiffResultType>>,
    util: MatchersUtil
): jasmine.CustomMatcherResult => {

    const allActualDifferences = getAllActualDifferences(actualDiffOutcome);

    const allCompareResults: jasmine.CustomMatcherResult[] = [
        compareActualToExpectedDifferences(allActualDifferences, expectedDifferences, util.equals),
        compareExpectedToActualDifferences(allActualDifferences, expectedDifferences, util.equals),
        compareBreakingDifferencesFoundFlag(actualDiffOutcome, expectedDifferences)
    ];

    const message = allCompareResults
        .map((result) => result.message)
        .filter(isString)
        .join('\n');
    const pass = allCompareResults.every((result) => result.pass);

    return {message, pass};
};

type DiffCustomMatcherFunc = (
    actualDiffOutcome: DiffOutcome,
    expectedDifferences: Array<DiffResult<DiffResultType>>
) => CustomMatcherResult;

export const createDiffCustomMatcher = (util: MatchersUtil): DiffCustomMatcherFunc =>
    (
        actualDiffOutcome: DiffOutcome,
        expectedDifferences: Array<DiffResult<DiffResultType>>
    ): CustomMatcherResult =>
        toContainDifferencesCompare(actualDiffOutcome, expectedDifferences, util);
