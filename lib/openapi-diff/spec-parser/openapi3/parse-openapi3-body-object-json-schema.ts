import {OpenApi3, OpenApi3RequestBody, OpenApi3Response, OpenApi3Schema} from '../../openapi3';
import {ParsedProperty} from '../../spec-parser-types';
import {PathBuilder} from '../common/path-builder';
import {extendOpenApi3SchemaWithReferenceSources} from './extend-open-api3-schema-with-reference-sources';

const toParsedProperty = (
    bodyObjectSchema: OpenApi3Schema, pathBuilder: PathBuilder, spec: OpenApi3
): ParsedProperty => {
    return {
        originalPath: pathBuilder.build(),
        value: extendOpenApi3SchemaWithReferenceSources(bodyObjectSchema, spec)
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
): ParsedProperty | undefined => {
    const bodyObjectSchema = getSchemaFromBodyObject(bodyObject);
    const bodyObjectPath = getPathForBodyObject(pathBuilder);

    return bodyObjectSchema
        ? toParsedProperty(bodyObjectSchema, bodyObjectPath, spec)
        : undefined;
};
