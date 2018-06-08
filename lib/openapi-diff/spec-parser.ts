import * as _ from 'lodash';
// tslint:disable:no-implicit-dependencies
import {
    GenericProperty, OpenApi3,
    ParsedProperty,
    ParsedSpec,
    Swagger2
} from './types';

const isXProperty = (propertyPath: string): boolean => {
    return propertyPath.startsWith('x-');
};

const getXPropertiesInObject = (object: any): GenericProperty[] => {
    const topLevelPropertiesArray: GenericProperty[] = [];

    _.forIn(object, (value, key) => {
        if (isXProperty(key)) {
            topLevelPropertiesArray.push({key, value});
        }
    });

    return topLevelPropertiesArray;
};

const parseTopLevelArrayProperties = (arrayName: string,
                                      inputArray: string[]): Array<ParsedProperty<string>> => {
    const parsedSchemesArray: Array<ParsedProperty<string>> = [];

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
        format: 'swagger2',
        schemes: {
            originalPath: ['schemes'],
            value: swagger2Spec.schemes ? parseTopLevelArrayProperties('schemes', swagger2Spec.schemes) : undefined
        },
        xProperties: {}
    };

    for (const entry of getXPropertiesInObject(swagger2Spec)) {
        _.set(parsedSpec.xProperties, entry.key, {originalPath: [entry.key], value: entry.value});
    }

    return parsedSpec;
};

const parseOpenApi3Spec = (openApi3Spec: OpenApi3): ParsedSpec => {
    const parsedSpec: ParsedSpec = {
        basePath: {
            originalPath: ['basePath'],
            value: undefined
        },
        format: 'openapi3',
        schemes: {
            originalPath: ['schemes'],
            value: undefined
        },
        xProperties: {}
    };

    for (const entry of getXPropertiesInObject(openApi3Spec)) {
        _.set(parsedSpec.xProperties, entry.key, {originalPath: [entry.key], value: entry.value});
    }

    return parsedSpec;
};

const isSwagger2 = (spec: Swagger2 | OpenApi3): boolean => {
    return !!(spec as Swagger2).swagger;
};

export const specParser = {
    parse: (spec: Swagger2 | OpenApi3): ParsedSpec => {
        return isSwagger2(spec)
            ? parseSwagger2Spec(spec as Swagger2)
            : parseOpenApi3Spec(spec as OpenApi3);
    }
};
