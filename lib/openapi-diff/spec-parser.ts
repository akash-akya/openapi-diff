import * as _ from 'lodash';

import utils from './utils';

import {
    OpenAPISpec,
    ParsedInfoObject,
    ParsedSpec,
    XProperty
} from './types';

const parseInfoObject = (spec: OpenAPISpec): ParsedInfoObject => {
    return spec.info;
};

const parseTopLevelXProperties = (spec: OpenAPISpec): XProperty[] => {
    const xPropertiesArray: XProperty[] = [];
    _.forIn(spec, (value, key) => {
        if (utils.isXProperty(key)) {
            xPropertiesArray.push({key, value});
        }
    });
    return xPropertiesArray;
};

export default {
    parse: (spec: OpenAPISpec): ParsedSpec => {
        const parsedSpec: ParsedSpec = {
            info: parseInfoObject(spec)
        };
        for (const entry of parseTopLevelXProperties(spec)) {
            _.set(parsedSpec, entry.key, entry.value);
        }
        return parsedSpec;
    }
};
