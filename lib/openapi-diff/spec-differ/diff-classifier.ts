import {Difference, DiffResult} from '../../api-types';
import {resultTypeFinder} from './result-type-finder';

export interface ClassifiedDiffResults {
    breakingDifferences: DiffResult[];
    nonBreakingDifferences: DiffResult[];
    unclassifiedDifferences: DiffResult[];
}

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
                switch (diffResult.type) {
                case 'breaking':
                    classifiedDiffResults.breakingDifferences.push(diffResult);
                    break;
                case 'non-breaking':
                    classifiedDiffResults.nonBreakingDifferences.push(diffResult);
                    break;
                case 'unclassified':
                    classifiedDiffResults.unclassifiedDifferences.push(diffResult);
                    break;
            }
        });

        return classifiedDiffResults;
    }

    private static differenceToDiffResult(difference: Difference): DiffResult {
        const type = resultTypeFinder.lookup(difference.code);
        return Object.assign({type}, difference);
    }
}
