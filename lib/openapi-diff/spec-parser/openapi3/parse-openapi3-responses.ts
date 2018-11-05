import {OpenApi3, OpenApi3Reference, OpenApi3Response, OpenApi3Responses} from '../../openapi3';
import {ParsedResponse, ParsedResponses} from '../../spec-parser-types';
import {dereferenceObject} from '../common/dereference-object';
import {PathBuilder} from '../common/path-builder';
import {parseOpenApi3BodyObjectJsonSchema} from './parse-openapi3-body-object-json-schema';
import {parseOpenApi3ResponseHeaders} from './parse-openapi3-response-headers';

const parseResponse = (
    responseOrReference: OpenApi3Response | OpenApi3Reference, pathBuilder: PathBuilder, spec: OpenApi3
): ParsedResponse => {
    const response = dereferenceObject(responseOrReference, spec);

    return {
        headers: parseOpenApi3ResponseHeaders(response, pathBuilder),
        jsonSchema: parseOpenApi3BodyObjectJsonSchema(response, pathBuilder, spec),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: responseOrReference
        }
    };
};

export const parseOpenApi3Responses = (
    responses: OpenApi3Responses, pathBuilder: PathBuilder, spec: OpenApi3
): ParsedResponses => {
    return Object.keys(responses).reduce<ParsedResponses>((accumulator, statusCode) => {
        const originalPath = pathBuilder.withChild(statusCode);
        accumulator[statusCode] = parseResponse(responses[statusCode], originalPath, spec);

        return accumulator;
    }, {});
};
