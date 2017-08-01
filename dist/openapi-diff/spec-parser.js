"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils_1 = require("./utils");
const parseInfoObject = (spec) => {
    return spec.info;
};
const parseOpenApiProperty = (spec) => {
    const parsedOpenApiProperty = {
        originalPath: spec.swagger ? ['swagger'] : ['openapi'],
        parsedValue: spec.swagger ? spec.swagger : spec.openapi
    };
    return parsedOpenApiProperty;
};
const parseTopLevelProperties = (spec) => {
    const topLevelPropertiesArray = [];
    _.forIn(spec, (value, key) => {
        if (utils_1.default.isXProperty(key) || utils_1.default.isOptionalProperty(key)) {
            topLevelPropertiesArray.push({ key, value });
        }
    });
    return topLevelPropertiesArray;
};
exports.default = {
    parse: (spec) => {
        const parsedSpec = {
            info: parseInfoObject(spec),
            openapi: parseOpenApiProperty(spec)
        };
        for (const entry of parseTopLevelProperties(spec)) {
            _.set(parsedSpec, entry.key, entry.value);
        }
        return parsedSpec;
    }
};
