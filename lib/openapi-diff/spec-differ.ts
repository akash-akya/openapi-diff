import {DiffOutcome, DiffResult, OpenApiDiffOptions, SpecDetails} from '../api-types';
import {DiffClassifier} from './spec-differ/diff-classifier';
import {DiffFinder} from './spec-differ/diff-finder';
import {SpecLoader} from './spec-differ/spec-loader';
import {specFinder} from './spec-finder';
import {specParser} from './spec-parser';
import {ClassifiedDiffResults, ParsedSpec} from './types';

interface ResultsByType {
    breakingDifferences: DiffResult[];
    nonBreakingDifferences: DiffResult[];
    unclassifiedDifferences: DiffResult[];
}

export class SpecDiffer {
    public static async diffSpecs({sourceSpec, destinationSpec}: OpenApiDiffOptions): Promise<DiffOutcome> {
        const loadedSourceSpec = SpecLoader.load(sourceSpec);
        const loadedDestinationSpec = SpecLoader.load(destinationSpec);

        const parsedSourceSpec = specParser.parse(loadedSourceSpec);
        const parsedDestinationSpec = specParser.parse(loadedDestinationSpec);

        const resultsByType = await this.diffSourceAndDestinationParsedSpecs(
            parsedSourceSpec, parsedDestinationSpec
        );

        const sourceSpecDetails: SpecDetails = {
            format: parsedSourceSpec.format,
            location: sourceSpec.location
        };
        const destinationSpecDetails: SpecDetails = {
            format: parsedDestinationSpec.format,
            location: destinationSpec.location
        };

        return this.generateDiffOutcome(resultsByType, sourceSpecDetails, destinationSpecDetails);
    }

    public static async newDiffSpecs({sourceSpec, destinationSpec}: OpenApiDiffOptions): Promise<DiffOutcome> {
        const loadedSourceSpec = SpecLoader.load(sourceSpec);
        const loadedDestinationSpec = SpecLoader.load(destinationSpec);

        const parsedSourceSpec = specParser.parse(loadedSourceSpec);
        const parsedDestinationSpec = specParser.parse(loadedDestinationSpec);

        const differences = await DiffFinder.findDifferences({
            destinationSpec: parsedDestinationSpec,
            sourceSpec: parsedSourceSpec
        });

        const classifiedDifferences = DiffClassifier.classifyDifferences(differences);

        const sourceSpecDetails: SpecDetails = {
            format: parsedSourceSpec.format,
            location: sourceSpec.location
        };

        const destinationSpecDetails: SpecDetails = {
            format: parsedDestinationSpec.format,
            location: destinationSpec.location
        };

        return this.newGenerateDiffOutcome(classifiedDifferences, sourceSpecDetails, destinationSpecDetails);
    }

    private static newGenerateDiffOutcome(
        classifiedDifferences: ClassifiedDiffResults,
        sourceSpecDetails: SpecDetails,
        destinationSpecDetails: SpecDetails
    ): DiffOutcome {

        const breakingDifferencesFound = classifiedDifferences.breakingDifferences.length > 0;

        if (breakingDifferencesFound) {
            return {
                breakingDifferences: classifiedDifferences.breakingDifferences,
                breakingDifferencesFound,
                destinationSpecDetails,
                nonBreakingDifferences: classifiedDifferences.nonBreakingDifferences,
                sourceSpecDetails,
                unclassifiedDifferences: classifiedDifferences.unclassifiedDifferences
            };
        } else {
            return {
                breakingDifferencesFound,
                destinationSpecDetails,
                nonBreakingDifferences: classifiedDifferences.nonBreakingDifferences,
                sourceSpecDetails,
                unclassifiedDifferences: classifiedDifferences.unclassifiedDifferences
            };
        }
    }

    private static generateDiffOutcome(
        resultsByType: ResultsByType, sourceSpecDetails: SpecDetails, destinationSpecDetails: SpecDetails
    ): DiffOutcome {

        const breakingDifferencesFound = resultsByType.breakingDifferences.length > 0;

        if (breakingDifferencesFound) {
            return {
                breakingDifferences: resultsByType.breakingDifferences,
                breakingDifferencesFound,
                destinationSpecDetails,
                nonBreakingDifferences: resultsByType.nonBreakingDifferences,
                sourceSpecDetails,
                unclassifiedDifferences: resultsByType.unclassifiedDifferences
            };
        } else {
            return {
                breakingDifferencesFound,
                destinationSpecDetails,
                nonBreakingDifferences: resultsByType.nonBreakingDifferences,
                sourceSpecDetails,
                unclassifiedDifferences: resultsByType.unclassifiedDifferences
            };
        }
    }

    private static async diffSourceAndDestinationParsedSpecs(
        source: ParsedSpec, destination: ParsedSpec
    ): Promise<ResultsByType> {
        const allResults = await specFinder.diff(source, destination);
        return {
            breakingDifferences: allResults.filter((result) => result.type === 'breaking'),
            nonBreakingDifferences: allResults.filter((result) => result.type === 'non-breaking'),
            unclassifiedDifferences: allResults.filter((result) => result.type === 'unclassified')
        };
    }
}
