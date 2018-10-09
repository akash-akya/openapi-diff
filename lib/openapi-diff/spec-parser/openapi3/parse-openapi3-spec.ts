import {
    OpenApi3,
    OpenApi3MethodName,
    OpenApi3PathItem,
    OpenApi3Paths,
    OpenApi3Reference,
    OpenApi3RequestBody, OpenApi3Response,
    OpenApi3Responses,
    OpenApi3Schema
} from '../../openapi3';
import {
    ParsedOperations,
    ParsedPathItems,
    ParsedProperty,
    ParsedRequestBody, ParsedResponse,
    ParsedResponses,
    ParsedSpec
} from '../../spec-parser-types';
import {parseXPropertiesInObject} from '../common/parse-x-properties';
import {PathBuilder} from '../common/path-builder';

const typeCheckedOpenApi3Methods: { [method in OpenApi3MethodName]: undefined } = {
    delete: undefined,
    get: undefined,
    head: undefined,
    options: undefined,
    patch: undefined,
    post: undefined,
    put: undefined,
    trace: undefined
};

const parsedResponseBodyJsonSchema = (
    response: OpenApi3Response, pathBuilder: PathBuilder
): ParsedProperty<OpenApi3Schema | OpenApi3Reference> | undefined => {
    return response.content && response.content['application/json']
        ? {
            originalPath: pathBuilder.withChild('content').withChild('application/json').withChild('schema').build(),
            value: response.content['application/json'].schema
        }
        : undefined;
};

const parseResponse = (response: OpenApi3Response, pathBuilder: PathBuilder): ParsedResponse => {
    return {
        jsonSchema: parsedResponseBodyJsonSchema(response, pathBuilder),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: response
        }
    };
};

const parseResponses = (responses: OpenApi3Responses, pathBuilder: PathBuilder): ParsedResponses => {
    return Object.keys(responses).reduce<ParsedResponses>((accumulator, statusCode) => {
        const originalPath = pathBuilder.withChild(statusCode);
        accumulator[statusCode] = parseResponse(responses[statusCode], originalPath);

        return accumulator;
    }, {});
};

const isRequestBodyObject = (
    requestBody: OpenApi3RequestBody | OpenApi3Reference | undefined
): requestBody is OpenApi3RequestBody =>
    !!requestBody && !!(requestBody as OpenApi3RequestBody).content;

const parsedRequestBodyJsonSchema = (
    requestBodyObject: OpenApi3RequestBody | OpenApi3Reference | undefined, pathBuilder: PathBuilder
): ParsedProperty<OpenApi3Schema | OpenApi3Reference> | undefined => {
    if (isRequestBodyObject(requestBodyObject) && requestBodyObject.content['application/json']) {
        return {
            originalPath: pathBuilder.withChild('content').withChild('application/json').withChild('schema').build(),
            value: requestBodyObject.content['application/json'].schema
        };
    }
    return undefined;
};

const parsedRequestBody = (
    requestBody: OpenApi3RequestBody | OpenApi3Reference | undefined, pathBuilder: PathBuilder
): ParsedRequestBody => {
    const originalPath = pathBuilder.withChild('requestBody');
    return {
        jsonSchema: parsedRequestBodyJsonSchema(requestBody, originalPath),
        originalValue: {
            originalPath: originalPath.build(),
            value: requestBody
        }
    };
};

const isOpenApi3Method = (propertyName: string): propertyName is OpenApi3MethodName =>
    Object.keys(typeCheckedOpenApi3Methods).indexOf(propertyName) >= 0;

const parseOperations = (pathItemObject: OpenApi3PathItem, pathBuilder: PathBuilder): ParsedOperations => {
    return Object.keys(pathItemObject)
        .filter(isOpenApi3Method)
        .reduce<ParsedOperations>((accumulator, method) => {
            const operationObject = pathItemObject[method];
            const originalPath = pathBuilder.withChild(method);

            const requestBody = operationObject
                ? parsedRequestBody(operationObject.requestBody, originalPath)
                : parsedRequestBody(undefined, originalPath);

            const responsesPath = originalPath.withChild('responses');
            const responses = operationObject
                ? parseResponses(operationObject.responses, responsesPath)
                : {};

            accumulator[method] = {
                originalValue: {
                    originalPath: originalPath.build(),
                    value: operationObject
                },
                requestBody,
                responses
            };
            return accumulator;
        }, {});
};

const parsePaths = (paths: OpenApi3Paths, pathBuilder: PathBuilder): ParsedPathItems =>
    Object.keys(paths).reduce<ParsedPathItems>((accumulator, pathName) => {
        const pathItemObject = paths[pathName];
        const originalPath = pathBuilder.withChild(pathName);
        accumulator[pathName] = {
            operations: parseOperations(pathItemObject, originalPath),
            originalValue: {
                originalPath: originalPath.build(),
                value: pathItemObject
            },
            pathName
        };
        return accumulator;
    }, {});

export const parseOpenApi3Spec = (spec: OpenApi3): ParsedSpec => {
    const pathBuilder = PathBuilder.createRootPathBuilder();

    return {
        format: 'openapi3',
        paths: parsePaths(spec.paths, pathBuilder.withChild('paths')),
        xProperties: parseXPropertiesInObject(spec, pathBuilder)
    };
};