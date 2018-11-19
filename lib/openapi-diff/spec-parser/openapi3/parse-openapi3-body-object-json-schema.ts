import {OpenApi3, OpenApi3RequestBody, OpenApi3Response, OpenApi3Schema} from '../../openapi3';
import {ParsedJsonSchema} from '../../spec-parser-types';
import {PathBuilder} from '../common/path-builder';
import {toDiffReadyOpenApi3Schema} from './to-diff-ready-openapi3-schema';

const toParsedJsonSchema = (
    bodyObjectSchema: OpenApi3Schema, pathBuilder: PathBuilder, spec: OpenApi3
): ParsedJsonSchema => {
    return {
        originalValue: {
            originalPath: pathBuilder.build(),
            value: bodyObjectSchema
        },
        schema: toDiffReadyOpenApi3Schema(bodyObjectSchema, spec)
    };
};

const getSchemaFromBodyObject = (
    bodyObject: OpenApi3RequestBody | OpenApi3Response
): OpenApi3Schema | undefined => {
    return bodyObject.content && bodyObject.content['application/json']
        ? bodyObject.content['application/json'].schema
        : undefined;
};

const getPathForBodyObject = (pathBuilder: PathBuilder): PathBuilder => {
    return pathBuilder.withChild('content').withChild('application/json').withChild('schema');
};

export const parseOpenApi3BodyObjectJsonSchema = (
    bodyObject: OpenApi3RequestBody | OpenApi3Response, pathBuilder: PathBuilder, spec: OpenApi3
): ParsedJsonSchema | undefined => {
    const bodyObjectSchema = getSchemaFromBodyObject(bodyObject);
    const bodyObjectPath = getPathForBodyObject(pathBuilder);

    return bodyObjectSchema
        ? toParsedJsonSchema(bodyObjectSchema, bodyObjectPath, spec)
        : undefined;
};
