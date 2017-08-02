import * as _ from 'lodash';

import {
    DiffChange,
    DiffChangeSeverity,
    ResultObject
} from './types';

const buildChangeSentence = (targetChange: DiffChange): string => {
    const changeDescription: any = {
        add: ((change: DiffChange): string => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                   + `was added with value \'${change.rhs}\'`;
        }),
        'arrayContent.add': ((change: DiffChange): string => {
            return `${_.capitalize(change.severity)}: the value \'${change.rhs}\' was added to the`
                    + ` array in the path [${change.printablePath.join('/')}]`;
        }),
        'arrayContent.delete': ((change: DiffChange): string => {
            return `${_.capitalize(change.severity)}: the value \'${change.lhs}\' was removed from the`
                   + ` array in the path [${change.printablePath.join('/')}]`;
        }),
        delete: ((change: DiffChange): string => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                   + `with value \'${change.lhs}\' was removed`;
        }),
        edit: ((change: DiffChange): string => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
            + `was modified from \'${change.lhs}\' to \'${change.rhs}\'`;
        })
    };

    return changeDescription[targetChange.type](targetChange);
};

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
