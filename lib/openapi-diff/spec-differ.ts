import * as deepDiff from 'deep-diff';
import * as _ from 'lodash';
import IDiff = deepDiff.IDiff;

import utils from './utils';

import {
    Diff,
    DiffChange, DiffChangeTaxonomy,
    DiffChangeType,
    OpenAPISpec,
    ResultDiff
} from './types';

const processDiff = (rawDiff: IDiff[]): DiffChange[] => {

    const processedDiff: DiffChange[] = [];

    if (hasChanges(rawDiff)) {
        for (const entry of rawDiff) {

            const processedEntry: DiffChange = {
                index: getChangeNullableProperties(entry.index),
                item: getChangeNullableProperties(entry.item),
                kind: entry.kind,
                lhs: entry.lhs,
                path: entry.path,
                rhs: entry.rhs,
                taxonomy: findChangeTaxonomy(entry),
                type: findChangeType(entry)
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

const findChangeTaxonomy = (change: IDiff): DiffChangeTaxonomy => {
    return isInfoChange(change) ? 'info.object.edit' : 'zzz.unclassified.change';
};

const findChangeType = (change: IDiff): DiffChangeType => {
    return isInfoChange(change) ? 'non-breaking' : 'unclassified';
};

const getChangeNullableProperties = (changeProperty: any): any => {
    return changeProperty || null;
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
