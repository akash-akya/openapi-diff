import * as _ from 'lodash';
import {Diff, ResultObject} from './types';

export default {
    build: (result: Diff): ResultObject => {
        const changeList: string[] = [];
        const summary: string[] = [];

        if (_.isEmpty(result.breakingChanges)) {
            summary.push('0 breaking changes found.');
        }

        summary.push(`${result.nonBreakingChanges.length} non-breaking changes found.`);
        for (const entry of result.nonBreakingChanges) {
            changeList.push(`Non-breaking: the path [${entry.path.join('/')}] `
                            + `was modified from \'${entry.lhs}\' to \'${entry.rhs}\'`);
        }

        summary.push(`${result.unclassifiedChanges.length} unclassified changes found.`);
        for (const entry of result.unclassifiedChanges) {
            changeList.push(`Unclassified: the path [${entry.path.join('/')}] `
                            + `was modified from \'${entry.lhs}\' to \'${entry.rhs}\'`);
        }

        const processedResult: ResultObject = {
            changeList,
            summary
        };

        return processedResult;
    }
};
