import {PathItemObject} from 'openapi3-ts';
import {OpenApi3, OpenApi3MethodName, OpenApi3Paths} from '../openapi3';
import {ParsedOperations, ParsedPathItems, ParsedSpec} from '../spec-parser-types';
import {parseXPropertiesInObject} from './common/parse-x-properties';

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

const parseOperations = (pathItemObject: PathItemObject, pathItemOriginalPath: string[]): ParsedOperations => {
    return Object.keys(pathItemObject)
        .filter(isOpenApi3Method)
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

const parsePaths = (paths: OpenApi3Paths): ParsedPathItems =>
    Object.keys(paths).reduce<ParsedPathItems>((accumulator, pathName) => {
        const pathItemObject = paths[pathName];
        const originalPath = ['paths', pathName];
        accumulator[pathName] = {
            operations: parseOperations(pathItemObject, originalPath),
            originalValue: {
                originalPath,
                value: pathItemObject
            },
            pathName
        };
        return accumulator;
    }, {});

const validateOpenApi3 = (openApi3Spec: object): OpenApi3 =>
    openApi3Spec as OpenApi3;

export const parseOpenApi3Spec = (openApi3Spec: object): ParsedSpec => {
    const validatedOpenApi3Spec = validateOpenApi3(openApi3Spec);

    return {
        format: 'openapi3',
        paths: parsePaths(validatedOpenApi3Spec.paths),
        xProperties: parseXPropertiesInObject(validatedOpenApi3Spec)
    };
};
