"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const parseInfoContactObject = (infoContactObject) => {
    return {
        email: {
            originalPath: ['info', 'contact', 'email'],
            value: infoContactObject ? infoContactObject.email : undefined
        },
        name: {
            originalPath: ['info', 'contact', 'name'],
            value: infoContactObject ? infoContactObject.name : undefined
        },
        url: {
            originalPath: ['info', 'contact', 'url'],
            value: infoContactObject ? infoContactObject.url : undefined
        }
    };
};
const parseInfoLicenseObject = (infoLicenseObject) => {
    return {
        name: {
            originalPath: ['info', 'license', 'name'],
            value: infoLicenseObject ? infoLicenseObject.name : undefined
        },
        url: {
            originalPath: ['info', 'license', 'url'],
            value: infoLicenseObject ? infoLicenseObject.url : undefined
        }
    };
};
const parseInfoObject = (spec) => {
    const parsedInfo = {
        contact: parseInfoContactObject(spec.info.contact),
        description: {
            originalPath: ['info', 'description'],
            value: spec.info.description
        },
        license: parseInfoLicenseObject(spec.info.license),
        termsOfService: {
            originalPath: ['info', 'termsOfService'],
            value: spec.info.termsOfService
        },
        title: {
            originalPath: ['info', 'title'],
            value: spec.info.title
        },
        version: {
            originalPath: ['info', 'version'],
            value: spec.info.version
        },
        xProperties: {}
    };
    for (const entry of getXPropertiesInObject(spec.info)) {
        _.set(parsedInfo.xProperties, entry.key, { originalPath: ['info', entry.key], value: entry.value });
    }
    return parsedInfo;
};
const isXProperty = (propertyPath) => {
    return propertyPath.startsWith('x-');
};
const getXPropertiesInObject = (object) => {
    const topLevelPropertiesArray = [];
    _.forIn(object, (value, key) => {
        if (isXProperty(key)) {
            topLevelPropertiesArray.push({ key, value });
        }
    });
    return topLevelPropertiesArray;
};
const parseTopLevelArrayProperties = (arrayName, inputArray) => {
    const parsedSchemesArray = [];
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
const parseSwagger2Spec = (swagger2Spec) => {
    const parsedSpec = {
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
    for (const entry of getXPropertiesInObject(swagger2Spec)) {
        _.set(parsedSpec.xProperties, entry.key, { originalPath: [entry.key], value: entry.value });
    }
    return parsedSpec;
};
const parseOpenApi3Spec = (openApi3Spec) => {
    const parsedSpec = {
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
    for (const entry of getXPropertiesInObject(openApi3Spec)) {
        _.set(parsedSpec.xProperties, entry.key, { originalPath: [entry.key], value: entry.value });
    }
    return parsedSpec;
};
const isSwagger2 = (spec) => {
    return !!spec.swagger;
};
exports.default = {
    parse: (spec) => {
        return isSwagger2(spec) ? parseSwagger2Spec(spec) : parseOpenApi3Spec(spec);
    }
};
