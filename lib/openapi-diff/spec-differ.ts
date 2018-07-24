import {DiffOutcome} from '../api-types';
import {DiffSpecsOptions, SerialisedSpec} from '../openapi-diff';
import {ClassifiedDiffResults, DiffClassifier} from './spec-differ/diff-classifier';
import {DiffFinder, ParsedSpecs} from './spec-differ/diff-finder';
import {SpecDeserialiser} from './spec-differ/spec-deserialiser';
import {SpecParser} from './spec-parser';
import {ParsedSpec} from './spec-parser-types';

export class SpecDiffer {
    public static async diffSpecs(options: DiffSpecsOptions): Promise<DiffOutcome> {
        const parsedSpecs = await this.toParsedSpecs(options);
        const differences = await DiffFinder.findDifferences(parsedSpecs);
        const classifiedDifferences = DiffClassifier.classifyDifferences(differences);

        return this.createDiffOutcome(classifiedDifferences);
    }

    private static createDiffOutcome(classifiedDifferences: ClassifiedDiffResults): DiffOutcome {

        const breakingDifferencesFound = classifiedDifferences.breakingDifferences.length > 0;

        return breakingDifferencesFound
            ? {
                breakingDifferences: classifiedDifferences.breakingDifferences,
                breakingDifferencesFound,
                nonBreakingDifferences: classifiedDifferences.nonBreakingDifferences,
                unclassifiedDifferences: classifiedDifferences.unclassifiedDifferences
            }
            : {
                breakingDifferencesFound,
                nonBreakingDifferences: classifiedDifferences.nonBreakingDifferences,
                unclassifiedDifferences: classifiedDifferences.unclassifiedDifferences
            };
    }

    private static async toParsedSpecs(options: DiffSpecsOptions): Promise<ParsedSpecs> {
        const [sourceSpec, destinationSpec] = await Promise.all([
            this.toParsedSpec(options.sourceSpec),
            this.toParsedSpec(options.destinationSpec)
        ]);
        return {sourceSpec, destinationSpec};
    }

    private static toParsedSpec(serialisedSpec: SerialisedSpec): Promise<ParsedSpec> {
        const deserialisedContent = SpecDeserialiser.load(serialisedSpec);
        return SpecParser.parse({
            content: deserialisedContent,
            location: serialisedSpec.location,
            unverifiedFormat: serialisedSpec.format
        });
    }
}
