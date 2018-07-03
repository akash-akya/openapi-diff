export interface ParsedOperation {
    originalValue: ParsedProperty<any>;
}

export interface ParsedOperations {
    [method: string]: ParsedOperation;
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
    originalPath: string[];
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
