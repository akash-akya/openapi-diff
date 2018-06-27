import {OpenApi3, OpenApi3Paths} from '../openapi3';
import {ParsedPathItem, ParsedSpec} from '../spec-parser-types';
import {parseXPropertiesInObject} from './common/parse-x-properties';

const parsePaths = (paths: OpenApi3Paths): ParsedPathItem[] =>
    Object.keys(paths).map((pathName) => ({
        originalValue: {
            originalPath: ['paths', pathName],
            value: paths[pathName]
        },
        pathName
    }));

const validateOpenApi3 = (openApi3Spec: object): OpenApi3 =>
    openApi3Spec as OpenApi3;

export const parseOpenApi3Spec = (openApi3Spec: object): ParsedSpec => {
    const validatedOpenApi3Spec = validateOpenApi3(openApi3Spec);

    return {
        basePath: {
            originalPath: ['basePath'],
            value: undefined
        },
        format: 'openapi3',
        paths: parsePaths(validatedOpenApi3Spec.paths),
        schemes: {
            originalPath: ['schemes'],
            value: undefined
        },
        xProperties: parseXPropertiesInObject(validatedOpenApi3Spec)
    };
};
