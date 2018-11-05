import {ParsedResponse, ParsedResponses} from '../../spec-parser-types';
import {Swagger2, Swagger2Reference, Swagger2Response, Swagger2Responses} from '../../swagger2';
import {dereferenceObject} from '../common/dereference-object';
import {PathBuilder} from '../common/path-builder';
import {parseSwagger2BodyObjectJsonSchema} from './parse-swagger2-body-object-json-schema';
import {parseSwagger2ResponseHeaders} from './parse-swagger2-response-headers';

const parseResponse = (
    responseOrReference: Swagger2Response | Swagger2Reference, pathBuilder: PathBuilder, spec: Swagger2
): ParsedResponse => {
    const response: Swagger2Response = dereferenceObject(responseOrReference, spec);

    return {
        headers: parseSwagger2ResponseHeaders(response, pathBuilder),
        jsonSchema: parseSwagger2BodyObjectJsonSchema(response, pathBuilder, spec),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: responseOrReference
        }
    };
};

export const parseSwagger2Responses = (
    responses: Swagger2Responses, pathBuilder: PathBuilder, spec: Swagger2
): ParsedResponses => {
    return Object.keys(responses).reduce<ParsedResponses>((accumulator, statusCode) => {
        const originalPath = pathBuilder.withChild(statusCode);
        accumulator[statusCode] = parseResponse(responses[statusCode], originalPath, spec);

        return accumulator;
    }, {});
};
