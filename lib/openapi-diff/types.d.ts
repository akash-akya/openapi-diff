// tslint:disable:no-implicit-dependencies
import {OpenAPIObject} from 'openapi3-ts';
import {Spec} from 'swagger-schema-official';
import {Difference, DiffResult} from '../api-types';

export type Swagger2 = Spec;
export type OpenApi3 = OpenAPIObject;

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

export interface ParsedXProperties {
    [name: string]: ParsedProperty<any>;
}

export interface ParsedSpec {
    format: 'swagger2' | 'openapi3';
    basePath: ParsedProperty<string>;
    schemes: ParsedProperty<Array<ParsedProperty<string>>>;
    xProperties: ParsedXProperties;
}

interface ClassifiedDiffResults {
    breakingDifferences: DiffResult[];
    nonBreakingDifferences: DiffResult[];
    unclassifiedDifferences: DiffResult[];
}

export interface GenericProperty {
    key: string;
    value: any;
}
