import {DiffOutcome} from '../../../../lib/api-types';
import {DiffResultBuilder} from './diff-result-builder';

interface DiffOutcomeBuilderState {
    breakingDifferences: DiffResultBuilder[];
    nonBreakingDifferences: DiffResultBuilder[];
    unclassifiedDifferences: DiffResultBuilder[];
}

export class DiffOutcomeFailureBuilder {
    public static defaultDiffOutcomeFailureBuilder() {
        return new DiffOutcomeFailureBuilder({
            breakingDifferences: [],
            nonBreakingDifferences: [],
            unclassifiedDifferences: []
        });
    }

    private constructor(private readonly state: DiffOutcomeBuilderState) {}

    public build(): DiffOutcome {
        return {
            breakingDifferences: this.state.breakingDifferences.map((builder) => builder.build()),
            breakingDifferencesFound: true,
            destinationSpecDetails: {
                format: 'swagger2',
                location: 'default-destination-spec-details-format'
            },
            nonBreakingDifferences: this.state.nonBreakingDifferences.map((builder) => builder.build()),
            sourceSpecDetails: {
                format: 'swagger2',
                location: 'default-source-spec-details-format'
            },
            unclassifiedDifferences: this.state.unclassifiedDifferences.map((builder) => builder.build())
        };
    }

    public withNonBreakingDifferences(nonBreakingDifferences: DiffResultBuilder[]): DiffOutcomeFailureBuilder {
        const copyOfNoneBreakingDifferences = Array.from(nonBreakingDifferences);
        return new DiffOutcomeFailureBuilder({
            breakingDifferences: this.state.breakingDifferences,
            nonBreakingDifferences: copyOfNoneBreakingDifferences,
            unclassifiedDifferences: this.state.unclassifiedDifferences
        });
    }

    public withBreakingDifferences(breakingDifferences: DiffResultBuilder[]): DiffOutcomeFailureBuilder {
        const copyOfBreakingDifferences = Array.from(breakingDifferences);
        return new DiffOutcomeFailureBuilder({
            breakingDifferences: copyOfBreakingDifferences,
            nonBreakingDifferences: this.state.nonBreakingDifferences,
            unclassifiedDifferences: this.state.unclassifiedDifferences
        });
    }

    public withUnclassifiedDifferences(unclassifiedDifferences: DiffResultBuilder[]): DiffOutcomeFailureBuilder {
        const copyOfUnclassifiedDifferences = Array.from(unclassifiedDifferences);
        return new DiffOutcomeFailureBuilder({
            breakingDifferences: this.state.breakingDifferences,
            nonBreakingDifferences: this.state.nonBreakingDifferences,
            unclassifiedDifferences: copyOfUnclassifiedDifferences
        });
    }
}

export const diffOutcomeFailureBuilder = DiffOutcomeFailureBuilder.defaultDiffOutcomeFailureBuilder();
