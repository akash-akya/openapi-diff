import {DiffOutcome, OpenApiDiffOptions, SpecDetails} from '../api-types';
import {ClassifiedDiffResults, DiffClassifier} from './spec-differ/diff-classifier';
import {DiffFinder} from './spec-differ/diff-finder';
import {SpecDeserialiser} from './spec-differ/spec-deserialiser';
import {specParser} from './spec-parser';

export class SpecDiffer {
    public static async diffSpecs({sourceSpec, destinationSpec}: OpenApiDiffOptions): Promise<DiffOutcome> {
        const loadedSourceSpec = SpecDeserialiser.load(sourceSpec);
        const loadedDestinationSpec = SpecDeserialiser.load(destinationSpec);

        const parsedSourceSpec = await specParser.parse(loadedSourceSpec, sourceSpec.location);
        const parsedDestinationSpec = await specParser.parse(loadedDestinationSpec, destinationSpec.location);

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

        return this.generateDiffOutcome(classifiedDifferences, sourceSpecDetails, destinationSpecDetails);
    }

    private static generateDiffOutcome(
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
}
