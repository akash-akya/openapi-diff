import * as _ from 'lodash';
import * as VError from 'verror';

import {
    DiffChange,
    DiffChangeClass,
    ResultObject
} from './types';

const buildChangeSentence = (change: DiffChange): string => {
    let changeSentence: string;
    switch (change.type) {
        case 'add': {
            changeSentence = `${_.capitalize(change.changeClass)}: the path [${change.printablePath.join('/')}] `
                             + `was added with value \'${change.rhs}\'`;
            break;
        }
        case 'delete': {
            changeSentence = `${_.capitalize(change.changeClass)}: the path [${change.printablePath.join('/')}] `
                             + `with value \'${change.lhs}\' was removed`;
            break;
        }
        case 'edit': {
            changeSentence = `${_.capitalize(change.changeClass)}: the path [${change.printablePath.join('/')}] `
                              + `was modified from \'${change.lhs}\' to \'${change.rhs}\'`;
            break;
        }
        default: {
            throw new VError(`ERROR: unable to handle ${change.type} as a change type`);
        }
    }
    return changeSentence;
};

const countChangesOfClass = (changes: DiffChange[], changeClass: DiffChangeClass): number => {
    let changeCount: number = 0;
    for (const entry of changes) {
        if (entry.changeClass === changeClass) {
            changeCount += 1;
        }
    }
    return changeCount;
};

export default {
    build: (results: DiffChange[]): ResultObject => {
        const changeList: string[] = [];
        const summary: string[] = [];

        summary.push(`${countChangesOfClass(results, 'breaking')} breaking changes found.`);
        summary.push(`${countChangesOfClass(results, 'non-breaking')} non-breaking changes found.`);
        summary.push(`${countChangesOfClass(results, 'unclassified')} unclassified changes found.`);

        for (const entry of results) {
            changeList.push(buildChangeSentence(entry));
        }

        const processedResult: ResultObject = {
            changeList: _.sortBy(changeList),
            summary
        };

        return processedResult;
    }
};
