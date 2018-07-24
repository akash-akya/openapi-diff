import {ParsedOperations, ParsedPathItems, ParsedRequestBody, ParsedSpec} from '../../spec-parser-types';
import {
    Swagger2,
    Swagger2BodyParameter,
    Swagger2MethodNames,
    Swagger2Parameter,
    Swagger2PathItem,
    Swagger2Paths
} from '../../swagger2';
import {parseXPropertiesInObject} from '../common/parse-x-properties';
import {PathBuilder} from '../common/path-builder';

const typeCheckedSwagger2Methods: {[method in Swagger2MethodNames]: undefined} = {
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
): {bodyParameter?: Swagger2BodyParameter, index: number} => {
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

const parseOperations = (pathItemObject: Swagger2PathItem, pathBuilder: PathBuilder): ParsedOperations => {
    return Object.keys(pathItemObject)
        .filter(isSwagger2Method)
        .reduce<ParsedOperations>((accumulator, method) => {
            const operation = pathItemObject[method];
            const parameters = operation ? operation.parameters || [] : [];
            const operationPath = pathBuilder.withChild(method);
            accumulator[method] = {
                originalValue: {
                    originalPath: operationPath.build(),
                    value: pathItemObject[method]
                },
                requestBody: parseBodyParameter(parameters, operationPath.withChild('parameters'))
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
