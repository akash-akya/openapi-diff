import {DiffOutcomeSuccess} from '../../../../lib/api-types';
import {DiffResultBuilder} from './diff-result-builder';
import {specDetailsBuilder, SpecDetailsBuilder} from './spec-details-builder';

interface DiffOutcomeBuilderState {
    sourceSpecDetails: SpecDetailsBuilder;
    destinationSpecDetails: SpecDetailsBuilder;
    nonBreakingDifferences: DiffResultBuilder[];
    unclassifiedDifferences: DiffResultBuilder[];
}

export class DiffOutcomeSuccessBuilder {
    public static defaultDiffOutcomeSuccessBuilder() {
        return new DiffOutcomeSuccessBuilder({
            destinationSpecDetails: specDetailsBuilder,
            nonBreakingDifferences: [],
            sourceSpecDetails: specDetailsBuilder,
            unclassifiedDifferences: []
        });
    }

    private constructor(private readonly state: DiffOutcomeBuilderState) {}

    public build(): DiffOutcomeSuccess {
        return {
            breakingDifferencesFound: false,
            destinationSpecDetails: this.state.destinationSpecDetails.build(),
            nonBreakingDifferences: this.state.nonBreakingDifferences.map((builder) => builder.build()),
            sourceSpecDetails: this.state.sourceSpecDetails.build(),
            unclassifiedDifferences: this.state.unclassifiedDifferences.map((builder) => builder.build())
        };
    }

    public withSourceSpecDetails(specDetails: SpecDetailsBuilder): DiffOutcomeSuccessBuilder {
        return new DiffOutcomeSuccessBuilder({
            destinationSpecDetails: this.state.destinationSpecDetails,
            nonBreakingDifferences: this.state.nonBreakingDifferences,
            sourceSpecDetails: specDetails,
            unclassifiedDifferences: this.state.unclassifiedDifferences
        });
    }

    public withDestinationSpecDetails(specDetails: SpecDetailsBuilder): DiffOutcomeSuccessBuilder {
        return new DiffOutcomeSuccessBuilder({
            destinationSpecDetails: specDetails,
            nonBreakingDifferences: this.state.nonBreakingDifferences,
            sourceSpecDetails: this.state.sourceSpecDetails,
            unclassifiedDifferences: this.state.unclassifiedDifferences
        });
    }

    public withNonBreakingDifferences(
        nonBreakingDifferences: DiffResultBuilder[]
    ): DiffOutcomeSuccessBuilder {
        const copyOfNoneBreakingDifferences = Array.from(nonBreakingDifferences);
        return new DiffOutcomeSuccessBuilder({
            destinationSpecDetails: this.state.destinationSpecDetails,
            nonBreakingDifferences: copyOfNoneBreakingDifferences,
            sourceSpecDetails: this.state.sourceSpecDetails,
            unclassifiedDifferences: this.state.unclassifiedDifferences
        });
    }

    public withUnclassifiedDifferences(
        unclassifiedDifferences: DiffResultBuilder[]
    ): DiffOutcomeSuccessBuilder {
        const copyOfUnclassifiedDifferences = Array.from(unclassifiedDifferences);
        return new DiffOutcomeSuccessBuilder({
            destinationSpecDetails: this.state.destinationSpecDetails,
            nonBreakingDifferences: this.state.nonBreakingDifferences,
            sourceSpecDetails: this.state.sourceSpecDetails,
            unclassifiedDifferences: copyOfUnclassifiedDifferences
        });
    }
}

export const diffOutcomeSuccessBuilder = DiffOutcomeSuccessBuilder.defaultDiffOutcomeSuccessBuilder();
