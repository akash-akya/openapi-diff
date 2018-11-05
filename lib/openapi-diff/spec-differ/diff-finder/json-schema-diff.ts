import * as JsonSchemaDiff from 'json-schema-diff';
import {OpenApiDiffErrorImpl} from '../../../common/open-api-diff-error-impl';
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
    try {
        return await JsonSchemaDiff.diffSchemas({
            destinationSchema: getJsonSchemaForDiffing(destinationParsedScope),
            sourceSchema: getJsonSchemaForDiffing(sourceParsedScope)
        });
    } catch (error) {
        throw new OpenApiDiffErrorImpl('OPENAPI_DIFF_DIFF_ERROR', error);
    }
};
