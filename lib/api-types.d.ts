// tslint:disable:no-namespace

declare namespace OpenApiDiff {
    type DiffResultSource = 'json-schema-diff' | 'openapi-diff';

    export type DiffResultCode =
        'basePath.add' |
        'basePath.remove' |
        'host.add' |
        'host.remove' |
        'info.title.add' |
        'info.title.remove' |
        'info.description.add' |
        'info.description.remove' |
        'info.termsOfService.add' |
        'info.termsOfService.remove' |
        'info.version.add' |
        'info.version.remove' |
        'info.contact.name.add' |
        'info.contact.name.remove' |
        'info.contact.email.add' |
        'info.contact.email.remove' |
        'info.contact.url.add' |
        'info.contact.url.remove' |
        'info.license.name.add' |
        'info.license.name.remove' |
        'info.license.url.add' |
        'info.license.url.remove' |
        'schemes.add' |
        'schemes.remove' |
        'schemes.item.add' |
        'schemes.item.remove' |
        'unclassified.add' |
        'unclassified.remove' |
        'openapi.add' |
        'openapi.remove';

    export type DiffResultEntity =
        'basePath' |
        'host' |
        'info.title' |
        'info.description' |
        'info.termsOfService' |
        'info.version' |
        'info.contact.name' |
        'info.contact.email' |
        'info.contact.url' |
        'info.license.name' |
        'info.license.url' |
        'schemes' |
        'schemes.item' |
        'unclassified' |
        'openapi';

    export type DiffResultAction = 'add' | 'remove';

    export type DiffResultType =
        'breaking' |
        'unclassified' |
        'non-breaking';

    export interface Difference {
        action: DiffResultAction;
        code: DiffResultCode;
        entity: DiffResultEntity;
        sourceSpecEntityDetails: DiffResultSpecEntityDetails;
        destinationSpecEntityDetails: DiffResultSpecEntityDetails;
        source: DiffResultSource;
        details?: any;
    }

    export interface DiffResult extends Difference {
        type: DiffResultType;
    }

    export interface DiffResultSpecEntityDetails {
        location?: string;
        value?: any;
    }

    export type SpecFormat = 'swagger2' | 'openapi3';

    export interface SpecDetails {
        location: string;
        format: SpecFormat;
    }

    export interface DiffOutcomeFailure {
        breakingDifferences: DiffResult[];
        breakingDifferencesFound: true;
        destinationSpecDetails: SpecDetails;
        nonBreakingDifferences: DiffResult[];
        sourceSpecDetails: SpecDetails;
        unclassifiedDifferences: DiffResult[];
    }

    export interface DiffOutcomeSuccess {
        destinationSpecDetails: SpecDetails;
        breakingDifferencesFound: false;
        nonBreakingDifferences: DiffResult[];
        sourceSpecDetails: SpecDetails;
        unclassifiedDifferences: DiffResult[];
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
}

declare interface OpenApiDiffStatic {
    diffSpecs: (options: OpenApiDiff.OpenApiDiffOptions) => Promise<OpenApiDiff.DiffOutcome>;
}

declare const OpenApiDiff: OpenApiDiffStatic;
export = OpenApiDiff;
