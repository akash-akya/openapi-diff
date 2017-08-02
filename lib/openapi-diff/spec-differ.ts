import * as deepDiff from 'deep-diff';
import * as _ from 'lodash';

import utils from './utils';

import IDiff = deepDiff.IDiff;

import {
    ChangeTypeMapper,
    DiffChange,
    DiffChangeSeverity,
    DiffChangeTaxonomy,
    DiffChangeType,
    ParsedSpec
} from './types';

const processDiff = (parsedSpec: ParsedSpec, rawDiff: IDiff[] | undefined): DiffChange[] => {

    const processedDiff: DiffChange[] = [];

    if (rawDiff) {
        for (const entry of rawDiff) {

            const type = getChangeType(entry);
            const scope = getChangeScope(entry);
            const taxonomy = findChangeTaxonomy(type, scope);

            const processedEntry: DiffChange = {
                index: getChangeNullableProperties(entry.index),
                item: getChangeNullableProperties(entry.item),
                kind: entry.kind,
                lhs: getChangeDiffValue(entry, 'lhs'),
                path: entry.path,
                printablePath: utils.findOriginalPath(parsedSpec, entry.path),
                rhs: getChangeDiffValue(entry, 'rhs'),
                scope,
                severity: findChangeSeverity(taxonomy),
                taxonomy,
                type
            };

            processedDiff.push(processedEntry);
        }
    }

    return processedDiff;
};

const changeTypeMapper: ChangeTypeMapper = {
    A: (change: IDiff) => {
        return (change.item && change.item.kind) ? changeTypeMapper[`A.${change.item.kind}`](change) : 'unknown';
    },
    'A.D': () => 'arrayContent.delete',
    'A.N': () => 'arrayContent.add',
    D: () => 'delete',
    E: () => 'edit',
    N: () => 'add'
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
        'openapi',
        'schemes'
    ];
    return _.includes(topLevelPropertyNames, entry.path[0]);
};

const findChangeTaxonomy = (type: DiffChangeType, scope: string): DiffChangeTaxonomy => {
    return (scope === 'unclassified.change') ? scope as DiffChangeTaxonomy : `${scope}.${type}` as DiffChangeTaxonomy;
};

const findChangeSeverity = (taxonomy: DiffChangeTaxonomy): DiffChangeSeverity => {
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

const getChangeDiffValue = (change: IDiff, property: 'lhs' | 'rhs'): any => {
    if (_.isUndefined(change[property])) {
        if (_.isUndefined(change.item) || _.isUndefined(change.item[property])) {
            return null;
        } else {
            return change.item[property];
        }
    } else {
        return change[property];
    }
};

const getChangeNullableProperties = (changeProperty: any): any => {
    if (_.isUndefined(changeProperty)) {
        return null;
    } else {
        return changeProperty;
    }
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

const getChangeType = (change: IDiff): DiffChangeType => {
    return changeTypeMapper[change.kind](change) || 'unknown';
};

const getTopLevelProperty = (entry: IDiff): string => {
    return entry.path[0];
};

const BreakingChanges: DiffChangeTaxonomy[] = [
    'basePath.property.add',
    'basePath.property.delete',
    'basePath.property.edit',
    'host.property.add',
    'host.property.delete',
    'host.property.edit',
    'schemes.property.add',
    'schemes.property.arrayContent.delete',
    'schemes.property.delete',
    'schemes.property.edit'
];

const nonBreakingChanges: DiffChangeTaxonomy[] = [
    'info.object.edit',
    'openapi.property.edit',
    'schemes.property.arrayContent.add'
];

export default {
    diff: (oldParsedSpec: ParsedSpec,
           newParsedSpec: ParsedSpec): DiffChange[] => {
        const rawDiff: IDiff[] = deepDiff.diff(oldParsedSpec, newParsedSpec);
        const processedDiff: DiffChange[] = processDiff(oldParsedSpec, rawDiff);
        return processedDiff;
    }
};
