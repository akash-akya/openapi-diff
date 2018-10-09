import {DiffOutcomeSuccess} from '../../../lib/api-types';
import {buildArrayFromBuilders} from './builder-utils';
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

    public build(): DiffOutcomeSuccess {
        return {
            breakingDifferencesFound: false,
            nonBreakingDifferences: buildArrayFromBuilders(this.state.nonBreakingDifferences),
            unclassifiedDifferences: buildArrayFromBuilders(this.state.unclassifiedDifferences)
        };
    }
}

export const diffOutcomeSuccessBuilder = DiffOutcomeSuccessBuilder.defaultDiffOutcomeSuccessBuilder();
