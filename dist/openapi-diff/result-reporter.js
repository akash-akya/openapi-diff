"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const buildChangeSentence = (targetChange) => {
    const changeDescription = {
        add: ((change) => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                + `was added with value \'${change.newValue}\'`;
        }),
        'arrayContent.add': ((change) => {
            return `${_.capitalize(change.severity)}: the value \'${change.newValue}\' was added to the`
                + ` array in the path [${change.printablePath.join('/')}]`;
        }),
        'arrayContent.delete': ((change) => {
            return `${_.capitalize(change.severity)}: the value \'${change.oldValue}\' was removed from the`
                + ` array in the path [${change.printablePath.join('/')}]`;
        }),
        delete: ((change) => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                + `with value \'${change.oldValue}\' was removed`;
        }),
        edit: ((change) => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                + `was modified from \'${change.oldValue}\' to \'${change.newValue}\'`;
        })
    };
    return changeDescription[targetChange.type](targetChange);
};
const countSeverities = (changes, changeSeverity) => {
    const changeCount = _.filter(changes, ['severity', changeSeverity]).length;
    return changeCount;
};
exports.default = {
    build: (results) => {
        const numberOfBreakingChanges = countSeverities(results, 'breaking');
        const changeList = [];
        const hasBreakingChanges = !!numberOfBreakingChanges;
        const summary = [];
        summary.push(`${numberOfBreakingChanges} breaking changes found.`);
        summary.push(`${countSeverities(results, 'non-breaking')} non-breaking changes found.`);
        summary.push(`${countSeverities(results, 'unclassified')} unclassified changes found.`);
        for (const entry of results) {
            changeList.push(buildChangeSentence(entry));
        }
        const processedResult = {
            changeList: _.sortBy(changeList),
            hasBreakingChanges,
            summary
        };
        return processedResult;
    }
};
