import * as _ from 'lodash';
import {Diff, ResultObject} from './types';

const processResult = (result: Diff): ResultObject => {
    let processedResult: {
        changeList: string[];
        summary: string[];
    };

    const changeList: string[] = [];
    const summary: string[] = [];

    if (_.isEmpty(result.breakingChanges)) {
        summary.push('0 breaking changes found.');
    }

    if (_.isEmpty(result.nonBreakingChanges)) {
        summary.push('0 non-breaking changes found.');
    } else {
        let nonBreakingChangeCount: number = 0;
        for (const entry of result.nonBreakingChanges) {
            nonBreakingChangeCount += 1;
            changeList.push(`Non-breaking: the path [${entry.path.join('/')}] `
                            + `was modified from \'${entry.lhs}\' to \'${entry.rhs}\'`);
        }
        summary.push(`${nonBreakingChangeCount} non-breaking changes found.`);
    }

    if (_.isEmpty(result.unclassifiedChanges)) {
        summary.push('0 unclassified changes found.');
    } else {
        let unclassifiedChangeCount: number = 0;
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

export default {
    print: (result: Diff): ResultObject => {
        return processResult(result);
    }
};
