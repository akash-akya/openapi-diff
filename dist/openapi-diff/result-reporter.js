"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const VError = require("verror");
const buildChangeSentence = (change) => {
    let changeSentence;
    switch (change.type) {
        case 'add': {
            changeSentence = `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                + `was added with value \'${change.rhs}\'`;
            break;
        }
        case 'delete': {
            changeSentence = `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                + `with value \'${change.lhs}\' was removed`;
            break;
        }
        case 'edit': {
            changeSentence = `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                + `was modified from \'${change.lhs}\' to \'${change.rhs}\'`;
            break;
        }
        default: {
            throw new VError(`ERROR: unable to handle ${change.type} as a change type`);
        }
    }
    return changeSentence;
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
