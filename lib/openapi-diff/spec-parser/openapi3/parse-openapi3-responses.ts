import {OpenApi3Response, OpenApi3Responses} from '../../openapi3';
import {ParsedProperty, ParsedResponse, ParsedResponses} from '../../spec-parser-types';
import {PathBuilder} from '../common/path-builder';
import {parseOpenApi3ResponseHeaders} from './parse-openapi3-response-headers';

const parsedResponseBodyJsonSchema = (
    response: OpenApi3Response, pathBuilder: PathBuilder
): ParsedProperty | undefined => {
    return response.content && response.content['application/json']
        ? {
            originalPath: pathBuilder.withChild('content').withChild('application/json').withChild('schema').build(),
            value: response.content['application/json'].schema
        }
        : undefined;
};

const parseResponse = (response: OpenApi3Response, pathBuilder: PathBuilder): ParsedResponse => {
    return {
        headers: parseOpenApi3ResponseHeaders(response, pathBuilder),
        jsonSchema: parsedResponseBodyJsonSchema(response, pathBuilder),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: response
        }
    };
};

export const parseOpenApi3Responses = (responses: OpenApi3Responses, pathBuilder: PathBuilder): ParsedResponses => {
    return Object.keys(responses).reduce<ParsedResponses>((accumulator, statusCode) => {
        const originalPath = pathBuilder.withChild(statusCode);
        accumulator[statusCode] = parseResponse(responses[statusCode], originalPath);

        return accumulator;
    }, {});
};
