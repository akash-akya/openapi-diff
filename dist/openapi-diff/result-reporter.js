"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const processResult = (result) => {
    let processedResult;
    const changeList = [];
    const summary = [];
    if (_.isEmpty(result.breakingChanges)) {
        summary.push('0 breaking changes found.');
    }
    if (_.isEmpty(result.nonBreakingChanges)) {
        summary.push('0 non-breaking changes found.');
    }
    else {
        let nonBreakingChangeCount = 0;
        for (const entry of result.nonBreakingChanges) {
            nonBreakingChangeCount += 1;
            changeList.push(`Non-breaking: the path [${entry.path.join('/')}] `
                + `was modified from \'${entry.lhs}\' to \'${entry.rhs}\'`);
        }
        summary.push(`${nonBreakingChangeCount} non-breaking changes found.`);
    }
    if (_.isEmpty(result.unclassifiedChanges)) {
        summary.push('0 unclassified changes found.');
    }
    else {
        let unclassifiedChangeCount = 0;
        for (const entry of result.unclassifiedChanges) {
            unclassifiedChangeCount += 1;
            changeList.push(`Unclassified: the path [${entry.path.join('/')}] `
                + `was modified from \'${entry.lhs}\' to \'${entry.rhs}\'`);
        }
        summary.push(`${unclassifiedChangeCount} unclassified changes found.`);
    }
    processedResult = {
        changeList,
        summary
    };
    return processedResult;
};
exports.default = {
    print: (result) => {
        return processResult(result);
    }
};
