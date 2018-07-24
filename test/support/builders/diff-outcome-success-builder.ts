import {DiffOutcomeSuccess} from '../../../lib/api-types';
import {DiffResultBuilder} from './diff-result-builder';

interface DiffOutcomeBuilderState {
    nonBreakingDifferences: Array<DiffResultBuilder<'non-breaking'>>;
    unclassifiedDifferences: Array<DiffResultBuilder<'unclassified'>>;
}

export class DiffOutcomeSuccessBuilder {
    public static defaultDiffOutcomeSuccessBuilder() {
        return new DiffOutcomeSuccessBuilder({
            nonBreakingDifferences: [],
            unclassifiedDifferences: []
        });
    }

    private constructor(private readonly state: DiffOutcomeBuilderState) {}

    public build(): DiffOutcomeSuccess {
        return {
            breakingDifferencesFound: false,
            nonBreakingDifferences: this.state.nonBreakingDifferences.map((builder) => builder.build()),
            unclassifiedDifferences: this.state.unclassifiedDifferences.map((builder) => builder.build())
        };
    }

    public withNonBreakingDifferences(
        nonBreakingDifferences: Array<DiffResultBuilder<'non-breaking'>>
    ): DiffOutcomeSuccessBuilder {
        const copyOfNoneBreakingDifferences = Array.from(nonBreakingDifferences);
        return new DiffOutcomeSuccessBuilder({...this.state, nonBreakingDifferences: copyOfNoneBreakingDifferences});
    }

    public withUnclassifiedDifferences(
        unclassifiedDifferences: Array<DiffResultBuilder<'unclassified'>>
    ): DiffOutcomeSuccessBuilder {
        const copyOfUnclassifiedDifferences = Array.from(unclassifiedDifferences);
        return new DiffOutcomeSuccessBuilder({...this.state, unclassifiedDifferences: copyOfUnclassifiedDifferences});
    }
}

export const diffOutcomeSuccessBuilder = DiffOutcomeSuccessBuilder.defaultDiffOutcomeSuccessBuilder();
