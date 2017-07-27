import * as deepDiff from 'deep-diff';
import * as _ from 'lodash';
import IDiff = deepDiff.IDiff;

import utils from './utils';

import {
    Diff,
    DiffChange,
    DiffChangeClass,
    DiffChangeTaxonomy,
    ParsedSpec,
    ResultDiff
} from './types';

const processDiff = (parsedSpec: ParsedSpec, rawDiff: IDiff[] | undefined): DiffChange[] => {

    const processedDiff: DiffChange[] = [];

    if (rawDiff) {
        for (const entry of rawDiff) {

            const taxonomy = findChangeTaxonomy(entry);

            const processedEntry: DiffChange = {
                changeClass: findChangeClass(taxonomy),
                index: getChangeNullableProperties(entry.index),
                item: getChangeNullableProperties(entry.item),
                kind: entry.kind,
                lhs: entry.lhs,
                path: entry.path,
                printablePath: utils.findOriginalPath(parsedSpec, entry.path),
                rhs: entry.rhs,
                taxonomy
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

const isOpenapiProperty = (entry: IDiff): boolean => {
    return entry.path[0] === 'openapi';
};

const isInfoChange = (entry: IDiff): boolean => {
    return isEdit(entry) && isInfoObject(entry) && !utils.isXProperty(entry.path[1]);
};

const isOpenapiChange = (entry: IDiff): boolean => {
    return isEdit(entry) && isOpenapiProperty(entry);
};

const findChangeTaxonomy = (change: IDiff): DiffChangeTaxonomy => {
    if (isInfoChange(change)) {
        return 'info.object.edit';
    } else if (isOpenapiChange (change)) {
        return 'openapi.property.edit';
    } else {
        return 'unclassified.change';
    }
};

const findChangeClass = (taxonomy: DiffChangeTaxonomy): DiffChangeClass => {
    const nonBreakingChanges: DiffChangeTaxonomy[] = [
        'info.object.edit',
        'openapi.property.edit'
    ];

    const isNonBreakingChange = _.includes(nonBreakingChanges, taxonomy);
    return isNonBreakingChange ? 'non-breaking' : 'unclassified';
};

const getChangeNullableProperties = (changeProperty: any): any => {
    return changeProperty || null;
};

const sortProcessedDiff = (processedDiff: DiffChange[]): ResultDiff => {
    const results: ResultDiff = {
        breakingChanges: _.filter(processedDiff, ['changeClass', 'breaking']),
        nonBreakingChanges: _.filter(processedDiff, ['changeClass', 'non-breaking']),
        unclassifiedChanges: _.filter(processedDiff, ['changeClass', 'unclassified'])
    };
    return results;
};

export default {
    diff: (oldParsedSpec: ParsedSpec,
           newParsedSpec: ParsedSpec): Diff => {
        const rawDiff: IDiff[] = deepDiff.diff(oldParsedSpec, newParsedSpec);
        const processedDiff: DiffChange[] = processDiff(oldParsedSpec, rawDiff);
        const resultingDiff = sortProcessedDiff(processedDiff);
        return resultingDiff;
    }
};
