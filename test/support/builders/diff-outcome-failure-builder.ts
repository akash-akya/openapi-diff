import {DiffOutcome} from '../../../lib/api-types';
import {DiffResultBuilder} from './diff-result-builder';

interface DiffOutcomeBuilderState {
    breakingDifferences: Array<DiffResultBuilder<'breaking'>>;
    nonBreakingDifferences: Array<DiffResultBuilder<'non-breaking'>>;
    unclassifiedDifferences: Array<DiffResultBuilder<'unclassified'>>;
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
            nonBreakingDifferences: this.state.nonBreakingDifferences.map((builder) => builder.build()),
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
}

export const diffOutcomeFailureBuilder = DiffOutcomeFailureBuilder.defaultDiffOutcomeFailureBuilder();
