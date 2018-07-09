import * as JsonSchemaDiff from 'json-schema-diff';
import {isUndefined} from 'util';
import {DiffResultAction} from '../../../api-types';
import {ParsedProperty, ParsedRequestBody, Path} from '../../spec-parser-types';
import {createDifference} from './create-difference';
import {Difference} from './difference';

interface JsonSchemaOrigins {
    source: JsonSchemaDetails;
    destination: JsonSchemaDetails;
}

interface JsonSchemaDetails {
    schema: any;
    path: Path;
    isDefinedInOrigin: boolean;
}

const defaultJsonSchemaDetails = (): JsonSchemaDetails => ({
    isDefinedInOrigin: false,
    path: [],
    schema: {}
});

const toJsonSchemaDetails = (requestBody: ParsedRequestBody): JsonSchemaDetails => {
    if (isUndefined(requestBody.jsonSchema)) {
        return defaultJsonSchemaDetails();
    }
    return {path: requestBody.jsonSchema.originalPath, schema: requestBody.jsonSchema.value, isDefinedInOrigin: true};
};

const createSpecOrigin = (
    rootPathInSpec: Path,
    jsonSchemaDifferenceValue: JsonSchemaDiff.DiffResultDifferenceValue): ParsedProperty<any> => {
    return {
        originalPath: [...rootPathInSpec, ...jsonSchemaDifferenceValue.path],
        value: jsonSchemaDifferenceValue.value
    };
};

const createSpecOrigins = (
    schemaOrigin: JsonSchemaDetails,
    jsonSchemaDifferenceValues: JsonSchemaDiff.DiffResultDifferenceValue[]
): Array<ParsedProperty<any>> => {
    if (schemaOrigin.isDefinedInOrigin) {
        return jsonSchemaDifferenceValues
            .map((jsonSchemaDifferenceValue) => createSpecOrigin(schemaOrigin.path, jsonSchemaDifferenceValue));
    }
    return [];
};

const createRequestBodyScopeDifference = (
    jsonSchemaDifference: JsonSchemaDiff.DiffResultDifference,
    jsonSchemaOrigins: JsonSchemaOrigins,
    action: DiffResultAction
): Difference =>
    createDifference({
        action,
        destinationSpecOrigins: createSpecOrigins(
            jsonSchemaOrigins.destination, jsonSchemaDifference.destinationValues),
        details: {value: jsonSchemaDifference.value},
        propertyName: 'request.body.scope',
        source: 'json-schema-diff',
        sourceSpecOrigins: createSpecOrigins(
            jsonSchemaOrigins.source, jsonSchemaDifference.sourceValues)
    });

const createRequestBodyScopeAddDifferences = (
    jsonSchemaDifferences: JsonSchemaDiff.DiffResultDifference[],
    jsonSchemaOrigins: JsonSchemaOrigins
): Difference[] => {
    const addedByDestinationDifferences = jsonSchemaDifferences
        .filter((diffResult) => diffResult.addedByDestinationSchema);

    return addedByDestinationDifferences
        .map((jsonSchemaDifference) =>
            createRequestBodyScopeDifference(jsonSchemaDifference, jsonSchemaOrigins, 'add'));
};

const createRequestBodyScopeRemoveDifferences = (
    jsonSchemaDifferences: JsonSchemaDiff.DiffResultDifference[],
    originalRootPaths: JsonSchemaOrigins
): Difference[] => {
    const removedByDestinationDifferences = jsonSchemaDifferences
        .filter((diffResult) => diffResult.removedByDestinationSchema);

    return removedByDestinationDifferences
        .map((jsonSchemaDifference) =>
            createRequestBodyScopeDifference(jsonSchemaDifference, originalRootPaths, 'remove'));
};

export const findDifferencesInRequestBodies = async (
    sourceRequestBody: ParsedRequestBody, destinationRequestBody: ParsedRequestBody
): Promise<Difference[]> => {
    const sourceSchema = toJsonSchemaDetails(sourceRequestBody);
    const destinationSchema = toJsonSchemaDetails(destinationRequestBody);

    const diffResults = await JsonSchemaDiff.diffSchemas({
        destinationSchema: destinationSchema.schema,
        sourceSchema: sourceSchema.schema
    });

    const jsonSchemaOrigins: JsonSchemaOrigins = {
        destination: destinationSchema,
        source: sourceSchema
    };

    const addedScopeDifferences = createRequestBodyScopeAddDifferences(diffResults.differences, jsonSchemaOrigins);

    const removedScopeDifferences = createRequestBodyScopeRemoveDifferences(diffResults.differences, jsonSchemaOrigins);

    return [...addedScopeDifferences, ...removedScopeDifferences];
};
