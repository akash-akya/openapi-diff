import {CoreSchemaMetaSchema} from 'json-schema-spec-types';
import {Swagger2, Swagger2Schema, Swagger2SchemaDefinitions} from '../../swagger2';
import {toDiffCompatibleJsonSchema, toDiffCompatibleJsonSchemaMap} from '../common/to-diff-compatible-json-schema';

const getReferenceSources = (spec: Swagger2): Swagger2SchemaDefinitions => spec.definitions || {};

export const toDiffReadySwagger2Schema = (schema: Swagger2Schema, spec: Swagger2): CoreSchemaMetaSchema => {
    const compatibleReferenceSources = toDiffCompatibleJsonSchemaMap(getReferenceSources(spec));
    const compatibleSchema = toDiffCompatibleJsonSchema(schema);

    return {...compatibleSchema, definitions: compatibleReferenceSources};
};
