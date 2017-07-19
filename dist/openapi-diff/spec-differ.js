"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepDiff = require("deep-diff");
const _ = require("lodash");
const utils_1 = require("./utils");
const processDiff = (rawDiff) => {
    const processedDiff = [];
    if (hasChanges(rawDiff)) {
        for (const entry of rawDiff) {
            const processedEntry = {
                index: getChangeNullableProperties(entry.index),
                item: getChangeNullableProperties(entry.item),
                kind: entry.kind,
                lhs: entry.lhs,
                path: entry.path,
                rhs: entry.rhs,
                taxonomy: findChangeTaxonomy(entry),
                type: findChangeType(entry)
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
const isInfoChange = (entry) => {
    return isEdit(entry) && isInfoObject(entry) && !utils_1.default.isXProperty(entry.path[1]);
};
const hasChanges = (rawDiff) => {
    return !_.isUndefined(rawDiff);
};
const findChangeTaxonomy = (change) => {
    return isInfoChange(change) ? 'info.object.edit' : 'zzz.unclassified.change';
};
const findChangeType = (change) => {
    return isInfoChange(change) ? 'non-breaking' : 'unclassified';
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
    diff: (oldSpec, newSpec) => {
        const rawDiff = deepDiff.diff(oldSpec, newSpec);
        const processedDiff = processDiff(rawDiff);
        const resultingDiff = sortProcessedDiff(processedDiff);
        return resultingDiff;
    }
};
