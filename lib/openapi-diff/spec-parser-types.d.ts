export type Path = Array<string | number>;

export interface ParsedOperation {
    originalValue: ParsedProperty<any>;
    requestBody: ParsedRequestBody;
}

export interface ParsedOperations {
    [method: string]: ParsedOperation;
}

export interface ParsedRequestBody {
    originalValue: ParsedProperty<any>;
    jsonSchema?: ParsedProperty<any>;
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

export interface ParsedXProperties {
    [name: string]: ParsedProperty<any>;
}

export interface ParsedSpec {
    format: 'swagger2' | 'openapi3';
    xProperties: ParsedXProperties;
    paths: ParsedPathItems;
}
