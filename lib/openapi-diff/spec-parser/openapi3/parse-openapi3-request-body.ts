import {OpenApi3, OpenApi3Reference, OpenApi3RequestBody} from '../../openapi3';
import {ParsedRequestBody} from '../../spec-parser-types';
import {dereferenceObject} from '../common/dereference-object';
import {PathBuilder} from '../common/path-builder';
import {parseOpenApi3BodyObjectJsonSchema} from './parse-openapi3-body-object-json-schema';

const toParsedRequestBody = (
    requestBodyOrReference: OpenApi3RequestBody | OpenApi3Reference, pathBuilder: PathBuilder, spec: OpenApi3
): ParsedRequestBody => {
    const requestBody = dereferenceObject(requestBodyOrReference, spec);
    const jsonSchema = parseOpenApi3BodyObjectJsonSchema(requestBody, pathBuilder, spec);

    return {
        jsonSchema,
        originalValue: {
            originalPath: pathBuilder.build(),
            value: requestBody
        }
    };
};

const toParsedUndefinedRequestBody = (pathBuilder: PathBuilder): ParsedRequestBody => {
    return {
        originalValue: {
            originalPath: pathBuilder.build(),
            value: undefined
        }
    };
};

export const parseOpenApi3RequestBody = (
    requestBodyOrReference: OpenApi3RequestBody | OpenApi3Reference | undefined,
    pathBuilder: PathBuilder,
    spec: OpenApi3
): ParsedRequestBody => {
    return requestBodyOrReference
        ? toParsedRequestBody(requestBodyOrReference, pathBuilder, spec)
        : toParsedUndefinedRequestBody(pathBuilder);
};
