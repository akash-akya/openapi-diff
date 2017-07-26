"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.default = {
    findOriginalPath: (parsedSpec, parsedPath) => {
        const parsedPathCopy = _.cloneDeep(parsedPath);
        if (_.last(parsedPathCopy) === 'parsedValue') {
            parsedPathCopy.pop();
        }
        const parsedPathString = parsedPathCopy.join('.');
        return _.has(parsedSpec, [parsedPathString, 'originalPath']) ?
            parsedSpec[parsedPathString].originalPath :
            parsedPath;
    },
    isXProperty: (propertyPath) => {
        return propertyPath.startsWith('x-');
    }
};
