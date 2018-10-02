import {
    ParsedOperations,
    ParsedPathItems, ParsedProperty,
    ParsedRequestBody,
    ParsedResponse,
    ParsedResponses,
    ParsedSpec
} from '../../spec-parser-types';
import {
    Swagger2,
    Swagger2BodyParameter,
    Swagger2MethodNames,
    Swagger2Parameter,
    Swagger2PathItem,
    Swagger2Paths,
    Swagger2Response,
    Swagger2Responses, Swagger2Schema
} from '../../swagger2';
import {parseXPropertiesInObject} from '../common/parse-x-properties';
import {PathBuilder} from '../common/path-builder';

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

const findBodyParameterAndIndex = (
    parameters: Swagger2Parameter[]
): { bodyParameter?: Swagger2BodyParameter, index: number } => {
    let bodyParameterIndex = -1;
    const bodyParameter = parameters.find((parameter, index): parameter is Swagger2BodyParameter => {
        const isBody = parameter.in === 'body';
        bodyParameterIndex = index;
        return isBody;
    });
    return {bodyParameter, index: bodyParameterIndex};
};

function toParsedRequestBody(bodyParameter: Swagger2BodyParameter, pathBuilder: PathBuilder) {
    return {
        jsonSchema: {
            originalPath: pathBuilder.withChild('schema').build(),
            value: bodyParameter.schema
        },
        originalValue: {
            originalPath: pathBuilder.build(),
            value: bodyParameter
        }
    };
}

const parseBodyParameter = (parameters: Swagger2Parameter[], pathBuilder: PathBuilder): ParsedRequestBody => {
    const {bodyParameter, index} = findBodyParameterAndIndex(parameters);
    if (bodyParameter) {
        return toParsedRequestBody(bodyParameter, pathBuilder.withChild(`${index}`));
    }

    return {
        originalValue: {
            originalPath: pathBuilder.build(),
            value: undefined
        }
    };
};

const parseResponseBodyJsonSchema = (
    response: Swagger2Response, pathBuilder: PathBuilder
): ParsedProperty<Swagger2Schema> | undefined => {
    return response.schema
        ? {
            originalPath: pathBuilder.withChild('schema').build(),
            value: response.schema
        }
        : undefined;
};

const parseResponse = (response: Swagger2Response, pathBuilder: PathBuilder): ParsedResponse => {
    return {
        jsonSchema: parseResponseBodyJsonSchema(response, pathBuilder),
        originalValue: {
            originalPath: pathBuilder.build(),
            value: response
        }
    };
};

const parseResponses = (responses: Swagger2Responses, pathBuilder: PathBuilder): ParsedResponses => {
    return Object.keys(responses).reduce<ParsedResponses>((accumulator, statusCode) => {
        const originalPath = pathBuilder.withChild(statusCode);
        accumulator[statusCode] = parseResponse(responses[statusCode], originalPath);

        return accumulator;
    }, {});
};

const parseOperations = (pathItemObject: Swagger2PathItem, pathBuilder: PathBuilder): ParsedOperations => {
    return Object.keys(pathItemObject)
        .filter(isSwagger2Method)
        .reduce<ParsedOperations>((accumulator, method) => {
            const operationObject = pathItemObject[method];
            const operationPath = pathBuilder.withChild(method);

            const parametersPath = operationPath.withChild('parameters');
            const parameters = operationObject
                ? operationObject.parameters || []
                : [];
            const requestBody = parseBodyParameter(parameters, parametersPath);

            const responsesPath = operationPath.withChild('responses');
            const responses = operationObject
                ? parseResponses(operationObject.responses, responsesPath)
                : {};

            accumulator[method] = {
                originalValue: {
                    originalPath: operationPath.build(),
                    value: pathItemObject[method]
                },
                requestBody,
                responses
            };
            return accumulator;
        }, {});
};

const parsePaths = (paths: Swagger2Paths, pathBuilder: PathBuilder): ParsedPathItems =>
    Object.keys(paths).reduce<ParsedPathItems>((accumulator, pathName) => {
        const pathItemObject = paths[pathName];
        const originalPath = pathBuilder.withChild(pathName);
        accumulator[pathName] = {
            operations: parseOperations(pathItemObject, originalPath),
            originalValue: {
                originalPath: originalPath.build(),
                value: paths[pathName]
            },
            pathName
        };
        return accumulator;
    }, {});

export const parseSwagger2Spec = (swagger2Spec: Swagger2): ParsedSpec => {
    const pathBuilder = PathBuilder.createRootPathBuilder();
    return {
        format: 'swagger2',
        paths: parsePaths(swagger2Spec.paths, pathBuilder.withChild('paths')),
        xProperties: parseXPropertiesInObject(swagger2Spec, pathBuilder)
    };
};
