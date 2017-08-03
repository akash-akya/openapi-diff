// Diff types

import IDiff = deepDiff.IDiff;
import * as q from 'q';

export interface DiffChange extends IDiff {
    severity: DiffChangeSeverity;
    printablePath: string[];
    scope: string;
    taxonomy: DiffChangeTaxonomy;
    type: DiffChangeType;
}

export type DiffChangeTaxonomy =
    'basePath.property.add' |
    'basePath.property.delete' |
    'basePath.property.edit' |
    'host.property.add' |
    'host.property.delete' |
    'host.property.edit' |
    'info.object.edit' |
    'openapi.property.edit' |
    'schemes.property.add' |
    'schemes.property.arrayContent.add' |
    'schemes.property.arrayContent.delete' |
    'schemes.property.edit' |
    'schemes.property.delete' |
    'unclassified.change';

export type DiffChangeType =
    'add' |
    'arrayContent.add' |
    'arrayContent.delete' |
    'delete' |
    'edit' |
    'unknown';

export type DiffChangeSeverity =
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
    basePath?: string;
    host?: string;
    info: OpenAPISpecInfo;
    schemes?: string[];
    swagger: string;
    [xProperty: string]: any;
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
    basePath?: string;
    host?: string;
    info: ParsedInfoObject;
    openapi: ParsedOpenApiProperty;
    schemes?: string[];
    [xProperty: string]: any;
}

// Result types
export interface ResultObject {
    changeList: string[];
    hasBreakingChanges: boolean;
    summary: string[];
}

// Various other types
export interface ChangeTypeMapper {
    D: (change: IDiff) => DiffChangeType;
    E: (change: IDiff) => DiffChangeType;
    N: (change: IDiff) => DiffChangeType;
    A: (change: IDiff) => DiffChangeType;
    'A.N': (change: IDiff) => DiffChangeType;
    'A.D': (change: IDiff) => DiffChangeType;
    [key: string]: (change: IDiff) => DiffChangeType;
}

export interface FileSystem {
    readFile: JsonLoaderFunction;
}

export interface GenericProperty {
    key: string;
    value: any;
}

export interface HttpClient {
    get: JsonLoaderFunction;
}

export type JsonLoaderFunction = (location: string) => q.Promise<string>;

export interface OpenAPIDiff {
    run: (oldSpecPath: string, newSpecPath: string) => q.Promise<ResultObject>;
}
