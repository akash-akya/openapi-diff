import {OpenApiDiffOptions, SpecDetails, ValidationOutcome, ValidationResult} from './api-types';
import {toDiffEntry} from './openapi-diff/common/validation-result-to-diff-entry';
import {resultReporter} from './openapi-diff/result-reporter';
import {specDiffer} from './openapi-diff/spec-differ';
import {SpecLoader} from './openapi-diff/spec-loader';
import {specParser} from './openapi-diff/spec-parser';
import {OpenApi3, OpenApiDiffInternal, ParsedSpec, ResultObject, Swagger2} from './openapi-diff/types';

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

export class OpenApiDiff implements OpenApiDiffInternal {
    public constructor(private readonly specLoader: SpecLoader) {}

    public async validate(sourceSpecPath: string, destinationSpecPath: string): Promise<ResultObject> {
        const [sourceSpec, destinationSpec] = await this.loadSpecs(sourceSpecPath, destinationSpecPath);
        const diffs = await validateSourceAndDestinationSpecContent({
            destinationSpec: {
                content: destinationSpec,
                location: destinationSpecPath
            },
            sourceSpec: {
                content: sourceSpec,
                location: sourceSpecPath
            }
        });

        const allDifferences = diffs.info.concat(diffs.warnings).concat(diffs.errors);

        return resultReporter.build(allDifferences.map(toDiffEntry));
    }

    private async loadSpecs(sourceSpecPath: string, destinationSpecPath: string): Promise<Array<Swagger2 | OpenApi3>> {
        const whenSourceSpec = this.specLoader.load(sourceSpecPath);
        const whenDestinationSpec = this.specLoader.load(destinationSpecPath);
        return Promise.all([whenSourceSpec, whenDestinationSpec]);
    }
}
