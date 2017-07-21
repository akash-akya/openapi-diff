import * as _ from 'lodash';

import utils from './utils';

import {
    OpenAPI3Spec,
    ParsedInfoObject,
    ParsedSpec,
    Swagger2Spec,
    XProperty
} from './types';

const parseInfoObject = (spec: Swagger2Spec | OpenAPI3Spec): ParsedInfoObject => {
    return spec.info;
};

const parseOpenApiProperty = (spec: Swagger2Spec | OpenAPI3Spec): string => {
    return spec.swagger ? spec.swagger : spec.openapi;
};

const parseTopLevelXProperties = (spec: Swagger2Spec | OpenAPI3Spec): XProperty[] => {
    const xPropertiesArray: XProperty[] = [];
    _.forIn(spec, (value, key) => {
        if (utils.isXProperty(key)) {
            xPropertiesArray.push({key, value});
        }
    });
    return xPropertiesArray;
};

export default {
    parse: (spec: Swagger2Spec | OpenAPI3Spec): ParsedSpec => {
        const parsedSpec: ParsedSpec = {
            info: parseInfoObject(spec),
            openapi: parseOpenApiProperty(spec)
        };

        for (const entry of parseTopLevelXProperties(spec)) {
            _.set(parsedSpec, entry.key, entry.value);
        }

        return parsedSpec;
    }
};
