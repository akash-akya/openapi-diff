"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.default = {
    build: (result) => {
        const changeList = [];
        const summary = [];
        if (_.isEmpty(result.breakingChanges)) {
            summary.push('0 breaking changes found.');
        }
        summary.push(`${result.nonBreakingChanges.length} non-breaking changes found.`);
        for (const entry of result.nonBreakingChanges) {
            changeList.push(`Non-breaking: the path [${entry.printablePath.join('/')}] `
                + `was modified from \'${entry.lhs}\' to \'${entry.rhs}\'`);
        }
        summary.push(`${result.unclassifiedChanges.length} unclassified changes found.`);
        for (const entry of result.unclassifiedChanges) {
            changeList.push(`Unclassified: the path [${entry.printablePath.join('/')}] `
                + `was modified from \'${entry.lhs}\' to \'${entry.rhs}\'`);
        }
        const processedResult = {
            changeList,
            summary
        };
        return processedResult;
    }
};
