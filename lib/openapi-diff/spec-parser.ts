import * as _ from 'lodash';

import utils from './utils';

import { OpenAPIObject } from 'openapi3-ts';
import { Spec } from 'swagger-schema-official';

import {
    GenericProperty,
    ParsedInfoObject,
    ParsedOpenApiProperty,
    ParsedSpec
} from './types';

const parseInfoObject = (spec: Spec | OpenAPIObject): ParsedInfoObject => {
    return spec.info;
};

const parseOpenApiProperty = (spec: Spec | OpenAPIObject): ParsedOpenApiProperty => {
    let originalPath: string[];
    let parsedValue: string;

    if (_.has(spec, 'swagger')) {
        originalPath = ['swagger'];
        parsedValue = (spec as Spec).swagger;
    } else {
        originalPath = ['openapi'];
        parsedValue = (spec as OpenAPIObject).openapi;
    }

    return {originalPath, parsedValue};
};

const parseTopLevelProperties = (spec: Spec | OpenAPIObject): GenericProperty[] => {
    const topLevelPropertiesArray: GenericProperty[] = [];
    _.forIn(spec, (value, key) => {
        if (utils.isXProperty(key) || utils.isOptionalProperty(key)) {
            topLevelPropertiesArray.push({key, value});
        }
    });
    return topLevelPropertiesArray;
};

const sortSpecArrays = (spec: Spec | OpenAPIObject): Spec | OpenAPIObject => {
    if (_.has(spec, 'schemes')) {
        (spec as Spec).schemes = _.sortBy((spec as Spec).schemes);
    }

    return spec;
};

export default {
    parse: (spec: Spec | OpenAPIObject): ParsedSpec => {
        const sortedSpec = sortSpecArrays(spec);

        const parsedSpec: ParsedSpec = {
            info: parseInfoObject(sortedSpec),
            openapi: parseOpenApiProperty(sortedSpec)
        };

        for (const entry of parseTopLevelProperties(sortedSpec)) {
            _.set(parsedSpec, entry.key, entry.value);
        }

        return parsedSpec;
    }
};
