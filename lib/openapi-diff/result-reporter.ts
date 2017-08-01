import * as _ from 'lodash';
import * as VError from 'verror';

import {
    DiffChange,
    DiffChangeSeverity,
    ResultObject
} from './types';

// tslint:disable:cyclomatic-complexity
const buildChangeSentence = (change: DiffChange): string => {
    let changeSentence: string;
    switch (change.type) {
        case 'add': {
            changeSentence = `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                             + `was added with value \'${change.rhs}\'`;
            break;
        }
        case 'arrayContent.add': {
            changeSentence = `${_.capitalize(change.severity)}: the value \'${change.rhs}\' was added to the`
            + ` array in the path [${change.printablePath.join('/')}]`;
            break;
        }
        case 'arrayContent.delete': {
            changeSentence = `${_.capitalize(change.severity)}: the value \'${change.lhs}\' was removed from the`
                             + ` array in the path [${change.printablePath.join('/')}]`;
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

// tslint:enable:cyclomatic-complexity

const countSeverities = (changes: DiffChange[], changeSeverity: DiffChangeSeverity): number => {
    const changeCount = _.filter(changes, ['severity', changeSeverity]).length;
    return changeCount;
};

export default {
    build: (results: DiffChange[]): ResultObject => {
        const numberOfBreakingChanges = countSeverities(results, 'breaking');

        const changeList: string[] = [];
        const hasBreakingChanges: boolean = !!numberOfBreakingChanges;
        const summary: string[] = [];

        summary.push(`${numberOfBreakingChanges} breaking changes found.`);
        summary.push(`${countSeverities(results, 'non-breaking')} non-breaking changes found.`);
        summary.push(`${countSeverities(results, 'unclassified')} unclassified changes found.`);

        for (const entry of results) {
            changeList.push(buildChangeSentence(entry));
        }

        const processedResult: ResultObject = {
            changeList: _.sortBy(changeList),
            hasBreakingChanges,
            summary
        };

        return processedResult;
    }
};
