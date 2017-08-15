import * as _ from 'lodash';

import utils from './utils';

import {OpenAPIObject as OpenApi3} from 'openapi3-ts';
import {Spec as Swagger2} from 'swagger-schema-official';

import {
    GenericProperty,
    ParsedInfoObject,
    ParsedSpec,
    ParsedTopLevelProperty
} from './types';

const parseInfoObject = (spec: Swagger2 | OpenApi3): ParsedInfoObject => {
    return spec.info;
};

const parseTopLevelXProperties = (spec: Swagger2 | OpenApi3): GenericProperty[] => {
    const topLevelPropertiesArray: GenericProperty[] = [];
    _.forIn(spec, (value, key) => {
        if (utils.isXProperty(key)) {
            topLevelPropertiesArray.push({key, value});
        }
    });
    return topLevelPropertiesArray;
};

const parseTopLevelArrayProperties = (arrayName: string,
                                      inputArray: string[]
): Array<ParsedTopLevelProperty<string>> => {
    const parsedSchemesArray: Array<ParsedTopLevelProperty<string>> = [];

    if (inputArray.length) {
        inputArray.forEach((value, index) => {
            parsedSchemesArray.push({
                originalPath: [arrayName, index.toString()],
                value
            });
        });
    }

    return parsedSchemesArray;
};

const parseSwagger2Spec = (swagger2Spec: Swagger2): ParsedSpec => {
    const parsedSpec: ParsedSpec = {
        basePath: {
            originalPath: ['basePath'],
            value: swagger2Spec.basePath
        },
        host: {
            originalPath: ['host'],
            value: swagger2Spec.host
        },
        info: parseInfoObject(swagger2Spec),
        openapi: {
            originalPath: ['swagger'],
            value: swagger2Spec.swagger
        },
        schemes: {
            originalPath: ['schemes'],
            value: swagger2Spec.schemes ? parseTopLevelArrayProperties('schemes', swagger2Spec.schemes) : undefined
        },
        xProperties: {}
    };

    for (const entry of parseTopLevelXProperties(swagger2Spec)) {
        _.set(parsedSpec.xProperties, entry.key, {originalPath: [ entry.key ], value: entry.value});
    }

    return parsedSpec;
};

const parseOpenApi3Spec = (openApi3Spec: OpenApi3): ParsedSpec => {
    const parsedSpec: ParsedSpec = {
        basePath: {
            originalPath: ['basePath'],
            value: undefined
        },
        host: {
            originalPath: ['host'],
            value: undefined
        },
        info: parseInfoObject(openApi3Spec),
        openapi: {
            originalPath: ['openapi'],
            value: openApi3Spec.openapi
        },
        schemes: {
            originalPath: ['schemes'],
            value: undefined
        },
        xProperties: {}
    };

    for (const entry of parseTopLevelXProperties(openApi3Spec)) {
        _.set(parsedSpec.xProperties, entry.key, {originalPath: [ entry.key ], value: entry.value});
    }

    return parsedSpec;
};

const isSwagger2 = (spec: Swagger2 | OpenApi3): boolean => {
    return !!(spec as Swagger2).swagger;
};

export default {
    parse: (spec: Swagger2 | OpenApi3): ParsedSpec => {
        return isSwagger2(spec) ? parseSwagger2Spec(spec as Swagger2) : parseOpenApi3Spec(spec as OpenApi3);
    }
};
