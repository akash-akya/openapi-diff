import {
    ValidationResult, ValidationResultAction, ValidationResultEntity,
    ValidationResultSource, ValidationResultType
} from '../../../../lib/api-types';
import {
    specEntityDetailsBuilder, ValidationResultSpecEntityDetailsBuilder
} from './validation-result-spec-entity-details-builder';

interface ValidationResultBuilderState {
    action: ValidationResultAction;
    details?: any;
    entity: ValidationResultEntity;
    message?: string;
    source: ValidationResultSource;
    type: ValidationResultType;
    destinationSpecEntityDetails: ValidationResultSpecEntityDetailsBuilder;
    sourceSpecEntityDetails: ValidationResultSpecEntityDetailsBuilder;
}

export class ValidationResultBuilder {
    public static defaultValidationResultBuilder() {
        return new ValidationResultBuilder({
            action: 'add',
            destinationSpecEntityDetails: specEntityDetailsBuilder,
            details: undefined,
            entity: 'oad.host',
            source: 'openapi-diff',
            sourceSpecEntityDetails: specEntityDetailsBuilder,
            type: 'error'
        });
    }

    private constructor(private readonly state: ValidationResultBuilderState) {}

    public withType(type: ValidationResultType): ValidationResultBuilder {
        return new ValidationResultBuilder({
            action: this.state.action,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity: this.state.entity,
            message: this.state.message,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails,
            type
        });
    }

    public withAction(action: ValidationResultAction): ValidationResultBuilder {
        return new ValidationResultBuilder({
            action,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity: this.state.entity,
            message: this.state.message,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails,
            type: this.state.type
        });
    }

    public withEntity(entity: ValidationResultEntity): ValidationResultBuilder {
        return new ValidationResultBuilder({
            action: this.state.action,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity,
            message: this.state.message,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails,
            type: this.state.type
        });
    }

    public withSource(source: ValidationResultSource): ValidationResultBuilder {
        return new ValidationResultBuilder({
            action: this.state.action,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity: this.state.entity,
            message: this.state.message,
            source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails,
            type: this.state.type
        });
    }

    public withDestinationSpecEntityDetails(
        details: ValidationResultSpecEntityDetailsBuilder
    ): ValidationResultBuilder {
        return new ValidationResultBuilder({
            action: this.state.action,
            destinationSpecEntityDetails: details,
            details: this.state.details,
            entity: this.state.entity,
            message: this.state.message,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails,
            type: this.state.type
        });
    }

    public withSourceSpecEntityDetails(
        details: ValidationResultSpecEntityDetailsBuilder
    ): ValidationResultBuilder {
        return new ValidationResultBuilder({
            action: this.state.action,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails,
            details: this.state.details,
            entity: this.state.entity,
            message: this.state.message,
            source: this.state.source,
            sourceSpecEntityDetails: details,
            type: this.state.type
        });
    }

    public build(): ValidationResult {
        return {
            action: this.state.action,
            destinationSpecEntityDetails: this.state.destinationSpecEntityDetails.build(),
            entity: this.state.entity,
            source: this.state.source,
            sourceSpecEntityDetails: this.state.sourceSpecEntityDetails.build(),
            type: this.state.type
        };
    }
}

export const validationResultBuilder = ValidationResultBuilder.defaultValidationResultBuilder();
