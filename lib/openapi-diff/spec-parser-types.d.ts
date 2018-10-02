export type Path = Array<string | number>;

export interface ParsedOperation {
    originalValue: ParsedProperty<any>;
    requestBody: ParsedRequestBody;
    responses: ParsedResponses;
}

export interface ParsedOperations {
    [method: string]: ParsedOperation;
}

export interface ParsedRequestBody extends ParsedScope {
    originalValue: ParsedProperty<any>;
}

export interface ParsedResponses {
    [statuscode: string]: ParsedResponse;
}

export interface ParsedResponse extends ParsedScope {
    originalValue: ParsedProperty<any>;
}

export interface ParsedPathItems {
    [path: string]: ParsedPathItem;
}

export interface ParsedPathItem {
    originalValue: ParsedProperty<any>;
    pathName: string;
    operations: ParsedOperations;
}

export interface ParsedProperty<T> {
    originalPath: Path;
    value?: T;
}

export interface ParsedScope {
    jsonSchema?: ParsedProperty<any>;
}

export interface ParsedXProperties {
    [name: string]: ParsedProperty<any>;
}

export interface ParsedSpec {
    format: 'swagger2' | 'openapi3';
    xProperties: ParsedXProperties;
    paths: ParsedPathItems;
}
