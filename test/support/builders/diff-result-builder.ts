import * as _ from 'lodash';
import {
    DiffResult,
    DiffResultAction,
    DiffResultCode,
    DiffResultEntity,
    DiffResultSource,
    DiffResultType
} from '../../../lib/api-types';
import {DiffResultSpecEntityDetailsBuilder} from './diff-result-spec-entity-details-builder';

interface DiffResultBuilderState<T extends DiffResultType> {
    action: DiffResultAction;
    details?: any;
    entity: DiffResultEntity;
    code: DiffResultCode;
    source: DiffResultSource;
    destinationSpecEntityDetails: DiffResultSpecEntityDetailsBuilder[];
    sourceSpecEntityDetails: DiffResultSpecEntityDetailsBuilder[];
    type: T;
}

export class DiffResultBuilder<T extends DiffResultType> {
    public static defaultDiffResultBuilder<T extends DiffResultType>(type: T) {
        return new DiffResultBuilder({
            action: 'add',
            code: 'path.add',
            destinationSpecEntityDetails: [],
            details: undefined,
            entity: 'path',
            source: 'openapi-diff',
            sourceSpecEntityDetails: [],
            type
        });
    }

    private constructor(private readonly state: DiffResultBuilderState<T>) {}

    public withAction(action: DiffResultAction): DiffResultBuilder<T> {
        return new DiffResultBuilder({...this.state, action});
    }

    public withCode(code: DiffResultCode): DiffResultBuilder<T> {
        return new DiffResultBuilder({...this.state, code});    }

    public withEntity(entity: DiffResultEntity): DiffResultBuilder<T> {
        return new DiffResultBuilder({...this.state, entity});
    }

    public withSource(source: DiffResultSource): DiffResultBuilder<T> {
        return new DiffResultBuilder({...this.state, source});    }

    public withDestinationSpecEntityDetails(
        destinationSpecEntityDetails: DiffResultSpecEntityDetailsBuilder[]
    ): DiffResultBuilder<T> {
        return new DiffResultBuilder({
            ...this.state,
            destinationSpecEntityDetails: [...destinationSpecEntityDetails]
        });
    }

    public withSourceSpecEntityDetails(
        sourceSpecEntityDetails: DiffResultSpecEntityDetailsBuilder[]
    ): DiffResultBuilder<T> {
        return new DiffResultBuilder({
            ...this.state,
            sourceSpecEntityDetails: [...sourceSpecEntityDetails]
        });
    }

    public withDetails(details: any): DiffResultBuilder<T> {
        const copyOfDetails = _.cloneDeep(details);
        return new DiffResultBuilder({...this.state, details: copyOfDetails});
    }

    public build(): DiffResult<T> {
        const diffResult: DiffResult<T> =  {
            action: this.state.action,
            code: this.state.code,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails
                .map((builder) => builder.build()),
            entity: this.state.entity,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails
                .map((builder) => builder.build()),
            type: this.state.type
        };
        if (this.state.details) {
            diffResult.details = _.cloneDeep(this.state.details);
        }
        return diffResult;
    }
}

export const breakingDiffResultBuilder = DiffResultBuilder.defaultDiffResultBuilder('breaking');
export const nonBreakingDiffResultBuilder = DiffResultBuilder.defaultDiffResultBuilder('non-breaking');
export const unclassifiedDiffResultBuilder = DiffResultBuilder.defaultDiffResultBuilder('unclassified');
