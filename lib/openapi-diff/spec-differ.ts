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
                index: null,
                item: null,
                kind: null,
                lhs: null,
                path: null,
                rhs: null,
                taxonomy: null,
                type: null
            };

            const isEdit = entry.kind === 'E';
            const isInfo = entry.path[0] === 'info';

            const isInfoChange = isEdit && isInfo && !utils.isXProperty(entry.path[1]);

            if (isInfoChange) {
                processedEntry.type = 'non-breaking';
                processedEntry.taxonomy = 'info.object.edit';
            } else {
                processedEntry.type = 'unclassified';
                processedEntry.taxonomy = 'zzz.unclassified.change';
            }

            processedEntry.kind = entry.kind;
            processedEntry.path = entry.path;
            processedEntry.lhs = entry.lhs;
            processedEntry.rhs = entry.rhs;

            if (entry.index !== null && entry.index !== undefined) {
                processedEntry.index = entry.index;
            }

            if (entry.item !== null && entry.item !== undefined) {
                processedEntry.item = entry.item;
            }

            processedDiff.push(processedEntry);
        }
    }

    return processedDiff;
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
