import {OpenApi3Reference, OpenApi3RequestBody} from '../../openapi3';
import {ParsedProperty, ParsedRequestBody} from '../../spec-parser-types';
import {PathBuilder} from '../common/path-builder';

const hasRequestBodyObjectContent = (
    requestBody: OpenApi3RequestBody | OpenApi3Reference | undefined
): requestBody is OpenApi3RequestBody =>
    !!requestBody && !!(requestBody as OpenApi3RequestBody).content;

const parseRequestBodyJsonSchema = (
    requestBody: OpenApi3RequestBody | OpenApi3Reference | undefined, pathBuilder: PathBuilder
): ParsedProperty | undefined => {
    if (hasRequestBodyObjectContent(requestBody) && requestBody.content['application/json']) {
        return {
            originalPath: pathBuilder.withChild('content').withChild('application/json').withChild('schema').build(),
            value: requestBody.content['application/json'].schema
        };
    }
    return undefined;
};

export const parseOpenApi3RequestBody = (
    requestBody: OpenApi3RequestBody | OpenApi3Reference | undefined, pathBuilder: PathBuilder
): ParsedRequestBody => {
    return {
        jsonSchema: parseRequestBodyJsonSchema(requestBody, pathBuilder),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: requestBody
        }
    };
};
