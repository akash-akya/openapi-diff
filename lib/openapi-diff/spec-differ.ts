import * as deepDiff from 'deep-diff';
import * as _ from 'lodash';
import IDiff = deepDiff.IDiff;

import utils from './utils';

import {
    DiffChange,
    DiffChangeClass,
    DiffChangeTaxonomy,
    DiffChangeType,
    ParsedSpec
} from './types';

const processDiff = (parsedSpec: ParsedSpec, rawDiff: IDiff[] | undefined): DiffChange[] => {

    const processedDiff: DiffChange[] = [];

    if (rawDiff) {
        for (const entry of rawDiff) {

            const type = getChangeType(entry.kind);
            const scope = getChangeScope(entry);
            const taxonomy = findChangeTaxonomy(type, scope);

            const processedEntry: DiffChange = {
                changeClass: findChangeClass(taxonomy),
                index: getChangeNullableProperties(entry.index),
                item: getChangeNullableProperties(entry.item),
                kind: entry.kind,
                lhs: entry.lhs,
                path: entry.path,
                printablePath: utils.findOriginalPath(parsedSpec, entry.path),
                rhs: entry.rhs,
                scope,
                taxonomy,
                type
            };

            processedDiff.push(processedEntry);
        }
    }

    return processedDiff;
};

const isEdit = (entry: IDiff): boolean => {
    return entry.kind === 'E';
};

const isInfoChange = (entry: IDiff): boolean => {
    return isEdit(entry) && isInfoObject(entry) && !utils.isXProperty(entry.path[1]);
};

const isInfoObject = (entry: IDiff): boolean => {
    return entry.path[0] === 'info';
};

const isTopLevelProperty = (entry: IDiff): boolean => {
    const topLevelPropertyNames: string[] = [
        'basePath',
        'host',
        'openapi'
    ];
    return _.includes(topLevelPropertyNames, entry.path[0]);
};

const findChangeTaxonomy = (type: DiffChangeType, scope: string): DiffChangeTaxonomy => {
    return (scope === 'unclassified.change') ? scope as DiffChangeTaxonomy : `${scope}.${type}` as DiffChangeTaxonomy;
};

const findChangeClass = (taxonomy: DiffChangeTaxonomy): DiffChangeClass => {
    const BreakingChanges: DiffChangeTaxonomy[] = [
        'host.property.add',
        'host.property.edit',
        'host.property.delete',
        'basePath.property.add',
        'basePath.property.edit',
        'basePath.property.delete'
    ];

    const nonBreakingChanges: DiffChangeTaxonomy[] = [
        'info.object.edit',
        'openapi.property.edit'
    ];

    const isBreakingChange = _.includes(BreakingChanges, taxonomy);
    const isNonBreakingChange = _.includes(nonBreakingChanges, taxonomy);

    if (isBreakingChange) {
        return 'breaking';
    } else if (isNonBreakingChange) {
        return 'non-breaking';
    } else {
        return 'unclassified';
    }
};

const getChangeNullableProperties = (changeProperty: any): any => {
    return changeProperty || null;
};

const getChangeScope = (change: IDiff): string => {
    if (isInfoChange(change)) {
        return 'info.object';
    } else if (isTopLevelProperty(change)) {
        return `${getTopLevelProperty(change)}.property`;
    } else {
        return 'unclassified.change';
    }
};

const getChangeType = (changeKind: string): DiffChangeType => {
    let resultingType: DiffChangeType;
    switch (changeKind) {
        case 'D': {
            resultingType = 'delete';
            break;
        }
        case 'E': {
            resultingType = 'edit';
            break;
        }
        case 'N': {
            resultingType = 'add';
            break;
        }
        default: {
            resultingType = 'unknown';
            break;
        }
    }
    return resultingType;
};

const getTopLevelProperty = (entry: IDiff): string => {
    return entry.path[0];
};

export default {
    diff: (oldParsedSpec: ParsedSpec,
           newParsedSpec: ParsedSpec): DiffChange[] => {
        const rawDiff: IDiff[] = deepDiff.diff(oldParsedSpec, newParsedSpec);
        const processedDiff: DiffChange[] = processDiff(oldParsedSpec, rawDiff);
        return processedDiff;
    }
};
