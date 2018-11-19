import * as JsonSchemaDiff from 'json-schema-diff';
import {DiffResultAction} from '../../../api-types';
import {ParsedProperty, ParsedScope, Path} from '../../spec-parser-types';
import {createDifference} from './create-difference';
import {Difference} from './difference';

interface GetScopeDifferencesOptions {
    destinationScope: ParsedScope;
    differences: JsonSchemaDiff.DiffResultDifference[];
    propertyName: string;
    sourceScope: ParsedScope;
}

interface CreateScopeDifferencesOptions {
    jsonSchemaDifference: JsonSchemaDiff.DiffResultDifference;
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

const createSpecOrigin = (
    rootPathInSpec: Path, differenceValue: JsonSchemaDiff.DiffResultDifferenceValue
): ParsedProperty => {
    return {
        originalPath: [...rootPathInSpec, ...differenceValue.path],
        value: differenceValue.value
    };
};

const createSpecOrigins = (
    parsedScope: ParsedScope, differenceValues: JsonSchemaDiff.DiffResultDifferenceValue[]
): ParsedProperty[] => {
    const jsonSchemaDetails = toJsonSchemaDetails(parsedScope);

    return jsonSchemaDetails.isDefinedInOrigin
        ? differenceValues.map((differenceValue) => createSpecOrigin(jsonSchemaDetails.path, differenceValue))
        : [];
};

const createScopeDifference = (options: CreateScopeDifferencesOptions): Difference => {
    const destinationSpecOrigins =
        createSpecOrigins(options.destinationParsedScope, options.jsonSchemaDifference.destinationValues);
    const sourceSpecOrigins =
        createSpecOrigins(options.sourceParsedScope, options.jsonSchemaDifference.sourceValues);

    return createDifference({
        action: options.action,
        destinationSpecOrigins,
        details: {
            value: options.jsonSchemaDifference.value
        },
        propertyName: options.propertyName,
        source: 'json-schema-diff',
        sourceSpecOrigins
    });
};

export const getScopeAddDifferences = (options: GetScopeDifferencesOptions): Difference[] => {
    const addedJsonSchemaDifferences =
        options.differences.filter((difference) => difference.addedByDestinationSchema);

    return addedJsonSchemaDifferences
        .map((jsonSchemaDifference) =>
            createScopeDifference({
                action: 'add',
                destinationParsedScope: options.destinationScope,
                jsonSchemaDifference,
                propertyName: options.propertyName,
                sourceParsedScope: options.sourceScope
            }));
};

export const getScopeRemoveDifferences = (options: GetScopeDifferencesOptions): Difference[] => {
    const addedJsonSchemaDifferences =
        options.differences.filter((difference) => difference.removedByDestinationSchema);

    return addedJsonSchemaDifferences
        .map((jsonSchemaDifference) =>
            createScopeDifference({
                action: 'remove',
                destinationParsedScope: options.destinationScope,
                jsonSchemaDifference,
                propertyName: options.propertyName,
                sourceParsedScope: options.sourceScope
            }));
};
