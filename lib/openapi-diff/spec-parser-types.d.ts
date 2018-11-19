import {CoreSchemaMetaSchema} from 'json-schema-spec-types';

export type Path = Array<string | number>;

export interface ParsedOperation {
    originalValue: ParsedProperty;
    requestBody: ParsedRequestBody;
    responses: ParsedResponses;
}

export interface ParsedOperations {
    [method: string]: ParsedOperation;
}

export type ParsedRequestBody = ParsedSpecRequestBody & ParsedScope;

interface ParsedSpecRequestBody {
    originalValue: ParsedProperty;
}

export interface ParsedResponses {
    [statuscode: string]: ParsedResponse;
}

export type ParsedResponse = ParsedSpecResponse & ParsedScope;

interface ParsedSpecResponse {
    headers: ParsedHeaders;
    originalValue: ParsedProperty;
}

export interface ParsedHeaders {
    [name: string]: ParsedHeader;
}

export interface ParsedHeader {
    required: ParsedRequired;
    originalValue: ParsedProperty;
}

interface ParsedRequired {
    originalValue: ParsedProperty;
    value: boolean;
}

export interface ParsedPathItems {
    [path: string]: ParsedPathItem;
}

export interface ParsedPathItem {
    originalValue: ParsedProperty;
    operations: ParsedOperations;
}

export interface ParsedProperty {
    originalPath: Path;
    value?: any;
}

export interface ParsedScope {
    jsonSchema?: ParsedJsonSchema;
}

export interface ParsedJsonSchema {
    originalValue: ParsedProperty;
    schema: CoreSchemaMetaSchema;
}

export interface ParsedXProperties {
    [name: string]: ParsedProperty;
}

export interface ParsedSpec {
    format: 'swagger2' | 'openapi3';
    xProperties: ParsedXProperties;
    paths: ParsedPathItems;
}
