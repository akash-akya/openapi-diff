"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils_1 = require("./utils");
const processInfoObject = (spec, parsedSpec) => {
    _.set(parsedSpec, 'info', spec.info);
};
const processTopLevelXProperties = (spec, parsedSpec) => {
    _.forIn(spec, (value, key) => {
        if (utils_1.default.isXProperty(key)) {
            _.set(parsedSpec, key, value);
        }
    });
};
const parseSpec = (spec) => {
    const parsedSpec = {
        info: null
    };
    processInfoObject(spec, parsedSpec);
    processTopLevelXProperties(spec, parsedSpec);
    return parsedSpec;
};
exports.default = {
    parse: (spec) => {
        return parseSpec(spec);
    }
};
