import {ParsedSpec} from '../types';
import {parseXPropertiesInObject} from './common/parse-x-properties';

export const parseOpenApi3Spec = (openApi3Spec: object): ParsedSpec => {
    return {
        basePath: {
            originalPath: ['basePath'],
            value: undefined
        },
        format: 'openapi3',
        schemes: {
            originalPath: ['schemes'],
            value: undefined
        },
        xProperties: parseXPropertiesInObject(openApi3Spec)
    };
};
