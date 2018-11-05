import {ParsedOperation, ParsedOperations} from '../../spec-parser-types';
import {Swagger2, Swagger2MethodNames, Swagger2Operation, Swagger2PathItem} from '../../swagger2';
import {PathBuilder} from '../common/path-builder';
import {parseSwagger2BodyParameter} from './parse-swagger2-body-parameter';
import {parseSwagger2Responses} from './parse-swagger2-responses';

const parseOperation = (operation: Swagger2Operation, pathBuilder: PathBuilder, spec: Swagger2): ParsedOperation => {
    const parameters = operation.parameters || [];
    const requestBody = parseSwagger2BodyParameter(parameters, pathBuilder.withChild('parameters'), spec);

    const responses = parseSwagger2Responses(operation.responses, pathBuilder.withChild('responses'), spec);

    return {
        originalValue: {
            originalPath: pathBuilder.build(),
            value: operation
        },
        requestBody,
        responses
    };
};

const typeCheckedSwagger2Methods: { [method in Swagger2MethodNames]: undefined } = {
    delete: undefined,
    get: undefined,
    head: undefined,
    options: undefined,
    patch: undefined,
    post: undefined,
    put: undefined
};

const isSwagger2Method = (propertyName: string): propertyName is Swagger2MethodNames =>
    Object.keys(typeCheckedSwagger2Methods).indexOf(propertyName) >= 0;

export const parseSwagger2Operations = (
    pathItemObject: Swagger2PathItem, pathBuilder: PathBuilder, spec: Swagger2
): ParsedOperations => {
    return Object.keys(pathItemObject)
        .filter(isSwagger2Method)
        .reduce<ParsedOperations>((accumulator, method) => {
            const operationObject = pathItemObject[method] as Swagger2Operation;
            const parentPathBuilder = pathBuilder.withChild(method);

            accumulator[method] = parseOperation(operationObject, parentPathBuilder, spec);

            return accumulator;
        }, {});
};
