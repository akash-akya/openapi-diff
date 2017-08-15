// Diff types

import IDiff = deepDiff.IDiff;
import * as q from 'q';

export interface DiffEntry {
    oldValue?: any;
    newValue?: any;
    printablePath: string[];
    scope: string;
    severity: DiffEntrySeverity;
    taxonomy: DiffEntryTaxonomy;
    type: DiffEntryType;
}

export type DiffEntryTaxonomy =
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
    'unclassified.add' |
    'unclassified.delete' |
    'unclassified.edit';

export type DiffEntryType =
    'add' |
    'arrayContent.add' |
    'arrayContent.delete' |
    'delete' |
    'edit' |
    'unknown';

export type DiffEntrySeverity =
    'breaking' |
    'non-breaking' |
    'unclassified';

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
    license?: ParsedLicenseObject;
    version?: string; // TODO: this is a bug in the OAS3 type definition
    [xProperty: string]: any;
}

export interface ParsedLicenseObject {
    name: string;
    url?: string;
}

export interface ParsedTopLevelProperty<T> {
    originalPath: string[];
    value?: T;
}

export interface ParsedSpec {
    basePath: ParsedTopLevelProperty<string>;
    host: ParsedTopLevelProperty<string>;
    info: ParsedInfoObject;
    openapi: ParsedTopLevelProperty<string>;
    schemes: ParsedTopLevelProperty<Array<ParsedTopLevelProperty<string>>>;
    xProperties: {[name: string]: ParsedTopLevelProperty<any>};
    [xProperty: string]: any; // TODO: why can't this be ParsedTopLevelProperty ?
}

// Result types
export interface ResultObject {
    changeList: string[];
    hasBreakingChanges: boolean;
    summary: string[];
}

// Various other types
export interface ChangeTypeMapper {
    D: (change: IDiff) => DiffEntryType;
    E: (change: IDiff) => DiffEntryType;
    N: (change: IDiff) => DiffEntryType;
    A: (change: IDiff) => DiffEntryType;
    'A.N': (change: IDiff) => DiffEntryType;
    'A.D': (change: IDiff) => DiffEntryType;
    [key: string]: (change: IDiff) => DiffEntryType;
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
