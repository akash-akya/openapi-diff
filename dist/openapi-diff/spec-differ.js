"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepDiff = require("deep-diff");
const _ = require("lodash");
const utils_1 = require("./utils");
const processDiff = (parsedSpec, rawDiff) => {
    const processedDiff = [];
    if (rawDiff) {
        for (const entry of rawDiff) {
            const taxonomy = findChangeTaxonomy(entry);
            const processedEntry = {
                index: getChangeNullableProperties(entry.index),
                item: getChangeNullableProperties(entry.item),
                kind: entry.kind,
                lhs: entry.lhs,
                path: entry.path,
                printablePath: utils_1.default.findOriginalPath(parsedSpec, entry.path),
                rhs: entry.rhs,
                taxonomy,
                type: findChangeType(taxonomy)
            };
            processedDiff.push(processedEntry);
        }
    }
    return processedDiff;
};
const isEdit = (entry) => {
    return entry.kind === 'E';
};
const isInfoObject = (entry) => {
    return entry.path[0] === 'info';
};
const isOpenapiProperty = (entry) => {
    return entry.path[0] === 'openapi';
};
const isInfoChange = (entry) => {
    return isEdit(entry) && isInfoObject(entry) && !utils_1.default.isXProperty(entry.path[1]);
};
const isOpenapiChange = (entry) => {
    return isEdit(entry) && isOpenapiProperty(entry);
};
const findChangeTaxonomy = (change) => {
    if (isInfoChange(change)) {
        return 'info.object.edit';
    }
    else if (isOpenapiChange(change)) {
        return 'openapi.property.edit';
    }
    else {
        return 'unclassified.change';
    }
};
const findChangeType = (taxonomy) => {
    const isNonBreakingChange = taxonomy === 'info.object.edit' || taxonomy === 'openapi.property.edit';
    return isNonBreakingChange ? 'non-breaking' : 'unclassified';
};
const getChangeNullableProperties = (changeProperty) => {
    return changeProperty || null;
};
const sortProcessedDiff = (processedDiff) => {
    const results = {
        breakingChanges: _.filter(processedDiff, ['type', 'breaking']),
        nonBreakingChanges: _.filter(processedDiff, ['type', 'non-breaking']),
        unclassifiedChanges: _.filter(processedDiff, ['type', 'unclassified'])
    };
    return results;
};
exports.default = {
    diff: (oldParsedSpec, newParsedSpec) => {
        const rawDiff = deepDiff.diff(oldParsedSpec, newParsedSpec);
        const processedDiff = processDiff(oldParsedSpec, rawDiff);
        const resultingDiff = sortProcessedDiff(processedDiff);
        return resultingDiff;
    }
};
