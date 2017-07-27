// Diff types

import IDiff = deepDiff.IDiff;
import * as q from 'q';

export interface Diff {
    breakingChanges: DiffChange[];
    nonBreakingChanges: DiffChange[];
    unclassifiedChanges: DiffChange[];
}

export interface DiffChange extends IDiff {
    changeClass: DiffChangeClass;
    printablePath: string[];
    scope: string;
    taxonomy: DiffChangeTaxonomy;
    type: DiffChangeType;
}

export type DiffChangeTaxonomy =
    'info.object.edit' |
    'openapi.property.edit' |
    'unclassified.change';

export type DiffChangeType =
    'add' |
    'edit' |
    'delete' |
    'unknown';

export type DiffChangeClass =
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

export interface Swagger2Spec {
    info: OpenAPISpecInfo;
    [xProperty: string]: any;
    swagger: string;
}

export interface OpenAPI3Spec {
    info: OpenAPISpecInfo;
    [xProperty: string]: any;
    openapi: string;
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

export interface ParsedOpenApiProperty {
    originalPath: string[];
    parsedValue: string;
}

export interface ParsedSpec {
    info: ParsedInfoObject;
    openapi: ParsedOpenApiProperty;
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

export interface FileSystem {
    readFile: JsonLoaderFunction;
}

export interface HttpClient {
    get: JsonLoaderFunction;
}

export type JsonLoaderFunction = (location: string) => q.Promise<string>;

export interface OpenAPIDiff {
    run: (oldSpecPath: string, newSpecPath: string) => q.Promise<ResultObject>;
}

export interface XProperty {
    key: string;
    value: any;
}
