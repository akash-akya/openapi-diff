import * as _ from 'lodash';

import utils from './utils';

import {
    GenericProperty,
    OpenAPI3Spec,
    ParsedInfoObject,
    ParsedOpenApiProperty,
    ParsedSpec,
    Swagger2Spec
} from './types';

const parseInfoObject = (spec: Swagger2Spec | OpenAPI3Spec): ParsedInfoObject => {
    return spec.info;
};

const parseOpenApiProperty = (spec: Swagger2Spec | OpenAPI3Spec): ParsedOpenApiProperty => {
    const parsedOpenApiProperty: ParsedOpenApiProperty = {
        originalPath: spec.swagger ? ['swagger'] : ['openapi'],
        parsedValue: spec.swagger ? spec.swagger  : spec.openapi
    };
    return parsedOpenApiProperty;
};

const parseTopLevelProperties = (spec: Swagger2Spec | OpenAPI3Spec): GenericProperty[] => {
    const topLevelPropertiesArray: GenericProperty[] = [];
    _.forIn(spec, (value, key) => {
        if (utils.isXProperty(key) || utils.isOptionalProperty(key)) {
            topLevelPropertiesArray.push({key, value});
        }
    });
    return topLevelPropertiesArray;
};

export default {
    parse: (spec: Swagger2Spec | OpenAPI3Spec): ParsedSpec => {
        const parsedSpec: ParsedSpec = {
            info: parseInfoObject(spec),
            openapi: parseOpenApiProperty(spec)
        };

        for (const entry of parseTopLevelProperties(spec)) {
            _.set(parsedSpec, entry.key, entry.value);
        }

        return parsedSpec;
    }
};
