// Diff types

import IDiff = deepDiff.IDiff;
import * as q from 'q';

export interface Diff {
    breakingChanges: DiffChange[];
    nonBreakingChanges: DiffChange[];
    unclassifiedChanges: DiffChange[];
}

export interface DiffChange extends IDiff {
    taxonomy: DiffChangeTaxonomy;
    type: DiffChangeType;
}

export type DiffChangeTaxonomy =
    'info.object.edit' |
    'zzz.unclassified.change';

export type DiffChangeType =
    'breaking' |
    'non-breaking' |
    'unclassified';

// Open API types

export interface OpenAPISpecInfo {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ParsedContactObject;
    licence?: ParsedLicenseObject;
    version: string;
    [xProperty: string]: any;
}

export interface OpenAPISpec {
    info: OpenAPISpecInfo;
    [xProperty: string]: any;
}

// Parsed Spec types

export interface ParsedContactObject {
    name?: string;
    url?: string;
    email?: string;
}

export interface ParsedInfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ParsedContactObject;
    licence?: ParsedLicenseObject;
    version: string;
    [xProperty: string]: any;
}

export interface ParsedLicenseObject {
    name: string;
    url?: string;
}

export interface ParsedSpec {
    info: ParsedInfoObject;
    [xProperty: string]: any;
}

// Result types

export interface ResultDiff {
    breakingChanges: DiffChange[];
    nonBreakingChanges: DiffChange[];
    unclassifiedChanges: DiffChange[];
}

export interface ResultObject {
    changeList: string[];
    summary: string[];
}

// Various other types

export interface OpenAPIDiff {
    run: (oldSpecPath: string, newSpecPath: string) => q.Promise<ResultObject>;
}

export interface XProperty {
    key: string;
    value: any;
}
