// tslint:disable:no-namespace

declare namespace OpenApiDiff {
    type DiffResultSource = 'json-schema-diff' | 'openapi-diff';

    export type DiffResultCode =
        'path.add' |
        'path.remove' |
        'method.add' |
        'method.remove' |
        'request.body.scope.add' |
        'request.body.scope.remove' |
        'unclassified.add' |
        'unclassified.remove';

    export type DiffResultEntity =
        'path' |
        'method' |
        'request.body.scope' |
        'unclassified';

    export type DiffResultAction = 'add' | 'remove';

    export type DiffResultType =
        'breaking' |
        'unclassified' |
        'non-breaking';

    export interface DiffResult<T extends DiffResultType> {
        action: DiffResultAction;
        code: DiffResultCode;
        entity: DiffResultEntity;
        sourceSpecEntityDetails: DiffResultSpecEntityDetails[];
        destinationSpecEntityDetails: DiffResultSpecEntityDetails[];
        source: DiffResultSource;
        details?: any;
        type: T;
    }

    export interface DiffResultSpecEntityDetails {
        location: string;
        value?: any;
    }

    export type SpecFormat = 'swagger2' | 'openapi3';

    export interface SpecDetails {
        location: string;
        format: SpecFormat;
    }

    export interface DiffOutcomeFailure {
        breakingDifferences: Array<DiffResult<'breaking'>>;
        breakingDifferencesFound: true;
        destinationSpecDetails: SpecDetails;
        nonBreakingDifferences: Array<DiffResult<'non-breaking'>>;
        sourceSpecDetails: SpecDetails;
        unclassifiedDifferences: Array<DiffResult<'unclassified'>>;
    }

    export interface DiffOutcomeSuccess {
        destinationSpecDetails: SpecDetails;
        breakingDifferencesFound: false;
        nonBreakingDifferences: Array<DiffResult<'non-breaking'>>;
        sourceSpecDetails: SpecDetails;
        unclassifiedDifferences: Array<DiffResult<'unclassified'>>;
    }

    export type DiffOutcome = DiffOutcomeSuccess | DiffOutcomeFailure;

    export interface SpecOption {
        content: string;
        location: string;
    }

    export interface OpenApiDiffOptions {
        sourceSpec: SpecOption;
        destinationSpec: SpecOption;
    }

    export type ErrorCode =
        'OPENAPI_DIFF_SPEC_DESERIALISER_ERROR' |
        'OPENAPI_DIFF_FILE_SYSTEM_ERROR' |
        'OPENAPI_DIFF_VALIDATE_SWAGGER_2_ERROR' |
        'OPENAPI_DIFF_VALIDATE_OPENAPI_3_ERROR' |
        'OPENAPI_DIFF_HTTP_CLIENT_ERROR';

    export interface OpenApiDiffError extends Error {
        code: ErrorCode;
    }
}

declare interface OpenApiDiffStatic {
    diffSpecs: (options: OpenApiDiff.OpenApiDiffOptions) => Promise<OpenApiDiff.DiffOutcome>;
}

declare const OpenApiDiff: OpenApiDiffStatic;
export = OpenApiDiff;
