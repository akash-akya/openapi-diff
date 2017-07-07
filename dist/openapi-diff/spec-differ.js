"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepDiff = require("deep-diff");
const _ = require("lodash");
const utils_1 = require("./utils");
const diffSpecs = (oldSpec, newSpec) => {
    let resultingDiff;
    resultingDiff = {
        breakingChanges: null,
        nonBreakingChanges: null,
        unclassifiedChanges: null
    };
    const rawDiff = deepDiff.diff(oldSpec, newSpec);
    const processedDiff = processDiff(rawDiff);
    sortProcessedDiff(processedDiff, resultingDiff);
    return resultingDiff;
};
const processDiff = (rawDiff) => {
    const processedDiff = [];
    if (!(_.isEmpty(rawDiff))) {
        for (const entry of rawDiff) {
            const processedEntry = {
                index: null,
                item: null,
                kind: null,
                lhs: null,
                path: null,
                rhs: null,
                taxonomy: null,
                type: null
            };
            if (entry.kind === 'E' && entry.path[0] === 'info' && !utils_1.default.isXProperty(entry.path[1])) {
                processedEntry.type = 'non-breaking';
                processedEntry.taxonomy = 'info.object.edit';
            }
            else {
                processedEntry.type = 'unclassified';
                processedEntry.taxonomy = 'zzz.unclassified.change';
            }
            processedEntry.kind = entry.kind;
            processedEntry.path = entry.path;
            processedEntry.lhs = entry.lhs;
            processedEntry.rhs = entry.rhs;
            if (entry.index !== null && entry.index !== undefined) {
                processedEntry.index = entry.index;
            }
            if (entry.item !== null && entry.item !== undefined) {
                processedEntry.item = entry.item;
            }
            processedDiff.push(processedEntry);
        }
    }
    return processedDiff;
};
const sortProcessedDiff = (processedDiff, resultingDiff) => {
    resultingDiff.breakingChanges = _.filter(processedDiff, ['type', 'breaking']);
    resultingDiff.nonBreakingChanges = _.filter(processedDiff, ['type', 'non-breaking']);
    resultingDiff.unclassifiedChanges = _.filter(processedDiff, ['type', 'unclassified']);
    return resultingDiff;
};
exports.default = {
    diff: (oldSpec, newSpec) => {
        return diffSpecs(oldSpec, newSpec);
    }
};
