import {CoreSchemaMetaSchema} from 'json-schema-spec-types';
import {OpenApi3, OpenApi3ComponentSchemas, OpenApi3Schema} from '../../openapi3';
import {toDiffCompatibleJsonSchema, toDiffCompatibleJsonSchemaMap} from '../common/to-diff-compatible-json-schema';

const getReferenceSources = (spec: OpenApi3): OpenApi3ComponentSchemas => {
    return spec.components && spec.components.schemas
        ? spec.components.schemas
        : {};
};

export const toDiffReadyOpenApi3Schema = (schema: OpenApi3Schema, spec: OpenApi3): CoreSchemaMetaSchema => {
    const compatibleReferenceSources = toDiffCompatibleJsonSchemaMap(getReferenceSources(spec));
    const compatibleSchema = toDiffCompatibleJsonSchema(schema);

    return {...compatibleSchema, components: {schemas: compatibleReferenceSources}};
};
