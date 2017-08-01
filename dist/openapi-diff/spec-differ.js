"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepDiff = require("deep-diff");
const _ = require("lodash");
const utils_1 = require("./utils");
const processDiff = (parsedSpec, rawDiff) => {
    const processedDiff = [];
    if (rawDiff) {
        for (const entry of rawDiff) {
            const type = getChangeType(entry.kind);
            const scope = getChangeScope(entry);
            const taxonomy = findChangeTaxonomy(type, scope);
            const processedEntry = {
                index: getChangeNullableProperties(entry.index),
                item: getChangeNullableProperties(entry.item),
                kind: entry.kind,
                lhs: entry.lhs,
                path: entry.path,
                printablePath: utils_1.default.findOriginalPath(parsedSpec, entry.path),
                rhs: entry.rhs,
                scope,
                severity: findChangeSeverity(taxonomy),
                taxonomy,
                type
            };
            processedDiff.push(processedEntry);
        }
    }
    return processedDiff;
};
const isEdit = (entry) => {
    return entry.kind === 'E';
};
const isInfoChange = (entry) => {
    return isEdit(entry) && isInfoObject(entry) && !utils_1.default.isXProperty(entry.path[1]);
};
const isInfoObject = (entry) => {
    return entry.path[0] === 'info';
};
const isTopLevelProperty = (entry) => {
    const topLevelPropertyNames = [
        'basePath',
        'host',
        'openapi'
    ];
    return _.includes(topLevelPropertyNames, entry.path[0]);
};
const findChangeTaxonomy = (type, scope) => {
    return (scope === 'unclassified.change') ? scope : `${scope}.${type}`;
};
const findChangeSeverity = (taxonomy) => {
    const isBreakingChange = _.includes(BreakingChanges, taxonomy);
    const isNonBreakingChange = _.includes(nonBreakingChanges, taxonomy);
    if (isBreakingChange) {
        return 'breaking';
    }
    else if (isNonBreakingChange) {
        return 'non-breaking';
    }
    else {
        return 'unclassified';
    }
};
const getChangeNullableProperties = (changeProperty) => {
    return changeProperty || null;
};
const getChangeScope = (change) => {
    if (isInfoChange(change)) {
        return 'info.object';
    }
    else if (isTopLevelProperty(change)) {
        return `${getTopLevelProperty(change)}.property`;
    }
    else {
        return 'unclassified.change';
    }
};
const getChangeType = (changeKind) => {
    let resultingType;
    switch (changeKind) {
        case 'D': {
            resultingType = 'delete';
            break;
        }
        case 'E': {
            resultingType = 'edit';
            break;
        }
        case 'N': {
            resultingType = 'add';
            break;
        }
        default: {
            resultingType = 'unknown';
            break;
        }
    }
    return resultingType;
};
const getTopLevelProperty = (entry) => {
    return entry.path[0];
};
const BreakingChanges = [
    'host.property.add',
    'host.property.edit',
    'host.property.delete',
    'basePath.property.add',
    'basePath.property.edit',
    'basePath.property.delete'
];
const nonBreakingChanges = [
    'info.object.edit',
    'openapi.property.edit'
];
exports.default = {
    diff: (oldParsedSpec, newParsedSpec) => {
        const rawDiff = deepDiff.diff(oldParsedSpec, newParsedSpec);
        const processedDiff = processDiff(oldParsedSpec, rawDiff);
        return processedDiff;
    }
};
