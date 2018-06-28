import {
    DiffResult, DiffResultAction, DiffResultCode, DiffResultEntity,
    DiffResultSource, DiffResultType
} from '../../../lib/api-types';
import {
    DiffResultSpecEntityDetailsBuilder
} from './diff-result-spec-entity-details-builder';
import {DifferenceBuilder, differenceBuilder} from './difference-builder';

interface DiffResultBuilderState {
    difference: DifferenceBuilder;
    type: DiffResultType;
}

export class DiffResultBuilder {
    public static defaultDiffResultBuilder() {
        return new DiffResultBuilder({
            difference: differenceBuilder,
            type: 'breaking'
        });
    }

    private constructor(private readonly state: DiffResultBuilderState) {}

    public withDifference(difference: DifferenceBuilder): DiffResultBuilder {
        return new DiffResultBuilder({
            difference,
            type: this.state.type
        });
    }

    public withType(type: DiffResultType): DiffResultBuilder {
        return new DiffResultBuilder({
            difference: this.state.difference,
            type
        });
    }

    public withAction(action: DiffResultAction): DiffResultBuilder {
        return new DiffResultBuilder({
            difference: this.state.difference.withAction(action),
            type: this.state.type
        });
    }

    public withCode(code: DiffResultCode): DiffResultBuilder {
        return new DiffResultBuilder({
            difference: this.state.difference.withCode(code),
            type: this.state.type
        });
    }

    public withEntity(entity: DiffResultEntity): DiffResultBuilder {
        return new DiffResultBuilder({
            difference: this.state.difference.withEntity(entity),
            type: this.state.type
        });
    }

    public withSource(source: DiffResultSource): DiffResultBuilder {
        return new DiffResultBuilder({
            difference: this.state.difference.withSource(source),
            type: this.state.type
        });
    }

    public withDestinationSpecEntityDetails(
        details: DiffResultSpecEntityDetailsBuilder
    ): DiffResultBuilder {
        return new DiffResultBuilder({
            difference: this.state.difference.withDestinationSpecEntityDetails(details),
            type: this.state.type
        });
    }

    public withSourceSpecEntityDetails(
        details: DiffResultSpecEntityDetailsBuilder
    ): DiffResultBuilder {
        return new DiffResultBuilder({
            difference: this.state.difference.withSourceSpecEntityDetails(details),
            type: this.state.type
        });
    }

    public build(): DiffResult {
        const difference = this.state.difference.build();
        return {...{type: this.state.type}, ...difference};
    }
}

export const diffResultBuilder = DiffResultBuilder.defaultDiffResultBuilder();
