import * as JsonSchemaDiff from 'json-schema-diff';
import {ParsedScope} from '../../spec-parser-types';

export const getJsonSchemaForDiffing = (parsedScope: ParsedScope) => {
    return parsedScope.jsonSchema
        ? parsedScope.jsonSchema.value
        : {};
};

export const getSchemaDifferences = async (
    sourceParsedScope: ParsedScope,
    destinationParsedScope: ParsedScope
): Promise<JsonSchemaDiff.DiffResult> => {
    return JsonSchemaDiff.diffSchemas({
        destinationSchema: getJsonSchemaForDiffing(destinationParsedScope),
        sourceSchema: getJsonSchemaForDiffing(sourceParsedScope)
    });
};
