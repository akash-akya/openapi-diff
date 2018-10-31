import {ParsedProperty, ParsedResponse, ParsedResponses} from '../../spec-parser-types';
import {Swagger2Response, Swagger2Responses} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';
import {parseSwagger2ResponseHeaders} from './parse-swagger2-response-headers';

const parseResponseBodyJsonSchema = (
    response: Swagger2Response, pathBuilder: PathBuilder
): ParsedProperty | undefined => {
    return response.schema
        ? {
            originalPath: pathBuilder.withChild('schema').build(),
            value: response.schema
        }
        : undefined;
};

const parseResponse = (response: Swagger2Response, pathBuilder: PathBuilder): ParsedResponse => {
    return {
        headers: parseSwagger2ResponseHeaders(response, pathBuilder),
        jsonSchema: parseResponseBodyJsonSchema(response, pathBuilder),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: response
        }
    };
};

export const parseSwagger2Responses = (responses: Swagger2Responses, pathBuilder: PathBuilder): ParsedResponses => {
    return Object.keys(responses).reduce<ParsedResponses>((accumulator, statusCode) => {
        const originalPath = pathBuilder.withChild(statusCode);
        accumulator[statusCode] = parseResponse(responses[statusCode], originalPath);

        return accumulator;
    }, {});
};
