import {OpenApiDiffOptions, SpecDetails, ValidationOutcome, ValidationResult} from './api-types';
import {resultReporter} from './openapi-diff/result-reporter';
import {specDiffer} from './openapi-diff/spec-differ';
import {SpecLoader} from './openapi-diff/spec-loader';
import {specParser} from './openapi-diff/spec-parser';
import {OpenApi3, ParsedSpec, ResultObject, Swagger2} from './openapi-diff/types';

interface ResultsByType {
    errors: ValidationResult[];
    info: ValidationResult[];
    warnings: ValidationResult[];
}

export const validateSourceAndDestinationSpecContent = async (
    {sourceSpec, destinationSpec}: OpenApiDiffOptions
): Promise<ValidationOutcome> => {
    const parsedSourceSpec = specParser.parse(sourceSpec.content);
    const parsedDestinationSpec = specParser.parse(destinationSpec.content);

    const resultsByType = await validateSourceAndDestinationParsedSpecs(parsedSourceSpec, parsedDestinationSpec);

    const sourceSpecDetails: SpecDetails = {
        format: parsedSourceSpec.format,
        location: sourceSpec.location
    };
    const destinationSpecDetails: SpecDetails = {
        format: parsedDestinationSpec.format,
        location: destinationSpec.location
    };

    return generateValidationOutcome(resultsByType, sourceSpecDetails, destinationSpecDetails);
};

const generateValidationOutcome = (
    resultsByType: ResultsByType, sourceSpecDetails: SpecDetails, destinationSpecDetails: SpecDetails
): ValidationOutcome => {

    const success = resultsByType.errors.length === 0;
    const failureReason = success
        ? undefined
        : createFailureReason(sourceSpecDetails.location, destinationSpecDetails.location);

    return {
        destinationSpecDetails,
        errors: resultsByType.errors,
        failureReason,
        info: resultsByType.info,
        sourceSpecDetails,
        success,
        warnings: resultsByType.warnings
    };
};

const createFailureReason = (sourceLocation: string, destinationLocation: string): string =>
    `destination spec "${destinationLocation}" introduced breaking changes ` +
    `with respect to source spec "${sourceLocation}"`;

const validateSourceAndDestinationParsedSpecs = async (
    source: ParsedSpec, destination: ParsedSpec
): Promise<ResultsByType> => {
    const allResults = await specDiffer.diff(source, destination);
    return {
        errors: allResults.filter((result) => result.type === 'error'),
        info: allResults.filter((result) => result.type === 'info'),
        warnings: allResults.filter((result) => result.type === 'warning')
    };
};

interface Specs {
    destinationSpec: Swagger2 | OpenApi3;
    sourceSpec: Swagger2 | OpenApi3;
}

export class OpenApiDiff {
    public constructor(private readonly specLoader: SpecLoader) {}

    public async validate(sourceSpecPath: string, destinationSpecPath: string): Promise<ResultObject> {
        const {sourceSpec, destinationSpec} = await this.loadSpecs(sourceSpecPath, destinationSpecPath);
        const validationOutcome = await validateSourceAndDestinationSpecContent({
            destinationSpec: {
                content: destinationSpec,
                location: destinationSpecPath
            },
            sourceSpec: {
                content: sourceSpec,
                location: sourceSpecPath
            }
        });

        return resultReporter.build(validationOutcome);
    }

    private async loadSpecs(sourceSpecPath: string, destinationSpecPath: string): Promise<Specs> {
        const whenSourceSpec = this.specLoader.load(sourceSpecPath);
        const whenDestinationSpec = this.specLoader.load(destinationSpecPath);
        const [sourceSpec, destinationSpec] = await Promise.all([whenSourceSpec, whenDestinationSpec]);
        return {sourceSpec, destinationSpec};
    }
}
