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

const parseTopLevelXProperties = (spec: Swagger2Spec | OpenAPI3Spec): GenericProperty[] => {
    const xPropertiesArray: GenericProperty[] = [];
    _.forIn(spec, (value, key) => {
        if (utils.isXProperty(key)) {
            xPropertiesArray.push({key, value});
        }
    });
    return xPropertiesArray;
};

const parseTopLevelOptionalProperties = (spec: Swagger2Spec | OpenAPI3Spec): GenericProperty[] => {
    const optionalPropertiesArray: GenericProperty[] = [];
    if (spec.host) {
        optionalPropertiesArray.push({key: 'host', value: spec.host});
    }
    if (spec.basePath) {
        optionalPropertiesArray.push({key: 'basePath', value: spec.basePath});
    }
    return optionalPropertiesArray;
};

export default {
    parse: (spec: Swagger2Spec | OpenAPI3Spec): ParsedSpec => {
        const parsedSpec: ParsedSpec = {
            info: parseInfoObject(spec),
            openapi: parseOpenApiProperty(spec)
        };

        const topLevelProperties = _.concat(parseTopLevelXProperties(spec), parseTopLevelOptionalProperties(spec));

        for (const entry of topLevelProperties) {
            _.set(parsedSpec, entry.key, entry.value);
        }

        return parsedSpec;
    }
};
