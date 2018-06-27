export interface ParsedPathItem {
    originalValue: ParsedProperty<any>;
    pathName: string;
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
    paths: ParsedPathItem[];
}
