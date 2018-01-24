import * as _ from 'lodash';
import {DiffEntry, DiffEntrySeverity, ResultObject} from './types';

const buildChangeSentence = (targetChange: DiffEntry): string => {
    const changeDescription: any = {
        'add': ((change: DiffEntry): string => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                   + `was added with value \'${change.newValue}\'`;
        }),
        'arrayContent.add': ((change: DiffEntry): string => {
            return `${_.capitalize(change.severity)}: the value \'${change.newValue}\' was added to the`
                    + ` array in the path [${change.printablePath.join('/')}]`;
        }),
        'arrayContent.delete': ((change: DiffEntry): string => {
            return `${_.capitalize(change.severity)}: the value \'${change.oldValue}\' was removed from the`
                   + ` array in the path [${change.printablePath.join('/')}]`;
        }),
        'delete': ((change: DiffEntry): string => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
                   + `with value \'${change.oldValue}\' was removed`;
        }),
        'edit': ((change: DiffEntry): string => {
            return `${_.capitalize(change.severity)}: the path [${change.printablePath.join('/')}] `
            + `was modified from \'${change.oldValue}\' to \'${change.newValue}\'`;
        })
    };

    return changeDescription[targetChange.type](targetChange);
};

const countSeverities = (changes: DiffEntry[], changeSeverity: DiffEntrySeverity): number => {
    const changeCount = _.filter(changes, ['severity', changeSeverity]).length;
    return changeCount;
};

export const resultReporter = {
    build: (results: DiffEntry[]): ResultObject => {
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
