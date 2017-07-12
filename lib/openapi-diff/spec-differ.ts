import * as deepDiff from 'deep-diff';
import * as _ from 'lodash';
import IDiff = deepDiff.IDiff;

import utils from './utils';

import {
    Diff,
    DiffChange,
    OpenAPISpec, ResultDiff
} from './types';

const processDiff = (rawDiff: IDiff[]): DiffChange[] => {

    const processedDiff: DiffChange[] = [];

    if (hasChanges(rawDiff)) {
        for (const entry of rawDiff) {

            const processedEntry: DiffChange = {
                index: entry.index || null,
                item: entry.item || null,
                kind: entry.kind,
                lhs: entry.lhs,
                path: entry.path,
                rhs: entry.rhs,
                taxonomy: isInfoChange(entry) ? 'info.object.edit' : 'zzz.unclassified.change',
                type: isInfoChange(entry) ? 'non-breaking' : 'unclassified'
            };

            processedDiff.push(processedEntry);
        }
    }

    return processedDiff;
};

const isEdit = (entry: IDiff): boolean => {
    return entry.kind === 'E';
};

const isInfoObject = (entry: IDiff): boolean => {
    return entry.path[0] === 'info';
};

const isInfoChange = (entry: IDiff): boolean => {
    return isEdit(entry) && isInfoObject(entry) && !utils.isXProperty(entry.path[1]);
};

const hasChanges = (rawDiff: IDiff[]): boolean => {
    return !_.isUndefined(rawDiff);
};

const sortProcessedDiff = (processedDiff: DiffChange[]): ResultDiff => {
    const results: ResultDiff = {
        breakingChanges: _.filter(processedDiff, ['type', 'breaking']),
        nonBreakingChanges: _.filter(processedDiff, ['type', 'non-breaking']),
        unclassifiedChanges: _.filter(processedDiff, ['type', 'unclassified'])
    };
    return results;
};

export default {
    diff: (oldSpec: OpenAPISpec, newSpec: OpenAPISpec): Diff => {
        const rawDiff: IDiff[] = deepDiff.diff(oldSpec, newSpec);
        const processedDiff: DiffChange[] = processDiff(rawDiff);
        const resultingDiff = sortProcessedDiff(processedDiff);
        return resultingDiff;
    }
};
