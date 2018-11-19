import {CoreSchemaMetaSchema, JsonSchema, JsonSchemaArray, JsonSchemaMap} from 'json-schema-spec-types';
import {OpenApi3Schema} from '../../openapi3';
import {Swagger2Schema} from '../../swagger2';

const toDiffCompatibleJsonSchemaArray =
    <T extends OpenApi3Schema | Swagger2Schema>(schemaArray: T[]): JsonSchemaArray =>
        schemaArray.map((schemaEntry) => toDiffCompatibleJsonSchema(schemaEntry));

const toDiffCompatibleJsonSchemaOrArray =
    <T extends OpenApi3Schema | Swagger2Schema>(schemaOrArray: T | T[]): CoreSchemaMetaSchema | JsonSchemaArray => {
        return Array.isArray(schemaOrArray)
            ? toDiffCompatibleJsonSchemaArray(schemaOrArray)
            : toDiffCompatibleJsonSchema(schemaOrArray);
    };

const toDiffCompatibleAdditionalProperties =
    <T extends OpenApi3Schema | Swagger2Schema>(schema: T | boolean): JsonSchema => {
        return typeof schema === 'boolean'
            ? schema
            : toDiffCompatibleJsonSchema(schema);
    };

const toDiffCompatibleNumberBoundary = (exclusive: boolean, boundary?: number): number | undefined => {
    return exclusive ? boundary : undefined;
};

// tslint:disable:cyclomatic-complexity
const toDiffCompatibleJsonSchemaProperties = <T extends OpenApi3Schema | Swagger2Schema, K extends keyof T>(
    schema: T, propertyName: K
): number | undefined | JsonSchema | JsonSchemaMap | JsonSchemaArray => {
    const schemaProperty: any = schema[propertyName];

    switch (propertyName) {
        case 'exclusiveMaximum':
            return toDiffCompatibleNumberBoundary(schemaProperty, schema.maximum);

        case 'exclusiveMinimum':
            return toDiffCompatibleNumberBoundary(schemaProperty, schema.minimum);

        case 'items':
            return toDiffCompatibleJsonSchemaOrArray(schemaProperty);

        case 'additionalProperties':
            return toDiffCompatibleAdditionalProperties(schemaProperty);

        case 'not':
            return toDiffCompatibleJsonSchema(schemaProperty);

        case 'properties':
            return toDiffCompatibleJsonSchemaMap(schemaProperty);

        case 'allOf':
        case 'anyOf':
        case 'oneOf':
            return toDiffCompatibleJsonSchemaArray(schemaProperty);

        default:
            return schemaProperty;
    }
};

export const toDiffCompatibleJsonSchema =
    <T extends OpenApi3Schema | Swagger2Schema, K extends keyof T>(schema: T): CoreSchemaMetaSchema => {
        const compatibleJsonSchema: CoreSchemaMetaSchema = {};

        for (const propertyName of Object.keys(schema)) {
            compatibleJsonSchema[propertyName] = toDiffCompatibleJsonSchemaProperties(schema, propertyName as K);
        }

        return compatibleJsonSchema;
    };

export const toDiffCompatibleJsonSchemaMap = <T extends OpenApi3Schema | Swagger2Schema>(
    schemaMap: { [key: string]: T }
): JsonSchemaMap => {
    const compatibleJsonSchemaMap: JsonSchemaMap = {};

    for (const propertyName of Object.keys(schemaMap)) {
        compatibleJsonSchemaMap[propertyName] = toDiffCompatibleJsonSchema(schemaMap[propertyName]);
    }

    return compatibleJsonSchemaMap;
};
