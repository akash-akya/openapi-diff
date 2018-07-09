import {PathItemObject, ReferenceObject, RequestBodyObject} from 'openapi3-ts';
import * as SwaggerParser from 'swagger-parser';
import {OpenApiDiffErrorImpl} from '../../common/open-api-diff-error-impl';
import {OpenApi3, OpenApi3MethodName, OpenApi3Paths} from '../openapi3';
import {ParsedOperations, ParsedPathItems, ParsedProperty, ParsedRequestBody, ParsedSpec} from '../spec-parser-types';
import {parseXPropertiesInObject} from './common/parse-x-properties';
import {PathBuilder} from './common/path-builder';

const typeCheckedOpenApi3Methods: {[method in OpenApi3MethodName]: undefined} = {
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

const isRequestBodyObject = (
    requestBody: RequestBodyObject | ReferenceObject | undefined
): requestBody is RequestBodyObject =>
    !!requestBody && !!(requestBody as RequestBodyObject).content;

const parsedRequestBodyJsonSchema = (
    requestBodyObject: RequestBodyObject | ReferenceObject | undefined, pathBuilder: PathBuilder
): ParsedProperty<any> | undefined => {
    if (isRequestBodyObject(requestBodyObject) && requestBodyObject.content['application/json']) {
        return {
            originalPath: pathBuilder.withChild('content').withChild('application/json').withChild('schema').build(),
            value: requestBodyObject.content['application/json'].schema
        };
    }
    return undefined;
};

const parsedRequestBody = (
    requestBody: RequestBodyObject | ReferenceObject | undefined, pathBuilder: PathBuilder
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

const parseOperations = (pathItemObject: PathItemObject, pathBuilder: PathBuilder): ParsedOperations => {
    return Object.keys(pathItemObject)
        .filter(isOpenApi3Method)
        .reduce<ParsedOperations>((accumulator, method) => {
            const operationObject = pathItemObject[method];
            const originalPath = pathBuilder.withChild(method);
            const requestBody = operationObject
                ? parsedRequestBody(operationObject.requestBody, originalPath)
                : parsedRequestBody(undefined, originalPath);
            accumulator[method] = {
                originalValue: {
                    originalPath: originalPath.build(),
                    value: operationObject
                },
                requestBody
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

const validateOpenApi3 = async (openApi3Spec: object, location: string): Promise<OpenApi3> => {
    try {
        const options: any = {
            dereference: {circular: false}
        };
        return await SwaggerParser.validate(openApi3Spec as any, options);
    } catch (error) {
        throw new OpenApiDiffErrorImpl(
            'OPENAPI_DIFF_VALIDATE_OPENAPI_3_ERROR',
            `Validation errors in ${location}`,
            error
        );
    }
};

const parseOpenApi3Spec = (spec: OpenApi3): ParsedSpec => {
    const pathBuilder = PathBuilder.createRootPathBuilder();

    return {
        format: 'openapi3',
        paths: parsePaths(spec.paths, pathBuilder.withChild('paths')),
        xProperties: parseXPropertiesInObject(spec, pathBuilder)
    };
};

export const validateAndParseOpenApi3Spec = async (openApi3Spec: object, location: string): Promise<ParsedSpec> => {
    const validatedOpenApi3Spec = await validateOpenApi3(openApi3Spec, location);
    return parseOpenApi3Spec(validatedOpenApi3Spec);
};
