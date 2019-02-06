import {JsonSchema} from 'json-schema-spec-types';
import {DiffResultAction} from '../../../api-types';
import {ParsedProperty, ParsedScope, Path} from '../../spec-parser-types';
import {createDifference} from './create-difference';
import {Difference} from './difference';

interface GetScopeDifferencesOptions {
    addedJsonSchema: JsonSchema;
    additionsFound: boolean;
    destinationScope: ParsedScope;
    propertyName: string;
    removedJsonSchema: JsonSchema;
    removalsFound: boolean;
    sourceScope: ParsedScope;
}

interface CreateScopeDifferencesOptions {
    differenceSchema: JsonSchema;
    action: DiffResultAction;
    propertyName: string;
    sourceParsedScope: ParsedScope;
    destinationParsedScope: ParsedScope;
}

interface JsonSchemaDetails {
    path: Path;
    isDefinedInOrigin: boolean;
}

const defaultJsonSchemaDetails = (): JsonSchemaDetails => ({
    isDefinedInOrigin: false,
    path: []
});

const toJsonSchemaDetails = (parsedScope: ParsedScope): JsonSchemaDetails => {
    return parsedScope.jsonSchema === undefined
        ? defaultJsonSchemaDetails()
        : {
            isDefinedInOrigin: true,
            path: parsedScope.jsonSchema.originalValue.originalPath
        };
};

const createSpecOrigins = (parsedScope: ParsedScope): ParsedProperty[] => {
    const jsonSchemaDetails = toJsonSchemaDetails(parsedScope);

    const originValue = parsedScope.jsonSchema ? parsedScope.jsonSchema.originalValue.value : undefined;

    return jsonSchemaDetails.isDefinedInOrigin
        ? [{originalPath: jsonSchemaDetails.path, value: originValue}]
        : [];
};

const createScopeDifference = (options: CreateScopeDifferencesOptions): Difference =>
    createDifference({
        action: options.action,
        destinationSpecOrigins: createSpecOrigins(options.destinationParsedScope),
        details: {
            differenceSchema: options.differenceSchema
        },
        propertyName: options.propertyName,
        source: 'json-schema-diff',
        sourceSpecOrigins: createSpecOrigins(options.sourceParsedScope)
    });

export const getScopeAddDifferences = (options: GetScopeDifferencesOptions): Difference[] => {
    if (!options.additionsFound) {
        return [];
    }

    return [
        createScopeDifference({
            action: 'add',
            destinationParsedScope: options.destinationScope,
            differenceSchema: options.addedJsonSchema,
            propertyName: options.propertyName,
            sourceParsedScope: options.sourceScope
        })
    ];
};

export const getScopeRemoveDifferences = (options: GetScopeDifferencesOptions): Difference[] => {
    if (!options.removalsFound) {
        return [];
    }

    return [
        createScopeDifference({
            action: 'remove',
            destinationParsedScope: options.destinationScope,
            differenceSchema: options.removedJsonSchema,
            propertyName: options.propertyName,
            sourceParsedScope: options.sourceScope
        })
    ];
};
