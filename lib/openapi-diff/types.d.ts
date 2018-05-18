// tslint:disable:no-implicit-dependencies
import {OpenAPIObject} from 'openapi3-ts';
import {Spec} from 'swagger-schema-official';

export type Swagger2 = Spec;
export type OpenApi3 = OpenAPIObject;

export interface DiffEntry {
    sourceValue?: any;
    destinationValue?: any;
    printablePath: string[];
    scope: string;
    severity: DiffEntrySeverity;
    taxonomy: DiffEntryTaxonomy;
    type: DiffEntryType;
}

export type DiffEntryTaxonomy =
    'basePath.add' |
    'basePath.delete' |
    'basePath.edit' |
    'host.add' |
    'host.delete' |
    'host.edit' |
    'info.title.add' |
    'info.title.delete' |
    'info.title.edit' |
    'info.description.add' |
    'info.description.delete' |
    'info.description.edit' |
    'info.termsOfService.add' |
    'info.termsOfService.delete' |
    'info.termsOfService.edit' |
    'info.version.add' |
    'info.version.delete' |
    'info.version.edit' |
    'info.contact.name.add' |
    'info.contact.name.delete' |
    'info.contact.name.edit' |
    'info.contact.email.add' |
    'info.contact.email.delete' |
    'info.contact.email.edit' |
    'info.contact.url.add' |
    'info.contact.url.delete' |
    'info.contact.url.edit' |
    'info.license.name.add' |
    'info.license.name.delete' |
    'info.license.name.edit' |
    'info.license.url.add' |
    'info.license.url.delete' |
    'info.license.url.edit' |
    'openapi.edit' |
    'schemes.add' |
    'schemes.arrayContent.add' |
    'schemes.arrayContent.delete' |
    'schemes.edit' |
    'schemes.delete' |
    'unclassified.add' |
    'unclassified.delete' |
    'unclassified.edit';

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

export interface OpenApiDiffInternal {
    validate: (sourceSpecPath: string, destinationSpecPath: string) => Promise<ResultObject>;
}
