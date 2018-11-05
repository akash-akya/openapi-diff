import {OpenApi3, OpenApi3MethodName, OpenApi3Operation, OpenApi3PathItem} from '../../openapi3';
import {ParsedOperation, ParsedOperations} from '../../spec-parser-types';
import {PathBuilder} from '../common/path-builder';
import {parseOpenApi3RequestBody} from './parse-openapi3-request-body';
import {parseOpenApi3Responses} from './parse-openapi3-responses';

const parseOperation = (operation: OpenApi3Operation, pathBuilder: PathBuilder, spec: OpenApi3): ParsedOperation => {
    const requestBody = parseOpenApi3RequestBody(operation.requestBody, pathBuilder.withChild('requestBody'), spec);
    const responses = parseOpenApi3Responses(operation.responses, pathBuilder.withChild('responses'), spec);

    return {
        originalValue: {
            originalPath: pathBuilder.build(),
            value: operation
        },
        requestBody,
        responses
    };
};

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

const isOpenApi3Method = (propertyName: string): propertyName is OpenApi3MethodName =>
    Object.keys(typeCheckedOpenApi3Methods).indexOf(propertyName) >= 0;

export const parseOpenApi3Operations = (
    pathItemObject: OpenApi3PathItem, pathBuilder: PathBuilder, spec: OpenApi3
): ParsedOperations => {
    return Object.keys(pathItemObject)
        .filter(isOpenApi3Method)
        .reduce<ParsedOperations>((accumulator, method) => {
            const operationObject = pathItemObject[method] as OpenApi3Operation;
            const originalPath = pathBuilder.withChild(method);

            accumulator[method] = parseOperation(operationObject, originalPath, spec);

            return accumulator;
        }, {});
};
