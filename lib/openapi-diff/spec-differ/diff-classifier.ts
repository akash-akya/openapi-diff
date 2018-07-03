import {DiffResult, DiffResultType} from '../../api-types';
import {Difference} from './diff-finder/difference';
import {resultTypeFinder} from './result-type-finder';

export interface ClassifiedDiffResults {
    breakingDifferences: Array<DiffResult<'breaking'>>;
    nonBreakingDifferences: Array<DiffResult<'non-breaking'>>;
    unclassifiedDifferences: Array<DiffResult<'unclassified'>>;
}

const isBreakingDiffResult = (diffResult: DiffResult<DiffResultType>): diffResult is DiffResult<'breaking'> => {
    return diffResult.type === 'breaking';
};

const isNonBreakingDiffResult = (diffResult: DiffResult<DiffResultType>): diffResult is DiffResult<'non-breaking'> => {
    return diffResult.type === 'non-breaking';
};

const isUnclassifiedDiffResult = (diffResult: DiffResult<DiffResultType>): diffResult is DiffResult<'unclassified'> => {
    return diffResult.type === 'unclassified';
};

export class DiffClassifier {
    public static classifyDifferences(differences: Difference[]): ClassifiedDiffResults {

        const classifiedDiffResults: ClassifiedDiffResults = {
            breakingDifferences: [],
            nonBreakingDifferences: [],
            unclassifiedDifferences: []
        };

        differences
            .map(DiffClassifier.differenceToDiffResult)
            .forEach((diffResult) => {
                if (isBreakingDiffResult(diffResult)) {
                    classifiedDiffResults.breakingDifferences.push(diffResult);
                } else if (isNonBreakingDiffResult(diffResult)) {
                    classifiedDiffResults.nonBreakingDifferences.push(diffResult);
                } else if (isUnclassifiedDiffResult(diffResult)) {
                    classifiedDiffResults.unclassifiedDifferences.push(diffResult);
                }
        });

        return classifiedDiffResults;
    }

    private static differenceToDiffResult(difference: Difference): DiffResult<DiffResultType> {
        const type = resultTypeFinder.lookup(difference.code);
        return Object.assign({type}, difference);
    }
}
