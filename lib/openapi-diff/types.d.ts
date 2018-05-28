// tslint:disable:no-implicit-dependencies
import {OpenAPIObject} from 'openapi3-ts';
import {Spec} from 'swagger-schema-official';

export type Swagger2 = Spec;
export type OpenApi3 = OpenAPIObject;

export interface DiffEntry {
    sourceValue?: any;
    destinationValue?: any;
    printablePath: string[];
    severity: DiffEntrySeverity;
    type: DiffEntryType;
}

export type DiffEntryType =
    'add' |
    'arrayContent.add' |
    'arrayContent.delete' |
    'delete' |
    'edit';

export type DiffEntrySeverity =
    'breaking' |
    'non-breaking' |
    'unclassified';

// Parsed Spec types

export interface ParsedInfoObject {
    title: ParsedProperty<string>;
    description: ParsedProperty<string>;
    termsOfService: ParsedProperty<string>;
    contact: ParsedContactObject;
    license: ParsedLicenseObject;
    version: ParsedProperty<string>;
    xProperties: { [name: string]: ParsedProperty<any> };
}

export interface ParsedContactObject {
    name: ParsedProperty<string>;
    url: ParsedProperty<string>;
    email: ParsedProperty<string>;
}

export interface ParsedLicenseObject {
    name: ParsedProperty<string>;
    url: ParsedProperty<string>;
}

export interface ParsedProperty<T> {
    originalPath: string[];
    value?: T;
}

export interface ParsedSpec {
    format: 'swagger2' | 'openapi3';
    basePath: ParsedProperty<string>;
    host: ParsedProperty<string>;
    info: ParsedInfoObject;
    openapi: ParsedProperty<string>;
    schemes: ParsedProperty<Array<ParsedProperty<string>>>;
    xProperties: { [name: string]: ParsedProperty<any> };
}

// Result types
export interface ResultObject {
    changeList: string[];
    hasBreakingChanges: boolean;
    summary: string[];
}

// Various other types
export interface GenericProperty {
    key: string;
    value: any;
}
