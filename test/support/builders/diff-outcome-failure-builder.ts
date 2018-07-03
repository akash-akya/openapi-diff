import {DiffOutcome} from '../../../lib/api-types';
import {DiffResultBuilder} from './diff-result-builder';
import {specDetailsBuilder, SpecDetailsBuilder} from './spec-details-builder';

interface DiffOutcomeBuilderState {
    breakingDifferences: Array<DiffResultBuilder<'breaking'>>;
    destinationSpecDetails: SpecDetailsBuilder;
    nonBreakingDifferences: Array<DiffResultBuilder<'non-breaking'>>;
    sourceSpecDetails: SpecDetailsBuilder;
    unclassifiedDifferences: Array<DiffResultBuilder<'unclassified'>>;
}

export class DiffOutcomeFailureBuilder {
    public static defaultDiffOutcomeFailureBuilder() {
        return new DiffOutcomeFailureBuilder({
            breakingDifferences: [],
            destinationSpecDetails: specDetailsBuilder,
            nonBreakingDifferences: [],
            sourceSpecDetails: specDetailsBuilder,
            unclassifiedDifferences: []
        });
    }

    private constructor(private readonly state: DiffOutcomeBuilderState) {}

    public build(): DiffOutcome {
        return {
            breakingDifferences: this.state.breakingDifferences.map((builder) => builder.build()),
            breakingDifferencesFound: true,
            destinationSpecDetails: this.state.destinationSpecDetails.build(),
            nonBreakingDifferences: this.state.nonBreakingDifferences.map((builder) => builder.build()),
            sourceSpecDetails: this.state.sourceSpecDetails.build(),
            unclassifiedDifferences: this.state.unclassifiedDifferences.map((builder) => builder.build())
        };
    }

    public withNonBreakingDifferences(
        nonBreakingDifferences: Array<DiffResultBuilder<'non-breaking'>>
    ): DiffOutcomeFailureBuilder {
        const copyOfNoneBreakingDifferences = Array.from(nonBreakingDifferences);
        return new DiffOutcomeFailureBuilder({...this.state, nonBreakingDifferences: copyOfNoneBreakingDifferences});
    }

    public withBreakingDifferences(
        breakingDifferences: Array<DiffResultBuilder<'breaking'>>
    ): DiffOutcomeFailureBuilder {
        const copyOfBreakingDifferences = Array.from(breakingDifferences);
        return new DiffOutcomeFailureBuilder({...this.state, breakingDifferences: copyOfBreakingDifferences});
    }

    public withUnclassifiedDifferences(
        unclassifiedDifferences: Array<DiffResultBuilder<'unclassified'>>
    ): DiffOutcomeFailureBuilder {
        const copyOfUnclassifiedDifferences = Array.from(unclassifiedDifferences);
        return new DiffOutcomeFailureBuilder({...this.state, unclassifiedDifferences: copyOfUnclassifiedDifferences});
    }

    public withSourceSpecDetails(sourceSpecDetails: SpecDetailsBuilder): DiffOutcomeFailureBuilder {
        return new DiffOutcomeFailureBuilder({...this.state, sourceSpecDetails});
    }

    public withDestinationSpecDetails(destinationSpecDetails: SpecDetailsBuilder): DiffOutcomeFailureBuilder {
        return new DiffOutcomeFailureBuilder({...this.state, destinationSpecDetails});
    }
}

export const diffOutcomeFailureBuilder = DiffOutcomeFailureBuilder.defaultDiffOutcomeFailureBuilder();
