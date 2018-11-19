export type Path = Array<string | number>;

export interface ParsedOperation {
    originalValue: ParsedProperty;
    requestBody: ParsedRequestBody;
    responses: ParsedResponses;
}

export interface ParsedOperations {
    [method: string]: ParsedOperation;
}

export interface ParsedRequestBody extends ParsedScope {
    originalValue: ParsedProperty;
}

export interface ParsedResponses {
    [statuscode: string]: ParsedResponse;
}

export interface ParsedResponse extends ParsedScope {
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
    jsonSchema?: ParsedProperty;
}

export interface ParsedXProperties {
    [name: string]: ParsedProperty;
}

export interface ParsedSpec {
    format: 'swagger2' | 'openapi3';
    xProperties: ParsedXProperties;
    paths: ParsedPathItems;
}
