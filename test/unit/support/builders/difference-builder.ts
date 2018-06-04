import {
    Difference, DiffResultAction, DiffResultCode, DiffResultEntity, DiffResultSource
} from '../../../../lib/api-types';
import {
    DiffResultSpecEntityDetailsBuilder, specEntityDetailsBuilder
} from './diff-result-spec-entity-details-builder';

interface DifferenceBuilderState {
    action: DiffResultAction;
    details?: any;
    entity: DiffResultEntity;
    code: DiffResultCode;
    source: DiffResultSource;
    destinationSpecEntityDetails: DiffResultSpecEntityDetailsBuilder;
    sourceSpecEntityDetails: DiffResultSpecEntityDetailsBuilder;
}

export class DifferenceBuilder {
    public static defaultDifferenceBuilder() {
        return new DifferenceBuilder({
            action: 'add',
            code: 'host.add',
            destinationSpecEntityDetails: specEntityDetailsBuilder,
            details: undefined,
            entity: 'host',
            source: 'openapi-diff',
            sourceSpecEntityDetails: specEntityDetailsBuilder
        });
    }

    private constructor(private readonly state: DifferenceBuilderState) {}

    public withAction(action: DiffResultAction): DifferenceBuilder {
        return new DifferenceBuilder({
            action,
            code: this.state.code,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity: this.state.entity,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails
        });
    }

    public withEntity(entity: DiffResultEntity): DifferenceBuilder {
        return new DifferenceBuilder({
            action: this.state.action,
            code: this.state.code,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails
        });
    }

    public withCode(code: DiffResultCode): DifferenceBuilder {
        return new DifferenceBuilder({
            action: this.state.action,
            code,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity: this.state.entity,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails
        });
    }
    public withSource(source: DiffResultSource): DifferenceBuilder {
        return new DifferenceBuilder({
            action: this.state.action,
            code: this.state.code,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity: this.state.entity,
            source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails
        });
    }

    public withDestinationSpecEntityDetails(
        details: DiffResultSpecEntityDetailsBuilder
    ): DifferenceBuilder {
        return new DifferenceBuilder({
            action: this.state.action,
            code: this.state.code,
            destinationSpecEntityDetails: details,
            details: this.state.details,
            entity: this.state.entity,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails
        });
    }

    public withSourceSpecEntityDetails(
        details: DiffResultSpecEntityDetailsBuilder
    ): DifferenceBuilder {
        return new DifferenceBuilder({
            action: this.state.action,
            code: this.state.code,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity: this.state.entity,
            source: this.state.source,
            sourceSpecEntityDetails: details
        });
    }

    public build(): Difference {
        return {
            action: this.state.action,
            code: this.state.code,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails.build(),
            entity: this.state.entity,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails.build()
        };
    }
}

export const differenceBuilder = DifferenceBuilder.defaultDifferenceBuilder();
