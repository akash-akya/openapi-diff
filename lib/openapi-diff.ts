import {OpenApiDiffOptions, SpecDetails, ValidationOutcome, ValidationResult} from './api-types';
import {resultReporterOld} from './openapi-diff/result-reporter-old';
import {specDiffer} from './openapi-diff/spec-differ';
import {SpecLoader} from './openapi-diff/spec-loader';
import {specParser} from './openapi-diff/spec-parser';
import {OpenApi3, ParsedSpec, ResultObject, Swagger2} from './openapi-diff/types';

interface ResultsByType {
    breakingDifferences: ValidationResult[];
    nonBreakingDifferences: ValidationResult[];
    unclassifiedDifferences: ValidationResult[];
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

    const success = resultsByType.breakingDifferences.length === 0;
    const failureReason = success
        ? undefined
        : createFailureReason(sourceSpecDetails.location, destinationSpecDetails.location);

    return {
        breakingDifferences: resultsByType.breakingDifferences,
        destinationSpecDetails,
        failureReason,
        nonBreakingDifferences: resultsByType.nonBreakingDifferences,
        sourceSpecDetails,
        success,
        unclassifiedDifferences: resultsByType.unclassifiedDifferences
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
        breakingDifferences: allResults.filter((result) => result.type === 'breaking'),
        nonBreakingDifferences: allResults.filter((result) => result.type === 'non-breaking'),
        unclassifiedDifferences: allResults.filter((result) => result.type === 'unclassified')
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

        return resultReporterOld.build(validationOutcome);
    }

    private async loadSpecs(sourceSpecPath: string, destinationSpecPath: string): Promise<Specs> {
        const whenSourceSpec = this.specLoader.load(sourceSpecPath);
        const whenDestinationSpec = this.specLoader.load(destinationSpecPath);
        const [sourceSpec, destinationSpec] = await Promise.all([whenSourceSpec, whenDestinationSpec]);
        return {sourceSpec, destinationSpec};
    }
}
