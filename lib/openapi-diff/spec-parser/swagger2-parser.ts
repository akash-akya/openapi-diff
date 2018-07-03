import * as SwaggerParser from 'swagger-parser';
import {OpenApiDiffErrorImpl} from '../../common/open-api-diff-error-impl';
import {ParsedOperations, ParsedPathItems, ParsedSpec} from '../spec-parser-types';
import {Swagger2, Swagger2MethodNames, Swagger2PathItem, Swagger2Paths} from '../swagger2';
import {parseXPropertiesInObject} from './common/parse-x-properties';

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

const parseOperations = (pathItemObject: Swagger2PathItem, pathItemOriginalPath: string[]): ParsedOperations => {
    return Object.keys(pathItemObject)
        .filter(isSwagger2Method)
        .reduce<ParsedOperations>((accumulator, method) => {
            accumulator[method] = {
                originalValue: {
                    originalPath: [...pathItemOriginalPath, method],
                    value: pathItemObject[method]
                }
            };
            return accumulator;
        }, {});
};

const parsePaths = (paths: Swagger2Paths): ParsedPathItems =>
    Object.keys(paths).reduce<ParsedPathItems>((accumulator, pathName) => {
        const pathItemObject = paths[pathName];
        const originalPath = ['paths', pathName];
        accumulator[pathName] = {
            operations: parseOperations(pathItemObject, originalPath),
            originalValue: {
                originalPath,
                value: paths[pathName]
            },
            pathName
        };
        return accumulator;
    }, {});

const parseSwagger2Spec = (swagger2Spec: Swagger2): ParsedSpec => {
    return {
        format: 'swagger2',
        paths: parsePaths(swagger2Spec.paths),
        xProperties: parseXPropertiesInObject(swagger2Spec)
    };
};

const validateSwagger2 = async (document: object, location: string): Promise<Swagger2> => {
    try {
        return await SwaggerParser.validate(document as any);
    } catch (error) {
        throw new OpenApiDiffErrorImpl(
            'OPENAPI_DIFF_VALIDATE_SWAGGER_2_ERROR',
            `Validation errors in ${location}`,
            error
        );
    }
};

export const validateAndParseSwagger2Spec = async (swagger2Spec: object, location: string): Promise<ParsedSpec> => {
    const validatedSpec = await validateSwagger2(swagger2Spec, location);
    return parseSwagger2Spec(validatedSpec);
};
