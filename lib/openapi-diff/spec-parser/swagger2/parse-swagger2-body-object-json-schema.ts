import {ParsedJsonSchema} from '../../spec-parser-types';
import {Swagger2, Swagger2BodyParameter, Swagger2Response, Swagger2Schema} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';
import {toDiffReadySwagger2Schema} from './to-diff-ready-swagger2-schema';

const toParsedJsonSchema = (schema: Swagger2Schema, pathBuilder: PathBuilder, spec: Swagger2): ParsedJsonSchema => {
    return {
        originalValue: {
            originalPath: pathBuilder.withChild('schema').build(),
            value: schema
        },
        schema: toDiffReadySwagger2Schema(schema, spec)
    };
};

export const parseSwagger2BodyObjectJsonSchema = (
    bodyObject: Swagger2BodyParameter | Swagger2Response, pathBuilder: PathBuilder, spec: Swagger2
): ParsedJsonSchema | undefined => {
    return bodyObject.schema
        ? toParsedJsonSchema(bodyObject.schema, pathBuilder, spec)
        : undefined;
};
