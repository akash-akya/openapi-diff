import {ValidationOutcome} from '../../../../lib/api-types';
import {ValidationResultBuilder} from './validation-result-builder';

interface ValidationOutcomeBuilderState {
    breakingDifferences: ValidationResultBuilder[];
    nonBreakingDifferences: ValidationResultBuilder[];
    success: boolean;
    unclassifiedDifferences: ValidationResultBuilder[];
}

export class ValidationOutcomeBuilder {
    public static defaultValidationOutcomeBuilder() {
        return new ValidationOutcomeBuilder({
            breakingDifferences: [],
            nonBreakingDifferences: [],
            success: true,
            unclassifiedDifferences: []
        });
    }

    private constructor(private readonly state: ValidationOutcomeBuilderState) {}

    public build(): ValidationOutcome {
        return {
            breakingDifferences: this.state.breakingDifferences.map((builder) => builder.build()),
            destinationSpecDetails: {
                format: 'swagger2',
                location: 'default-destination-spec-details-format'
            },
            failureReason: undefined,
            nonBreakingDifferences: this.state.nonBreakingDifferences.map((builder) => builder.build()),
            sourceSpecDetails: {
                format: 'swagger2',
                location: 'default-source-spec-details-format'
            },
            success: this.state.success,
            unclassifiedDifferences: this.state.unclassifiedDifferences.map((builder) => builder.build())
        };
    }

    public withNonBreakingDifferences(nonBreakingDifferences: ValidationResultBuilder[]): ValidationOutcomeBuilder {
        const copyOfNoneBreakingDifferences = Array.from(nonBreakingDifferences);
        return new ValidationOutcomeBuilder({
            breakingDifferences: this.state.breakingDifferences,
            nonBreakingDifferences: copyOfNoneBreakingDifferences,
            success: this.state.success,
            unclassifiedDifferences: this.state.unclassifiedDifferences
        });
    }

    public withBreakingDifferences(breakingDifferences: ValidationResultBuilder[]): ValidationOutcomeBuilder {
        const copyOfBreakingDifferences = Array.from(breakingDifferences);
        return new ValidationOutcomeBuilder({
            breakingDifferences: copyOfBreakingDifferences,
            nonBreakingDifferences: this.state.nonBreakingDifferences,
            success: this.state.success,
            unclassifiedDifferences: this.state.unclassifiedDifferences
        });
    }

    public withSuccess(success: boolean): ValidationOutcomeBuilder {
        return new ValidationOutcomeBuilder({
            breakingDifferences: this.state.breakingDifferences,
            nonBreakingDifferences: this.state.nonBreakingDifferences,
            success,
            unclassifiedDifferences: this.state.unclassifiedDifferences
        });
    }

    public withUnclassifiedDifferences(unclassifiedDifferences: ValidationResultBuilder[]): ValidationOutcomeBuilder {
        const copyOfUnclassifiedDifferences = Array.from(unclassifiedDifferences);
        return new ValidationOutcomeBuilder({
            breakingDifferences: this.state.breakingDifferences,
            nonBreakingDifferences: this.state.nonBreakingDifferences,
            success: this.state.success,
            unclassifiedDifferences: copyOfUnclassifiedDifferences
        });
    }
}

export const validationOutcomeBuilder = ValidationOutcomeBuilder.defaultValidationOutcomeBuilder();
