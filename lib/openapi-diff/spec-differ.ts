import * as deepDiff from 'deep-diff';
import * as _ from 'lodash';
import IDiff = deepDiff.IDiff;

import utils from './utils';

import {
    Diff,
    DiffChange,
    OpenAPISpec
} from './types';

const diffSpecs = (oldSpec: OpenAPISpec, newSpec: OpenAPISpec): Diff => {

    // TODO: this is a type
    let resultingDiff: {
        breakingChanges: DiffChange[],
        nonBreakingChanges: DiffChange[],
        unclassifiedChanges: DiffChange[]
    };

    resultingDiff = {
        breakingChanges: null,
        nonBreakingChanges: null,
        unclassifiedChanges: null
    };

    const rawDiff: IDiff[] = deepDiff.diff(oldSpec, newSpec);
    const processedDiff: DiffChange[] = processDiff(rawDiff);
    sortProcessedDiff(processedDiff, resultingDiff);

    return resultingDiff;
};

const processDiff = (rawDiff: IDiff[]): DiffChange[] => {

    const processedDiff: DiffChange[] = [];

    // TODO: why do I need this check?
    if (!_.isEmpty(rawDiff)) {
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

const sortProcessedDiff = (processedDiff: DiffChange[], resultingDiff: Diff): Diff => {
    resultingDiff.breakingChanges = _.filter(processedDiff, ['type', 'breaking']);
    resultingDiff.nonBreakingChanges = _.filter(processedDiff, ['type', 'non-breaking']);
    resultingDiff.unclassifiedChanges = _.filter(processedDiff, ['type', 'unclassified']);
    return resultingDiff;
};

export default {
    diff: diffSpecs
};
