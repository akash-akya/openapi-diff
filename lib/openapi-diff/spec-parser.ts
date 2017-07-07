import * as _ from 'lodash';

import utils from './utils';

import {
    OpenAPISpec,
    ParsedSpec
} from './types';

const processInfoObject = (spec: OpenAPISpec, parsedSpec: ParsedSpec): void => {
    _.set(parsedSpec, 'info', spec.info);
};

const processTopLevelXProperties = (spec: OpenAPISpec, parsedSpec: ParsedSpec): void => {
    _.forIn(spec, (value, key) => {
        if (utils.isXProperty(key)) {
            _.set(parsedSpec, key, value);
        }
    });
};

const parseSpec = (spec: OpenAPISpec): ParsedSpec => {
    const parsedSpec: ParsedSpec = {
        info: null
    };
    processInfoObject(spec, parsedSpec);
    processTopLevelXProperties(spec, parsedSpec);
    return parsedSpec;
};

export default {
    parse: (spec: OpenAPISpec): ParsedSpec => {
        return parseSpec(spec);
    }
};
